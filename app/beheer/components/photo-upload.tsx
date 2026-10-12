'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {uploadPresigned} from '@vercel/blob/client';
import {registerUploadedPhoto} from '../../actions';
export default function PhotoUpload({albumId,category}:{albumId:string;category?:string}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');const router=useRouter();
 return <form className="panel" onSubmit={async event=>{
  event.preventDefault();const element=event.currentTarget,form=new FormData(element),file=form.get('file');
  if(!(file instanceof File)||file.size===0||file.size>15_000_000){setMessage('Kies een foto tot 15 MB.');return;}
  const extension:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif'};
  if(!extension[file.type]){setMessage('Kies een JPG, PNG, WebP of AVIF.');return;}
  setBusy(true);setMessage('Foto uploaden…');
  try{const key=`${crypto.randomUUID()}.${extension[file.type]}`;await uploadPresigned(`photos/${key}`,file,{access:'private',handleUploadUrl:'/api/upload',contentType:file.type});form.delete('file');form.set('key',key);form.set('filename',file.name);await registerUploadedPhoto(form);element.reset();setMessage('Foto toegevoegd.');router.refresh();}catch(error){setMessage(error instanceof Error?error.message:'Upload mislukt. Probeer opnieuw.');}finally{setBusy(false);}
 }}><h3>Foto toevoegen</h3><input type="hidden" name="albumId" value={albumId}/>{category&&<input type="hidden" name="category" value={category}/>}<div className="field"><label htmlFor={`file-${category||albumId}`}>Foto (JPG, PNG, WebP of AVIF, max. 15 MB)</label><input id={`file-${category||albumId}`} name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={busy}/></div>{category&&<><div className="field"><label htmlFor={`title-${category}`}>Titel</label><input id={`title-${category}`} name="title" maxLength={100} required/></div><div className="field"><label htmlFor={`alt-${category}`}>Fotobeschrijving</label><input id={`alt-${category}`} name="altText" maxLength={180} required/></div><label className="checkbox-line"><input type="checkbox" name="published" defaultChecked/> Direct zichtbaar in het album</label></>}<button className="button" disabled={busy}>{busy?'Uploaden…':'Foto toevoegen'}</button><p role="status" aria-live="polite">{message}</p></form>;
}
