"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye, EyeOff, Boxes } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    system_size_kw: number;
    image_url?: string;
    is_published: boolean;
}

interface ProductTableProps {
    products: Product[];
    onRefresh: () => void;
}

export default function ProductTable({ products, onRefresh }: ProductTableProps) {
    const { toast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('solar_products')
                .update({ is_published: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: `Product ${!currentStatus ? 'published' : 'unpublished'} successfully`,
            });

            onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update product status",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('solar_products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Product deleted successfully",
            });

            onRefresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Size (kW)</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Components</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                No products found
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-12 h-12 object-contain rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                            No img
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.system_size_kw} kW</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>
                                    <Link href={`/admin/solar-product-components?brand=${encodeURIComponent(product.category)}`}>
                                        <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 hover:border-blue-400 text-blue-700 border-blue-200 gap-1">
                                            <Boxes className="w-3 h-3" />
                                            {product.category}
                                        </Badge>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={product.is_published ? "default" : "secondary"}>
                                        {product.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/solar-product-components?brand=${encodeURIComponent(product.category)}`}>
                                                    <Boxes className="w-4 h-4 mr-2" />
                                                    Manage Components
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleTogglePublish(product.id, product.is_published)}
                                            >
                                                {product.is_published ? (
                                                    <>
                                                        <EyeOff className="w-4 h-4 mr-2" />
                                                        Unpublish
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Publish
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="text-red-600"
                                                disabled={deletingId === product.id}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {deletingId === product.id ? "Deleting..." : "Delete"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
