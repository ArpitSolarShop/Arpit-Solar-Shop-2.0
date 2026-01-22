"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function MarketingReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketing Reports</h1>
                <p className="text-gray-600 mt-1">Campaign performance and ROI</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Marketing Analytics
                    </CardTitle>
                    <CardDescription>Coupon usage, campaign ROI, and conversions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Marketing reports coming soon</p>
                        <p className="text-sm text-gray-500">
                            Measure campaign effectiveness and marketing ROI
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
