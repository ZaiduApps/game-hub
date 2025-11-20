
import { getSiteConfig } from '@/config/site';
import { HomePageContent } from '@/components/HomePageContent';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PkgHomePageProps {
  params: { pkg?: string };
}

export default async function PkgHomePage({ params }: PkgHomePageProps) {
  if (!params.pkg) {
    notFound();
  }
  const siteConfig = await getSiteConfig(params.pkg);
  return <HomePageContent siteConfig={siteConfig} pkg={params.pkg} />;
}
