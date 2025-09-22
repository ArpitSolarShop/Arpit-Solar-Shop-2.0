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


















// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Sun, ArrowLeft } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// // Utility to parse UTM parameters from URL
// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

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
//   const [consent, setConsent] = useState(false);
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
//     product_name: "",
//     product_category: "",
//     mounting_type: "",
//   });
//   const query = useQuery();
//   const utmSource = query.get("utm_source") || "";
//   const utmCampaign = query.get("utm_campaign") || "";
//   const defaultSource = "GeneralQuoteForm";
//   const source = utmSource ? `${utmSource}_${utmCampaign || defaultSource}` : defaultSource;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!consent) {
//       toast({
//         title: "Consent Required",
//         description: "Please agree to the terms of service and privacy policy to submit the form.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
//       toast({
//         title: "Invalid Phone Number",
//         description: "Please enter a valid phone number (e.g., +919876543210).",
//         variant: "destructive",
//       });
//       return;
//     }
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
//         product_name: formData.product_name || null,
//         product_category: formData.product_category || null,
//         mounting_type: formData.mounting_type || null,
//         source,
//         customer_type: formData.entity_type === "Individual" ? "residential" : formData.entity_type ? "commercial" : null,
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
//         product_name: "",
//         product_category: "",
//         mounting_type: "",
//       });
//       setConsent(false);
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

//   const validateNumber = (value: string) => {
//     if (value && isNaN(Number(value))) {
//       toast({
//         title: "Invalid Input",
//         description: `Please enter a valid number for ${fieldLabelMap[field] || field}.`,
//         variant: "destructive",
//       });
//       return false;
//     }
//     return true;
//   };

//   const fieldLabelMap: { [key: string]: string } = {
//     estimated_area_sqft: "Installation Area",
//     monthly_bill: "Monthly Electricity Bill",
//     power_demand_kw: "Power Demand",
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
//                 onChange={(e) => validateNumber(e.target.value) && handleInputChange("estimated_area_sqft", e.target.value)}
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
//                 onChange={(e) => validateNumber(e.target.value) && handleInputChange("monthly_bill", e.target.value)}
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
//                 onChange={(e) => validateNumber(e.target.value) && handleInputChange("power_demand_kw", e.target.value)}
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

//           {/* New Fields for Ad Context */}
//           <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
//             <div className="space-y-2">
//               <Label htmlFor="product_name" className="text-sm font-medium">
//                 Preferred Product (Optional)
//               </Label>
//               <Input
//                 id="product_name"
//                 type="text"
//                 value={formData.product_name}
//                 onChange={(e) => handleInputChange("product_name", e.target.value)}
//                 placeholder="e.g. Reliance 710Wp, Tata 550Wp"
//                 className={compact ? "h-10" : "h-11"}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="product_category" className="text-sm font-medium">
//                 Product Category (Optional)
//               </Label>
//               <Select
//                 value={formData.product_category}
//                 onValueChange={(value) => handleInputChange("product_category", value)}
//               >
//                 <SelectTrigger className={compact ? "h-10" : "h-11"}>
//                   <SelectValue placeholder="Select product category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Solar Panels">Solar Panels</SelectItem>
//                   <SelectItem value="Inverters">Inverters</SelectItem>
//                   <SelectItem value="Battery Storage">Battery Storage</SelectItem>
//                   <SelectItem value="Mounting Systems">Mounting Systems</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="mounting_type" className="text-sm font-medium">
//               Mounting Type (Optional)
//             </Label>
//             <Select
//               value={formData.mounting_type}
//               onValueChange={(value) => handleInputChange("mounting_type", value)}
//             >
//               <SelectTrigger className={compact ? "h-10" : "h-11"}>
//                 <SelectValue placeholder="Select mounting type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Rooftop">Rooftop</SelectItem>
//                 <SelectItem value="Ground Mount">Ground Mount</SelectItem>
//                 <SelectItem value="Carport">Carport</SelectItem>
//                 <SelectItem value="Floating">Floating</SelectItem>
//               </SelectContent>
//             </Select>
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

