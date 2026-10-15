'use client';
import { useEffect } from 'react';

type ModelContext = { registerTool: (tool: {name:string;title:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>Promise<object>}, options:{signal:AbortSignal})=>void|Promise<void> };
export default function AppointmentTool(){useEffect(()=>{
  const context=(document as Document & {modelContext?:ModelContext}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  Promise.resolve(context.registerTool({name:'prepare_appointment_request',title:'Afspraakaanvraag invullen',description:'Vul een afspraakaanvraag voor Bas Fotografie in. De bezoeker kan de aanvraag daarna zelf versturen.',inputSchema:{type:'object',properties:{name:{type:'string'},email:{type:'string'},type:{type:'string',enum:['Gezin','Huisdier','Portret','Anders']},message:{type:'string'}},required:['name','email','type'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){const data=input as Record<string,unknown>;if(typeof data.name!=='string'||data.name.trim().length<2||typeof data.email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||!['Gezin','Huisdier','Portret','Anders'].includes(String(data.type))||typeof data.message==='string'&&data.message.length>3000)throw Error('Controleer de aanvraaggegevens.');for(const [key,value] of Object.entries(data)){const field=document.querySelector(`[name="${key}"]`) as unknown as {value:string;dispatchEvent:(event:Event)=>boolean}|null;if(field&&typeof value==='string'){field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));}}return {status:'ingevuld',next:'Controleer de gegevens en verstuur de aanvraag via de knop.'};}},{signal:lifecycle.signal})).catch(()=>{});
  return()=>lifecycle.abort();
},[]);return null;}
