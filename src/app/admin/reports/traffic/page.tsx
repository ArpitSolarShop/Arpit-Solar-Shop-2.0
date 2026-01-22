"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function TrafficReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Traffic & Behavior</h1>
                <p className="text-gray-600 mt-1">Website traffic and user behavior analytics</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Traffic Analytics
                    </CardTitle>
                    <CardDescription>Page views, conversion funnel, and referrals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Traffic reports coming soon</p>
                        <p className="text-sm text-gray-500">
                            Monitor site traffic and user behavior patterns
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
