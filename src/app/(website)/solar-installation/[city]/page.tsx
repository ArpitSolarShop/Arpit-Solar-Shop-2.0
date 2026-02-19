import { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import locations from "@/data/locations.json";
import LocationHero from "@/components/sections/LocationHero";
import LocationMap from "@/components/sections/LocationMap";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import CleanEnergySolution from "@/components/sections/CleanEnergySolution";
import FAQ from "@/components/sections/FAQ";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import LocationJsonLd from "@/components/analytics/LocationJsonLd";
import RecentUpdates from "@/components/sections/RecentUpdates";

interface Props {
    params: Promise<{
        city: string;
    }>;
}

export async function generateStaticParams() {
    return locations.map((location) => ({
        city: location.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    const location = locations.find((l) => l.slug === city);

    if (!location) {
        return {
            title: "Solar Installation | Arpit Solar Shop",
        };
    }

    return {
        title: `Solar Panel Price & Installation in ${location.name} | Save ₹1,08,000 Subsidy`,
        description: `Looking for solar panels in ${location.name}? Arpit Solar Shop offers premium installation with ₹1,08,000 subsidy under PM Surya Ghar Yojana. Get Tata & Reliance solar systems at best price in ${location.name}.`,
        keywords: [
            `Solar Panel Price in ${location.name}`,
            `Solar Panel Installation ${location.name}`,
            `Solar Company in ${location.name}`,
            `Rooftop Solar ${location.name}`,
            `Solar Subsidy ${location.name}`,
            `PM Surya Ghar Yojana Varanasi`,
            `Tata Power Solar ${location.name}`,
            `Best Solar Dealer in ${location.name}`,
            `Solar System Installation ${location.name}`,
            `Cheap Solar Panels ${location.name}`,
            `Top Solar Company in Varanasi`,
            `Solar Shop in ${location.name}`,
            `Commercial Solar Plant in ${location.name}`,
            `Solar Rooftop Subsidy ${location.name}`,
            // New High-Intent Keywords
            `3kW Solar System Price ${location.name}`,
            `5kW Solar System Price ${location.name}`,
            `10kW Solar System Cost ${location.name}`,
            `Solar EMI Options ${location.name}`,
            `Solar Consultation ${location.name}`,
            `Solar EPC Company ${location.name}`,
            `Off-grid Solar System ${location.name}`,
            `Hybrid Solar System ${location.name}`
        ],
        openGraph: {
            title: `#1 Solar Panel Installer in ${location.name} | Arpit Solar Shop`,
            description: `Get ₹1,08,000 Subsidy for Solar in ${location.name}. Trusted by 500+ families. Official Tata & Reliance Partner.`,
        },
        alternates: {
            canonical: `/solar-installation/${location.slug}`,
        },
    };
}

export default async function LocationPage({ params }: Props) {
    const { city } = await params;
    const location = locations.find((l) => l.slug === city);

    if (!location) return null;

    return (
        <div className="bg-white min-h-screen">
            <LocationJsonLd city={location.name} state={location.state} />

            {/* 1. Location Hero */}
            <LocationHero city={location.name} state={location.state} />

            {/* 2. Key Benefits / Why Choose Us in City */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Why Choose Arpit Solar in {location.name}?</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">✅ Subsidy Available</h3>
                                    <p className="text-gray-600">Get up to ₹{location.subsidy} subsidy from {location.discom}.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">✅ Local Service</h3>
                                    <p className="text-gray-600">Fast installation and support in {location.name}.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">✅ Top Brands</h3>
                                    <p className="text-gray-600">Tata Power, Adani, Shakti Solar.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-gray-900">✅ Pincode Covered</h3>
                                    <p className="text-gray-600">Service available in {location.pincode}.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Us Section */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-xl mb-4 text-[#0a2351]">Contact Us</h3>
                            <div className="space-y-2">
                                <p className="text-gray-700"><strong>Phone:</strong> <a href="tel:+919044555572" className="hover:text-primary">+91-9044555572</a></p>
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@arpitsolar.com" className="hover:text-primary">info@arpitsolar.com</a></p>
                                <p className="text-gray-700"><strong>Service Area:</strong> {location.name}, {location.discom} Region</p>
                            </div>
                        </div>

                        {/* ☀️ Solar Panel Price & Subsidy Section */}
                        <div className="mt-12 bg-white border border-solar-orange/20 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                                Solar Panel Price in <span className="text-solar-orange">{location.name}</span> (2025)
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The price of a solar panel system in {location.name} depends on the capacity and brand (Tata, Reliance, or Shakti). Below is the estimated price list including the <strong>PM Surya Ghar Yojana Subsidy</strong>.
                            </p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-3 font-bold text-gray-700">System Size</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Market Price</th>
                                            <th className="px-4 py-3 font-bold text-solar-orange">Total Subsidy</th>
                                            <th className="px-4 py-3 font-bold text-green-700">Effective Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-4 py-4 font-medium">2 kW System</td>
                                            <td className="px-4 py-4 text-gray-600">₹1,45,000</td>
                                            <td className="px-4 py-4 text-solar-orange font-semibold">₹90,000</td>
                                            <td className="px-4 py-4 text-green-700 font-bold text-lg">₹55,000*</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-medium">3 kW System</td>
                                            <td className="px-4 py-4 text-gray-600">₹1,95,000</td>
                                            <td className="px-4 py-4 text-solar-orange font-semibold">₹1,08,000</td>
                                            <td className="px-4 py-4 text-green-700 font-bold text-lg">₹87,000*</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-medium">5 kW System</td>
                                            <td className="px-4 py-4 text-gray-600">₹3,10,000</td>
                                            <td className="px-4 py-4 text-solar-orange font-semibold">₹1,08,000</td>
                                            <td className="px-4 py-4 text-green-700 font-bold text-lg">₹2,02,000*</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-4 font-medium">10 kW System</td>
                                            <td className="px-4 py-4 text-gray-600">₹5,80,000</td>
                                            <td className="px-4 py-4 text-solar-orange font-semibold">₹1,08,000</td>
                                            <td className="px-4 py-4 text-green-700 font-bold text-lg">₹4,72,000*</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                * Prices are indicative and including GST. Effective cost is calculated after deducting Central (₹78k) and State (₹30k) subsidies for residential consumers in {location.state}. Actual price depends on component selection and site conditions.
                            </p>
                        </div>

                        {/* Subsidy Structure Table (Restored) */}
                        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-yellow-800">☀️ Detailed Subsidy Structure in {location.state}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">Capacity</th>
                                            <th className="px-3 py-2">Central Subsidy</th>
                                            <th className="px-3 py-2">State Subsidy</th>
                                            <th className="px-3 py-2 rounded-r-lg">Total Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white border-b">
                                            <td className="px-3 py-2 font-medium">2 kW</td>
                                            <td className="px-3 py-2">₹60,000</td>
                                            <td className="px-3 py-2">₹30,000</td>
                                            <td className="px-3 py-2 font-bold text-green-600">₹90,000</td>
                                        </tr>
                                        <tr className="bg-white border-b">
                                            <td className="px-3 py-2 font-medium">3 kW</td>
                                            <td className="px-3 py-2">₹78,000</td>
                                            <td className="px-3 py-2">₹30,000</td>
                                            <td className="px-3 py-2 font-bold text-green-600">₹1,08,000</td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="px-3 py-2 font-medium">Above 3 kW</td>
                                            <td className="px-3 py-2">₹78,000</td>
                                            <td className="px-3 py-2">₹30,000</td>
                                            <td className="px-3 py-2 font-bold text-green-600">₹1,08,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">* Valid for residential consumers with a valid electricity bill from {location.discom}.</p>
                        </div>

                        {/* Local Context - Landmarks & Key Areas */}
                        {(location as any).landmarks && (
                            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Major Landmarks Near You
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    We provide solar installation services near {(location as any).landmarks}.
                                </p>
                                <h4 className="font-semibold text-gray-900 mb-2">Key Areas Covered:</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {(location as any).key_areas}
                                </p>
                            </div>
                        )}

                        <div className="mt-8">
                            <Button asChild size="lg" className="bg-primary text-secondary hover:bg-primary/90 w-full md:w-auto text-lg py-6">
                                <Link href="/get-quote">
                                    Get a Free Quote <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-6">
                            <p className="text-white font-bold text-xl">Powering {location.city} since 2013</p>
                        </div>
                        <Image
                            src="/city-solar-bg.webp"
                            alt={`Solar Installation in ${location.name}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </section>

            {/* 3. Location Map with Random Pins */}
            <LocationMap city={location.name} />

            {/* 4. Products & Solutions */}
            <CleanEnergySolution />

            {/* 5. Project Highlights (Global for now, but contextually relevant) */}
            <ProjectHighlights />

            {/* 6. Recent Updates (Freshness / Blog) */}
            <RecentUpdates city={location.name} slug={location.slug} />

            {/* 7. FAQ */}
            <div className="bg-slate-50">
                <FAQ />
            </div>

            {/* 7. Service Areas (Hyper-Local SEO coverage) */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Serving All Major Areas in {location.name}</h2>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {locations
                            .filter(l => l.city === location.name && l.slug !== location.slug)
                            .map((area) => (
                                <Link
                                    key={area.slug}
                                    href={`https://www.arpitsolar.com/solar-installation/${area.slug}`}
                                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm text-gray-600 hover:text-primary transition-colors"
                                >
                                    📍 {area.name}
                                </Link>
                            ))}
                    </div>
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="py-20 bg-primary text-secondary text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to go Solar in {location.name}?</h2>
                    <p className="text-xl mb-8 opacity-90">Get a free site survey and quotation today. Start saving on your electricity bills.</p>
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full">
                        <Link href="/get-quote">
                            Get Your Free Solar Quote
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
