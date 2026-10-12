export const dynamic='force-dynamic';
import {siteUrl} from '../site-url';
export function GET(){return new Response(`User-agent: *\nAllow: /\nDisallow: /beheer/\nDisallow: /album/\nDisallow: /api/\nDisallow: /klant/\nDisallow: /afspraak/bedankt/\nSitemap: ${siteUrl}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
