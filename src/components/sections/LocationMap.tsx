"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

interface LocationMapProps {
    city: string;
}

const LocationMap = ({ city }: LocationMapProps) => {
    const [pins, setPins] = useState<{ top: string; left: string; delay: number; size: string }[]>([]);

    useEffect(() => {
        const sizes = ["3kW System", "5kW System", "8kW System", "10kW System", "15kW System"];
        // Concentrate pins more towards the center (30-70% range for both axes roughly)
        const newPins = Array.from({ length: 8 }).map((_, i) => ({
            top: `${30 + Math.random() * 40}%`,  // 30% to 70%
            left: `${30 + Math.random() * 40}%`, // 30% to 70%
            delay: i * 300,
            size: sizes[Math.floor(Math.random() * sizes.length)]
        }));
        setPins(newPins);
    }, []);

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        We are Active in <span className="text-solar-orange">{city}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our installation team is ready to serve all areas in and around {city}.
                        Contact us for a site visit today.
                    </p>
                </div>

                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-slate-200 rounded-3xl overflow-hidden shadow-lg border border-slate-300 group">
                    <iframe
                        width="100%"
                        height="100%"
                        className="absolute inset-0 border-0 grayscale hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(city + ", India")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        title={`Map of ${city}`}
                    ></iframe>

                    {/* Overlay Pins for Visual Effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        {pins.map((pin, i) => (
                            <div
                                key={i}
                                className="absolute group/pin"
                                style={{
                                    top: pin.top,
                                    left: pin.left,
                                }}
                            >
                                <div className="relative pointer-events-auto cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 animate-ping absolute inset-0" style={{ animationDelay: `${pin.delay}ms` }} />
                                    <MapPin className="relative z-10 w-8 h-8 text-red-600 fill-white drop-shadow-lg transform transition-transform hover:-translate-y-2 hover:scale-110" />

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/pin:opacity-100 transition-opacity duration-300 z-20">
                                        Completed: {pin.size}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
