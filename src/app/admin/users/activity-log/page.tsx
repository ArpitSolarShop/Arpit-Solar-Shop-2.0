"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function ActivityLogPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
                <p className="text-gray-600 mt-1">Audit trail of admin actions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Admin Activity Audit
                    </CardTitle>
                    <CardDescription>Track all admin user actions and changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Activity log coming soon</p>
                        <p className="text-sm text-gray-500">
                            Monitor and audit all administrative actions
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
