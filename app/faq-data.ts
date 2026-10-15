import {getDb} from '@/db';
import {faqs,siteContent} from '@/db/schema';
import {asc,eq} from 'drizzle-orm';

export const defaultFaqs=[
 {question:'Is mijn afspraak direct bevestigd na het invullen van het formulier?',answer:'Nee. Het formulier is een aanvraag. Bas neemt contact op om de wensen en een passend moment te bespreken. De afspraak staat pas vast wanneer jullie die samen bevestigen.'},
 {question:'Hoe bereid ik me voor op een fotosessie?',answer:'Vertel vooraf wie er op de foto komen, wat je graag terug wilt zien en of er zaken zijn waar ik rekening mee moet houden. Voor gezinnen en dieren helpt het om een plek te kiezen waar iedereen zich prettig voelt.'},
 {question:'Wat kost een fotosessie?',answer:'Op de tarievenpagina staat per pakket de actuele prijs, de sessieduur en het aantal bewerkte foto’s. Voor andere wensen bespreken we vooraf een voorstel.'},
 {question:'Waar fotografeer je?',answer:'Ik fotografeer op locatie in het Westland. Heb je een plek buiten het Westland in gedachten? Neem contact op; dan bespreken we wat mogelijk is en eventuele reiskosten vooraf.'},
 {question:'Hoe krijg ik mijn foto’s?',answer:'Na de selectie en bewerking deelt Bas een persoonlijke link en een apart wachtwoord voor jouw afgeschermde klantalbum. Daarmee kun je de foto’s bekijken en downloaden.'},
 {question:'Ik ben mijn albumgegevens kwijt. Wat nu?',answer:'Neem contact op via het aanvraagformulier. Bas kan een nieuwe link en een nieuw wachtwoord maken; de oude gegevens werken daarna niet meer.'},
];

export async function getFaqs(){
 const db=getDb();
 const [marker,rows]=await Promise.all([db.select().from(siteContent).where(eq(siteContent.key,'faq:initialized')),db.select().from(faqs).orderBy(asc(faqs.position),asc(faqs.id))]);
 return {initialized:marker.length>0,items:marker.length?rows:defaultFaqs.map((item,index)=>({id:`voorbeeld-${index}`,position:index,published:true,...item}))};
}
