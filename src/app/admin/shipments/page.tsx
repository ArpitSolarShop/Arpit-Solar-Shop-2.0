"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function ShipmentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
                <p className="text-gray-600 mt-1">Track order shipments and deliveries</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Shipment Tracking
                    </CardTitle>
                    <CardDescription>Monitor delivery status and carrier information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Truck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Shipment tracking coming soon</p>
                        <p className="text-sm text-gray-500">
                            Track shipments and manage carrier integrations
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
