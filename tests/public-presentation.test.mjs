import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import sharp from 'sharp';
import {jsonLd,xmlText} from '../lib/structured-data.mjs';
test('responsive variants decode at their advertised width without enlarging or distorting originals',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../app/portfolio-image-manifest.json',import.meta.url),'utf8'));
 for(const [source,asset] of Object.entries(manifest)){
  const original=await sharp(await readFile(new URL('../public'+source,import.meta.url))).metadata();
  assert.equal(asset.width,original.width);
  assert.equal(asset.height,original.height);
  for(const variant of asset.variants){
   const file=new URL('../public'+variant.url,import.meta.url),meta=await sharp(await readFile(file)).metadata();
   assert.equal(meta.format,'webp');assert.equal(meta.width,variant.width);
   assert.ok(meta.width<=asset.width);
   assert.ok(Math.abs(meta.height-meta.width*asset.height/asset.width)<=1);
   assert.equal((await stat(file)).size,variant.bytes);
  }
 }
});
test('CMS text cannot close a JSON-LD script and XML output escapes unsafe characters',()=>{
 const value={'@type':'Question',name:'</script><img src=x onerror=alert(1)>'};
 const encoded=jsonLd(value);
 assert.equal(encoded.includes('<'),false);
 assert.deepEqual(JSON.parse(encoded),value);
 assert.equal(xmlText('a&b<"c\'>'),'a&amp;b&lt;&quot;c&apos;&gt;');
});
