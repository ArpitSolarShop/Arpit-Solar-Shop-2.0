"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomerReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Reports</h1>
                <p className="text-gray-600 mt-1">Customer lifetime value and behavior</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Customer Analytics
                    </CardTitle>
                    <CardDescription>CLV, repeat rate, and acquisition cost</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Customer reports coming soon</p>
                        <p className="text-sm text-gray-500">
                            Analyze customer value and purchasing patterns
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
