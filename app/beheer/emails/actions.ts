'use server';
import {requireOwner} from '../auth';
import {emailConfiguration,sendConfiguredEmail} from '@/lib/email.mjs';
import {clientReceipt,ownerNotice} from '../../email-templates';
import {redirect} from 'next/navigation';
export async function sendEmailTest(){
 await requireOwner();const config=emailConfiguration();
 let result='failed';
 try{
  const id=crypto.randomUUID();
  for(const [channel,template] of [['client',clientReceipt('Bas','test')],['owner',ownerNotice('test')]] as const){
   await sendConfiguredEmail({to:config.to,...template,subject:`[TEST] ${template.subject}`,reference:`setup-test/${id}/${channel}`});
  }
  result='sent';
 }catch{ /* Show a safe status without exposing provider credentials or raw responses. */ }
 redirect(`/beheer/emails?test=${result}`);
}
