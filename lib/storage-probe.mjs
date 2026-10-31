import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import {probePngBase64} from './storage-probe-shared.mjs';
const fixture=Buffer.from(probePngBase64,'base64');
const ttl=10*60*1000;
const signature=(key,expires,secret)=>createHmac('sha256',secret).update(`storage-check\n${key}\n${expires}`).digest('hex');
export function startProbe(secret,now=Date.now()){
 if(typeof secret!=='string'||secret.length<32)throw new Error('probe_configuration_missing');
 const key=randomUUID()+'.png',expires=now+ttl;
 return {key,expires,proof:signature(key,expires,secret)};
}
export function validProbe(value,secret,now=Date.now()){
 if(!value||typeof value!=='object'||typeof secret!=='string'||secret.length<32)return false;
 const {key,expires,proof}=value;
 if(typeof key!=='string'||!/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.png$/.test(key)||!Number.isSafeInteger(expires)||expires<now||expires>now+ttl||typeof proof!=='string'||!/^[a-f0-9]{64}$/.test(proof))return false;
 return timingSafeEqual(Buffer.from(proof,'hex'),Buffer.from(signature(key,expires,secret),'hex'));
}
export async function finishProbe(value,secret,bucket,transport=fetch,now=Date.now()){
 if(!validProbe(value,secret,now))throw new Error('probe_not_authorized');
 const head=await bucket.head(value.key);
 if(!head)return {ok:false,code:'not_found'};
 if(head.size!==fixture.length||head.httpMetadata.contentType!=='image/png')return {ok:false,code:'different_file'};
 const file=await bucket.get(value.key);
 if(!file)return {ok:false,code:'not_found'};
 const reader=file.body.getReader(),chunks=[];let size=0;
 try{while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.length;if(size>fixture.length)return {ok:false,code:'different_file'};chunks.push(Buffer.from(chunk.value));}}
 finally{await reader.cancel();}
 if(!Buffer.concat(chunks).equals(fixture))return {ok:false,code:'different_file'};
 let result={ok:false,code:'privacy_unverified'};
 try{
  const url=new URL(head.url);
  if(url.protocol==='https:'&&url.hostname.endsWith('.private.blob.vercel-storage.com')){
   const anonymous=await transport(url.toString(),{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(8000)});
   if([401,403,404].includes(anonymous.status))result={ok:true,code:'ok'};
  }
 }catch{ /* No provider response or storage location is exposed. */ }
 try{await bucket.delete(value.key);}catch{return {ok:false,code:'cleanup_failed'};}
 return result;
}
