import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Solar Services — Installation, Cleaning & Maintenance | Arpit Solar Shop",
    description:
        "Professional solar panel installation, cleaning, maintenance, repair, and monitoring services in Varanasi. 25-year warranty, certified technicians, 24/7 emergency support. Starting ₹5 per panel.",
    alternates: {
        canonical: "https://www.arpitsolar.com/services",
    },
    openGraph: {
        title: "Solar Services — Arpit Solar Shop Varanasi",
        description:
            "Complete solar services: installation, cleaning, maintenance, system monitoring, and upgrades. 24/7 emergency solar service available.",
    },
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
