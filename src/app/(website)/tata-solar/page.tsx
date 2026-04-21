import { Metadata } from "next";
import TataSolarClient from "./TataSolarClient";

export const metadata: Metadata = {
    title: "Tata Power Solar Rooftop Solutions | Authorized Dealer Varanasi",
    description: "India's #1 Solar Rooftop Company. Get Tata Power Solar panels and inverters with government subsidy support. Authorized dealer in Varanasi.",
    keywords: [
        "Tata Power Solar Varanasi",
        "Tata Solar Rooftop",
        "Tata Solar Panels Price",
        "Best Solar Company Varanasi",
        "PM Surya Ghar Yojana Tata Solar",
        "Number 1 Tata Solar Dealer Varanasi",
        "Top Tata Solar Distributor",
        "Tata Solar System in Varanasi",
    ],
    openGraph: {
        title: "Tata Power Solar Rooftop Solutions | Arpit Solar Shop",
        description: "Harness the sun with India's most trusted solar brand. Authorized Tata Power Solar dealer in Varanasi.",
        images: ["/Tata Power Solar.webp"],
    },
};

export default function TataSolarPage() {
    return <TataSolarClient />;
}
