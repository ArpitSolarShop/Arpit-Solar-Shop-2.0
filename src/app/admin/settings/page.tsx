"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, CreditCard, Truck, Receipt } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Configure your store settings</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="taxes">Taxes</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                General Settings
                            </CardTitle>
                            <CardDescription>Store name, contact info, timezone, currency</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-600">
                                <p className="text-sm text-gray-500">General settings coming soon</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Settings
                            </CardTitle>
                            <CardDescription>Payment gateway configuration</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-600">
                                <p className="text-sm text-gray-500">Payment settings coming soon</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="shipping">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Truck className="w-5 h-5 mr-2" />
                                Shipping Settings
                            </CardTitle>
                            <CardDescription>Shipping zones, methods, and rates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-600">
                                <p className="text-sm text-gray-500">Shipping settings coming soon</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="taxes">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Receipt className="w-5 h-5 mr-2" />
                                Tax Settings
                            </CardTitle>
                            <CardDescription>Tax rules and rates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-600">
                                <p className="text-sm text-gray-500">Tax settings coming soon</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
