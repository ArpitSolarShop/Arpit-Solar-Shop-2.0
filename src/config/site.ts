/**
 * Site-wide configuration and metadata
 */

export const siteConfig = {
    name: "Arpit Solar Shop",
    description: "Arpit Solar Shop is Varanasi's leading Solar EPC company. Authorized partners for Tata Power Solar, Reliance New Energy, and Shakti Pumps. Get a free quote!",
    url: "https://www.arpitsolar.com",
    ogImage: "/og-image.jpg",
    links: {
        twitter: "https://x.com/arpitsolar",
        facebook: "https://www.facebook.com/arpitsolarshop",
        instagram: "https://www.instagram.com/arpitsolarshop",
        linkedin: "https://www.linkedin.com/company/arpit-solar-shop",
        youtube: "https://www.youtube.com/@arpitsolarshop",
    },
    contact: {
        email: "info@arpitsolar.com",
        phone: "+91-9005770466",
        address: "Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP)",
    },
    keywords: [
        // Existing & Core Keywords
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
        "Solar in Varanasi",
        "Solar System in Varanasi",
        "Number 1 Solar Company in Varanasi",
        "Top Solar Dealer Varanasi",
        "Best Solar Distributor Varanasi",
        "Solar Shop Varanasi",
        "Solar Panel Shop Varanasi",

        // High-Intent Buyer Keywords
        "Solar Panel Price in Varanasi",
        "3kW Solar System Price Varanasi",
        "5kW Solar System Price Varanasi",
        "10kW Solar System Cost Varanasi",
        "Solar Subsidy in Varanasi",
        "Solar Rooftop Subsidy Uttar Pradesh",
        "Solar Installation Cost Varanasi",
        "Solar System Quotation Varanasi",
        "Solar EMI Varanasi",
        "Solar Consultation Varanasi",

        // Government & Subsidy
        "PM Surya Ghar Yojana Varanasi",
        "Solar Subsidy Uttar Pradesh",
        "Government Solar Scheme Varanasi",
        "Rooftop Solar Subsidy UP",
        "Solar Yojana Varanasi",
        "Free Solar Scheme India",

        // Long-Tail & Questions
        "Which solar system is best for home in Varanasi",
        "How much solar needed for house in Varanasi",
        "Solar panel dealers near me Varanasi",
        "Solar installation services near Varanasi",
        "Affordable solar system Varanasi",
        "Top solar companies in Varanasi list",
        "Solar battery price Varanasi",
        "Solar inverter price Varanasi",

        // General India Keywords
        "Solar Company in India",
        "Solar Panel Price in India",
        "3kW Solar System Price",
        "5kW Solar System Price in India",
        "10kW Solar System Cost",
        "Solar System Subsidy India",
        "PM Surya Ghar Yojana Subsidy",
        "Solar Installation Cost for Home",
        "Solar EMI Options India",
        "Solar Panel Cost per Watt India",

        // Nearby Locations
        "Solar in Ramnagar Varanasi",
        "Solar in Chandauli",
        "Solar in Mirzapur",
        "Solar in Jaunpur",
        "Solar in Ghazipur",
        "Solar in Mughalsarai",
        "Solar in Bhadohi",

        // Services & Technology
        "On-grid Solar System",
        "Off-grid Solar System",
        "Hybrid Solar System",
        "Solar EPC Company",
        "Net Metering",
        "Solar Modules",
        "Solar Inverter",
        "Solar Battery",
        "Solar Plant",
        "Electricity Bill Savings",
        "Sustainable Energy",
        "Energy Independence",
        "Green Energy",
        "Clean Energy"
    ],
    authors: [
        {
            name: "Arpit Solar Shop",
            url: "https://www.arpitsolar.com",
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
