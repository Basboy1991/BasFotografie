import {signOut} from '../login/actions';
import Link from 'next/link';
import AdminNav from './admin-nav';
export default function AdminShell({children,title,description}:{children:React.ReactNode;title:string;description:string}){return <main className="wrap subpage cms"><div className="cms-top"><div><p className="eyebrow">Bas Fotografie / CMS</p><h1>{title}</h1><p>{description}</p></div><Link href="/" className="text-link">Bekijk website ↗</Link></div><AdminNav/><form action={signOut} style={{marginBottom:24}}><button className="quiet-button">Uitloggen</button></form>{children}</main>}
