import type {Metadata} from 'next';
import {readSeo} from './seo-data';

export async function pageMetadata(path:string,options:{noIndex?:boolean;absoluteTitle?:boolean}={}):Promise<Metadata>{
 const seo=await readSeo(path);
 const title=seo?.title||'Bas Fotografie';
 const fullTitle=title.includes('Bas Fotografie')?title:`${title} | Bas Fotografie`;
 return {
  title:options.absoluteTitle?{absolute:title}:title,
  description:seo?.description,
  alternates:{canonical:path},
  robots:options.noIndex?{index:false,follow:true}:undefined,
  openGraph:{title:fullTitle,description:seo?.description,url:path,type:'website',locale:'nl_NL',siteName:'Bas Fotografie',images:[{url:'/portfolio-eigen/hond-met-speeltje.jpg',width:1536,height:1152,alt:'Huisdierenfotografie van Bas Fotografie'}]},
  twitter:{card:'summary_large_image',title:fullTitle,description:seo?.description,images:['/portfolio-eigen/hond-met-speeltje.jpg']},
 };
}
