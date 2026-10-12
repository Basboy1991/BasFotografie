'use client';
import {useState} from 'react';
export default function DownloadButton(){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function download(){
  setBusy(true);setMessage('Export controleren…');
  try{
   const check=await fetch('/beheer/export/download?check=1',{cache:'no-store'});
   if(!check.ok)throw new Error(await check.text());
   const info=await check.json() as {photoBytes:number};
   if(info.photoBytes>100_000_000){
    // Let the browser stream large archives directly to disk after preflight.
    const link=document.createElement('a');link.href='/beheer/export/download';link.download=`bas-fotografie-export-${new Date().toISOString().slice(0,10)}.zip`;document.body.appendChild(link);link.click();link.remove();
    setMessage('De ZIP-download is gestart. Bekijk de downloads van je browser.');return;
   }
   setMessage('ZIP-bestand maken…');
   const response=await fetch('/beheer/export/download',{cache:'no-store'});
   if(!response.ok)throw new Error(await response.text());
   if(!response.headers.get('content-type')?.includes('application/zip'))throw new Error('De server gaf geen ZIP terug. Meld je opnieuw aan en probeer het nogmaals.');
   const blob=await response.blob();
   const signature=new Uint8Array(await blob.slice(0,4).arrayBuffer());
   if(signature.length!==4||signature[0]!==0x50||signature[1]!==0x4b||signature[2]!==3||signature[3]!==4)throw new Error('Het bestand is geen geldige ZIP. Probeer opnieuw.');
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`bas-fotografie-export-${new Date().toISOString().slice(0,10)}.zip`;document.body.appendChild(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(url),60_000);setMessage('Je ZIP is klaar. Bekijk de downloads van je browser.');
  }catch(error){setMessage(error instanceof Error?error.message:'Download mislukt. Probeer opnieuw.');}finally{setBusy(false);}
 }
 return <><button className="button" type="button" disabled={busy} onClick={download}>{busy?'Export voorbereiden…':'Download website als ZIP ↓'}</button><p role="status" aria-live="polite">{message}</p></>;
}
