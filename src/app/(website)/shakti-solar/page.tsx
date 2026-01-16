"use client";

import { useEffect, useState } from "react";
// import Navbar
// import Footer
import Shakti_Price_Data from "@/assets/shakti-solar";
import {
  Wrench,
  Package,
  Rocket,
  BookOpen,
  Headphones,
  TrendingUp,
  Zap,
  Tag,
  Home,
  MapPin,
} from "lucide-react";

// Images
import welcomeImage from "@/assets/shakti-solar-contents/Group-1707478263.png";
import Man1 from "@/assets/shakti-solar-contents/Group-1707478384-7-scaled.png.webp";
import Man2 from "@/assets/shakti-solar-contents/Group-1707478385-1-1.png.webp";
import Man3 from "@/assets/shakti-solar-contents/Group-1707478386-1.png.webp";
import Man4 from "@/assets/shakti-solar-contents/Group-1707478387-1-1-scaled.png.webp";
import Man5 from "@/assets/shakti-solar-contents/Group-1707478388-1.png.webp";
import UniversalQuoteForm from "@/components/forms/UniversalQuoteForm";
import ModuleImg from "@/assets/shakti-solar-contents/Solar PV Modules.png";
import InverterImg from "@/assets/shakti-solar-contents/Sunshakti Inverter.png";
import MountingImg from "@/assets/shakti-solar-contents/Module Mounting Structures.png";
import { Button } from "@/components/ui/button"; // Assuming this is needed for the new ShaktiSolar component

const images = [Man1.src, Man2.src, Man3.src, Man4.src, Man5.src];

// ---------------- Carousel ----------------
const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full">
      {/* Carousel Image */}
      <img
        src={images[current]}
        alt={`Carousel ${current}`}
        className="w-full h-auto object-cover transition-all duration-700"
      />

      {/* Logo at top-left (transparent) */}
      <div className="absolute top-28 left-6">
        <img
          src="/Shakti Solar.png"
          alt="Shakti Solar Logo"
          className="w-28 md:w-36 object-contain"
        />
      </div>
    </div>
  );
};

// ---------------- Welcome Section ----------------
const WelcomeSection = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-[#F4FBE8] py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 md:px-8 gap-10">
          <div className="flex-1 text-center md:text-left space-y-4">
            <p className="uppercase text-sm text-green-700 font-semibold">
              Welcome to SHAKTI SOLAR ROOFTOP Solution
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
              Maximize your energy savings with high-performance solar rooftop
              solutions.
            </h2>
            <p className="text-gray-700 text-lg">
              Designed for reliability, sustainability, and long-term returns —
              backed by India's trusted name in green energy.
            </p>
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Book Your Free Solar Assessment
            </button>
            <p className="text-sm text-gray-600">
              No hidden costs. Just expert advice.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={welcomeImage.src}
              alt="Welcome"
              className="w-full max-w-[400px] object-contain"
            />
          </div>
        </div>
      </section>

      {isQuoteOpen && (
        <UniversalQuoteForm
          open={isQuoteOpen}
          onOpenChange={setIsQuoteOpen}
          category="Shakti"
          config={{
            title: "Book Free Solar Assessment",
            description: "Maximize your energy savings with Shakti Solar."
          }}
        />
      )}
    </>
  );
};

