import type {Metadata} from 'next';
import VisualPreviewBridge from './components/visual-preview-bridge';
import SiteHeader from './components/site-header';import SiteFooter from './components/site-footer';import './globals.css';
import {siteUrl} from './site-url';
export const dynamic='force-dynamic';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Bas Fotografie | Gezinnen, huisdieren en portretten',template:'%s | Bas Fotografie'},description:'Warme, ongedwongen fotografie voor gezinnen, huisdieren en portretten. Bekijk het portfolio en vraag een fotosessie aan.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'nl_NL',siteName:'Bas Fotografie'},icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl"><body><VisualPreviewBridge/><SiteHeader/>{children}<SiteFooter/></body></html>}
