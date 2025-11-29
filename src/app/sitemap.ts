import { MetadataRoute } from 'next';
import { getSiteConfig } from '@/config/site';

// TODO: Add new package names here to include them in the sitemap.
// This is the only place you need to update when a new package is added.
const PACKAGES = ['com.tencent.ig', 'com.heavenburnsred'];
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pubgmobile.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const pkg of PACKAGES) {
    const siteConfig = await getSiteConfig(pkg);

    if (siteConfig) {
      const encodedSiteName = encodeURIComponent(siteConfig.name);
      
      // Add the package's home page
      sitemapEntries.push({
        url: `${BASE_URL}/${encodedSiteName}/${pkg}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Add all article pages for the package
      for (const section of siteConfig.sections) {
        if (section.items && section.items.length > 0) {
          for (const item of section.items) {
            sitemapEntries.push({
              url: `${BASE_URL}/${encodedSiteName}/${pkg}/articles/${item.slug}`,
              lastModified: new Date(item.date),
              changeFrequency: 'weekly',
              priority: 0.8,
            });
          }
        }
      }
    }
  }

  return sitemapEntries;
}
