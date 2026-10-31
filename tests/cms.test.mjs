import test, {before, beforeEach, after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {drizzle} from 'drizzle-orm/pglite';
import {transpileModule, ModuleKind, JsxEmit} from 'typescript';
import {renderToStaticMarkup} from 'react-dom/server';

// Real application actions, validation, queries and Postgres storage. Only the
// Next request/session/cache boundaries and unused external services are replaced.
const fixture = globalThis.__bfCms = {modules: {}, paths: [], session: null, db: null, emails: [], emailError: false};
const moduleUrl = code => 'data:text/javascript,' + encodeURIComponent(code).replaceAll("'", '%27');
function namespace(name, value) {
  fixture.modules[name] = value;
  return moduleUrl(Object.keys(value).map(key => key==='default'?`export default globalThis.__bfCms.modules[${JSON.stringify(name)}].default;`:`export const ${key}=globalThis.__bfCms.modules[${JSON.stringify(name)}][${JSON.stringify(key)}];`).join('\n'));
}
async function load(path, replacements = {}) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8');
  for (const [from, to] of Object.entries(replacements)) {
    source = source.replaceAll(`from '${from}'`, `from '${to}'`).replaceAll(`from "${from}"`, `from '${to}'`);
  }
  const code=transpileModule(source, {compilerOptions: {module: ModuleKind.ESNext, target: 99, jsx:JsxEmit.ReactJSX}}).outputText
    .replaceAll('from "react/jsx-runtime"',`from '${import.meta.resolve('react/jsx-runtime')}'`);
  return import(moduleUrl(code));
}
const schema = await load('../db/schema.ts', {'drizzle-orm/pg-core': import.meta.resolve('drizzle-orm/pg-core')});
const postgres = new PGlite();
fixture.db = drizzle(postgres, {schema});
const deps = {
  '@/db': moduleUrl('export function getDb(){return globalThis.__bfCms.db;}'),
  '@/db/schema': namespace('schema', schema),
  'drizzle-orm': import.meta.resolve('drizzle-orm'),
  'react': import.meta.resolve('react'),
};
const fields = await load('../app/visual-fields.ts');
deps['./visual-fields'] = namespace('fields', fields);
const validation = await load('../app/content-validation.ts', deps);
deps['./content-validation'] = namespace('validation', validation);
const content = await load('../app/content.ts', deps);
deps['./content'] = namespace('content', content);
const homeBlocks = await load('../app/home-blocks.ts');
deps['./home-blocks'] = namespace('homeBlocks', homeBlocks);
const blockData = await load('../app/home-blocks-data.ts', deps);
deps['./home-blocks-data'] = namespace('blockData', blockData);
const pricingData = await load('../app/pricing-data.ts', deps);
deps['./pricing-data'] = namespace('pricingData', pricingData);
const seoData = await load('../app/seo-data.ts', deps);
deps['./seo-data'] = namespace('seoData', seoData);
const faqData = await load('../app/faq-data.ts', deps);
deps['./faq-data'] = namespace('faqData', faqData);
const assets = await load('../app/portfolio-assets.ts');
deps['./portfolio-assets'] = namespace('assets', assets);
const manifest=JSON.parse(await readFile(new URL('../app/portfolio-image-manifest.json',import.meta.url),'utf8'));
const presentation=await load('../app/photo-presentation.ts',{'./portfolio-assets':deps['./portfolio-assets'],'./portfolio-image-manifest.json':moduleUrl('export default '+JSON.stringify(manifest))});
deps['./photo-presentation']=namespace('presentation',presentation);
const portfolioData = await load('../app/portfolio-data.ts', deps);
const metadata = await load('../app/metadata.ts',{...deps,'./portfolio-data':namespace('portfolioData',portfolioData)});
deps['./metadata']=namespace('metadata',metadata);
const publicFaq = await load('../app/veelgestelde-vragen/page.tsx', {
  '../faq-data': deps['./faq-data'], '../seo-data':deps['./seo-data'], '../content':deps['./content'],
  '../metadata':deps['./metadata'], '../../lib/structured-data.mjs':import.meta.resolve('../lib/structured-data.mjs'),
  'next/link':moduleUrl(`import {createElement} from '${import.meta.resolve('react')}';export default function Link(props){return createElement('a',props,props.children);}`),
});
const link=moduleUrl(`import {createElement} from '${import.meta.resolve('react')}';export default function Link(props){return createElement('a',props,props.children);}`);
const businessModule=await load('../app/business.ts');
const schemaHelpers=await load('../app/site-schema.ts',{'./business':namespace('business',businessModule),'./site-url':moduleUrl('export const siteUrl="https://bas-fotografie.vercel.app";')});
const breadcrumbs=await load('../app/components/breadcrumbs.tsx',{'next/link':link,'../../lib/structured-data.mjs':import.meta.resolve('../lib/structured-data.mjs'),'../site-schema':namespace('schemaHelpers',schemaHelpers)});
const publicPhoto=await load('../app/components/public-photo.tsx',{'../photo-presentation':deps['./photo-presentation']});
const serviceDetails=await load('../app/components/service-details.tsx',{'next/link':link});
const publicDeps={'next/link':link,'../business':namespace('businessPage',businessModule),'../content':deps['./content'],'../metadata':deps['./metadata'],'../components/breadcrumbs':namespace('breadcrumbs',breadcrumbs)};
const publicContact=await load('../app/contact/page.tsx',publicDeps);
const publicPreparation=await load('../app/voorbereiding/page.tsx',publicDeps);
const publicFamilies=await load('../app/diensten/gezinnen/page.tsx',{
 'next/link':link,'../../content':deps['./content'],'../../metadata':deps['./metadata'],'../../portfolio-data':namespace('familyPortfolio',portfolioData),
 '../../components/breadcrumbs':namespace('familyBreadcrumbs',breadcrumbs),'../../components/service-details':namespace('serviceDetails',serviceDetails),
 '../../components/public-photo':namespace('publicPhoto',publicPhoto),'../../site-schema':namespace('serviceSchema',schemaHelpers),'../../../lib/structured-data.mjs':import.meta.resolve('../lib/structured-data.mjs'),
});
const sitemap=await load('../app/sitemap.xml/route.ts',{'../../lib/structured-data.mjs':import.meta.resolve('../lib/structured-data.mjs'),'../seo-data':deps['./seo-data'],'../site-url':moduleUrl('export const siteUrl="https://bas-fotografie.vercel.app";'),'../portfolio-data':namespace('sitemapPortfolio',portfolioData)});
const categoryPage=await load('../app/portfolio/[categorie]/page.tsx',{'next/link':link,'next/navigation':moduleUrl('export function notFound(){throw new Error("not_found");}'),'../../metadata':deps['./metadata'],'../../../lib/structured-data.mjs':import.meta.resolve('../lib/structured-data.mjs'),'../../site-url':moduleUrl('export const siteUrl="https://bas-fotografie.vercel.app";'),'../../components/public-photo':namespace('albumPhoto',publicPhoto),'../../portfolio-data':namespace('albumData',portfolioData),'../../content':deps['./content']});
const actions = await load('../app/actions.ts', {
  ...deps,
  './owner-auth': moduleUrl('export async function getOwnerSession(){return globalThis.__bfCms.session;}'),
  'next/cache': moduleUrl('export function revalidatePath(path){globalThis.__bfCms.paths.push(path);}'),
  'next/navigation': moduleUrl('export function redirect(path){throw new Error("redirect:"+path);}'),
  '@/lib/storage': moduleUrl('export const storage={BUCKET:null};'),
  '@/lib/email.mjs': moduleUrl('export async function deliverAppointmentEmails(request){globalThis.__bfCms.emails.push(request);if(globalThis.__bfCms.emailError)throw new Error("provider unavailable");return {status:"preview_skipped"};}'),
  './email-templates': moduleUrl('export const clientReceipt=()=>"";export const ownerNotice=()=>"";'),
  './album/security': moduleUrl('export const newAlbumToken=()=>{};export const newAlbumPassword=()=>{};export const hashAlbumPassword=()=>{};export const tokenHash=()=>{};'),
});
const form = values => {
  const result = new FormData();
  for (const [key, value] of Object.entries(values)) result.set(key, String(value));
  return result;
};
const readValue = async key => (await postgres.query('SELECT value FROM site_content WHERE key=$1', [key])).rows[0]?.value;

