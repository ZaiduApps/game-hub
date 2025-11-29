
import { getArticleBySlug, getSiteConfig } from '@/config/site';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContextualInfo } from '@/components/ContextualInfo';
import { CommentSection } from '@/components/CommentSection';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string; pkg?: string[] };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const awaitedParams = await params;
  const pkgName = awaitedParams.pkg?.[1];
  const article = await getArticleBySlug(params.slug, pkgName);
  const siteConfig = await getSiteConfig(pkgName);
  
  const previousImages = (await parent).openGraph?.images || [];

  if (!article || !siteConfig) {
    return {
      title: `文章未找到 - ${siteConfig?.name || ''}`,
    };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl, ...previousImages] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const awaitedParams = await params;
  const pkgName = awaitedParams.pkg?.[1];
  const article = await getArticleBySlug(params.slug, pkgName);
  
  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          {article.imageUrl && 
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          }
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
  );
}
