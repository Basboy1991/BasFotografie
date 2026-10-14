import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transpileModule,ModuleKind} from 'typescript';

// Only the framework cookie boundary is replaced; all album cryptography is real.
const jar=new Map();
globalThis.__bfAlbumTestCookies={get:name=>jar.get(name),set:(name,value,options)=>jar.set(name,{value,options})};
const cookieModule='data:text/javascript,'+encodeURIComponent('export async function cookies(){return globalThis.__bfAlbumTestCookies}');
async function loadTs(path,replacements={}){
 let source=await readFile(new URL(path,import.meta.url),'utf8');
 for(const [from,to] of Object.entries(replacements))source=source.replaceAll(`from '${from}'`,`from '${to}'`);
 const code=transpileModule(source,{compilerOptions:{module:ModuleKind.ESNext,target:99}}).outputText;
 return import('data:text/javascript,'+encodeURIComponent(code));
}
const security=await loadTs('../app/album/security.ts',{'next/headers':cookieModule});
const {createZip}=await loadTs('../app/album/zip.ts');

test('customer access requires the correct token and password and rejects malformed values',async()=>{
 const token=security.newAlbumToken(),hash=await security.tokenHash(token),password=security.newAlbumPassword();
 assert.match(token,/^[a-f0-9]{64}$/);assert.equal(password.length,20);
 const passwordHash=await security.hashAlbumPassword(password);
 assert.equal(await security.verifyAlbumPassword(password,passwordHash),true);
 assert.equal(await security.verifyAlbumPassword('incorrect',passwordHash),false);
 assert.equal(await security.verifyAlbumPassword(password,'malformed'),false);
 assert.equal(await security.validAlbumToken(token,hash),true);
 assert.equal(await security.validAlbumToken(security.newAlbumToken(),hash),false);
 assert.equal(await security.validAlbumToken(null,hash),false);
 assert.equal(await security.validAlbumToken('../secret',hash),false);
});

test('album sessions are secure, scoped to the album and invalidated by credential rotation',async()=>{
 jar.clear();const id='test-album',tokenHash=await security.tokenHash(security.newAlbumToken());
 const passwordHash=await security.hashAlbumPassword(security.newAlbumPassword());
 assert.equal(await security.hasAlbumSession(id,tokenHash,passwordHash),false);
 await security.grantAlbumSession(id,tokenHash,passwordHash);
 const cookie=jar.get(security.albumCookieName(id));
 assert.deepEqual(cookie.options,{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:43200});
 assert.equal(await security.hasAlbumSession(id,tokenHash,passwordHash),true);
 assert.equal(await security.hasAlbumSession('other-album',tokenHash,passwordHash),false);
 assert.equal(await security.hasAlbumSession(id,await security.tokenHash(security.newAlbumToken()),passwordHash),false);
 assert.equal(await security.hasAlbumSession(id,tokenHash,await security.hashAlbumPassword(security.newAlbumPassword())),false);
 assert.equal(await security.hasAlbumSession(id,tokenHash,null),false);
 jar.set(security.albumCookieName(id),{value:'forged'});
 assert.equal(await security.hasAlbumSession(id,tokenHash,passwordHash),false);
});

test('streaming ZIP preserves binary files and Unicode names across chunk boundaries',async()=>{
 const entries=[{name:'001-foto.png',bytes:new Uint8Array([0,255,13,10,128])},{name:'002-portret-é.jpg',bytes:new Uint8Array([1,2,3,4])}];
 const files=entries.map(({name,bytes})=>({name,body:new ReadableStream({start(c){c.enqueue(bytes.slice(0,2));c.enqueue(bytes.slice(2));c.close();}})}));
 const chunks=[];for await(const chunk of createZip(files))chunks.push(chunk);
 const zip=Buffer.concat(chunks);const end=zip.length-22;
 assert.equal(zip.readUInt32LE(end),0x06054b50);assert.equal(zip.readUInt16LE(end+10),entries.length);
 let offset=zip.readUInt32LE(end+16);
 for(const expected of entries){
  assert.equal(zip.readUInt32LE(offset),0x02014b50);
  const nameLength=zip.readUInt16LE(offset+28),local=zip.readUInt32LE(offset+42);
  assert.equal(zip.subarray(offset+46,offset+46+nameLength).toString('utf8'),expected.name);
  assert.equal(zip.readUInt32LE(local),0x04034b50);
  const dataStart=local+30+zip.readUInt16LE(local+26);
  assert.deepEqual(zip.subarray(dataStart,dataStart+expected.bytes.length),Buffer.from(expected.bytes));
  assert.equal(zip.readUInt32LE(dataStart+expected.bytes.length),0x08074b50);
  offset+=46+nameLength;
 }
});

