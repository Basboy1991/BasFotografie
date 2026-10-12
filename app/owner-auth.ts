import {redirect} from 'next/navigation';
import {adminSession,authReady,authVersion,OWNER_ID,OWNER_EMAIL} from '@/lib/admin-session';
export type OwnerUser={userId:string;displayName:string;email:string;fullName:string|null};
export async function getOwnerSession():Promise<OwnerUser|null>{
 if(!authReady())return null;
 const session=await adminSession();
 if(session.userId!==OWNER_ID||session.email!==OWNER_EMAIL||session.version!==authVersion())return null;
 return {userId:OWNER_ID,email:OWNER_EMAIL,displayName:'Bas',fullName:'Bas van der Scheer'};
}
export async function requireOwnerSession(returnTo:string){const user=await getOwnerSession();if(user)return user;redirect(ownerSignInPath(returnTo));}
export function ownerSignInPath(returnTo:string){return `/beheer/login?return_to=${encodeURIComponent(safeReturnPath(returnTo))}`;}
export function safeReturnPath(value:string){try{if(!value.startsWith('/')||value.startsWith('//'))return '/beheer';const url=new URL(value,'https://local.invalid');return url.origin==='https://local.invalid'&&url.pathname.startsWith('/beheer')&&!url.pathname.startsWith('/beheer/login')?url.pathname+url.search:'/beheer';}catch{return '/beheer';}}
