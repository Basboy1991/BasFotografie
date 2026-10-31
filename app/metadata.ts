import type {Metadata} from 'next';
import {readSeo} from './seo-data';
import {getCategoryAlbum,type CategorySlug} from './portfolio-data';
import {bundledImage} from './photo-presentation';

async function sharingImage(path:string){
 const category=path.match(/^\/(?:diensten|portfolio)\/(gezinnen|huisdieren|portretten)$/)?.[1] as CategorySlug|undefined;
 if(category){
  const album=await getCategoryAlbum(category);
  if(!album.sample){const image=album.images[0],{source,asset}=bundledImage(image.url);return {url:source,alt:image.alt,...(asset?{width:asset.width,height:asset.height}:{})};}
 }
 return {url:'/portfolio-eigen/hond-met-speeltje.jpg',width:1536,height:1152,alt:'Huisdierenfotografie van Bas Fotografie'};
}

export async function pageMetadata(path:string,options:{noIndex?:boolean;absoluteTitle?:boolean}={}):Promise<Metadata>{
 const [seo,image]=await Promise.all([readSeo(path),sharingImage(path)]);
 const title=seo?.title||'Bas Fotografie';
 const fullTitle=title.includes('Bas Fotografie')?title:`${title} | Bas Fotografie`;
 return {
  title:options.absoluteTitle||title.includes('Bas Fotografie')?{absolute:title}:title,
  description:seo?.description,
  alternates:{canonical:path},
  ...(process.env.VERCEL_ENV==='preview'?{robots:{index:false,follow:false}}:options.noIndex?{robots:{index:false,follow:true}}:{}),
  openGraph:{title:fullTitle,description:seo?.description,url:path,type:'website',locale:'nl_NL',siteName:'Bas Fotografie',images:[image]},
  twitter:{card:'summary_large_image',title:fullTitle,description:seo?.description,images:[image.url]},
 };
}
