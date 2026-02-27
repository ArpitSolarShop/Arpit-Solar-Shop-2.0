import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us — Arpit Solar Shop | Solar Installation Varanasi",
    description:
        "Contact Arpit Solar Shop, Varanasi's leading solar EPC company. Call 9005770466, WhatsApp 9044555572, or visit our office at Shivpur. Authorized Reliance & Shakti Solar partner. GSTIN: 09APKPM6299L1ZW.",
    alternates: {
        canonical: "https://www.arpitsolar.com/contact",
    },
    openGraph: {
        title: "Contact Arpit Solar Shop — Varanasi",
        description:
            "Get in touch for free solar consultation, site surveys, and quotations. Authorized dealer for Reliance & Shakti Solar in Varanasi, Mau, and Ballia.",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
