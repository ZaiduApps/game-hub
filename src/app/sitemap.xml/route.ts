import { getSiteConfig } from '@/config/site';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hub.apks.cc';

// This is a static root sitemap that can point to other sitemaps.
// For now, it just points to the main package's sitemap.
export async function GET() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/com.tencent.ig/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;
  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
