'use client';
import {useRef,useState} from 'react';
import {uploadPresigned} from '@vercel/blob/client';
import {probePngBase64} from '@/lib/storage-probe-shared.mjs';
import {startStorageCheck,finishStorageCheck,checkEmailSetup} from './actions';

type Result={ok:boolean;message:string};
export default function SystemChecks(){
 const [busy,setBusy]=useState<'storage'|'email'|null>(null);
 const lock=useRef(false);
 const [storage,setStorage]=useState<Result|null>(null),[email,setEmail]=useState<Result|null>(null);
 async function runStorage(){
  if(lock.current)return;lock.current=true;setBusy('storage');setStorage(null);
  let probe:Awaited<ReturnType<typeof startStorageCheck>>|undefined;
  try{
   probe=await startStorageCheck();
   const bytes=Uint8Array.from(atob(probePngBase64),c=>c.charCodeAt(0));
   const file=new File([bytes],'opslagcontrole.png',{type:'image/png'});
   await uploadPresigned(`photos/${probe.key}`,file,{access:'private',handleUploadUrl:'/api/upload',contentType:'image/png'});
   setStorage(await finishStorageCheck(probe));
  }catch{
   if(probe)await finishStorageCheck(probe).catch(()=>{});
   setStorage({ok:false,message:'De uploadcontrole is niet gelukt. Controleer de foto-opslaginstellingen en probeer opnieuw.'});
  }finally{lock.current=false;setBusy(null);}
 }
 async function runEmail(){if(lock.current)return;lock.current=true;setBusy('email');setEmail(null);try{setEmail(await checkEmailSetup());}catch{setEmail({ok:false,message:'De verbinding kon niet worden gecontroleerd.'});}finally{lock.current=false;setBusy(null);}}
 return <div className="admin-grid cms-system-checks">
  <section className="panel"><h2>Foto-opslag</h2><p>Controleer met een tijdelijk bestand of uploaden, teruglezen en afscherming werken. Het controlebestand wordt daarna opgeruimd.</p><button className="button" onClick={runStorage} disabled={busy!==null}>{busy==='storage'?'Opslag controleren…':'Foto-opslag testen'}</button>{storage&&<p className={`cms-save-message${storage.ok?'':' is-error'}`} role="status">{storage.message}</p>}</section>
  <section className="panel"><h2>E-mailverbinding</h2><p>Controleer of de e-maildienst je afzender herkent. Deze controle verstuurt geen bericht. Bezorging in een inbox is een aparte controle.</p><button className="button" onClick={runEmail} disabled={busy!==null}>{busy==='email'?'Afzender controleren…':'Afzender controleren'}</button>{email&&<p className={`cms-save-message${email.ok?'':' is-error'}`} role="status">{email.message}</p>}</section>
 </div>;
}
