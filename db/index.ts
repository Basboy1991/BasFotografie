import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';
import * as schema from './schema';
export function getSql(){
 const url=process.env.DATABASE_URL;
 if(!url)throw new Error('De database is nog niet gekoppeld.');
 return neon(url);
}
export function getDb(){return drizzle(getSql(),{schema});}
