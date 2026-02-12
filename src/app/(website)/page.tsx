import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import Certifications from "@/components/sections/Certifications";
import TVCard from "@/components/sections/TVCard";
import FAQ from "@/components/sections/FAQ";
import CleanEnergySolution from "@/components/sections/CleanEnergySolution";
import TrustedPartnersSection from "@/components/sections/TrustedPartnersSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arpit Solar Shop | Best Solar Company in Varanasi | Official Tata & Reliance Partner",
  description: "Arpit Solar Shop is Varanasi's leading Solar EPC company. Authorized partners for Tata Power Solar, Reliance New Energy, and Shakti Pumps. Get a free quote today!",
  keywords: [
    "Solar Company Varanasi",
    "Tata Power Solar Dealer Varanasi",
    "Reliance Solar Partner",
    "Solar Panel Price Varanasi",
    "Best Solar Installation UP",
    "PM Surya Ghar Yojana Dealer",
    "Solar in Varanasi",
    "Solar System in Varanasi",
    "Number 1 Solar Company in Varanasi",
    "Top Solar Dealer Varanasi",
    "Best Solar Distributor Varanasi",
    "Solar Shop Varanasi",
  ],
  openGraph: {
    title: "Arpit Solar Shop | Rate #1 Solar Company in Varanasi",
    description: "Your trusted partner for Solar Rooftop, Water Pumps, and Commercial Solar Projects.",
    images: ["/logo.png"], // Ensuring a default OG image
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CleanEnergySolution />
      <HowItWorks />
      <TrustedPartnersSection />
      <ProjectHighlights />
      <TVCard />
      <Certifications />
      <FAQ />
    </div>
  );
}
