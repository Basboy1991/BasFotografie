import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
test('Postgres stores millisecond timestamps, boolean visibility and album references correctly',async()=>{
 const db=new PGlite();try{
 await db.exec(readFileSync(new URL('../db/migration.sql',import.meta.url),'utf8'));
 await db.query('INSERT INTO portfolio (id,title,category,image_key,position,published) VALUES ($1,$2,$3,$4,$5,$6)',['test','A photo','Gezin','test.jpg',Date.now(),false]);
 const photo=(await db.query('SELECT * FROM portfolio WHERE id=$1',['test'])).rows[0];assert.equal(photo.published,false);assert.ok(Number(photo.position)>2**31);
 await assert.rejects(db.query('INSERT INTO photos VALUES ($1,$2,$3,$4)',['photo','missing-album','image','example.jpg']));
 await db.query('INSERT INTO albums VALUES ($1,$2,$3,$4,$5,$6,$7)',['album','Example','Example','example@example.invalid','token-hash','password-hash',Date.now()]);
 await db.query('INSERT INTO photos VALUES ($1,$2,$3,$4)',['photo','album','image','example.jpg']);await db.query('DELETE FROM albums WHERE id=$1',['album']);assert.equal((await db.query('SELECT * FROM photos')).rows.length,0);
 await db.exec(readFileSync(new URL('../db/migration.sql',import.meta.url),'utf8')); // migration is repeatable
 }finally{await db.close();}
});
