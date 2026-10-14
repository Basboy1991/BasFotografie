import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {createHash} from 'node:crypto';
import {isPasswordHash} from './password.mjs';
export type AdminSession={userId?:string;email?:string;version?:string};
export const OWNER_ID='bas-owner';
export const OWNER_EMAIL='bas@avonturia.nl';
export const authReady=()=>isPasswordHash(process.env.ADMIN_PASSWORD_HASH)&&!!process.env.SESSION_SECRET&&process.env.SESSION_SECRET.length>=32;
export const authVersion=()=>createHash('sha256').update(process.env.ADMIN_PASSWORD_HASH||'').digest('hex');
export async function adminSession(){if(!authReady())throw new Error('Beheerlogin is nog niet ingesteld.');return getIronSession<AdminSession>(await cookies(),{password:process.env.SESSION_SECRET!,cookieName:'bf_admin',ttl:60*60*8,cookieOptions:{secure:process.env.NODE_ENV==='production',httpOnly:true,sameSite:'strict',path:'/'}});}
