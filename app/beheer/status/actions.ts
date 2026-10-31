'use server';
import {requireOwner} from '../auth';
import {storage} from '@/lib/storage';
import {startProbe,finishProbe} from '@/lib/storage-probe.mjs';
import {checkEmailConnection} from '@/lib/email.mjs';

export async function startStorageCheck(){await requireOwner();return startProbe(process.env.SESSION_SECRET);}
export async function finishStorageCheck(value:unknown){
 await requireOwner();
 try{
  const result=await finishProbe(value,process.env.SESSION_SECRET,storage.BUCKET);
  const messages:Record<string,string>={ok:'Geslaagd: uploaden, teruglezen en afscherming werken. Het tijdelijke bestand is opgeruimd.',not_found:'De upload is niet aangekomen. Controleer de foto-opslaginstellingen.',different_file:'Het controlebestand wijkt af. De controle is gestopt.',privacy_unverified:'Het bestand is teruggelezen en opgeruimd, maar de afscherming kon niet worden bevestigd.',cleanup_failed:'Het bestand is teruggelezen, maar opruimen is niet gelukt. Controleer de opslagverbinding.'};
  return {ok:result.ok,message:messages[result.code]||'De opslagcontrole is niet gelukt.'};
 }catch{return {ok:false,message:'De opslagcontrole is niet gelukt. Meld je opnieuw aan en controleer de opslaginstellingen.'};}
}
export async function checkEmailSetup(){await requireOwner();return checkEmailConnection();}
