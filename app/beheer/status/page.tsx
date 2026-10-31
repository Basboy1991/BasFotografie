import type {Metadata} from 'next';
import Link from 'next/link';
import {requireOwner} from '../auth';
import AdminShell from '../components/admin-shell';
import SystemChecks from './checks';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Website controleren',robots:{index:false,follow:false}};
export default async function Status(){await requireOwner();return <AdminShell title="Website controleren." description="Controleer de verbindingen die je nodig hebt voor foto’s en aanvragen."><SystemChecks/><p className="cms-note">Een opgeslagen aanvraag vind je altijd bij <Link href="/beheer/afspraken">Aanvragen</Link>. Je e-mailvoorbeelden en de handmatige testverzending staan bij <Link href="/beheer/emails">E-mails</Link>.</p></AdminShell>;}
