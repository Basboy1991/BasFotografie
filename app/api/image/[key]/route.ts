import {bundledPortfolioAssets} from '../../../portfolio-assets';
import {storage as env} from '@/lib/storage';
import {getDb} from '@/db';
import {portfolio,photos,albums} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {isAlbumOwner} from '../../../album/owner';
import {validAlbumToken,hasAlbumSession} from '../../../album/security';
export async function GET(req:Request,{params}:{params:Promise<{key:string}>}){
  const {key}=await params,db=getDb();
  const portfolioPhoto=(await db.select().from(portfolio).where(eq(portfolio.imageKey,key)))[0];
  let permitted=false;
  if(portfolioPhoto)permitted=portfolioPhoto.published||await isAlbumOwner();
  else{
    const photo=(await db.select().from(photos).where(eq(photos.imageKey,key)))[0];
    if(!photo)return new Response('Niet gevonden',{status:404});
    const token=new URL(req.url).searchParams.get('toegang');
    const album=(await db.select().from(albums).where(eq(albums.id,photo.albumId)))[0];
    if(album&&await validAlbumToken(token,album.tokenHash))permitted=await hasAlbumSession(album.id,album.tokenHash,album.passwordHash);
    if(!permitted)permitted=await isAlbumOwner();
  }
  if(!permitted)return new Response('Geen toegang',{status:403});
  // De eerste aangeleverde portfoliofoto's zijn met de site meegeleverd.
  // De database blijft de bron voor publicatie en de beheerfuncties.
  if(portfolioPhoto&&bundledPortfolioAssets[key])return Response.redirect(new URL('/'+bundledPortfolioAssets[key].replace(/^public\//,''),req.url),307);
  if(!env.BUCKET)return new Response('Foto-opslag niet beschikbaar',{status:503});
  const file=await env.BUCKET.get(key);if(!file)return new Response('Niet gevonden',{status:404});
  const headers:Record<string,string>={'Content-Type':file.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  if(new URL(req.url).searchParams.get('download')==='1')headers['Content-Disposition']='attachment; filename="foto-bas-fotografie"';
  return new Response(file.body,{headers});
}
