import type {Metadata} from 'next';
import {requireOwner} from '../auth';
import AdminShell from '../components/admin-shell';
import {readContent} from '../../content';
import VisualEditor from './visual-editor';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Website visueel bewerken',robots:{index:false,follow:false}};
export default async function TextAdmin(){await requireOwner();const copy=await readContent();return <AdminShell title="Website bewerken." description="Kies een pagina en klik in het voorbeeld op een gemarkeerde tekst. Je ziet je wijziging meteen; pas met Opslaan wordt die zichtbaar voor bezoekers."><VisualEditor initial={copy}/></AdminShell>}
