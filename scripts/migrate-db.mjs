import {readFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';

if(!process.env.DATABASE_URL){
 if(process.env.VERCEL)throw new Error('Koppel DATABASE_URL voor deze Vercel-omgeving vóór publicatie.');
 console.log('Lokale build zonder database: schemacontrole overgeslagen.');
}else{
 const sql=neon(process.env.DATABASE_URL);
 const statements=readFileSync(new URL('../db/migration.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
 try{
  await sql.transaction(statements.map(statement=>sql.query(statement,[])));
  console.log('Databaseschema gecontroleerd. Bestaande gegevens zijn behouden.');
 }catch{
  throw new Error('Het databaseschema kon niet worden voorbereid. Controleer de databasekoppeling voor deze deployment.');
 }
}
