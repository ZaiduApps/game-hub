
import { getSiteConfig, getArticleBySlug } from '@/config/site';
import { HomePageContent } from '@/components/HomePageContent';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContextualInfo } from '@/components/ContextualInfo';
import { CommentSection } from '@/components/CommentSection';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const dynamic = 'force-dynamic';

interface PkgPageProps {
  params: { pkg?: string[] };
}

export default async function PkgPage({ params }: PkgPageProps) {
    const pkgSegments = params.pkg || ['com.tencent.ig'];
    const pkgName = pkgSegments[0];
    const isArticlePage = pkgSegments.length > 2 && pkgSegments[1] === 'articles';
    
    if (isArticlePage) {
        const slug = pkgSegments[2];
        const article = await getArticleBySlug(slug, pkgName);
        const siteConfig = await getSiteConfig(pkgName);

        if (!article || !siteConfig) {
            notFound();
        }

        return (
            <>
                <Header siteConfig={siteConfig} pkg={pkgName} />
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
                        unoptimized
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
                <Footer siteConfig={siteConfig} pkg={pkgName} />
            </>
        );

    }

    // Default to homepage
    const siteConfig = await getSiteConfig(pkgName);
    if (!siteConfig) {
        notFound();
    }
    return <HomePageContent siteConfig={siteConfig} pkg={pkgName} />;
}
