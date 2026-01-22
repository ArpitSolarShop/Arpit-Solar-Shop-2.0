"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, UsersRound } from "lucide-react";

export default function CustomerGroupsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Groups</h1>
                    <p className="text-gray-600 mt-1">Segment customers for targeted pricing and marketing</p>
                </div>
                <Link href="/admin/customer-groups/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Group
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <UsersRound className="w-5 h-5 mr-2" />
                        Customer Segmentation
                    </CardTitle>
                    <CardDescription>Residential, Commercial, Wholesale groups</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <UsersRound className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Customer groups coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create customer segments for special pricing and promotions
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
