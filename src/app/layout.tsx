
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
  const pkg = searchParams?.pkg;
  const siteConfig = await getSiteConfig(pkg as string | undefined);
  
  const previousImages = (await parent).openGraph?.images || [];

  return {
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
  };
}

export default async function RootLayout({
  children,
  searchParams,
}: LayoutProps) {
  const pkg = searchParams?.pkg;
  const siteConfig = await getSiteConfig(pkg as string | undefined);

  return (
    <html lang="zh-Hans" className="dark">
      <head>
        {siteConfig.analytics?.customHeadHtml && (
          <Script id="analytics-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: siteConfig.analytics.customHeadHtml }} />
        )}
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Suspense>
          {children}
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
