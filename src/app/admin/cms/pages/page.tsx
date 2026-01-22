"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default function CMSPagesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">CMS Pages</h1>
                    <p className="text-gray-600 mt-1">Manage static pages like About, Contact, Terms</p>
                </div>
                <Link href="/admin/cms/pages/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Page
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Static Pages
                    </CardTitle>
                    <CardDescription>About, Contact, Terms, Privacy pages</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">CMS pages coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create and manage static content pages
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
