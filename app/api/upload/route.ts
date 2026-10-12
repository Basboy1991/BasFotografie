import {handleUploadPresigned,type HandleUploadPresignedBody} from '@vercel/blob/client';
import {issueSignedToken} from '@vercel/blob';
import {isAlbumOwner} from '../../album/owner';
export async function POST(request:Request){
 try{
  const body=await request.json() as HandleUploadPresignedBody;
  const response=await handleUploadPresigned({request,body,getSignedToken:async pathname=>{
   if(!await isAlbumOwner())throw new Error('Geen toegang.');
   if(!/^photos\/[a-f0-9-]{36}\.(jpg|png|webp|avif)$/.test(pathname))throw new Error('Ongeldig uploadpad.');
   const constraints={allowedContentTypes:['image/jpeg','image/png','image/webp','image/avif'],maximumSizeInBytes:15_000_000,validUntil:Date.now()+10*60*1000};
   return {token:await issueSignedToken({pathname,operations:['put'],...constraints}),urlOptions:{access:'private',...constraints,addRandomSuffix:false,allowOverwrite:false}};
  }});
  return Response.json(response,{headers:{'Cache-Control':'private, no-store'}});
 }catch{return Response.json({error:'Upload niet beschikbaar. Meld je aan als eigenaar en controleer je bestand.'},{status:400,headers:{'Cache-Control':'private, no-store'}});}
}
