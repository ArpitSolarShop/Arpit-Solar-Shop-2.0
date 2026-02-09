"use client";

import { useEffect, useState } from "react";
import { Package, DollarSign, Eye, TrendingUp } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


interface Stats {
    totalProducts: number;
    publishedProducts: number;
    totalValue: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProducts: 0,
        publishedProducts: 0,
        totalValue: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data = await response.json();

            setStats({
                totalProducts: data.totalProducts,
                publishedProducts: data.publishedProducts,
                totalValue: data.totalValue,
                totalOrders: data.totalOrders,
                totalRevenue: data.totalRevenue,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={loading ? "..." : formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    description="Total earnings from orders"
                />
                <StatsCard
                    title="Total Orders"
                    value={loading ? "..." : stats.totalOrders}
                    icon={Package}
                    description="Total orders received"
                />
                <StatsCard
                    title="Total Products"
                    value={loading ? "..." : stats.totalProducts}
                    icon={Eye}
                    description={`${stats.publishedProducts} published`}
                />
                <StatsCard
                    title="Inventory Value"
                    value={loading ? "..." : formatCurrency(stats.totalValue)}
                    icon={TrendingUp}
                    description="Total value of stock"
                />
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/products/new">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            <Package className="w-4 h-4 mr-2" />
                            Add New Product
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View All Products
                        </Button>
                    </Link>
                    <Link href="/products" target="_blank">
                        <Button variant="outline" className="w-full">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Store
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">
                        {stats.totalProducts > 0
                            ? `You have ${stats.totalProducts} products in your catalog. ${stats.publishedProducts} are currently published.`
                            : "No products yet. Start by adding your first product!"
                        }
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
