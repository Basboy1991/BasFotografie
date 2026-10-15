import type {Metadata} from 'next';
import {requireOwner} from '../auth';
import DownloadButton from './download-button';
import AdminShell from '../components/admin-shell';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Website exporteren',robots:{index:false,follow:false}};
export default async function ExportPage(){
 await requireOwner();
 return <AdminShell title="Website exporteren." description="Download je website als ZIP voor een back-up of overdracht.">
  <section className="cms-note"><h2>Volledige export</h2><p>De ZIP bevat de broncode van deze gepubliceerde versie, de actuele teksten, tarieven, portfolio, aanvragen, klantalbums en bijbehorende foto’s.</p>
  <p>De export bevat ook klantgegevens en toegangsgegevens in hashvorm. Bewaar de ZIP privé en upload de map <strong>backup</strong> niet naar een openbare GitHub-repository.</p>
  <p>API-sleutels en omgevingsvariabelen worden niet geëxporteerd. De broncode is geschikt voor GitHub en Vercel. Configureer bij herstel de database, privéopslag en beheerlogin volgens README.md.</p>
  <DownloadButton/><p>Bij veel foto’s kan de download even duren. Bij meer dan 2.000 foto’s of 1,5 GB verschijnt een melding.</p></section>
 </AdminShell>;
}
