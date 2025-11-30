
import type { Metadata, ResolvingMetadata } from 'next';
import { getSiteConfig } from '@/config/site';
import Script from 'next/script';
import { Suspense } from 'react';
import { FloatingHelpButton } from '@/components/FloatingHelpButton';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const dynamic = 'force-dynamic';

type LayoutProps = {
  children: React.ReactNode;
  params: { pkg?: string[] };
};

export async function generateMetadata({ params }: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {
  const awaitedParams = await params;
  const pkgSegments = awaitedParams.pkg || [];
  let pkgName: string | undefined;

  if (pkgSegments.length === 1) {
    pkgName = pkgSegments[0];
  } else if (pkgSegments.length >= 2) {
    pkgName = pkgSegments[1];
  }
  
  const siteConfig = await getSiteConfig(pkgName);
  
  if (!siteConfig) {
    return {
      title: 'Site Not Found',
      description: 'The requested site configuration could not be loaded.',
    }
  }

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
      title: `${siteConfig.name} - ${siteConfig.name}`,
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

export default async function PkgLayout({ children, params }: LayoutProps) {
  const awaitedParams = await params;
  const pkgSegments = awaitedParams.pkg || [];
  let pkgName: string | undefined;

  if (pkgSegments.length === 1) {
    pkgName = pkgSegments[0];
  } else if (pkgSegments.length >= 2) {
    pkgName = pkgSegments[1];
  }
  
  const siteConfig = await getSiteConfig(pkgName);

  let baiduScriptSrc: string | undefined;
  let baiduScriptInnerHtml: string | undefined;

  if (siteConfig?.analytics?.customHeadHtml) {
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
      const srcRegex = /src="([^"]+)"/;
      let match;
      while ((match = scriptRegex.exec(siteConfig.analytics.customHeadHtml)) !== null) {
          const scriptTag = match[0];
          const srcMatch = scriptTag.match(srcRegex);
          if (srcMatch && srcMatch[1]) {
              baiduScriptSrc = srcMatch[1];
          }
          if (match[1].trim()) {
              baiduScriptInnerHtml = match[1].trim();
          }
      }
  }
  
  return (
    <>
      {siteConfig && <Header siteConfig={siteConfig} pkg={pkgName} />}
      <Suspense>
        <main>{children}</main>
      </Suspense>
      {siteConfig && <FloatingHelpButton />}
      {siteConfig && <Footer siteConfig={siteConfig} pkg={pkgName} />}
      {baiduScriptSrc && (
          <Script src={baiduScriptSrc} strategy="afterInteractive" />
      )}
      {baiduScriptInnerHtml && (
          <Script id="baidu-analytics-inline" strategy="afterInteractive">
              {baiduScriptInnerHtml}
          </Script>
      )}
    </>
  );
}
