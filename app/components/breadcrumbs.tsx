import Link from 'next/link';
import {jsonLd} from '../../lib/structured-data.mjs';
import {breadcrumbSchema} from '../site-schema';
export default function Breadcrumbs({items}:{items:{name:string;path:string}[]}){return <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbSchema(items))}}/>
 <nav className="breadcrumb" aria-label="Kruimelpad">{items.map((item,index)=><span key={item.path}>{index>0&&<span aria-hidden="true"> / </span>}{index===items.length-1?<span aria-current="page">{item.name}</span>:<Link href={item.path}>{item.name}</Link>}</span>)}</nav>
</>;}
