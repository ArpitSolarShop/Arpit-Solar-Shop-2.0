"use client";

import { BrandForm } from "@/components/admin/BrandForm";

export default function NewBrandPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Brand</h1>
                <p className="text-gray-600 mt-1">Create a new brand for your products</p>
            </div>
            <BrandForm />
        </div>
    );
}
