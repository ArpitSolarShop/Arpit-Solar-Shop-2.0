"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { customerSchema, type CustomerInput } from "@/lib/validations";

interface CustomerFormProps {
    customer?: any;
    customerGroups?: any[];
    onSuccess?: () => void;
}

export function CustomerForm({ customer, customerGroups = [], onSuccess }: CustomerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CustomerInput>({
        email: customer?.email || "",
        first_name: customer?.first_name || "",
        last_name: customer?.last_name || "",
        phone: customer?.phone || "",
        customer_group_id: customer?.customer_group_id || null,
        notes: customer?.notes || "",
        tags: customer?.tags || [],
        is_active: customer?.is_active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validated = customerSchema.parse(formData);

            const url = "/api/customers";
            const method = customer ? "PUT" : "POST";
            const body = customer ? { id: customer.id, ...validated } : validated;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save customer");
            }

            toast.success(customer ? "Customer updated successfully" : "Customer created successfully");

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/admin/customers");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Error saving customer:", error);
            toast.error(error.message || "Failed to save customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{customer ? "Edit Customer" : "Add New Customer"}</CardTitle>
                    <CardDescription>
                        {customer ? "Update customer information" : "Create a new customer account"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customer_group_id">Customer Group</Label>
                        <Select
                            value={formData.customer_group_id || "none"}
                            onValueChange={(value) => setFormData({ ...formData, customer_group_id: value === "none" ? null : value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select customer group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {customerGroups.map((group) => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.name} ({group.discount_percentage}% discount)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Internal notes about this customer"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
