/* eslint-disable react-refresh/only-export-components */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import locationsData from "@/data/locations.json";
import CityPageClient, { LocationData } from "./CityPageClient";

interface Props {
  params: Promise<{ city: string }>;
}

/* ================= HELPER FUNCTIONS ================= */
// Format subsidy amount: "108000" -> "₹1,08,000"
const formatSubsidy = (subsidy: string): string => {
  const num = parseInt(subsidy);
  if (isNaN(num)) return `₹${subsidy}`;
  return `₹${num.toLocaleString('en-IN')}`;
};

async function getLocation(slug: string): Promise<LocationData | undefined> {
  const dbSlug = slug.replace("solar-in-", "");
  return (locationsData as LocationData[]).find(
    (loc) => loc.slug === dbSlug
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.city;

  if (!slug || !slug.startsWith("solar-in-")) {
    return {};
  }

  const location = await getLocation(slug);

  if (!location) {
    return {};
  }

  const formattedSubsidy = formatSubsidy(location.subsidy);

  return {
    title: `Rooftop Solar System Installation in ${location.name} | Subsidy & Price 2026`,
    description: `Get rooftop solar installation in ${location.name}, ${location.city}, ${location.state} (${location.pincode}). Avail PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}. Rated 4.9★ on Google. Net metering available for ${location.discom}.`,
    alternates: {
      canonical: `https://arpitsolar.com/solar-in-${location.slug}`,
    },
    openGraph: {
      type: "website",
      url: `https://arpitsolar.com/solar-in-${location.slug}`,
      title: `Rooftop Solar System Installation in ${location.name} | Subsidy & Price 2026`,
      description: `Get rooftop solar installation in ${location.name}, ${location.city}, ${location.state}. Avail PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}. Rated 4.9★ on Google.`,
      images: ["https://arpitsolar.com/city-solar-bg.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `Solar Installation in ${location.name} | ${formattedSubsidy} Subsidy`,
      description: `Get rooftop solar in ${location.name}, ${location.city}. PM Surya Ghar Yojana subsidy up to ${formattedSubsidy}.`,
      images: ["https://arpitsolar.com/city-solar-bg.png"],
    },
  };
}

export default async function CityPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.city;

  if (!slug || !slug.startsWith("solar-in-")) {
    notFound();
  }

  const location = await getLocation(slug);

  if (!location) {
    notFound();
  }

  const formattedSubsidy = formatSubsidy(location!.subsidy);

  return <CityPageClient location={location!} formattedSubsidy={formattedSubsidy} />;
}
