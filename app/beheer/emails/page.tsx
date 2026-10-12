import type {Metadata} from 'next';
import {requireOwner} from '../auth';
import AdminShell from '../components/admin-shell';
import {clientReceipt,ownerNotice} from '../../email-templates';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'E-mailvoorbeelden',robots:{index:false,follow:false}};
export default async function EmailPreviews(){await requireOwner();const client=clientReceipt('Voornaam'),owner=ownerNotice('voorbeeld');return <AdminShell title="E-mailvoorbeelden." description="Bekijk de ontvangstbevestiging en melding in de stijl van de website. Dit zijn voorbeelden. Automatische verzending is nog niet gekoppeld."><div className="email-previews"><section><p className="eyebrow">Klant · voorbereid</p><h2>{client.subject}</h2><iframe title="Voorbeeld ontvangstbevestiging" srcDoc={client.html} sandbox=""/></section><section><p className="eyebrow">Bas · melding</p><h2>{owner.subject}</h2><iframe title="Voorbeeld interne melding" srcDoc={owner.html} sandbox=""/></section></div></AdminShell>}
