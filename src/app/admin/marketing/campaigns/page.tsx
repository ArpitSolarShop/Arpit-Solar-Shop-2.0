"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Mail } from "lucide-react";

export default function CampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
                    <p className="text-gray-600 mt-1">Create and manage email and SMS campaigns</p>
                </div>
                <Link href="/admin/marketing/campaigns/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Campaign Management
                    </CardTitle>
                    <CardDescription>Email and SMS marketing campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Campaign management coming soon</p>
                        <p className="text-sm text-gray-500">
                            Create targeted marketing campaigns for your customers
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
