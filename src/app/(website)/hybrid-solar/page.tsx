import { Metadata } from "next";
import HybridSolarClient from "./HybridSolarClient";

export const metadata: Metadata = {
    title: "Hybrid Solar Systems & Inverters | Arpit Solar Shop",
    description: "Best Hybrid Solar Systems in Varanasi. Smart energy solutions that work with and without the grid. Authorized dealer for top brands.",
    keywords: [
        "Hybrid Solar Inverter Price",
        "Hybrid Solar System Varanasi",
        "Battery Backup Solar System",
        "Smart Solar Inverter",
        "Solar Power Storage",
    ],
    openGraph: {
        title: "Hybrid Solar Systems | Smart Energy Storage | Arpit Solar Shop",
        description: "Experience the freedom of energy independence with our advanced Hybrid Solar Systems.",
        images: ["/Hybrid.webp"],
    },
};

export default function HybridSolarPage() {
    return <HybridSolarClient />;
}
