"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch("/api/customers");
            if (!response.ok) throw new Error("Failed to fetch customers");
            const { data } = await response.json();
            setCustomers(data || []);
        } catch (error: any) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (customer: any) => {
        if (!confirm(`Are you sure you want to delete "${customer.first_name} ${customer.last_name}"?`)) return;

        try {
            const response = await fetch(`/api/customers?id=${customer.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete customer");

            toast.success("Customer deleted successfully");
            fetchCustomers();
        } catch (error: any) {
            console.error("Error deleting customer:", error);
            toast.error("Failed to delete customer");
        }
    };

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{row.first_name} {row.last_name}</span>
                </div>
            ),
        },
        {
            key: "email",
            label: "Email",
        },
        {
            key: "phone",
            label: "Phone",
            render: (value: string) => value || <span className="text-gray-500">-</span>,
        },
        {
            key: "total_orders",
            label: "Orders",
            render: (value: number) => (
                <Badge variant="outline">{value || 0}</Badge>
            ),
        },
        {
            key: "total_spent",
            label: "Total Spent",
            render: (value: number) => `₹${(value || 0).toLocaleString()}`,
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
                <p className="text-gray-500">Loading customers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600 mt-1">Manage your customer database</p>
                </div>
                <Button onClick={() => router.push("/admin/customers/new")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        {customers.length} {customers.length === 1 ? "customer" : "customers"} total
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={customers}
                        columns={columns}
                        onEdit={(customer) => router.push(`/admin/customers/${customer.id}/edit`)}
                        onDelete={handleDelete}
                        searchable
                        searchPlaceholder="Search customers..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
