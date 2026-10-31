import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Link className="brand" href="/">BAS <span>FOTOGRAFIE</span></Link>
            <p>Gezinnen, huisdieren en portretten in het Westland.</p>
          </div>
          <a className="footer-email" href="mailto:basvanderscheer@gmail.com">basvanderscheer@gmail.com</a>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Bas Fotografie</small>
          <nav aria-label="Voettekst">
            <Link href="/veelgestelde-vragen">FAQ</Link>
            <Link href="/afspraak">Contact</Link>
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