//           {/* Consent Checkbox */}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="consent"
//               checked={consent}
//               onCheckedChange={(checked) => setConsent(checked === true)}
//             />
//             <Label htmlFor="consent" className="text-sm font-medium">
//               I agree to the{" "}
//               <a href="/terms" className="text-solar-orange hover:underline">
//                 terms of service
//               </a>{" "}
//               and{" "}
//               <a href="/privacy" className="text-solar-orange hover:underline">
//                 privacy policy
//               </a>
//             </Label>
//           </div>

//           {/* Submit Button */}
//           <div className={compact ? "pt-3" : "pt-4"}>
//             <Button
//               type="submit"
//               disabled={loading || !formData.name || !formData.phone || !consent}
//               className={`w-full sunset-gradient text-white font-semibold ${
//                 compact ? "h-10 text-base" : "h-12 text-lg"
//               } transition-transform duration-200 hover:scale-105`}
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
//             <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
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














import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sun, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Utility to parse UTM parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Terms of Service Content
const TermsOfService = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Terms of Service</h2>
    <p><strong>Last Updated: September 22, 2025</strong></p>
    <p>Welcome to [Your Company Name] ("we," "us," or "our"), a provider of solar energy solutions. These Terms of Service ("Terms") govern your use of our website, including the "Get a Free Solar Quote" form, and any related services (collectively, the "Services"). By accessing or using our Services, including submitting the quote request form, you agree to be bound by these Terms. If you do not agree, please do not use our Services.</p>
    <h3 className="text-lg font-semibold">1. Use of Services</h3>
    <ul className="list-disc pl-5">
      <li><strong>Purpose</strong>: Our Services allow you to request a free quote for solar energy solutions, including residential, commercial, BIPV, or utility-scale installations. You must provide accurate and complete information when submitting the form, including but not limited to your name, phone number, and project details.</li>
      <li><strong>Eligibility</strong>: You must be at least 18 years old and have the legal capacity to enter into agreements to use our Services.</li>
      <li><strong>Prohibited Conduct</strong>: You agree not to:
        <ul className="list-circle pl-5">
          <li>Submit false or misleading information through the form.</li>
          <li>Use the Services for any unlawful or unauthorized purpose.</li>
          <li>Attempt to interfere with the functionality or security of the Services.</li>
        </ul>
      </li>
    </ul>
    <h3 className="text-lg font-semibold">2. Quote Request Process</h3>
    <ul className="list-disc pl-5">
      <li><strong>Submission</strong>: By submitting the quote request form, you authorize us to collect and process your information (e.g., name, phone, email, project location, preferred product) to provide a customized solar solution quote.</li>
      <li><strong>Follow-Up</strong>: We aim to contact you within 24 hours of submission to discuss your solar needs. Quotes are estimates and subject to change based on further assessment.</li>
      <li><strong>No Obligation</strong>: Submitting a quote request does not obligate you to purchase any products or services.</li>
    </ul>
    <h3 className="text-lg font-semibold">3. Data Collection and Use</h3>
    <p>We collect personal and project-related information as outlined in our Privacy Policy. By submitting the form, you consent to the use of your data for generating quotes, communicating with you, and improving our Services. Data may be shared with third-party partners (e.g., solar panel providers like Reliance or Tata) solely for the purpose of fulfilling your quote request.</p>
    <h3 className="text-lg font-semibold">4. Intellectual Property</h3>
    <p>All content on our website, including text, logos, and images, is owned by or licensed to [Your Company Name] and protected by copyright and trademark laws. You may not reproduce or distribute our content without prior written permission.</p>
    <h3 className="text-lg font-semibold">5. Limitation of Liability</h3>
    <p>Our Services are provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Services, including but not limited to inaccuracies in quotes or delays in response. We are not responsible for the performance or suitability of solar products recommended through the quote process.</p>
    <h3 className="text-lg font-semibold">6. Termination</h3>
    <p>We may suspend or terminate your access to the Services if you violate these Terms or engage in conduct that harms our operations.</p>
    <h3 className="text-lg font-semibold">7. Governing Law</h3>
    <p>These Terms are governed by the laws of India. Any disputes will be resolved in the courts of [Your City], India.</p>
    <h3 className="text-lg font-semibold">8. Changes to Terms</h3>
    <p>We may update these Terms at any time. The updated version will be posted on our website, and continued use of the Services constitutes acceptance of the revised Terms.</p>
    <h3 className="text-lg font-semibold">9. Contact Us</h3>
    <p>For questions about these Terms, contact us at [your contact email or phone number].</p>
  </div>
);

