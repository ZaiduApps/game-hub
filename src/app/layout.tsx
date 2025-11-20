
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig } from '@/config/site';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

type LayoutProps = {
  children: React.ReactNode;
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {
  const pkg = searchParams?.pkg as string | undefined;
  const siteConfig = await getSiteConfig(pkg);
  
  const previousImages = (await parent).openGraph?.images || [];

  const metadata: Metadata = {
    metadataBase: new URL('https://example.com'), // Replace with your actual domain
    title: {
      default: `${siteConfig.name} - ${siteConfig.seo.title}`,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords,
    verification: {},
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
    }
  };
  
  if (siteConfig.analytics?.googleVerification) {
    metadata.verification!.google = siteConfig.analytics.googleVerification;
  }
  if (siteConfig.analytics?.baiduVerification) {
     metadata.verification!.other = {
      ...(metadata.verification!.other),
      'baidu-site-verification': siteConfig.analytics.baiduVerification,
    };
  }
  if (siteConfig.analytics?.sogouVerification) {
    metadata.verification!.other = {
      ...(metadata.verification!.other),
      'sogou_site_verification': siteConfig.analytics.sogouVerification,
    };
  }
  if (siteConfig.analytics?.qihuVerification) {
    metadata.verification!.other = {
      ...(metadata.verification!.other),
      '360-site-verification': siteConfig.analytics.qihuVerification,
    };
  }

  return metadata;
}

export default async function RootLayout({
  children,
  searchParams,
}: LayoutProps) {
  const pkg = searchParams?.pkg as string | undefined;
  const siteConfig = await getSiteConfig(pkg);

  return (
    <html lang="zh-Hans" className="dark">
      <head>
        {siteConfig.analytics?.baiduAnalyticsId && (
          <Script id="baidu-analytics" strategy="afterInteractive">
            {`
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?${siteConfig.analytics.baiduAnalyticsId}";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
            `}
          </Script>
        )}
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Suspense>
          <main>{children}</main>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
