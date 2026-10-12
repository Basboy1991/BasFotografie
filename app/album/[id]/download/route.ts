import {storage as env} from '@/lib/storage';
import {getDb} from '@/db';
import {albums,photos} from '@/db/schema';
import {asc,eq} from 'drizzle-orm';
import {validAlbumToken,hasAlbumSession} from '../../security';
import {isAlbumOwner} from '../../owner';
import {createZip} from '../../zip';

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params,token=new URL(request.url).searchParams.get('toegang');
 const album=(await getDb().select().from(albums).where(eq(albums.id,id)))[0];
 if(!album||!((await validAlbumToken(token,album.tokenHash)&&await hasAlbumSession(id,album.tokenHash,album.passwordHash))||await isAlbumOwner()))return new Response('Album niet beschikbaar.',{status:404,headers:{'Cache-Control':'no-store'}});
 if(!env.BUCKET)return new Response('Foto-opslag niet beschikbaar.',{status:503});
 const images=await getDb().select().from(photos).where(eq(photos.albumId,id)).orderBy(asc(photos.filename),asc(photos.id));
 if(!images.length)return new Response('Dit album bevat nog geen foto’s.',{status:404});
 if(images.length>100)return new Response('Dit album bevat meer dan 100 foto’s. Download de beelden afzonderlijk.',{status:413});
 const files=[];let total=0;
 for(const [index,image] of images.entries()){
  const object=await env.BUCKET.get(image.imageKey);if(!object)return new Response('Een foto is tijdelijk niet beschikbaar.',{status:503});
  total+=object.size;if(total>1_500_000_000)return new Response('Dit album is te groot voor één download. Download de beelden afzonderlijk.',{status:413});
  const safeName=image.filename.replace(/[\\/\x00-\x1f\x7f]/g,'_').slice(0,150)||'foto';
  files.push({name:`${String(index+1).padStart(3,'0')}-${safeName}`,body:object.body});
 }
 const iterator=createZip(files);
 const stream=new ReadableStream<Uint8Array>({async pull(controller){try{const next=await iterator.next();if(next.done)controller.close();else controller.enqueue(next.value);}catch(error){controller.error(error);}},async cancel(){await iterator.return(undefined);}});
 return new Response(stream,{headers:{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="bas-fotografie-album.zip"','Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
}