before(async () => {
  await postgres.exec(await readFile(new URL('../db/migration.sql', import.meta.url), 'utf8'));
  await postgres.query('INSERT INTO owner (id,user_id) VALUES (1,$1)', ['cms-owner']);
});
beforeEach(async () => {
  fixture.session = {userId: 'cms-owner', email: 'bas@avonturia.nl'};
  fixture.paths = [];
  fixture.emails = [];
  fixture.emailError = false;
  await postgres.exec('TRUNCATE site_content,portfolio,pricing,faqs,requests;');
  await postgres.query("INSERT INTO site_content (key,value) VALUES ('portfolio:aangeleverd:init','1'),('portfolio:selectie:20260924','1')");
});
after(async () => postgres.close());

test('CMS saves multiple texts atomically and public content reads the persisted values', async () => {
  const saved = await actions.saveVisualContents({homeHeroTop: '  Een nieuw begin.  ', albumFamilyHeading: 'Jullie eigen verhaal.'});
  assert.equal(saved.homeHeroTop, 'Een nieuw begin.');
  assert.equal((await content.readContent()).homeHeroTop, 'Een nieuw begin.');
  assert.equal((await content.readContent()).albumFamilyHeading, 'Jullie eigen verhaal.');
  assert.ok(fixture.paths.includes('/'));
  assert.ok(fixture.paths.includes('/portfolio/gezinnen'));
  assert.ok(fixture.paths.includes('/beheer/teksten'));
});