test('customer unlock returns a safe redirect for correct and incorrect passwords',async()=>{
 const token=security.newAlbumToken(),password=security.newAlbumPassword();
 globalThis.__bfAlbumTestRecord={id:'test-album',tokenHash:await security.tokenHash(token),passwordHash:await security.hashAlbumPassword(password)};
 globalThis.__bfAlbumTestSecurity=security;
 const moduleUrl=code=>'data:text/javascript,'+encodeURIComponent(code);
 const unlock=await loadTs('../app/album/[id]/unlock/route.ts',{
  '@/db':moduleUrl('export function getDb(){return {select(){return {from(){return {async where(){return [globalThis.__bfAlbumTestRecord]}}}}}}}'),
  '@/db/schema':moduleUrl('export const albums={id:"id"};'),
  'drizzle-orm':moduleUrl('export const eq=(a,b)=>[a,b];'),
  '../../security':moduleUrl('export const {validAlbumToken,verifyAlbumPassword,grantAlbumSession}=globalThis.__bfAlbumTestSecurity;'),
 });
 async function request(passwordValue,tokenValue=token){const form=new FormData();form.set('toegang',tokenValue);form.set('wachtwoord',passwordValue);return unlock.POST(new Request('https://album-test.invalid/album/test-album/unlock',{method:'POST',body:form}),{params:Promise.resolve({id:'test-album'})});}
 jar.clear();
 const wrong=await request('incorrect');assert.equal(wrong.status,303);assert.equal(new URL(wrong.headers.get('Location')).searchParams.get('fout'),'1');assert.equal(jar.size,0);
 const invalid=await request(password,'invalid-token');assert.equal(invalid.status,404);assert.equal(jar.size,0);
 const correct=await request(password);assert.equal(correct.status,303);assert.equal(new URL(correct.headers.get('Location')).pathname,'/album/test-album');assert.equal(correct.headers.get('Cache-Control'),'private, no-store');assert.equal(correct.headers.get('Referrer-Policy'),'no-referrer');
 assert.equal(await security.hasAlbumSession('test-album',globalThis.__bfAlbumTestRecord.tokenHash,globalThis.__bfAlbumTestRecord.passwordHash),true);
});

test('album A access cannot read album B photos or ZIP, even with B token or a copied cookie',async()=>{
 jar.clear();
 const tokenA=security.newAlbumToken(),tokenB=security.newAlbumToken();
 const albumA={id:'album-a',tokenHash:await security.tokenHash(tokenA),passwordHash:await security.hashAlbumPassword('test-password-a')};
 const albumB={id:'album-b',tokenHash:await security.tokenHash(tokenB),passwordHash:await security.hashAlbumPassword('test-password-b')};
 const photoA={id:'photo-a',albumId:albumA.id,imageKey:'photo-a.png',filename:'a.png'};
 const photoB={id:'photo-b',albumId:albumB.id,imageKey:'photo-b.png',filename:'b.png'};
 globalThis.__bfAlbumTestTables={albums:[albumA,albumB],photos:[photoA,photoB],portfolio:[]};
 globalThis.__bfAlbumTestStorage={BUCKET:{async get(){return {size:3,body:new ReadableStream({start(c){c.enqueue(new Uint8Array([1,2,3]));c.close();}}),httpMetadata:{contentType:'image/png'}};}}};
 globalThis.__bfAlbumTestSecurity=security;globalThis.__bfAlbumTestZip=createZip;
 const url=code=>'data:text/javascript,'+encodeURIComponent(code);
 const deps={
  '@/db':url('export function getDb(){return {select(){return {from(table){return {where(p){const rows=globalThis.__bfAlbumTestTables[table.table].filter(x=>x[p.key]===p.value);rows.orderBy=async()=>rows;return rows;}}}}}}}'),
  '@/db/schema':url('export const albums={table:"albums",id:"id"};export const photos={table:"photos",albumId:"albumId",imageKey:"imageKey",filename:"filename",id:"id"};export const portfolio={table:"portfolio",imageKey:"imageKey"};'),
  'drizzle-orm':url('export const eq=(key,value)=>({key,value});export const asc=x=>x;'),
  '@/lib/storage':url('export const storage=globalThis.__bfAlbumTestStorage;'),
  '../../security':url('export const {validAlbumToken,hasAlbumSession}=globalThis.__bfAlbumTestSecurity;'),
  '../../../album/security':url('export const {validAlbumToken,hasAlbumSession}=globalThis.__bfAlbumTestSecurity;'),
  '../../owner':url('export async function isAlbumOwner(){return false;}'),
  '../../../album/owner':url('export async function isAlbumOwner(){return false;}'),
  '../../zip':url('export const createZip=globalThis.__bfAlbumTestZip;'),
  '../../../portfolio-assets':url('export const bundledPortfolioAssets={};'),
 };
 const image=await loadTs('../app/api/image/[key]/route.ts',deps);
 const download=await loadTs('../app/album/[id]/download/route.ts',deps);
 const getImage=(key,token)=>image.GET(new Request(`https://album-test.invalid/api/image/${key}?toegang=${token}`),{params:Promise.resolve({key})});
 const getZip=(id,token)=>download.GET(new Request(`https://album-test.invalid/album/${id}/download?toegang=${token}`),{params:Promise.resolve({id})});
 await security.grantAlbumSession(albumA.id,albumA.tokenHash,albumA.passwordHash);
 assert.equal((await getImage(photoA.imageKey,tokenA)).status,200);
 const zip=await getZip(albumA.id,tokenA);assert.equal(zip.status,200);assert.equal(zip.headers.get('Content-Type'),'application/zip');assert.ok((await zip.arrayBuffer()).byteLength>3);
 assert.equal((await getImage(photoB.imageKey,tokenA)).status,403);
 assert.equal((await getImage(photoB.imageKey,tokenB)).status,403);
 assert.equal((await getZip(albumB.id,tokenA)).status,404);
 assert.equal((await getZip(albumB.id,tokenB)).status,404);
 jar.set(security.albumCookieName(albumB.id),jar.get(security.albumCookieName(albumA.id)));
 assert.equal((await getImage(photoB.imageKey,tokenB)).status,403);
 assert.equal((await getZip(albumB.id,tokenB)).status,404);
 await security.grantAlbumSession(albumB.id,albumB.tokenHash,albumB.passwordHash);
 assert.equal((await getImage(photoB.imageKey,tokenB)).status,200);
 assert.equal((await getZip(albumB.id,tokenB)).status,200);
 assert.equal(await security.verifyAlbumPassword('test-password-a',albumB.passwordHash),false);
});
