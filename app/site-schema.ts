import {business} from './business';
import {siteUrl} from './site-url';

const absolute=(path:string)=>new URL(path,siteUrl).toString();
export function websiteGraph(){return {
 '@context':'https://schema.org',
 '@graph':[
  {'@type':'Organization','@id':absolute('/#organisatie'),name:business.name,url:absolute('/'),email:business.email,telephone:business.telephone,sameAs:[business.instagram],areaServed:{'@type':'AdministrativeArea',name:'Westland'}},
  {'@type':'WebSite','@id':absolute('/#website'),name:business.name,url:absolute('/'),inLanguage:'nl-NL',publisher:{'@id':absolute('/#organisatie')}},
 ],
};}
export function serviceSchema(slug:string,name:string,description:string){return {
 '@context':'https://schema.org','@type':'Service',
 '@id':absolute(`/diensten/${slug}#dienst`),name,serviceType:name,description,
 url:absolute(`/diensten/${slug}`),provider:{'@id':absolute('/#organisatie')},
 areaServed:{'@type':'AdministrativeArea',name:'Westland'},
};}
export function breadcrumbSchema(items:{name:string;path:string}[]){return {
 '@context':'https://schema.org','@type':'BreadcrumbList',
 itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:absolute(item.path)})),
};}
