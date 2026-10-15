'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {saveVisualContent} from '../../actions';
import {defaults,visualPages,type ContentKey} from '../../visual-fields';

type Props={initial:Record<ContentKey,string>};
export default function VisualEditor({initial}:Props){
 const [path,setPath]=useState<string>('/');
 const [selected,setSelected]=useState<ContentKey|null>('homeHeroTop');
 const [values,setValues]=useState<Record<ContentKey,string>>(initial);
 const [saved,setSaved]=useState<Record<ContentKey,string>>(initial);
 const [saving,setSaving]=useState(false);
 const [device,setDevice]=useState<'desktop'|'mobiel'>('desktop');
 const [message,setMessage]=useState('');
 const frame=useRef<HTMLIFrameElement>(null);
 const page=visualPages.find(x=>x.path===path)||visualPages[0];
 const chosen=page.fields.find(x=>x[0]===selected);
 const dirty=selected!==null&&values[selected]!==saved[selected];

 function send(message:object){frame.current?.contentWindow?.postMessage(message,location.origin);}
 function pick(key:ContentKey){setSelected(key);setMessage('');send({type:'bas-editor:scroll',key});}
 useEffect(()=>{
  function receive(event:MessageEvent<{type?:string;key?:string}>){
   if(event.origin!==location.origin||event.source!==frame.current?.contentWindow)return;
   if(event.data?.type==='bas-editor:ready')send({type:'bas-editor:update',values,selected});
   if(event.data?.type==='bas-editor:select'&&page.fields.some(field=>field[0]===event.data.key))pick(event.data.key as ContentKey);
  }
  window.addEventListener('message',receive);
  send({type:'bas-editor:update',values,selected});
  return()=>window.removeEventListener('message',receive);
 },[path,page,values,selected]);
 async function save(){if(!selected||!dirty)return;setSaving(true);setMessage('');try{const clean=await saveVisualContent(selected,values[selected]);setValues(current=>({...current,[selected]:clean}));setSaved(current=>({...current,[selected]:clean}));setMessage('Opgeslagen. De tekst staat nu op de website.');}catch{setMessage('Opslaan is niet gelukt. Controleer de lengte van je tekst en probeer het opnieuw.');}finally{setSaving(false);}}
 return <div className="visual-editor"><div className="visual-editor-toolbar"><label htmlFor="visual-page">Pagina</label><select id="visual-page" value={path} onChange={event=>{setPath(event.target.value);setSelected(null);setMessage('');}}>{visualPages.map(item=><option key={item.path} value={item.path}>{item.label}</option>)}</select><div className="visual-device" aria-label="Voorbeeldformaat"><button type="button" aria-pressed={device==='desktop'} onClick={()=>setDevice('desktop')}>Desktop</button><button type="button" aria-pressed={device==='mobiel'} onClick={()=>setDevice('mobiel')}>Mobiel</button></div><Link href="/beheer/blokken" className="text-link">Blokken verplaatsen ↗</Link><Link href="/beheer/teksten/lijst" className="text-link">Alle teksten als lijst ↗</Link></div><div className="visual-editor-grid"><div className="visual-editor-panel"><h2>Tekst aanpassen</h2><p>Klik op een tekst in het voorbeeld of kies hieronder een onderdeel.</p><div className="visual-field-list">{page.fields.map(([key,label])=><button type="button" key={key} className={selected===key?'active':''} onClick={()=>pick(key)}>{label}{values[key]!==saved[key]&&<span aria-label="Niet opgeslagen"> •</span>}</button>)}</div>{chosen&&selected?<div className="visual-edit-form"><label htmlFor="visual-text">{chosen[1]}</label><textarea id="visual-text" value={values[selected]} onChange={event=>{setValues(current=>({...current,[selected!]:event.target.value}));setMessage('');}} minLength={selected.endsWith('Heading')||selected==='homeHeroTop'||selected==='homeHeroBottom'||selected.startsWith('homeClosingHeading')?3:selected.endsWith('Label')||selected.endsWith('Link')||selected.endsWith('Button')||selected.endsWith('Eyebrow')?2:20} maxLength={selected.endsWith('Heading')||selected==='homeHeroTop'||selected==='homeHeroBottom'||selected.startsWith('homeClosingHeading')?120:selected.endsWith('Label')||selected.endsWith('Link')||selected.endsWith('Button')||selected.endsWith('Eyebrow')?80:1500}/><p className="visual-save-note">{dirty?'Je wijziging is alleen in dit voorbeeld zichtbaar.':'Deze tekst is opgeslagen.'}</p><button type="button" className="button" onClick={save} disabled={!dirty||saving}>{saving?'Opslaan…':'Tekst opslaan'}</button></div>:<p className="visual-save-note">Selecteer een gemarkeerde tekst in het voorbeeld.</p>}{message&&<p className="visual-message" role="status">{message}</p>}<p className="visual-more">Foto’s beheer je bij <Link href="/beheer/portfolio">Portfolio</Link>, prijzen bij <Link href="/beheer/tarieven">Tarieven</Link> en vragen bij <Link href="/beheer/faq">FAQ</Link>. Paginatitels voor Google pas je aan bij <Link href="/beheer/seo">SEO</Link>.</p></div><div className={`visual-preview ${device==='mobiel'?'is-mobile':''}`}><div className="visual-preview-bar"><span>Voorbeeld van de website</span><Link href={path} target="_blank" rel="noopener noreferrer">Open pagina ↗</Link></div><iframe key={path} ref={frame} src={`${path}${path.includes('?')?'&':'?'}editorPreview=1`} title={`Voorbeeld: ${page.label}`}/></div></div></div>;
}
