
import type { Metadata, ResolvingMetadata } from 'next';
import { getSiteConfig } from '@/config/site';

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
    }
  };
  
  return metadata;
}

export default function PkgLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