// ---------------- Card ----------------
const SolarSolutionCard = ({ title, image, features, benefits }: { title: string, image: string, features: string[], benefits: string[] }) => (
  <div className="bg-gray-100 rounded-xl p-6 shadow-md flex flex-col h-full transition hover:shadow-lg">
    <div className="w-full h-48 flex items-center justify-center mb-5">
      <img src={image} alt={title} className="max-h-full object-contain" />
    </div>
    <h3 className="text-2xl font-bold text-black mb-4 text-center">{title}</h3>

    <div className="text-left">
      <h4 className="text-xl font-semibold text-blue-700 mb-2">Features</h4>
      <ul className="list-disc list-inside text-black mb-4 space-y-1">
        {features.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h4 className="text-xl font-semibold text-blue-700 mb-2">Benefits</h4>
      <ul className="list-disc list-inside text-black space-y-1">
        {benefits.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

// ---------------- Main ----------------
const ShaktiSolar = () => {
  const faqs = [
    {
      q: "What is a solar rooftop system?",
      a: "A solar rooftop system is a photovoltaic (PV) setup mounted on the rooftop of a building to generate electricity using solar energy.",
    },
    {
      q: "Who can install a solar rooftop system?",
      a: "Residential homeowners, commercial buildings, institutions, and industries can install solar rooftop systems.",
    },
    {
      q: "What are the components of a solar rooftop system?",
      a: `Solar panels (to capture sunlight)
DCDB (DC Distribution Box)
ACDB (AC Distribution Box)
Inverter (DC to AC)
Mounting/racking system
Wiring
Monitoring system
Optional batteries for storage`,
    },
    {
      q: "What are the benefits of installing a solar rooftop system?",
      a: `Reduces electricity bills (Up to 90%)
Environmentally friendly (lowers carbon footprint)
Long-term savings with minimal maintenance
Eligible for government subsidies (e.g., PM Surya Ghar Yojana)`,
    },
    {
      q: "How do I know how much solar capacity my home requires to install?",
      a: "Your solar capacity depends on your average monthly electricity consumption and available rooftop space. A typical household consuming around 300â€“400 units per month may need a 3 kW system.",
    },
    {
      q: "What is the lifespan of a solar rooftop system?",
      a: "A typical solar rooftop system has a lifespan of 25 years or more, with minimal maintenance.",
    },
    {
      q: "What is PM Surya Ghar Yojana?",
      a: "It is a central government scheme launched to promote solar rooftop adoption among residential households by providing financial assistance and free electricity benefits.",
    },
    {
      q: "Who is eligible under the PM Surya Ghar Yojana?",
      a: "Residential consumers with grid-connected electricity and a shadow-free rooftop are eligible.",
    },
    {
      q: "What subsidies are provided under the scheme?",
      a: `Under the PM Surya Ghar Muft Bijli Yojana:
1 kW â†’ â‚¹30,000
2 kW â†’ â‚¹60,000
3 kW or above â†’ â‚¹78,000 (max cap)`,
    },
    {
      q: "How do I apply for the scheme?",
      a: "You need to register on the PM Surya Ghar Yojana Portal, submit documents, and choose an authorized vendor.",
    },
    {
      q: "Can I avail net metering under this scheme?",
      a: "Yes, net metering is applicable and allows you to feed surplus energy into the grid and get credit.",
    },
    {
      q: "How much electricity can I generate and save?",
      a: "A 1 kW system can generate around 4 units per day on average. Monthly savings depend on your usage and system capacity.",
    },
    {
      q: "Is there any post-installation support or warranty?",
      a: "Yes, installations under the scheme include product warranties and after-sales service as per MNRE norms.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-800">


      <main>
        <ImageCarousel />
        <WelcomeSection />

        {/* Solutions Section (Moved Here) */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-3xl font-bold text-black mb-12">
            Our Solar Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
            <SolarSolutionCard
              title="Solar PV Modules"
              image={ModuleImg.src}
              features={[
                "Maximum Savings â€” Save up to 80% on electricity bills",
                "Minimal Maintenance with quick service",
                "Enhanced Safety with PV insulation protection",
                "BIS-certified & ALMM-listed (DCR Cell Based)",
              ]}
              benefits={[
                "Reliable energy production",
                "Government initiative aligned",
                "Fast return on investment (3â€“4 years)",
              ]}
            />
            <SolarSolutionCard
              title="Sunshakti Inverter"
              image={InverterImg.src}
              features={[
                "Dust & Water Proof Design (IP65 Rated)",
                "Advanced Digital Control & LCD Interface",
                "Remote Connectivity via GPRS/Bluetooth",
                "Easy Plug-and-Play Installation",
                "Transformer-Less High-Efficiency Design",
              ]}
              benefits={[
                "Seamless Operation with smart control",
                "Robust Protection: surge, polarity, insulation",
                "Eco-Friendly Grid-Feeding Power",
                "Wireless Convenience for Monitoring",
              ]}
            />
            <SolarSolutionCard
              title="Module Mounting Structures"
              image={MountingImg.src}
              features={[
                "Robust, Zero-Welding Aesthetic Design",
                "Corrosion Resistance with anodized aluminum",
                "High Wind Resistance (up to 150 km/h)",
                "Seasonal Tracking Compatible",
                "Lightweight & Easy Installation",
              ]}
              benefits={[
                "Durability & Longevity with rust-proof properties",
                "Higher Energy Output & Panel Efficiency",
                "Storm-Ready, Sustainable Design",
                "Quick Installation & Minimal Maintenance",
              ]}
            />
          </div>
        </section>

        {/* Price Table (Moved Here) */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Shakti_Price_Data />
          </div>
        </section>

        {/* --- Shakti Energy Solutions Section --- (Original Position) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8">
              Shakti Energy Solutions
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Made in India. Made for India.
            </p>
            <p className="text-md text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12">
              Shakti Energy Solutions Ltd. (SESL) is at the forefront of transforming India's solar rooftop landscape for both homes and businesses. As a wholly owned subsidiary of Shakti Pumps (India) Limited, Shakti Energy Solutions is the only brand in the industry to offer all three critical components â€” Solar Modules, Inverters, and Module Mounting Structures â€” under one roof.
              <br /><br />
              This integrated approach ensures unmatched quality, seamless system compatibility, and long-lasting performance. Our customers benefit from greater reliability, faster delivery timelines, improved efficiency, and overall cost-effectiveness â€” making SESL the trusted partner for sustainable energy solutions.
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-10">
              Why Choose SHAKTI SOLAR ROOFTOP?
            </h3>
            <p className="text-md text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
              Shakti Solar Rooftop, a dedicated solar subsidiary of Shakti Pumps, offers reliable and cost-effective rooftop solar systems tailored for Indian homes and businesses. Backed by decades of engineering expertise, we provide end-to-end solar solutions with high efficiency, trusted service, and seamless access to government subsidies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Wrench className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Hassle-Free Installation</h4>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Package className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Pre-Assembled Kits For Quick Setup</h4>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Rocket className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Faster Deployment, Stronger Support</h4>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Step-by-Step Guidance For Retailers</h4>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <Headphones className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Dedicated After-Sales Service</h4>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Higher Savings, Bigger Profits</h4>
              </div>
            </div>
          </div>
        </section>

        {/* --- PM Surya Ghar Section --- (Original Position) */}
        <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-4">
              <Zap className="w-12 h-12 text-yellow-300" /> PM Surya Ghar{" "}
              <span className="text-yellow-300">à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 flex items-center justify-center gap-2">
              <Tag className="w-8 h-8 text-green-300" /> Claim Your Subsidy
            </p>
            <p className="text-lg mb-12 max-w-3xl mx-auto">
              Under the aegis of **PM Surya Ghar Muft Bijli Yojana**, any residential consumer can avail applicable subsidy on Solar Rooftop Systems.
            </p>

            <h3 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
              <Home className="w-10 h-10 text-red-300" /> BENEFITS: Subsidy for Residential Households
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-green-600 mb-2">â‚¹30,000</p>
                <p className="text-lg font-semibold text-center">per kWp up to 2 kWp</p>
              </div>
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-green-600 mb-2">â‚¹18,000</p>
                <p className="text-lg font-semibold text-center">per kWp for additional capacity up to 3 kWp</p>
              </div>
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-green-600 mb-2">â‚¹78,000</p>
                <p className="text-lg font-semibold text-center">Total subsidy for systems larger than 3 kWp capped at</p>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
              <Zap className="w-10 h-10 text-yellow-300" /> Suitable Rooftop Solar Plant Capacity for Households
            </h3>
            <p className="text-md mb-8 flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-orange-300" /> Check net metering facility for state. As per location, the generation may vary.
            </p>
            <p className="text-md mb-8 font-semibold">
              For special states, an additional 10% Subsidy will be applicable per kW.
            </p>

            <div className="overflow-x-auto rounded-lg shadow-lg mb-12">
              <table className="min-w-full bg-white text-gray-800">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-3 px-4 text-left">Average Monthly Electricity Consumption (units)</th>
                    <th className="py-3 px-4 text-left">Suitable Rooftop Solar Plant Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">0â€“150</td>
                    <td className="py-3 px-4">1â€“2 kWp</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">150â€“300</td>
                    <td className="py-3 px-4">2â€“3 kWp</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">300</td>
                    <td className="py-3 px-4">Above 3 kWp</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </section>


        {/* Testimonials */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-12">
              What SHAKTI SOLAR ROOFTOP Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                "https://www.youtube.com/embed/i3hKf-BRUeg",
                "https://www.youtube.com/embed/mJht4V5fexw",
                "https://www.youtube.com/embed/Qg0NHLtKt0M",
              ].map((src, idx) => (
                <div
                  key={idx}
                  className="w-full max-w-[420px] h-[300px] overflow-hidden rounded-lg shadow-lg mx-auto"
                >
                  <iframe
                    src={src}
                    title={`Testimonial ${idx + 1}`}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-800">
              FAQs
            </h3>
            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden transition hover:shadow-md"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === idx ? null : idx)
                    }
                    className="w-full text-left px-4 py-3 font-medium flex justify-between items-center text-blue-900"
                  >
                    {item.q}
                    <span className="text-xl">
                      {openIndex === idx ? "âˆ’" : "+"}
                    </span>
                  </button>
                  {openIndex === idx && (
                    <p className="mt-2 px-4 pb-4 text-sm text-black whitespace-pre-line">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>


    </div>
  );
};

export default ShaktiSolar;

