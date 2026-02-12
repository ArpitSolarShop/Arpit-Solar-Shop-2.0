import { MetadataRoute } from "next";
import { siteConfig, navItems } from "@/config/site";
import locations from "@/data/locations.json";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes = navItems.map((item) => ({
        url: `${siteConfig.url}${item.href}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: item.href === "/" ? 1 : 0.8,
    }));


    // Manually mapped product routes based on existing folders/seed data
    const productRoutes = [
        "/shakti-solar",
        "/tata-solar",
        "/reliance",
        "/integrated",
        "/hybrid-solar"
    ].map((slug) => ({
        url: `${siteConfig.url}${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // Generate location routes from locations.json (Standard + Competitive slugs)
    const locationRoutes = locations.flatMap((location) => ([
        {
            url: `${siteConfig.url}/solar-installation/${location.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: `${siteConfig.url}/solar-in-${location.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }
    ]));

    // Add other static routes that might not be in nav (hardcoded for now as example)
    // You can also crawl your file system here if needed
    const extraRoutes = [
        "/about/sustainability",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Fetch blog posts for sitemap (Direct DB call with isolated client)
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { data: posts } = await supabase
                .from('blog_posts')
                .select('slug, updated_at, created_at')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (posts && Array.isArray(posts)) {
                blogRoutes = posts.map((post: any) => ({
                    url: `${siteConfig.url}/blog/${post.slug}`,
                    lastModified: new Date(post.updated_at || post.created_at),
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                }));
            }
        }
    } catch (error) {
        console.error("Failed to fetch blog posts for sitemap:", error);
    }

    return [...routes, ...productRoutes, ...locationRoutes, ...extraRoutes, ...blogRoutes];
}
