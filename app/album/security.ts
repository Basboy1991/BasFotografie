import {cookies} from 'next/headers';

const hex=(data:Uint8Array)=>Array.from(data,b=>b.toString(16).padStart(2,'0')).join('');
const bytes=(n:number)=>crypto.getRandomValues(new Uint8Array(n));

export function newAlbumToken(){return hex(bytes(32));}
export function newAlbumPassword(){
  // 20 characters from a 32-character alphabet: 100 bits of randomness.
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(bytes(20),n=>alphabet[n&31]).join('');
}
export async function tokenHash(token:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))));}
export async function hashAlbumPassword(password:string){
  const salt=bytes(16);
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const derived=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:160000,hash:'SHA-256'},key,256);
  return `${hex(salt)}:${hex(new Uint8Array(derived))}`;
}
function equal(a:string,b:string){if(a.length!==b.length)return false;let difference=0;for(let i=0;i<a.length;i++)difference|=a.charCodeAt(i)^b.charCodeAt(i);return difference===0;}
export async function verifyAlbumPassword(password:string,stored:string){
  if(!/^[a-f0-9]{32}:[a-f0-9]{64}$/.test(stored))return false;
  const [salt,expected]=stored.split(':');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const result=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new Uint8Array(salt.match(/../g)!.map(x=>parseInt(x,16))),iterations:160000,hash:'SHA-256'},key,256);
  return equal(hex(new Uint8Array(result)),expected);
}
export function albumCookieName(id:string){return `bf_album_${id}`;}
async function sessionSignature(id:string,tokenHashValue:string,passwordHash:string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(passwordHash),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return hex(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${id}:${tokenHashValue}`))));
}
export async function grantAlbumSession(id:string,tokenHashValue:string,passwordHash:string){
  (await cookies()).set(albumCookieName(id),await sessionSignature(id,tokenHashValue,passwordHash),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:60*60*12});
}
export async function hasAlbumSession(id:string,tokenHashValue:string,passwordHash:string|null){
  if(!passwordHash)return false;
  const cookie=(await cookies()).get(albumCookieName(id))?.value;
  return !!cookie&&equal(cookie,await sessionSignature(id,tokenHashValue,passwordHash));
}
export async function validAlbumToken(token:string|null|undefined,expectedHash:string){return !!token&&/^[a-f0-9]{64}$/.test(token)&&equal(await tokenHash(token),expectedHash);}
