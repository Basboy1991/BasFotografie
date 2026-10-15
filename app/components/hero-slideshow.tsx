'use client';
import {useEffect,useState} from 'react';

export default function HeroSlideshow({images,sample}:{images:{url:string;alt:string}[];sample:boolean}){
  const [active,setActive]=useState(0);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  useEffect(()=>{if(images.length<2||paused||reduced)return;const interval=window.setInterval(()=>{if(!document.hidden)setActive(index=>(index+1)%images.length);},6000);return()=>window.clearInterval(interval);},[images.length,paused,reduced]);
  return <div className="hero-image hero-slideshow">{images.map((image,index)=><img key={image.url} className={index===active?'is-active':''} src={image.url} alt={index===active?image.alt:''} aria-hidden={index!==active} fetchPriority={index===0?'high':'auto'} loading={index===0?'eager':'lazy'}/>)}{sample&&<span className="image-disclaimer">Voorbeeldbeeld</span>}{images.length>1&&!reduced&&<button type="button" className="slideshow-toggle" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Slideshow afspelen':'Slideshow pauzeren'}>{paused?'Afspelen':'Pauzeren'}</button>}</div>;
}
