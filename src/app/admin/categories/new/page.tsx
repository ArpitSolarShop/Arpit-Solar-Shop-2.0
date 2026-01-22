"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { useEffect, useState } from "react";

export default function NewCategoryPage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch existing categories for parent selection
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data.data || []))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
                <p className="text-gray-600 mt-1">Create a new product category</p>
            </div>
            <CategoryForm categories={categories} />
        </div>
    );
}
