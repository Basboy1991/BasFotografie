import type {Metadata} from 'next';
import {authReady} from '@/lib/admin-session';
import {signIn} from './actions';
import {safeReturnPath} from '../../owner-auth';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Inloggen bij beheer',robots:{index:false,follow:false}};
export default async function Login({searchParams}:{searchParams:Promise<{error?:string;return_to?:string}>}){
 const params=await searchParams;
 const messages:Record<string,string>={wachtwoord:'Het wachtwoord klopt niet.',limiet:'Te veel inlogpogingen. Probeer over 15 minuten opnieuw.',configuratie:'De beheerlogin is nog niet ingesteld.'};
 return <main className="wrap subpage"><div className="page-lead"><p className="eyebrow">Bas Fotografie / Beheer</p><h1>Welkom terug.</h1><p>Log in om je website en klantalbums te beheren.</p></div>{authReady()?<form action={signIn} className="panel"><input type="hidden" name="returnTo" value={safeReturnPath(params.return_to||'/beheer')}/><div className="field"><label htmlFor="password">Wachtwoord</label><input id="password" name="password" type="password" required maxLength={256} autoComplete="current-password"/></div>{params.error&&<p role="alert">{messages[params.error]||'Inloggen is niet gelukt.'}</p>}<button className="button">Inloggen</button></form>:<p>De beheerlogin wordt nog ingericht. Neem contact op met de eigenaar van de website.</p>}</main>;
}
