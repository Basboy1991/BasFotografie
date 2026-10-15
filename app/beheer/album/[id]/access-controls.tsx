'use client';
import {useState,useTransition} from 'react';
import {rotateAlbumAccess} from '../../../actions';
import {Credentials} from '../../components/album-credentials';
export default function AccessControls({id,hasPassword}:{id:string;hasPassword:boolean}){
  const [pending,start]=useTransition();
  const [result,setResult]=useState<{id:string;token:string;password:string}|null>(null);
  const [error,setError]=useState('');
  return <div className="panel"><h2>Toegang beheren</h2>{result?<Credentials {...result}/>:<p>{hasPassword?'De klant heeft zowel de persoonlijke link als het wachtwoord nodig. Ben je de gegevens kwijt? Maak een nieuwe set; de oude link en het oude wachtwoord vervallen meteen.':'Dit bestaande album heeft nog geen wachtwoord. Maak een nieuwe link en wachtwoord voordat je het met de klant deelt.'}</p>}{error&&<p role="alert" className="form-error">{error}</p>}<button type="button" className="button" disabled={pending} onClick={()=>start(async()=>{setError('');try{setResult(await rotateAlbumAccess(id));}catch{setError('Nieuwe toegangsgegevens maken lukte niet. Probeer het opnieuw.');}})}>{pending?'Gegevens maken…':hasPassword?'Nieuwe link en wachtwoord maken':'Link en wachtwoord maken'}</button></div>;
}
