import { getArticleBySlug } from '@/config/site';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContextualInfo } from '@/components/ContextualInfo';
import { CommentSection } from '@/components/CommentSection';
import type { Metadata, ResolvingMetadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getSiteConfig } from '@/config/site';
import { fallbackSiteConfig } from '@/lib/data';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const pkg = typeof searchParams?.pkg === 'string' ? searchParams.pkg : undefined;
  const siteConfig = await getSiteConfig(pkg) ?? fallbackSiteConfig;
  const article = await getArticleBySlug(params.slug, pkg);
  
  const previousImages = (await parent).openGraph?.images || [];

  if (!article) {
    return {
      title: `文章未找到 - ${siteConfig.name}`,
    };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.imageUrl, ...previousImages],
    },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const pkg = typeof searchParams?.pkg === 'string' ? searchParams.pkg : undefined;
  const article = await getArticleBySlug(params.slug, pkg);
  const siteConfig = await getSiteConfig(pkg) ?? fallbackSiteConfig;

  if (!article) {
    notFound();
  }

  return (
    <>
    <Header siteConfig={siteConfig} />
    <article className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-tight mb-3">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            发布于 {new Date(article.date).toLocaleDateString()} {article.author && ` by ${article.author}`}
          </p>
        </header>

        <MarkdownContent content={article.content} />
        
        <ContextualInfo content={article.content} />

        <CommentSection />
      </div>
    </article>
    <Footer siteConfig={siteConfig} />
    </>
  );
}
