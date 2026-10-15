import {readSeo} from './seo-data';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getPortfolio} from './portfolio-data';
import {readContent} from './content';
import {type HomeBlock} from './home-blocks';
import {readHomeBlocks} from './home-blocks-data';
import {siteUrl} from './site-url';
import HeroSlideshow from './components/hero-slideshow';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const seo=await readSeo('/');return {title:{absolute:seo?.title||'Bas Fotografie'},description:seo?.description,alternates:{canonical:'/'}};}
export default async function Home(){
 const [{images,sample,heroSample,heroImages},copy,blocks]=await Promise.all([getPortfolio(),readContent(),readHomeBlocks()]);
 const graph={'@context':'https://schema.org','@type':'WebSite',name:'Bas Fotografie',url:siteUrl,inLanguage:'nl-NL'};
 function render(block:HomeBlock){
  if(block.type==='core')switch(block.id){
   case 'hero':return <section key={block.id} className="hero wrap"><div className="hero-copy"><p className="eyebrow" data-edit-key="homeHeroEyebrow">{copy.homeHeroEyebrow}</p><h1><span data-edit-key="homeHeroTop">{copy.homeHeroTop}</span><br/><em data-edit-key="homeHeroBottom">{copy.homeHeroBottom}</em></h1><p data-edit-key="homeIntro">{copy.homeIntro}</p><Link className="button" href="/afspraak"><span data-edit-key="homeHeroButton">{copy.homeHeroButton}</span></Link></div><HeroSlideshow images={heroImages} sample={heroSample}/></section>;
   case 'services':return <section key={block.id} className="section wrap"><div className="section-top"><div><p className="eyebrow" data-edit-key="homeServicesEyebrow">{copy.homeServicesEyebrow}</p><h2 data-edit-key="homeServicesHeading">{copy.homeServicesHeading}</h2></div><p data-edit-key="homeServicesIntro">{copy.homeServicesIntro}</p></div><div className="service-grid">{([
    ['gezinnen','homeFamilyLabel','homeFamilyHeading','homeFamilyDescription','homeFamilyLink'],
    ['huisdieren','homePetsLabel','homePetsHeading','homePetsDescription','homePetsLink'],
    ['portretten','homePortraitsLabel','homePortraitsHeading','homePortraitsDescription','homePortraitsLink'],
   ] as const).map(([slug,label,heading,description,link])=><Link key={slug} href={`/diensten/${slug}`}><span data-edit-key={label}>{copy[label]}</span><h3 data-edit-key={heading}>{copy[heading]}</h3><p data-edit-key={description}>{copy[description]}</p><b data-edit-key={link}>{copy[link]}</b></Link>)}</div></section>;
   case 'portfolio':return <section key={block.id} className="portfolio-preview"><div className="wrap"><div className="section-top"><div><p className="eyebrow" data-edit-key="homePortfolioEyebrow">{copy.homePortfolioEyebrow}</p><h2 data-edit-key="homePortfolioHeading">{copy.homePortfolioHeading}</h2></div><Link className="text-link" href="/portfolio"><span data-edit-key="homePortfolioLink">{copy.homePortfolioLink}</span></Link></div>{sample&&<p className="sample-note">Albums zonder eigen foto’s tonen duidelijk gemarkeerde voorbeeldbeelden.</p>}<div className="portfolio-grid">{images.slice(0,3).map((x,i)=><Link className={`photo-card photo-${i%3}`} href={`/portfolio/${['gezinnen','huisdieren','portretten'][i]}`} key={x.url}><img src={x.url} alt={x.alt} loading="lazy"/><div><span>Album 0{i+1}</span><h3>{['Gezinnen','Huisdieren','Portretten'][i]}</h3></div></Link>)}</div></div></section>;
   case 'closing':return <section key={block.id} className="section wrap closing"><p className="eyebrow" data-edit-key="homeClosingEyebrow">{copy.homeClosingEyebrow}</p><h2><span data-edit-key="homeClosingHeadingTop">{copy.homeClosingHeadingTop}</span><br/><em data-edit-key="homeClosingHeadingBottom">{copy.homeClosingHeadingBottom}</em></h2><p data-edit-key="homeClosingIntro">{copy.homeClosingIntro}</p><Link className="button" href="/afspraak"><span data-edit-key="homeClosingButton">{copy.homeClosingButton}</span></Link></section>;
  }
  return <section className="section wrap home-custom-block" key={block.id}><div className={block.type==='image'?'home-custom-image-layout':''}><div><p className="eyebrow">Bas Fotografie</p><h2>{block.heading}</h2><p>{block.body}</p>{block.type==='cta'&&<Link className="button" href={block.href}>{block.button} ↗</Link>}</div>{block.type==='image'&&<img src={`/api/image/${block.imageKey}`} alt={block.alt} loading="lazy"/>}</div></section>;
 }
 return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,'\\u003c')}} />{blocks.map(render)}</main>;
}
