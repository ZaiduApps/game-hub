import { z } from 'zod';

const ArticleSchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    author: z.string().optional(),
    date: z.string(),
    imageUrl: z.string().url().or(z.literal("")),
    imageHint: z.string(),
    version: z.string().optional(),
});

const SectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    navLabel: z.string(),
    enabled: z.boolean().optional(),
    items: z.array(ArticleSchema),
});

const SiteConfigSchema = z.object({
    name: z.string(),
    seo: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        ogImage: z.string().url().or(z.literal("")),
    }),
    analytics: z.object({
        baiduVerification: z.string().optional(),
        googleVerification: z.string().optional(),
        sogouVerification: z.string().optional(),
        qihuVerification: z.string().optional(),
        baiduAnalyticsId: z.string().optional(),
    }).optional().nullable(),
    header: z.object({
        logo: z.object({
            url: z.string().url(),
            alt: z.string(),
        }),
    }),
    hero: z.object({
        backgroundImage: z.string().url(),
        title: z.string(),
        description: z.string(),
    }),
    downloads: z.object({
        googlePlay: z.object({
            url: z.string().url().or(z.literal("")),
            backgroundImage: z.string().url(),
            srText: z.string(),
        }).nullable(),
        appStore: z.object({
            url: z.string().url().or(z.literal("")),
            backgroundImage: z.string().url(),
            srText: z.string(),
        }).nullable(),
        apk: z.object({
            backgroundImage: z.string().url(),
            line1: z.string(),
            line2: z.string(),
            dialog: z.object({
                title: z.string(),
                description: z.string(),
                panUrl: z.string().url().or(z.literal("")),
                officialUrl: z.string().url().or(z.literal("")),
            }),
        }).nullable(),
    }),
    video: z.object({
        id: z.string(),
        title: z.string(),
        url: z.string().url().nullable(),
        playerTitle: z.string(),
        navLabel: z.string(),
        enabled: z.boolean(),
    }),
    footer: z.object({
        description: z.string(),
        copyright: z.string(),
        feedback: z.object({
            email: z.string().email(),
            buttonText: z.string(),
            dialogTitle: z.string(),
            dialogDescription: z.string(),
        }),
    }),
    sections: z.array(SectionSchema),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Update = Article;

export const getSiteConfig = async (pkg?: string): Promise<SiteConfig | null> => {
    if (!pkg) {
        // When no pkg is provided, we'll let the caller handle the fallback.
        return null;
    }

    const apiUrl = `https://api.us.apks.cc/game/site-config?pkg=${pkg}`;
    
    try {
        const response = await fetch(apiUrl, { cache: 'no-store' });
        
        if (!response.ok) {
            console.error(`API request failed with status ${response.status} for pkg: ${pkg}.`);
            return null; // Let caller handle fallback
        }

        const data = await response.json();
        const parsedData = SiteConfigSchema.safeParse(data);
        
        if (parsedData.success) {
            return parsedData.data;
        } else {
            console.error(`Failed to parse dynamic config for pkg: ${pkg}.`, parsedData.error.toString());
            return null; // Let caller handle fallback
        }
    } catch (error) {
        console.error(`Error fetching or parsing site config for pkg: ${pkg}:`, error);
        return null; // Let caller handle fallback
    }
};

export const getArticleBySlug = async (slug: string, pkg?: string): Promise<Article | null> => {
    const config = await getSiteConfig(pkg);
    if (config) {
        for (const section of config.sections) {
            const article = section.items.find((item) => item.slug === slug);
            if (article) {
                return article;
            }
        }
    }
    
    // Fallback to local data if dynamic fetch fails or article not found
    const { articles, updates } = await import('@/lib/data');
    const allItems = [...articles, ...updates];
    return allItems.find(a => a.slug === slug) || null;
};
