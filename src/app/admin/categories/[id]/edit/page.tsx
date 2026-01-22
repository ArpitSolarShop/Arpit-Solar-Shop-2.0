"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditCategoryPage() {
    const params = useParams();
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all categories for parent selection
                const categoriesRes = await fetch("/api/categories");
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData.data || []);

                // Fetch the specific category to edit
                const categoryRes = await fetch("/api/categories");
                const categoryData = await categoryRes.json();
                const foundCategory = categoryData.data?.find((c: any) => c.id === params.id);
                setCategory(foundCategory || null);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading category...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Category not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
                <p className="text-gray-600 mt-1">Update category information</p>
            </div>
            <CategoryForm category={category} categories={categories} />
        </div>
    );
}
