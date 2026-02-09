"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";
import { supabase } from "@/integrations/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('solar_products')
                .select('*')
                .order('category', { ascending: true })
                .order('system_size_kw', { ascending: true });

            if (error) throw error;
            // Map data to include name if not set
            const mapped = (data || []).map((p: any) => ({
                ...p,
                name: p.name || `${p.category} ${p.system_size_kw} kW System`,
                brand: p.brand || p.category,
            }));
            setProducts(mapped);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories for filter
    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
        return ["All", ...cats.sort()];
    }, [products]);

    const filteredProducts = products.filter((p: any) => {
        const matchesSearch =
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your solar product catalog ({products.length} products)</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat} {cat !== "All" && `(${products.filter((p: any) => p.category === cat).length})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results info */}
            {!loading && (
                <p className="text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length} products
                </p>
            )}

            {/* Products Table */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading products...</p>
                </div>
            ) : (
                <ProductTable products={filteredProducts} onRefresh={fetchProducts} />
            )}
        </div>
    );
}
