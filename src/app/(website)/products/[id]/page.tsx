"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import UniversalQuoteForm, { QuoteCategory } from "@/components/forms/UniversalQuoteForm";
import {
    ArrowLeft,
    ShoppingCart,
    Package,
    Zap,
    CheckCircle,
    Loader2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    image_url?: string;
    specifications?: any;
    product_type?: string;
    is_published: boolean;
    price_includes_gst?: boolean;
    gst_rate?: number;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(price);
};

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", params.id)
                .eq("is_published", true)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (err: any) {
            console.error("Error fetching product:", err);
            setError("Product not found or unavailable.");
        } finally {
            setLoading(false);
        }
    };

    const getBrandLogo = (brand: string) => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("tata")) return "/Tata%20Power%20Solar.png";
        if (brandLower.includes("reliance")) return "/reliance-industries-ltd.png";
        if (brandLower.includes("shakti")) return "/Shakti%20Solar.png";
        if (brandLower.includes("waree") || brandLower.includes("adani")) return "/Integrated.png";
        if (brandLower.includes("hybrid")) return "/Hybrid.png";
        return null;
    };

    const getQuoteCategory = (brand: string): QuoteCategory => {
        const brandLower = brand.toLowerCase();
        if (brandLower.includes("tata")) return "Tata";
        if (brandLower.includes("reliance")) return "Reliance";
        if (brandLower.includes("shakti")) return "Shakti";
        if (brandLower.includes("hybrid")) return "Hybrid";
        return "Generic";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error || "Product not found"}</AlertDescription>
                    <Link href="/products" className="mt-4 inline-block">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </Alert>
            </div>
        );
    }

    const brandLogo = getBrandLogo(product.brand);
    const displayImage = product.image_url || brandLogo;
    const specs = product.specifications || {};
    const specEntries = Object.entries(specs);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Product Image */}
                    <div className="mb-8 lg:mb-0">
                        <Card className="overflow-hidden">
                            <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-gray-50">
                                {displayImage && !imageError ? (
                                    <img
                                        src={displayImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-32 h-32 text-gray-300" />
                                    </div>
                                )}
                                {product.product_type && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
                                    >
                                        {product.product_type}
                                    </Badge>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <Badge variant="outline" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
                                {product.brand}
                            </Badge>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                {product.name}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            {product.price && product.price > 0 ? (
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {product.price_includes_gst ? "Incl. GST" : "+ GST"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Inclusive of all charges
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xl font-semibold text-blue-600">
                                        Contact for Best Price
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Get a customized quote for your requirements
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button
                                onClick={() => setIsQuoteOpen(true)}
                                variant="outline"
                                className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 h-12 text-lg"
                            >
                                Get Quote
                            </Button>
                        </div>

                        {/* Features */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                                    Key Features
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                                        <span className="text-sm text-gray-700">Premium quality from {product.brand}</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                                        <span className="text-sm text-gray-700">Professional installation support</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                                        <span className="text-sm text-gray-700">Manufacturer warranty included</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                                        <span className="text-sm text-gray-700">Expert consultation available</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Specifications */}
                {specEntries.length > 0 && (
                    <div className="mt-12">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {specEntries.map(([key, value], index) => (
                                        <div key={key}>
                                            <div className="flex justify-between py-3">
                                                <span className="text-gray-600 capitalize">
                                                    {key.replace(/_/g, " ")}
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {String(value)}
                                                </span>
                                            </div>
                                            {index < specEntries.length - 1 && <Separator />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Quote Form Modal */}
            <UniversalQuoteForm
                open={isQuoteOpen}
                onOpenChange={setIsQuoteOpen}
                category={getQuoteCategory(product.brand)}
                productDetails={{
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    price: product.price,
                    price_includes_gst: product.price_includes_gst,
                    gst_rate: product.gst_rate
                }}
                config={{
                    title: `Quote for ${product.name}`,
                    description: "Complete the form below to get a customized quote for this product."
                }}
            />
        </div>
    );
}
