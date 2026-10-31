import sharp from 'sharp';
import {readFile,writeFile,readdir,mkdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=path.join(root,'public/portfolio-eigen');
const output=path.join(root,'public/portfolio-web');
await mkdir(output,{recursive:true});
const manifest={};
let originalBytes=0,webBytes=0;
for(const filename of (await readdir(source)).filter(x=>/\.(jpe?g|png)$/i.test(x)).sort()){
 const input=await readFile(path.join(source,filename));
 const metadata=await sharp(input).rotate().metadata();
 const width=metadata.autoOrient?.width||metadata.width;
 const height=metadata.autoOrient?.height||metadata.height;
 if(!width||!height)throw new Error(`Afmetingen ontbreken: ${filename}`);
 const fingerprint=createHash('sha256').update(input).update('portfolio-web-v1:82').digest('hex').slice(0,12);
 const widths=[...new Set([360,720,1200,1800].map(x=>Math.min(x,width)))];
 const variants=[];
 for(const size of widths){
  const name=`${path.parse(filename).name}-${fingerprint}-${size}.webp`;
  const target=path.join(output,name);
  try{await stat(target);}catch{await sharp(input).rotate().resize({width:size,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(target);}
  variants.push({width:size,url:`/portfolio-web/${name}`,bytes:(await stat(target)).size});
 }
 const standard=variants.find(x=>x.width>=Math.min(1200,width))||variants.at(-1);
 originalBytes+=input.length;webBytes+=standard.bytes;
 manifest[`/portfolio-eigen/${filename}`]={width,height,variants};
}
const json=JSON.stringify(manifest,null,2)+'\n';
const manifestPath=path.join(root,'app/portfolio-image-manifest.json');
if(await readFile(manifestPath,'utf8').catch(()=>null)!==json)await writeFile(manifestPath,json);
console.log(`Portfolio: ${Object.keys(manifest).length} beelden, origineel ${originalBytes} bytes; webversies tot 1200 px ${webBytes} bytes (${Math.round((1-webBytes/originalBytes)*100)}% kleiner).`);
