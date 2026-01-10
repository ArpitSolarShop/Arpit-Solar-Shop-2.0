import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import locationsData from "@/data/locations.json";
import NotFound from "./NotFound";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Button } from "@/components/ui/button";
import { PhoneCall, MapPin } from "lucide-react";
import { HeroGetQuote } from "@/pages/HeroGetQuote";

/* ===== Home Sections ===== */
import CleanEnergySolution from "@/components/sections/CleanEnergySolution";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustedPartnersSection from "@/components/sections/TrustedPartnersSection";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import TVCard from "@/components/sections/TVCard";
import Certifications from "@/components/sections/Certifications";
import FAQ from "@/components/sections/FAQ";

/* ================= TYPES ================= */
interface LocationData {
  slug: string;
  name: string;
  type: string;
  city: string;
  state: string;
  pincode: string;
  discom: string;
  subsidy: string;
}

/* ================= HELPER FUNCTIONS ================= */
// Format subsidy amount: "108000" -> "₹1,08,000"
const formatSubsidy = (subsidy: string): string => {
  const num = parseInt(subsidy);
  if (isNaN(num)) return `₹${subsidy}`;
  
  // Format with Indian numbering system using toLocaleString
  return `₹${num.toLocaleString('en-IN')}`;
};

/* ================= COMPONENT ================= */
const CityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [highlightForm, setHighlightForm] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* ---------- URL VALIDATION ---------- */
  if (!slug || !slug.startsWith("solar-in-")) {
    return <NotFound />;
  }

  const dbSlug = slug.replace("solar-in-", "");
  const location = (locationsData as LocationData[]).find(
    (loc) => loc.slug === dbSlug
  );

  if (!location) {
    return <NotFound />;
  }

  // Format subsidy for display
  const formattedSubsidy = formatSubsidy(location.subsidy);

  return (
    <div className="min-h-screen">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          Rooftop Solar System Installation in {location.name} | Subsidy & Price 2026
        </title>
        <meta
          name="description"
          content={`Get rooftop solar installation in ${location.name}, ${location.city}, ${location.state} (${location.pincode}). Avail PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}. Rated 4.9★ on Google. Net metering available for ${location.discom}.`}
        />
        <link
          rel="canonical"
          href={`https://arpitsolar.com/solar-in-${location.slug}`}
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://arpitsolar.com/solar-in-${location.slug}`}
        />
        <meta
          property="og:title"
          content={`Rooftop Solar System Installation in ${location.name} | Subsidy & Price 2026`}
        />
        <meta
          property="og:description"
          content={`Get rooftop solar installation in ${location.name}, ${location.city}, ${location.state}. Avail PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}. Rated 4.9★ on Google.`}
        />
        <meta property="og:image" content="https://arpitsolar.com/city-solar-bg.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Solar Installation in ${location.name} | ${formattedSubsidy} Subsidy`}
        />
        <meta
          name="twitter:description"
          content={`Get rooftop solar in ${location.name}, ${location.city}. PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}.`}
        />
        <meta name="twitter:image" content="https://arpitsolar.com/city-solar-bg.png" />

        {/* Structured Data - JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://arpitsolar.com/solar-in-${location.slug}#localbusiness`,
            "name": `Arpit Solar Shop - ${location.name}`,
            "image": "https://arpitsolar.com/logo.png",
            "url": `https://arpitsolar.com/solar-in-${location.slug}`,
            "telephone": "+91-9044555572",
            "priceRange": "₹₹₹",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.name,
              "addressRegion": location.state,
              "postalCode": location.pincode,
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "25.3533208",
              "longitude": "82.950127"
            },
            "areaServed": {
              "@type": "City",
              "name": location.name,
              "addressRegion": location.state
            },
            "serviceType": "Rooftop Solar Installation",
            "description": `Rooftop solar installation services in ${location.name}, ${location.city}, ${location.state}. PM Surya Ghar Yojana subsidy up to ${formattedSubsidy} available.`,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "5000"
            },
            "sameAs": [
              "https://www.facebook.com/arpitsolar",
              "https://www.instagram.com/arpitsolar"
            ]
          })}
        </script>
      </Helmet>

      <main className="pt-8 md:pt-12">
        {/* ================= CITY HERO ================= */}
        <section className="relative min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-6rem)] flex items-start md:items-center overflow-hidden pb-8 md:pb-0">
          {/* Background */}
          <div className="absolute inset-0">
            {!imageError ? (
              <img
                src="/city-solar-bg.png"
                alt={`Solar panel installation in ${location.name}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#005850] to-[#003d36]" />
            )}
            <div className="absolute inset-0 bg-[#005850]/85"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-24 pb-8 md:pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* ================= LEFT CONTENT ================= */}
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white leading-tight">
                  Rooftop Solar System Installation in{" "}
                  <span className="text-[#F2FF83] drop-shadow-lg">{location.name}</span>
                </h1>

                {/* SUBSIDY TABLE */}
                <div className="bg-white rounded-lg shadow-lg mb-3 max-w-xl text-xs md:text-sm text-gray-800 overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-[#AEC90B] text-black">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold">Capacity</th>
                        <th className="px-3 py-2 text-left font-bold">Central Subsidy</th>
                        <th className="px-3 py-2 text-left font-bold">State Subsidy</th>
                        <th className="px-3 py-2 text-left font-bold">Total Subsidy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1 kW", "₹30,000", "₹15,000", "₹45,000"],
                        ["2 kW", "₹60,000", "₹30,000", "₹90,000"],
                        ["3 kW", "₹78,000", "₹30,000", "₹1,08,000"],
                        ["Above 3 kW", "₹78,000", "₹30,000", formattedSubsidy],
                      ].map((row, i) => (
                        <tr key={i} className={`border-t border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`px-3 py-2 ${
                                j === 0 ? "font-semibold text-gray-900" : "text-gray-700"
                              } ${j === 3 ? "font-bold text-[#003d36]" : ""}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SERVICE INFO */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 mb-4 space-y-1 border border-white/20">
                  <p className="text-xs md:text-sm text-gray-100">
                    <b className="text-white">Service Area Pin Code:</b> {location.pincode}
                  </p>
                  <p className="text-xs md:text-sm text-gray-100">
                    <b className="text-white">Electricity Board (DISCOM):</b> {location.discom}
                  </p>
                  <p className="text-xs md:text-sm text-gray-100">
                    <b className="text-white">Maximum Subsidy Available:</b>{" "}
                    <span className="text-[#F2FF83] font-bold">
                      {formattedSubsidy}
                    </span>{" "}
                    (PM Surya Ghar Yojana)
                  </p>
                </div>

                {/* SALES COPY */}
                <p className="text-base md:text-lg mb-4 text-gray-100 leading-relaxed">
                  Residents of <b className="text-white">{location.name}</b> can avail up to{" "}
                  <span className="text-[#F2FF83] font-bold">
                    {formattedSubsidy} subsidy
                  </span>{" "}
                  for rooftop solar installation. Trusted solar installer with{" "}
                  <span className="text-[#AEC90B] font-bold">
                    5000+ successful installations
                  </span>{" "}
                  across nearby areas.
                </p>

                {/* CTA SECTION */}
                <div className="mt-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* FORM CTA */}
                    <Button
                      onClick={() => {
                        const formElement = document.getElementById("quote-form");
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        setHighlightForm(true);
                        setTimeout(() => setHighlightForm(false), 2000);
                      }}
                      className="bg-[#AEC90B] text-black hover:bg-[#F2FF83] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none h-12 md:h-14 px-6 text-base md:text-lg flex items-center justify-center"
                    >
                      Get a Free Solar Quote
                    </Button>

                    {/* CALL CTA – FIXED VISIBILITY */}
                    <a
                      href="tel:+919044555572"
                      className="flex items-center justify-center gap-2 h-12 md:h-14 px-6 border-2 border-[#AEC90B] text-[#005850] bg-white hover:bg-[#F2FF83] hover:border-[#F2FF83] hover:text-black rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none text-base md:text-lg"
                    >
                      <PhoneCall className="w-5 h-5" />
                      Call Now: +91 90445 55572
                    </a>
                  </div>

                  <p className="mt-2 text-xs md:text-sm text-gray-100">
                    Fill the form for a detailed solar quote, or call us for instant assistance.
                  </p>
                </div>

                {/* MAP + GOOGLE */}
                <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href="https://maps.app.goo.gl/MKSMTtbWEqJzsrkb6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-gray-100 hover:text-white"
                  >
                    <MapPin className="w-5 h-5 text-[#F2FF83]" />
                    <span className="font-medium">View on Google Maps</span>
                  </a>

                  <div className="text-sm text-gray-100">
                    <p>
                      Rated <b className="text-white">4.9 ★</b> on
                    </p>
                    <img
                      src="/google.png"
                      alt="Google Reviews"
                      className="w-20 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* ================= FORM ================= */}
              <div
                id="quote-form"
                className={`transition-all duration-300 ${
                  highlightForm
                    ? "ring-4 ring-[#F2FF83] ring-offset-2 ring-offset-[#005850]"
                    : ""
                }`}
              >
                <HeroGetQuote />
              </div>
            </div>
          </div>
        </section>

        {/* ================= EXTRA SECTIONS ================= */}
        <CleanEnergySolution />
        <HowItWorks />
        <TrustedPartnersSection />
        <ProjectHighlights />
        <TVCard />
        <Certifications />
        <FAQ />
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default CityPage;
