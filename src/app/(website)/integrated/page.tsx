import { Metadata } from "next";
import IntegratedSolarClient from "./IntegratedSolarClient";

export const metadata: Metadata = {
    title: "Integrated Solar Solutions | Power & Backup | Arpit Solar Shop",
    description: "Complete Integrated Solar Solutions in Varanasi. Combine solar power with battery backup for uninterrupted 24/7 energy supply.",
    keywords: [
        "Integrated Solar System",
        "Solar Battery Backup Varanasi",
        "Hybrid Solar Inverter",
        "Off-Grid Solar Solutions",
        "Power Backup Varanasi",
    ],
    openGraph: {
        title: "Integrated Solar Solutions | Power & Backup | Arpit Solar Shop",
        description: "Reliable solar power with battery backup. Keep your home running 24/7 with our integrated solutions.",
        images: ["/integrated-logo.png"],
    },
};

export default function IntegratedSolarPage() {
    return <IntegratedSolarClient />;
}
