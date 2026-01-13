"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, PhoneCall, Star } from "lucide-react";
import { QuickSiteVisitForm } from "@/components/forms/QuickSiteVisitForm";

interface LocationHeroProps {
    city: string;
    state: string;
}

const LocationHero = ({ city, state }: LocationHeroProps) => {
    return (
        <section className="relative z-0 min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Video/Image and Overlay */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover scale-105"
                >
                    <source src="/Solar_Video_Ready_Arpit_Solar.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-400 font-semibold mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>Serving {city}, {state}</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
                    The Best Solar Company in{" "}
                    <span className="bg-gradient-to-r from-solar-orange to-solar-gold bg-clip-text text-transparent">
                        {city}
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Get premium solar panel installation in {city} with verified subsidy support.
                    <br className="hidden md:block" />
                    Top-rated service, expert installation, and 25-year warranty.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                    <QuickSiteVisitForm city={city}>
                        <Button size="lg" className="bg-[#0a2351] hover:bg-[#0a2351]/90 text-white font-bold text-lg px-8 shadow-lg transition-transform hover:-translate-y-1">
                            Get Free Site Visit in {city} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </QuickSiteVisitForm>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 font-bold text-lg px-8 py-6 rounded-xl"
                    >
                        <a href="tel:+919044555572">
                            <PhoneCall className="mr-2 w-5 h-5" />
                            Call Solar Expert
                        </a>
                    </Button>
                </div>

                {/* Local Trust Indicators */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/10 pt-8">
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">500+</div>
                        <div className="text-sm text-gray-400">Homes in {city}</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">10+</div>
                        <div className="text-sm text-gray-400">Years of Trust</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">24h</div>
                        <div className="text-sm text-gray-400">Local Support</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                        <div className="text-sm text-gray-400">Customer Rating</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationHero;
