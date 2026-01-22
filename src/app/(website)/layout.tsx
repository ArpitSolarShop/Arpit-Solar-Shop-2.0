
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/MainWrapper";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
        </>
    );
}

