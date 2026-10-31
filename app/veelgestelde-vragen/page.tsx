import {readContent} from '../content';
import type {Metadata} from 'next';
import Link from 'next/link';
import {getFaqs} from '../faq-data';
import {readSeo} from '../seo-data';

export async function generateMetadata():Promise<Metadata>{const seo=await readSeo('/veelgestelde-vragen');return {title:seo?.title,description:seo?.description,alternates:{canonical:'/veelgestelde-vragen'}};}
export default async function FAQ(){const [{items},copy]=await Promise.all([getFaqs(),readContent()]);const visible=items.filter(x=>x.published);return <main className="wrap subpage"><div className="page-lead"><p className="eyebrow">Veelgestelde vragen</p><h1 data-edit-key="faqHeading">{copy.faqHeading}</h1><p data-edit-key="faqIntro">{copy.faqIntro}</p></div>{visible.length?<div className="faq-list">{visible.map(x=><details key={x.id}><summary>{x.question}</summary><p>{x.answer}</p></details>)}</div>:<p>Er zijn nog geen vragen gepubliceerd. Stel je vraag gerust rechtstreeks aan Bas.</p>}<p className="faq-links">Bekijk ook de <Link href="/tarieven">tarieven</Link> en de <Link href="/werkwijze">werkwijze</Link>.</p><div className="page-cta"><h2>Staat je vraag er niet bij?</h2><Link className="button" href="/afspraak">Stel je vraag ↗</Link></div></main>}
