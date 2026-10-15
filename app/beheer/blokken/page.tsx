import type {Metadata} from 'next';
import {requireOwner} from '../auth';
import AdminShell from '../components/admin-shell';
import {readHomeBlocks} from '../../home-blocks-data';
import {getDb} from '@/db';
import {portfolio} from '@/db/schema';
import {eq} from 'drizzle-orm';
import BlockEditor from './block-editor';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Homepageblokken beheren',robots:{index:false,follow:false}};
export default async function BlocksAdmin(){
 await requireOwner();
 const [blocks,photos]=await Promise.all([readHomeBlocks(),getDb().select({imageKey:portfolio.imageKey,title:portfolio.title}).from(portfolio).where(eq(portfolio.published,true))]);
 return <AdminShell title="Homepage indelen." description="Sleep onderdelen naar een andere plek of gebruik de pijltjes. Voeg eigen tekst, een knop of een portfoliofoto toe. De indeling verandert pas na opslaan."><BlockEditor initial={blocks} photos={photos}/></AdminShell>;
}
