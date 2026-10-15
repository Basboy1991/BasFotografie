import {getDb} from '@/db';
import {siteContent} from '@/db/schema';
import {defaults} from './visual-fields';
export {defaults} from './visual-fields';
export type {ContentKey} from './visual-fields';
export async function readContent(){try{const rows=await getDb().select().from(siteContent);return {...defaults,...Object.fromEntries(rows.map(x=>[x.key,x.value]))} as Record<keyof typeof defaults,string>;}catch{return defaults;}}
