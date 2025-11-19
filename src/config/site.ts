import { z } from 'zod';
import type { SiteConfig } from './default-site-config';
import { defaultSiteConfig } from './default-site-config';

// Re-exporting types from the new default config file
export type { SiteConfig, Article, Section, Update };

const ArticleSchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    author: z.string().optional(),
    date: z.string(),
    imageUrl: z.string().url(),
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
    }).optional(),
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


export const getSiteConfig = async (pkg?: string): Promise<SiteConfig> => {
    if (!pkg) {
        console.log("No pkg provided, using default site config.");
        return defaultSiteConfig;
    }

    const apiUrl = `https://api.us.apks.cc/game/site-config?pkg=${pkg}`;
    
    try {
        console.log(`Fetching site config from: ${apiUrl}`);
        const response = await fetch(apiUrl, { cache: 'no-store' });
        
        if (!response.ok) {
            console.error(`API request failed with status ${response.status}, falling back to default.`);
            return defaultSiteConfig;
        }

        const data = await response.json();
        const parsedData = SiteConfigSchema.safeParse(data);
        
        if (parsedData.success) {
            console.log("Successfully fetched and parsed dynamic config.");
            // Deep merge the dynamic config with the default config
            return parsedData.data as SiteConfig;
        } else {
            console.error("Failed to parse dynamic config, falling back to default.", parsedData.error.toString());
            return defaultSiteConfig;
        }
    } catch (error) {
        console.error("Error fetching or parsing site config, falling back to default:", error);
        return defaultSiteConfig;
    }
};


export const getArticleBySlug = async (slug: string, pkg?: string) => {
    const config = await getSiteConfig(pkg);
    for (const section of config.sections) {
        if (!section.items) continue;
        const article = section.items.find((item: any) => item.slug === slug);
        if (article) {
            return article;
        }
    }
    return null;
};