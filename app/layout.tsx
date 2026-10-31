import type {Metadata} from 'next';
import localFont from 'next/font/local';
import VisualPreviewBridge from './components/visual-preview-bridge';
import SiteHeader from './components/site-header';import SiteFooter from './components/site-footer';import './globals.css';
import './editorial.css';
import {siteUrl} from './site-url';
const editorialFont=localFont({src:[{path:'../public/fonts/instrument-serif-latin.woff2',weight:'400',style:'normal'},{path:'../public/fonts/instrument-serif-italic-latin.woff2',weight:'400',style:'italic'}],variable:'--font-editorial',display:'swap',fallback:['Georgia','Times New Roman']});
const bodyFont=localFont({src:'../public/fonts/dm-sans-latin.woff2',weight:'400 700',variable:'--font-body',display:'swap',fallback:['Arial']});
export const dynamic='force-dynamic';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Bas Fotografie | Gezinnen, huisdieren en portretten',template:'%s | Bas Fotografie'},description:'Warme, ongedwongen fotografie voor gezinnen, huisdieren en portretten. Bekijk het portfolio en vraag een fotosessie aan.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'nl_NL',siteName:'Bas Fotografie'},robots:process.env.VERCEL_ENV==='preview'?{index:false,follow:false}:undefined,icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl" className={`${editorialFont.variable} ${bodyFont.variable}`}><body><a className="skip-link" href="#main-content">Naar de inhoud</a><VisualPreviewBridge/><SiteHeader/><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter/></body></html>}
