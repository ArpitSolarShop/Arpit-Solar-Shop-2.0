"use client";

import React, { useEffect, useMemo } from "react";
import {
  Sun,
  Factory,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Leaf,
  Wrench,
  PhoneCall,
} from "lucide-react";
// import Navbar
// import Footer
import IntegratedPriceData from "@/assets/integrated-products";

export default function Integrated() {


  const brands = useMemo(
    () => [
      {
        key: "waaree",
        name: "Waaree Solar",
        tagline: "Indiaâ€™s largest solar module manufacturer",
        highlights: [
          "TopCon & Mono PERC technologies",
          "Advanced N-Type & P-Type cell architecture",
          "High efficiency modules with lower degradation",
          "ALMM & DCR compliant manufacturing",
          "High-volume, consistent quality output",
          "Pan-India service & support network",
        ],
        gradient: "from-[#000000] to-[#0DB02B]",
        softBg: "bg-[#B6E3D4]/40",
      },
      {
        key: "adani",
        name: "Adani Solar",
        tagline: "Fully integrated solar manufacturing powerhouse",
        highlights: [
          "TopCon & Mono PERC technologies",
          "Vertically integrated manufacturing (cell to module)",
          "Encore & Eternal series â€“ N-Type & P-Type",
          "Higher bifacial gain & superior temperature performance",
          "Utility-scale & rooftop proven reliability",
          "Strong EPC & O&M ecosystem",
        ],
        gradient: "from-[#0B74B0] via-[#75479C] to-[#BD3861]",
        softBg: "bg-white",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HERO â€“ light & airy */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white text-[#0B74B0] text-sm mb-6">
                <Sun className="w-4 h-4" /> Integrated Solar Solutions
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight text-slate-900">
                Waaree & Adani
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0B74B0] via-[#75479C] to-[#BD3861]">
                  Integrated Solar Systems
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-2xl">
                <strong>Integrated Solar</strong> means Waaree and Adani supply only the
                <strong> solar panels</strong>. We engineer the complete system by
                integrating inverters, BOS, protection, and mounting structures from
                trusted partners â€” delivering a <strong>safe, efficient, grid-ready</strong>
                solar power solution using <strong>TopCon</strong> and
                <strong> Mono PERC</strong> technologies.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#solutions"
                  className="px-6 py-3 bg-[#0DB02B] text-white hover:bg-[#0aa026] border border-black rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Explore Solutions
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 transition-all duration-300 hover:bg-slate-100"
                >
                  Talk to an Expert
                </a>
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-white/80 backdrop-blur p-8 rounded-2xl border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="grid grid-cols-2 gap-6">
                <Stat icon={<Factory />} label="EPC Experience" value="Trusted System Integrator" />
                <Stat icon={<ShieldCheck />} label="Panel Warranty" value="25â€“30 Years" />
                <Stat icon={<TrendingUp />} label="Performance Focus" value="High Yield" />
                <Stat icon={<Leaf />} label="Sustainability" value="Clean Energy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARPIT SOLAR â€“ SYSTEM INTEGRATOR */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl border shadow-sm p-10 md:p-14 transition-all duration-500 hover:shadow-xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-[#EAF7F0] text-[#0DB02B] text-sm font-semibold mb-4">
                System Integrator
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Arpit Solar â€“ The Brand That Integrates Everything
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                <strong>Arpit Solar</strong> is the primary brand responsible for designing,
                engineering, and delivering the complete solar power system. While
                <strong> Waaree</strong> and <strong> Adani</strong> manufacture high-quality
                solar panels, Arpit Solar integrates all other critical components â€”
                including inverters, DCDB, ACDB, earthing, lightning protection,
                mounting structures, cabling, and safety systems â€” into one reliable,
                performance-optimized solution.
              </p>
              <p className="mt-4 text-slate-600">
                This integration ensures <strong>single-point responsibility</strong>,
                better system compatibility, higher generation, and long-term service
                assurance for residential, commercial, and industrial customers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <IntegratorPoint title="System Design" desc="Load analysis, shadow study, and optimal technology selection." />
              <IntegratorPoint title="Component Integration" desc="Inverters, BOS, protection & structure from trusted brands." />
              <IntegratorPoint title="Installation & Safety" desc="Grid-compliant installation with strict safety standards." />
              <IntegratorPoint title="Service & Support" desc="Long-term monitoring, warranty coordination & after-sales." />
            </div>
          </div>
        </div>
      </section>

      {/* BRAND SECTIONS */}
      <section id="solutions" className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Integrated Solar Means</h2>
          <p className="text-slate-600 text-lg">
            Waaree and Adani manufacture world-class solar panels. We integrate these
            modules with carefully selected inverters, electrical protection,
            mounting structures, and BOS components to create a fully engineered,
            reliable, and future-ready solar power system.
          </p>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-center mb-14">Dedicated Panel Solutions by Brand</h3>

        <div className="grid lg:grid-cols-2 gap-10">
          {brands.map((b) => (
            <div
              key={b.key}
              className={`rounded-2xl border bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${b.softBg}`}
            >
              <div className={`h-2 rounded-t-2xl bg-gradient-to-r ${b.gradient}`} />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{b.name}</h3>
                <p className="text-slate-600 mb-6">{b.tagline}</p>
                <ul className="space-y-3">
                  {b.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-slate-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price Table from assets */}
      <div id="priceTable" className="max-w-7xl mx-auto px-6 py-8">
        <IntegratedPriceData />
      </div>

      {/* WHY US */}
      <section className="bg-slate-100 border-t border-b">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Why Choose an Integrated Approach?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon={<Zap />} title="Higher Generation" desc="Optimized engineering ensures maximum daily and lifetime energy output." />
            <Feature icon={<ShieldCheck />} title="Safety & Compliance" desc="Designed with correct DC/AC protection, earthing, and grid standards." />
            <Feature icon={<Wrench />} title="Single Responsibility" desc="One accountable system integrator for installation, service, and support." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="bg-gradient-to-r from-[#0056A3] to-[#34A853]">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Ready to Go Solar with Confidence?</h2>
          <p className="text-slate-800 max-w-2xl mx-auto mb-8">Get expert guidance on choosing Waaree or Adani panel technologies and a perfectly integrated system for your roof, load, and budget.</p>
          <a
            href="tel:+919044555572"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <PhoneCall className="w-5 h-5" /> Request a Call Back
          </a>
        </div>
      </section>


    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl p-5 text-center transition-all duration-300 hover:bg-slate-50">
      <div className="mx-auto mb-2 w-8 h-8 text-[#0B74B0]">{icon}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-sm transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
      <div className="mx-auto mb-4 w-10 h-10 text-[#0DB02B]">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  );
}

function IntegratorPoint({ title, desc }) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}










