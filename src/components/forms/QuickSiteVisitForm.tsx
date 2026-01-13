"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Phone, User, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuickSiteVisitFormProps {
    city: string;
    children: React.ReactNode;
}

export function QuickSiteVisitForm({ city, children }: QuickSiteVisitFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: city || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert into Supabase
            const { error: supabaseError } = await supabase.from("solar_quote_requests").insert({
                name: formData.name,
                phone: formData.phone,
                project_location: formData.location,
                source: "Quick Site Visit Form",
                customer_type: "residential", // Defaulting
            });

            if (supabaseError) {
                console.warn("Supabase insert failed:", supabaseError);
                // We typically continue to try Kit19 even if Supabase fails (as per HeroGetQuote logic)
            }

            // 2. Send to Kit19 API
            const apiUrl = process.env.NEXT_PUBLIC_KIT19_API;
            const authKey = process.env.NEXT_PUBLIC_KIT19_AUTH;

            if (apiUrl && authKey) {
                const payload = {
                    PersonName: formData.name,
                    MobileNo: formData.phone,
                    City: formData.location,
                    project_location: formData.location, // Providing both just in case
                    SourceName: "Website",
                    MediumName: "Quick Site Visit Form",
                    CampaignName: `Location Page - ${city}`,
                    InitialRemarks: `Requested Free Site Visit. Location: ${formData.location}`,
                };

                await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "kit19-Auth-Key": authKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
            }

            setSuccess(true);

            // Auto-close after success message
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
                setFormData({ name: "", phone: "", location: city || "" });
            }, 2500);

        } catch (error) {
            console.error("Form submission error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6 rounded-xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center text-[#0a2351]">
                        {success ? "Request Received! 🎉" : `Get Free Site Visit in ${formData.location}`}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {success
                            ? "Our expert will call you shortly to schedule the visit."
                            : "Enter your details below to schedule a free solar feasibility check at your home."}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <p className="text-gray-600 font-medium">Thank you, {formData.name}!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-5 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold">WhatsApp Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter WhatsApp number"
                                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-semibold">Location / City</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="location"
                                    placeholder="Your City/Area"
                                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity mt-2"
                        >
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Schedule Free Visit"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