// Privacy Policy Content
const PrivacyPolicy = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Privacy Policy</h2>
    <p><strong>Last Updated: September 22, 2025</strong></p>
    <p>At [Your Company Name], we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, including the "Get a Free Solar Quote" form, and related services (collectively, the "Services"). This policy complies with applicable privacy laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).</p>
    <h3 className="text-lg font-semibold">1. Information We Collect</h3>
    <p>We collect the following information when you submit our quote request form or interact with our Services:</p>
    <ul className="list-disc pl-5">
      <li><strong>Personal Information</strong>: Name, phone number, email address, and referral contact details (if provided).</li>
      <li><strong>Project Information</strong>: Entity type (Individual or Enterprise), solution type (Residential, Commercial, BIPV, Utility-scale), estimated installation area, monthly electricity bill, power demand, project location, preferred product name (e.g., Reliance 710Wp), and mounting type.</li>
      <li><strong>Automatically Collected Data</strong>: IP address, browser type, device information, and website usage data (via cookies or pixels, such as Meta Pixel or Google Analytics, for ad tracking).</li>
      <li><strong>Campaign Data</strong>: Source of your visit (e.g., YouTube or Meta ads), tracked via UTM parameters (e.g., `utm_source=YouTube_GeneralQuoteForm`).</li>
    </ul>
    <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
    <p>We use your information to:</p>
    <ul className="list-disc pl-5">
      <li>Generate and provide customized solar solution quotes.</li>
      <li>Contact you within 24 hours to discuss your quote request.</li>
      <li>Improve our Services, including website functionality and ad campaign performance.</li>
      <li>Comply with legal obligations and respond to customer inquiries.</li>
      <li>Retarget you with relevant ads (e.g., via YouTube or Meta) based on your interactions with our Services.</li>
    </ul>
    <h3 className="text-lg font-semibold">3. How We Share Your Information</h3>
    <ul className="list-disc pl-5">
      <li><strong>Third-Party Partners</strong>: We may share your data with solar product providers (e.g., Reliance, Tata, Shakti) or installation partners to fulfill your quote request.</li>
      <li><strong>Service Providers</strong>: We use third-party services (e.g., Supabase for data storage, LeadsBridge for ad data syncing) to process your information securely.</li>
      <li><strong>Legal Requirements</strong>: We may disclose your information to comply with applicable laws or respond to legal requests.</li>
      <li><strong>Advertising Platforms</strong>: Anonymized data may be shared with YouTube (Google Ads) or Meta for ad performance analytics and retargeting.</li>
    </ul>
    <h3 className="text-lg font-semibold">4. Your Rights</h3>
    <ul className="list-disc pl-5">
      <li><strong>GDPR (EU Residents)</strong>: You have the right to access, correct, delete, or restrict the processing of your personal data. You may also object to data processing or request data portability.</li>
      <li><strong>CCPA (California Residents)</strong>: You have the right to know what personal information we collect, request deletion, and opt out of the sale of your data (we do not sell your data).</li>
      <li>To exercise these rights, contact us at [your contact email or phone number].</li>
    </ul>
    <h3 className="text-lg font-semibold">5. Data Security</h3>
    <p>We use industry-standard security measures (e.g., encryption for Supabase data storage) to protect your information. However, no method of transmission over the internet is 100% secure.</p>
    <h3 className="text-lg font-semibold">6. Cookies and Tracking</h3>
    <p>We use cookies and tracking technologies (e.g., Meta Pixel, Google Analytics) to analyze website usage and optimize ad campaigns. You can manage cookie preferences via your browser settings. Ad-driven visits (e.g., from YouTube or Meta) are tracked via UTM parameters to attribute form submissions (e.g., `source: "Meta_GeneralQuoteForm"`).</p>
    <h3 className="text-lg font-semibold">7. Data Retention</h3>
    <p>We retain your personal and project information for as long as necessary to fulfill your quote request and comply with legal obligations. You may request deletion of your data at any time.</p>
    <h3 className="text-lg font-semibold">8. Third-Party Links</h3>
    <p>Our Services may contain links to third-party websites (e.g., solar product providers). We are not responsible for their privacy practices.</p>
    <h3 className="text-lg font-semibold">9. Children’s Privacy</h3>
    <p>Our Services are not intended for individuals under 18. We do not knowingly collect data from children.</p>
    <h3 className="text-lg font-semibold">10. Changes to This Privacy Policy</h3>
    <p>We may update this Privacy Policy at any time. The updated version will be posted on our website, and continued use of the Services constitutes acceptance of the revised policy.</p>
    <h3 className="text-lg font-semibold">11. Contact Us</h3>
    <p>For questions or to exercise your privacy rights, contact us at [your contact email or phone number].</p>
  </div>
);

