import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import Certifications from "@/components/sections/Certifications";
import TVCard from "@/components/sections/TVCard";
import FAQ from "@/components/sections/FAQ";
import CleanEnergySolution from "@/components/sections/CleanEnergySolution";
import TrustedPartnersSection from "@/components/sections/TrustedPartnersSection";

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
