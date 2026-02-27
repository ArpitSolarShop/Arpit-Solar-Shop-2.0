"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

const routeLabels: Record<string, string> = {
    "": "Home",
    "products": "Products",
    "services": "Services",
    "contact": "Contact",
    "solutions": "Solutions",
    "residential": "Residential Solar",
    "commercial-industrial": "Commercial & Industrial Solar",
    "blog": "Blog",
    "get-quote": "Get Quote",
    "checkout": "Checkout",
    "hybrid-solar": "Hybrid Solar",
    "shakti-solar": "Shakti Solar",
    "tata-solar": "Tata Solar",
    "reliance": "Reliance Solar",
    "about": "About",
    "sustainability": "Sustainability",
    "integrated": "Integrated Solutions",
};

export default function DynamicBreadcrumbs() {
    const pathname = usePathname();

    if (!pathname || pathname === "/") return null;

    const segments = pathname.split("/").filter(Boolean);

    const items = [
        {
            "@type": "ListItem" as const,
            position: 1,
            name: "Home",
            item: siteConfig.url,
        },
        ...segments.map((segment, index) => ({
            "@type": "ListItem" as const,
            position: index + 2,
            name: routeLabels[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            item: `${siteConfig.url}/${segments.slice(0, index + 1).join("/")}`,
        })),
    ];

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
    );
}
