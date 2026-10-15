import test from 'node:test';
import assert from 'node:assert/strict';
import {emailConfiguration,sendConfiguredEmail,deliverAppointmentEmails} from '../lib/email.mjs';
const env={RESEND_API_KEY:'test-only-key',CONTACT_EMAIL_FROM:'Bas Fotografie <bas@example.invalid>',CONTACT_EMAIL_TO:'owner@example.invalid',VERCEL_ENV:'production'};
const request={id:'test-request',email:'client@example.invalid'};
const template={subject:'Test',html:'<p>Test</p>',text:'Test'};
test('email config requires valid sender, recipient and key',()=>{
 assert.equal(emailConfiguration(env).ready,true);
 assert.equal(emailConfiguration({...env,RESEND_API_KEY:''}).ready,false);
 assert.equal(emailConfiguration({...env,CONTACT_EMAIL_FROM:'bas@gmail.com\r\nBcc: other@example.invalid'}).ready,false);
 assert.equal(emailConfiguration({...env,CONTACT_EMAIL_TO:'invalid'}).ready,false);
});
test('preview requests never send mail and missing config makes no external request',async()=>{
 const never=()=>{throw new Error('network should not be called');};
 assert.equal((await deliverAppointmentEmails(request,{client:template,owner:template},{...env,VERCEL_ENV:'preview'},never)).status,'preview_skipped');
 assert.equal((await deliverAppointmentEmails(request,{client:template,owner:template},{},never)).status,'not_configured');
});
test('both mails use configured sender, fixed reply address and different idempotency keys',async()=>{
 const calls=[];const transport=async(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return Response.json({id:'provider-test-id'});};
 const result=await deliverAppointmentEmails(request,{client:template,owner:template},env,transport);
 assert.equal(result.status,'sent');assert.equal(calls.length,2);
 assert.deepEqual(calls.map(x=>x.body.to),[['client@example.invalid'],['owner@example.invalid']]);
 assert.equal(calls[0].body.reply_to,'basvanderscheer@gmail.com');
 assert.equal(calls[0].options.headers['Idempotency-Key'],'appointment/test-request/client');
 assert.equal(calls[1].options.headers['Idempotency-Key'],'appointment/test-request/owner');
 assert.equal(calls[0].url,'https://api.resend.com/emails');
});
test('one provider failure does not prevent the other notification and never leaks the response',async()=>{
 let count=0;const result=await deliverAppointmentEmails(request,{client:template,owner:template},env,async()=>++count===1?new Response('sensitive provider body',{status:403}):Response.json({id:'provider-test-id'}));
 assert.equal(count,2);assert.equal(result.status,'failed');assert.deepEqual(result.results,[{channel:'client',status:'failed',reason:'email_provider_403'},{channel:'owner',status:'sent'}]);
 await assert.rejects(sendConfiguredEmail({to:'client@example.invalid',...template,subject:'Bad\nsubject',reference:'test'},env),/email_input_invalid/);
});
