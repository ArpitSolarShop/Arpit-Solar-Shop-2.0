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


    // Dynamic Product Routes
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data: products } = await supabase
                .from('solar_products')
                .select('slug, updated_at')
                .eq('is_published', true);

            if (products && Array.isArray(products)) {
                productRoutes = products.map((product) => ({
                    url: `${siteConfig.url}/products/${product.slug}`,
                    lastModified: new Date(product.updated_at || new Date()),
                    changeFrequency: "weekly" as const,
                    priority: 0.9,
                }));
            }
        }
    } catch (e) {
        console.error("Failed to fetch products for sitemap", e);
    }

    // Generate location routes from locations.json (canonical URLs only)
    const locationRoutes = locations.map((location) => ({
        url: `${siteConfig.url}/solar-installation/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // Additional static routes not in main nav
    const extraRoutes = [
        "/about/sustainability",
        "/hybrid-solar",
        "/solutions/commercial-industrial",
        "/blog",
        "/get-quote",
        "/shakti-solar",
        "/tata-solar",
        "/reliance",
        "/integrated",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: route === "/get-quote" ? 0.9 : 0.7,
    }));

    // High-Intent Dynamic Solar System Categories (Add-on)
    const categoryRoutes = [
        "/solar-system/3kw-on-grid",
        "/solar-system/5kw-on-grid",
        "/solar-system/10kw-on-grid",
        "/solar-system/3kw-hybrid",
        "/solar-system/5kw-hybrid",
        "/solar-system/10kw-hybrid",
        "/solar-system/5kw-off-grid",
        "/solar-system/solar-pump",
        "/solar-system/solar-for-chakki",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9, // Very high priority for these SEO landing pages
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

    return [...routes, ...productRoutes, ...locationRoutes, ...extraRoutes, ...categoryRoutes, ...blogRoutes];
}
