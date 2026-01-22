"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SEOPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">SEO Management</h1>
                <p className="text-gray-600 mt-1">Optimize your store for search engines</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        Search Engine Optimization
                    </CardTitle>
                    <CardDescription>URL redirects, meta tags, and sitemaps</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">SEO tools coming soon</p>
                        <p className="text-sm text-gray-500">
                            Manage URL redirects, meta tags, and search optimization
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
