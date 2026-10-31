import Link from 'next/link';
import {business} from '../business';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Link className="brand" href="/">BAS <span>FOTOGRAFIE</span></Link>
            <p>Gezinnen, huisdieren en portretten in het Westland.</p>
          </div>
          <div className="footer-contact"><a className="footer-email" href={`mailto:${business.email}`}>{business.email}</a><a href={`tel:${business.telephone}`}>{business.displayTelephone}</a><a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Bas Fotografie</small>
          <nav aria-label="Voettekst">
            <Link href="/veelgestelde-vragen">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/voorbereiding">Voorbereiding</Link>
            <Link href="/klant">Klanten</Link>
            <Link href="/voorwaarden">Voorwaarden</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/beheer">Beheer</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
