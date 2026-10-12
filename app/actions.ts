'use server';
import {bundledPortfolioAssets} from './portfolio-assets';
import { getDb } from '@/db';
import { owner, portfolio, requests, albums, photos, siteContent, pricing, faqs } from '@/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import {storage as env} from '@/lib/storage';
import { getOwnerSession } from './owner-auth';
import { defaults, type ContentKey } from './content';
import {visualPages} from './visual-fields';
import {sessions} from './pricing-data';
import {seoPages} from './seo-data';
import {defaultFaqs} from './faq-data';
import { revalidatePath } from 'next/cache';
import {parseHomeBlocks} from './home-blocks';
import {readHomeBlocks} from './home-blocks-data';
import { redirect } from 'next/navigation';
import {newAlbumToken,newAlbumPassword,hashAlbumPassword,tokenHash} from './album/security';

async function allowed() {
  const user = await getOwnerSession();
  if (!user || user.email.toLowerCase() !== 'bas@avonturia.nl') throw new Error('Geen toegang tot beheer.');
  const rows = await getDb().select().from(owner).limit(1);
  if (rows[0]?.userId !== user.userId) throw new Error('Geen toegang tot beheer.');
  return user;
}
export async function claimOwner() {
  const user = await getOwnerSession(); if (!user) throw new Error('Meld je eerst aan.');
  if (user.email.toLowerCase() !== 'bas@avonturia.nl') throw new Error('Alleen de eigenaar kan beheer activeren.');
  const db = getDb();
  // The first claim is made while the Site is owner-private, before visitor sharing.
  await db.insert(owner).values({id:1,userId:user.userId}).onConflictDoNothing();
  const rows = await db.select().from(owner).limit(1);
  if (rows[0]?.userId !== user.userId) throw new Error('Beheer is al toegewezen.');
  revalidatePath('/beheer');
}
export async function requestAppointment(form: FormData) {
  const name=String(form.get('name')||'').trim(), email=String(form.get('email')||'').trim(), type=String(form.get('type')||'').trim();
  const date=String(form.get('date')||''), message=String(form.get('message')||'').trim();
  if (form.get('website')) redirect('/afspraak/bedankt');
  if (name.length<2 || name.length>120 || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['Gezin','Huisdier','Portret','Anders'].includes(type) || date.length>10 || message.length>3000) throw new Error('Controleer je gegevens.');
  if(date){const parsed=new Date(`${date}T12:00:00Z`);const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==date||date<today)throw new Error('Kies een geldige datum vanaf vandaag.');}
  const recent=await getDb().select({count:sql<number>`count(*)`}).from(requests).where(and(eq(requests.email,email.toLowerCase()),gte(requests.createdAt,Date.now()-3600000)));
  if (Number(recent[0]?.count||0)>=3) throw new Error('Je hebt al meerdere aanvragen verstuurd. Probeer het later opnieuw.');
  await getDb().insert(requests).values({id:crypto.randomUUID(),name,email:email.toLowerCase(),type,date,message,createdAt:Date.now(),status:'nieuw'});
  redirect('/afspraak/bedankt');
}
export async function setRequestStatus(form: FormData) {
  await allowed(); const id=String(form.get('id')), status=String(form.get('status'));
  if (!['nieuw','in behandeling','afgerond'].includes(status)) throw new Error('Ongeldige status');
  await getDb().update(requests).set({status}).where(eq(requests.id,id));revalidatePath('/beheer');revalidatePath('/beheer/afspraken');
}
export async function deleteRequest(form:FormData){await allowed();const id=String(form.get('id')),confirm=String(form.get('confirm')||'').trim().toLowerCase();const db=getDb();const item=(await db.select().from(requests).where(eq(requests.id,id)))[0];if(!item||confirm!==item.email)throw new Error('Typ het e-mailadres van de aanvraag om te bevestigen.');await db.delete(requests).where(eq(requests.id,id));revalidatePath('/beheer');revalidatePath('/beheer/afspraken');}
export async function saveContent(form:FormData){await allowed();const db=getDb();const values=(Object.keys(defaults) as ContentKey[]).filter(key=>form.has(key)).map(key=>({key,value:String(form.get(key)||'').trim()}));if(!values.length||values.some(x=>{const heading=x.key.endsWith('Heading')||x.key==='homeHeroTop'||x.key==='homeHeroBottom'||x.key.startsWith('homeClosingHeading'),compact=x.key.endsWith('Label')||x.key.endsWith('Link')||x.key.endsWith('Button')||x.key.endsWith('Eyebrow');return x.value.length<(heading?3:compact?2:20)||x.value.length>(heading?120:compact?80:1500)}))throw new Error('Controleer de lengte van de ingevulde teksten.');for(const item of values)await db.insert(siteContent).values(item).onConflictDoUpdate({target:siteContent.key,set:{value:item.value}});for(const route of ['/','/over-mij','/werkwijze','/portfolio','/diensten/gezinnen','/diensten/huisdieren','/diensten/portretten'])revalidatePath(route);revalidatePath('/beheer/teksten');}
export async function saveVisualContent(key:ContentKey,value:string){await allowed();const pages=visualPages.filter(x=>x.fields.some(field=>field[0]===key));if(!pages.length)throw new Error('Onbekend tekstveld.');const clean=value.trim();const heading=key.endsWith('Heading')||key==='homeHeroTop'||key==='homeHeroBottom'||key.startsWith('homeClosingHeading');const compact=key.endsWith('Label')||key.endsWith('Link')||key.endsWith('Button')||key.endsWith('Eyebrow');const min=heading?3:compact?2:20,max=heading?120:compact?80:1500;if(clean.length<min||clean.length>max)throw new Error(`Gebruik ${min} tot ${max} tekens voor deze tekst.`);await getDb().insert(siteContent).values({key,value:clean}).onConflictDoUpdate({target:siteContent.key,set:{value:clean}});for(const page of pages)revalidatePath(page.path);revalidatePath('/beheer/teksten');return clean;}
export async function saveHomeBlocks(value:unknown){
 await allowed();
 const blocks=parseHomeBlocks(value);
 if(!blocks)throw new Error('Controleer de blokken, teksten en links.');
 const db=getDb();
 for(const block of blocks){
  if(block.type!=='image')continue;
  const image=(await db.select({id:portfolio.id}).from(portfolio).where(and(eq(portfolio.imageKey,block.imageKey),eq(portfolio.published,true))).limit(1))[0];
  if(!image)throw new Error('Een gekozen foto is niet meer gepubliceerd. Kies een andere foto.');
 }
 const json=JSON.stringify(blocks);
 if(json.length>35000)throw new Error('Te veel tekst in de blokken.');
 await db.insert(siteContent).values({key:'home:blocks',value:json}).onConflictDoUpdate({target:siteContent.key,set:{value:json}});
 revalidatePath('/');revalidatePath('/beheer/blokken');
 return blocks;
}
export async function savePricing(form:FormData){await allowed();const category=String(form.get('category'));if(!sessions.some(x=>x.category===category))throw new Error('Onbekende fotosessie.');const raw=String(form.get('price')||'').trim();if(raw&&!/^\d{1,5}([.,]\d{1,2})?$/.test(raw))throw new Error('Vul een geldig bedrag in, bijvoorbeeld 149,50.');const priceCents=raw?Math.round(Number(raw.replace(',','.'))*100):null;const priceType=String(form.get('priceType'));if(!['vanaf','vast'].includes(priceType))throw new Error('Kies een prijstype.');const included=String(form.get('included')||'').trim(),note=String(form.get('note')||'').trim();if(included.length>1000||note.length>500)throw new Error('De tekst is te lang.');await getDb().insert(pricing).values({category,priceCents,priceType,included,note}).onConflictDoUpdate({target:pricing.category,set:{priceCents,priceType,included,note}});revalidatePath('/tarieven');revalidatePath('/beheer/tarieven');}
export async function createAlbum(form: FormData) {
  await allowed();const title=String(form.get('title')||'').trim(),client=String(form.get('client')||'').trim(),email=String(form.get('email')||'').trim().toLowerCase();
  if (title.length<2||title.length>120||client.length<2||client.length>120||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Controleer de albumgegevens.');
  const token=newAlbumToken(),password=newAlbumPassword(),id=crypto.randomUUID();
  const [tokenDigest,passwordHash]=await Promise.all([tokenHash(token),hashAlbumPassword(password)]);
  await getDb().insert(albums).values({id,title,client,email,tokenHash:tokenDigest,passwordHash,createdAt:Date.now()});
  revalidatePath('/beheer/albums');revalidatePath('/beheer');
  return {id,token,password};
}
export async function rotateAlbumAccess(id:string){
  await allowed();if(!/^[a-f0-9-]{36}$/.test(id))throw new Error('Ongeldig album.');
  if(!(await getDb().select().from(albums).where(eq(albums.id,id)))[0])throw new Error('Album niet gevonden.');
  const token=newAlbumToken(),password=newAlbumPassword();
  const [tokenDigest,passwordHash]=await Promise.all([tokenHash(token),hashAlbumPassword(password)]);
  await getDb().update(albums).set({tokenHash:tokenDigest,passwordHash}).where(eq(albums.id,id));
  revalidatePath(`/album/${id}`);revalidatePath(`/beheer/album/${id}`);revalidatePath('/beheer/albums');
  return {id,token,password};
}
export async function deleteAlbum(form:FormData){await allowed();const id=String(form.get('id'));const db=getDb();const album=(await db.select().from(albums).where(eq(albums.id,id)))[0];if(!album||String(form.get('confirm'))!==album.title)throw new Error('Typ de albumtitel om te bevestigen.');if(!env.BUCKET)throw new Error('Foto-opslag is tijdelijk niet beschikbaar.');const images=await db.select().from(photos).where(eq(photos.albumId,id));for(const image of images)await env.BUCKET.delete(image.imageKey);await db.delete(photos).where(eq(photos.albumId,id));await db.delete(albums).where(eq(albums.id,id));revalidatePath('/beheer');redirect('/beheer');}
export async function updatePortfolioItem(form:FormData){await allowed();const id=String(form.get('id')),title=String(form.get('title')||'').trim(),category=String(form.get('category')),altText=String(form.get('altText')||'').trim(),position=Number(form.get('position'));if(!title||title.length>100||altText.length>180||!['Gezin','Dieren','Portret'].includes(category)||!Number.isSafeInteger(position)||position<0||position>99999)throw new Error('Controleer de fotogegevens.');if(form.get('published')!=='on'){const row=(await getDb().select().from(portfolio).where(eq(portfolio.id,id)))[0];if(row&&(await readHomeBlocks()).some(block=>block.type==='image'&&block.imageKey===row.imageKey))throw new Error('Deze foto staat in een homepageblok. Verwijder dat blok eerst.');}await getDb().update(portfolio).set({title,category,altText,published:form.get('published')==='on',position}).where(eq(portfolio.id,id));for(const route of ['/','/portfolio','/portfolio/gezinnen','/portfolio/huisdieren','/portfolio/portretten'])revalidatePath(route);revalidatePath('/beheer/portfolio');}
export async function deletePhoto(form: FormData) {
  await allowed();const id=String(form.get('id')),kind=String(form.get('kind'));
  if(kind==='portfolio') {const row=(await getDb().select().from(portfolio).where(eq(portfolio.id,id)))[0];if(row){if((await readHomeBlocks()).some(block=>block.type==='image'&&block.imageKey===row.imageKey))throw new Error('Deze foto staat in een homepageblok. Verwijder dat blok eerst.');await getDb().delete(portfolio).where(eq(portfolio.id,id));if(!bundledPortfolioAssets[row.imageKey])await env.BUCKET!.delete(row.imageKey);}}
  else {const row=(await getDb().select().from(photos).where(eq(photos.id,id)))[0];if(row){await getDb().delete(photos).where(eq(photos.id,id));await env.BUCKET!.delete(row.imageKey);}}
  for(const route of ['/','/portfolio','/portfolio/gezinnen','/portfolio/huisdieren','/portfolio/portretten','/beheer/portfolio'])revalidatePath(route);
}
export async function saveSeo(form:FormData){await allowed();const path=String(form.get('path'));if(!seoPages.some(x=>x.path===path))throw new Error('Onbekende pagina.');const title=String(form.get('title')||'').trim(),description=String(form.get('description')||'').trim();if(title.length<15||title.length>75||description.length<50||description.length>200)throw new Error('Controleer de lengte van titel en beschrijving.');const db=getDb();for(const [key,value] of [[`seo:${path}:title`,title],[`seo:${path}:description`,description]])await db.insert(siteContent).values({key,value}).onConflictDoUpdate({target:siteContent.key,set:{value}});revalidatePath(path);revalidatePath('/beheer/seo');}

async function initializeFaqs(){
 const db=getDb();
 const marker=await db.select().from(siteContent).where(eq(siteContent.key,'faq:initialized'));
 if(marker.length)return;
 for(const [position,item] of defaultFaqs.entries())await db.insert(faqs).values({id:`standaard-${position}`,position,published:true,...item}).onConflictDoNothing();
 await db.insert(siteContent).values({key:'faq:initialized',value:'1'}).onConflictDoNothing();
}
export async function enableFaqEditing(){await allowed();await initializeFaqs();revalidatePath('/veelgestelde-vragen');revalidatePath('/beheer/faq');}
export async function createFaq(form:FormData){
 await allowed();const question=String(form.get('question')||'').trim(),answer=String(form.get('answer')||'').trim();
 if(question.length<10||question.length>200||answer.length<20||answer.length>1500)throw new Error('Controleer de lengte van de vraag en het antwoord.');
 await initializeFaqs();const db=getDb();const existing=await db.select({max:sql<number>`max(${faqs.position})`}).from(faqs);const position=Math.min(999,Number(existing[0]?.max??-1)+1);await db.insert(faqs).values({id:crypto.randomUUID(),question,answer,position,published:true});
 revalidatePath('/veelgestelde-vragen');revalidatePath('/beheer/faq');
}
export async function saveFaq(form:FormData){
 await allowed();const id=String(form.get('id')||''),question=String(form.get('question')||'').trim(),answer=String(form.get('answer')||'').trim(),position=Number(form.get('position'));
 if(!id||question.length<10||question.length>200||answer.length<20||answer.length>1500||!Number.isSafeInteger(position)||position<0||position>999)throw new Error('Controleer de vraag, het antwoord en de volgorde.');
 await getDb().update(faqs).set({question,answer,position,published:form.get('published')==='on'}).where(eq(faqs.id,id));
 revalidatePath('/veelgestelde-vragen');revalidatePath('/beheer/faq');
}
export async function deleteFaq(form:FormData){
 await allowed();const id=String(form.get('id')||''),question=String(form.get('confirm')||'').trim();
 const row=(await getDb().select().from(faqs).where(eq(faqs.id,id)))[0];
 if(!row||question!==row.question)throw new Error('Typ de vraag precies over om te verwijderen.');
 await getDb().delete(faqs).where(eq(faqs.id,id));revalidatePath('/veelgestelde-vragen');revalidatePath('/beheer/faq');
}

// The browser uploads directly to PRIVATE Blob storage; only metadata reaches the Server Action.
export async function registerUploadedPhoto(form:FormData){
 await allowed();
 const key=String(form.get('key')||''),albumId=String(form.get('albumId')||''),filename=String(form.get('filename')||'').slice(0,200);
 if(!/^[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.test(key))throw new Error('Ongeldige upload.');
 const file=await env.BUCKET.head(key);
 if(!file||file.size===0||file.size>15_000_000||!['image/jpeg','image/png','image/webp','image/avif'].includes(file.httpMetadata.contentType||''))throw new Error('Kies een geldige foto tot 15 MB.');
 const object=await env.BUCKET.get(key);if(!object)throw new Error('De upload is nog niet beschikbaar.');
 const reader=object.body.getReader();let bytes=new Uint8Array();
 try{while(bytes.length<16){const chunk=await reader.read();if(chunk.done)break;const combined=new Uint8Array(Math.min(16,bytes.length+chunk.value.length));combined.set(bytes);combined.set(chunk.value.slice(0,16-bytes.length),bytes.length);bytes=combined;}}finally{await reader.cancel();}
 const type=file.httpMetadata.contentType;
 const valid=type==='image/jpeg'?bytes[0]===255&&bytes[1]===216:type==='image/png'?bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:type==='image/webp'?String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP':String.fromCharCode(...bytes.slice(4,12)).includes('ftypavif');
 if(!valid){await env.BUCKET.delete(key);throw new Error('Het bestand is geen geldige afbeelding.');}
 const db=getDb();
 if(albumId==='portfolio'){
  const category=String(form.get('category')||''),title=String(form.get('title')||'').trim(),altText=String(form.get('altText')||'').trim();
  if(!['Gezin','Dieren','Portret'].includes(category)||!title||title.length>100||!altText||altText.length>180)throw new Error('Controleer album, titel en fotobeschrijving.');
  await db.insert(portfolio).values({id:key,title,category,imageKey:key,position:Date.now(),altText,published:form.get('published')==='on'}).onConflictDoNothing();
 }else{
  if(!(await db.select().from(albums).where(eq(albums.id,albumId)))[0])throw new Error('Album niet gevonden.');
  await db.insert(photos).values({id:key,albumId,imageKey:key,filename}).onConflictDoNothing();
 }
 for(const route of ['/','/portfolio','/portfolio/gezinnen','/portfolio/huisdieren','/portfolio/portretten','/beheer/portfolio',`/beheer/album/${albumId}`])revalidatePath(route);
}
