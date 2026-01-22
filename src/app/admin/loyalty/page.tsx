"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function LoyaltyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Loyalty Program</h1>
                <p className="text-gray-600 mt-1">Reward your customers for repeat purchases</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Loyalty & Rewards
                    </CardTitle>
                    <CardDescription>Points, tiers, and customer rewards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Loyalty program coming soon</p>
                        <p className="text-sm text-gray-500">
                            Set up rewards programs to encourage repeat business
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
