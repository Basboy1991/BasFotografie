import test from 'node:test';
import assert from 'node:assert/strict';
import {startProbe,validProbe,finishProbe} from '../lib/storage-probe.mjs';
import {probePngBase64} from '../lib/storage-probe-shared.mjs';
const secret='isolated-storage-test-secret-000000000',now=1793450000000;
const bytes=Buffer.from(probePngBase64,'base64');
function bucket(content=bytes){
 const calls=[];
 return {calls,
  async head(key){calls.push(['head',key]);return {size:content.length,httpMetadata:{contentType:'image/png'},url:'https://test.private.blob.vercel-storage.com/photos/'+key};},
  async get(key){calls.push(['get',key]);return {body:new ReadableStream({start(controller){controller.enqueue(content);controller.close();}})};},
  async delete(key){calls.push(['delete',key]);},
 };
}
test('storage probe rejects tampered, expired and arbitrary keys before touching storage',async()=>{
 const probe=startProbe(secret,now),storage=bucket();
 assert.equal(validProbe(probe,secret,now),true);
 for(const value of [{...probe,key:'customer-photo.jpg'},{...probe,expires:probe.expires+1},{...probe,proof:'0'.repeat(64)},null]){
  await assert.rejects(finishProbe(value,secret,storage,()=>{throw Error('must not fetch');},now),/probe_not_authorized/);
 }
 await assert.rejects(finishProbe(probe,secret,storage,fetch,now+600001),/probe_not_authorized/);
 assert.deepEqual(storage.calls,[]);
});
test('storage probe verifies exact readback and anonymous denial then deletes only its signed fixture',async()=>{
 const probe=startProbe(secret,now),storage=bucket(),calls=[];
 const result=await finishProbe(probe,secret,storage,async(url,options)=>{calls.push({url,options});return new Response(null,{status:403});},now);
 assert.deepEqual(result,{ok:true,code:'ok'});
 assert.deepEqual(storage.calls,[['head',probe.key],['get',probe.key],['delete',probe.key]]);
 assert.equal(calls[0].options.headers,undefined);
 assert.equal(calls[0].options.redirect,'error');
 assert.equal(calls[0].options.cache,'no-store');
});
test('storage probe never deletes a different file and reports privacy or cleanup failures honestly',async()=>{
 const probe=startProbe(secret,now),changed=Buffer.from(bytes);changed[changed.length-1]^=1;
 const different=bucket(changed);
 assert.deepEqual(await finishProbe(probe,secret,different,()=>{throw Error('must not fetch');},now),{ok:false,code:'different_file'});
 assert.equal(different.calls.some(x=>x[0]==='delete'),false);
 const publicFile=bucket();
 assert.deepEqual(await finishProbe(probe,secret,publicFile,async()=>new Response('public'),now),{ok:false,code:'privacy_unverified'});
 assert.equal(publicFile.calls.at(-1)[0],'delete');
 const cleanup=bucket();cleanup.delete=async()=>{throw Error('provider body');};
 assert.deepEqual(await finishProbe(probe,secret,cleanup,async()=>new Response(null,{status:404}),now),{ok:false,code:'cleanup_failed'});
});
