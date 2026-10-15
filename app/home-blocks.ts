
export const coreBlocks=[
 {id:'hero',type:'core',label:'Intro en hoofdbeeld'},
 {id:'services',type:'core',label:'Fotografie en diensten'},
 {id:'portfolio',type:'core',label:'Portfolioalbums'},
 {id:'closing',type:'core',label:'Kennismaken'},
] as const;
export type CoreBlock={id:(typeof coreBlocks)[number]['id'];type:'core'};
export type CustomBlock=
 |{id:string;type:'text';heading:string;body:string}
 |{id:string;type:'cta';heading:string;body:string;button:string;href:string}
 |{id:string;type:'image';heading:string;body:string;imageKey:string;alt:string};
export type HomeBlock=CoreBlock|CustomBlock;
export const defaultHomeBlocks:HomeBlock[]=coreBlocks.map(x=>({id:x.id,type:'core'}));
const internalPath=/^\/(?!\/)[a-z0-9/\-]*$/;
const short=(x:unknown,min:number,max:number)=>typeof x==='string'&&x.trim().length>=min&&x.trim().length<=max;

export function parseHomeBlocks(input:unknown):HomeBlock[]|null{
 if(!Array.isArray(input)||input.length<4||input.length>24)return null;
 const ids=new Set<string>();
 for(const item of input){
  if(!item||typeof item!=='object')return null;
  const b=item as Record<string,unknown>;
  if(typeof b.id!=='string'||ids.has(b.id))return null;ids.add(b.id);
  if(b.type==='core'){
   if(!coreBlocks.some(x=>x.id===b.id))return null;
  }else{
   if(!/^custom-[a-f0-9-]{36}$/.test(b.id)||!short(b.heading,3,120)||!short(b.body,10,1500))return null;
   if(b.type==='cta'){
    if(!short(b.button,2,80)||typeof b.href!=='string'||!internalPath.test(b.href))return null;
   }else if(b.type==='image'){
    if(typeof b.imageKey!=='string'||!/^[a-f0-9-]{36}$/.test(b.imageKey)||!short(b.alt,3,180))return null;
   }else if(b.type!=='text')return null;
  }
 }
 if(!coreBlocks.every(x=>ids.has(x.id)))return null;
 return input as HomeBlock[];
}
