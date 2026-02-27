import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Commercial & Industrial Solar Solutions — Large-Scale Solar | Arpit Solar Shop",
    description:
        "Scalable commercial solar solutions from 25kW to 1MW+. Reduce business electricity costs with Reliance Solar systems. Tin shed, RCC, and MMS mounting options. Free commercial energy audit.",
    alternates: {
        canonical: "https://www.arpitsolar.com/solutions/commercial-industrial",
    },
    openGraph: {
        title: "Commercial & Industrial Solar — Arpit Solar Shop",
        description:
            "Power your business with solar energy. Get detailed proposals with mounting type options, tax benefits, and comprehensive O&M support.",
    },
};

export default function CommercialLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
