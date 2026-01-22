"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes } from "lucide-react";

export default function InventoryReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
                <p className="text-gray-600 mt-1">Stock levels and turnover analysis</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Boxes className="w-5 h-5 mr-2" />
                        Inventory Analytics
                    </CardTitle>
                    <CardDescription>Stock levels, turnover rates, and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Boxes className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Inventory reports coming soon</p>
                        <p className="text-sm text-gray-500">
                            Track stock levels and inventory turnover
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
