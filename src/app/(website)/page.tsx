import dynamic from 'next/dynamic';
import HeroSection from "@/components/sections/HeroSection";

// Below-the-fold sections: lazy-loaded for faster initial page load
const CleanEnergySolution = dynamic(() => import('@/components/sections/CleanEnergySolution'));
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'));
const TrustedPartnersSection = dynamic(() => import('@/components/sections/TrustedPartnersSection'));
const ProjectHighlights = dynamic(() => import('@/components/sections/ProjectHighlights'));
const TVCard = dynamic(() => import('@/components/sections/TVCard'));
const Certifications = dynamic(() => import('@/components/sections/Certifications'));
const FAQ = dynamic(() => import('@/components/sections/FAQ'));

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
