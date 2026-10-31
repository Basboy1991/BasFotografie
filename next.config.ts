import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers(){return [{source:'/portfolio-web/:path*',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]}];},
  async redirects(){return [
    {source:'/pakketten',destination:'/tarieven',permanent:true},
    ...[['Gezinnen','gezinnen'],['Huisdieren','huisdieren'],['Portretten','portretten'],['Kinderen','portretten']].map(([category,slug])=>({source:'/portfolio',has:[{type:'query' as const,key:'category',value:category}],destination:`/portfolio/${slug}`,permanent:true})),
  ];},
};

export default nextConfig;
