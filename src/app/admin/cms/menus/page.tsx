"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu } from "lucide-react";

export default function MenusPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Site Menus</h1>
                <p className="text-gray-600 mt-1">Manage navigation menus</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Menu className="w-5 h-5 mr-2" />
                        Navigation Builder
                    </CardTitle>
                    <CardDescription>Header, footer, and custom menus</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Menu className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Menu builder coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create and customize site navigation menus
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
