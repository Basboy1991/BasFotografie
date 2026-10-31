import Link from 'next/link';
import {business} from '../business';
import {readContent} from '../content';
import {pageMetadata} from '../metadata';
import Breadcrumbs from '../components/breadcrumbs';
export async function generateMetadata(){return pageMetadata('/contact');}
export default async function Contact(){const copy=await readContent();return <main className="wrap subpage">
 <Breadcrumbs items={[{name:'Home',path:'/'},{name:'Contact',path:'/contact'}]}/>
 <div className="page-lead"><p className="eyebrow">Contact / Bas Fotografie</p><h1 data-edit-key="contactHeading">{copy.contactHeading}</h1><p data-edit-key="contactIntro">{copy.contactIntro}</p></div>
 <div className="contact-layout">
  <section className="contact-details" aria-labelledby="direct-contact"><h2 id="direct-contact" data-edit-key="contactDirectHeading">{copy.contactDirectHeading}</h2><dl><div><dt>E-mail</dt><dd><a href={`mailto:${business.email}`}>{business.email}</a></dd></div><div><dt>Telefoon</dt><dd><a href={`tel:${business.telephone}`}>{business.displayTelephone}</a></dd></div></dl><div className="related-links"><a href={business.whatsapp} target="_blank" rel="noopener noreferrer">Stuur een WhatsApp ↗</a><a href={business.instagram} target="_blank" rel="noopener noreferrer">Bekijk Instagram ↗</a></div></section>
  <section className="contact-location"><p className="eyebrow">Op locatie</p><h2 data-edit-key="contactAreaHeading">{copy.contactAreaHeading}</h2><p data-edit-key="contactAreaBody">{copy.contactAreaBody}</p><Link className="button" href="/afspraak">Vraag een fotosessie aan ↗</Link></section>
 </div>
 <section className="contact-help"><h2 data-edit-key="contactMessageHeading">{copy.contactMessageHeading}</h2><p data-edit-key="contactMessageBody">{copy.contactMessageBody}</p><div className="related-links"><Link href="/voorbereiding">Je fotoshoot voorbereiden ↗</Link><Link href="/veelgestelde-vragen">Veelgestelde vragen ↗</Link><Link href="/tarieven">Bekijk de tarieven ↗</Link></div></section>
 </main>;}