test('CMS rejects unknown, empty, non-string or invalid fields before saving any part', async () => {
  await actions.saveVisualContents({homeHeroTop: 'Bestaande titel.'});
  for (const changes of [
    {homeHeroTop: 'Nieuwe titel.', homeHeroBottom: 'x'},
    {homeHeroTop: 'Nieuwe titel.', 'portfolio:hero': 'hidden'},
    {homeHeroTop: 123}, {}, [], JSON.parse('{"__proto__":"ongewenste inhoud"}'),
  ]) await assert.rejects(actions.saveVisualContents(changes));
  assert.equal(await readValue('homeHeroTop'), 'Bestaande titel.');
  assert.equal(await readValue('portfolio:hero'), undefined);
});

test('a database failure rolls back the entire multi-text save', async () => {
  await actions.saveVisualContents({homeHeroTop: 'Bestaande titel.'});
  await postgres.exec("ALTER TABLE site_content ADD CONSTRAINT reject_test_value CHECK (value <> 'Database weigert dit.');");
  try {
    await assert.rejects(actions.saveVisualContents({homeHeroTop: 'Nieuwe titel.', homeHeroBottom: 'Database weigert dit.'}));
    assert.equal(await readValue('homeHeroTop'), 'Bestaande titel.');
    assert.equal(await readValue('homeHeroBottom'), undefined);
  } finally { await postgres.exec('ALTER TABLE site_content DROP CONSTRAINT reject_test_value;'); }
});

test('CMS mutations refuse missing, wrong-email and non-owner sessions', async () => {
  for (const session of [null, {userId: 'cms-owner', email: 'other@example.invalid'}, {userId: 'another-user', email: 'bas@avonturia.nl'}]) {
    fixture.session = session;
    await assert.rejects(actions.saveVisualContents({homeHeroTop: 'Ongeoorloofde wijziging.'}), /Geen toegang/);
    await assert.rejects(actions.savePricing(form({category: 'Gezin', price: '149', priceType: 'vast'})), /Geen toegang/);
    await assert.rejects(actions.setHeroImage(form({imageKey: 'photo-public'})), /Geen toegang/);
    await assert.rejects(actions.savePhotoFocus(form({imageKey:'photo-public',x:50,y:43,mobileX:50,mobileY:40})), /Geen toegang/);
  }
  assert.equal(await readValue('homeHeroTop'), undefined);
  assert.equal((await postgres.query('SELECT * FROM pricing')).rows.length, 0);
});

