"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UniversalQuoteForm, { QuoteCategory } from "@/components/forms/UniversalQuoteForm";
import { Zap, ArrowRight, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductCardProps {
    product: {
        id: number | string;
        name: string;
        description: string;
        category: string;
        brand: string;
        price?: number;
        image_url?: string;
        system_configurations?: any;
        specifications?: any;
        product_type?: string;
    };
}

// Helper function to format price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

export function ProductCard({ product }: ProductCardProps) {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { addToCart } = useCart();

    // Determine the appropriate quote category based on brand/product type
    const getQuoteCategory = (brand: string): QuoteCategory => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("tata")) return "Tata";
        if (brandLower.includes("reliance")) return "Reliance";
        if (brandLower.includes("shakti")) return "Shakti";
        if (brandLower.includes("hybrid")) return "Hybrid";
        return "Generic";
    };

    const category = getQuoteCategory(product.brand);

    // Extract key specifications for display
    const specs = product.specifications || {};
    const keySpecs = Object.entries(specs).slice(0, 3); // Take first 3 specs

    // Get brand logo based on brand name
    const getBrandLogo = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("tata")) return "/Tata%20Power%20Solar.png";
        if (brandLower.includes("reliance")) return "/reliance-industries-ltd.png";
        if (brandLower.includes("shakti")) return "/Shakti%20Solar.png";
        if (brandLower.includes("waree") || brandLower.includes("adani")) return "/Integrated.png";
        if (brandLower.includes("hybrid")) return "/Hybrid.png";
        return null;
    };

    const brandLogo = getBrandLogo(product.brand);
    const displayImage = product.image_url || brandLogo;

    return (
        <>
            <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
                {/* Product Image */}
                <Link href={`/products/${product.id}`} className="cursor-pointer">
                    <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-gray-50 overflow-hidden">
                        {displayImage && !imageError ? (
                            <img
                                src={displayImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                onError={() => setImageError(true)}
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-20 h-20 text-gray-300" />
                            </div>
                        )}
                        {product.product_type && (
                            <Badge
                                variant="secondary"
                                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs"
                            >
                                {product.product_type}
                            </Badge>
                        )}
                    </div>
                </Link>

                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {product.brand}
                        </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-sm">
                        {product.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                    {/* Specifications */}
                    {keySpecs.length > 0 && (
                        <div className="space-y-1.5 mb-4 flex-1">
                            {keySpecs.map(([key, value]) => (
                                <div key={key} className="flex items-start text-xs text-gray-600">
                                    <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <span className="capitalize">{key.replace(/_/g, " ")}: </span>
                                    <span className="font-medium ml-1 text-gray-900">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Price Display */}
                    {product.price && product.price > 0 ? (
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-gray-500">+ GST</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <span className="text-sm font-medium text-blue-600">
                                Contact for pricing
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-auto grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm"
                            onClick={() => addToCart(product)}
                        >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            onClick={() => setIsQuoteOpen(true)}
                        >
                            Quote
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <UniversalQuoteForm
                open={isQuoteOpen}
                onOpenChange={setIsQuoteOpen}
                category={category}
                productDetails={{
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    price: product.price
                }}
                config={{
                    title: `Quote for ${product.name}`,
                    description: "Complete the form below to get a customized quote for this product."
                }}
            />
        </>
    );
}
