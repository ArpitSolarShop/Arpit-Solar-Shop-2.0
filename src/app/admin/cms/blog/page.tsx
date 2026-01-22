"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
                    <p className="text-gray-600 mt-1">Solar education and company news</p>
                </div>
                <Link href="/admin/cms/blog/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Newspaper className="w-5 h-5 mr-2" />
                        Blog Posts
                    </CardTitle>
                    <CardDescription>Educational content and news articles</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Blog management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Publish articles about solar energy and company updates
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
