import {getSql} from '@/db';
import {authReady} from '@/lib/admin-session';
export const dynamic='force-dynamic';
export async function GET(){
 const configured=!!process.env.DATABASE_URL&&!!process.env.ADMIN_PASSWORD_HASH&&!!process.env.SESSION_SECRET&&(!!process.env.BLOB_STORE_ID||!!process.env.BLOB_READ_WRITE_TOKEN);
 if(!configured)return Response.json({status:'configuration_required'},{status:503,headers:{'Cache-Control':'no-store'}});
 if(!authReady())return Response.json({status:'authentication_configuration_invalid'},{status:503,headers:{'Cache-Control':'no-store'}});
 try{await getSql().query('SELECT 1 FROM owner LIMIT 1',[]);return Response.json({status:'ok'},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({status:'database_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
