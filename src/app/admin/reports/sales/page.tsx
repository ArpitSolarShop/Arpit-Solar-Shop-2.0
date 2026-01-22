"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function SalesReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
                <p className="text-gray-600 mt-1">Revenue, orders, and payment analytics</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Sales Analytics
                    </CardTitle>
                    <CardDescription>Track revenue and order performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Sales reports coming soon</p>
                        <p className="text-sm text-gray-500">
                            Analyze revenue trends and order statistics
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
