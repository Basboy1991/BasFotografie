/** Server-only Resend transport using the existing Vercel configuration. */
export function emailConfiguration(env=process.env){
 const apiKey=env.RESEND_API_KEY?.trim(),from=env.CONTACT_EMAIL_FROM?.trim(),to=env.CONTACT_EMAIL_TO?.trim();
 const address=/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
 const sender=from?.match(/<([^<>]+)>$/)?.[1]||from;
 return {ready:!!apiKey&&!!sender&&address.test(sender)&&!!to&&address.test(to)&&!/[\r\n]/.test(from||''),from:from||'',to:to||'',preview:env.VERCEL_ENV==='preview'};
}
export async function sendConfiguredEmail({to,subject,html,text,reference},env=process.env,transport=fetch){
 const config=emailConfiguration(env);
 if(!config.ready)throw new Error('email_configuration_missing');
 if(!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(to)||/[\r\n]/.test(subject)||!reference)throw new Error('email_input_invalid');
 const response=await transport('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY.trim()}`,'Content-Type':'application/json','Idempotency-Key':reference},body:JSON.stringify({from:config.from,to:[to],reply_to:'basvanderscheer@gmail.com',subject,html,text}),signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw new Error(`email_provider_${response.status}`);
 const data=await response.json();if(typeof data.id!=='string')throw new Error('email_provider_invalid_response');return data.id;
}
export async function deliverAppointmentEmails(request,templates,env=process.env,transport=fetch){
 const config=emailConfiguration(env);
 if(config.preview)return {status:'preview_skipped'};
 if(!config.ready)return {status:'not_configured'};
 const results=[];
 for(const [channel,to,template] of [['client',request.email,templates.client],['owner',config.to,templates.owner]]){
  try{await sendConfiguredEmail({to,...template,reference:`appointment/${request.id}/${channel}`},env,transport);results.push({channel,status:'sent'});}
  catch(error){results.push({channel,status:'failed',reason:error instanceof Error&&/^email_provider_\d+$/.test(error.message)?error.message:'email_send_failed'});}
 }
 return {status:results.every(x=>x.status==='sent')?'sent':'failed',results};
}
