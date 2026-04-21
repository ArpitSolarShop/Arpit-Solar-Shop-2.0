"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { brandSchema, type BrandInput } from "@/lib/validations";

interface BrandFormProps {
    brand?: any;
    onSuccess?: () => void;
}

export function BrandForm({ brand, onSuccess }: BrandFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BrandInput>({
        name: brand?.name || "",
        slug: brand?.slug || "",
        description: brand?.description || "",
        logo_url: brand?.logo_url || "",
        website_url: brand?.website_url || "",
        is_active: brand?.is_active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate
            const validated = brandSchema.parse(formData);

            const url = "/api/brands";
            const method = brand ? "PUT" : "POST";
            const body = brand ? { id: brand.id, ...validated } : validated;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save brand");
            }

            toast.success(brand ? "Brand updated successfully" : "Brand created successfully");

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/admin/brands");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Error saving brand:", error);
            toast.error(error.message || "Failed to save brand");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setFormData({ ...formData, slug });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{brand ? "Edit Brand" : "Add New Brand"}</CardTitle>
                    <CardDescription>
                        {brand ? "Update brand information" : "Create a new brand for your products"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Brand Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onBlur={generateSlug}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="logo_url">Logo URL</Label>
                            <Input
                                id="logo_url"
                                type="url"
                                value={formData.logo_url || ""}
                                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                placeholder="https://example.com/logo.webp"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website_url">Website URL</Label>
                            <Input
                                id="website_url"
                                type="url"
                                value={formData.website_url || ""}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>
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
                            {loading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
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
