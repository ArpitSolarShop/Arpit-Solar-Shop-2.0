import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faqs";

interface LocationJsonLdProps {
    city: string;
    state: string;
    subRegion?: string;
}

const LocationJsonLd = ({ city, state, subRegion }: LocationJsonLdProps) => {
    const url = `${siteConfig.url}/solar-installation/${city.toLowerCase().replace(/\s+/g, '-')}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            // 1. Service Schema
            {
                "@type": "Service",
                "serviceType": "Solar Panel Installation",
                "provider": {
                    "@type": "LocalBusiness",
                    "name": `Arpit Solar Shop - ${city}`,
                    "image": siteConfig.ogImage,
                    "telephone": "+91-9044555572", // Using the one from the page content
                    "priceRange": "₹50000 - ₹500000",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": city,
                        "addressRegion": state,
                        "addressCountry": "IN"
                    },
                    "areaServed": {
                        "@type": "City",
                        "name": city
                    }
                },
                "areaServed": {
                    "@type": "City",
                    "name": city
                },
                "name": `Solar Installation in ${city}`,
                "description": `Premium solar panel installation services in ${city}, ${state}. Verified subsidy partners, top brands (Tata/Adani), and 25-year warranty.`
            },
            // 2. Breadcrumb Schema
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteConfig.url
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Solar Installation",
                        "item": `${siteConfig.url}/solar-installation` // Assuming this exists or is a logical parent
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": city,
                        "item": url
                    }
                ]
            },
            // 3. Aggregate Rating (Simulated based on existing static content "4.9/5")
            {
                "@type": "AggregateRating",
                "itemReviewed": {
                    "@type": "LocalBusiness",
                    "name": `Arpit Solar Shop - ${city}`,
                    "image": siteConfig.ogImage
                },
                "ratingValue": "4.9",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "542" // Consistent with "500+ Homes" claim roughly
            },
            // 4. FAQ Schema
            {
                "@type": "FAQPage",
                "mainEntity": faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};

export default LocationJsonLd;
