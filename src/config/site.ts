
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const ArticleSchema = z.object({
    slug: z.string(),
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    author: z.string().optional(),
    date: z.string(),
    imageUrl: z.string().url().or(z.literal("")).nullable().optional(),
    imageHint: z.string().nullable().optional(),
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
        ogImage: z.string().url().or(z.literal("")).nullable().optional(),
    }).passthrough(),
    analytics: z.object({
       customHeadHtml: z.string().optional(),
    }).passthrough().nullable(),
    header: z.object({
        logo: z.object({
            url: z.string().url().or(z.literal("")).nullable().optional(),
            alt: z.string(),
        }),
    }).passthrough(),
    hero: z.object({
        backgroundImage: z.string().url().or(z.literal("")).nullable().optional(),
        title: z.string(),
        description: z.string(),
    }).passthrough(),
    downloads: z.object({
        googlePlay: z.object({
            url: z.string().url().or(z.literal("")).nullable().optional(),
            backgroundImage: z.string().url().or(z.literal("")).nullable().optional(),
            srText: z.string(),
        }).passthrough().nullable(),
        appStore: z.object({
            url: z.string().url().or(z.literal("")).nullable().optional(),
            backgroundImage: z.string().url().or(z.literal("")).nullable().optional(),
            srText: z.string(),
        }).passthrough().nullable(),
        apk: z.object({
            backgroundImage: z.string().url().or(z.literal("")).nullable().optional(),
            line1: z.string(),
            line2: z.string(),
            dialog: z.object({
                title: z.string(),
                description: z.string(),
                panUrl: z.string().url().or(z.literal("")).nullable().optional(),
                officialUrl: z.string().url().or(z.literal("")).nullable().optional(),
            }).passthrough(),
        }).passthrough().nullable(),
    }).passthrough(),
    video: z.object({
        id: z.string(),
        title: z.string(),
        url: z.string().url().or(z.literal("")).nullable(),
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

const isObject = (item: any): item is object => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const deepMerge = (target: any, source: any): any => {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else if (source[key] !== undefined) { 
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
};


const fetchDefaultConfig = async (): Promise<SiteConfig | null> => {
    try {
        const filePath = path.join(process.cwd(), 'public', 'default-site-config.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        const parsedData = SiteConfigSchema.safeParse(data);
        if (parsedData.success) {
            return parsedData.data;
        } else {
            console.error("Failed to parse default config.", parsedData.error.toString());
            return null;
        }
    } catch (error) {
        console.error("Error fetching or parsing default site config.", error);
        return null;
    }
};

export const getSiteConfig = async (pkg?: string): Promise<SiteConfig | null> => {
    const defaultConfig = await fetchDefaultConfig();

    if (!pkg) {
        return defaultConfig;
    }

    try {
        const apiUrl = `https://api.us.apks.cc/game/site-config?pkg=${pkg}`;
        const response = await fetch(apiUrl, { cache: 'no-store' });

        if (response.ok) {
            const data = await response.json();
            const parsedData = SiteConfigSchema.safeParse(data);
            if (parsedData.success) {
                if (defaultConfig) {
                    return deepMerge(defaultConfig, parsedData.data);
                }
                return parsedData.data;
            } else {
                console.error(`Failed to parse dynamic config for pkg: ${pkg}.`, parsedData.error.toString());
                return null;
            }
        } else {
            console.error(`API request failed with status ${response.status} for pkg: ${pkg}. Falling back to default.`);
            return defaultConfig;
        }
    } catch (error) {
        console.error(`Error fetching dynamic config for pkg: ${pkg}. Falling back to default.`, error);
        return defaultConfig;
    }
};

export const getArticleBySlug = async (slug: string, pkg?: string): Promise<Article | null> => {
    const config = await getSiteConfig(pkg);
    if (!config) {
        return null;
    }
    
    for (const section of config.sections) {
        const article = section.items.find((item) => item.slug === slug);
        if (article) {
            return article;
        }
    }
    
    return null;
};
