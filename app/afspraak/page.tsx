import AppointmentForm from './appointment-form';
import {pageMetadata} from '../metadata';
import {readContent} from '../content';
import type {Metadata} from 'next';import Link from 'next/link';import {requestAppointment} from '../actions';import AppointmentTool from './appointment-tool';
export async function generateMetadata():Promise<Metadata>{return pageMetadata('/afspraak');}
export const dynamic='force-dynamic';
export default async function Appointment(){const copy=await readContent();const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());return <main className="wrap subpage"><AppointmentTool/><div className="page-lead"><p className="eyebrow">Afspraak aanvragen</p><h1 data-edit-key="appointmentHeading">{copy.appointmentHeading}</h1><p><span data-edit-key="appointmentIntro">{copy.appointmentIntro}</span> Je kunt ook rechtstreeks mailen naar <a href="mailto:basvanderscheer@gmail.com">basvanderscheer@gmail.com</a>.</p></div><AppointmentForm today={today} submissionId={crypto.randomUUID()}/></main>}