test('CMS pricing persists decimal euros and supports price by agreement', async () => {
  await actions.savePricing(form({category: 'Gezin', price: '149,50', priceType: 'vanaf', included: 'Tot 60 minuten en acht bewerkte foto’s.', note: 'Voor één gezin.'}));
  let item = (await pricingData.getPricing()).find(item => item.category === 'Gezin');
  assert.equal(item.price.priceCents, 14950);
  assert.equal(pricingData.displayPrice(item.price.priceCents, item.price.priceType), 'Vanaf € 149,50');
  await assert.rejects(actions.savePricing(form({category: 'Gezin', price: '1e4', priceType: 'vast'})));
  assert.equal((await pricingData.getPricing()).find(item => item.category === 'Gezin').price.priceCents, 14950);
  await actions.savePricing(form({category: 'Gezin', price: '', priceType: 'vast'}));
  item = (await pricingData.getPricing()).find(item => item.category === 'Gezin');
  assert.equal(pricingData.displayPrice(item.price.priceCents, item.price.priceType), 'Prijs in overleg');
});

test('CMS SEO is read back on the selected public page', async () => {
  const title = 'Gezinsfotografie in het Westland | Bas Fotografie';
  const description = 'Warme gezinsfotografie op locatie in het Westland. Bekijk de eigen foto’s en bespreek een ontspannen fotosessie met Bas.';
  await actions.saveSeo(form({path: '/portfolio/gezinnen', title, description}));
  const readback = await seoData.readSeo('/portfolio/gezinnen');
  assert.equal(readback.title, title);
  assert.equal(readback.description, description);
  assert.ok(fixture.paths.includes('/portfolio/gezinnen'));
});

test('CMS cover selection only accepts published portfolio photos and public albums exclude hidden photos', async () => {
  await postgres.query("INSERT INTO portfolio (id,title,category,image_key,position,alt_text,published) VALUES ('visible','Public photo','Gezin','photo-public',1,'Een openbare portfoliofoto',true),('hidden','Draft photo','Gezin','photo-draft',2,'Een verborgen portfoliofoto',false)");
  await assert.rejects(actions.setHeroImage(form({imageKey: 'photo-draft'})), /gepubliceerde/);
  await assert.rejects(actions.setHeroImage(form({imageKey: 'not-a-portfolio-photo'})), /gepubliceerde/);
  await actions.setHeroImage(form({imageKey: 'photo-public'}));
  assert.equal((await portfolioData.readHeroImage()).id, 'visible');
  assert.equal((await portfolioData.getPortfolio()).heroImages[0].url, '/api/image/photo-public');
  const album = await portfolioData.getCategoryAlbum('gezinnen');
  assert.deepEqual(album.images.map(image => image.url), ['/api/image/photo-public']);
  await actions.updatePortfolioItem(form({id: 'visible', title: 'Gewijzigde foto', category: 'Gezin', altText: 'Gewijzigde beschrijving', position: '3'}));
  assert.equal(await portfolioData.readHeroImage(), null);
  assert.equal((await postgres.query("SELECT published,title FROM portfolio WHERE id='visible'")).rows[0].title, 'Gewijzigde foto');
});

test('CMS homepage order and custom text survive a fresh read; draft photo blocks are refused', async () => {
  const blocks = [{id: 'hero', type: 'core'}, {id: 'portfolio', type: 'core'}, {id: 'services', type: 'core'}, {id: 'custom-12345678-1234-1234-1234-123456789abc', type: 'text', heading: 'Extra aandacht', body: 'Een extra tekstblok op de homepage.'}, {id: 'closing', type: 'core'}];
  await actions.saveHomeBlocks(blocks);
  assert.deepEqual(await blockData.readHomeBlocks(), blocks);
  const draft = [...blocks, {id: 'custom-abcdefab-1234-1234-1234-123456789abc', type: 'image', heading: 'Verborgen foto', body: 'Deze foto mag niet op de homepage.', imageKey: '12345678-1234-1234-1234-123456789abc', alt: 'Verborgen foto'}];
  await assert.rejects(actions.saveHomeBlocks(draft), /niet meer gepubliceerd/);
  assert.deepEqual(await blockData.readHomeBlocks(), blocks);
});

test('CMS FAQ edits persist and hidden answers disappear from the public FAQ', async () => {
  await actions.createFaq(form({question: 'Hoe kies ik de locatie?', answer: 'We bespreken samen welke locatie past bij jullie wensen.'}));
  const faq = (await postgres.query("SELECT * FROM faqs WHERE question='Hoe kies ik de locatie?'")).rows[0];
  assert.ok(renderToStaticMarkup(await publicFaq.default()).includes(faq.question));
  await actions.saveFaq(form({id: faq.id, question: faq.question, answer: 'We bespreken vooraf een passende en ontspannen locatie.', position: '8'}));
  assert.equal(renderToStaticMarkup(await publicFaq.default()).includes(faq.question), false);
  assert.equal((await faqData.getFaqs()).items.find(item=>item.id===faq.id).published, false);
  assert.equal((await postgres.query('SELECT answer FROM faqs WHERE id=$1', [faq.id])).rows[0].answer, 'We bespreken vooraf een passende en ontspannen locatie.');
});

