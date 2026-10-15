import {getDb} from '@/db';
import {siteContent} from '@/db/schema';
import {eq} from 'drizzle-orm';
import {defaultHomeBlocks,parseHomeBlocks} from './home-blocks';
export async function readHomeBlocks(){
 try{const row=(await getDb().select().from(siteContent).where(eq(siteContent.key,'home:blocks')))[0];return row?parseHomeBlocks(JSON.parse(row.value))||defaultHomeBlocks:defaultHomeBlocks;}catch{return defaultHomeBlocks;}
}
