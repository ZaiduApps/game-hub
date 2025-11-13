
'use client';

import React, { useState, useEffect } from 'react';
import { SiteConfig, getSiteConfig } from '@/config/site';
import { Header } from './layout/header';
import { Footer } from './layout/footer';
import { Skeleton } from './ui/skeleton';

interface DynamicContentProps {
  pkg?: string;
  children: React.ReactNode;
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


export function DynamicContent({ pkg, children }: DynamicContentProps) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      const config = await getSiteConfig(pkg);
      setSiteConfig(config);
      setIsLoading(false);
    };

    fetchConfig();
  }, [pkg]);

  if (isLoading || !siteConfig) {
    return <RootSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {siteConfig.header && <Header siteConfig={siteConfig} />}
      <main className="flex-grow">
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                // @ts-ignore
                return React.cloneElement(child, { siteConfig, pkg });
            }
            return child;
        })}
      </main>
      {siteConfig.footer && <Footer siteConfig={siteConfig} />}
    </div>
  );
}
