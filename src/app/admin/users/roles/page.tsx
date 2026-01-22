"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Award } from "lucide-react";

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
                    <p className="text-gray-600 mt-1">Define access control and permissions</p>
                </div>
                <Link href="/admin/users/roles/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Role-Based Access Control
                    </CardTitle>
                    <CardDescription>Admin, Manager, Editor, Viewer roles</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-600">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">RBAC coming soon</p>
                        <p className="text-sm text-gray-500">
                            Define roles and set granular permissions
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
