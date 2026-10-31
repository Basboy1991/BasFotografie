import Link from 'next/link';
import type {ContentKey} from '../visual-fields';
const fields={
 gezinnen:['familyPracticalHeading','familyPracticalBody','familyPrepHeading','familyPrepBody'],
 huisdieren:['petPracticalHeading','petPracticalBody','petPrepHeading','petPrepBody'],
 portretten:['portraitPracticalHeading','portraitPracticalBody','portraitPrepHeading','portraitPrepBody'],
} as const;
export default function ServiceDetails({kind,copy}:{kind:keyof typeof fields;copy:Record<ContentKey,string>}){
 const [heading,body,prepHeading,prepBody]=fields[kind];
 return <>
  <section className="service-notes" aria-label="Praktische informatie">
   <div><h2 data-edit-key={heading}>{copy[heading]}</h2><p data-edit-key={body}>{copy[body]}</p></div>
   <div><h2 data-edit-key={prepHeading}>{copy[prepHeading]}</h2><p data-edit-key={prepBody}>{copy[prepBody]}</p><Link className="text-link" href={`/voorbereiding#${kind}`}>Lees de voorbereidingstips ↗</Link></div>
  </section>
  <section className="service-delivery"><h2 data-edit-key="serviceDeliveryHeading">{copy.serviceDeliveryHeading}</h2><p data-edit-key="serviceDeliveryBody">{copy.serviceDeliveryBody}</p><div className="related-links"><Link href="/werkwijze">Van aanvraag tot klantalbum ↗</Link><Link href="/tarieven">Pakketten en inbegrepen foto’s ↗</Link><Link href="/contact">Een vraag stellen aan Bas ↗</Link></div></section>
 </>;
}
