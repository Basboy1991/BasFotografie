'use server';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {createHmac} from 'node:crypto';
import {verifyPassword} from '@/lib/password.mjs';
import {adminSession,authReady,authVersion,OWNER_ID,OWNER_EMAIL} from '@/lib/admin-session';
import {getSql,getDb} from '@/db';
import {owner} from '@/db/schema';
import {safeReturnPath} from '../../owner-auth';
export async function signIn(form:FormData){
 const returnTo=safeReturnPath(String(form.get('returnTo')||'/beheer'));
 if(!authReady())redirect('/beheer/login?error=configuratie');
 const requestHeaders=await headers();
 const ip=requestHeaders.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const key=createHmac('sha256',process.env.SESSION_SECRET!).update(ip).digest('hex');
 const now=Date.now();
 const result=await getSql().query(`INSERT INTO admin_login_attempts (key,window_start,attempts) VALUES ($1,$2,1)
 ON CONFLICT (key) DO UPDATE SET attempts=CASE WHEN admin_login_attempts.window_start<$2-900000 THEN 1 ELSE admin_login_attempts.attempts+1 END,
 window_start=CASE WHEN admin_login_attempts.window_start<$2-900000 THEN $2 ELSE admin_login_attempts.window_start END RETURNING attempts`,[key,now]);
 if(Number(result[0]?.attempts)>10)redirect('/beheer/login?error=limiet');
 const password=String(form.get('password')||'');
 if(!await verifyPassword(password,process.env.ADMIN_PASSWORD_HASH))redirect('/beheer/login?error=wachtwoord');
 await getDb().insert(owner).values({id:1,userId:OWNER_ID}).onConflictDoNothing();
 const session=await adminSession();session.userId=OWNER_ID;session.email=OWNER_EMAIL;session.version=authVersion();await session.save();
 await getSql().query('DELETE FROM admin_login_attempts WHERE key=$1',[key]);
 redirect(returnTo);
}
export async function signOut(){const session=await adminSession();session.destroy();redirect('/beheer/login');}
