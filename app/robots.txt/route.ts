export const dynamic='force-dynamic';
import {siteUrl} from '../site-url';
export function GET(){const preview=process.env.VERCEL_ENV==='preview';const body=preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /beheer\nDisallow: /album\nDisallow: /api/\nAllow: /api/image/\nDisallow: /klant\nDisallow: /voorbeeld\nDisallow: /cms-hashhulp.html\nDisallow: /afspraak/bedankt\nSitemap: ${siteUrl}/sitemap.xml\n`;return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});}