// Reusable form component for embedding into a modal or page
export const GetQuoteForm = ({
  compact = false,
  showHeader = true,
}: {
  compact?: boolean;
  showHeader?: boolean;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    entity_type: "",
    solution_classification: "",
    estimated_area_sqft: "",
    monthly_bill: "",
    power_demand_kw: "",
    project_location: "",
    referral_name: "",
    referral_phone: "",
    product_name: "",
    mounting_type: "",
  });
  const query = useQuery();
  const utmSource = query.get("utm_source") || "";
  const utmCampaign = query.get("utm_campaign") || "";
  const defaultSource = "GeneralQuoteForm";
  const source = utmSource ? `${utmSource}_${utmCampaign || defaultSource}` : defaultSource;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to the terms of service and privacy policy to submit the form.",
        variant: "destructive",
      });
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (e.g., +919876543210).",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const insertData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
        solution_classification:
          (formData.solution_classification as
            | "Residential"
            | "Commercial"
            | "BIPv"
            | "Utility-scale") || null,
        estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
        monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
        power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
        project_location: formData.project_location || null,
        referral_name: formData.referral_name || null,
        referral_phone: formData.referral_phone || null,
        product_name: formData.product_name || null,
        mounting_type: formData.mounting_type || null,
        source,
        customer_type: formData.entity_type === "Individual" ? "residential" : formData.entity_type ? "commercial" : null,
      };

      const { error } = await supabase.from("solar_quote_requests").insert(insertData);

      if (error) throw error;

      toast({
        title: "Quote Request Submitted!",
        description: "Our team will contact you within 24 hours to discuss your solar solution.",
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        entity_type: "",
        solution_classification: "",
        estimated_area_sqft: "",
        monthly_bill: "",
        power_demand_kw: "",
        project_location: "",
        referral_name: "",
        referral_phone: "",
        product_name: "",
        mounting_type: "",
      });
      setConsent(false);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description: `Failed to submit quote request. Details: ${(error as any).message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateNumber = (field: string, value: string) => {
    if (value && isNaN(Number(value))) {
      toast({
        title: "Invalid Input",
        description: `Please enter a valid number for ${fieldLabelMap[field] || field}.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const fieldLabelMap: { [key: string]: string } = {
    estimated_area_sqft: "Installation Area",
    monthly_bill: "Monthly Electricity Bill",
    power_demand_kw: "Power Demand",
  };

  const isFrameless = compact && !showHeader;

  return (
    <Card className={isFrameless ? "bg-transparent shadow-none border-0" : "card-shadow"}>
      {showHeader && (
        <CardHeader className={compact ? "py-3" : undefined}>
          <CardTitle className={compact ? "text-xl" : undefined}>Solar Solution Information</CardTitle>
          <CardDescription className={compact ? "text-xs" : undefined}>
            Please provide accurate information to help us create the best solar solution for you
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={isFrameless ? "p-0" : compact ? "pt-4" : undefined}>
        <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-6"}>
          {/* Personal Information */}
          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
          </div>

          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity_type" className="text-sm font-medium">
                Entity Type
              </Label>
              <Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}>
                <SelectTrigger className={compact ? "h-10" : "h-11"}>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Details */}
          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="solution_classification" className="text-sm font-medium">
                Solution Type
              </Label>
              <Select
                value={formData.solution_classification}
                onValueChange={(value) => handleInputChange("solution_classification", value)}
              >
                <SelectTrigger className={compact ? "h-10" : "h-11"}>
                  <SelectValue placeholder="Select solution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="BIPv">BIPV</SelectItem>
                  <SelectItem value="Utility-scale">Utility-scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_area_sqft" className="text-sm font-medium">
                Installation Area (sq ft)
              </Label>
              <Input
                id="estimated_area_sqft"
                type="number"
                value={formData.estimated_area_sqft}
                onChange={(e) => validateNumber("estimated_area_sqft", e.target.value) && handleInputChange("estimated_area_sqft", e.target.value)}
                placeholder="e.g. 1000"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
          </div>

          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="monthly_bill" className="text-sm font-medium">
                Monthly Electricity Bill (₹)
              </Label>
              <Input
                id="monthly_bill"
                type="number"
                value={formData.monthly_bill}
                onChange={(e) => validateNumber("monthly_bill", e.target.value) && handleInputChange("monthly_bill", e.target.value)}
                placeholder="e.g. 5000"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="power_demand_kw" className="text-sm font-medium">
                Power Demand (kW)
              </Label>
              <Input
                id="power_demand_kw"
                type="number"
                value={formData.power_demand_kw}
                onChange={(e) => validateNumber("power_demand_kw", e.target.value) && handleInputChange("power_demand_kw", e.target.value)}
                placeholder="e.g. 5"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_location" className="text-sm font-medium">
              Project Location
            </Label>
            <Input
              id="project_location"
              type="text"
              value={formData.project_location}
              onChange={(e) => handleInputChange("project_location", e.target.value)}
              placeholder="City, State"
              className={compact ? "h-10" : "h-11"}
            />
          </div>

          {/* Updated Fields */}
          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="product_name" className="text-sm font-medium">
                Preferred Product (Optional)
              </Label>
              <Input
                id="product_name"
                type="text"
                value={formData.product_name}
                onChange={(e) => handleInputChange("product_name", e.target.value)}
                placeholder="e.g. Reliance 710Wp, Tata 550Wp, Shakti 535Wp"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mounting_type" className="text-sm font-medium">
                Mounting Type (Optional)
              </Label>
              <Select
                value={formData.mounting_type}
                onValueChange={(value) => handleInputChange("mounting_type", value)}
              >
                <SelectTrigger className={compact ? "h-10" : "h-11"}>
                  <SelectValue placeholder="Select mounting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rooftop">Rooftop</SelectItem>
                  <SelectItem value="Ground Mount">Ground Mount</SelectItem>
                  <SelectItem value="Carport">Carport</SelectItem>
                  <SelectItem value="Floating">Floating</SelectItem>
                  <SelectItem value="Tin Shed">Tin Shed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
            <div className="space-y-2">
              <Label htmlFor="referral_name" className="text-sm font-medium">
                Referral Name (Optional)
              </Label>
              <Input
                id="referral_name"
                type="text"
                value={formData.referral_name}
                onChange={(e) => handleInputChange("referral_name", e.target.value)}
                placeholder="Name of person who referred you"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral_phone" className="text-sm font-medium">
                Referral Phone Number (Optional)
              </Label>
              <Input
                id="referral_phone"
                type="tel"
                value={formData.referral_phone}
                onChange={(e) => handleInputChange("referral_phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={compact ? "h-10" : "h-11"}
              />
            </div>
          </div>

          {/* Consent Checkbox with Pop-ups */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm font-medium">
              I agree to the{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-solar-orange hover:underline cursor-pointer">terms of service</span>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                  </DialogHeader>
                  <TermsOfService />
                </DialogContent>
              </Dialog>{" "}
              and{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-solar-orange hover:underline cursor-pointer">privacy policy</span>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                  </DialogHeader>
                  <PrivacyPolicy />
                </DialogContent>
              </Dialog>
            </Label>
          </div>

          {/* Submit Button */}
          <div className={compact ? "pt-3" : "pt-4"}>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.phone || !consent}
              className={`w-full sunset-gradient text-white font-semibold ${
                compact ? "h-10 text-base" : "h-12 text-lg"
              } transition-transform duration-200 hover:scale-105`}
            >
              {loading ? "Submitting..." : "Get My Free Quote"}
            </Button>
            <p
              className={`text-center mt-3 ${
                compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"
              }`}
            >
              By submitting this form, you agree to our terms of service and privacy policy
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Main page component
const GetQuote = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-solar-blue/5 to-solar-orange/5 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-solar-orange hover:text-solar-gold transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Get Your Free Solar Quote</h1>
          <p className="text-lg text-muted-foreground">
            Fill out this form and our solar experts will design a custom solution for your needs
          </p>
        </div>

        {/* Form */}
        <GetQuoteForm />
      </div>
    </div>
  );
};

export default GetQuote;