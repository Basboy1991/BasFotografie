import type {Metadata} from 'next';
import Link from 'next/link';
import {getDb} from '@/db';
import {requests} from '@/db/schema';
import {desc,eq} from 'drizzle-orm';
import {requireOwner} from '../auth';
import AdminShell from '../components/admin-shell';
import {setRequestStatus,deleteRequest} from '../../actions';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Afspraakaanvragen beheren',robots:{index:false,follow:false}};
const filters=[{value:'alle',label:'Alle'},{value:'nieuw',label:'Nieuw'},{value:'in behandeling',label:'In behandeling'},{value:'afgerond',label:'Afgerond'}] as const;
export default async function RequestsAdmin({searchParams}:{searchParams:Promise<{status?:string}>}){
 await requireOwner();const query=(await searchParams).status;
 const status=filters.some(x=>x.value===query)?query:'alle';
 const db=getDb();const appointments=await db.select().from(requests).where(status==='alle'?undefined:eq(requests.status,status!)).orderBy(desc(requests.createdAt));
 return <AdminShell title="Afspraakaanvragen." description="Bekijk berichten en houd bij welke aanvragen je hebt afgehandeld. Nieuwe aanvragen worden periodiek gecontroleerd voor een e-mailmelding. Controleer ook zelf regelmatig dit overzicht."><nav className="request-filters" aria-label="Aanvragen filteren">{filters.map(x=><Link key={x.value} href={x.value==='alle'?'/beheer/afspraken':`/beheer/afspraken?status=${encodeURIComponent(x.value)}`} aria-current={status===x.value?'page':undefined}>{x.label}</Link>)}</nav><p className="request-count">{appointments.length} {appointments.length===1?'aanvraag':'aanvragen'} in dit overzicht</p><div className="admin-list cms-request-list">{appointments.length?appointments.map(x=><article className="admin-card" key={x.id}><span className="eyebrow">{new Date(x.createdAt).toLocaleDateString('nl-NL')} · {x.status}</span><h2>{x.name} · {x.type}</h2><p><a href={`mailto:${x.email}`}>{x.email}</a> {x.date&&`· Gewenste datum: ${x.date}`}</p>{x.message&&<p>{x.message}</p>}<form action={setRequestStatus} className="inline-actions"><input type="hidden" name="id" value={x.id}/><select name="status" defaultValue={x.status} aria-label={`Status voor ${x.name}`}><option>nieuw</option><option>in behandeling</option><option>afgerond</option></select><button>Opslaan</button></form><details className="request-delete"><summary>Aanvraag verwijderen</summary><p>Dit verwijdert de aanvraag definitief. Typ het e-mailadres ter bevestiging.</p><form action={deleteRequest}><input type="hidden" name="id" value={x.id}/><label htmlFor={`confirm-${x.id}`}>{x.email}</label><input id={`confirm-${x.id}`} name="confirm" type="email" required autoComplete="off"/><button type="submit" className="quiet-button">Definitief verwijderen</button></form></details></article>):<p className="empty-state">Geen aanvragen met deze status.</p>}</div></AdminShell>;
}
