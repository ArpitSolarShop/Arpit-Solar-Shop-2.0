"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Grid3x3 } from "lucide-react";

export default function AttributesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
                    <p className="text-gray-600 mt-1">Manage product attributes and variants</p>
                </div>
                <Link href="/admin/attributes/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Attribute
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Grid3x3 className="w-5 h-5 mr-2" />
                        Product Attributes
                    </CardTitle>
                    <CardDescription>Define custom attributes like Wattage, Panel Type, Efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Attribute management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create custom attributes for your solar products
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
