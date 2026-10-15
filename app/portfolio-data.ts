import {getDb} from '@/db';import {portfolio,siteContent} from '@/db/schema';import {and,asc,eq} from 'drizzle-orm';
export const categories={
 gezinnen:{label:'Gezinnen',db:'Gezin',heading:'Jullie samen in beeld.',intro:'Een hand in de jouwe, een spontane lach en alle kleine gebaren die bij jullie gezin horen.',sample:{title:'Samen op pad',alt:'Voorbeeldbeeld van een gezin aan zee',url:'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=85'}},
 huisdieren:{label:'Huisdieren',db:'Dieren',heading:'Hun eigen karakter.',intro:'Van nieuwsgierige blik tot vertrouwd gebaar: beelden van jouw dier zoals je het kent.',sample:{title:'Trouwe vriend',alt:'Voorbeeldbeeld van een hond',url:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=85'}},
 portretten:{label:'Portretten',db:'Portret',heading:'Een portret dat bij je past.',intro:'Rustige, persoonlijke portretten zonder dat je een rol hoeft te spelen.',sample:{title:'Dichtbij elkaar',alt:'Voorbeeldbeeld van een portret',url:'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=85'}},
} as const;
export type CategorySlug=keyof typeof categories;
export type PortfolioImage={title:string;alt:string;category:string;url:string};
export async function ensureBundledPortfolio(){
 const db=getDb();
 if(!(await db.select().from(siteContent).where(eq(siteContent.key,'portfolio:aangeleverd:init'))).length){
  for(const photo of [
  {id:'aangeleverd-kind-76912',title:'Een spontaan moment buiten',category:'Gezin',imageKey:'aangeleverd-kind-76912',position:10,altText:'Lachend jong kind buiten in zacht avondlicht',published:true},
  {id:'aangeleverd-kind-956',title:'Een rustig moment',category:'Gezin',imageKey:'aangeleverd-kind-956',position:20,altText:'Slapende baby met een rode kerstmuts',published:true},
  {id:'aangeleverd-hond-2396',title:'Klaar om te spelen',category:'Dieren',imageKey:'aangeleverd-hond-2396',position:10,altText:'Witte hond op het terras met zijn speeltje',published:true},
  {id:'aangeleverd-hond-528',title:'Rustig hondenportret',category:'Dieren',imageKey:'aangeleverd-hond-528',position:20,altText:'Witte hond zittend tegen een donkere achtergrond',published:true},
  ])await db.insert(portfolio).values(photo).onConflictDoNothing();
  await db.insert(siteContent).values({key:'portfolio:aangeleverd:init',value:'1'}).onConflictDoNothing();
 }
 if(!(await db.select().from(siteContent).where(eq(siteContent.key,'portfolio:selectie:20260924'))).length){
  for(const photo of [
   {id:'selectie-moeder-kind',title:'Samen bij de kerstboom',category:'Gezin',imageKey:'selectie-moeder-kind',position:30,altText:'Moeder houdt haar jonge kind lachend vast bij de kerstboom',published:true},
   {id:'selectie-hond-terras',title:'Even buiten',category:'Dieren',imageKey:'selectie-hond-terras',position:30,altText:'Witte hond ligt ontspannen op het terras',published:true},
   {id:'selectie-kind-kok',title:'Kleine chef',category:'Portret',imageKey:'selectie-kind-kok',position:10,altText:'Lachend jong kind met koksmuts en spatel in de studio',published:true},
   {id:'selectie-meisje-boom',title:'Verstoppertje',category:'Portret',imageKey:'selectie-meisje-boom',position:20,altText:'Lachend meisje kijkt achter een boom vandaan',published:true},
  ])await db.insert(portfolio).values(photo).onConflictDoNothing();
  await db.insert(siteContent).values({key:'portfolio:selectie:20260924',value:'1'}).onConflictDoNothing();
 }
}
export async function getCategoryAlbum(slug:CategorySlug){const category=categories[slug];try{await ensureBundledPortfolio();const rows=await getDb().select().from(portfolio).where(and(eq(portfolio.category,category.db),eq(portfolio.published,true))).orderBy(asc(portfolio.position));if(rows.length)return {sample:false,images:rows.map(x=>({title:x.title,alt:x.altText||x.title,category:x.category,url:`/api/image/${x.imageKey}`}))};}catch{}return {sample:true,images:[{title:category.sample.title,alt:category.sample.alt,category:category.db,url:category.sample.url}]};}
export async function getPortfolio(){try{await ensureBundledPortfolio();}catch{}const albums=await Promise.all((Object.keys(categories) as CategorySlug[]).map(getCategoryAlbum));const heroImages=Array.from({length:6},(_,i)=>albums[i%albums.length].images[Math.floor(i/albums.length)]).filter((image):image is PortfolioImage=>!!image).filter((image,i,all)=>all.findIndex(other=>other.url===image.url)===i);return {sample:albums.some(x=>x.sample),heroSample:albums[0].sample,images:albums.map(x=>x.images[0]),heroImages};}
