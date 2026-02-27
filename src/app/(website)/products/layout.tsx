import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Solar Products — Panels, Inverters & Systems | Arpit Solar Shop",
    description:
        "Browse premium solar products from Tata Power Solar, Reliance, and Shakti. On-grid, off-grid, and hybrid solar systems. Best prices in Varanasi with government subsidy support.",
    alternates: {
        canonical: "https://www.arpitsolar.com/products",
    },
    openGraph: {
        title: "Solar Products — Arpit Solar Shop Varanasi",
        description:
            "Explore our complete range of solar panels, inverters, batteries, and complete solar systems from top brands at the best price.",
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
