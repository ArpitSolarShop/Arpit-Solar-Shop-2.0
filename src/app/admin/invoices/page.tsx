"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                <p className="text-gray-600 mt-1">Manage order invoices and billing</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Receipt className="w-5 h-5 mr-2" />
                        Invoice Management
                    </CardTitle>
                    <CardDescription>Generate and manage customer invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Invoice management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Generate PDF invoices and track payment status
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
