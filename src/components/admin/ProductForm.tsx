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

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        brand: initialData?.brand || "",
        category: initialData?.category || "",
        product_type: initialData?.product_type || "",
        price: initialData?.price || "",
        discount_price: initialData?.discount_price || "",
        image_url: initialData?.image_url || "",
        stock_quantity: initialData?.stock_quantity || 0,
        sku: initialData?.sku || "",
        slug: initialData?.slug || "",
        meta_title: initialData?.meta_title || "",
        meta_description: initialData?.meta_description || "",
        is_published: initialData?.is_published ?? false,
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

            // Prepare data
            const productData = {
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                category: formData.category,
                product_type: formData.product_type,
                price: parseFloat(formData.price) || null,
                discount_price: parseFloat(formData.discount_price) || null,
                image_url: formData.image_url || null,
                stock_quantity: parseInt(formData.stock_quantity as any) || 0,
                sku: formData.sku || null,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
                meta_title: formData.meta_title || null,
                meta_description: formData.meta_description || null,
                is_published: formData.is_published,
                specifications,
            };

            if (isEdit && initialData?.id) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
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
                    .from('products')
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
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Tata Solar 5kW System"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand *</Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Tata Power Solar"
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
                            rows={4}
                            placeholder="Enter product description..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Solar Systems"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="product_type">Product Type</Label>
                            <Input
                                id="product_type"
                                name="product_type"
                                value={formData.product_type}
                                onChange={handleChange}
                                placeholder="e.g., On-Grid, Hybrid"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
                <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Set product pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.01"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount_price">Discount Price (₹)</Label>
                            <Input
                                id="discount_price"
                                name="discount_price"
                                type="number"
                                value={formData.discount_price}
                                onChange={handleChange}
                                placeholder="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Media */}
            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Product images and media</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg or /logo.png"
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
                    <CardDescription>Product technical specifications (JSON format)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="specifications"
                        name="specifications"
                        value={formData.specifications}
                        onChange={handleChange}
                        rows={8}
                        placeholder='{"capacity": "5kW", "warranty": "25 years"}'
                        className="font-mono text-sm"
                    />
                </CardContent>
            </Card>

            {/* Inventory & SEO */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory & SEO</CardTitle>
                    <CardDescription>Stock and search engine optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input
                                id="stock_quantity"
                                name="stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="PROD-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="product-name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meta_title">Meta Title</Label>
                        <Input
                            id="meta_title"
                            name="meta_title"
                            value={formData.meta_title}
                            onChange={handleChange}
                            placeholder="SEO title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meta_description">Meta Description</Label>
                        <Textarea
                            id="meta_description"
                            name="meta_description"
                            value={formData.meta_description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="SEO description"
                        />
                    </div>
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
                    disabled={loading}
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
