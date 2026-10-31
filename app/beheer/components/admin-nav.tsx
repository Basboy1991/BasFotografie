'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const main = [['/beheer','Overzicht'],['/beheer/teksten','Website bewerken'],['/beheer/portfolio','Foto’s'],['/beheer/tarieven','Tarieven'],['/beheer/afspraken','Aanvragen'],['/beheer/albums','Klantalbums']] as const;
const extra = [['/beheer/blokken','Homepageblokken'],['/beheer/faq','FAQ'],['/beheer/seo','SEO'],['/beheer/emails','E-mails'],['/beheer/status','Website controleren'],['/beheer/export','Export']] as const;

export default function AdminNav() {
  const path = usePathname();
  const active = (href: string) => path === href || href !== '/beheer' && path.startsWith(href + '/');
  return <nav className="cms-nav" aria-label="CMS navigatie">
    {main.map(([href,label]) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>)}
    <details className="cms-more" open={extra.some(([href]) => active(href))}>
      <summary>Meer beheer</summary>
      <div>{extra.map(([href,label]) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>)}</div>
    </details>
  </nav>;
}
