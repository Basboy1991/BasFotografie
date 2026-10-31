import Link from 'next/link';
import {readContent} from '../content';
import {pageMetadata} from '../metadata';
import Breadcrumbs from '../components/breadcrumbs';
const sections=[
 ['kleding','prepClothingHeading','prepClothingBody',null,null],
 ['gezinnen','prepFamilyHeading','prepFamilyBody','/diensten/gezinnen','Meer over gezinsfotografie'],
 ['huisdieren','prepPetsHeading','prepPetsBody','/diensten/huisdieren','Meer over huisdierenfotografie'],
 ['portretten','prepPortraitHeading','prepPortraitBody','/diensten/portretten','Meer over portretfotografie'],
 ['locatie','prepLocationHeading','prepLocationBody',null,null],
 ['na-de-shoot','prepDeliveryHeading','prepDeliveryBody','/werkwijze','Bekijk de volledige werkwijze'],
] as const;
export async function generateMetadata(){return pageMetadata('/voorbereiding');}
export default async function Preparation(){const copy=await readContent();return <main className="wrap subpage">
 <Breadcrumbs items={[{name:'Home',path:'/'},{name:'Voorbereiding',path:'/voorbereiding'}]}/>
 <div className="page-lead"><p className="eyebrow">Voor je fotosessie</p><h1 data-edit-key="prepHeading">{copy.prepHeading}</h1><p data-edit-key="prepIntro">{copy.prepIntro}</p></div>
 <nav className="preparation-index" aria-label="Voorbereiding per onderwerp">{sections.map(([id,heading])=><a href={`#${id}`} key={id}>{copy[heading]}</a>)}</nav>
 <div className="preparation-sections">{sections.map(([id,heading,body,href,label],index)=><section id={id} key={id}><span className="eyebrow" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h2 data-edit-key={heading}>{copy[heading]}</h2><p data-edit-key={body}>{copy[body]}</p>{href&&<Link className="text-link" href={href}>{label} ↗</Link>}</div></section>)}</div>
 <div className="page-cta"><h2>Twijfel je ergens over?</h2><div className="cta-links"><Link className="text-link" href="/contact">Stel je vraag aan Bas ↗</Link><Link className="button" href="/afspraak">Plan je fotosessie ↗</Link></div></div>
 </main>;}
