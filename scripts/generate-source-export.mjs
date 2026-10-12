import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const files=[];
const excluded=new Set(['generated','node_modules','.next','.git','.vercel','backup','private']);
function visit(relative){for(const entry of readdirSync(path.join(root,relative),{withFileTypes:true})){if(entry.isSymbolicLink()||excluded.has(entry.name)||entry.name.startsWith('.env'))continue;const name=path.posix.join(relative,entry.name);if(entry.isDirectory())visit(name);else if(!/\.(pem|key|pfx|p12|zip|tar|tsbuildinfo)$/.test(name))files.push({name,base64:readFileSync(path.join(root,name)).toString('base64')});}}
for(const directory of ['app','db','lib','public','scripts','tests'])visit(directory);
for(const name of ['package.json','package-lock.json','tsconfig.json','next.config.ts','postcss.config.mjs','vercel.json','README.md','.gitignore','.env.example']){try{files.push({name,base64:readFileSync(path.join(root,name)).toString('base64')});}catch{}}
files.sort((a,b)=>a.name.localeCompare(b.name));
mkdirSync(path.join(root,'app/beheer/export/generated'),{recursive:true});
writeFileSync(path.join(root,'app/beheer/export/generated/source.json'),JSON.stringify({generatedAt:new Date().toISOString(),files}));
console.log(`Source export prepared: ${files.length} files.`);
