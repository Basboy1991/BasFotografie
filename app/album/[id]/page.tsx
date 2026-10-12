import type {Metadata} from 'next';
import Link from 'next/link';
import {getDb} from '@/db';
import {albums,photos} from '@/db/schema';
import {asc,eq} from 'drizzle-orm';
import {hasAlbumSession,validAlbumToken} from '../security';
import {isAlbumOwner} from '../owner';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Persoonlijk klantalbum',robots:{index:false,follow:false},referrer:'no-referrer'};

export default async function ClientAlbum({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<{toegang?:string;voorbeeld?:string;fout?:string}>}){
  const {id}=await params;
  const {toegang,voorbeeld,fout}=await searchParams;
  const album=(await getDb().select().from(albums).where(eq(albums.id,id)))[0];
  const preview=voorbeeld==='1'&&await isAlbumOwner();
  if(!album||(!preview&&(!album.passwordHash||!await validAlbumToken(toegang,album.tokenHash))))return <main className="wrap subpage"><h1>Album niet beschikbaar.</h1><p>Controleer je persoonlijke link of vraag Bas om een nieuwe.</p><Link href="/klant" className="text-link">Naar klantenportaal ↗</Link></main>;
  const authenticated=preview||await hasAlbumSession(id,album.tokenHash,album.passwordHash);
  if(!authenticated)return <main className="wrap subpage album-login"><p className="eyebrow">Persoonlijk klantalbum</p><h1>Voer je wachtwoord in.</h1><p>Gebruik het wachtwoord dat je van Bas hebt gekregen om je foto’s te bekijken.</p><form className="panel" method="post" action={`/album/${id}/unlock`}><input type="hidden" name="toegang" value={toegang}/><div className="field"><label htmlFor="album-password">Wachtwoord</label><input id="album-password" type="password" name="wachtwoord" required autoComplete="off"/></div>{fout==='1'&&<p role="alert" className="form-error">Het wachtwoord klopt niet. Probeer het opnieuw of vraag Bas om nieuwe toegang.</p>}<button className="button">Open album</button></form></main>;
  const images=await getDb().select().from(photos).where(eq(photos.albumId,id)).orderBy(asc(photos.filename),asc(photos.id));
  const query=preview?'':`?toegang=${toegang}`;
  return <main className="wrap subpage"><p className="eyebrow">{preview?'Voorbeeld voor beheerder':'Persoonlijk album'} · {album.client}</p><h1>{album.title}</h1><p>{preview?'Dit is de weergave van het album na het invoeren van het wachtwoord. Alleen jij kunt dit voorbeeld openen.':'Je foto’s zijn afgeschermd. Deel je link en wachtwoord alleen met mensen die deze beelden mogen zien.'}</p>{images.length?<><div className="album-download"><p>{images.length} {images.length===1?'foto':'foto’s'} in dit album</p>{images.length<=100&&<a className="button" href={`/album/${id}/download${query}`}>Download hele album (.zip) ↓</a>}</div><div className="gallery client-gallery">{images.map(x=><article key={x.id}><a href={`/api/image/${x.imageKey}${query}`} target="_blank" rel="noreferrer"><img src={`/api/image/${x.imageKey}${query}`} alt={x.filename}/></a><a className="download-link" href={`/api/image/${x.imageKey}${preview?'?download=1':`${query}&download=1`}`}>Download foto ↓</a></article>)}</div></>:<div className="panel">Er staan nog geen foto’s in dit album.</div>}</main>;
}
