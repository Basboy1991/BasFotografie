'use client';
import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {uploadPresigned} from '@vercel/blob/client';
import {registerUploadedPhoto} from '../../actions';
export default function PhotoUpload({albumId,category,allowTestPhoto=false}:{albumId:string;category?:string;allowTestPhoto?:boolean}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');const router=useRouter();const formRef=useRef<HTMLFormElement>(null);
 async function uploadPhoto(file:File,element:HTMLFormElement){
  const form=new FormData(element);
  if(!(file instanceof File)||file.size===0||file.size>15_000_000){setMessage('Kies een foto tot 15 MB.');return;}
  const extension:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'};
  if(!extension[file.type]){setMessage('Kies een JPG, PNG, WebP of AVIF.');return;}
  setBusy(true);setMessage('Foto uploaden…');
  try{const key=`${crypto.randomUUID()}.${extension[file.type]}`;await uploadPresigned(`photos/${key}`,file,{access:'private',handleUploadUrl:'/api/upload',contentType:file.type});form.delete('file');form.set('key',key);form.set('filename',file.name);await registerUploadedPhoto(form);element.reset();setMessage('Foto toegevoegd.');router.refresh();}catch(error){setMessage(error instanceof Error?error.message:'Upload mislukt. Probeer opnieuw.');}finally{setBusy(false);}
 }
 async function uploadTestPhoto(){
  const element=formRef.current;if(!element||busy)return;
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
  const context=canvas.getContext('2d');if(!context)return;
  context.fillStyle='#325a60';context.fillRect(0,0,128,128);context.fillStyle='#fff';context.font='24px sans-serif';context.fillText('TEST',30,70);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));
  if(blob)await uploadPhoto(new File([blob],'preview-upload-test.png',{type:'image/png'}),element);
 }
 return <form ref={formRef} className="panel" onSubmit={async event=>{event.preventDefault();const element=event.currentTarget,file=new FormData(element).get('file');if(file instanceof File)await uploadPhoto(file,element);}}><h3>Foto toevoegen</h3><input type="hidden" name="albumId" value={albumId}/>{category&&<input type="hidden" name="category" value={category}/>}<div className="field"><label htmlFor={`file-${category||albumId}`}>Foto (JPG, PNG, WebP of AVIF, max. 15 MB)</label><input id={`file-${category||albumId}`} name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={busy}/></div>{category&&<><div className="field"><label htmlFor={`title-${category}`}>Titel</label><input id={`title-${category}`} name="title" maxLength={100} required/></div><div className="field"><label htmlFor={`alt-${category}`}>Fotobeschrijving</label><input id={`alt-${category}`} name="altText" maxLength={180} required/></div><label className="checkbox-line"><input type="checkbox" name="published" defaultChecked/> Direct zichtbaar in het album</label></>}<button className="button" disabled={busy}>{busy?'Uploaden…':'Foto toevoegen'}</button>{allowTestPhoto&&<button type="button" className="quiet-button" disabled={busy} onClick={uploadTestPhoto}>Voeg testfoto toe</button>}<p role="status" aria-live="polite">{message}</p></form>;
}
