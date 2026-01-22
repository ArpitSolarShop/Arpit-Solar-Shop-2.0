"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderTree } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            const { data } = await response.json();
            setCategories(data || []);
        } catch (error: any) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category: any) => {
        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

        try {
            const response = await fetch(`/api/categories?id=${category.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete category");

            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (value: string, row: any) => (
                <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-gray-500" />
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
            key: "parent_id",
            label: "Parent",
            render: (value: string) => {
                if (!value) return <span className="text-gray-500">Top Level</span>;
                const parent = categories.find((c: any) => c.id === value);
                return parent ? parent.name : "-";
            },
        },
        {
            key: "display_order",
            label: "Order",
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
                <p className="text-gray-500">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Organize your products into categories</p>
                </div>
                <Button onClick={() => router.push("/admin/categories/new")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        {categories.length} {categories.length === 1 ? "category" : "categories"} total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={categories}
                        columns={columns}
                        onEdit={(category) => router.push(`/admin/categories/${category.id}/edit`)}
                        onDelete={handleDelete}
                        searchable
                        searchPlaceholder="Search categories..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
