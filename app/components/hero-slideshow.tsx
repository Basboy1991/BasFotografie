'use client';
import {useEffect,useState} from 'react';
import PublicPhoto from './public-photo';
import type {PhotoFocus} from '../photo-presentation';

export default function HeroSlideshow({images,sample}:{images:{url:string;alt:string;focus?:PhotoFocus}[];sample:boolean}){
  const [{active,previous},setFrame]=useState<{active:number;previous:number|null}>({active:0,previous:null});
  const [paused,setPaused]=useState<boolean|null>(null);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();setPaused(current=>current??window.matchMedia('(max-width: 680px)').matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{if(images.length<2||paused!==false||reduced)return;const interval=window.setInterval(()=>{if(!document.hidden)setFrame(current=>({previous:current.active,active:(current.active+1)%images.length}));},6000);return()=>window.clearInterval(interval);},[images.length,paused,reduced]);
  const next=(active+1)%images.length;
  return <div className="hero-image hero-slideshow">{images.map((image,index)=>index===active||index===previous||paused===false&&!reduced&&index===next?<PublicPhoto key={image.url} className={index===active?'is-active':''} src={image.url} focus={image.focus} sizes="(max-width: 1508px) 100vw, 1508px" alt={index===active?image.alt:''} aria-hidden={index!==active} fetchPriority={index===0?'high':'auto'} loading={index===0?'eager':'lazy'}/>:null)}{sample&&<span className="image-disclaimer">Voorbeeldbeeld</span>}{images.length>1&&!reduced&&paused!==null&&<button type="button" className="slideshow-toggle" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Slideshow afspelen':'Slideshow pauzeren'}>{paused?'Afspelen':'Pauzeren'}</button>}</div>;
}
