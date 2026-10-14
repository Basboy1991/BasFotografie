import {getDb} from '@/db';
import {albums} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {validAlbumToken,verifyAlbumPassword,grantAlbumSession} from '../../security';

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const form=await request.formData();
  const token=String(form.get('toegang')||''),password=String(form.get('wachtwoord')||'');
  const album=(await getDb().select().from(albums).where(eq(albums.id,id)))[0];
  if(!album||!album.passwordHash||!await validAlbumToken(token,album.tokenHash))return new Response('Album niet beschikbaar.',{status:404,headers:{'Cache-Control':'no-store'}});
  const destination=new URL(`/album/${id}?toegang=${token}`,request.url);
  if(password.length>0&&password.length<=200&&await verifyAlbumPassword(password,album.passwordHash)){
    await grantAlbumSession(id,album.tokenHash,album.passwordHash);
    return new Response(null,{status:303,headers:{Location:destination.toString(),'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
  }
  destination.searchParams.set('fout','1');
  return new Response(null,{status:303,headers:{Location:destination.toString(),'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
}
