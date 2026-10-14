import {readFileSync,realpathSync,statSync} from 'node:fs';
import path from 'node:path';

export const definitions={owner:['id','user_id'],portfolio:['id','title','category','image_key','position','alt_text','published'],requests:['id','name','email','type','date','message','created_at','status'],albums:['id','title','client','email','token_hash','password_hash','created_at'],photos:['id','album_id','image_key','filename'],site_content:['key','value'],pricing:['category','price_cents','price_type','included','note'],faqs:['id','question','answer','position','published']};

export function assertEmptyTarget(counts){
 // Owner can be initialized by login; all migrated content must have a fresh target.
 if(Object.keys(definitions).some(table=>table!=='owner'&&Number(counts?.[table]??-1)!==0))
  throw new Error('De doeldatabase bevat al gegevens. Import gestopt vóór foto-uploads en gegevenswijzigingen. Gebruik een nieuwe, lege database; deze export kan recentere gegevens overschrijven.');
}

export function validateExport(root,data,images){
 if(data?.formatVersion!==1||!data.tables||!Array.isArray(images))throw new Error('Onbekende of onvolledige exportversie.');
 for(const [table,columns] of Object.entries(definitions)){
  const records=data.tables[table];
  if(!Array.isArray(records))throw new Error(`De export mist de tabel ${table}.`);
  const ids=new Set();
  for(const record of records){
   if(!record||columns.some(column=>!(column in record)))throw new Error(`De export mist kolommen in ${table}.`);
   const id=record[columns[0]];
   if(ids.has(id))throw new Error(`Dubbele sleutel in ${table}.`);
   ids.add(id);
   if('published' in record&&![true,false,0,1].includes(record.published))throw new Error('Ongeldige publicatiestatus.');
  }
 }
 const albumIds=new Set(data.tables.albums.map(row=>row.id));
 if(data.tables.photos.some(row=>!albumIds.has(row.album_id)))throw new Error('Een foto verwijst naar een ontbrekend album.');
 const byKey=new Map();
 for(const image of images){
  if(!image||!/^[a-zA-Z0-9._-]+$/.test(image.key)||byKey.has(image.key))throw new Error('Ongeldige of dubbele fotosleutel in export.');
  byKey.set(image.key,image);
  const filename=realpathSync(path.resolve(root,image.path));
  if(!filename.startsWith(path.join(realpathSync(root),'backup','photos')+path.sep)||!statSync(filename).isFile()||statSync(filename).size!==image.size)throw new Error('Ongeldig fotopad of onvolledig fotobestand.');
  if(image.sourcePath){
   const sourceRoot=path.resolve(import.meta.dirname,'..');
   const bundled=realpathSync(path.resolve(sourceRoot,image.sourcePath));
   if(!bundled.startsWith(path.join(sourceRoot,'public','portfolio-eigen')+path.sep)||!readFileSync(bundled).equals(readFileSync(filename)))throw new Error('De meegeleverde portfoliofoto wijkt af van de export.');
  }
 }
 const portfolioKeys=new Set(data.tables.portfolio.map(row=>row.image_key));
 for(const record of [...data.tables.portfolio,...data.tables.photos])if(!byKey.has(record.image_key))throw new Error('Een fotoverwijzing mist een bestand.');
 for(const photo of data.tables.photos)if(byKey.get(photo.image_key)?.sourcePath||portfolioKeys.has(photo.image_key))throw new Error('Een klantfoto mag niet als openbaar portfoliobestand worden geïmporteerd.');
 return definitions;
}
