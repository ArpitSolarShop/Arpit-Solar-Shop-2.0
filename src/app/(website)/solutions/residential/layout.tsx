import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Residential Solar Solutions — Home Solar Panels & Prices | Arpit Solar Shop",
    description:
        "Compare residential solar panel prices from Shakti, Tata Power Solar, and Reliance. 1kW to 10kW home solar systems in Varanasi with PM Surya Ghar Yojana subsidy. Free site survey.",
    alternates: {
        canonical: "https://www.arpitsolar.com/solutions/residential",
    },
    openGraph: {
        title: "Residential Solar Solutions — Arpit Solar Shop",
        description:
            "Power your home with clean energy. Compare prices from top brands, get free estimates, and enjoy 25-year warranty on residential solar systems.",
    },
};

export default function ResidentialLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
