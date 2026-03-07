"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Shield, Zap, Settings, ArrowRight, CheckCircle2, XCircle, Info, Layers } from 'lucide-react';

// --- DATA ---

const MATERIALS = [
    {
        id: 1,
        name: "Hot-Dip Galvanized Mild Steel (HDG MS)",
        description: "Mild steel fabricated into frames and hot-dip galvanized. The most widely used structural material globally.",
        specs: { zinc: "80\u2013120 micron", thickness: "2\u20136 mm", life: "20\u201330 years" },
        uses: ["Large utility farms", "Commercial rooftops", "Elevated structures", "Car parking canopies"],
        pros: ["Very strong and rigid", "Good corrosion protection", "Cost-effective", "Easy to fabricate"],
        cons: ["Heavy", "Higher transport cost", "Rusts if galvanization is poor"]
    },
    {
        id: 2,
        name: "Aluminium (Extruded)",
        description: "Aluminium profiles are extruded rails and brackets used mainly for lightweight installations.",
        specs: { alloy: "6005-T5 / 6063-T6", finish: "Anodized", life: "25\u201330 years" },
        uses: ["Residential rooftops", "Lightweight roofs", "Small commercial systems"],
        pros: ["No rust", "Lightweight", "Easy installation", "High corrosion resistance"],
        cons: ["Higher cost than steel", "Lower strength for large spans"]
    },
    {
        id: 3,
        name: "Galvanized Iron (GI Steel)",
        description: "Steel coated with zinc to resist corrosion. Similar to HDG steel but typically thinner coating.",
        specs: { zinc: "40\u201380 micron", thickness: "1.6\u20133 mm", life: "15\u201320 years" },
        uses: ["Commercial structures", "Medium-scale installations"],
        pros: ["Stronger than aluminium", "Cheaper than aluminium", "Good corrosion resistance"],
        cons: ["Heavier", "Life depends heavily on coating thickness"]
    },
    {
        id: 4,
        name: "Pre-Galvanized Steel",
        description: "Steel sheets that are galvanized before fabrication.",
        specs: { zinc: "20\u201340 micron", thickness: "1.5\u20133 mm", life: "10\u201315 years" },
        uses: ["Budget projects", "Lightweight rooftop structures"],
        pros: ["Cheap", "Easy manufacturing", "Lightweight vs heavy steel"],
        cons: ["Lower corrosion resistance", "Shorter lifespan"]
    },
    {
        id: 5,
        name: "Stainless Steel",
        description: "High-grade steel containing chromium and nickel that resists rust naturally.",
        specs: { grades: "SS304 / SS316", life: "30+ years" },
        uses: ["Coastal regions", "Chemical plants", "Marine installations"],
        pros: ["Excellent corrosion resistance", "Very long life", "Minimal maintenance"],
        cons: ["Very expensive", "Heavy"]
    },
    {
        id: 6,
        name: "FRP (Fiber Reinforced Plastic)",
        description: "Composite material made from plastic reinforced with glass fibers.",
        specs: { weight: "Very lightweight", life: "20\u201325 years" },
        uses: ["Chemical plants", "Coastal regions", "Corrosive environments"],
        pros: ["100% corrosion resistant", "Lightweight", "Electrical insulation"],
        cons: ["Expensive", "Lower mechanical strength"]
    },
    {
        id: 7,
        name: "Concrete Structures",
        description: "Equipment mounted on precast or poured concrete supports.",
        specs: { material: "Reinforced concrete", life: "30\u201340 years" },
        uses: ["Utility-scale installations", "High wind regions"],
        pros: ["Extremely durable", "High stability", "Long lifespan"],
        cons: ["Very heavy", "Expensive installation"]
    },
    {
        id: 8,
        name: "Wood Structures",
        description: "Simple timber structures sometimes used for small off-grid systems.",
        specs: { material: "Treated timber", life: "5\u201310 years" },
        uses: ["Small rural installations", "Temporary systems"],
        pros: ["Very cheap", "Easy to build"],
        cons: ["Low durability", "Susceptible to weather/termites"]
    },
    {
        id: 9,
        name: "Polymer / Composite",
        description: "Modern high-strength polymer composites used in experimental installations.",
        specs: { material: "Fiber-reinforced composites", life: "20\u201330 years" },
        uses: ["Experimental installations", "Extreme environments"],
        pros: ["Lightweight", "Corrosion resistant"],
        cons: ["Expensive", "Limited availability"]
    },
    {
        id: 10,
        name: "Hybrid Structures",
        description: "Combination of materials (e.g., steel base, aluminium rails, SS bolts).",
        specs: { steel: "3\u20135 mm", rails: "Extruded Aluminium" },
        uses: ["Most modern rooftop installations", "Commercial systems"],
        pros: ["Best balance of strength & corrosion resistance", "Optimized cost"],
        cons: ["Slightly complex design"]
    }
];

