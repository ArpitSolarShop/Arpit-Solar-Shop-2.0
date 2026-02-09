"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number;
    is_published: boolean;
    specifications: any;
    product_type?: string;
    image_url?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>("name");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("solar_products")
                .select("*")
                .eq("is_published", true)
                .order("sort_order", { ascending: true });

            if (error) {
                throw error;
            }

            // Map solar_products to expected Product interface
            const loadedProducts = (data || []).map((p: any) => ({
                id: p.id,
                name: p.name || `${p.category} ${p.system_size_kw} kW Solar System`,
                description: p.description || `Complete ${p.category} solar system with ${p.system_size_kw} kW capacity`,
                category: p.category,
                brand: p.brand || p.category,
                price: Number(p.price),
                is_published: p.is_published ?? true,
                specifications: p.specifications,
                image_url: p.image_url,
            }));
            setProducts(loadedProducts);

            // Calculate max price for slider
            if (loadedProducts.length > 0) {
                const max = Math.max(...loadedProducts.map(p => p.price || 0));
                // Round up to nearest 10000
                const roundedMax = Math.ceil(max / 10000) * 10000 || 500000;
                setMaxPrice(roundedMax);
                setPriceRange([0, roundedMax]);
            }

        } catch (err: any) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Get unique brands and categories (filter out empty strings to prevent SelectItem errors)
    const brands = ["All", ...Array.from(new Set(
        products.map((p) => p.brand).filter(b => b && b.trim() !== "")
    ))];
    const categories = ["All", ...Array.from(new Set(
        products
            .map((p) => p.category || p.product_type)
            .filter(c => c && c.trim() !== "")
    ))];

    // Filter and sort products
    const filteredProducts = products
        .filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesBrand = brandFilter === "All" || p.brand === brandFilter;
            const matchesCategory = categoryFilter === "All" || p.category === categoryFilter || p.product_type === categoryFilter;

            const productPrice = p.price || 0;
            const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

            return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return (a.price || 0) - (b.price || 0);
                case "price-high":
                    return (b.price || 0) - (a.price || 0);
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const clearFilters = () => {
        setSearchQuery("");
        setBrandFilter("All");
        setCategoryFilter("All");
        setSortBy("name");
        setPriceRange([0, maxPrice]);
    };

    const hasActiveFilters = searchQuery || brandFilter !== "All" || categoryFilter !== "All" || sortBy !== "name" || priceRange[0] > 0 || priceRange[1] < maxPrice;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Our Solar Products
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Explore our range of premium solar solutions from top brands like Tata, Reliance, and Shakti.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search products by name, brand, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button (Mobile) */}
                    <div className="flex justify-center lg:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>

                    {/* Filters Panel */}
                    <div className={`${showFilters ? "block" : "hidden"} lg:block bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            {/* Brand Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Brand</Label>
                                <Select value={brandFilter} onValueChange={setBrandFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand} value={brand}>
                                                {brand}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Category</Label>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sort By */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Name (A-Z)</SelectItem>
                                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <Label className="font-medium text-gray-700">Price Range</Label>
                                    <span className="text-xs text-gray-500">
                                        {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[0, maxPrice]}
                                    value={priceRange}
                                    max={maxPrice}
                                    step={1000}
                                    onValueChange={(val: [number, number]) => setPriceRange(val)}
                                    className="my-4"
                                />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <div className="mt-6 flex justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    {!loading && !error && (
                        <div className="text-center text-sm text-gray-600">
                            Showing {filteredProducts.length} of {products.length} products
                        </div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-500 animate-pulse">Loading amazing products...</p>
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-xl mb-4 text-gray-900 font-medium">No products found</p>
                        <p className="mb-6 max-w-md mx-auto">We couldn't find any products matching your current filters. Try adjusting your search or filters.</p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                                Clear all filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper icon component for empty state
function Package({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-9" />
        </svg>
    )
}
