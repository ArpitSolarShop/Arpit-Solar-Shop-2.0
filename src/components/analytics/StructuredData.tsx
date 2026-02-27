import { siteConfig } from "@/config/site";

export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": siteConfig.name,
        "image": `${siteConfig.url}${siteConfig.ogImage}`,
        "@id": siteConfig.url,
        "url": siteConfig.url,
        "telephone": siteConfig.contact.phone,
        "email": siteConfig.contact.email,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": siteConfig.contact.address,
            "addressLocality": "Varanasi",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "221003",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.3176,
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
        "priceRange": "₹₹",
        "hasMap": "https://maps.google.com/maps?cid=16186476619204516290",
        "sameAs": [
            siteConfig.links.twitter,
            siteConfig.links.facebook,
            siteConfig.links.instagram
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
