/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";
import { SolarQuoteRequest, ProductSystem } from "@/types/solar";

// Terms of Service Content
const TermsOfService = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Terms of Service</h2>
        <p><strong>Last Updated: September 25, 2025</strong></p>
        <p>Welcome to Arpit Solar Shop ("we," "us," or "our"), a provider of solar energy solutions. These Terms of Service ("Terms") govern your use of our website and services.</p>
        {/* Additional terms content can be added here */}
    </div>
);

// Privacy Policy Content
const PrivacyPolicy = () => (
    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Privacy Policy</h2>
        <p><strong>Last Updated: September 25, 2025</strong></p>
        <p>At Arpit Solar Shop, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
        {/* Additional privacy content can be added here */}
    </div>
);

export const GetQuoteForm = ({ compact = false, showHeader = true }: { compact?: boolean; showHeader?: boolean }) => {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const [formData, setFormData] = useState({
        name: "", phone: "", email: "", project_location: "", entity_type: "", solution_classification: "",
        monthly_bill: "", selected_product_id: "", mounting_type: "", referral_name: "", referral_phone: "",
    });

    const [productCategory, setProductCategory] = useState("");
    const [availableSystems, setAvailableSystems] = useState<ProductSystem[]>([]);
    const [allProducts, setAllProducts] = useState<{
        tata: ProductSystem[];
        shakti: ProductSystem[];
        reliance: ProductSystem[];
        reliance_large: ProductSystem[];
    }>({
        tata: [], shakti: [], reliance: [], reliance_large: [],
    });

    const isInitialRender = useRef(true);

    // Parse UTM parameters
    const utmSource = searchParams.get("utm_source") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";
    const defaultSource = "GeneralQuoteForm";
    const source = utmSource ? `${utmSource}_${utmCampaign || defaultSource}` : defaultSource;

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const [tata, shakti, reliance, relianceLarge] = await Promise.all([
                    supabase.from("tata_grid_tie_systems").select("sl_no, system_size, phase").returns<ProductSystem[]>(),
                    supabase.from("shakti_grid_tie_systems").select("sl_no, system_size, phase").returns<ProductSystem[]>(),
                    supabase.from("reliance_grid_tie_systems").select("id, system_size, phase").returns<ProductSystem[]>(),
                    supabase.from("reliance_large_systems").select("id, system_size_kwp, phase").returns<ProductSystem[]>(),
                ]);

                if (tata.error) throw tata.error;
                if (shakti.error) throw shakti.error;
                if (reliance.error) throw reliance.error;
                if (relianceLarge.error) throw relianceLarge.error;

                setAllProducts({
                    tata: tata.data || [], shakti: shakti.data || [],
                    reliance: reliance.data || [], reliance_large: relianceLarge.data || [],
                });
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({ title: "Error", description: "Could not load product data.", variant: "destructive" });
            }
        };
        fetchAllProducts();
    }, [toast]);

    const isCommercial = formData.solution_classification ? ["Commercial", "BIPv", "Utility-scale"].includes(formData.solution_classification) : false;

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (isCommercial && productCategory && productCategory !== "Reliance") {
            setProductCategory("Reliance");
        }
    }, [formData.solution_classification, productCategory, isCommercial]);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (formData.solution_classification === "Residential") {
            handleInputChange("mounting_type", "Rooftop");
        } else {
            handleInputChange("mounting_type", "");
        }
    }, [formData.solution_classification]);

    useEffect(() => {
        let systems: ProductSystem[] = [];
        if (productCategory === "Tata") systems = allProducts.tata;
        else if (productCategory === "Shakti") systems = allProducts.shakti;
        else if (productCategory === "Reliance") {
            systems = isCommercial ? allProducts.reliance_large : allProducts.reliance;
        }
        const sortedSystems = systems.sort((a, b) =>
            (a.system_size || a.system_size_kwp || 0) - (b.system_size || b.system_size_kwp || 0)
        );
        setAvailableSystems(sortedSystems);
        if (productCategory) {
            handleInputChange("selected_product_id", "");
        }
    }, [productCategory, isCommercial, allProducts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.project_location || !formData.solution_classification || !productCategory ||
            !formData.selected_product_id || !formData.mounting_type
        ) {
            toast({
                title: "Missing Information",
                description: "Please fill out all required fields marked with an asterisk (*).",
                variant: "destructive",
            });
            return;
        }
        if (!consent) {
            toast({ title: "Consent Required", description: "Please agree to the terms and privacy policy.", variant: "destructive" });
            return;
        }
        if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone)) {
            toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
            return;
        }
        setLoading(true);

        try {
            const selectedSystem = availableSystems.find(p => String(p.id || p.sl_no) === formData.selected_product_id);
            const powerDemandKw = selectedSystem ? (selectedSystem.system_size || selectedSystem.system_size_kwp) : null;
            const formattedPhase = formatPhase(selectedSystem?.phase, false);

            let productNameForDb = selectedSystem
                ? `${productCategory} - ${powerDemandKw} kWp (${formattedPhase || 'N/A'})`
                : null;

            if (productNameForDb && isCommercial && formData.mounting_type) {
                productNameForDb += ` - ${formData.mounting_type}`;
            }

            const insertData: SolarQuoteRequest = {
                name: formData.name || null,
                phone: formData.phone || null,
                email: formData.email || null,
                project_location: formData.project_location || null,
                entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
                solution_classification: formData.solution_classification || null,
                monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
                power_demand_kw: powerDemandKw,
                product_category: productCategory || null,
                product_name: productNameForDb,
                mounting_type: formData.mounting_type || null,
                referral_name: formData.referral_name || null,
                referral_phone: formData.referral_phone || null,
                source: source,
                customer_type: formData.entity_type === "Individual" ? "residential" : formData.entity_type === "Enterprise" ? "commercial" : null,
            };

            const { error } = await supabase.from("solar_quote_requests").insert(insertData);
            if (error) throw error;

            try {
                await fetch('https://solar-quote-server.onrender.com/generate-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(insertData),
                });
            } catch (err) {
                console.warn("Secondary server submission failed:", err);
            }

            toast({ title: "Quote Request Submitted! 🎉", description: "Our team will contact you within 24 hours." });
            setFormData({ name: "", phone: "", email: "", project_location: "", entity_type: "", solution_classification: "", monthly_bill: "", selected_product_id: "", mounting_type: "", referral_name: "", referral_phone: "" });
            setProductCategory("");
            setConsent(false);
        } catch (error) {
            console.error("Error submitting quote:", error);
            toast({ title: "Error", description: `Failed to submit quote. Details: ${(error as any).message}`, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const productCategories = isCommercial
        ? [{ value: "Reliance", label: "Reliance" }]
        : [{ value: "Tata", label: "Tata" }, { value: "Shakti", label: "Shakti" }, { value: "Reliance", label: "Reliance" }];

    const residentialMountingTypes = [
        { value: "Rooftop", label: "Rooftop" }, { value: "Ground Mount", label: "Ground Mount" },
        { value: "Carport", label: "Carport" }, { value: "Tin Shed", label: "Tin Shed" },
    ];
    const commercialMountingTypes = [
        { value: "Tin Shed", label: "Tin Shed (Short Rail)" },
        { value: "RCC Elevated", label: "RCC (HDG Elevated)" },
        { value: "Pre GI MMS", label: "Pre GI MMS" },
        { value: "Without MMS", label: "Without MMS" },
    ];
    const mountingTypes = isCommercial ? commercialMountingTypes : residentialMountingTypes;

    const formatPhase = (phase: string | undefined, includeSeparator: boolean = true) => {
        if (!phase) return '';
        const separator = includeSeparator ? ' - ' : '';
        const lowerPhase = String(phase).toLowerCase();
        if (lowerPhase.includes('single') || lowerPhase.includes('1')) {
            return `${separator}Single Phase`;
        }
        if (lowerPhase.includes('three') || lowerPhase.includes('3')) {
            return `${separator}Three Phase`;
        }
        return `${separator}${phase}`;
    };

    const isSubmitDisabled = loading || !formData.name || !formData.phone || !consent ||
        !formData.project_location || !formData.solution_classification ||
        !productCategory || !formData.selected_product_id || !formData.mounting_type;

    return (
        <Card className="card-shadow">
            {showHeader && (
                <CardHeader>
                    <CardTitle>Get Your Free Solar Quote</CardTitle>
                    <CardDescription>Provide your details to get a customized solar solution.</CardDescription>
                </CardHeader>
            )}
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label><Input id="name" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" /></div>
                        <div className="space-y-2"><Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label><Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" /></div>
                        <div className="space-y-2"><Label htmlFor="project_location">Project Location <span className="text-red-500">*</span></Label><Input id="project_location" value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="entity_type">Entity Type</Label><Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}><SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="monthly_bill">Monthly Electricity Bill (₹)</Label><Input id="monthly_bill" type="number" value={formData.monthly_bill} onChange={(e) => handleInputChange("monthly_bill", e.target.value)} placeholder="e.g. 5000" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="solution_classification">Solution Type <span className="text-red-500">*</span></Label><Select value={formData.solution_classification} onValueChange={(value) => handleInputChange("solution_classification", value)}><SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger><SelectContent><SelectItem value="Residential">Residential</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="BIPv">BIPV</SelectItem><SelectItem value="Utility-scale">Utility-scale</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="product_category">Product Category <span className="text-red-500">*</span></Label><Select value={productCategory} onValueChange={setProductCategory}><SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger><SelectContent>{productCategories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="selected_product_id">System Size (kWp) <span className="text-red-500">*</span></Label><Select value={formData.selected_product_id} onValueChange={(value) => handleInputChange("selected_product_id", value)} disabled={!productCategory || availableSystems.length === 0}><SelectTrigger><SelectValue placeholder={!productCategory ? "First select a brand" : "Select system size"} /></SelectTrigger><SelectContent>{availableSystems.map((system) => (<SelectItem key={system.id || system.sl_no} value={String(system.id || system.sl_no)}>{(system.system_size || system.system_size_kwp)} kWp{formatPhase(system.phase)}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="mounting_type">Mounting Type <span className="text-red-500">*</span></Label><Select value={formData.mounting_type} onValueChange={(value) => handleInputChange("mounting_type", value)}><SelectTrigger><SelectValue placeholder="Select mounting type" /></SelectTrigger><SelectContent>{mountingTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label htmlFor="referral_name">Referral Name (Optional)</Label><Input id="referral_name" value={formData.referral_name} onChange={(e) => handleInputChange("referral_name", e.target.value)} placeholder="Referred by..." /></div>
                        <div className="space-y-2"><Label htmlFor="referral_phone">Referral Phone (Optional)</Label><Input id="referral_phone" type="tel" value={formData.referral_phone} onChange={(e) => handleInputChange("referral_phone", e.target.value)} placeholder="+91 98765 43210" /></div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} />
                        <Label htmlFor="consent" className="text-sm font-medium">I agree to the <Dialog><DialogTrigger asChild><span className="text-solar-orange hover:underline cursor-pointer">terms of service</span></DialogTrigger><DialogContent className="max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Terms of Service</DialogTitle></DialogHeader><TermsOfService /></DialogContent></Dialog> and <Dialog><DialogTrigger asChild><span className="text-solar-orange hover:underline cursor-pointer">privacy policy</span></DialogTrigger><DialogContent className="max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader><PrivacyPolicy /></DialogContent></Dialog></Label>
                    </div>
                    <div className="pt-4">
                        <Button type="submit" disabled={isSubmitDisabled} className="w-full sunset-gradient text-white font-semibold h-12 text-lg transition-transform duration-200 hover:scale-105">
                            {loading ? "Submitting..." : "Get My Free Quote"}
                        </Button>
                        <div className="text-center my-4"><Button variant="outline" asChild className="border-solar-orange text-solar-orange hover:bg-solar-orange/10 hover:text-solar-orange transition-colors"><a href="tel:+919044555572"><Phone className="w-4 h-4 mr-2" />Have Questions? Call a Solar Expert</a></Button></div>
                        <p className="text-center text-sm text-muted-foreground">By submitting this form, you agree to our terms and policies.</p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
