"use client";

import { recentProjects } from "@/data/recentProjects";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecentUpdatesProps {
    city: string;
    slug: string;
}

const RecentUpdates = ({ city, slug }: RecentUpdatesProps) => {
    // Filter projects for this city
    const updates = recentProjects.filter((p) => p.locationSlug === slug);

    if (updates.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Latest Solar Updates in <span className="text-[#0a2351]">{city}</span>
                        </h2>
                        <p className="text-gray-600">
                            Recent installations, subsidy news, and solar events in your area.
                        </p>
                    </div>
                    {/* Hidden on mobile, view all button could go here */}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {updates.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge
                                        className={`${item.category === "Installation"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : item.category === "Subsidy"
                                                    ? "bg-amber-500 hover:bg-amber-600"
                                                    : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        {item.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0a2351] transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-primary cursor-pointer hover:underline flex items-center">
                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentUpdates;
