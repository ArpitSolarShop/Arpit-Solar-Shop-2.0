"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageCircle, Globe, Shield, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions/crm";

export default function Contact() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await submitContactForm(formData);

            if (result.success) {
                toast({
                    title: "Message Sent!",
                    description: "Thank you for contacting Arpit Solar Shop. We will get back to you shortly.",
                });
                setFormData({ name: "", phone: "", email: "", city: "", message: "" });
            } else {
                toast({
                    title: "Submission Failed",
                    description: "Please try again later or contact us on WhatsApp.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Form error:", error);
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero */}
            <section className="pt-24 pb-10 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0a2351]">Contact Arpit Solar Shop</h1>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4 rounded"></div>
                        <p className="mt-4 text-lg md:text-xl text-gray-700">
                            M/s. Arpit Solar Shop — Authorized Channel Partner: Reliance New Energy
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left: Contact Details */}
                        <div className="space-y-6">
                            <Card className="border-black/10 shadow-sm h-full">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <MapPin className="h-6 w-6 text-yellow-500" />
                                        Visit our Office
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 text-gray-700">
                                    <div className="space-y-2">
                                        <p className="font-semibold text-lg text-[#0a2351]">Head Office:</p>
                                        <p className="leading-relaxed">
                                            Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur,<br />
                                            Varanasi 221003 (Uttar Pradesh)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="font-semibold text-lg text-[#0a2351]">Branches:</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Varanasi</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Mau</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Ballia</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Phone className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Call Us</p>
                                                <a href="tel:9005770466" className="font-semibold hover:text-blue-600 transition-colors">9005770466</a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <MessageCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">WhatsApp</p>
                                                <a href="https://wa.me/919044555572" className="font-semibold hover:text-blue-600 transition-colors">9044555572</a>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href="mailto:info@arpitsolar.com" className="font-semibold hover:text-blue-600 transition-colors">info@arpitsolar.com</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3 mt-4">
                                        <Shield className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-yellow-800">Authorized Channel Partner</p>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Reliance New Energy • Shakti Solar Rooftop
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="space-y-6">
                            <Card className="border-black/10 shadow-lg border-t-4 border-t-[#0a2351]">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-[#0a2351]">Send us a Message</CardTitle>
                                    <p className="text-gray-500">Fill out the form below and our team will get back to you within 24 hours.</p>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="10-digit mobile number"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City / Location</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    placeholder="Your city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="your@email.com (Optional)"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="How can we help you?"
                                                className="min-h-[120px]"
                                                value={formData.message}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-semibold bg-[#0a2351] hover:bg-[#0d2e67]"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="ml-2 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Card className="border-black/10 overflow-hidden">
                        <CardHeader className="pb-2 bg-gray-50 border-b">
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                Find us on Google Maps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="w-full h-[450px] bg-gray-100">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.5367708745584!2d82.94755207538691!3d25.353320777610783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db16a9c907f%3A0xe094345c3bcc59c2!2sArpit%20Solar%20Shop!5e0!3m2!1sen!2sin!4v1770877829868!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Arpit Solar Shop Location"
                                    className="w-full h-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
