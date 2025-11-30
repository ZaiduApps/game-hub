
import { getSiteConfig, getArticleBySlug } from '@/config/site';
import { HomePageContent } from '@/components/HomePageContent';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ContextualInfo } from '@/components/ContextualInfo';
import { CommentSection } from '@/components/CommentSection';

export const dynamic = 'force-dynamic';

interface PkgPageProps {
  params: { pkg?: string[] };
}

export default async function PkgPage({ params }: PkgPageProps) {
    const pkgSegments = params.pkg || [];
    let pkgName: string;
    let siteName: string | undefined;

    if (pkgSegments.length >= 2) {
        siteName = decodeURIComponent(pkgSegments[0]);
        pkgName = pkgSegments[1];
    } else if (pkgSegments.length === 1) {
        // This case should now be handled by the middleware redirect, 
        // but as a fallback, we'll try to load the config and render.
        // The middleware will ensure the URL is corrected for the user.
        pkgName = pkgSegments[0];
    }
    else {
        // This case is handled by middleware, but we redirect as a fallback.
        redirect('/');
    }
    
    const siteConfig = await getSiteConfig(pkgName);

    if (!siteConfig) {
        // If the config can't be fetched for a pkgName, redirect to the root.
        // The root will then be handled by the middleware.
        redirect('/');
    }
    
    const isArticlePage = pkgSegments.length > 2 && pkgSegments[2] === 'articles';
    if (isArticlePage) {
        const slug = pkgSegments[3];
        if (!slug) {
            notFound();
        }
        const article = await getArticleBySlug(slug, pkgName);

        if (!article) {
            notFound();
        }

        return (
            <article className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                {article.imageUrl && (
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
                )}
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

    return <HomePageContent siteConfig={siteConfig} pkg={pkgName} />;
}
