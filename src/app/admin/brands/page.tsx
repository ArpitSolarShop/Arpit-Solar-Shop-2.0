"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";

export default function BrandsPage() {
    const router = useRouter();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch("/api/brands");
            if (!response.ok) throw new Error("Failed to fetch brands");
            const { data } = await response.json();
            setBrands(data || []);
        } catch (error: any) {
            console.error("Error fetching brands:", error);
            toast.error("Failed to load brands");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (brand: any) => {
        if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) return;

        try {
            const response = await fetch(`/api/brands?id=${brand.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete brand");

            toast.success("Brand deleted successfully");
            fetchBrands();
        } catch (error: any) {
            console.error("Error deleting brand:", error);
            toast.error("Failed to delete brand");
        }
    };

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (value: string, row: any) => (
                <div className="flex items-center gap-3">
                    {row.logo_url ? (
                        <img src={row.logo_url} alt={value} className="w-10 h-10 object-contain rounded" />
                    ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                    <span className="font-medium">{value}</span>
                </div>
            ),
        },
        {
            key: "slug",
            label: "Slug",
            render: (value: string) => (
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">{value}</code>
            ),
        },
        {
            key: "website_url",
            label: "Website",
            render: (value: string) =>
                value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Visit
                    </a>
                ) : (
                    <span className="text-gray-500">-</span>
                ),
        },
        {
            key: "is_active",
            label: "Status",
            render: (value: boolean) => (
                <Badge variant={value ? "default" : "secondary"}>
                    {value ? "Active" : "Inactive"}
                </Badge>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading brands...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
                    <p className="text-gray-600 mt-1">Manage product brands and manufacturers</p>
                </div>
                <Button onClick={() => router.push("/admin/brands/new")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Brand
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Brands</CardTitle>
                    <CardDescription>
                        {brands.length} {brands.length === 1 ? "brand" : "brands"} total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={brands}
                        columns={columns}
                        onEdit={(brand) => router.push(`/admin/brands/${brand.id}/edit`)}
                        onDelete={handleDelete}
                        searchable
                        searchPlaceholder="Search brands..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