const MARKET_SHARE = [
    { material: "HDG Mild Steel", share: 70, stars: 5, label: "Most used" },
    { material: "Aluminium", share: 20, stars: 4, label: "Common" },
    { material: "Pre-Galvanized", share: 5, stars: 3, label: "Budget" },
    { material: "GI Steel", share: 3, stars: 2, label: "Mid-budget" },
    { material: "Others (SS, FRP, etc.)", share: 2, stars: 1, label: "Specialized" }
];

const STRUCTURE_TYPES = [
    { title: "Rooftop", desc: "Installed on building roofs (Houses, Offices).", tilt: "5\u00b0 \u2013 25\u00b0", pros: ["Uses existing space", "Lower cost"], cons: ["Limited capacity", "Roof strength limits"] },
    { title: "Ground Mount", desc: "Fixed directly in the ground (Utility farms).", tilt: "15\u00b0 \u2013 30\u00b0", pros: ["Large capacity", "Easy maintenance"], cons: ["Requires land", "Higher install cost"] },
    { title: "Elevated", desc: "High steel structures (Parking, Terraces).", tilt: "Custom", pros: ["Dual use space", "Good airflow"], cons: ["Expensive", "Heavy structure"] },
    { title: "Tracker", desc: "Dynamic movement to maximize efficiency.", tilt: "Dynamic", pros: ["15\u201335% more efficiency"], cons: ["Expensive", "Mechanical maintenance"] },
    { title: "Pole Mount", desc: "Mounted on single/multiple poles.", tilt: "Adjustable", pros: ["Small footprint"], cons: ["Limited system size"] }
];

// --- COMPONENTS ---

// Scroll Reveal Wrapper for smooth transitions
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
        >
            {children}
        </div>
    );
};

// Animated Structural SVG to replace the Sun
const AnimatedStructure = () => (
    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-600/5 rounded-full blur-3xl animate-pulse" />
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_40s_linear_infinite]">
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="35" y="35" width="30" height="30" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#2563eb" />

            <line x1="25" y1="25" x2="35" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="75" y1="25" x2="65" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="25" y1="75" x2="35" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="75" y1="75" x2="65" y2="65" stroke="#94a3b8" strokeWidth="1.5" />

            <circle cx="25" cy="25" r="2" fill="#3b82f6" />
            <circle cx="75" cy="25" r="2" fill="#3b82f6" />
            <circle cx="25" cy="75" r="2" fill="#3b82f6" />
            <circle cx="75" cy="75" r="2" fill="#3b82f6" />
        </svg>
    </div>
);

