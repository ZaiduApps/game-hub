
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { getSiteConfig, SiteConfig } from '@/config/site';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicContent } from '@/components/DynamicContent';
import Home from './page';

type LayoutProps = {
  children: React.ReactNode;
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: LayoutProps, parent: ResolvingMetadata): Promise<Metadata> {
  const pkg = typeof searchParams?.pkg === 'string' ? searchParams.pkg : undefined;
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
  };
}

export default function RootLayout({
  children,
  searchParams,
}: LayoutProps) {
  const pkg = typeof searchParams?.pkg === 'string' ? searchParams.pkg : undefined;

  return (
    <html lang="zh-Hans" className="dark">
      <head />
      <body className="font-body antialiased bg-background text-foreground">
        <Suspense fallback={<RootSkeleton />}>
          <DynamicContent pkg={pkg}>
            <Home />
          </DynamicContent>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}

function RootSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex items-center space-x-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-24 hidden md:block" />
          <Skeleton className="h-8 w-8 md:hidden" />
        </div>
      </header>
      <main className="flex-grow">
        <div className="flex flex-col gap-12 md:gap-16 pb-16">
          <Skeleton className="w-full aspect-video" />
        </div>
      </main>
      <footer className="border-t border-border/40 py-8">
        <div className="px-4 md:px-6">
          <Skeleton className="h-8 w-48 mx-auto" />
        </div>
      </footer>
    </div>
  );
}
