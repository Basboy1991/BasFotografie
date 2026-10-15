'use client';
import {useState,useTransition} from 'react';
import Link from 'next/link';
import {createAlbum} from '../../actions';
import {Credentials} from '../components/album-credentials';

export default function CreateAlbum(){
  const [pending,start]=useTransition();
  const [result,setResult]=useState<{id:string;token:string;password:string}|null>(null);
  const [error,setError]=useState('');
  return <div className="panel"><h2>Nieuw album</h2>{result?<><Credentials {...result}/><Link className="text-link" href={`/beheer/album/${result.id}`}>Foto’s toevoegen en voorbeeld bekijken ↗</Link><button type="button" className="quiet-button" onClick={()=>setResult(null)}>Nog een album maken</button></>:<form action={form=>start(async()=>{setError('');try{setResult(await createAlbum(form));}catch{setError('Het album kon niet worden gemaakt. Controleer de gegevens en probeer het opnieuw.');}})}><div className="field"><label htmlFor="albumTitle">Albumtitel</label><input id="albumTitle" name="title" required minLength={2} maxLength={120}/></div><div className="field"><label htmlFor="client">Naam klant</label><input id="client" name="client" required minLength={2} maxLength={120}/></div><div className="field"><label htmlFor="clientEmail">E-mailadres klant</label><input id="clientEmail" name="email" type="email" required maxLength={254}/></div>{error&&<p role="alert" className="form-error">{error}</p>}<button className="button" disabled={pending}>{pending?'Album maken…':'Album en wachtwoord maken'}</button></form>}</div>;
}
