
import { getSiteConfig } from '@/config/site';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hub.apks.cc';

function generateSitemapXml(urls: { url: string; lastModified?: string | Date }[]): string {
  const urlTags = urls
    .map(url => `
      <url>
        <loc>${url.url}</loc>
        ${url.lastModified ? `<lastmod>${new Date(url.lastModified).toISOString()}</lastmod>` : ''}
      </url>
    `)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlTags}
</urlset>`;
}

export async function GET(
  request: Request,
  { params }: { params: { pkg: string } }
) {
  const pkgName = params.pkg;

  if (!pkgName) {
    notFound();
  }

  const siteConfig = await getSiteConfig(pkgName);

  if (!siteConfig) {
    notFound();
  }

  const encodedSiteName = encodeURIComponent(siteConfig.name);
  const sitemapUrls = [];

  // Add home page
  sitemapUrls.push({
    url: `${BASE_URL}/${encodedSiteName}/${pkgName}`,
    lastModified: new Date(),
  });

  // Add article pages
  for (const section of siteConfig.sections) {
    if (section.items && section.items.length > 0) {
      for (const item of section.items) {
        if(item.slug){
            sitemapUrls.push({
              url: `${BASE_URL}/${encodedSiteName}/${pkgName}/articles/${item.slug}`,
              lastModified: item.date ? new Date(item.date) : new Date(),
            });
        }
      }
    }
  }

  const sitemapXml = generateSitemapXml(sitemapUrls);

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
