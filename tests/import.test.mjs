import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {definitions,validateExport,assertEmptyTarget} from '../scripts/import-validation.mjs';

function fixture(){
 const root=mkdtempSync(path.join(tmpdir(),'bf-import-'));
 mkdirSync(path.join(root,'backup/photos'),{recursive:true});
 writeFileSync(path.join(root,'backup/photos/test.jpg'),'photo');
 const tables=Object.fromEntries(Object.keys(definitions).map(table=>[table,[]]));
 tables.portfolio=[{id:'test',title:'Test',category:'Gezin',image_key:'test.jpg',position:1,alt_text:'Test',published:1}];
 return {root,data:{formatVersion:1,tables},images:[{key:'test.jpg',path:'backup/photos/test.jpg',size:5}]};
}
test('import validates complete exports and refuses missing files or incomplete rows',()=>{
 const f=fixture();try{
  assert.equal(validateExport(f.root,f.data,f.images),definitions);
  delete f.data.tables.portfolio[0].title;
  assert.throws(()=>validateExport(f.root,f.data,f.images),/kolommen/);
  f.data.tables.portfolio[0].title='Test';
  assert.throws(()=>validateExport(f.root,f.data,[]),/fotoverwijzing/);
  f.images[0].size=6;
  assert.throws(()=>validateExport(f.root,f.data,f.images),/onvolledig/);
 }finally{rmSync(f.root,{recursive:true,force:true});}
});
test('import rejects escaping photo paths and public/private key collisions',()=>{
 const f=fixture();try{
  writeFileSync(path.join(f.root,'outside.jpg'),'photo');
  f.images[0].path='outside.jpg';
  assert.throws(()=>validateExport(f.root,f.data,f.images),/fotopad/);
  f.images[0].path='backup/photos/test.jpg';
  f.data.tables.albums=[{id:'album',title:'Test',client:'Test',email:'test@example.invalid',token_hash:'hash',password_hash:'hash',created_at:1}];
  f.data.tables.photos=[{id:'photo',album_id:'album',image_key:'test.jpg',filename:'test.jpg'}];
  assert.throws(()=>validateExport(f.root,f.data,f.images),/klantfoto/);
 }finally{rmSync(f.root,{recursive:true,force:true});}
});
test('an occupied or unknown target is rejected; login-initialized owner is allowed',()=>{
 const counts=Object.fromEntries(Object.keys(definitions).map(table=>[table,'0']));
 counts.owner='1';assert.doesNotThrow(()=>assertEmptyTarget(counts));
 counts.requests='1';assert.throws(()=>assertEmptyTarget(counts),/al gegevens/);
 delete counts.requests;assert.throws(()=>assertEmptyTarget(counts),/al gegevens/);
});
