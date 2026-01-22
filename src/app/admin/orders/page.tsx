"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Failed to load orders",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Order status updated to ${newStatus}`,
            });
            fetchOrders();
        } catch (error: any) {
            console.error("Error updating status:", error);
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const columns = [
        {
            key: "order_number",
            label: "Order #",
            render: (value: string) => <span className="font-mono font-medium">{value}</span>
        },
        {
            key: "created_at",
            label: "Date",
            render: (value: string) => new Date(value).toLocaleDateString()
        },
        {
            key: "project_location", // Using project_location as address/customer identifier for now
            label: "Customer/Location",
            render: (value: string, row: any) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-xs text-gray-500">{value}</span>
                </div>
            )
        },
        {
            key: "total_amount",
            label: "Amount",
            render: (value: number) => `₹${(value || 0).toLocaleString()}`
        },
        {
            key: "status",
            label: "Status",
            render: (value: string) => {
                let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
                if (value === "completed" || value === "delivered") variant = "default";
                if (value === "pending") variant = "secondary";
                if (value === "cancelled") variant = "destructive";

                return (
                    <Badge variant={variant} className="capitalize">
                        {value}
                    </Badge>
                );
            }
        },
        {
            key: "actions",
            label: "Actions",
            render: (_: any, row: any) => (
                <div className="flex gap-2">
                    <select
                        className="text-xs border rounded p-1"
                        value={row.status}
                        onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">Manage and track customer orders</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                        All Orders
                    </CardTitle>
                    <CardDescription>
                        {orders.length} {orders.length === 1 ? "order" : "orders"} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={orders}
                        columns={columns}
                        searchable
                        searchPlaceholder="Search by Order # or Name..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
