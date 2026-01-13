import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import locations from "@/data/locations.json";
import LocationHero from "@/components/sections/LocationHero";
import LocationMap from "@/components/sections/LocationMap";
import ProjectHighlights from "@/components/sections/ProjectHighlights";
import CleanEnergySolution from "@/components/sections/CleanEnergySolution";
import FAQ from "@/components/sections/FAQ";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import LocationJsonLd from "@/components/analytics/LocationJsonLd";
import RecentUpdates from "@/components/sections/RecentUpdates";

interface Props {
    params: {
        city: string;
    };
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
        title: `Solar Panel Installation in ${location.name} | Best Solar Company`,
        description: `Get expert solar panel installation in ${location.name}, ${location.state}. Best prices for Tata Power, Adani, and Shakti Solar systems. Subsidy available. Contact Arpit Solar Shop.`,
        keywords: [
            `Solar Panel Installation ${location.name}`,
            `Solar Company in ${location.name}`,
            `Rooftop Solar ${location.name}`,
            `Solar Subsidy ${location.name}`,
            `Tata Power Solar ${location.name}`,
        ],
        openGraph: {
            title: `Solar Panel Installer in ${location.name} | Arpit Solar`,
            description: `Trusted solar solutions in ${location.name}. Residential and commercial systems with installation and subsidy support.`,
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
                                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@arpitsolarshop.com" className="hover:text-primary">info@arpitsolarshop.com</a></p>
                                <p className="text-gray-700"><strong>Service Area:</strong> {location.name}, {location.discom} Region</p>
                            </div>
                        </div>

                        {/* Subsidy Table */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <h3 className="font-bold text-lg mb-3 text-yellow-800">☀️ Subsidy Structure in {location.state}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">Capacity</th>
                                            <th className="px-3 py-2">Central</th>
                                            <th className="px-3 py-2">State</th>
                                            <th className="px-3 py-2 rounded-r-lg">Total Off</th>
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
                            <p className="text-xs text-gray-500 mt-2">* Subsidy valid for residential consumers under {location.discom}.</p>
                        </div>

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
                        <img
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop"
                            alt={`Solar Installation in ${location.name}`}
                            className="w-full h-full object-cover"
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
                                    href={`/solar-installation/${area.slug}`}
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