test('photo focus is saved and read by public albums; invalid or missing coordinates cannot replace it',async()=>{
  await postgres.query("INSERT INTO portfolio (id,title,category,image_key,position,alt_text,published) VALUES ('focus-photo','Focus photo','Gezin','focus-photo',1,'Foto met onderwerp',true)");
  const focus={x:30,y:40,mobileX:70,mobileY:60};
  await actions.savePhotoFocus(form({imageKey:'focus-photo',...focus}));
  assert.deepEqual((await portfolioData.getCategoryAlbum('gezinnen')).images[0].focus,focus);
  for(const changes of [{...focus,x:101},{...focus,y:-1},{...focus,mobileX:1.5},{x:30,y:40,mobileX:70}]){
    await assert.rejects(actions.savePhotoFocus(form({imageKey:'focus-photo',...changes})));
  }
  await assert.rejects(actions.savePhotoFocus(form({imageKey:'missing',...focus})));
  assert.deepEqual((await portfolioData.readPhotoFocus(['focus-photo']))['focus-photo'],focus);
});

test('automatic slideshow uses landscape photos and an explicit portrait cover remains available',async()=>{
  await postgres.query("INSERT INTO portfolio (id,title,category,image_key,position,alt_text,published) VALUES ('portrait','Portrait','Gezin','aangeleverd-kind-76912',1,'Staande foto',true),('landscape','Landscape','Dieren','aangeleverd-hond-2396',1,'Liggende foto',true),('chef','Chef','Portret','selectie-kind-kok',1,'Liggend portret',true)");
  assert.ok((await portfolioData.getPortfolio()).heroImages.every(image=>presentation.landscapeHero(image.url)));
  await actions.setHeroImage(form({imageKey:'aangeleverd-kind-76912'}));
  assert.equal((await portfolioData.getPortfolio()).heroImages[0].url,'/api/image/aangeleverd-kind-76912');
});

test('public editable copy excludes internal CMS data and metadata reflects saved SEO',async()=>{
  await postgres.query("INSERT INTO site_content (key,value) VALUES ('request:email:test','preview_skipped'),('portfolio:focus:test','private-internal'),('homeHeroTop','Mijn eigen woorden.')");
  const copy=await content.readContent();
  assert.equal(copy.homeHeroTop,'Mijn eigen woorden.');
  assert.equal('request:email:test' in copy,false);
  assert.equal('portfolio:focus:test' in copy,false);
  await actions.saveSeo(form({path:'/portfolio/gezinnen',title:'Gezinsfotografie in het Westland',description:'Persoonlijke gezinsfotografie op locatie in het Westland. Bekijk de foto’s en bespreek een ontspannen fotosessie met Bas.'}));
  const meta=await metadata.pageMetadata('/portfolio/gezinnen');
  assert.equal(meta.alternates.canonical,'/portfolio/gezinnen');
  assert.equal(meta.openGraph.url,'/portfolio/gezinnen');
  assert.equal(meta.openGraph.title,'Gezinsfotografie in het Westland | Bas Fotografie');
  assert.equal(meta.twitter.description,meta.description);
});

test('preview metadata explicitly prevents indexing and a saved brand title is not duplicated',async()=>{
  await actions.saveSeo(form({path:'/over-mij',title:'Over Bas | Bas Fotografie',description:'Maak kennis met Bas en zijn warme fotografie voor gezinnen, huisdieren en portretten in het Westland.'}));
  const previous=process.env.VERCEL_ENV;
  try{
    process.env.VERCEL_ENV='preview';
    const meta=await metadata.pageMetadata('/over-mij');
    assert.deepEqual(meta.robots,{index:false,follow:false});
    assert.deepEqual(meta.title,{absolute:'Over Bas | Bas Fotografie'});
    process.env.VERCEL_ENV='production';
    assert.equal('robots' in await metadata.pageMetadata('/over-mij'),false);
    assert.deepEqual((await metadata.pageMetadata('/over-mij',{noIndex:true})).robots,{index:false,follow:true});
  }finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});

