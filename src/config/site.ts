
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Helper function for deep merging configurations
function mergeDeep(target: any, source: any) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}


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
}).passthrough();

const SectionSchema = z.object({
    id: z.string(),
    title: z.string(),
    navLabel: z.string(),
    enabled: z.boolean().optional(),
    items: z.array(ArticleSchema),
}).passthrough();

const SiteConfigSchema = z.object({
    name: z.string(),
    seo: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        ogImage: z.string().url().or(z.literal("")),
    }).passthrough(),
    analytics: z.object({
       customHeadHtml: z.string().optional(),
    }).passthrough().nullable(),
    header: z.object({
        logo: z.object({
            url: z.string().url().or(z.literal("")),
            alt: z.string(),
        }),
    }).passthrough(),
    hero: z.object({
        backgroundImage: z.string().url(),
        title: z.string(),
        description: z.string(),
    }).passthrough(),
    downloads: z.object({
        googlePlay: z.object({
            url: z.string().url().or(z.literal("")),
            backgroundImage: z.string().url(),
            srText: z.string(),
        }).passthrough().nullable(),
        appStore: z.object({
            url: z.string().url().or(z.literal("")),
            backgroundImage: z.string().url(),
            srText: z.string(),
        }).passthrough().nullable(),
        apk: z.object({
            backgroundImage: z.string().url(),
            line1: z.string(),
            line2: z.string(),
            dialog: z.object({
                title: z.string(),
                description: z.string(),
                panUrl: z.string().url().or(z.literal("")),
                officialUrl: z.string().url().or(z.literal("")),
            }).passthrough(),
        }).passthrough().nullable(),
    }).passthrough(),
    video: z.object({
        id: z.string(),
        title: z.string(),
        url: z.string().url().nullable(),
        playerTitle: z.string(),
        navLabel: z.string(),
        enabled: z.boolean(),
    }).passthrough(),
    footer: z.object({
        description: z.string(),
        copyright: z.string(),
        feedback: z.object({
            email: z.string().email(),
            buttonText: z.string(),
            dialogTitle: z.string(),
            dialogDescription: z.string(),
        }).passthrough(),
    }).passthrough(),
    sections: z.array(SectionSchema),
}).passthrough();

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Update = Article;

let defaultConfig: SiteConfig | null = null;
const fetchDefaultConfig = async (): Promise<SiteConfig> => {
    if (defaultConfig) {
        return defaultConfig;
    }
    try {
        const filePath = path.join(process.cwd(), 'public', 'default-site-config.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const parsed = SiteConfigSchema.parse(data);
        defaultConfig = parsed;
        return parsed;
    } catch (error) {
        console.error("CRITICAL: Failed to read or parse default site configuration.", error);
        throw new Error("Could not load the default site configuration.");
    }
};

export const getSiteConfig = async (pkg?: string): Promise<SiteConfig> => {
    const baseConfig = await fetchDefaultConfig();

    if (pkg) {
        const apiUrl = `https://api.us.apks.cc/game/site-config?pkg=${pkg}`;
        try {
            const response = await fetch(apiUrl, { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                const parsedData = SiteConfigSchema.safeParse(data);
                if (parsedData.success) {
                    // Deep merge the dynamic config over the default config
                    return mergeDeep(baseConfig, parsedData.data);
                } else {
                     console.error(`Failed to parse dynamic config for pkg: ${pkg}. Falling back to default.`, parsedData.error.toString());
                }
            } else {
                console.error(`API request failed with status ${response.status} for pkg: ${pkg}. Falling back to default.`);
            }
        } catch (error) {
            console.error(`Error fetching or parsing site config for pkg: ${pkg}. Falling back to default:`, error);
        }
    }
    
    // Fallback to default if no pkg or if API fails
    return baseConfig;
};


export const getArticleBySlug = async (slug: string, pkg?: string): Promise<Article | null> => {
    const config = await getSiteConfig(pkg);
    
    for (const section of config.sections) {
        const article = section.items.find((item) => item.slug === slug);
        if (article) {
            return {
              ...article,
              // Ensure pkg is passed to article links if it exists
              slug: pkg ? `/articles/${article.slug}?pkg=${pkg}` : `/articles/${article.slug}`
            };
        }
    }
    
    return null;
};
