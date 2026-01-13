import { MetadataRoute } from "next";
import { siteConfig, navItems } from "@/config/site";
import locations from "@/data/locations.json";

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Generate location routes from locations.json
    const locationRoutes = locations.map((location) => ({
        url: `${siteConfig.url}/solar-installation/${location.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

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

    return [...routes, ...productRoutes, ...locationRoutes, ...extraRoutes];
}
