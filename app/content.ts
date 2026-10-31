import {cache} from 'react';
import {getDb} from '@/db';
import {siteContent} from '@/db/schema';
import {inArray} from 'drizzle-orm';
import {defaults} from './visual-fields';
export {defaults} from './visual-fields';
export type {ContentKey} from './visual-fields';
export const readContent=cache(async function readContent(){try{const rows=await getDb().select().from(siteContent).where(inArray(siteContent.key,Object.keys(defaults)));return {...defaults,...Object.fromEntries(rows.map(x=>[x.key,x.value]))} as Record<keyof typeof defaults,string>;}catch{return defaults;}});
