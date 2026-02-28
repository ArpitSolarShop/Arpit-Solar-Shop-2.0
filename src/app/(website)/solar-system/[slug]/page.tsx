import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap, Shield, FileText } from 'lucide-react';
import UniversalQuoteForm from '@/components/forms/UniversalQuoteForm';
import ClientQuoteTrigger from './ClientQuoteTrigger'; // We'll create this client component next
import { siteConfig } from '@/config/site';

// Enable ISR (Incremental Static Regeneration) for performance
export const revalidate = 3600; // Check DB every hour

// --- Helper Functions for Parsing Slugs ---
function parseSlug(slug: string) {
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
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const slugInfo = parseSlug(params.slug);
    let title = '';
    let description = '';

    if (slugInfo.capacityKw && slugInfo.systemType) {
        title = `${slugInfo.capacityKw}kW ${slugInfo.systemType} Solar System Price in Varanasi | Best Options`;
        description = `Compare the best ${slugInfo.capacityKw}kW ${slugInfo.systemType} solar systems in Varanasi. See prices, modules, and warranties from top brands like Tata, Reliance, and Shakti.`;
    } else if (slugInfo.isPumpOrChakki) {
        title = `Best ${slugInfo.systemType} Price & Installation in Varanasi`;
        description = `Looking for a reliable ${slugInfo.systemType} in Varanasi? Explore our heavy-duty solar solutions tailored for agricultural and commercial use. Get a free quote today!`;
    } else {
        const readable = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = `${readable} Price & Installation in Varanasi`;
        description = `Explore top-rated ${readable} solutions from Arpit Solar Shop. Comparing Tata, Reliance, and Shakti systems.`;
    }

    return {
        title,
        description,
        alternates: {
            canonical: `${siteConfig.url}/solar-system/${params.slug}`
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${siteConfig.url}/solar-system/${params.slug}`,
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

// --- Main Server Component ---
export default async function SolarSystemCategoryPage({
    params
}: {
    params: { slug: string }
}) {
    const slugInfo = parseSlug(params.slug);

    // Fetch all published products from Supabase
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true);

    if (error || !products) {
        console.error("Error fetching products", error);
        return notFound();
    }

    // Filter Logic to find matching configurations across all products
    const matchingConfigs: any[] = [];

    products.forEach((product) => {
        // Broad type filtering matching (or include if it's a generic query)
        const prodTypeStr = (product.product_type || '').toLowerCase();
        let typeMatches = true;

        if (slugInfo.systemType && !slugInfo.isPumpOrChakki) {
            if (slugInfo.systemType === 'On-Grid' && !prodTypeStr.includes('grid-tie') && !prodTypeStr.includes('on-grid') && !prodTypeStr.includes('commercial') && !prodTypeStr.includes('residential')) typeMatches = false;
            if (slugInfo.systemType === 'Off-Grid' && !prodTypeStr.includes('off-grid')) typeMatches = false;
            if (slugInfo.systemType === 'Hybrid' && !prodTypeStr.includes('hybrid')) typeMatches = false;
        }

        if (slugInfo.isPumpOrChakki) {
            if (slugInfo.systemType === 'Solar Pump' && !prodTypeStr.includes('pump')) typeMatches = false;
            if (slugInfo.systemType === 'Solar Chakki' && !prodTypeStr.includes('chakki')) typeMatches = false;
        }

        if (!typeMatches) return; // Skip this product brand entirely if type doesn't match

        // Look inside the JSON array `system_configurations`
        const configs = product.system_configurations;
        if (configs && Array.isArray(configs)) {
            configs.forEach((config: any) => {
                // If the user requested a specific kW, grab configs that are roughly +/- 10% of that size
                let isMatch = false;

                if (slugInfo.capacityKw) {
                    const sysSize = parseFloat(config.systemSize);
                    if (!isNaN(sysSize)) {
                        const margin = slugInfo.capacityKw * 0.15; // 15% allowance (e.g. 5.35kw matches 5kw)
                        if (Math.abs(sysSize - slugInfo.capacityKw) <= margin) {
                            isMatch = true;
                        }
                    }
                } else {
                    // If no specific kW was requested, just list everything matching the type
                    isMatch = true;
                }

                if (isMatch) {
                    matchingConfigs.push({
                        brand: product.brand,
                        parentProduct: product,
                        configDetails: config
                    });
                }
            });
        }
    });

    if (matchingConfigs.length === 0) {
        // Fallback UI if we don't have exact specs in the JSON arrays yet
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
                <div className="text-center max-w-xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {slugInfo.rawQuery.toUpperCase()} Solutions Available
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        We offer customized {slugInfo.rawQuery} solutions configured for your exact needs. Contact us directly to get the best brand options.
                    </p>
                    <ClientQuoteTrigger
                        category="Generic"
                        btnText={`Get Quote for ${slugInfo.rawQuery}`}
                    />
                </div>
            </div>
        );
    }

    // Sort to put the closest kW match first, or just by brand
    matchingConfigs.sort((a, b) => {
        if (slugInfo.capacityKw) {
            const distA = Math.abs((a.configDetails.systemSize || 0) - slugInfo.capacityKw);
            const distB = Math.abs((b.configDetails.systemSize || 0) - slugInfo.capacityKw);
            return distA - distB;
        }
        return 0;
    });

    const formatPrice = (price?: number) => price ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price) : "Contact for Price";
    const titleText = slugInfo.capacityKw ? `${slugInfo.capacityKw}kW ${slugInfo.systemType || ''} Solar Systems` : `${slugInfo.rawQuery} Solutions`;

    // Generate JSON-LD ItemList Schema
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": matchingConfigs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": `${item.configDetails.systemSize}kW ${item.brand} ${slugInfo.systemType || 'System'}`,
                "brand": {
                    "@type": "Brand",
                    "name": item.brand
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "INR",
                    "price": item.configDetails.preGiElevatedPrice || item.configDetails.price || 0,
                    "availability": "https://schema.org/InStock"
                }
            }
        }))
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            {/* Inject Schema */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

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

            {/* Comparison Cards Grid */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matchingConfigs.map((item, idx) => {
                        const conf = item.configDetails;
                        const price = conf.preGiElevatedPrice || conf.price;
                        return (
                            <Card key={idx} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-100 flex flex-col">
                                <div className="bg-gray-50 p-6 flex items-center justify-center border-b h-40">
                                    <h3 className="text-2xl font-bold text-center text-gray-800">
                                        {conf.systemSize} kWp
                                        <br />
                                        <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">{item.brand}</span>
                                    </h3>
                                </div>
                                <CardContent className="p-6 flex-grow flex flex-col">
                                    <ul className="space-y-4 flex-grow mb-8">
                                        <li className="flex items-start">
                                            <Zap className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium">Inverter: <span className="font-normal">{conf.inverterCapacity || conf.systemSize} kW</span></span>
                                        </li>
                                        <li className="flex items-start">
                                            <Shield className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium">Phase: <span className="font-normal">{conf.phase || 'Single/Three'} Phase</span></span>
                                        </li>
                                        {conf.noOfModules && (
                                            <li className="flex items-start">
                                                <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700 font-medium">Modules: <span className="font-normal">{conf.noOfModules} Panels</span></span>
                                            </li>
                                        )}
                                        <li className="flex items-start">
                                            <FileText className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
                                            <span className="text-gray-700 font-medium text-sm">Base Product: {item.parentProduct.name}</span>
                                        </li>
                                    </ul>

                                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-gray-500 mb-1">Estimated System Price</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatPrice(price)}</p>
                                        <p className="text-xs text-gray-500 mt-2">*Prices vary based on precise roof structure and cable length.</p>
                                    </div>

                                    <div className="mt-auto">
                                        <ClientQuoteTrigger
                                            category={item.brand.includes('Tata') ? 'Tata' : item.brand.includes('Reliance') ? 'Reliance' : item.brand.includes('Shakti') ? 'Shakti' : 'Generic'}
                                            btnText={`Get Quote for ${conf.systemSize}kW ${item.brand}`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>
        </main>
    );
}
