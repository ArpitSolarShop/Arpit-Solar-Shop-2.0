"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { supabase } from "@/integrations/supabase/client";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('solar_products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;
            // Map data to include name if not set
            const mapped = {
                ...data,
                name: data.name || `${data.category} ${data.system_size_kw} kW System`,
                brand: data.brand || data.category,
            };
            setProduct(mapped);
        } catch (err: any) {
            console.error('Error fetching product:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load product</p>
                <Link href="/admin/products">
                    <button className="text-blue-600 hover:underline">
                        Back to Products
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update product information</p>
            </div>

            {/* Form */}
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
