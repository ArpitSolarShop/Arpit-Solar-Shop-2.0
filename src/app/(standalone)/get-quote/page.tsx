"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import UniversalQuoteForm from "@/components/forms/UniversalQuoteForm";

export default function GetQuote() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-solar-blue/5 to-solar-orange/5 py-12 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center text-solar-orange hover:text-solar-gold transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Company Logo"
                            width={128}
                            height={64}
                            className="h-16 w-auto"
                            unoptimized
                        />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Unlock Your Solar Potential</h1>
                    <p className="text-lg text-muted-foreground">
                        Our experts will design a custom solar solution perfect for your needs.
                    </p>
                </div>
                <Suspense fallback={<div className="text-center py-10">Loading quote form...</div>}>
                    <UniversalQuoteForm
                        open={true}
                        onOpenChange={() => { }}
                        category="Generic"
                        mode="embedded"
                        config={{
                            title: "Solar Consultation",
                            description: "Fill in the details below to get started."
                        }}
                    />
                </Suspense>
            </div>
        </div>
    );
}
