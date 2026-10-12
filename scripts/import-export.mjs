import {readFileSync} from 'node:fs';
import path from 'node:path';
import {neon} from '@neondatabase/serverless';
import {put} from '@vercel/blob';
const root=path.resolve(process.argv[2]||'');
if(!process.argv[2]||!process.env.DATABASE_URL)throw new Error('Gebruik: npm run db:import -- /pad/naar/uitgepakte-export, met DATABASE_URL in .env.local.');
const data=JSON.parse(readFileSync(path.join(root,'backup/database.json'),'utf8'));
const images=JSON.parse(readFileSync(path.join(root,'backup/photos.json'),'utf8'));
if(data.formatVersion!==1)throw new Error('Onbekende exportversie.');
const sql=neon(process.env.DATABASE_URL);
const statements=readFileSync(new URL('../db/migration.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
await sql.transaction(statements.map(statement=>sql.query(statement,[])));
const definitions={owner:['id','user_id'],portfolio:['id','title','category','image_key','position','alt_text','published'],requests:['id','name','email','type','date','message','created_at','status'],albums:['id','title','client','email','token_hash','password_hash','created_at'],photos:['id','album_id','image_key','filename'],site_content:['key','value'],pricing:['category','price_cents','price_type','included','note'],faqs:['id','question','answer','position','published']};
for(const image of images){
 if(image.sourcePath)continue; // Bundled photos are served from source/public.
 if(!/^[a-zA-Z0-9._-]+$/.test(image.key))throw new Error('Ongeldige fotosleutel in export.');
 const filename=path.resolve(root,image.path);
 if(!filename.startsWith(path.join(root,'backup','photos')+path.sep))throw new Error('Ongeldig fotopad.');
 await put(`photos/${image.key}`,readFileSync(filename),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:image.contentType||'application/octet-stream'});
}
const queries=[];let rows=0;
for(const [table,columns] of Object.entries(definitions)){
 const records=table==='owner'?[{id:1,user_id:'bas-owner'}]:(data.tables[table]||[]);
 for(const record of records){
  if(columns.some(column=>!(column in record)))throw new Error(`De export mist kolommen in ${table}.`);
  const values=columns.map(column=>column==='published'?Boolean(record[column]):record[column]);
  const quoted=columns.map(c=>`"${c}"`),updates=quoted.slice(1).map(c=>`${c}=EXCLUDED.${c}`);
  queries.push(sql.query(`INSERT INTO "${table}" (${quoted.join(',')}) VALUES (${values.map((_,i)=>`$${i+1}`).join(',')}) ON CONFLICT (${quoted[0]}) DO UPDATE SET ${updates.join(',')}`,values));rows++;
 }
}
if(queries.length)await sql.transaction(queries);
console.log(`Import afgerond: ${rows} records en ${images.length} fotoverwijzingen. Klantgegevens zijn niet naar de repository geschreven.`);