const booking=(changes={})=>form({submissionId:crypto.randomUUID(),name:'Controle aanvraag',email:'CHECK@example.invalid',type:'Gezin',message:'Een geïsoleerde test zonder externe e-mail.',...changes});
test('booking persists once, records delivery status and duplicate submission does not send twice',async()=>{
  const submission=booking(),id=submission.get('submissionId');
  await assert.rejects(actions.submitAppointment({message:''},submission),/redirect:\/afspraak\/bedankt/);
  await assert.rejects(actions.submitAppointment({message:''},submission),/redirect:\/afspraak\/bedankt/);
  const rows=(await postgres.query('SELECT * FROM requests')).rows;
  assert.equal(rows.length,1);
  assert.equal(rows[0].id,id);
  assert.equal(rows[0].email,'check@example.invalid');
  assert.equal(fixture.emails.length,1);
  assert.equal(await readValue('request:email:'+id),'preview_skipped');
});

test('booking rejects invalid dates and input without storing a request; honeypot is silently ignored',async()=>{
  for(const values of [{name:'x'},{email:'invalid'},{type:'wrong'},{date:'2099-02-30'},{date:'2000-01-01'},{submissionId:'bad-id'},{message:'x'.repeat(3001)}]){
    const result=await actions.submitAppointment({message:''},booking(values));
    assert.ok(result.message.length>10);
  }
  await assert.rejects(actions.submitAppointment({message:''},booking({website:'bot'})),/redirect:\/afspraak\/bedankt/);
  assert.equal((await postgres.query('SELECT * FROM requests')).rows.length,0);
  assert.equal(fixture.emails.length,0);
});

test('booking keeps the saved request on email failure and returns a safe message for a database failure',async()=>{
  fixture.emailError=true;
  const accepted=booking(),id=accepted.get('submissionId');
  await assert.rejects(actions.submitAppointment({message:''},accepted),/redirect:\/afspraak\/bedankt/);
  assert.equal(await readValue('request:email:'+id),'failed');
  assert.equal((await postgres.query('SELECT * FROM requests')).rows.length,1);
  await postgres.exec('TRUNCATE requests;');
  await postgres.exec("ALTER TABLE requests ADD CONSTRAINT reject_test_booking CHECK (name <> 'Database weigert');");
  try{
    const result=await actions.submitAppointment({message:''},booking({name:'Database weigert'}));
    assert.match(result.message,/Je invoer staat er nog/);
    assert.equal((await postgres.query('SELECT * FROM requests')).rows.length,0);
  }finally{await postgres.exec('ALTER TABLE requests DROP CONSTRAINT reject_test_booking;');}
});

test('booking rate limit still permits retrying an already saved submission',async()=>{
  const submissions=[booking(),booking(),booking()];
  for(const submission of submissions)await assert.rejects(actions.submitAppointment({message:''},submission),/redirect:\/afspraak\/bedankt/);
  assert.match((await actions.submitAppointment({message:''},booking())).message,/meerdere aanvragen/);
  await assert.rejects(actions.submitAppointment({message:''},submissions[0]),/redirect:\/afspraak\/bedankt/);
  assert.equal((await postgres.query('SELECT * FROM requests')).rows.length,3);
  assert.equal(fixture.emails.length,3);
});

test('new preparation and contact copy is editable and renders the saved text and useful links',async()=>{
 await actions.saveVisualContents({prepClothingBody:'Mijn eigen kledingadvies staat na opslaan op de voorbereidingspagina.',contactAreaBody:'Mijn eigen uitleg over locaties staat na opslaan op de contactpagina.'});
 const prep=renderToStaticMarkup(await publicPreparation.default()),contact=renderToStaticMarkup(await publicContact.default());
 assert.ok(prep.includes('Mijn eigen kledingadvies'));
 assert.ok(prep.includes('id="huisdieren"'));
 assert.ok(prep.includes('href="/diensten/huisdieren"'));
 assert.ok(contact.includes('Mijn eigen uitleg over locaties'));
 assert.ok(contact.includes('href="tel:+31644733404"'));
 assert.ok(contact.includes('href="/afspraak"'));
 assert.ok(fixture.paths.includes('/voorbereiding'));
 assert.ok(fixture.paths.includes('/contact'));
});

