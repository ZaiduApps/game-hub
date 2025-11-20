
import { getSiteConfig } from '@/config/site';
import { HomePageContent } from '@/components/HomePageContent';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const siteConfig = await getSiteConfig();
  return <HomePageContent siteConfig={siteConfig} />;
}
