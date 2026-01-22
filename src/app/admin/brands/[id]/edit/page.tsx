"use client";

import { BrandForm } from "@/components/admin/BrandForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditBrandPage() {
    const params = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await fetch("/api/brands");
                const data = await response.json();
                const foundBrand = data.data?.find((b: any) => b.id === params.id);
                setBrand(foundBrand || null);
            } catch (error) {
                console.error("Error fetching brand:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading brand...</p>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Brand not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Brand</h1>
                <p className="text-gray-600 mt-1">Update brand information</p>
            </div>
            <BrandForm brand={brand} />
        </div>
    );
}
