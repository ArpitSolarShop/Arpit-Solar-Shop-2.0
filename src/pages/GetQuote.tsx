// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Sun, ArrowLeft } from "lucide-react";
// import { Link } from "react-router-dom";

// // Reusable form component for embedding into a modal or page
// export const GetQuoteForm = ({
//   compact = false,
//   showHeader = true,
// }: {
//   compact?: boolean;
//   showHeader?: boolean;
// }) => {
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     entity_type: "",
//     solution_classification: "",
//     estimated_area_sqft: "",
//     monthly_bill: "",
//     power_demand_kw: "",
//     project_location: "",
//     referral_name: "",
//     referral_phone: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const insertData = {
//         name: formData.name,
//         phone: formData.phone,
//         email: formData.email || null,
//         entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
//         solution_classification:
//           (formData.solution_classification as
//             | "Residential"
//             | "Commercial"
//             | "Commercial and industrial DG"
//             | "BIPv"
//             | "Utility-scale") || null,
//         estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
//         monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
//         power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
//         project_location: formData.project_location || null,
//         referral_name: formData.referral_name || null,
//         referral_phone: formData.referral_phone || null,
//         source: "Quote Form" as const,
//         customer_type: formData.entity_type === 'Individual' ? 'residential' : formData.entity_type ? 'commercial' : null,
//       };

//       const { error } = await supabase.from("solar_quote_requests").insert(insertData);

//       if (error) throw error;

//       toast({
//         title: "Quote Request Submitted!",
//         description: "Our team will contact you within 24 hours to discuss your solar solution.",
//       });

