"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus, Ticket } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CouponsPage() {
    const router = useRouter();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch("/api/coupons");
            if (!response.ok) throw new Error("Failed to fetch coupons");
            const { data } = await response.json();
            setCoupons(data || []);
        } catch (error: any) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (coupon: any) => {
        if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;

        try {
            const response = await fetch(`/api/coupons?id=${coupon.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete coupon");

            toast.success("Coupon deleted successfully");
            fetchCoupons();
        } catch (error: any) {
            console.error("Error deleting coupon:", error);
            toast.error("Failed to delete coupon");
        }
    };

    const columns = [
        {
            key: "code",
            label: "Code",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gray-500" />
                    <code className="font-mono font-bold text-blue-600">{value}</code>
                </div>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (value: string) => (
                <Badge variant="outline">
                    {value === "percentage" ? "%" : value === "fixed" ? "₹" : "Free Shipping"}
                </Badge>
            ),
        },
        {
            key: "value",
            label: "Value",
            render: (value: number, row: any) => {
                if (row.type === "percentage") return `${value}%`;
                if (row.type === "fixed") return `₹${value}`;
                return "-";
            },
        },
        {
            key: "usage_count",
            label: "Used",
            render: (value: number, row: any) => {
                const limit = row.usage_limit || "∞";
                return `${value} / ${limit}`;
            },
        },
        {
            key: "end_date",
            label: "Expires",
            render: (value: string) => {
                if (!value) return <span className="text-gray-500">Never</span>;
                const date = new Date(value);
                const isExpired = date < new Date();
                return (
                    <span className={isExpired ? "text-red-600" : ""}>
                        {format(date, "MMM dd, yyyy")}
                    </span>
                );
            },
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
                <p className="text-gray-500">Loading coupons...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
                    <p className="text-gray-600 mt-1">Manage promotional discount codes</p>
                </div>
                <Button onClick={() => router.push("/admin/marketing/coupons/new")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Coupon
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Coupons</CardTitle>
                    <CardDescription>
                        {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"} total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={coupons}
                        columns={columns}
                        onEdit={(coupon) => router.push(`/admin/marketing/coupons/${coupon.id}/edit`)}
                        onDelete={handleDelete}
                        searchable
                        searchPlaceholder="Search coupons..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
