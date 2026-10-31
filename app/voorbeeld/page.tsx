import type {Metadata} from 'next';
import Link from 'next/link';
import DeviceReview from '../components/device-review';

export const metadata: Metadata = {title: 'Website bekijken op elk scherm', robots: {index: false, follow: false}, alternates: {canonical: '/voorbeeld'}};

export default function PreviewPage() {
  return <main className="wrap subpage device-review-page">
    <div className="page-lead"><p className="eyebrow">Bas Fotografie / Voorbeeld</p><h1>Je website op elk scherm.</h1><p>Bekijk je pagina’s op telefoon, tablet of desktop. Dit is dezelfde website, op de gekozen schermbreedte.</p></div>
    <DeviceReview/>
    <p className="cms-note"><Link href="/beheer/teksten">Ga naar de website-editor ↗</Link></p>
  </main>;
}
