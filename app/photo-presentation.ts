import assets from './portfolio-image-manifest.json';
import {bundledPortfolioAssets} from './portfolio-assets';

export type PhotoFocus={x:number;y:number;mobileX:number;mobileY:number};
export const defaultPhotoFocus:PhotoFocus={x:50,y:43,mobileX:50,mobileY:40};
export function parsePhotoFocus(input:unknown):PhotoFocus{
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Controleer de uitsnede.');
 const result={} as PhotoFocus;
 for(const key of ['x','y','mobileX','mobileY'] as const){
  const value=(input as Record<string,unknown>)[key];
  if(typeof value!=='number'||!Number.isInteger(value)||value<0||value>100)throw new Error('Kies een uitsnede tussen 0 en 100.');
  result[key]=value;
 }
 return result;
}
export function bundledImage(url:string){
 const key=url.match(/^\/api\/image\/([a-zA-Z0-9._-]+)$/)?.[1];
 const source=key&&bundledPortfolioAssets[key]?'/'+bundledPortfolioAssets[key].replace(/^public\//,''):url;
 return {source,asset:(assets as Record<string,{width:number;height:number;variants:{width:number;url:string;bytes:number}[]}>)[source]};
}
export function landscapeHero(url:string){const {asset}=bundledImage(url);return !asset||asset.width>=asset.height;}
