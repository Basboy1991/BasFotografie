'use client';
import {useActionState,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {submitAppointment} from '../actions';

export default function AppointmentForm({today,submissionId}:{today:string;submissionId:string}){
 const [state,action,pending]=useActionState(submitAppointment,{message:''});
 const [fields,setFields]=useState({name:'',email:'',type:'',date:'',message:''});
 const error=useRef<HTMLParagraphElement>(null);
 const change=(name:keyof typeof fields,value:string)=>setFields(current=>({...current,[name]:value}));
 useEffect(()=>{if(state.message)error.current?.focus();},[state]);
 return <form action={action} className="panel appointment-form" aria-busy={pending}>
  <input type="hidden" name="submissionId" value={submissionId}/>
  <fieldset className="cms-save-fields" disabled={pending}>
   <div className="form-grid">
    <div className="field"><label htmlFor="name">Naam</label><input id="name" name="name" autoComplete="name" minLength={2} maxLength={120} value={fields.name} onChange={e=>change('name',e.target.value)} required/></div>
    <div className="field"><label htmlFor="email">E-mailadres</label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={fields.email} onChange={e=>change('email',e.target.value)} required/></div>
   </div>
   <div className="form-grid">
    <div className="field"><label htmlFor="type">Soort fotosessie</label><select id="type" name="type" value={fields.type} onChange={e=>change('type',e.target.value)} required><option value="">Kies een optie</option><option>Gezin</option><option>Huisdier</option><option>Portret</option><option>Anders</option></select></div>
    <div className="field"><label htmlFor="date">Gewenste datum (optioneel)</label><input id="date" name="date" type="date" min={today} value={fields.date} onChange={e=>change('date',e.target.value)}/></div>
   </div>
   <div className="field"><label htmlFor="message">Wensen of vragen</label><textarea id="message" name="message" maxLength={3000} placeholder="Wie wil je op de foto, en wat vind je belangrijk?" value={fields.message} onChange={e=>change('message',e.target.value)}/></div>
   <div className="trap" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
   <p className="form-note">Ik gebruik je gegevens om op je aanvraag te reageren. Lees meer op de <Link href="/privacy">privacypagina</Link>. Bekijk de <Link href="/voorbereiding">voorbereidingstips</Link>, de <Link href="/voorwaarden">praktische afspraken</Link> en <Link href="/veelgestelde-vragen">veelgestelde vragen</Link>.</p>
   <button className="button" type="submit">{pending?'Aanvraag versturen…':'Verstuur aanvraag ↗'}</button>
  </fieldset>
  {state.message&&<p ref={error} className="cms-save-message is-error" role="alert" tabIndex={-1}>{state.message}</p>}
 </form>;
}
