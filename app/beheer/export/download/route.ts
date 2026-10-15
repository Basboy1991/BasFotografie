import {getSql} from '@/db';
import {bundledPortfolioAssets} from '../../../portfolio-assets';
import {storage as env} from '@/lib/storage';
import {isAlbumOwner} from '../../../album/owner';
import {createZip} from '../../../album/zip';
import source from '../generated/source.json';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const tableNames=['owner','portfolio','requests','albums','photos','site_content','pricing','faqs'] as const;
function body(bytes:Uint8Array){return new ReadableStream<Uint8Array>({start(controller){controller.enqueue(bytes);controller.close();}});}
const encode=(value:string)=>body(new TextEncoder().encode(value));
export async function GET(request:Request){
 if(!await isAlbumOwner())return new Response('Geen toegang tot deze export.',{status:403,headers});
 if(!process.env.DATABASE_URL)return new Response('De opslag is tijdelijk niet beschikbaar.',{status:503,headers});
 const data:Record<string,Record<string,unknown>[]>={};
 for(const table of tableNames){
  const rows=await getSql().query(`SELECT * FROM "${table}" LIMIT 10001`,[]) as Record<string,unknown>[];
  if(rows.length>10000)return new Response('De database is te groot voor deze export. Vraag een afzonderlijke database-export aan.',{status:413,headers});
  data[table]=rows;
 }
 const keys=[...new Set([...data.portfolio,...data.photos].map(row=>row.image_key).filter((key):key is string=>typeof key==='string'&&key.length>0))];
 if(keys.length>2000)return new Response('De export bevat meer dan 2.000 foto’s. Exporteer de albums afzonderlijk.',{status:413,headers});
 const images:{key:string;path:string;size:number;contentType?:string;sourcePath?:string}[]=[];let total=0;
 const sourceByName=new Map(source.files.map(file=>[file.name,file]));
 const portfolioKeys=new Set(data.portfolio.map(row=>row.image_key));
 for(const [index,key] of keys.entries()){
  const bundledPath=portfolioKeys.has(key)?bundledPortfolioAssets[key]:undefined;
  if(bundledPath){
   const bundled=sourceByName.get(bundledPath);
   if(!bundled)return new Response('Een meegeleverde foto ontbreekt in de broncode-export.',{status:503,headers});
   const size=atob(bundled.base64).length;total+=size;
   images.push({key,path:`backup/photos/${String(index+1).padStart(5,'0')}-${bundledPath.split('/').pop()}`,size,contentType:'image/jpeg',sourcePath:bundledPath});
   continue;
  }
  if(!env.BUCKET)return new Response('De foto-opslag is tijdelijk niet beschikbaar.',{status:503,headers});
  const object=await env.BUCKET.head(key);
  if(!object)return new Response('Een foto ontbreekt in de opslag. De export is niet gestart; controleer je albums en portfolio.',{status:503,headers});
  total+=object.size;
  if(total>1_500_000_000)return new Response('De foto’s zijn samen groter dan 1,5 GB. Exporteer de albums afzonderlijk.',{status:413,headers});
  images.push({key,path:`backup/photos/${String(index+1).padStart(5,'0')}-${key.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-120)}`,size:object.size,contentType:object.httpMetadata?.contentType});
 }
 if(new URL(request.url).searchParams.get('check')==='1')return Response.json({photos:images.length,photoBytes:total},{headers});
 const files=source.files.map(file=>({name:`source/${file.name}`,body:new ReadableStream<Uint8Array>({start(controller){controller.enqueue(Uint8Array.from(atob(file.base64),c=>c.charCodeAt(0)));controller.close();}})}));
 files.push({name:'backup/database.json',body:encode(JSON.stringify({formatVersion:1,exportedAt:new Date().toISOString(),tables:data},null,2))});
 files.push({name:'backup/photos.json',body:encode(JSON.stringify(images,null,2))});
 files.push({name:'LEESMIJ.txt',body:encode('Bas Fotografie — website-export\n\nsource/ bevat de broncode van de gepubliceerde versie.\nbackup/ bevat actuele databasegegevens en foto’s, inclusief privé klantgegevens. Upload deze map niet naar een openbare repository.\nbackup/photos.json koppelt originele opslagkeys aan fotobestanden.\nAPI-sleutels, omgevingsvariabelen, Git-historie en actieve sessies zijn niet inbegrepen.\nDe site gebruikt Next.js, Postgres en privé Vercel Blob-opslag. Configureer de omgevingsvariabelen uit .env.example en gebruik scripts/import-export.mjs om deze back-up te herstellen.\nWijzig tijdens de export geen albums of gegevens; de export is geen transactionele databasesnapshot.\nBroncode voorbereid op: '+source.generatedAt+'\n')});
 for(const image of images){
  if(image.sourcePath){
   const bundled=sourceByName.get(image.sourcePath)!;
   files.push({name:image.path,body:body(Uint8Array.from(atob(bundled.base64),c=>c.charCodeAt(0)))});
   continue;
  }
  let reader:ReadableStreamDefaultReader<Uint8Array>|undefined;
  files.push({name:image.path,body:new ReadableStream<Uint8Array>({async pull(controller){try{if(!reader){const object=await env.BUCKET!.get(image.key);if(!object)throw new Error('Foto niet beschikbaar tijdens export.');reader=object.body.getReader();}const next=await reader.read();if(next.done){reader.releaseLock();controller.close();}else controller.enqueue(next.value);}catch(error){controller.error(error);}},async cancel(){await reader?.cancel();}},{highWaterMark:0})});
 }
 const iterator=createZip(files);
 const stream=new ReadableStream<Uint8Array>({async pull(controller){try{const next=await iterator.next();if(next.done)controller.close();else controller.enqueue(next.value);}catch(error){controller.error(error);}},async cancel(){await iterator.return(undefined);}});
 return new Response(stream,{headers:{...headers,'Content-Type':'application/zip','Content-Disposition':`attachment; filename="bas-fotografie-export-${new Date().toISOString().slice(0,10)}.zip"`}});
}
