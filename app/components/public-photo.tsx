import type {CSSProperties,ImgHTMLAttributes} from 'react';
import {bundledImage,defaultPhotoFocus,type PhotoFocus} from '../photo-presentation';

type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'|'alt'>&{src:string;alt:string;focus?:PhotoFocus};
export default function PublicPhoto({src,alt,focus=defaultPhotoFocus,sizes='100vw',style,...props}:Props){
 const {source,asset}=bundledImage(src);
 const focusStyle={'--photo-focus':`${focus.x}% ${focus.y}%`,'--photo-focus-mobile':`${focus.mobileX}% ${focus.mobileY}%`,...style} as CSSProperties;
 return <picture className="public-photo">
  {asset&&<source type="image/webp" srcSet={asset.variants.map(x=>`${x.url} ${x.width}w`).join(', ')} sizes={sizes}/>}
  <img src={asset?source:src} alt={alt} width={asset?.width} height={asset?.height} sizes={sizes} decoding="async" style={focusStyle} {...props}/>
 </picture>;
}
