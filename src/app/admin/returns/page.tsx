"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export default function ReturnsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Returns & Exchanges</h1>
                <p className="text-gray-600 mt-1">Manage product returns and RMA requests</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Return Management
                    </CardTitle>
                    <CardDescription>Process returns, exchanges, and refunds</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Return management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Handle RMA requests and process customer returns
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
