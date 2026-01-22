"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Image } from "lucide-react";

export default function BannersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Banners & Promotions</h1>
                    <p className="text-gray-600 mt-1">Manage homepage banners and promotional content</p>
                </div>
                <Link href="/admin/marketing/banners/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Banner
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Image className="w-5 h-5 mr-2" />
                        Banner Management
                    </CardTitle>
                    <CardDescription>Homepage sliders and promotional banners</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Banner management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create and schedule promotional banners for your store
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
