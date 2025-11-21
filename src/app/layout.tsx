
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig } from '@/config/site';
import Script from 'next/script';
import { JSDOM } from 'jsdom';

export const dynamic = 'force-dynamic';

type LayoutProps = {
  children: React.ReactNode;
  params: { pkg?: string };
};

export async function generateMetadata({ params }: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {
  const siteConfig = await getSiteConfig(params.pkg);
  
  const previousImages = (await parent).openGraph?.images || [];

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
      images: siteConfig.seo.ogImage ? [siteConfig.seo.ogImage, ...previousImages] : previousImages,
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

  // Parse customHeadHtml for meta tags
  if (siteConfig.analytics?.customHeadHtml) {
    const dom = new JSDOM(`<!DOCTYPE html><html><head>${siteConfig.analytics.customHeadHtml}</head><body></body></html>`);
    const metaTags = dom.window.document.head.querySelectorAll('meta');
    
    metaTags.forEach(tag => {
      const name = tag.getAttribute('name');
      const content = tag.getAttribute('content');

      if (name && content) {
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
    });
  }
  
  return metadata;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const siteConfig = await getSiteConfig(params.pkg);

  // Extract script from customHeadHtml
  let baiduScript: { src?: string; innerHTML?: string } = {};
  if (siteConfig.analytics?.customHeadHtml) {
    const dom = new JSDOM(`<!DOCTYPE html><html><head>${siteConfig.analytics.customHeadHtml}</head><body></body></html>`);
    const scriptTag = dom.window.document.head.querySelector('script');
    if (scriptTag) {
        if (scriptTag.src) {
            baiduScript.src = scriptTag.src;
        }
        if (scriptTag.innerHTML) {
            baiduScript.innerHTML = scriptTag.innerHTML;
        }
    }
  }

  return (
    <html lang="zh-Hans" className="dark">
      <head />
      <body className="font-body antialiased bg-background text-foreground">
        <Suspense>
          <main>{children}</main>
        </Suspense>
        <Toaster />
        {baiduScript.src && (
            <Script src={baiduScript.src} strategy="afterInteractive" />
        )}
        {baiduScript.innerHTML && (
            <Script id="baidu-analytics-inline" strategy="afterInteractive">
                {baiduScript.innerHTML}
            </Script>
        )}
      </body>
    </html>
  );
}

