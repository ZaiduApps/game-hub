
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
    other: {
      ...(siteConfig.analytics?.baiduVerification && { 'baidu-site-verification': siteConfig.analytics.baiduVerification }),
      ...(siteConfig.analytics?.googleVerification && { 'google-site-verification': siteConfig.analytics.googleVerification }),
      ...(siteConfig.analytics?.sogouVerification && { 'sogou_site_verification': siteConfig.analytics.sogouVerification }),
      ...(siteConfig.analytics?.qihuVerification && { '360-site-verification': siteConfig.analytics.qihuVerification }),
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans" className="dark">
      <head />
      <body className="font-body antialiased bg-background text-foreground">
        <Suspense