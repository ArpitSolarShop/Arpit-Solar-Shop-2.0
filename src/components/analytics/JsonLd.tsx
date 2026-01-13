import { siteConfig } from "@/config/site";

export default function JsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": siteConfig.name,
        "image": `${siteConfig.url}${siteConfig.ogImage}`,
        "@id": siteConfig.url,
        "url": siteConfig.url,
        "telephone": siteConfig.contact.phone,
        "email": siteConfig.contact.email,
        "priceRange": "₹₹",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sigra", // Placeholder, ideally should be in siteConfig
            "addressLocality": "Varanasi",
            "addressRegion": "UP",
            "postalCode": "221010",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.3176, // Approximate Varanasi coordinates
            "longitude": 82.9739
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "09:00",
            "closes": "20:00"
        },
        "sameAs": [
            siteConfig.links.facebook,
            siteConfig.links.twitter,
            siteConfig.links.instagram
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