//       // Reset form
//       setFormData({
//         name: "",
//         phone: "",
//         email: "",
//         entity_type: "",
//         solution_classification: "",
//         estimated_area_sqft: "",
//         monthly_bill: "",
//         power_demand_kw: "",
//         project_location: "",
//         referral_name: "",
//         referral_phone: "",
//       });
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       toast({
//         title: "Error",
//         description: `Failed to submit quote request. Details: ${(error as any).message}`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const isFrameless = compact && !showHeader;

//   return (
//     <Card className={isFrameless ? "bg-transparent shadow-none border-0" : "card-shadow"}>
//       {showHeader && (
//         <CardHeader className={compact ? "py-3" : undefined}>
//           <CardTitle className={compact ? "text-xl" : undefined}>Solar Solution Information</CardTitle>
//           <CardDescription className={compact ? "text-xs" : undefined}>
//             Please provide accurate information to help us create the best solar solution for you
//           </CardDescription>
//         </CardHeader>
//       )}
//       <CardContent className={isFrameless ? "p-0" : compact ? "pt-4" : undefined}>
//         <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-6"}>
//           {/* Personal Information */}
//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="name" className="text-sm font-medium">
//                 Full Name *
//               </Label>
//               <Input
//                 id="name"
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 placeholder="Enter your full name"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone" className="text-sm font-medium">
//                 Phone Number *
//               </Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 required
//                 value={formData.phone}
//                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                 placeholder="+91 98765 43210"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//           </div>

//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 placeholder="your.email@example.com"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="entity_type" className="text-sm font-medium">
//                 Entity Type
//               </Label>
//               <Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}>
//                 <SelectTrigger className={compact ? "h-10" : "h-11"}>
//                   <SelectValue placeholder="Select entity type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Individual">Individual</SelectItem>
//                   <SelectItem value="Enterprise">Enterprise</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Project Details */}
//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="solution_classification" className="text-sm font-medium">
//                 Solution Type
//               </Label>
//               <Select
//                 value={formData.solution_classification}
//                 onValueChange={(value) => handleInputChange("solution_classification", value)}
//               >
//                 <SelectTrigger className={compact ? "h-10" : "h-11"}>
//                   <SelectValue placeholder="Select solution type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Residential">Residential</SelectItem>
//                   <SelectItem value="Commercial">Commercial</SelectItem>
//                   <SelectItem value="Commercial and industrial DG">Commercial and Industrial DG</SelectItem>
//                   <SelectItem value="BIPv">BIPV</SelectItem>
//                   <SelectItem value="Utility-scale">Utility-scale</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="estimated_area_sqft" className="text-sm font-medium">
//                 Installation Area (sq ft)
//               </Label>
//               <Input
//                 id="estimated_area_sqft"
//                 type="number"
//                 value={formData.estimated_area_sqft}
//                 onChange={(e) => handleInputChange("estimated_area_sqft", e.target.value)}
//                 placeholder="e.g. 1000"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//           </div>

//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="monthly_bill" className="text-sm font-medium">
//                 Monthly Electricity Bill (₹)
//               </Label>
//               <Input
//                 id="monthly_bill"
//                 type="number"
//                 value={formData.monthly_bill}
//                 onChange={(e) => handleInputChange("monthly_bill", e.target.value)}
//                 placeholder="e.g. 5000"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="power_demand_kw" className="text-sm font-medium">
//                 Power Demand (kW)
//               </Label>
//               <Input
//                 id="power_demand_kw"
//                 type="number"
//                 value={formData.power_demand_kw}
//                 onChange={(e) => handleInputChange("power_demand_kw", e.target.value)}
//                 placeholder="e.g. 5"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="project_location" className="text-sm font-medium">
//               Project Location
//             </Label>
//             <Input
//               id="project_location"
//               type="text"
//               value={formData.project_location}
//               onChange={(e) => handleInputChange("project_location", e.target.value)}
//               placeholder="City, State"
//               className={compact ? "h-10" : "h-11"}
//             />
//           </div>

//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="referral_name" className="text-sm font-medium">
//                 Referral Name (Optional)
//               </Label>
//               <Input
//                 id="referral_name"
//                 type="text"
//                 value={formData.referral_name}
//                 onChange={(e) => handleInputChange("referral_name", e.target.value)}
//                 placeholder="Name of person who referred you"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="referral_phone" className="text-sm font-medium">
//                 Referral Phone Number (Optional)
//               </Label>
//               <Input
//                 id="referral_phone"
//                 type="tel"
//                 value={formData.referral_phone}
//                 onChange={(e) => handleInputChange("referral_phone", e.target.value)}
//                 placeholder="+91 98765 43210"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className={compact ? "pt-3" : "pt-4"}>
//             <Button
//               type="submit"
//               disabled={loading || !formData.name || !formData.phone}
//               className={`w-full sunset-gradient text-white font-semibold ${
//                 compact ? "h-10 text-base" : "h-12 text-lg"
//               }`}
//             >
//               {loading ? "Submitting..." : "Get My Free Quote"}
//             </Button>
//             <p
//               className={`text-center mt-3 ${
//                 compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"
//               }`}
//             >
//               By submitting this form, you agree to our terms of service and privacy policy
//             </p>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// // Main page component
// const GetQuote = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-solar-blue/5 to-solar-orange/5 py-20">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center text-solar-orange hover:text-solar-gold transition-colors mb-4">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Link>
//           <div className="flex justify-center mb-4">
//             {/* THIS IS THE UPDATED PART WITH YOUR LOGO */}
//             <img 
//               src="/logo.png" 
//               alt="Company Logo" 
//               className="h-16 w-auto" 
//             />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Get Your Free Solar Quote</h1>
//           <p className="text-lg text-muted-foreground">
//             Fill out this form and our solar experts will design a custom solution for your needs
//           </p>
//         </div>

//         {/* Form */}
//         <GetQuoteForm />
//       </div>
//     </div>
//   );
// };

// export default GetQuote;















// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { ArrowLeft, Phone } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// // ✨ --- START: TYPES BASED ON YOUR DATABASE SCHEMA ---
// // Note: It's a good practice to move these types to a separate file (e.g., src/types.ts)

// // Describes the shape of the data for a quote request to be inserted
// export type SolarQuoteRequest = {
//   id?: string; // uuid is a string in TypeScript, optional on insert
//   name: string | null;
//   phone: string | null;
//   email: string | null;
//   entity_type: "Individual" | "Enterprise" | null;
//   solution_classification: string | null;
//   monthly_bill: number | null;
//   power_demand_kw: number | null;
//   project_location: string | null;
//   product_name: string | null;
//   product_category: string | null;
//   mounting_type: string | null;
//   referral_name: string | null;
//   referral_phone: string | null;
//   source: string | null;
//   customer_type: string | null;
//   created_at?: string; // Optional on insert
// };

// // A general type for all your product system tables
// export type ProductSystem = {
//   id?: number | string; // To handle both 'id' and 'sl_no' from different tables
//   sl_no?: number;
//   system_size?: number;
//   system_size_kwp?: number;
//   phase?: string;
// };

// // ✨ --- END: TYPES ---


// // Utility to parse UTM parameters from URL
// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// // Terms of Service Content
// const TermsOfService = () => (
//   <div className="space-y-4">
//     <h2 className="text-2xl font-bold">Terms of Service</h2>
//     <p><strong>Last Updated: September 25, 2025</strong></p>
//     <p>Welcome to Arpit Solar Shop ("we," "us," or "our"), a provider of solar energy solutions. These Terms of Service ("Terms") govern your use of our website and services.</p>
//     {/* ... full terms content ... */}
//   </div>
// );

// // Privacy Policy Content
// const PrivacyPolicy = () => (
//   <div className="space-y-4">
//     <h2 className="text-2xl font-bold">Privacy Policy</h2>
//     <p><strong>Last Updated: September 25, 2025</strong></p>
//     <p>At Arpit Solar Shop, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
//     {/* ... full privacy policy content ... */}
//   </div>
// );

// // Reusable form component
// export const GetQuoteForm = ({ compact = false, showHeader = true }: { compact?: boolean; showHeader?: boolean }) => {
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [consent, setConsent] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "", phone: "", email: "", project_location: "", entity_type: "", solution_classification: "",
//     monthly_bill: "", selected_product_id: "", mounting_type: "", referral_name: "", referral_phone: "",
//   });

//   const [productCategory, setProductCategory] = useState("");
//   // ✨ CHANGED: Used the specific ProductSystem type instead of 'any[]'
//   const [availableSystems, setAvailableSystems] = useState<ProductSystem[]>([]);
//   // ✨ CHANGED: Used the specific ProductSystem type for all product arrays
//   const [allProducts, setAllProducts] = useState<{
//     tata: ProductSystem[];
//     shakti: ProductSystem[];
//     reliance: ProductSystem[];
//     reliance_large: ProductSystem[];
//   }>({
//     tata: [], shakti: [], reliance: [], reliance_large: [],
//   });

//   const isInitialRender = useRef(true);
//   const query = useQuery();
//   const utmSource = query.get("utm_source") || "";
//   const utmCampaign = query.get("utm_campaign") || "";
//   const defaultSource = "GeneralQuoteForm";
//   const source = utmSource ? `${utmSource}_${utmCampaign || defaultSource}` : defaultSource;

//   useEffect(() => {
//     const fetchAllProducts = async () => {
//       try {
//         // ✨ CHANGED: Added .returns<ProductSystem[]>() to tell Supabase what type to expect, improving type safety.
//         const [tata, shakti, reliance, relianceLarge] = await Promise.all([
//           supabase.from("tata_grid_tie_systems").select("sl_no, system_size, phase").returns<ProductSystem[]>(),
//           supabase.from("shakti_grid_tie_systems").select("sl_no, system_size, phase").returns<ProductSystem[]>(),
//           supabase.from("reliance_grid_tie_systems").select("id, system_size, phase").returns<ProductSystem[]>(),
//           supabase.from("reliance_large_systems").select("id, system_size_kwp, phase").returns<ProductSystem[]>(),
//         ]);

//         if (tata.error) throw tata.error;
//         if (shakti.error) throw shakti.error;
//         if (reliance.error) throw reliance.error;
//         if (relianceLarge.error) throw relianceLarge.error;

//         setAllProducts({
//           tata: tata.data || [], shakti: shakti.data || [],
//           reliance: reliance.data || [], reliance_large: relianceLarge.data || [],
//         });
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         toast({ title: "Error", description: "Could not load product data.", variant: "destructive" });
//       }
//     };
//     fetchAllProducts();
//   }, []); // ✨ CHANGED: Dependency array is now empty to ensure this runs only once.

//   const isCommercial = ["Commercial", "BIPv", "Utility-scale"].includes(formData.solution_classification);

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   useEffect(() => {
//     if (isCommercial && productCategory && productCategory !== "Reliance") {
//       setProductCategory("Reliance");
//     }
//   }, [formData.solution_classification, productCategory, isCommercial]);

//   useEffect(() => {
//     if (isInitialRender.current) {
//       isInitialRender.current = false;
//       return;
//     }
//     if (formData.solution_classification === "Residential") {
//       handleInputChange("mounting_type", "Rooftop");
//     } else {
//       handleInputChange("mounting_type", "");
//     }
//   }, [formData.solution_classification]);

//   useEffect(() => {
//     let systems: ProductSystem[] = [];
//     if (productCategory === "Tata") systems = allProducts.tata;
//     else if (productCategory === "Shakti") systems = allProducts.shakti;
//     else if (productCategory === "Reliance") {
//       systems = isCommercial ? allProducts.reliance_large : allProducts.reliance;
//     }
//     const sortedSystems = systems.sort((a, b) =>
//       (a.system_size || a.system_size_kwp || 0) - (b.system_size || b.system_size_kwp || 0)
//     );
//     setAvailableSystems(sortedSystems);
//     if (productCategory) {
//         handleInputChange("selected_product_id", "");
//     }
//   }, [productCategory, isCommercial, allProducts]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//         !formData.project_location || !formData.solution_classification || !productCategory ||
//         !formData.selected_product_id || !formData.mounting_type
//     ) {
//         toast({
//             title: "Missing Information",
//             description: "Please fill out all required fields marked with an asterisk (*).",
//             variant: "destructive",
//         });
//         return;
//     }
//     if (!consent) {
//       toast({ title: "Consent Required", description: "Please agree to the terms and privacy policy.", variant: "destructive" });
//       return;
//     }
//     if (!/^\+?[1-9]\d{9,14}$/.test(formData.phone)) {
//       toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
//       return;
//     }
//     setLoading(true);

//     try {
//       const selectedSystem = availableSystems.find(p => String(p.id || p.sl_no) === formData.selected_product_id);
//       const powerDemandKw = selectedSystem ? (selectedSystem.system_size || selectedSystem.system_size_kwp) : null;
//       const formattedPhase = formatPhase(selectedSystem?.phase, false);

//       let productNameForDb = selectedSystem
//         ? `${productCategory} - ${powerDemandKw} kWp (${formattedPhase || 'N/A'})`
//         : null;

//       if (productNameForDb && isCommercial && formData.mounting_type) {
//         productNameForDb += ` - ${formData.mounting_type}`;
//       }

//       // ✨ CHANGED: This object is now perfectly typed to match your database schema, ensuring all data is sent correctly.
//       const insertData: SolarQuoteRequest = {
//         name: formData.name || null,
//         phone: formData.phone || null,
//         email: formData.email || null,
//         project_location: formData.project_location || null,
//         entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
//         solution_classification: formData.solution_classification || null,
//         monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
//         power_demand_kw: powerDemandKw,
//         product_category: productCategory || null,
//         product_name: productNameForDb,
//         mounting_type: formData.mounting_type || null,
//         referral_name: formData.referral_name || null,
//         referral_phone: formData.referral_phone || null,
//         source: source,
//         customer_type: formData.entity_type === "Individual" ? "residential" : formData.entity_type === "Enterprise" ? "commercial" : null,
//       };

//       // ✨ CHANGED: This Supabase call is now fully type-safe.
//       const { error } = await supabase.from("solar_quote_requests").insert(insertData);
//       if (error) throw error;

//       // Secondary "fire-and-forget" submission
//       try {
//         await fetch('https://solar-quote-server.onrender.com/generate-quote', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(insertData),
//         });
//       } catch (err) {
//         console.warn("Secondary server submission failed:", err);
//       }

//       toast({ title: "Quote Request Submitted! 🎉", description: "Our team will contact you within 24 hours." });
//       setFormData({ name: "", phone: "", email: "", project_location: "", entity_type: "", solution_classification: "", monthly_bill: "", selected_product_id: "", mounting_type: "", referral_name: "", referral_phone: "" });
//       setProductCategory("");
//       setConsent(false);
//     } catch (error) {
//       console.error("Error submitting quote:", error);
//       toast({ title: "Error", description: `Failed to submit quote. Details: ${(error as any).message}`, variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const productCategories = isCommercial
//     ? [{ value: "Reliance", label: "Reliance" }]
//     : [{ value: "Tata", label: "Tata" }, { value: "Shakti", label: "Shakti" }, { value: "Reliance", label: "Reliance" }];

//   const residentialMountingTypes = [
//     { value: "Rooftop", label: "Rooftop" }, { value: "Ground Mount", label: "Ground Mount" },
//     { value: "Carport", label: "Carport" }, { value: "Tin Shed", label: "Tin Shed" },
//   ];
//   const commercialMountingTypes = [
//     { value: "Tin Shed", label: "Tin Shed (Short Rail)" },
//     { value: "RCC Elevated", label: "RCC (HDG Elevated)" },
//     { value: "Pre GI MMS", label: "Pre GI MMS" },
//     { value: "Without MMS", label: "Without MMS" },
//   ];
//   const mountingTypes = isCommercial ? commercialMountingTypes : residentialMountingTypes;

//   const formatPhase = (phase: string | undefined, includeSeparator: boolean = true) => {
//     if (!phase) return '';
//     const separator = includeSeparator ? ' - ' : '';
//     const lowerPhase = String(phase).toLowerCase();
//     if (lowerPhase.includes('single') || lowerPhase.includes('1')) {
//       return `${separator}Single Phase`;
//     }
//     if (lowerPhase.includes('three') || lowerPhase.includes('3')) {
//       return `${separator}Three Phase`;
//     }
//     return `${separator}${phase}`;
//   };

//   const isSubmitDisabled = loading || !formData.name || !formData.phone || !consent ||
//                            !formData.project_location || !formData.solution_classification ||
//                            !productCategory || !formData.selected_product_id || !formData.mounting_type;

//   return (
//     <Card className="card-shadow">
//       {showHeader && (
//         <CardHeader>
//           <CardTitle>Get Your Free Solar Quote</CardTitle>
//           <CardDescription>Provide your details to get a customized solar solution.</CardDescription>
//         </CardHeader>
//       )}
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Form JSX is unchanged... */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label><Input id="name" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" /></div>
//             <div className="space-y-2"><Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label><Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" /></div>
//             <div className="space-y-2"><Label htmlFor="project_location">Project Location <span className="text-red-500">*</span></Label><Input id="project_location" value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" /></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="entity_type">Entity Type</Label><Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}><SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent></Select></div>
//             <div className="space-y-2"><Label htmlFor="monthly_bill">Monthly Electricity Bill (₹)</Label><Input id="monthly_bill" type="number" value={formData.monthly_bill} onChange={(e) => handleInputChange("monthly_bill", e.target.value)} placeholder="e.g. 5000" /></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="solution_classification">Solution Type <span className="text-red-500">*</span></Label><Select value={formData.solution_classification} onValueChange={(value) => handleInputChange("solution_classification", value)}><SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger><SelectContent><SelectItem value="Residential">Residential</SelectItem><SelectItem value="Commercial">Commercial</SelectItem><SelectItem value="BIPv">BIPV</SelectItem><SelectItem value="Utility-scale">Utility-scale</SelectItem></SelectContent></Select></div>
//             <div className="space-y-2"><Label htmlFor="product_category">Product Category <span className="text-red-500">*</span></Label><Select value={productCategory} onValueChange={setProductCategory}><SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger><SelectContent>{productCategories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="selected_product_id">System Size (kWp) <span className="text-red-500">*</span></Label><Select value={formData.selected_product_id} onValueChange={(value) => handleInputChange("selected_product_id", value)} disabled={!productCategory || availableSystems.length === 0}><SelectTrigger><SelectValue placeholder={!productCategory ? "First select a brand" : "Select system size"} /></SelectTrigger><SelectContent>{availableSystems.map((system) => (<SelectItem key={system.id || system.sl_no} value={String(system.id || system.sl_no)}>{(system.system_size || system.system_size_kwp)} kWp{formatPhase(system.phase)}</SelectItem>))}</SelectContent></Select></div>
//             <div className="space-y-2"><Label htmlFor="mounting_type">Mounting Type <span className="text-red-500">*</span></Label><Select value={formData.mounting_type} onValueChange={(value) => handleInputChange("mounting_type", value)}><SelectTrigger><SelectValue placeholder="Select mounting type" /></SelectTrigger><SelectContent>{mountingTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2"><Label htmlFor="referral_name">Referral Name (Optional)</Label><Input id="referral_name" value={formData.referral_name} onChange={(e) => handleInputChange("referral_name", e.target.value)} placeholder="Referred by..." /></div>
//             <div className="space-y-2"><Label htmlFor="referral_phone">Referral Phone (Optional)</Label><Input id="referral_phone" type="tel" value={formData.referral_phone} onChange={(e) => handleInputChange("referral_phone", e.target.value)} placeholder="+91 98765 43210" /></div>
//           </div>
//           <div className="flex items-center space-x-2 pt-2">
//             <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} />
//             <Label htmlFor="consent" className="text-sm font-medium">I agree to the <Dialog><DialogTrigger asChild><span className="text-solar-orange hover:underline cursor-pointer">terms of service</span></DialogTrigger><DialogContent className="max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Terms of Service</DialogTitle></DialogHeader><TermsOfService /></DialogContent></Dialog> and <Dialog><DialogTrigger asChild><span className="text-solar-orange hover:underline cursor-pointer">privacy policy</span></DialogTrigger><DialogContent className="max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>Privacy Policy</DialogTitle></DialogHeader><PrivacyPolicy /></DialogContent></Dialog></Label>
//           </div>
//           <div className="pt-4">
//             <Button type="submit" disabled={isSubmitDisabled} className="w-full sunset-gradient text-white font-semibold h-12 text-lg transition-transform duration-200 hover:scale-105">
//               {loading ? "Submitting..." : "Get My Free Quote"}
//             </Button>
//             <div className="text-center my-4"><Button variant="outline" asChild className="border-solar-orange text-solar-orange hover:bg-solar-orange/10 hover:text-solar-orange transition-colors"><a href="tel:+919044555572"><Phone className="w-4 h-4 mr-2" />Have Questions? Call a Solar Expert</a></Button></div>
//             <p className="text-center text-sm text-muted-foreground">By submitting this form, you agree to our terms and policies.</p>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// // Main page component
// const GetQuote = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-solar-blue/5 to-solar-orange/5 py-12 sm:py-20">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center text-solar-orange hover:text-solar-gold transition-colors mb-4">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Link>
//           <div className="flex justify-center mb-4">
//             <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Unlock Your Solar Potential</h1>
//           <p className="text-lg text-muted-foreground">
//             Our experts will design a custom solar solution perfect for your needs.
//           </p>
//         </div>
//         <GetQuoteForm />
//       </div>
//     </div>
//   );
// };

// export default GetQuote;















import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// ✨ --- START: TYPES BASED ON YOUR DATABASE SCHEMA ---
export type SolarQuoteRequest = {
  id?: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  entity_type: "Individual" | "Enterprise" | null;
  solution_classification: string | null;
  monthly_bill: number | null;
  power_demand_kw: number | null;
  project_location: string | null;
  product_name: string | null;
  product_category: string | null;
  mounting_type: string | null;
  referral_name: string | null;
  referral_phone: string | null;
  source: string | null;
  customer_type: string | null;
  created_at?: string;
};

export type ProductSystem = {
  id?: number | string;
  sl_no?: number;
  system_size?: number;
  system_size_kwp?: number;
  phase?: string;
};

// ✨ --- END: TYPES ---

// Utility to parse UTM parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Terms of Service Content
const TermsOfService = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Terms of Service</h2>
    <p><strong>Last Updated: September 25, 2025</strong></p>
    <p>Welcome to Arpit Solar Shop ("we," "us," or "our"), a provider of solar energy solutions. These Terms of Service ("Terms") govern your use of our website and services.</p>
    {/* ... full terms content ... */}
  </div>
);

// Privacy Policy Content
const PrivacyPolicy = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Privacy Policy</h2>
    <p><strong>Last Updated: September 25, 2025</strong></p>
    <p>At Arpit Solar Shop, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
    {/* ... full privacy policy content ... */}
  </div>
);

// Reusable form component
export const GetQuoteForm = ({ compact = false, showHeader = true }: { compact?: boolean; showHeader?: boolean }) => {
  const { toast } = useToast();
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
  const query = useQuery();
  const utmSource = query.get("utm_source") || "";
  const utmCampaign = query.get("utm_campaign") || "";
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
  }, []);

  const isCommercial = ["Commercial", "BIPv", "Utility-scale"].includes(formData.solution_classification);

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

// Main page component
const GetQuote = () => {
  // Inject Google Tag Manager scripts
  useEffect(() => {
    // Add GTM script to head
    const script = document.createElement("script");
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-P6MMPXV6');`;
    document.head.appendChild(script);

    // Add GTM noscript to body
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P6MMPXV6"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(noscript);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-solar-blue/5 to-solar-orange/5 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-solar-orange hover:text-solar-gold transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Unlock Your Solar Potential</h1>
          <p className="text-lg text-muted-foreground">
            Our experts will design a custom solar solution perfect for your needs.
          </p>
        </div>
        <GetQuoteForm />
      </div>
    </div>
  );
};

export default GetQuote;
