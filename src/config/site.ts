/**
 * Site-wide configuration and metadata
 */

export const siteConfig = {
    name: "Arpit Solar Shop",
    description: "Premium solar solutions for residential and commercial properties in Varanasi. Top-rated rooftop solar installer offering expert installation and maintenance.",
    url: "https://arpitsolarshop.com",
    ogImage: "/og-image.jpg",
    links: {
        twitter: "https://twitter.com/arpitsolarshop",
        facebook: "https://facebook.com/arpitsolarshop",
        instagram: "https://instagram.com/arpitsolarshop",
    },
    contact: {
        email: "info@arpitsolarshop.com",
        phone: "+91-XXXXXXXXXX",
        address: "Varanasi, Uttar Pradesh, India",
    },
    keywords: [
        "Solar Panel Installation Varanasi",
        "Best Solar Company in Varanasi",
        "Rooftop Solar Varanasi",
        "Commercial Solar Solutions Varanasi",
        "Residential Solar Panel Price Varanasi",
        "Solar Subsidy Varanasi",
        "Tata Power Solar Varanasi",
        "Adani Solar Varanasi",
        "Arpit Solar Shop",
        "Renewable Energy Varanasi",
    ],
    authors: [
        {
            name: "Arpit Solar Shop",
            url: "https://arpitsolarshop.com",
        },
    ],
    creator: "Arpit Solar Shop",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
} as const;

export const navItems = [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions/residential" },
    { label: "Products", href: "/products" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about/us" },
    { label: "Contact", href: "/contact" },
] as const;

export const brands = [
    { name: "Shakti Solar", slug: "shakti-solar", logo: "/Shakti Solar.png" },
    { name: "Tata Power Solar", slug: "tata-solar", logo: "/Tata Power Solar.png" },
    { name: "Reliance", slug: "reliance", logo: "/reliance-industries-ltd.png" },
    { name: "Integrated", slug: "integrated", logo: "/integrated-logo.png" },
] as const;
