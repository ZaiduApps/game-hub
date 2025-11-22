import type { Metadata } from 'next';
import { getSiteConfig } from '@/config/site';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  if (!siteConfig) {
    return {
      title: 'Site Not Found',
      description: 'The requested site configuration could not be loaded.',
    }
  }
  
  const metadata: Metadata = {
    metadataBase: new URL('https://example.com'), 
    title: {
      default: `${siteConfig.name} - ${siteConfig.seo.title}`,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords,
    openGraph: {
      title: `${siteConfig.name} - ${siteConfig.seo.title}`,
      description: siteConfig.seo.description,
      images: siteConfig.seo.ogImage ? [siteConfig.seo.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} - ${siteConfig.seo.title}`,
      description: siteConfig.seo.description,
      images: siteConfig.seo.ogImage ? [siteConfig.seo.ogImage] : [],
    },
    verification: {},
    other: {}
  };

  if (siteConfig.analytics?.customHeadHtml) {
    const metaRegex = /<meta\s+name="([^"]+)"\s+content="([^"]+)"\s*\/?>/g;
    let match;
    while ((match = metaRegex.exec(siteConfig.analytics.customHeadHtml)) !== null) {
      const name = match[1];
      const content = match[2];

      if (name === 'google-site-verification') {
          if(!metadata.verification) metadata.verification = {};
          metadata.verification.google = content;
      } else if (name === 'baidu-site-verification') {
          if(!metadata.verification) metadata.verification = {};
          if(!metadata.verification.other) metadata.verification.other = {};
          metadata.verification.other['baidu-site-verification'] = [content];
      } else {
          if (!metadata.other) metadata.other = {};
          metadata.other[name] = content;
      }
    }
  }

  return metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans" className="dark" suppressHydrationWarning>
      <head />
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
