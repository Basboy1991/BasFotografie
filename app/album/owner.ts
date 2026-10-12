import {getOwnerSession} from '../owner-auth';
import {getDb} from '@/db';
import {owner} from '@/db/schema';
export async function isAlbumOwner(){
  const user=await getOwnerSession();
  if(!user||user.email.toLowerCase()!=='bas@avonturia.nl')return false;
  const row=(await getDb().select().from(owner).limit(1))[0];
  return row?.userId===user.userId;
}
