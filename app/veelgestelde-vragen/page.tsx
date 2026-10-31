import {jsonLd} from '../../lib/structured-data.mjs';
import {pageMetadata} from '../metadata';
import {readContent} from '../content';
import type {Metadata} from 'next';
import Link from 'next/link';
import {getFaqs} from '../faq-data';

export async function generateMetadata():Promise<Metadata>{return pageMetadata('/veelgestelde-vragen');}
export default async function FAQ(){const [{items},copy]=await Promise.all([getFaqs(),readContent()]);const visible=items.filter(x=>x.published);return <main className="wrap subpage">{visible.length>0&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'FAQPage',mainEntity:visible.map(x=>({'@type':'Question',name:x.question,acceptedAnswer:{'@type':'Answer',text:x.answer}}))})}}/>}<div className="page-lead"><p className="eyebrow">Veelgestelde vragen</p><h1 data-edit-key="faqHeading">{copy.faqHeading}</h1><p data-edit-key="faqIntro">{copy.faqIntro}</p></div>{visible.length?<div className="faq-list">{visible.map(x=><details key={x.id}><summary>{x.question}</summary><p>{x.answer}</p></details>)}</div>:<p>Er zijn nog geen vragen gepubliceerd. Stel je vraag gerust rechtstreeks aan Bas.</p>}<p className="faq-links">Lees de <Link href="/voorbereiding">voorbereidingstips</Link> en bekijk de <Link href="/tarieven">tarieven</Link> en de <Link href="/werkwijze">werkwijze</Link>.</p><div className="page-cta"><h2>Staat je vraag er niet bij?</h2><Link className="button" href="/afspraak">Stel je vraag ↗</Link></div></main>}
