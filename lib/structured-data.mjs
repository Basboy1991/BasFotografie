/** Keep CMS text inside JSON, never inside executable HTML. */
export const jsonLd=value=>JSON.stringify(value).replace(/</g,'\\u003c');
export const xmlText=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