test('service copy is editable and JSON-LD agrees with the public page without fabricated business claims',async()=>{
 await actions.saveVisualContents({familyPracticalBody:'Een eigen toelichting op mijn gezinsfotoshoot in het Westland.',serviceDeliveryBody:'Een eigen toelichting over het ontvangen van de afgesproken digitale foto’s.'});
 const html=renderToStaticMarkup(await publicFamilies.default());
 assert.ok(html.includes('Een eigen toelichting op mijn gezinsfotoshoot'));
 assert.ok(html.includes('Een eigen toelichting over het ontvangen'));
 const scripts=Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),match=>JSON.parse(match[1]));
 const service=scripts.find(item=>item['@type']==='Service');
 assert.equal(service.description,(await content.readContent()).familyIntro);
 const organization=schemaHelpers.websiteGraph()['@graph'].find(item=>item['@type']==='Organization');
 assert.equal(service.provider['@id'],organization['@id']);
 assert.equal(organization.address,undefined);
 assert.equal(organization.aggregateRating,undefined);
 assert.equal(service.offers,undefined);
 assert.ok(fixture.paths.includes('/diensten/gezinnen'));
 assert.ok(fixture.paths.includes('/diensten/huisdieren'));
 assert.ok(fixture.paths.includes('/diensten/portretten'));
});

test('share images match the published service category and hidden photos cannot become share images',async()=>{
 await postgres.query("INSERT INTO portfolio (id,title,category,image_key,position,alt_text,published) VALUES ('visible-family','Eigen gezinsfoto','Gezin','aangeleverd-kind-76912',1,'Gezinsfoto buiten',true),('hidden-family','Verborgen foto','Gezin','aangeleverd-kind-956',0,'Niet publiceren',false)");
 const meta=await metadata.pageMetadata('/diensten/gezinnen');
 assert.equal(meta.openGraph.images[0].url,'/portfolio-eigen/kind-in-het-groen.jpg');
 assert.equal(meta.openGraph.images[0].alt,'Gezinsfoto buiten');
 assert.equal(meta.twitter.images[0],meta.openGraph.images[0].url);
 await postgres.query("UPDATE portfolio SET published=false WHERE id='visible-family'");
 const fallback=await metadata.pageMetadata('/diensten/gezinnen');
 assert.equal(fallback.openGraph.images[0].url,'/portfolio-eigen/hond-met-speeltje.jpg');
});

test('sitemap discovers the new information pages and excludes sample albums and private routes',async()=>{
 const response=await sitemap.GET(),xml=await response.text();
 assert.ok(xml.includes('/contact</loc>'));
 assert.ok(xml.includes('/voorbereiding</loc>'));
 assert.ok(xml.includes('/voorwaarden</loc>'));
 assert.equal(xml.includes('/portfolio/gezinnen</loc>'),false);
 assert.equal(xml.includes('/beheer'),false);
 assert.equal(xml.includes('/album/'),false);
 assert.equal(xml.includes('/voorbeeld'),false);
});

test('SEO title and description roll back together when storage rejects either value',async()=>{
 const title='Bestaande SEO-titel voor contact',description='Deze oorspronkelijke beschrijving voor de contactpagina blijft volledig behouden.';
 await actions.saveSeo(form({path:'/contact',title,description}));
 const rejected='Deze nieuwe beschrijving wordt voor de volledige opslagtest door de database geweigerd.';
 await postgres.exec(`ALTER TABLE site_content ADD CONSTRAINT reject_seo_update CHECK (value <> '${rejected}');`);
 try{
  await assert.rejects(actions.saveSeo(form({path:'/contact',title:'Een nieuwere SEO-titel voor contact',description:rejected})));
  assert.deepEqual(await seoData.readSeo('/contact'),{title,description});
 }finally{await postgres.exec('ALTER TABLE site_content DROP CONSTRAINT reject_seo_update;');}
});

test('unknown and inherited-property album names cannot render an indexable album',async()=>{
 for(const categorie of ['onbekend','constructor','toString']){
  const params=Promise.resolve({categorie});
  assert.equal((await categoryPage.generateMetadata({params})).robots.index,false);
  await assert.rejects(categoryPage.default({params}),/not_found/);
 }
});
