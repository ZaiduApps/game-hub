
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig } from '@/config/site';
import Script from 'next/script';

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
    title: {
      default: `${siteConfig.name} - ${siteConfig.seo.title}`,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords,
    openGraph: {
      title: `${siteConfig.name} - ${siteConfig.seo.title}`,
      description: siteConfig.seo.description,
      images: [siteConfig.seo.ogImage, ...previousImages],
    },
    other: {},
  };

  if (siteConfig.analytics) {
    if (siteConfig.analytics.baiduVerification && metadata.other) {
        metadata.other['baidu-site-verification'] = siteConfig.analytics.baiduVerification;
    }
    if (siteConfig.analytics.googleVerification && metadata.other) {
        metadata.other['google-site-verification'] = siteConfig.analytics.googleVerification;
    }
    if (siteConfig.analytics.sogouVerification && metadata.other) {
        metadata.other['sogou_site_verification'] = siteConfig.analytics.sogouVerification;
    }
    if (siteConfig.analytics.qihuVerification && metadata.other) {
        metadata.other['360-site-verification'] = siteConfig.analytics.qihuVerification;
    }
  }


  return metadata;
}

export default async function RootLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pkg = searchParams?.pkg as string | undefined;
  const siteConfig = await getSiteConfig(pkg);
  
  const extractScript = (html: string) => {
    const scriptRegex = /<script>([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    return match ? match[1] : '';
  };
  
  const analyticsScript = siteConfig.analytics?.customHeadHtml
    ? extractScript(siteConfig.analytics.customHeadHtml)
    : '';

  return (
    <html lang="zh-Hans" className="dark">
      <head>
        {analyticsScript && (
          <Script id="analytics-script" strategy="afterInteractive">
            {analyticsScript}
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
