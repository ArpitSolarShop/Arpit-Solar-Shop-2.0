"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CheckCircle, AlertCircle, Zap } from "lucide-react"

export type QuoteCategory = "Tata" | "Reliance" | "Shakti" | "Hybrid" | "Integrated" | "Generic" | "Calculator";

interface UniversalQuoteFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: QuoteCategory;
    productDetails?: {
        name?: string;
        description?: string;
        systemSize?: number | null;
        price?: number;
        phase?: string;
        image?: string;
        // Hybrid specific
        battery_kwh?: number | null;
        variant?: 'WITH_BATTERY' | 'WOBB';
        // Integrated specific
        brand?: string;
        module_type?: string;
        // Reliance specific
        mountingType?: string;
        dcCables?: string;
    };
    config?: {
        title?: string;
        description?: string;
        logo?: string;
        features?: string[];
    };
}

const UniversalQuoteForm = ({
    open,
    onOpenChange,
    category,
    productDetails,
    config,
    mode = "modal" // "modal" or "embedded"
}: UniversalQuoteFormProps & { mode?: "modal" | "embedded" }) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        entity_type: "",
        solution_classification: "Residential", // Default
        estimated_area_sqft: "",
        monthly_bill: "",
        power_demand_kw: "",
        project_location: "",
        referral_name: "",
        referral_phone: "",
        // Specifics
        phase: "Three", // Default for Tata mainly
        cables: "",
    })

    // Pre-fill / Reset logic
    useEffect(() => {
        if (open || mode === "embedded") {
            setFormData(prev => ({
                ...prev,
                power_demand_kw: productDetails?.systemSize ? String(productDetails.systemSize) : prev.power_demand_kw,
                phase: productDetails?.phase || "Three",
                cables: productDetails?.dcCables || "",
            }))
        }
    }, [open, productDetails, mode])

    const validateForm = () => {
        const phoneRegex = /^[6-9]\d{9}$/
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.name) return "Name is required"
        if (!formData.phone || !phoneRegex.test(formData.phone)) return "Valid phone number is required (10 digits starting 6-9)"
        if (!formData.project_location) return "Project location is required"
        // if (formData.email && !emailRegex.test(formData.email)) return "Invalid email format"
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const error = validateForm()
        if (error) {
            toast({ title: "Validation Error", description: error, variant: "destructive" })
            setLoading(false)
            return
        }

        try {
            // 1. Construct Payloads
            // Common basic payload for Supabase
            const dbPayload: any = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                entity_type: formData.entity_type || null,
                solution_classification: formData.solution_classification || null,
                estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
                monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
                power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
                project_location: formData.project_location,
                referral_name: formData.referral_name || null,
                referral_phone: formData.referral_phone || null,
                product_category: category,
                product_name: productDetails?.name || `${category} Solar Product`,
                source: `${category} Quote Form`,
                customer_type: formData.entity_type === "Individual" ? "residential" : "commercial",
                referral_source: formData.referral_name ? "referral" : null,
            }

            // Add specific fields to DB payload if they exist in schema (Assuming simplified schema for now or relying on loose inputs)
            // Note: If schema doesn't have these, Supabase might reject. We'll wrap in try/catch.
            if (productDetails?.mountingType) dbPayload.mounting_type = productDetails.mountingType;

            // 2. Insert to Supabase - REMOVED to avoid double submission and schema errors.
            // The API route /api/generate-quote handles the database insertion securely.
            /*
            try {
                const { error: dbErr } = await supabase.from('solar_quote_requests').insert(dbPayload);
                if (dbErr) {
                    console.warn("Supabase Insert Warning (non-fatal):", dbErr.message);
                }
            } catch (err) {
                console.error("Supabase Fatal:", err);
            }
            */

            // 3. Construct API Payload (Richer data)
            const apiPayload = {
                ...dbPayload,
                // Enriched fields for API / PDF
                phase: formData.phase, // Important for Tata
                brand: productDetails?.brand, // Important for Integrated
                cables: formData.cables,
                additional_details: {
                    ...productDetails
                }
            }

            // 4. Send to API Endpoint
            try {
                const res = await fetch('/api/generate-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(apiPayload)
                });
                if (!res.ok) throw new Error(await res.text());
            } catch (apiErr) {
                console.error("API Error:", apiErr);
                // We continue to CRM even if PDF fails? Yes, lead capture is priority.
            }

            // 5. Send to CRM (Kit19)
            try {
                const crmPayload = {
                    PersonName: formData.name,
                    MobileNo: formData.phone,
                    EmailID: formData.email || "",
                    City: formData.project_location,
                    SourceName: dbPayload.source,
                    CampaignName: dbPayload.product_name,
                    InitialRemarks: `Category: ${category} | Size: ${formData.power_demand_kw}kW | Phase: ${formData.phase}`,
                    CountryCode: '+91'
                };

                await fetch('https://sipapi.kit19.com/Enquiry/Add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'kit19-Auth-Key': '4e7bb26557334f91a21e56a4ea9c8752' },
                    body: JSON.stringify(crmPayload)
                });
            } catch (crmErr) {
                console.error("CRM Error:", crmErr);
            }

            // Success UI
            toast({
                title: "Quote Request Submitted!",
                description: "Our team will contact you shortly. You may receive a quote on WhatsApp.",
            })
            if (mode === "modal" && onOpenChange) {
                onOpenChange(false);
            }
            setFormData(prev => ({ ...prev, name: "", phone: "", email: "", project_location: "", monthly_bill: "" })); // Partial reset

        } catch (e: any) {
            toast({ title: "Error", description: e.message || "Something went wrong", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // --- UI Helpers ---
    const isLargeSystem = (parseFloat(formData.power_demand_kw) || 0) > 15;
    const logoSrc = config?.logo || (category === "Tata" ? "/Tata Power Solar.png" : category === "Reliance" ? "/reliance-industries-ltd.png" : category === "Shakti" ? "/Shakti Solar.png" : category === "Hybrid" ? "/Hybrid.png" : "/logo.png");

    const FormContent = (
        <div className={mode === "embedded" ? "w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6" : ""}>
            {/* Header Content - Render always if embedded, or if modal */}
            <div className={mode === "modal" ? "max-w-4xl max-h-[90vh] overflow-y-auto bg-white" : ""}>
                <div className="relative">
                    <div className="flex justify-center mb-4">
                        <img src={logoSrc} alt={`${category} Solar`} className="h-16 w-auto object-contain" />
                    </div>

                    <div className="text-center mb-4">
                        {mode === "embedded" && (
                            <h2 className="text-2xl font-bold text-gray-900">
                                {config?.title || `${category} Solar Quote`}
                            </h2>
                        )}
                        <p className="text-base text-gray-600">
                            {config?.description || "Get a personalized solar energy solution quote."}
                        </p>
                    </div>

                    {isLargeSystem && (
                        <Alert className="mb-4 border-blue-300 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-700" />
                            <AlertDescription className="text-blue-800">
                                <strong>Large Scale Project:</strong> Connecting you with our commercial solar experts for customized pricing.
                            </AlertDescription>
                        </Alert>
                    )}

                    {productDetails?.name && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-yellow-600" />
                                <span className="font-semibold text-gray-800">Selected Product:</span>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                                {productDetails.name}
                            </Badge>
                            {productDetails.description && <p className="text-sm text-gray-700 mt-2">{productDetails.description}</p>}
                            {category === "Hybrid" && productDetails.variant === 'WITH_BATTERY' && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Battery Backup Included</span>
                            )}
                        </div>
                    )}
                </div>

                <Card className="border-0 shadow-none">
                    {config?.features && (
                        <CardHeader className="px-0 pb-4">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
                                {config.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </CardHeader>
                    )}

                    <CardContent className="px-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input id="name" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Full Name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} placeholder="9876543210" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="email@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project_location">Project Location *</Label>
                                    <Input id="project_location" value={formData.project_location} onChange={e => handleInputChange("project_location", e.target.value)} placeholder="City, State" required />
                                </div>
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="power_demand_kw">System Size (kW)</Label>
                                <Input id="power_demand_kw" type="number" step="0.01" min="0" value={formData.power_demand_kw} onChange={e => handleInputChange("power_demand_kw", e.target.value)} placeholder="e.g. 3.5" />
                            </div>


                            {/* Referral */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="referral_name" className="text-gray-500">Referral Name (Optional)</Label>
                                    <Input id="referral_name" value={formData.referral_name} onChange={e => handleInputChange("referral_name", e.target.value)} placeholder="Who referred you?" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="referral_phone" className="text-gray-500">Referral Phone (Optional)</Label>
                                    <Input id="referral_phone" value={formData.referral_phone} onChange={e => handleInputChange("referral_phone", e.target.value)} placeholder="Their number" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg" disabled={loading}>
                                {loading ? "Submitting..." : `Get My ${category} Quote`}
                            </Button>
                            <p className="text-xs text-center text-gray-500">By submitting, you agree to receive a call/message from our team.</p>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (mode === "modal") {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                            {config?.title || `${category} Solar Quote`}
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600 text-center">
                            {config?.description || "Get a personalized solar energy solution quote."}
                        </DialogDescription>
                    </DialogHeader>
                    {FormContent}
                </DialogContent>
            </Dialog>
        )
    }

    return FormContent;
}

export default UniversalQuoteForm;
