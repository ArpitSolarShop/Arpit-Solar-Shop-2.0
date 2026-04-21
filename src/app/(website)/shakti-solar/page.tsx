import { Metadata } from "next";
import ShaktiSolarClient from "./ShaktiSolarClient";

export const metadata: Metadata = {
    title: "Shakti Solar Pumps & Rooftop Solutions | Authorized Dealer Varanasi",
    description: "Authorized dealer of Shakti Solar Pumps and Rooftop Solutions in Varanasi. Get high-efficiency solar panels, inverters, and mounting structures with government subsidy support.",
    keywords: [
        "Shakti Solar Pumps",
        "Shakti Solar Varanasi",
        "Solar Water Pump Price",
        "Rooftop Solar Subsidy Varanasi",
        "Shakti Energy Solutions",
        "PM Surya Ghar Yojana Varanasi",
        "Number 1 Shakti Solar Dealer Varanasi",
        "Top Solar Pump Distributor",
    ],
    openGraph: {
        title: "Shakti Solar Pumps & Rooftop Solutions | Arpit Solar Shop",
        description: "Maximize your energy savings with high-performance Shakti Solar solutions. Authorized dealer in Varanasi.",
        images: ["/Shakti Solar.webp"],
    },
};

export default function ShaktiSolarPage() {
    return <ShaktiSolarClient />;
}
