"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const CATEGORIES = ["Tata", "Shakti", "Hybrid", "Integrated", "Reliance"];

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        brand: initialData?.brand || "",
        category: initialData?.category || "",
        system_size_kw: initialData?.system_size_kw || "",
        price: initialData?.price || "",
        image_url: initialData?.image_url || "",
        is_published: initialData?.is_published ?? true,
        specifications: initialData?.specifications ? JSON.stringify(initialData.specifications, null, 2) : "{}",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Parse specifications
            let specifications = {};
            try {
                specifications = JSON.parse(formData.specifications);
            } catch {
                toast({
                    title: "Invalid JSON",
                    description: "Specifications must be valid JSON",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Prepare data for solar_products
            const productData = {
                name: formData.name || `${formData.category} ${formData.system_size_kw} kW System`,
                description: formData.description || `Complete ${formData.category} solar system with ${formData.system_size_kw} kW capacity`,
                brand: formData.brand || formData.category,
                category: formData.category,
                system_size_kw: parseFloat(formData.system_size_kw) || 0,
                price: parseFloat(formData.price) || null,
                image_url: formData.image_url || null,
                is_published: formData.is_published,
                specifications,
                sort_order: 0,
            };

            if (isEdit && initialData?.id) {
                // Update existing product
                const { error } = await supabase
                    .from('solar_products')
                    .update(productData)
                    .eq('id', initialData.id);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Product updated successfully",
                });
            } else {
                // Create new product
                const { error } = await supabase
                    .from('solar_products')
                    .insert([productData]);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Product created successfully",
                });
            }

            router.push('/admin/products');
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to save product",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Solar System Details</CardTitle>
                    <CardDescription>Enter the basic product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    category: value,
                                    brand: prev.brand || value
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="system_size_kw">System Size (kW) *</Label>
                            <Input
                                id="system_size_kw"
                                name="system_size_kw"
                                type="number"
                                value={formData.system_size_kw}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 3, 5, 10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Auto-generated if left empty"
                            />
                            <p className="text-xs text-gray-500">
                                Leave empty to auto-generate: "{formData.category || "Category"} {formData.system_size_kw || "X"} kW System"
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder={formData.category || "e.g., Tata Power Solar"}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Leave empty to auto-generate based on category and size"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
                <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Set product price</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xs space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 250000"
                            step="1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Media */}
            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Product image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image_url && (
                            <div className="mt-2">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-32 h-32 object-contain border rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>Technical specifications (JSON format)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="specifications"
                        name="specifications"
                        value={formData.specifications}
                        onChange={handleChange}
                        rows={6}
                        placeholder='{"panel_watt": 545, "inverter_kwp": 5, "warranty_years": 25}'
                        className="font-mono text-sm"
                    />
                </CardContent>
            </Card>

            {/* Publish Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                    <CardDescription>Control product visibility</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_published"
                            checked={formData.is_published}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, is_published: checked }))
                            }
                        />
                        <Label htmlFor="is_published">
                            {formData.is_published ? "Published (visible to customers)" : "Draft (hidden from customers)"}
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading || !formData.category || !formData.system_size_kw || !formData.price}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        isEdit ? "Update Product" : "Create Product"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/products')}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
