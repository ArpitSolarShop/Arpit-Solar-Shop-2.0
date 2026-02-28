import React from 'react';
import { Badge } from '@/components/ui/badge';
import ClientQuoteTrigger from './ClientQuoteTrigger'; // We'll create this client component next
import ClientProductGrid from './ClientProductGrid';
import { siteConfig } from '@/config/site';

// Enable ISR (Incremental Static Regeneration) for performance
export const revalidate = 3600; // Check DB every hour

// --- Helper Functions for Parsing Slugs ---
export function parseSlug(slug: string) {
    const parsed = {
        capacityKw: null as number | null,
        systemType: null as string | null,
        isPumpOrChakki: false,
        rawQuery: slug.replace(/-/g, ' ')
    };

    // Extract kW if present (e.g. 5kw, 10kw)
    const kwMatch = slug.match(/(\d+(?:\.\d+)?)\s*kw/i);
    if (kwMatch) {
        parsed.capacityKw = parseFloat(kwMatch[1]);
    }

    // Extract Type
    if (slug.includes('on-grid') || slug.includes('grid-tie')) {
        parsed.systemType = 'On-Grid';
    } else if (slug.includes('off-grid')) {
        parsed.systemType = 'Off-Grid';
    } else if (slug.includes('hybrid')) {
        parsed.systemType = 'Hybrid';
    } else if (slug.includes('pump')) {
        parsed.isPumpOrChakki = true;
        parsed.systemType = 'Solar Pump';
    } else if (slug.includes('chakki')) {
        parsed.isPumpOrChakki = true;
        parsed.systemType = 'Solar Chakki';
    }

    return parsed;
}

// Generate SEO Metadata Dynamically based on the slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const slugInfo = parseSlug(slug);
    let title = '';
    let description = '';

    if (slugInfo.capacityKw && slugInfo.systemType) {
        title = `${slugInfo.capacityKw}kW ${slugInfo.systemType} Solar System Price in Varanasi | Best Options`;
        description = `Compare the best ${slugInfo.capacityKw}kW ${slugInfo.systemType} solar systems in Varanasi. See prices, modules, and warranties from top brands like Tata, Reliance, and Shakti.`;
    } else if (slugInfo.isPumpOrChakki) {
        title = `Best ${slugInfo.systemType} Price & Installation in Varanasi`;
        description = `Looking for a reliable ${slugInfo.systemType} in Varanasi? Explore our heavy-duty solar solutions tailored for agricultural and commercial use. Get a free quote today!`;
    } else {
        const readable = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `${readable} Price & Installation in Varanasi`;
        description = `Explore top-rated ${readable} solutions from Arpit Solar Shop. Comparing Tata, Reliance, and Shakti systems.`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: `${siteConfig.url}/solar-system/${slug}`
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${siteConfig.url}/solar-system/${slug}`,
            images: [
                {
                    url: `${siteConfig.url}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ]
        }
    };
}

// --- Main Server Component (Shell) ---
// This handles SEO and the Hero section, and passes the slug to the client component for data fetching
export default async function SolarSystemCategoryPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const slugInfo = parseSlug(slug);

    const titleText = slugInfo.capacityKw ? `${slugInfo.capacityKw}kW ${slugInfo.systemType || ''} Solar Systems` : `${slugInfo.rawQuery} Solutions`;

    // Generate JSON-LD Structured Data for this dynamic page
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Product",
                    "name": `Tata ${titleText}`,
                    "brand": { "@type": "Brand", "name": "Tata Power Solar" }
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Product",
                    "name": `Reliance ${titleText}`,
                    "brand": { "@type": "Brand", "name": "Reliance Solar" }
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Product",
                    "name": `Shakti ${titleText}`,
                    "brand": { "@type": "Brand", "name": "Shakti Solar" }
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Inject JSON-LD for SEO Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Premium Hero Section */}
            <section className="bg-blue-600 text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <Badge className="bg-blue-500 text-white mb-4 hover:bg-blue-400">SEO Optimized Category</Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 capitalize tracking-tight">
                        Compare {titleText} in Varanasi
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 font-light">
                        Explore the best options from authorized dealers of Tata, Reliance, and Shakti. High-efficiency, reliable, and subsidized.
                    </p>
                </div>
            </section>

            {/* Comparison Cards Grid (Client Side Data Fetching to avoid Localhost Node fetch crashes) */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <ClientProductGrid slug={slug} slugInfo={slugInfo} />
            </section>
        </main>
    );
}
