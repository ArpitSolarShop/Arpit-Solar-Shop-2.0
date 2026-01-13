import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/MainWrapper";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
        </>
    );
}