// Main Application Component
export default function MountingStructuresGuide() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-500/20 overflow-x-hidden w-full">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#f5f5f7] to-[#f5f5f7] -z-10" />

                <Reveal>
                    <AnimatedStructure />
                </Reveal>

                <div className="z-10 text-center max-w-4xl mt-8">
                    <Reveal delay={200}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
                            Mounting Structures
                        </h1>
                    </Reveal>
                    <Reveal delay={400}>
                        <p className="text-xl md:text-2xl text-slate-500 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                            A comprehensive guide to the mechanical framework, materials, and architecture of modern mounting systems.
                        </p>
                    </Reveal>
                    <Reveal delay={600}>
                        <button
                            onClick={() => document.getElementById('foundations')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                        >
                            <span>Explore Frameworks</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Reveal>
                </div>
            </section>

            {/* --- WHAT IS IT SECTION --- */}
            <section id="foundations" className="py-32 px-6 max-w-7xl mx-auto">
                <Reveal>
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">The Foundations</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            A mounting structure is the mechanical framework that holds equipment secure against wind, rain, and time, ensuring perfect alignment.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Shield, title: "Hold Securely", desc: "Keeps equipment safe from extreme weather and physical stress." },
                        { icon: Layers, title: "Maintain Tilt", desc: "Angles equipment perfectly for maximum operational efficiency." },
                        { icon: Wind, title: "Withstand Wind", desc: "Engineered for harsh environments and 150-180 km/h wind loads." },
                        { icon: Settings, title: "Durability", desc: "Built to last 25+ years requiring minimal ongoing maintenance." }
                    ].map((item, i) => (
                        <Reveal key={i} delay={i * 100}>
                            <div className="p-8 rounded-3xl bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500/30 transition-all duration-300 group">
                                <item.icon className="w-10 h-10 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500" />
                                <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* --- MATERIALS SECTION --- */}
            <section className="py-32 px-6 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-slate-900">The Materials.</h2>
                        <p className="text-xl text-slate-500 mb-16 max-w-2xl">
                            From heavy-duty steel to experimental polymers. A complete, practical index.
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MATERIALS.map((mat, i) => (
                            <Reveal key={mat.id} delay={i * 50}>
                                <div className="group relative p-8 rounded-3xl bg-[#fbfbfd] border border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 h-full flex flex-col overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-bold leading-tight pr-4 text-slate-900">{mat.name}</h3>
                                        <span className="text-blue-600 font-mono text-sm bg-blue-50 px-3 py-1 rounded-full">
                                            #{mat.id}
                                        </span>
                                    </div>

                                    <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{mat.description}</p>

                                    <div className="space-y-4 text-sm">
                                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4 text-blue-600" /> Specs
                                            </h4>
                                            <ul className="space-y-1 text-slate-600">
                                                {Object.entries(mat.specs).map(([k, v]) => (
                                                    <li key={k}><span className="capitalize font-medium text-slate-700">{k}:</span> {v}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                                                    <CheckCircle2 className="w-4 h-4" /> Pros
                                                </h4>
                                                <ul className="text-slate-500 space-y-1">
                                                    {mat.pros.map((p, idx) => <li key={idx} className="line-clamp-2" title={p}>• {p}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-rose-500 mb-2 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4" /> Cons
                                                </h4>
                                                <ul className="text-slate-500 space-y-1">
                                                    {mat.cons.map((c, idx) => <li key={idx} className="line-clamp-2" title={c}>• {c}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- MARKET SHARE SECTION --- */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <Reveal>
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Real Market Reality.</h2>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                                Material alone doesn't dictate design. However, the industry heavily favors a few tested solutions. Most modern structures are actually <strong className="text-blue-600">Hybrid</strong> (MS frame + Aluminium rails).
                            </p>
                            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 text-slate-700">
                                <span className="block font-bold text-blue-700 mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5" /> Industry Truth
                                </span>
                                Knowing the hybrid combination provides the best strength & corrosion resistance, optimizing both cost and longevity.
                            </div>
                        </div>

                        <div className="lg:w-2/3 w-full space-y-6">
                            {MARKET_SHARE.map((item, i) => (
                                <Reveal key={i} delay={i * 100}>
                                    <div className="relative">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <span className="text-lg font-bold text-slate-900">{item.material}</span>
                                                <span className="ml-3 text-sm text-slate-500">{item.label}</span>
                                            </div>
                                            <span className="text-2xl font-light text-blue-600">{item.share}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1500 ease-out"
                                                style={{ width: `${item.share}%` }}
                                            />
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* --- STRUCTURE TYPES TABS --- */}
            <section className="py-32 px-6 bg-[#fbfbfd] border-t border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Architecture by Location.</h2>
                            <p className="text-slate-500 text-lg">Select a structure type to see its profile.</p>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            {STRUCTURE_TYPES.map((type, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === i
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {type.title}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 overflow-hidden relative min-h-[300px] flex flex-col justify-center">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 transition-all duration-500" key={activeTab}>
                                <h3 className="text-3xl font-bold mb-4 text-slate-900">{STRUCTURE_TYPES[activeTab].title}</h3>
                                <p className="text-xl text-slate-600 mb-8">{STRUCTURE_TYPES[activeTab].desc}</p>

                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="bg-[#f5f5f7] p-6 rounded-2xl border border-slate-100">
                                        <span className="block text-slate-500 text-sm mb-1 font-medium">Typical Tilt</span>
                                        <span className="text-2xl font-light text-slate-900">{STRUCTURE_TYPES[activeTab].tilt}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-600 font-medium mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Advantages</h4>
                                        <ul className="space-y-2 text-slate-600">
                                            {STRUCTURE_TYPES[activeTab].pros.map((p, i) => <li key={i}>• {p}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-rose-500 font-medium mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> Limitations</h4>
                                        <ul className="space-y-2 text-slate-600">
                                            {STRUCTURE_TYPES[activeTab].cons.map((c, i) => <li key={i}>• {c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 text-center text-slate-500 border-t border-slate-200 bg-white">
                <Reveal>
                    <p>© 2026 Structural Guide. Engineering a sustainable future.</p>
                </Reveal>
            </footer>
        </div>
    );
}
