'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useRef} from 'react';

const links = [
  ['/portfolio', 'Portfolio'],
  ['/werkwijze', 'Werkwijze'],
  ['/tarieven', 'Tarieven'],
  ['/over-mij', 'Over Bas'],
  ['/klant', 'Klanten'],
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  function closeMenu() { menu.current?.removeAttribute('open'); }

  return (
    <header className="site-header">
      <div className="nav wrap">
        <Link className="brand" href="/" aria-label="Bas Fotografie, naar de homepage" onClick={closeMenu}>
          BAS <span>FOTOGRAFIE</span>
        </Link>
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          {links.map(([href, label]) => (
            <Link href={href} key={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>
          ))}
          <Link href="/afspraak" className="nav-cta" aria-current={current('/afspraak') ? 'page' : undefined}>Plan je shoot</Link>
        </nav>
        <details className="mobile-menu" ref={menu} onKeyDown={event => {
          if (event.key === 'Escape') {
            closeMenu();
            menu.current?.querySelector('summary')?.focus();
          }
        }}>
          <summary><span className="menu-icon" aria-hidden="true"/>Menu</summary>
          <nav aria-label="Mobiele navigatie" onClick={closeMenu}>
            {links.map(([href, label]) => (
              <Link href={href} key={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>
            ))}
            <Link href="/veelgestelde-vragen" aria-current={current('/veelgestelde-vragen') ? 'page' : undefined}>Veelgestelde vragen</Link>
            <Link href="/afspraak" className="nav-cta">Plan je shoot</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
