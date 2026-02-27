import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout — Arpit Solar Shop",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
