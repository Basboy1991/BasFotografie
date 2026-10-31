'use client';
import {useState,type CSSProperties} from 'react';
import PublicPhoto from '../../components/public-photo';
import {defaultPhotoFocus,type PhotoFocus} from '../../photo-presentation';
import {savePhotoFocus} from '../../actions';
import SaveForm from '../components/save-form';

export default function PhotoFocusEditor({imageKey,title,initial=defaultPhotoFocus}:{imageKey:string;title:string;initial?:PhotoFocus}){
 const [value,setValue]=useState(initial);
 return <details className="cms-focus-editor"><summary>Uitsnede voor de openingsfoto</summary>
  <p>Schuif het onderwerp naar de juiste plek. Je kunt telefoon en desktop apart instellen.</p>
  <SaveForm action={savePhotoFocus} label={`Uitsnede ${title}`} successMessage="Uitsnede opgeslagen.">
   <input type="hidden" name="imageKey" value={imageKey}/>
   {(['desktop','mobile'] as const).map(mode=>{const x=mode==='desktop'?'x':'mobileX',y=mode==='desktop'?'y':'mobileY';return <div key={mode}>
    <h3>{mode==='desktop'?'Desktop':'Telefoon'}</h3>
    <div className={`cms-focus-preview is-${mode}`}><PublicPhoto src={`/api/image/${imageKey}`} alt={title} sizes="320px" style={{objectPosition:`${value[x]}% ${value[y]}%`} as CSSProperties}/></div>
    {[[x,'Horizontaal'],[y,'Verticaal']].map(([key,label])=><div className="field" key={key}><label htmlFor={`${imageKey}-${key}`}>{label}: {value[key as keyof PhotoFocus]}%</label><input id={`${imageKey}-${key}`} type="range" name={key} min="0" max="100" value={value[key as keyof PhotoFocus]} onChange={e=>setValue(v=>({...v,[key]:Number(e.target.value)}))}/></div>)}
   </div>;})}
   <button className="cms-save">Uitsnede opslaan</button>
  </SaveForm>
 </details>;
}
