'use client';
import {useState} from 'react';
import {siteUrl} from '../../site-url';
export function Credentials({id,token,password}:{id:string;token:string;password:string}){
  const [copied,setCopied]=useState('');
  const url=`${siteUrl}/album/${id}?toegang=${token}`;
  async function copy(value:string,what:string){try{await navigator.clipboard.writeText(value);setCopied(`${what} gekopieerd.`);}catch{setCopied('Kopiëren lukte niet. Selecteer de tekst en kopieer die zelf.');}}
  return <div className="album-credentials"><p><strong>Bewaar deze gegevens nu.</strong> De link en het wachtwoord zijn alleen hier zichtbaar. Stuur ze privé aan de klant, bij voorkeur via aparte berichten.</p><div className="field"><label htmlFor="album-share-link">Persoonlijke link</label><div className="credential-line"><input id="album-share-link" readOnly value={url} onFocus={event=>event.currentTarget.select()}/><button type="button" onClick={()=>copy(url,'Link')}>Kopieer link</button></div></div><div className="field"><label htmlFor="album-share-password">Wachtwoord</label><div className="credential-line"><input id="album-share-password" readOnly value={password} onFocus={event=>event.currentTarget.select()}/><button type="button" onClick={()=>copy(password,'Wachtwoord')}>Kopieer wachtwoord</button></div></div><p role="status" className="credential-status">{copied}</p></div>;
}
