"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UniversalQuoteForm, { QuoteCategory } from "@/components/forms/UniversalQuoteForm";

export default function ClientQuoteTrigger({
    category,
    btnText = "Get Quote"
}: {
    category: QuoteCategory | string;
    btnText?: string;
}) {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    // Fallback logic if the string isn't exactly a QuoteCategory
    const safeCategory = (['Tata', 'Reliance', 'Shakti', 'Hybrid', 'Generic'].includes(category))
        ? category as QuoteCategory
        : 'Generic';

    return (
        <>
            <Button
                onClick={() => setIsQuoteOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg shadow-md hover:shadow-lg transition-all"
            >
                {btnText}
            </Button>

            <UniversalQuoteForm
                open={isQuoteOpen}
                onOpenChange={setIsQuoteOpen}
                category={safeCategory}
                config={{
                    title: btnText,
                    description: "Please fill out this quick form, and our solar experts will contact you with a customized quotation based on your exact requirements."
                }}
            />
        </>
    );
}
