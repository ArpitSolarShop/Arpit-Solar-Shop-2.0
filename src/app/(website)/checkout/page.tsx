"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate order totals
            const subtotal = cartTotal;
            const tax = subtotal * 0.18; // 18% GST
            const shipping = 0; // Free shipping for now
            const discount = 0;
            const total = subtotal + tax + shipping - discount;

            // Prepare order data
            const orderData = {
                customer_id: null, // Will be set when customer management is implemented
                status: "pending",
                payment_status: "pending",
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                discount: discount,
                total: total,
                currency: "INR",
                shipping_address: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode
                },
                billing_address: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode
                },
                notes: `E-commerce order from website. Customer: ${formData.name}, Email: ${formData.email}`,
                items: items.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    product_sku: item.brand, // Using brand as SKU for now
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity
                }))
            };

            // Create order via API
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create order");
            }

            const { data: order } = await res.json();

            // Success
            toast({
                title: "Order Placed Successfully!",
                description: `Your order ${order.order_number} has been received. We will contact you shortly for payment and delivery.`,
            });

            clearCart();

            // Redirect to home after a delay
            setTimeout(() => {
                router.push("/");
            }, 2000);

        } catch (error: any) {
            console.error("Checkout Error:", error);
            toast({
                title: "Order Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h1>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
                    <Link href="/products">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/products" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Shopping
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Checkout Form */}
                    <section className="lg:col-span-7">
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Details</CardTitle>
                                <CardDescription>Enter your contact and shipping information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input id="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input id="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Phone *</Label>
                                            <Input id="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="9876543210" pattern="[0-9]{10}" />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <Label htmlFor="address">Address *</Label>
                                            <Input id="address" required value={formData.address} onChange={handleInputChange} placeholder="Street, Sector, House No." />
                                        </div>

                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input id="city" required value={formData.city} onChange={handleInputChange} placeholder="Your City" />
                                        </div>

                                        <div>
                                            <Label htmlFor="pincode">Pincode *</Label>
                                            <Input id="pincode" required value={formData.pincode} onChange={handleInputChange} placeholder="123456" />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Order Summary */}
                    <section className="lg:col-span-5 mt-8 lg:mt-0">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="flex-1 pr-4">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">GST (18%)</span>
                                        <span className="font-medium">₹{(cartTotal * 0.18).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{(cartTotal * 1.18).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    * Order will be confirmed after payment verification. Our team will contact you for payment details.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                                    type="submit"
                                    form="checkout-form"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
