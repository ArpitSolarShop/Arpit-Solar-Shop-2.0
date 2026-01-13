import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sun,
    CircuitBoard,
    Factory,
    BarChart3,
    Shield,
    ClipboardCheck,
    Wind,
    Droplets,
    Cable,
    Cpu,
    Plug,
    Timer,
    TrendingUp,
    Thermometer,
    Battery,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Solar Sustainability & Technology | Arpit Solar",
    description: "Deep dive into solar panel technology, PV conversion, cell types, and sustainability. Learn how we harness clean power from the sun.",
};

export default function Sustainability() {
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero */}
            <section className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sun className="h-8 w-8 text-yellow-500" />
                        <span className="uppercase tracking-wider text-sm font-semibold text-yellow-600">Solar Technology & Sustainability</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                        Clean Power from the Sun: A Deep Dive into Solar Panel Technology
                    </h1>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto mt-6 rounded" />
                    <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                        How photovoltaic (PV) modules turn sunlight into reliable electricity, and what matters when you select
                        panels, inverters, and mounting for long‑term performance.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                            <Link href="/get-quote">Design My Solar System</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-yellow-500 text-black hover:bg-yellow-50">
                            <Link href="/contact">Talk to an Engineer</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <main className="pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Section: PV Basics */}
                    <section className="mb-14">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                        <Sun className="h-6 w-6 text-yellow-500" /> PV Conversion 101
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-3">
                                    <p>
                                        Solar cells (photovoltaics) use a semiconductor junction to separate charge when photons are
                                        absorbed. This generates direct current (DC) electricity. An inverter converts DC to AC for your
                                        appliances and the grid.
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Photons → electron–hole pairs → DC power</li>
                                        <li>Inverter handles MPPT (maximum power point tracking)</li>
                                        <li>Net‑metering exports excess energy to the grid</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                        <CircuitBoard className="h-6 w-6 text-yellow-500" /> Cell Technologies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-3">
                                    <ul className="space-y-2">
                                        <li>
                                            <span className="font-semibold">Mono PERC:</span> Proven mainstream. Rear passivation boosts
                                            efficiency with good cost balance.
                                        </li>
                                        <li>
                                            <span className="font-semibold">TOPCon:</span> Tunnel oxide/passivated contact. Higher
                                            efficiency, better low‑light, improving availability.
                                        </li>
                                        <li>
                                            <span className="font-semibold">HJT (Heterojunction):</span> Excellent temperature behavior,
                                            high bifaciality potential, premium performance.
                                        </li>
                                        <li>
                                            <span className="font-semibold">Thin‑Film (CdTe, a‑Si):</span> Niche use, diffuse‑light
                                            advantages and higher area usage in utility contexts.
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                                        <Factory className="h-6 w-6 text-yellow-500" /> Module Construction (BoM)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <ul className="space-y-1">
                                        <li><span className="font-semibold">Glass:</span> Tempered, AR‑coated for durability & light capture.</li>
                                        <li><span className="font-semibold">Encapsulant:</span> EVA/POE protects cells from moisture/UV.</li>
                                        <li><span className="font-semibold">Backsheet/Glass:</span> Electrical insulation or glass‑glass design.</li>
                                        <li><span className="font-semibold">Frame:</span> Anodized aluminum for rigidity and mounting.</li>
                                        <li><span className="font-semibold">Junction Box:</span> Bypass diodes mitigate hot‑spot risk.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section: Electrical Characteristics */}
                    <section className="mb-14">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold">Electrical Characteristics & Performance</h2>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-3 rounded" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Plug className="h-5 w-5 text-yellow-500" /> Voc, Isc & MPP
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        The IV curve defines module behavior: open‑circuit voltage (Voc), short‑circuit current (Isc), and
                                        the maximum power point (Vmpp/Impp). Inverters track MPP in real time to maximize yield.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Thermometer className="h-5 w-5 text-yellow-500" /> Temperature Coefficients
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Power decreases as temperature rises. HJT and TOPCon typically have better temperature coefficients
                                        than older PERC designs, improving hot‑climate output.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <BarChart3 className="h-5 w-5 text-yellow-500" /> Efficiency & Bifaciality
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Module efficiency is the ratio of power to area. Bifacial modules capture albedo from the rear,
                                        increasing energy yield with suitable mounting and surface reflectance.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Cpu className="h-5 w-5 text-yellow-500" /> Inverters & MPPT
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        String inverters suit rooftops; central inverters for utility. Micro‑inverters/optimizers offer
                                        module‑level MPPT and monitoring for complex shading scenarios.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Wind className="h-5 w-5 text-yellow-500" /> Mounting & Aerodynamics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        RCC elevated, tin‑shed short‑rail, and MMS ground solutions must be engineered for wind, seismic,
                                        and load codes. Tilt and row spacing impact generation and maintenance.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Droplets className="h-5 w-5 text-yellow-500" /> Losses & Yield (PR)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Soiling, shading, mismatch, wiring, and inverter losses affect Performance Ratio (PR). Periodic
                                        cleaning, selective pruning, and string design improve yield.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section: Reliability, Standards, O&M */}
                    <section className="mb-14">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold">Reliability, Standards & O&M</h2>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-3 rounded" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Shield className="h-5 w-5 text-yellow-500" /> Certifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>IEC 61215 (Design & Type) / IEC 61730 (Safety)</li>
                                        <li>IEC 62804 (PID) / IEC 62716 (Ammonia) / Salt‑Mist</li>
                                        <li>Fire Ratings, Mechanical Load, Hail Impact</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <ClipboardCheck className="h-5 w-5 text-yellow-500" /> Warranties & Degradation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Typical product warranty: 10–15 years. Performance warranty: ≤2–3% first‑year drop, then ~0.25–0.55%
                                        per year; 25–30‑year 80–90% power guarantee depending on technology.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Timer className="h-5 w-5 text-yellow-500" /> O&M Best Practices
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Quarterly cleaning schedule; more frequent in dusty zones</li>
                                        <li>Thermal scans & IV‑curve checks for hotspot/strings</li>
                                        <li>Firmware updates, surge protection, torque checks</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section: Storage, Policy & ROI */}
                    <section className="mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold">Storage, Policy & ROI</h2>
                            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-3 rounded" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Battery className="h-5 w-5 text-yellow-500" /> Battery Options
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Lithium‑ion (LFP/NMC) dominates for residential/commercial due to cycle life and round‑trip
                                        efficiency. Proper sizing ensures backup autonomy and peak‑shaving.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <Cable className="h-5 w-5 text-yellow-500" /> Net‑Metering & Policy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        State regulations define export tariffs, caps, and banking. Compliance and correct metering ensure
                                        you realize modeled savings.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-black/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                        <TrendingUp className="h-5 w-5 text-yellow-500" /> LCOE & Payback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 space-y-2">
                                    <p>
                                        Levelized Cost of Energy (LCOE) accounts for CapEx, O&M, degradation, and energy yield. Typical
                                        rooftop payback is ~3–5 years; commercial PPAs can be faster depending on tariffs.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="rounded-2xl border border-black/10 p-6 md:p-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold">Ready to engineer your solar system?</h3>
                        <p className="mt-3 text-gray-700 max-w-2xl mx-auto">
                            Our engineer‑led team designs for maximum yield and reliability with premium modules and certified
                            balance‑of‑system components.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                                <Link href="/get-quote">Get a Free Design</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-yellow-500 text-black hover:bg-yellow-50">
                                <Link href="/solutions/residential">Explore Solutions</Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
