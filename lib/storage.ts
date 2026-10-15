import {get,put,head,del,BlobNotFoundError} from '@vercel/blob';
const path=(key:string)=>{if(!/^[a-zA-Z0-9._-]+$/.test(key))throw new Error('Ongeldige fotosleutel.');return `photos/${key}`;};
export const storage={BUCKET:{
 async get(key:string){const file=await get(path(key),{access:'private',useCache:false});if(!file||file.statusCode!==200)return null;return {body:file.stream,httpMetadata:{contentType:file.blob.contentType},size:file.blob.size};},
 async head(key:string){try{const file=await head(path(key));return {size:file.size,httpMetadata:{contentType:file.contentType},pathname:file.pathname};}catch(error){if(error instanceof BlobNotFoundError)return null;throw error;}},
 async put(key:string,bytes:ArrayBuffer,options:{httpMetadata:{contentType:string}}){return put(path(key),bytes,{access:'private',addRandomSuffix:false,contentType:options.httpMetadata.contentType});},
 async delete(key:string){await del(path(key));},
}};
