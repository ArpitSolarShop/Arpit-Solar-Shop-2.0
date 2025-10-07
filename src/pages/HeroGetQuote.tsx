// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";

// // Define component-specific types and constants
// type CustomerType = "Residential" | "Commercial";
// const BILL_RANGES = [
//   "Less than ₹1500",
//   "₹1500 - ₹2500",
//   "₹2500 - ₹4000",
//   "₹4000 - ₹8000",
//   "More than ₹8000",
// ];

// // ✅ FIX 1: Added a helper function to convert text ranges to numbers
// const convertBillRangeToNumber = (range: string): number | null => {
//   if (!range) return null;
//   switch (range) {
//     case "Less than ₹1500":
//       return 1000; // Representative value
//     case "₹1500 - ₹2500":
//       return 2000; // Average
//     case "₹2500 - ₹4000":
//       return 3250; // Average
//     case "₹4000 - ₹8000":
//       return 6000; // Average
//     case "More than ₹8000":
//       return 9000; // Representative value
//     default:
//       // If it's already a number string (from commercial input), parse it
//       const parsed = parseFloat(range);
//       return isNaN(parsed) ? null : parsed;
//   }
// };

// export const HeroGetQuote = () => {
//   const { toast } = useToast();
//   const [customerType, setCustomerType] = useState<CustomerType>("Residential");
//   const [loading, setLoading] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     whatsappNumber: "",
//     pinCode: "",
//     companyName: "",
//     city: "",
//     monthlyBill: "",
//   });

//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const resetForm = () => {
//     setFormData({
//       fullName: "",
//       whatsappNumber: "",
//       pinCode: "",
//       companyName: "",
//       city: "",
//       monthlyBill: "",
//     });
//     setAgreed(false);
//   };

//   const handleCustomerTypeChange = (type: CustomerType) => {
//     setCustomerType(type);
//     resetForm();
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!agreed) {
//       toast({
//         title: "Agreement Required",
//         description: "Please agree to the terms of service and privacy policy.",
//         variant: "destructive",
//       });
//       return;
//     }
//     setLoading(true);

//     const isCommercial = customerType === "Commercial";

//     try {
//       // ✅ FIX 2: Updated the data object to always send a numeric bill
//       const dataToInsert = {
//         name: formData.fullName,
//         phone: formData.whatsappNumber,
//         customer_type: customerType.toLowerCase(),
//         company_name: isCommercial ? formData.companyName : null,
//         project_location: isCommercial
//           ? `${formData.city}, ${formData.pinCode}`
//           : formData.pinCode,
//         source: "Hero Quote Form",
//         // This now handles both cases and sends a number to the correct column
//         monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
//       };

//       const { error } = await supabase.from("solar_quote_requests").insert(dataToInsert);

//       if (error) throw error;

//       toast({
//         title: "Request Submitted!",
//         description: "Thank you! Our team will contact you shortly.",
//       });

//       resetForm();
//     } catch (error: any) {
//       console.error("Error submitting quote:", error);
//       toast({
//         title: "Submission Failed",
//         description: error.message || "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render different form fields based on the selected customer type
//   const renderFormFields = () => {
//     if (customerType === "Commercial") {
//       return (
//         <>
//           <div className="space-y-2">
//             <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
//             <Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
//               <Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="pinCodeCommercial">Pin code</Label>
//               <Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label>
//             <Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label>
//             <Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} />
//           </div>
//         </>
//       );
//     }

//     // Default to Residential form
//     return (
//       <>
//         <div className="space-y-2">
//           <Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label>
//           <Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label>
//           <Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} />
//         </div>
//         <div className="space-y-2">
//           <Label>What is your average monthly bill? <span className="text-red-500">*</span></Label>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//             {BILL_RANGES.map((range) => (
//               <Button
//                 key={range}
//                 type="button"
//                 variant={formData.monthlyBill === range ? "default" : "outline"}
//                 onClick={() => handleInputChange("monthlyBill", range)}
//                 className="justify-center text-center h-auto py-2 px-2 text-sm"
//               >
//                 {range}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border">
//       <CardContent className="p-6">
//         {/* Customer Type Toggle */}
//         <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
//           {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
//             <Button
//               key={type}
//               onClick={() => handleCustomerTypeChange(type)}
//               variant="ghost"
//               className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${
//                 customerType === type
//                   ? "bg-white text-blue-900 shadow"
//                   : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
//               }`}
//             >
//               {type}
//             </Button>
//           ))}
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
//             <Input id="fullName" required value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
//           </div>

//           {renderFormFields()}

//           <div className="flex items-start space-x-3 pt-2">
//             <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
//             <div className="grid gap-1.5 leading-none">
//               <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">
//                 I agree to Arpit Solar Shop's{" "}
//                 <Link to="/terms-of-service" target="_blank" className="underline font-medium hover:text-primary">
//                   terms of service
//                 </Link>{" "}
//                 &{" "}
//                 <Link to="/privacy-policy" target="_blank" className="underline font-medium hover:text-primary">
//                   privacy policy
//                 </Link>
//               </Label>
//             </div>
//           </div>
          
//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full text-white font-bold text-base h-12 bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity"
//           >
//             {loading ? "Submitting..." : "Submit Details"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };













// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";
// import { ArrowLeft, MapPin, Zap, Leaf, IndianRupee, PiggyBank, Timer } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// // --- TYPES AND CONSTANTS ---
// type CustomerType = "Residential" | "Commercial";
// const BILL_RANGES = [
//   "Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000",
//   "₹4000 - ₹8000", "More than ₹8000",
// ];
// const TOTAL_ESTIMATE_STEPS = 3;

// // --- HELPER FUNCTIONS ---
// const convertBillRangeToNumber = (range: string): number | null => {
//   if (!range) return null;
//   switch (range) {
//     case "Less than ₹1500": return 1000;
//     case "₹1500 - ₹2500": return 2000;
//     case "₹2500 - ₹4000": return 3250;
//     case "₹4000 - ₹8000": return 6000;
//     case "More than ₹8000": return 9000;
//     default:
//       const parsed = parseFloat(range);
//       return isNaN(parsed) ? null : parsed;
//   }
// };

// // --- MAIN COMPONENT ---
// export const HeroGetQuote = () => {
//   const { toast } = useToast();

//   // --- STATE MANAGEMENT ---
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   // ✅ FIX: Changed to string to match the 'uuid' type from your schema
//   const [newlyCreatedQuoteId, setNewlyCreatedQuoteId] = useState<string | null>(null);

//   const [customerType, setCustomerType] = useState<CustomerType>("Residential");
//   const [agreed, setAgreed] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "",
//   });

//   const [estimateData, setEstimateData] = useState({
//     roofOwnership: "", constructed: "", roofType: "",
//     terraceSize: "" as string | number,
//     powerCuts: "", planning: "",
//     fullAddress: "", landmark: "", latitude: null as number | null, longitude: null as number | null,
//   });

//   const [results, setResults] = useState({
//     systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0,
//     grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0
//   });

//   // --- CALCULATION CONSTANTS ---
//   const stateTariffs: Record<string, number> = {
//     "Uttar Pradesh": 7.2, Delhi: 8, Maharashtra: 9, Gujarat: 7, Rajasthan: 8.5,
//   };
//   const avgSolarGenerationPerKWMonth = 120;
//   const avgRoofAreaPerKW = 60;
//   const systemCostPerKW = 60000;
//   const subsidyPerKW = 18000;
//   const maxSubsidy = 108000;
//   const co2SavingPerKWYear = 1.2;

//   // --- HANDLERS ---
//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEstimateChange = (field: keyof typeof estimateData, value: string | number) => {
//     setEstimateData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCustomerTypeChange = (type: CustomerType) => {
//     setCustomerType(type);
//     setFormData({
//       fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "",
//     });
//   };

//   const handleInitialSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!agreed) {
//       toast({ title: "Agreement Required", description: "Please agree to the terms of service and privacy policy.", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     try {
//       const dataToInsert = {
//         name: formData.fullName,
//         phone: formData.whatsappNumber,
//         customer_type: customerType.toLowerCase(),
//         company_name: customerType === "Commercial" ? formData.companyName : null,
//         project_location: `${formData.city}, ${formData.pinCode}`,
//         source: "Hero Quote Form",
//         monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
//       };

//       const { data, error } = await supabase.from("solar_quote_requests").insert(dataToInsert).select('id').single();

//       if (error) throw error;
//       if (data) setNewlyCreatedQuoteId(data.id);

//       toast({ title: "Details Saved!", description: "Now, let's get you a quick estimate." });
//       setStep(1);
//     } catch (error: any) {
//       console.error("Error submitting initial quote:", error);
//       toast({ title: "Submission Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShareLocation = () => {
//     // Geolocation logic remains the same
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setEstimateData(prev => ({
//             ...prev,
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           }));
//           toast({ title: "Location Shared!", description: "We've got your coordinates." });
//         },
//         () => {
//           toast({ title: "Location Error", description: "Could not retrieve your location.", variant: "destructive" });
//         }
//       );
//     } else {
//       toast({ title: "Geolocation Not Supported", description: "Your browser does not support geolocation.", variant: "destructive" });
//     }
//   };

//   const handleGetEstimates = async () => {
//     setLoading(true);
    
//     // Calculation logic remains the same
//     const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0;
//     const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"];
//     const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0;
//     let systemSize = 0;
//     if (estimatedMonthlyConsumption > 0) {
//       systemSize = Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9);
//     }
//     systemSize = Math.max(1, Math.min(systemSize, 100));
//     const requiredRoofArea = systemSize * avgRoofAreaPerKW;
//     const grossCost = systemSize * systemCostPerKW;
//     const applicableSubsidy = Math.min(systemSize * subsidyPerKW, maxSubsidy);
//     const netCost = Math.max(0, grossCost - applicableSubsidy);
//     const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9);
//     const yearlySavings = monthlySavings * 12;
//     const fiveYearSavings = yearlySavings * 5;
//     let paybackYears = 0;
//     if (netCost > 0 && monthlySavings > 0) {
//       paybackYears = parseFloat((netCost / (monthlySavings * 12)).toFixed(1));
//     }
//     const co2Savings = systemSize * co2SavingPerKWYear;

//     setResults({
//       systemSize, requiredRoofArea: Math.round(requiredRoofArea),
//       monthlySavings, yearlySavings, fiveYearSavings,
//       grossCost, netCost, paybackYears,
//       co2Savings: parseFloat(co2Savings.toFixed(1))
//     });

//     try {
//       if (!newlyCreatedQuoteId) throw new Error("No quote ID found to update.");

//       // ✅ FIX: This object now maps to your actual database schema
//       const dataToUpdate = {
//         estimated_area_sqft: Number(estimateData.terraceSize) || null,
//         mounting_type: estimateData.roofType || null,
//         // This object will be saved in the new 'additional_details' (jsonb) column
//         additional_details: {
//           roofOwnership: estimateData.roofOwnership,
//           isConstructed: estimateData.constructed,
//           hasPowerCuts: estimateData.powerCuts,
//           planningHorizon: estimateData.planning,
//           fullAddress: estimateData.fullAddress,
//           landmark: estimateData.landmark,
//           latitude: estimateData.latitude,
//           longitude: estimateData.longitude,
//         }
//       };

//       const { error } = await supabase
//         .from("solar_quote_requests")
//         .update(dataToUpdate)
//         // ✅ FIX: No need for String() now that the state is correctly typed as string
//         .eq('id', newlyCreatedQuoteId);

//       if (error) throw error;
//       setStep(4);
//     } catch (error: any) {
//       console.error("Error updating quote with estimates:", error);
//       toast({ title: "Update Failed", description: error.message || "Please ensure you have added the 'additional_details' column to your database.", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goBack = () => setStep(prev => prev - 1);

//   const getStepTitle = () => {
//     switch (step) {
//       case 1: return "Quick Estimates (Step 1/3)";
//       case 2: return "Quick Estimates (Step 2/3)";
//       case 3: return "Quick Estimates (Step 3/3)";
//       case 4: return "Your Solar Estimate Results";
//       default: return "Get a Free Solar Quote";
//     }
//   };

//   const renderFormContent = () => {
//     switch (step) {
//       case 0:
//         return (
//           <form onSubmit={handleInitialSubmit} className="space-y-4">
//             {/* Initial form JSX... */}
//              <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
//               {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
//                 <Button key={type} type="button" onClick={() => handleCustomerTypeChange(type)} variant="ghost" className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${customerType === type ? "bg-white text-blue-900 shadow" : "text-gray-500 hover:bg-gray-200"}`}>{type}</Button>
//               ))}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
//               <Input id="fullName" required value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
//             </div>
//             {customerType === 'Commercial' ? (
//               <>
//                 <div className="space-y-2"><Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label><Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} /></div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="city">City <span className="text-red-500">*</span></Label><Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="pinCodeCommercial">Pin code</Label><Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div></div>
//                 <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
//                 <div className="space-y-2"><Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label><Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} /></div>
//               </>
//             ) : (
//               <>
//                 <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
//                 <div className="space-y-2"><Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label><Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div>
//                 <div className="space-y-2"><Label>What is your average monthly bill? <span className="text-red-500">*</span></Label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<Button key={range} type="button" variant={formData.monthlyBill === range ? "default" : "outline"} onClick={() => handleInputChange("monthlyBill", range)} className="justify-center text-center h-auto py-2 px-2 text-sm">{range}</Button>))}</div></div>
//               </>
//             )}
//             <div className="flex items-start space-x-3 pt-2">
//               <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
//               <div className="grid gap-1.5 leading-none">
//                 <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">I agree to Arpit Solar Shop's <Link to="/terms-of-service" target="_blank" className="underline font-medium hover:text-primary">terms of service</Link> & <Link to="/privacy-policy" target="_blank" className="underline font-medium hover:text-primary">privacy policy</Link></Label>
//               </div>
//             </div>
//             <Button type="submit" disabled={loading} className="w-full text-white font-bold text-base h-12 bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity">{loading ? "Submitting..." : "Submit Details"}</Button>
//           </form>
//         );
//       case 1:
//         return (
//           <div className="space-y-6">
//             {/* Step 1 JSX... */}
//             <div className="space-y-2">
//               <Label>Do you have roof ownership?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.roofOwnership === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.roofOwnership === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Is your house fully constructed?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.constructed === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.constructed === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Select the roof type</Label>
//               <div className="grid grid-cols-1 gap-2">
//                 <Button variant={estimateData.roofType === 'Concrete' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Concrete')}>Concrete Roof</Button>
//                 <Button variant={estimateData.roofType === 'Metal' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Metal')}>Metal Sheet Roof</Button>
//                 <Button variant={estimateData.roofType === 'Brick' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Brick')}>Brick Roof</Button>
//               </div>
//             </div>
//             <Button onClick={() => setStep(2)} className="w-full">Next</Button>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-6">
//             {/* Step 2 JSX... */}
//              <div className="space-y-2">
//               <Label htmlFor="terraceSize">What is the Approx. Terrace Size (in Sq. ft)?</Label>
//               <Input
//                 id="terraceSize"
//                 type="number"
//                 placeholder="Enter Roof Area"
//                 value={estimateData.terraceSize}
//                 onChange={(e) => handleEstimateChange('terraceSize', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Do you face regular power cuts?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.powerCuts === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.powerCuts === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>When are you planning to get Solar?</Label>
//               <div className="grid grid-cols-1 gap-2">
//                 <Button variant={estimateData.planning === 'Immediately' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', 'Immediately')}>Immediately</Button>
//                 <Button variant={estimateData.planning === '3 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '3 Months')}>In 3 months</Button>
//                 <Button variant={estimateData.planning === '6 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '6 Months')}>In 6 months</Button>
//               </div>
//             </div>
//             <Button onClick={() => setStep(3)} className="w-full">Next</Button>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-4">
//             {/* Step 3 JSX... */}
//             <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleShareLocation}>
//               <MapPin className="h-4 w-4" /> Share my current Location
//             </Button>
//             <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">or</span></div></div>
//             <div className="space-y-2">
//               <Label htmlFor="fullAddress">Enter your full address</Label>
//               <Input id="fullAddress" value={estimateData.fullAddress} onChange={(e) => handleEstimateChange('fullAddress', e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="landmark">Landmark</Label>
//               <Input id="landmark" value={estimateData.landmark} onChange={(e) => handleEstimateChange('landmark', e.target.value)} />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-2"><Label>PIN Code</Label><Input value={formData.pinCode} readOnly /></div>
//                 <div className="space-y-2"><Label>City</Label><Input value={formData.city || "Varanasi"} readOnly /></div>
//                 <div className="space-y-2"><Label>State</Label><Input value="Uttar Pradesh" readOnly /></div>
//             </div>
//             <Button onClick={handleGetEstimates} disabled={loading} className="w-full">{loading ? "Calculating..." : "Get Estimates"}</Button>
//           </div>
//         );
//       case 4:
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="text-center space-y-4"
//           >
//             {/* Results JSX... */}
//             <h3 className="text-2xl font-bold text-blue-900">Your Solar Estimate</h3>
//             <div className="bg-blue-50 p-4 rounded-lg space-y-2">
//                 <p className="text-sm text-gray-600">Required System Size</p>
//                 <p className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
//                   <Zap className="h-8 w-8 text-yellow-500" />{results.systemSize} kW
//                 </p>
//                 <p className="text-sm text-gray-600">Approx. Roof Area Needed</p>
//                 <p className="text-xl font-bold text-gray-800">{results.requiredRoofArea} sq. ft.</p>
//                 <p className="text-xs text-gray-500 mt-2">Do not have required roof area? Our consultants will guide you. <Link to="/contact" className="underline">Get in touch</Link>.</p>
//             </div>
//             <h3 className="text-xl font-bold pt-4">Estimated Savings</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-white">
//               <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">Monthly</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.monthlySavings.toLocaleString('en-IN')}</p>
//               </div>
//               <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">Yearly</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.yearlySavings.toLocaleString('en-IN')}</p>
//               </div>
//               <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">5-Year Guaranteed</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.fiveYearSavings.toLocaleString('en-IN')}</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2 mt-4">
//                 <p className="flex items-center gap-2"><PiggyBank className="text-green-600" /><strong>Gross System Cost:</strong> ₹{results.grossCost.toLocaleString('en-IN')}</p>
//                 <p className="flex items-center gap-2"><IndianRupee className="text-yellow-600" /><strong>Net Cost (after subsidy):</strong> ₹{results.netCost.toLocaleString('en-IN')}</p>
//                 <p className="flex items-center gap-2"><Timer className="text-orange-600" /><strong>Estimated Payback Period:</strong> {results.paybackYears} years</p>
//                 <p className="flex items-center gap-2"><Leaf className="text-green-700" /><strong>CO₂ Savings:</strong> {results.co2Savings} tons/year</p>
//             </div>
//             <Button onClick={() => setStep(0)} variant="outline" className="mt-4">Start New Estimate</Button>
//           </motion.div>
//         );
//       default:
//         return null;
//     }
//   };

//   const progressBarValue = step === 4 ? 100 : (step > 0 ? (step / TOTAL_ESTIMATE_STEPS) * 100 : 0);

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border">
//       <CardHeader className="relative pb-4">
//         <div className="flex items-center gap-4">
//           {step > 0 && step < 4 && (
//             <Button variant="ghost" size="icon" onClick={goBack}><ArrowLeft className="h-4 w-4"/></Button>
//           )}
//           <CardTitle className="text-blue-900">{getStepTitle()}</CardTitle>
//         </div>
//         {step > 0 && step < 4 && (
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
//             <motion.div
//               className="bg-orange-500 h-full rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: `${progressBarValue}%` }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             />
//           </div>
//         )}
//       </CardHeader>
//       <CardContent className="p-6 pt-2">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//           >
//             {renderFormContent()}
//           </motion.div>
//         </AnimatePresence>
//       </CardContent>
//     </Card>
//   );
// };







// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";
// import { ArrowLeft, MapPin, Zap, Leaf, IndianRupee, PiggyBank, Timer } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// // --- TYPES AND CONSTANTS ---
// type CustomerType = "Residential" | "Commercial";
// const BILL_RANGES = [
//   "Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000",
//   "₹4000 - ₹8000", "More than ₹8000",
// ];
// const TOTAL_ESTIMATE_STEPS = 3;

// // --- HELPER FUNCTIONS ---
// const convertBillRangeToNumber = (range: string): number | null => {
//   if (!range) return null;
//   switch (range) {
//     case "Less than ₹1500": return 1000;
//     case "₹1500 - ₹2500": return 2000;
//     case "₹2500 - ₹4000": return 3250;
//     case "₹4000 - ₹8000": return 6000;
//     case "More than ₹8000": return 9000;
//     default:
//       const parsed = parseFloat(range);
//       return isNaN(parsed) ? null : parsed;
//   }
// };

// // --- MAIN COMPONENT ---
// export const HeroGetQuote = () => {
//   const { toast } = useToast();

//   // --- STATE MANAGEMENT ---
//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [newlyCreatedQuoteId, setNewlyCreatedQuoteId] = useState<string | null>(null);

//   const [customerType, setCustomerType] = useState<CustomerType>("Residential");
//   const [agreed, setAgreed] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "",
//   });

//   const [estimateData, setEstimateData] = useState({
//     roofOwnership: "", constructed: "", roofType: "",
//     terraceSize: "" as string | number,
//     powerCuts: "", planning: "",
//     fullAddress: "", landmark: "", latitude: null as number | null, longitude: null as number | null,
//   });

//   const [results, setResults] = useState({
//     systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0,
//     grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0
//   });

//   // --- CALCULATION CONSTANTS ---
//   const stateTariffs: Record<string, number> = {
//     "Uttar Pradesh": 7.2, Delhi: 8, Maharashtra: 9, Gujarat: 7, Rajasthan: 8.5,
//   };
//   const avgSolarGenerationPerKWMonth = 120;
//   const avgRoofAreaPerKW = 60;
//   const systemCostPerKW = 60000;
//   const subsidyPerKW = 18000;
//   const maxSubsidy = 108000;
//   const co2SavingPerKWYear = 1.2;

//   // --- HANDLERS ---
//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEstimateChange = (field: keyof typeof estimateData, value: string | number) => {
//     setEstimateData((prev) => ({ ...prev, [field]: value }));
//   };
  
//   const handleCustomerTypeChange = (type: CustomerType) => {
//     setCustomerType(type);
//     setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" });
//   };

//   const handleInitialSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!agreed) {
//       toast({ title: "Agreement Required", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     try {
//       const dataToInsert = {
//         name: formData.fullName,
//         phone: formData.whatsappNumber,
//         customer_type: customerType.toLowerCase(),
//         company_name: customerType === "Commercial" ? formData.companyName : null,
//         project_location: `${formData.city}, ${formData.pinCode}`,
//         source: "Hero Quote Form",
//         monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
//       };

//       const { data, error } = await supabase.from("solar_quote_requests").insert(dataToInsert).select('id').single();

//       if (error) throw error;
//       if (data) setNewlyCreatedQuoteId(data.id);

//       toast({ title: "Details Saved!", description: "Now, let's get you a quick estimate." });
//       setStep(1);
//     } catch (error: any) {
//       toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleShareLocation = () => {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setEstimateData(prev => ({
//               ...prev,
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             }));
//             toast({ title: "Location Shared!", description: "We've got your coordinates." });
//           },
//           () => {
//             toast({ title: "Location Error", description: "Could not retrieve your location.", variant: "destructive" });
//           }
//         );
//       } else {
//         toast({ title: "Geolocation Not Supported", description: "Your browser does not support geolocation.", variant: "destructive" });
//       }
//   };

//   const handleGetEstimates = async () => {
//     setLoading(true);
    
//     const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0;
//     const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"];
//     const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0;
//     let systemSize = 0;
//     if (estimatedMonthlyConsumption > 0) {
//       systemSize = Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9);
//     }
//     systemSize = Math.max(1, Math.min(systemSize, 100));
//     const requiredRoofArea = systemSize * avgRoofAreaPerKW;
//     const grossCost = systemSize * systemCostPerKW;
//     const applicableSubsidy = Math.min(systemSize * subsidyPerKW, maxSubsidy);
//     const netCost = Math.max(0, grossCost - applicableSubsidy);
//     const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9);
//     const yearlySavings = monthlySavings * 12;
//     const fiveYearSavings = yearlySavings * 5;
//     let paybackYears = 0;
//     if (netCost > 0 && monthlySavings > 0) {
//       paybackYears = parseFloat((netCost / (monthlySavings * 12)).toFixed(1));
//     }
//     const co2Savings = systemSize * co2SavingPerKWYear;

//     setResults({
//       systemSize, requiredRoofArea: Math.round(requiredRoofArea),
//       monthlySavings, yearlySavings, fiveYearSavings,
//       grossCost, netCost, paybackYears,
//       co2Savings: parseFloat(co2Savings.toFixed(1))
//     });

//     try {
//       if (!newlyCreatedQuoteId) throw new Error("No quote ID found to update.");

//       const dataToUpdate = {
//         estimated_area_sqft: Number(estimateData.terraceSize) || null,
//         mounting_type: estimateData.roofType || null,
//         power_demand_kw: systemSize,
//       };

//       const { error } = await supabase
//         .from("solar_quote_requests")
//         .update(dataToUpdate)
//         .eq('id', newlyCreatedQuoteId);

//       if (error) throw error;
      
//       setStep(4);

//     } catch (error: any) {
//       toast({ title: "Update Failed", description: error.message, variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goBack = () => setStep(prev => prev - 1);

//   const getStepTitle = () => {
//     switch (step) {
//       case 1: return "Quick Estimates (Step 1/3)";
//       case 2: return "Quick Estimates (Step 2/3)";
//       case 3: return "Quick Estimates (Step 3/3)";
//       case 4: return "Your Solar Estimate Results";
//       default: return "Get a Free Solar Quote";
//     }
//   };

//   const renderFormContent = () => {
//     switch (step) {
//       case 0:
//         return (
//           <form onSubmit={handleInitialSubmit} className="space-y-4">
//             <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
//               {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
//                 <Button key={type} type="button" onClick={() => handleCustomerTypeChange(type)} variant="ghost" className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${customerType === type ? "bg-white text-blue-900 shadow" : "text-gray-500 hover:bg-gray-200"}`}>{type}</Button>
//               ))}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
//               <Input id="fullName" required value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
//             </div>
//             {customerType === 'Commercial' ? (
//               <>
//                 <div className="space-y-2"><Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label><Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} /></div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="city">City <span className="text-red-500">*</span></Label><Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="pinCodeCommercial">Pin code</Label><Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div></div>
//                 <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
//                 <div className="space-y-2"><Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label><Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} /></div>
//               </>
//             ) : (
//               <>
//                 <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
//                 <div className="space-y-2"><Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label><Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div>
//                 <div className="space-y-2"><Label>What is your average monthly bill? <span className="text-red-500">*</span></Label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<Button key={range} type="button" variant={formData.monthlyBill === range ? "default" : "outline"} onClick={() => handleInputChange("monthlyBill", range)} className="justify-center text-center h-auto py-2 px-2 text-sm">{range}</Button>))}</div></div>
//               </>
//             )}
//             <div className="flex items-start space-x-3 pt-2">
//               <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
//               <div className="grid gap-1.5 leading-none">
//                 <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">I agree to Arpit Solar Shop's <Link to="/terms-of-service" target="_blank" className="underline font-medium hover:text-primary">terms of service</Link> & <Link to="/privacy-policy" target="_blank" className="underline font-medium hover:text-primary">privacy policy</Link></Label>
//               </div>
//             </div>
//             <Button type="submit" disabled={loading} className="w-full text-white font-bold text-base h-12 bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity">{loading ? "Submitting..." : "Submit Details"}</Button>
//           </form>
//         );
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label>Do you have roof ownership?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.roofOwnership === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.roofOwnership === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Is your house fully constructed?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.constructed === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.constructed === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>Select the roof type</Label>
//               <div className="grid grid-cols-1 gap-2">
//                 <Button variant={estimateData.roofType === 'Concrete' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Concrete')}>Concrete Roof</Button>
//                 <Button variant={estimateData.roofType === 'Metal' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Metal')}>Metal Sheet Roof</Button>
//                 <Button variant={estimateData.roofType === 'Brick' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Brick')}>Brick Roof</Button>
//               </div>
//             </div>
//             <Button onClick={() => setStep(2)} className="w-full">Next</Button>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="terraceSize">What is the Approx. Terrace Size (in Sq. ft)?</Label>
//               <Input
//                 id="terraceSize"
//                 type="number"
//                 placeholder="Enter Roof Area"
//                 value={estimateData.terraceSize}
//                 onChange={(e) => handleEstimateChange('terraceSize', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Do you face regular power cuts?</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant={estimateData.powerCuts === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'Yes')}>Yes</Button>
//                 <Button variant={estimateData.powerCuts === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'No')}>No</Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label>When are you planning to get Solar?</Label>
//               <div className="grid grid-cols-1 gap-2">
//                 <Button variant={estimateData.planning === 'Immediately' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', 'Immediately')}>Immediately</Button>
//                 <Button variant={estimateData.planning === '3 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '3 Months')}>In 3 months</Button>
//                 <Button variant={estimateData.planning === '6 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '6 Months')}>In 6 months</Button>
//               </div>
//             </div>
//             <Button onClick={() => setStep(3)} className="w-full">Next</Button>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-4">
//             <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleShareLocation}>
//               <MapPin className="h-4 w-4" /> Share my current Location
//             </Button>
//             <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">or</span></div></div>
//             <div className="space-y-2">
//               <Label htmlFor="fullAddress">Enter your full address</Label>
//               <Input id="fullAddress" value={estimateData.fullAddress} onChange={(e) => handleEstimateChange('fullAddress', e.target.value)} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="landmark">Landmark</Label>
//               <Input id="landmark" value={estimateData.landmark} onChange={(e) => handleEstimateChange('landmark', e.target.value)} />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="space-y-2"><Label>PIN Code</Label><Input value={formData.pinCode} readOnly /></div>
//                 <div className="space-y-2"><Label>City</Label><Input value={formData.city || "Varanasi"} readOnly /></div>
//                 <div className="space-y-2"><Label>State</Label><Input value="Uttar Pradesh" readOnly /></div>
//             </div>
//             <Button onClick={handleGetEstimates} disabled={loading} className="w-full">{loading ? "Calculating..." : "Get Estimates"}</Button>
//           </div>
//         );
//       case 4:
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="text-center space-y-4"
//           >
//             <h3 className="text-2xl font-bold text-blue-900">Your Solar Estimate</h3>
//             <div className="bg-blue-50 p-4 rounded-lg space-y-2">
//                 <p className="text-sm text-gray-600">Required System Size</p>
//                 <p className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
//                   <Zap className="h-8 w-8 text-yellow-500" />{results.systemSize} kW
//                 </p>
//                 <p className="text-sm text-gray-600">Approx. Roof Area Needed</p>
//                 <p className="text-xl font-bold text-gray-800">{results.requiredRoofArea} sq. ft.</p>
//                 <p className="text-xs text-gray-500 mt-2">Do not have required roof area? Our consultants will guide you. <Link to="/contact" className="underline">Get in touch</Link>.</p>
//             </div>
//             <h3 className="text-xl font-bold pt-4">Estimated Savings</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-white">
//               <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">Monthly</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.monthlySavings.toLocaleString('en-IN')}</p>
//               </div>
//               <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">Yearly</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.yearlySavings.toLocaleString('en-IN')}</p>
//               </div>
//               <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
//                   <p className="text-sm">5-Year Guaranteed</p>
//                   <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.fiveYearSavings.toLocaleString('en-IN')}</p>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2 mt-4">
//                 <p className="flex items-center gap-2"><PiggyBank className="text-green-600" /><strong>Gross System Cost:</strong> ₹{results.grossCost.toLocaleString('en-IN')}</p>
//                 <p className="flex items-center gap-2"><IndianRupee className="text-yellow-600" /><strong>Net Cost (after subsidy):</strong> ₹{results.netCost.toLocaleString('en-IN')}</p>
//                 <p className="flex items-center gap-2"><Timer className="text-orange-600" /><strong>Estimated Payback Period:</strong> {results.paybackYears} years</p>
//                 <p className="flex items-center gap-2"><Leaf className="text-green-700" /><strong>CO₂ Savings:</strong> {results.co2Savings} tons/year</p>
//             </div>
//             <Button onClick={() => setStep(0)} variant="outline" className="mt-4">Start New Estimate</Button>
//           </motion.div>
//         );
//       default:
//         return null;
//     }
//   };

//   const progressBarValue = step > 0 && step < 4 ? (step / TOTAL_ESTIMATE_STEPS) * 100 : (step === 4 ? 100 : 0);

//   return (
//     <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border">
//       <CardHeader className="relative pb-4">
//         <div className="flex items-center gap-4">
//           {step > 0 && step < 4 && (
//             <Button variant="ghost" size="icon" onClick={goBack}><ArrowLeft className="h-4 w-4"/></Button>
//           )}
//           <CardTitle className="text-blue-900">{getStepTitle()}</CardTitle>
//         </div>
//         {step > 0 && step < 4 && (
//           <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
//             <motion.div
//               className="bg-orange-500 h-full rounded-full"
//               animate={{ width: `${progressBarValue}%` }}
//               transition={{ duration: 0.5, ease: "easeInOut" }}
//             />
//           </div>
//         )}
//       </CardHeader>
//       <CardContent className="p-6 pt-2">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//           >
//             {renderFormContent()}
//           </motion.div>
//         </AnimatePresence>
//       </CardContent>
//     </Card>
//   );
// };










import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Zap, Leaf, IndianRupee, PiggyBank, Timer, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- TYPES AND CONSTANTS ---
type CustomerType = "Residential" | "Commercial";
const BILL_RANGES = [
  "Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000",
  "₹4000 - ₹8000", "More than ₹8000",
];
const TOTAL_ESTIMATE_STEPS = 3;

export type ProductSystem = {
  brand: string;
  size: number;
  phase: string;
  modules?: number;
  price?: number;
};

// --- HELPER FUNCTIONS ---
const convertBillRangeToNumber = (range: string): number | null => {
  if (!range) return null;
  switch (range) {
    case "Less than ₹1500": return 1000;
    case "₹1500 - ₹2500": return 2000;
    case "₹2500 - ₹4000": return 3250;
    case "₹4000 - ₹8000": return 6000;
    case "More than ₹8000": return 9000;
    default:
      const parsed = parseFloat(range);
      return isNaN(parsed) ? null : parsed;
  }
};

// --- MAIN COMPONENT ---
export const HeroGetQuote = () => {
  const { toast } = useToast();

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newlyCreatedQuoteId, setNewlyCreatedQuoteId] = useState<string | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType>("Residential");
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" });
  const [estimateData, setEstimateData] = useState({ roofOwnership: "", constructed: "", roofType: "", terraceSize: "" as string | number, powerCuts: "", planning: "", fullAddress: "", landmark: "", latitude: null as number | null, longitude: null as number | null });
  const [results, setResults] = useState({ systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0, grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0 });
  
  const [productCatalog, setProductCatalog] = useState<{
    residential: ProductSystem[];
    commercial: ProductSystem[];
  }>({ residential: [], commercial: [] });
  const [recommendedProduct, setRecommendedProduct] = useState<ProductSystem | null>(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [tataRes, shaktiRes, relianceRes, relianceLargeRes] = await Promise.all([
          supabase.from("tata_grid_tie_systems").select("system_size, no_of_modules, phase, total_price"),
          supabase.from("shakti_grid_tie_systems").select("system_size, no_of_modules, phase, pre_gi_elevated_price"),
          supabase.from("reliance_grid_tie_systems").select("system_size, no_of_modules, phase, hdg_elevated_price"),
          supabase.from("reliance_large_systems").select("system_size_kwp, no_of_modules, phase, hdg_elevated_rcc_price"),
        ]);
        
        const residentialProducts: ProductSystem[] = [];
        const commercialProducts: ProductSystem[] = [];

        if (tataRes.data) {
          tataRes.data.forEach((p: any) => residentialProducts.push({ brand: 'Tata', size: p.system_size, modules: p.no_of_modules, phase: p.phase, price: p.total_price }));
        }
        if (shaktiRes.data) {
          shaktiRes.data.forEach((p: any) => residentialProducts.push({ brand: 'Shakti', size: p.system_size, modules: p.no_of_modules, phase: p.phase, price: p.pre_gi_elevated_price }));
        }
        if (relianceRes.data) {
          relianceRes.data.forEach((p: any) => residentialProducts.push({ brand: 'Reliance', size: p.system_size, modules: p.no_of_modules, phase: p.phase, price: p.hdg_elevated_price }));
        }
        if (relianceLargeRes.data) {
          relianceLargeRes.data.forEach((p: any) => commercialProducts.push({ brand: 'Reliance', size: p.system_size_kwp, modules: p.no_of_modules, phase: p.phase, price: p.hdg_elevated_rcc_price }));
        }

        setProductCatalog({ residential: residentialProducts, commercial: commercialProducts });

      } catch (error) {
        console.error("Error fetching products:", error);
        toast({ title: "Warning", description: "Could not load product suggestion data.", variant: "destructive" });
      }
    };
    fetchAllProducts();
  }, [toast]);

  // --- CALCULATION CONSTANTS & HANDLERS ---
  const stateTariffs: Record<string, number> = { "Uttar Pradesh": 7.2, Delhi: 8, Maharashtra: 9, Gujarat: 7, Rajasthan: 8.5 };
  const avgSolarGenerationPerKWMonth = 120;
  const avgRoofAreaPerKW = 60;
  const systemCostPerKW = 60000;
  const subsidyPerKW = 18000;
  const maxSubsidy = 108000;
  const co2SavingPerKWYear = 1.2;

  const handleInputChange = (field: keyof typeof formData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleEstimateChange = (field: keyof typeof estimateData, value: string | number) => setEstimateData((prev) => ({ ...prev, [field]: value }));
  const handleCustomerTypeChange = (type: CustomerType) => { setCustomerType(type); setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" }); };
  
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Agreement Required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const dataToInsert = {
        name: formData.fullName,
        phone: formData.whatsappNumber,
        customer_type: customerType.toLowerCase(),
        company_name: customerType === "Commercial" ? formData.companyName : null,
        project_location: `${formData.city}, ${formData.pinCode}`,
        source: "Hero Quote Form",
        monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
      };
      const { data, error } = await supabase.from("solar_quote_requests").insert(dataToInsert).select('id').single();
      if (error) throw error;
      if (data) setNewlyCreatedQuoteId(data.id);
      toast({ title: "Details Saved!", description: "Now, let's get you a quick estimate." });
      setStep(1);
    } catch (error: any) {
      toast({ title: "Submission Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setEstimateData(prev => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
            toast({ title: "Location Shared!", description: "We've got your coordinates." });
          },
          () => {
            toast({ title: "Location Error", description: "Could not retrieve your location.", variant: "destructive" });
          }
        );
      } else {
        toast({ title: "Geolocation Not Supported", description: "Your browser does not support geolocation.", variant: "destructive" });
      }
  };

  const handleGetEstimates = async () => {
    setLoading(true);
    const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0;
    const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"];
    const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0;
    let systemSize = 0;
    if (estimatedMonthlyConsumption > 0) { systemSize = Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9); }
    systemSize = Math.max(1, Math.min(systemSize, 100));
    const requiredRoofArea = systemSize * avgRoofAreaPerKW;
    const grossCost = systemSize * systemCostPerKW;
    const applicableSubsidy = Math.min(systemSize * subsidyPerKW, maxSubsidy);
    const netCost = Math.max(0, grossCost - applicableSubsidy);
    const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9);
    const yearlySavings = monthlySavings * 12;
    const fiveYearSavings = yearlySavings * 5;
    let paybackYears = 0;
    if (netCost > 0 && monthlySavings > 0) { paybackYears = parseFloat((netCost / (monthlySavings * 12)).toFixed(1)); }
    const co2Savings = systemSize * co2SavingPerKWYear;
    setResults({ systemSize, requiredRoofArea: Math.round(requiredRoofArea), monthlySavings, yearlySavings, fiveYearSavings, grossCost, netCost, paybackYears, co2Savings: parseFloat(co2Savings.toFixed(1)) });

    const productSource = customerType === 'Residential' ? productCatalog.residential : productCatalog.commercial;
    if (productSource.length > 0) {
      const suitableProducts = productSource
        .filter(p => p.size >= systemSize)
        .sort((a, b) => a.size - b.size);

      if (suitableProducts.length > 0) {
        setRecommendedProduct(suitableProducts[0]);
      } else {
        setRecommendedProduct(null);
      }
    }

    try {
      if (!newlyCreatedQuoteId) throw new Error("No quote ID found to update.");
      const dataToUpdate = {
        estimated_area_sqft: Number(estimateData.terraceSize) || null,
        mounting_type: estimateData.roofType || null,
        power_demand_kw: systemSize,
      };
      const { error } = await supabase.from("solar_quote_requests").update(dataToUpdate).eq('id', newlyCreatedQuoteId);
      if (error) throw error;
      setStep(4);
    } catch (error: any) {
      toast({ title: "Update Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => setStep(prev => prev - 1);
  const getStepTitle = () => {
    switch (step) {
      case 1: return "Quick Estimates (Step 1/3)";
      case 2: return "Quick Estimates (Step 2/3)";
      case 3: return "Quick Estimates (Step 3/3)";
      case 4: return "Your Solar Estimate Results";
      default: return "Get a Free Solar Quote";
    }
  };

  const renderFormContent = () => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
              {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
                <Button key={type} type="button" onClick={() => handleCustomerTypeChange(type)} variant="ghost" className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${customerType === type ? "bg-white text-blue-900 shadow" : "text-gray-500 hover:bg-gray-200"}`}>{type}</Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
              <Input id="fullName" required value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
            </div>
            {customerType === 'Commercial' ? (
              <>
                <div className="space-y-2"><Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label><Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="city">City <span className="text-red-500">*</span></Label><Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="pinCodeCommercial">Pin code</Label><Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div></div>
                <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label><Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} /></div>
              </>
            ) : (
              <>
                <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label><Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div>
                <div className="space-y-2"><Label>What is your average monthly bill? <span className="text-red-500">*</span></Label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<Button key={range} type="button" variant={formData.monthlyBill === range ? "default" : "outline"} onClick={() => handleInputChange("monthlyBill", range)} className="justify-center text-center h-auto py-2 px-2 text-sm">{range}</Button>))}</div></div>
              </>
            )}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">I agree to Arpit Solar Shop's <Link to="/terms-of-service" target="_blank" className="underline font-medium hover:text-primary">terms of service</Link> & <Link to="/privacy-policy" target="_blank" className="underline font-medium hover:text-primary">privacy policy</Link></Label>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full text-white font-bold text-base h-12 bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity">{loading ? "Submitting..." : "Submit Details"}</Button>
          </form>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Do you have roof ownership?</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button variant={estimateData.roofOwnership === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'Yes')}>Yes</Button>
                <Button variant={estimateData.roofOwnership === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofOwnership', 'No')}>No</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Is your house fully constructed?</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button variant={estimateData.constructed === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'Yes')}>Yes</Button>
                <Button variant={estimateData.constructed === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('constructed', 'No')}>No</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select the roof type</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button variant={estimateData.roofType === 'Concrete' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Concrete')}>Concrete Roof</Button>
                <Button variant={estimateData.roofType === 'Metal' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Metal')}>Metal Sheet Roof</Button>
                <Button variant={estimateData.roofType === 'Brick' ? 'default' : 'outline'} onClick={() => handleEstimateChange('roofType', 'Brick')}>Brick Roof</Button>
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">Next</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="terraceSize">What is the Approx. Terrace Size (in Sq. ft)?</Label>
              <Input id="terraceSize" type="number" placeholder="Enter Roof Area" value={estimateData.terraceSize} onChange={(e) => handleEstimateChange('terraceSize', e.target.value === '' ? '' : parseInt(e.target.value, 10))}/>
            </div>
            <div className="space-y-2">
              <Label>Do you face regular power cuts?</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button variant={estimateData.powerCuts === 'Yes' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'Yes')}>Yes</Button>
                <Button variant={estimateData.powerCuts === 'No' ? 'default' : 'outline'} onClick={() => handleEstimateChange('powerCuts', 'No')}>No</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>When are you planning to get Solar?</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button variant={estimateData.planning === 'Immediately' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', 'Immediately')}>Immediately</Button>
                <Button variant={estimateData.planning === '3 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '3 Months')}>In 3 months</Button>
                <Button variant={estimateData.planning === '6 Months' ? 'default' : 'outline'} onClick={() => handleEstimateChange('planning', '6 Months')}>In 6 months</Button>
              </div>
            </div>
            <Button onClick={() => setStep(3)} className="w-full">Next</Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleShareLocation}>
              <MapPin className="h-4 w-4" /> Share my current Location
            </Button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">or</span></div></div>
            <div className="space-y-2">
              <Label htmlFor="fullAddress">Enter your full address</Label>
              <Input id="fullAddress" value={estimateData.fullAddress} onChange={(e) => handleEstimateChange('fullAddress', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input id="landmark" value={estimateData.landmark} onChange={(e) => handleEstimateChange('landmark', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>PIN Code</Label><Input value={formData.pinCode} readOnly /></div>
                <div className="space-y-2"><Label>City</Label><Input value={formData.city || "Varanasi"} readOnly /></div>
                <div className="space-y-2"><Label>State</Label><Input value="Uttar Pradesh" readOnly /></div>
            </div>
            <Button onClick={handleGetEstimates} disabled={loading} className="w-full">{loading ? "Calculating..." : "Get Estimates"}</Button>
          </div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-blue-900">Your Solar Estimate</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Required System Size</p>
                <p className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-2">
                  <Zap className="h-8 w-8 text-yellow-500" />{results.systemSize} kW
                </p>
                <p className="text-sm text-gray-600">Approx. Roof Area Needed</p>
                <p className="text-xl font-bold text-gray-800">{results.requiredRoofArea} sq. ft.</p>
            </div>
            {recommendedProduct ? (
              <div className="bg-green-50 p-4 rounded-lg space-y-2 border-l-4 border-green-500 text-left">
                <h4 className="text-lg font-bold text-green-900 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Our Product Recommendation
                </h4>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="font-bold text-gray-900">{recommendedProduct.brand}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <p className="text-sm text-gray-600">System Size</p>
                        <p className="font-bold text-gray-900">{recommendedProduct.size} kWp</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Phase</p>
                        <p className="font-bold text-gray-900">{recommendedProduct.phase}</p>
                    </div>
                </div>
                {recommendedProduct.price && (
                    <div className="pt-2 border-t mt-3">
                        <p className="text-sm text-gray-600">Estimated Total Price</p>
                        <p className="text-2xl font-bold text-green-800">₹{recommendedProduct.price.toLocaleString('en-IN')}</p>
                    </div>
                )}
              </div>
            ) : (
                <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                    Contact us for a custom product recommendation based on your needs.
                </div>
            )}
            <h3 className="text-xl font-bold pt-4">Estimated Savings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-white">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
                    <p className="text-sm">Monthly</p>
                    <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.monthlySavings.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
                    <p className="text-sm">Yearly</p>
                    <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.yearlySavings.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-700 p-3 rounded-lg flex flex-col justify-center items-center h-28">
                    <p className="text-sm">5-Year Guaranteed</p>
                    <p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{results.fiveYearSavings.toLocaleString('en-IN')}</p>
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2 mt-4">
                <p className="flex items-center gap-2"><PiggyBank className="text-green-600" /><strong>Gross System Cost:</strong> ₹{results.grossCost.toLocaleString('en-IN')}</p>
                <p className="flex items-center gap-2"><IndianRupee className="text-yellow-600" /><strong>Net Cost (after subsidy):</strong> ₹{results.netCost.toLocaleString('en-IN')}</p>
                <p className="flex items-center gap-2"><Timer className="text-orange-600" /><strong>Estimated Payback Period:</strong> {results.paybackYears} years</p>
                <p className="flex items-center gap-2"><Leaf className="text-green-700" /><strong>CO₂ Savings:</strong> {results.co2Savings} tons/year</p>
            </div>
            <Button onClick={() => setStep(0)} variant="outline" className="mt-4">Start New Estimate</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const progressBarValue = step > 0 && step < 4 ? (step / TOTAL_ESTIMATE_STEPS) * 100 : (step === 4 ? 100 : 0);

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border">
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-4">
          {step > 0 && step < 4 && (
            <Button variant="ghost" size="icon" onClick={goBack}><ArrowLeft className="h-4 w-4"/></Button>
          )}
          <CardTitle className="text-blue-900">{getStepTitle()}</CardTitle>
        </div>
        {step > 0 && step < 4 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
            <motion.div
              className="bg-orange-500 h-full rounded-full"
              animate={{ width: `${progressBarValue}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            {renderFormContent()}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};















// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ArrowLeft, Check, IndianRupee, Leaf, MapPin, PiggyBank, Timer, Zap, ShoppingCart } from "lucide-react"
// import { supabase } from "@/integrations/supabase/client"

// // --- TYPES ---
// type CustomerType = "Residential" | "Commercial"
// type ProductSystem = { brand: string; size: number; phase: string; price?: number; mountingType?: string }
// type QuoteFormData = { fullName: string; whatsappNumber: string; pinCode: string; companyName?: string; city: string; monthlyBill: string }
// type EstimateData = { roofOwnership: "" | "Yes" | "No"; constructed: "" | "Yes" | "No"; roofType: "" | "Concrete" | "Metal" | "Brick"; terraceSize: string; powerCuts: "" | "Yes" | "No"; planning: "" | "Immediately" | "3 Months" | "6 Months"; fullAddress: string; landmark: string; latitude: number | null; longitude: number | null }
// type Results = { systemSize: number; requiredRoofArea: number; monthlySavings: number; yearlySavings: number; fiveYearSavings: number; grossCost: number; netCost: number; paybackYears: number; co2Savings: number }
// type ProductCatalog = { residential: ProductSystem[]; commercial: ProductSystem[] }

// // --- CONSTANTS & HELPERS ---
// const BILL_RANGES = ["Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000", "₹4000 - ₹8000", "More than ₹8000"]
// const TOTAL_ESTIMATE_STEPS = 3
// const convertBillRangeToNumber = (range: string): number | null => {
//   if (!range) return null;
//   switch (range) {
//     case "Less than ₹1500": return 1000;
//     case "₹1500 - ₹2500": return 2000;
//     case "₹2500 - ₹4000": return 3250;
//     case "₹4000 - ₹8000": return 6000;
//     case "More than ₹8000": return 9000;
//     default:
//       const parsed = Number.parseFloat(range);
//       return isNaN(parsed) ? null : parsed;
//   }
// };

// // --- STYLING CONSTANTS ---
// const inputBase = "w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary px-3 py-2 text-sm"
// const buttonBase = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none"
// const buttonPrimary = `${buttonBase} bg-primary text-primary-foreground hover:opacity-90`
// const buttonOutline = `${buttonBase} border hover:bg-muted`
// const chip = "rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"

// // --- CUSTOM HOOKS & SUB-COMPONENTS ---
// function useInlineToast() {
//   const [msg, setMsg] = useState<{ title: string; desc?: string } | null>(null)
//   useEffect(() => {
//     if (!msg) return
//     const t = setTimeout(() => setMsg(null), 2400)
//     return () => clearTimeout(t)
//   }, [msg])
//   return { msg, setMsg }
// }

// function Stepper({ current, total, labels }: { current: number; total: number; labels: string[] }) {
//   return (
//     <div className="w-full">
//       <ol className="flex items-center gap-2" aria-label="Progress">
//         {Array.from({ length: total }).map((_, i) => {
//           const idx = i + 1
//           const isActive = idx <= current
//           return (
//             <li key={idx} className="flex-1">
//               <div className="flex items-center gap-2">
//                 <div className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold ${isActive ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground"}`} >
//                   {isActive ? <Check className="h-4 w-4" /> : idx}
//                 </div>
//                 {i < total - 1 && <div className={`h-1 w-full rounded-full ${i + 1 < current ? "bg-primary" : "bg-muted"}`} />}
//               </div>
//             </li>
//           )
//         })}
//       </ol>
//     </div>
//   )
// }

// // --- MAIN COMPONENT ---
// export function HeroGetQuote() {
//   const [productCatalog, setProductCatalog] = useState<ProductCatalog | null>(null)
//   const [catalogLoading, setCatalogLoading] = useState<boolean>(true)
//   const [catalogError, setCatalogError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchAndNormalizeProducts = async () => {
//       try {
//         const [tataRes, shaktiRes, relianceRes, relianceLargeRes] = await Promise.all([
//           supabase.from('tata_grid_tie_systems').select('*'),
//           supabase.from('shakti_grid_tie_systems').select('*'),
//           supabase.from('reliance_grid_tie_systems').select('*'),
//           supabase.from('reliance_large_systems').select('*')
//         ]);

//         if (tataRes.error) throw new Error(`Tata fetch failed: ${tataRes.error.message}`);
//         if (shaktiRes.error) throw new Error(`Shakti fetch failed: ${shaktiRes.error.message}`);
//         if (relianceRes.error) throw new Error(`Reliance fetch failed: ${relianceRes.error.message}`);
//         if (relianceLargeRes.error) throw new Error(`Reliance Large fetch failed: ${relianceLargeRes.error.message}`);

//         const tataProducts: ProductSystem[] = tataRes.data.map((p: any) => ({ brand: 'Tata', size: Number(p.system_size), phase: p.phase, price: Number(p.total_price) }));
//         const shaktiProducts: ProductSystem[] = shaktiRes.data.map((p: any) => ({ brand: 'Shakti', size: Number(p.system_size), phase: p.phase, price: Number(p.pre_gi_elevated_price) }));
//         const relianceProducts: ProductSystem[] = relianceRes.data.map((p: any) => ({ brand: 'Reliance', size: Number(p.system_size), phase: p.phase, price: Number(p.hdg_elevated_price) }));
//         const relianceLargeProducts: ProductSystem[] = [];

//         relianceLargeRes.data.forEach((p: any) => {
//           const size = Number(p.system_size_kwp);
//           const phase = p.phase;
//           // Use total prices; fallback to per_watt * size if total is null/0/NaN
//           const getPrice = (totalField: string, perWattField: string): number => {
//             let totalPrice = Number(p[totalField]);
//             if (isNaN(totalPrice) || totalPrice <= 0) {
//               const perWatt = Number(p[perWattField]);
//               totalPrice = perWatt > 0 && size > 0 ? Math.round(perWatt * size * 1000) : 0; // Assuming per_watt is ₹/W, so *1000 for kWp
//             }
//             return totalPrice;
//           };
//           const prices: Record<string, number> = {
//             "Tin Shed": getPrice('short_rail_tin_shed_price', 'short_rail_tin_shed_price_per_watt'),
//             "RCC Elevated": getPrice('hdg_elevated_rcc_price', 'hdg_elevated_rcc_price_per_watt'),
//             "Pre GI MMS": getPrice('pre_gi_mms_price', 'pre_gi_mms_price_per_watt'),
//             "Without MMS": getPrice('price_without_mms_price', 'price_without_mms_price_per_watt'),
//           };
//           Object.entries(prices).forEach(([mountingType, price]) => {
//             if (price > 0) {
//               relianceLargeProducts.push({ brand: 'Reliance', size, phase, price, mountingType });
//             }
//           });
//         });

//         const allProducts = [...tataProducts, ...shaktiProducts, ...relianceProducts, ...relianceLargeProducts].filter(p => p.size > 0);



//         const residential: ProductSystem[] = allProducts.filter(p => p.size <= 13.8);  // ≤13.8: Residential (homes up to your max 13.8 kWp)
//         const commercial: ProductSystem[] = allProducts.filter(p => p.size > 13.8);    // >13.8: Commercial (e.g., 17.25, 34.5, etc.)

//         console.log('Fetched Commercial Products:', commercial); // Debug log for pricing
//         setProductCatalog({ residential, commercial });

//       } catch (error: any) {
//         setCatalogError(error.message || "Could not load product catalog.");
//         console.error(error);
//       } finally {
//         setCatalogLoading(false);
//       }
//     };

//     fetchAndNormalizeProducts();
//   }, []);

//   const stateTariffs: Record<string, number> = { "Uttar Pradesh": 7.2 }
//   const avgSolarGenerationPerKWMonth = 120
//   const avgRoofAreaPerKW = 60
//   const systemCostPerKW = 60000
//   const subsidyPerKW = 18000
//   const maxSubsidy = 108000
//   const co2SavingPerKWYear = 1.2

//   const [step, setStep] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [customerType, setCustomerType] = useState<CustomerType>("Residential")
//   const [agreed, setAgreed] = useState(false)
//   const [submittingProductId, setSubmittingProductId] = useState<string | null>(null)

//   const [formData, setFormData] = useState<QuoteFormData>({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" })
//   const [estimateData, setEstimateData] = useState<EstimateData>({ roofOwnership: "", constructed: "", roofType: "", terraceSize: "", powerCuts: "", planning: "", fullAddress: "", landmark: "", latitude: null, longitude: null })
//   const [results, setResults] = useState<Results>({ systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0, grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0 })
//   const [recommendedProducts, setRecommendedProducts] = useState<ProductSystem[]>([])

//   const { msg, setMsg } = useInlineToast()

//   const updateForm = (k: keyof QuoteFormData, v: string) => setFormData((p) => ({ ...p, [k]: v }))
//   const updateEstimate = (k: keyof EstimateData, v: EstimateData[typeof k]) => setEstimateData((p) => ({ ...p, [k]: v }))

//   const detailsValid = formData.fullName.trim() && formData.whatsappNumber.trim() && (customerType === "Residential" ? formData.pinCode.trim() : true) && (customerType === "Commercial" ? formData.companyName?.trim() : true) && formData.monthlyBill.trim() && agreed
//   const progressPct = step > 0 && step < 4 ? Math.round((step / TOTAL_ESTIMATE_STEPS) * 100) : step === 4 ? 100 : 0

//   const getStepTitle = () => {
//     switch (step) {
//       case 1: return "Quick Estimates (Step 1/3)"
//       case 2: return "Quick Estimates (Step 2/3)"
//       case 3: return "Quick Estimates (Step 3/3)"
//       case 4: return "Your Solar Estimate"
//       default: return "Get a Free Solar Quote"
//     }
//   }

//   const handleCalculate = async () => {
//     if (!productCatalog) {
//       setMsg({ title: "Products are still loading, please wait." });
//       return;
//     }
//     setLoading(true)
//     try {
//       const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0
//       const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"]
//       const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0
//       const systemSize = Math.max(1, Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9))

//       const grossCost = systemSize * systemCostPerKW
//       const netCost = Math.max(0, grossCost - Math.min(systemSize * subsidyPerKW, maxSubsidy))
//       const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9)

//       setResults({ systemSize, requiredRoofArea: Math.round(systemSize * avgRoofAreaPerKW), monthlySavings, yearlySavings: monthlySavings * 12, fiveYearSavings: monthlySavings * 60, grossCost, netCost, paybackYears: netCost > 0 && monthlySavings > 0 ? Number.parseFloat((netCost / (monthlySavings * 12)).toFixed(1)) : 0, co2Savings: Number.parseFloat((systemSize * co2SavingPerKWYear).toFixed(1)) })

//       const source = customerType === "Residential" ? productCatalog.residential : productCatalog.commercial
//       if (source && source.length) {
//         const brands = [...new Set(source.map(p => p.brand))];
//         const recommendations: ProductSystem[] = []
//         brands.forEach(brand => {
//           const brandProducts = source.filter(p => p.brand === brand)
//           if (brandProducts.length > 0) {
//             if (brand === 'Reliance' && customerType === 'Commercial') {
//               // Group Reliance commercial by size and pick closest size, then all mounting variants
//               const grouped = brandProducts.reduce((acc, p) => {
//                 if (!acc[p.size]) acc[p.size] = [];
//                 acc[p.size].push(p);
//                 return acc;
//               }, {} as Record<number, ProductSystem[]>);
//               const sizes = Object.keys(grouped).map(Number);
//               if (sizes.length > 0) {
//                 const closestSize = sizes.reduce((prev, curr) => Math.abs(curr - systemSize) < Math.abs(prev - systemSize) ? curr : prev);
//                 recommendations.push(...grouped[closestSize]);
//               }
//             } else {
//               // For other brands or residential, pick closest
//               const closestProduct = brandProducts.reduce((prev, curr) => (Math.abs(curr.size - systemSize) < Math.abs(prev.size - systemSize) ? curr : prev))
//               recommendations.push(closestProduct)
//             }
//           }
//         })
//         console.log('Recommended Products:', recommendations); // Debug log for recommendations
//         setRecommendedProducts(recommendations)
//       } else {
//         setRecommendedProducts([])
//       }
//       setStep(4)
//     } catch (e) {
//       setMsg({ title: "Calculation error", desc: "Please check details and try again." })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmitDetails = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!detailsValid) return setMsg({ title: "Please complete required fields" })
//     setLoading(true)
//     console.log("INITIAL DETAILS SUBMITTED:", { form: formData, customerType });
//     setTimeout(() => {
//       setMsg({ title: "Details saved", desc: "Let’s get a quick estimate." })
//       setStep(1)
//       setLoading(false)
//     }, 500);
//   }

//   const handleShareLocation = () => {
//     if (!navigator.geolocation) return setMsg({ title: "Geolocation not supported" })
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         updateEstimate("latitude", pos.coords.latitude)
//         updateEstimate("longitude", pos.coords.longitude)
//         setMsg({ title: "Location shared" })
//       },
//       () => setMsg({ title: "Location error", desc: "Try manual address." }),
//     )
//   }

//   const handleDirectQuote = async (product: ProductSystem) => {
//     const id = `${product.brand}-${product.size}-${product.mountingType ?? 'default'}`
//     setSubmittingProductId(id)
//     try {
//       const formattedPayload = {
//         name: formData.fullName,
//         phone: formData.whatsappNumber,
//         email: null,
//         entity_type: null,
//         solution_classification: null,
//         estimated_area_sqft: Number(estimateData.terraceSize) || null,
//         monthly_bill: formData.monthlyBill,
//         // --- THIS IS THE FIX ---
//         // Send the size of the SELECTED product, not the original calculation.
//         power_demand_kw: product.size,
//         // -----------------------
//         project_location: `${estimateData.fullAddress}, ${formData.pinCode}`,
//         referral_name: null,
//         referral_phone: null,
//         product_name: `${product.size} kWp Solar System (${product.phase}-Phase)${product.mountingType ? ` - ${product.mountingType}` : ''}`,
//         product_category: product.brand,
//         source: "Quote Form",
//         customer_type: customerType.toLowerCase(),
//         referral_source: null,
//         phase: product.phase,
//         mounting_type: product.mountingType || null,

//         latitude: estimateData.latitude,
// longitude: estimateData.longitude,

//       }

//       console.log("SENDING TO BACKEND:", formattedPayload)

//       const res = await fetch("https://solar-quote-server.onrender.com/generate-quote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedPayload),
//       })

//       if (!res.ok) {
//         throw new Error(`Server responded with status ${res.status}`)
//       }

//       setMsg({ title: "Quote request sent successfully!", desc: "We will get back to you shortly." })

//     } catch (err: any) {
//       setMsg({ title: "Submission Failed", desc: err?.message ?? "Please try again later." })
//     } finally {
//       setSubmittingProductId(null)
//     }
//   }

//   if (catalogLoading) {
//     return <section className="w-full max-w-xl mx-auto p-8 text-center"><div>Loading Products from Database...</div></section>
//   }
//   if (catalogError) {
//     return <section className="w-full max-w-xl mx-auto p-8 text-center text-red-600"><div>Error: {catalogError}</div></section>
//   }

//   return (
//     <section className="w-full max-w-xl mx-auto px-4 sm:px-0">
//       <div className="rounded-2xl border bg-background shadow-sm">
//         <div className="p-5 border-b">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             {step > 0 && step < 4 ? (<button type="button" className={`${buttonOutline} h-9 w-9 p-0`} onClick={() => setStep((s) => Math.max(0, s - 1))} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></button>) : <div />}
//             <h2 className="text-lg font-semibold text-foreground text-balance">{getStepTitle()}</h2>
//             <div className="text-sm text-muted-foreground">{progressPct}%</div>
//           </div>
//           {step > 0 && step < 4 && (<div className="mt-4"><Stepper current={step} total={TOTAL_ESTIMATE_STEPS} labels={["Site", "Context", "Location"]} /></div>)}
//         </div>
//         <div className="p-5">
//           <AnimatePresence>
//             {msg && (<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-sm" role="status" aria-live="polite" ><p className="font-medium">{msg.title}</p>{msg.desc && <p className="text-muted-foreground">{msg.desc}</p>}</motion.div>)}
//           </AnimatePresence>
//           <AnimatePresence mode="wait">
//             <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease: "easeOut" }} >
//               {step === 0 && (
//                 <form onSubmit={handleSubmitDetails} className="space-y-5">
//                   <div className="bg-muted/40 rounded-full p-1 grid grid-cols-2 gap-1">
//                     {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
//                       <button key={type} type="button" onClick={() => { setCustomerType(type); setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" }) }} className={`h-9 rounded-full text-sm font-semibold transition-colors ${customerType === type ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`} aria-pressed={customerType === type}>
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="space-y-1.5"><label htmlFor="fullName" className="text-sm">Full Name <span className="text-destructive">*</span></label><input id="fullName" required className={inputBase} value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} /></div>
//                   {customerType === "Commercial" ? (
//                     <>
//                       <div className="space-y-1.5"><label htmlFor="companyName" className="text-sm">Company Name <span className="text-destructive">*</span></label><input id="companyName" required className={inputBase} value={formData.companyName ?? ""} onChange={(e) => updateForm("companyName", e.target.value)} /></div>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-1.5"><label htmlFor="city" className="text-sm">City <span className="text-destructive">*</span></label><input id="city" required className={inputBase} value={formData.city} onChange={(e) => updateForm("city", e.target.value)} /></div>
//                         <div className="space-y-1.5"><label htmlFor="pinCommercial" className="text-sm">PIN Code</label><input id="pinCommercial" className={inputBase} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value)} /></div>
//                       </div>
//                       <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm("whatsappNumber", e.target.value)} /></div>
//                       <div className="space-y-1.5"><label htmlFor="bill" className="text-sm">Average Monthly Bill <span className="text-destructive">*</span></label><input id="bill" type="number" required className={inputBase} placeholder="Enter amount in ₹" value={formData.monthlyBill} onChange={(e) => updateForm("monthlyBill", e.target.value)} /></div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm("whatsappNumber", e.target.value)} /></div>
//                       <div className="space-y-1.5"><label htmlFor="pin" className="text-sm">PIN Code <span className="text-destructive">*</span></label><input id="pin" required className={inputBase} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value)} /></div>
//                       <div className="space-y-1.5">
//                         <span className="text-sm">Average monthly bill? <span className="text-destructive">*</span></span>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<button key={range} type="button" onClick={() => updateForm("monthlyBill", range)} className={`${chip} ${formData.monthlyBill === range ? "bg-primary text-primary-foreground border-primary" : ""}`} aria-pressed={formData.monthlyBill === range}>{range}</button>))}</div>
//                       </div>
//                     </>
//                   )}
//                   <div className="flex items-start gap-3 pt-2"><input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border" /><label htmlFor="agree" className="text-sm text-muted-foreground">I agree to the terms of service & privacy policy.</label></div>
//                   <button type="submit" disabled={loading} className={`${buttonPrimary} w-full h-11 font-semibold`}>{loading ? "Submitting..." : "Submit Details"}</button>
//                 </form>
//               )}
//               {step === 1 && (
//                 <div className="space-y-6">
//                   <div className="space-y-1.5"><span className="text-sm">Do you have roof ownership?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("roofOwnership", v)} className={`${chip} ${estimateData.roofOwnership === v ? "bg-primary text-primary-foreground border-primary" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">Is your house fully constructed?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("constructed", v)} className={`${chip} ${estimateData.constructed === v ? "bg-primary text-primary-foreground border-primary" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">Select the roof type</span><div className="grid grid-cols-1 gap-2">{(["Concrete", "Metal", "Brick"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("roofType", v)} className={`${chip} ${estimateData.roofType === v ? "bg-primary text-primary-foreground border-primary" : ""}`}>{v} Roof</button>))}</div></div>
//                   <button onClick={() => setStep(2)} className={`${buttonPrimary} w-full`}>Next</button>
//                 </div>
//               )}
//               {step === 2 && (
//                 <div className="space-y-6">
//                   <div className="space-y-1.5"><label htmlFor="terrace" className="text-sm">Approx. Terrace Size (in Sq. ft)</label><input id="terrace" type="number" min={0} className={inputBase} placeholder="Enter Roof Area" value={estimateData.terraceSize} onChange={(e) => updateEstimate("terraceSize", e.target.value)} /></div>
//                   <div className="space-y-1.5"><span className="text-sm">Do you face regular power cuts?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("powerCuts", v)} className={`${chip} ${estimateData.powerCuts === v ? "bg-primary text-primary-foreground border-primary" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">When are you planning to get Solar?</span><div className="grid grid-cols-1 gap-2">{(["Immediately", "3 Months", "6 Months"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("planning", v)} className={`${chip} ${estimateData.planning === v ? "bg-primary text-primary-foreground border-primary" : ""}`}>{v === "Immediately" ? "Immediately" : `In ${v}`}</button>))}</div></div>
//                   <button onClick={() => setStep(3)} className={`${buttonPrimary} w-full`}>Next</button>
//                 </div>
//               )}
//               {step === 3 && (
//                 <div className="space-y-5">
//                   <button onClick={handleShareLocation} className={`${buttonOutline} w-full`} type="button"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Share my current location</span></button>
//                   <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div></div>
//                   <div className="space-y-1.5"><label htmlFor="addr" className="text-sm">Enter your full address</label><input id="addr" className={inputBase} value={estimateData.fullAddress} onChange={(e) => updateEstimate("fullAddress", e.target.value)} /></div>
//                   <div className="space-y-1.5"><label htmlFor="landmark" className="text-sm">Landmark</label><input id="landmark" className={inputBase} value={estimateData.landmark} onChange={(e) => updateEstimate("landmark", e.target.value)} /></div>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div className="space-y-1.5"><label className="text-sm">PIN Code</label><input className={inputBase} value={formData.pinCode} readOnly /></div>
//                     <div className="space-y-1.5"><label className="text-sm">City</label><input className={inputBase} value={formData.city || "Varanasi"} onChange={(e) => updateForm("city", e.target.value)} /></div>
//                     <div className="space-y-1.5"><label className="text-sm">State</label><input className={inputBase} value="Uttar Pradesh" readOnly /></div>
//                   </div>
//                   <button onClick={handleCalculate} disabled={loading} className={`${buttonPrimary} w-full`}>{loading ? "Calculating..." : "Get Estimates"}</button>
//                 </div>
//               )}
//               {step === 4 && (
//                 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//                   <div className="text-center space-y-2"><h3 className="text-xl font-semibold">Your Solar Estimate</h3><p className="text-sm text-muted-foreground">A quick overview based on your inputs</p></div>
//                   <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-4 text-center">
//                     <div><p className="text-xs text-muted-foreground">Required System Size</p><p className="mt-1 text-2xl font-bold inline-flex items-center justify-center gap-2"><Zap className="h-5 w-5 text-yellow-500" />{results.systemSize} kW</p></div>
//                     <div><p className="text-xs text-muted-foreground">Approx. Roof Area Needed</p><p className="mt-1 text-xl font-semibold">{results.requiredRoofArea} sq. ft.</p></div>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2">Estimated Savings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                       <div className="rounded-lg border bg-background p-3 text-center"><p className="text-xs text-muted-foreground">Monthly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1"><IndianRupee className="h-4 w-4" />{results.monthlySavings.toLocaleString("en-IN")}</p></div>
//                       <div className="rounded-lg border bg-background p-3 text-center"><p className="text-xs text-muted-foreground">Yearly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1"><IndianRupee className="h-4 w-4" />{results.yearlySavings.toLocaleString("en-IN")}</p></div>
//                       <div className="rounded-lg border bg-background p-3 text-center"><p className="text-xs text-muted-foreground">5-Year</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1"><IndianRupee className="h-4 w-4" />{results.fiveYearSavings.toLocaleString("en-IN")}</p></div>
//                     </div>
//                   </div>
//                   {!!recommendedProducts.length && (
//                     <div>
//                       <h4 className="text-sm font-semibold mb-2 inline-flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Product Recommendations</h4>
//                       <div className={`grid grid-cols-1 ${recommendedProducts.length > 1 ? "md:grid-cols-3" : ""} gap-3`}>
//                         {recommendedProducts.map((p) => {
//                           const id = `${p.brand}-${p.size}-${p.mountingType ?? 'default'}`
//                           const isSubmitting = submittingProductId === id
//                           return (
//                             <div key={id} className="rounded-lg border bg-background p-3 flex flex-col">
//                               <div className="flex-1 space-y-2">
//                                 <div><p className="text-xs text-muted-foreground">Brand</p><p className="font-semibold">{p.brand}</p></div>
//                                 <div className="grid grid-cols-2 gap-2">
//                                   <div><p className="text-xs text-muted-foreground">System Size</p><p className="font-medium">{p.size} kWp</p></div>
//                                   <div><p className="text-xs text-muted-foreground">Phase</p><p className="font-medium">{p.phase}</p></div>
//                                 </div>
//                                 {p.mountingType && (
//                                   <div><p className="text-xs text-muted-foreground">Mounting Type</p><p className="font-medium">{p.mountingType}</p></div>
//                                 )}
//                                 {p.price ? (<div className="pt-2 border-t"><p className="text-xs text-muted-foreground">Est. Price</p><p className="text-lg font-bold">₹{p.price.toLocaleString("en-IN")}</p></div>) : null}
//                               </div>
//                               <button className={`${buttonPrimary} mt-3`} onClick={() => handleDirectQuote(p)} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Get Instant Quote"}</button>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}
//                   <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
//                     <p className="flex items-center gap-2 text-sm"><PiggyBank className="h-4 w-4 text-emerald-600" /><span className="font-medium">Gross System Cost:</span> ₹{results.grossCost.toLocaleString("en-IN")}</p>
//                     <p className="flex items-center gap-2 text-sm"><IndianRupee className="h-4 w-4 text-amber-600" /><span className="font-medium">Net Cost (after subsidy):</span> ₹{results.netCost.toLocaleString("en-IN")}</p>
//                     <p className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4 text-orange-600" /><span className="font-medium">Estimated Payback:</span> {results.paybackYears} years</p>
//                     <p className="flex items-center gap-2 text-sm"><Leaf className="h-4 w-4 text-emerald-700" /><span className="font-medium">CO₂ Savings:</span> {results.co2Savings} tons/year</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setStep(0)} className={buttonOutline} type="button">Start New Estimate</button>
//                     <button onClick={() => window?.scrollTo?.({ top: 0, behavior: "smooth" })} className={buttonOutline} type="button">Back to top</button>
//                   </div>
//                 </motion.div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default HeroGetQuote;









// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ArrowLeft, Check, IndianRupee, Leaf, MapPin, PiggyBank, Timer, Zap, ShoppingCart } from "lucide-react"
// import { supabase } from "@/integrations/supabase/client"

// // --- TYPES ---
// type CustomerType = "Residential" | "Commercial"
// type ProductSystem = { brand: string; size: number; phase: string; price?: number; mountingType?: string }
// type QuoteFormData = { fullName: string; whatsappNumber: string; pinCode: string; companyName?: string; city: string; monthlyBill: string }
// type EstimateData = { roofOwnership: "" | "Yes" | "No"; constructed: "" | "Yes" | "No"; roofType: "" | "Concrete" | "Metal" | "Brick"; terraceSize: string; powerCuts: "" | "Yes" | "No"; planning: "" | "Immediately" | "3 Months" | "6 Months"; fullAddress: string; landmark: string; latitude: number | null; longitude: number | null }
// type Results = { systemSize: number; requiredRoofArea: number; monthlySavings: number; yearlySavings: number; fiveYearSavings: number; grossCost: number; netCost: number; paybackYears: number; co2Savings: number }
// type ProductCatalog = { residential: ProductSystem[]; commercial: ProductSystem[] }

// // --- CONSTANTS & HELPERS ---
// const BILL_RANGES = ["Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000", "₹4000 - ₹8000", "More than ₹8000"]
// const TOTAL_ESTIMATE_STEPS = 3
// const convertBillRangeToNumber = (range: string): number | null => {
//   if (!range) return null;
//   switch (range) {
//     case "Less than ₹1500": return 1000;
//     case "₹1500 - ₹2500": return 2000;
//     case "₹2500 - ₹4000": return 3250;
//     case "₹4000 - ₹8000": return 6000;
//     case "More than ₹8000": return 9000;
//     default:
//       const parsed = Number.parseFloat(range);
//       return isNaN(parsed) ? null : parsed;
//   }
// };

// // --- STYLING CONSTANTS ---
// const inputBase = "w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0a2351] px-3 py-2 text-sm"
// const buttonBase = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2351] disabled:opacity-50 disabled:pointer-events-none"
// const buttonPrimary = `${buttonBase} bg-gradient-to-r from-[#0a2351] to-[#0d2e67] text-white hover:opacity-90`
// const buttonOutline = `${buttonBase} border hover:bg-muted`
// const chip = "rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"

// // --- CUSTOM HOOKS & SUB-COMPONENTS ---
// function useInlineToast() {
//   const [msg, setMsg] = useState<{ title: string; desc?: string } | null>(null)
//   useEffect(() => {
//     if (!msg) return
//     const t = setTimeout(() => setMsg(null), 2400)
//     return () => clearTimeout(t)
//   }, [msg])
//   return { msg, setMsg }
// }

// function Stepper({ current, total, labels }: { current: number; total: number; labels: string[] }) {
//   return (
//     <div className="w-full">
//       <ol className="flex items-center gap-2" aria-label="Progress">
//         {Array.from({ length: total }).map((_, i) => {
//           const idx = i + 1
//           const isActive = idx <= current
//           return (
//             <li key={idx} className="flex-1">
//               <div className="flex items-center gap-2">
//                 <div className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold ${isActive ? "bg-[#0a2351] text-white border-[#0a2351]" : "bg-background text-muted-foreground"}`} >
//                   {isActive ? <Check className="h-4 w-4" /> : idx}
//                 </div>
//                 {i < total - 1 && <div className={`h-1 w-full rounded-full ${i + 1 < current ? "bg-[#0a2351]" : "bg-muted"}`} />}
//               </div>
//             </li>
//           )
//         })}
//       </ol>
//     </div>
//   )
// }

// // --- MAIN COMPONENT ---
// export function HeroGetQuote() {
//   const [productCatalog, setProductCatalog] = useState<ProductCatalog | null>(null)
//   const [catalogLoading, setCatalogLoading] = useState<boolean>(true)
//   const [catalogError, setCatalogError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchAndNormalizeProducts = async () => {
//       try {
//         const [tataRes, shaktiRes, relianceRes, relianceLargeRes] = await Promise.all([
//           supabase.from('tata_grid_tie_systems').select('*'),
//           supabase.from('shakti_grid_tie_systems').select('*'),
//           supabase.from('reliance_grid_tie_systems').select('*'),
//           supabase.from('reliance_large_systems').select('*')
//         ]);

//         if (tataRes.error) throw new Error(`Tata fetch failed: ${tataRes.error.message}`);
//         if (shaktiRes.error) throw new Error(`Shakti fetch failed: ${shaktiRes.error.message}`);
//         if (relianceRes.error) throw new Error(`Reliance fetch failed: ${relianceRes.error.message}`);
//         if (relianceLargeRes.error) throw new Error(`Reliance Large fetch failed: ${relianceLargeRes.error.message}`);

//         const tataProducts: ProductSystem[] = tataRes.data.map((p: any) => ({ brand: 'Tata', size: Number(p.system_size), phase: p.phase, price: Number(p.total_price) }));
//         const shaktiProducts: ProductSystem[] = shaktiRes.data.map((p: any) => ({ brand: 'Shakti', size: Number(p.system_size), phase: p.phase, price: Number(p.pre_gi_elevated_price) }));
//         const relianceProducts: ProductSystem[] = relianceRes.data.map((p: any) => ({ brand: 'Reliance', size: Number(p.system_size), phase: p.phase, price: Number(p.hdg_elevated_price) }));
//         const relianceLargeProducts: ProductSystem[] = [];

//         relianceLargeRes.data.forEach((p: any) => {
//           const size = Number(p.system_size_kwp);
//           const phase = p.phase;
//           const getPrice = (totalField: string, perWattField: string): number => {
//             let totalPrice = Number(p[totalField]);
//             if (isNaN(totalPrice) || totalPrice <= 0) {
//               const perWatt = Number(p[perWattField]);
//               totalPrice = perWatt > 0 && size > 0 ? Math.round(perWatt * size * 1000) : 0;
//             }
//             return totalPrice;
//           };
//           const prices: Record<string, number> = {
//             "Tin Shed": getPrice('short_rail_tin_shed_price', 'short_rail_tin_shed_price_per_watt'),
//             "RCC Elevated": getPrice('hdg_elevated_rcc_price', 'hdg_elevated_rcc_price_per_watt'),
//             "Pre GI MMS": getPrice('pre_gi_mms_price', 'pre_gi_mms_price_per_watt'),
//             "Without MMS": getPrice('price_without_mms_price', 'price_without_mms_price_per_watt'),
//           };
//           Object.entries(prices).forEach(([mountingType, price]) => {
//             if (price > 0) {
//               relianceLargeProducts.push({ brand: 'Reliance', size, phase, price, mountingType });
//             }
//           });
//         });

//         const allProducts = [...tataProducts, ...shaktiProducts, ...relianceProducts, ...relianceLargeProducts].filter(p => p.size > 0);

//         const residential: ProductSystem[] = allProducts.filter(p => p.size <= 13.8);
//         const commercial: ProductSystem[] = allProducts.filter(p => p.size > 13.8);

//         console.log('Fetched Commercial Products:', commercial);
//         setProductCatalog({ residential, commercial });

//       } catch (error: any) {
//         setCatalogError(error.message || "Could not load product catalog.");
//         console.error(error);
//       } finally {
//         setCatalogLoading(false);
//       }
//     };

//     fetchAndNormalizeProducts();
//   }, []);

//   const stateTariffs: Record<string, number> = { "Uttar Pradesh": 7.2 }
//   const avgSolarGenerationPerKWMonth = 120
//   const avgRoofAreaPerKW = 60
//   const systemCostPerKW = 60000
//   const subsidyPerKW = 18000
//   const maxSubsidy = 108000
//   const co2SavingPerKWYear = 1.2

//   const [step, setStep] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [customerType, setCustomerType] = useState<CustomerType>("Residential")
//   const [agreed, setAgreed] = useState(false)
//   const [submittingProductId, setSubmittingProductId] = useState<string | null>(null)

//   const [formData, setFormData] = useState<QuoteFormData>({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" })
//   const [estimateData, setEstimateData] = useState<EstimateData>({ roofOwnership: "", constructed: "", roofType: "", terraceSize: "", powerCuts: "", planning: "", fullAddress: "", landmark: "", latitude: null, longitude: null })
//   const [results, setResults] = useState<Results>({ systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0, grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0 })
//   const [recommendedProducts, setRecommendedProducts] = useState<ProductSystem[]>([])

//   const { msg, setMsg } = useInlineToast()

//   const updateForm = (k: keyof QuoteFormData, v: string) => setFormData((p) => ({ ...p, [k]: v }))
//   const updateEstimate = (k: keyof EstimateData, v: EstimateData[typeof k]) => setEstimateData((p) => ({ ...p, [k]: v }))

//   const detailsValid = formData.fullName.trim() && formData.whatsappNumber.trim() && (customerType === "Residential" ? formData.pinCode.trim() : true) && (customerType === "Commercial" ? formData.companyName?.trim() : true) && formData.monthlyBill.trim() && agreed
//   const progressPct = step > 0 && step < 4 ? Math.round((step / TOTAL_ESTIMATE_STEPS) * 100) : step === 4 ? 100 : 0

//   const getStepTitle = () => {
//     switch (step) {
//       case 1: return "Quick Estimates (Step 1/3)"
//       case 2: return "Quick Estimates (Step 2/3)"
//       case 3: return "Quick Estimates (Step 3/3)"
//       case 4: return "Your Solar Estimate"
//       default: return "Get a Free Solar Quote"
//     }
//   }

//   const handleCalculate = async () => {
//     if (!productCatalog) {
//       setMsg({ title: "Products are still loading, please wait." });
//       return;
//     }
//     setLoading(true)
//     try {
//       const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0
//       const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"]
//       const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0
//       const systemSize = Math.max(1, Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9))

//       const grossCost = systemSize * systemCostPerKW
//       const netCost = Math.max(0, grossCost - Math.min(systemSize * subsidyPerKW, maxSubsidy))
//       const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9)

//       setResults({ systemSize, requiredRoofArea: Math.round(systemSize * avgRoofAreaPerKW), monthlySavings, yearlySavings: monthlySavings * 12, fiveYearSavings: monthlySavings * 60, grossCost, netCost, paybackYears: netCost > 0 && monthlySavings > 0 ? Number.parseFloat((netCost / (monthlySavings * 12)).toFixed(1)) : 0, co2Savings: Number.parseFloat((systemSize * co2SavingPerKWYear).toFixed(1)) })

//       const source = customerType === "Residential" ? productCatalog.residential : productCatalog.commercial
//       if (source && source.length) {
//         const brands = [...new Set(source.map(p => p.brand))];
//         const recommendations: ProductSystem[] = []
//         brands.forEach(brand => {
//           const brandProducts = source.filter(p => p.brand === brand)
//           if (brandProducts.length > 0) {
//             if (brand === 'Reliance' && customerType === 'Commercial') {
//               const grouped = brandProducts.reduce((acc, p) => {
//                 if (!acc[p.size]) acc[p.size] = [];
//                 acc[p.size].push(p);
//                 return acc;
//               }, {} as Record<number, ProductSystem[]>);
//               const sizes = Object.keys(grouped).map(Number);
//               if (sizes.length > 0) {
//                 const closestSize = sizes.reduce((prev, curr) => Math.abs(curr - systemSize) < Math.abs(prev - systemSize) ? curr : prev);
//                 recommendations.push(...grouped[closestSize]);
//               }
//             } else {
//               const closestProduct = brandProducts.reduce((prev, curr) => (Math.abs(curr.size - systemSize) < Math.abs(prev.size - systemSize) ? curr : prev))
//               recommendations.push(closestProduct)
//             }
//           }
//         })
//         console.log('Recommended Products:', recommendations);
//         setRecommendedProducts(recommendations)
//       } else {
//         setRecommendedProducts([])
//       }
//       setStep(4)
//     } catch (e) {
//       setMsg({ title: "Calculation error", desc: "Please check details and try again." })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmitDetails = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!detailsValid) return setMsg({ title: "Please complete required fields" })
//     setLoading(true)
//     console.log("INITIAL DETAILS SUBMITTED:", { form: formData, customerType });
//     setTimeout(() => {
//       setMsg({ title: "Details saved", desc: "Let’s get a quick estimate." })
//       setStep(1)
//       setLoading(false)
//     }, 500);
//   }

//   const handleShareLocation = () => {
//     if (!navigator.geolocation) return setMsg({ title: "Geolocation not supported" })
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         updateEstimate("latitude", pos.coords.latitude)
//         updateEstimate("longitude", pos.coords.longitude)
//         setMsg({ title: "Location shared" })
//       },
//       () => setMsg({ title: "Location error", desc: "Try manual address." }),
//     )
//   }

//   const handleDirectQuote = async (product: ProductSystem) => {
//     const id = `${product.brand}-${product.size}-${product.mountingType ?? 'default'}`
//     setSubmittingProductId(id)
//     try {
//       const formattedPayload = {
//         name: formData.fullName,
//         phone: formData.whatsappNumber,
//         email: null,
//         entity_type: null,
//         solution_classification: null,
//         estimated_area_sqft: Number(estimateData.terraceSize) || null,
//         monthly_bill: formData.monthlyBill,
//         power_demand_kw: product.size,
//         project_location: `${estimateData.fullAddress}, ${formData.pinCode}`,
//         referral_name: null,
//         referral_phone: null,
//         product_name: `${product.size} kWp Solar System (${product.phase}-Phase)${product.mountingType ? ` - ${product.mountingType}` : ''}`,
//         product_category: product.brand,
//         source: "Quote Form",
//         customer_type: customerType.toLowerCase(),
//         referral_source: null,
//         phase: product.phase,
//         mounting_type: product.mountingType || null,
//         latitude: estimateData.latitude,
//         longitude: estimateData.longitude,
//       }

//       console.log("SENDING TO BACKEND:", formattedPayload)

//       const res = await fetch("https://solar-quote-server.onrender.com/generate-quote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formattedPayload),
//       })

//       if (!res.ok) {
//         throw new Error(`Server responded with status ${res.status}`)
//       }

//       setMsg({ title: "Quote request sent successfully!", desc: "We will get back to you shortly." })

//     } catch (err: any) {
//       setMsg({ title: "Submission Failed", desc: err?.message ?? "Please try again later." })
//     } finally {
//       setSubmittingProductId(null)
//     }
//   }

//   if (catalogLoading) {
//     return <section className="w-full max-w-xl mx-auto p-8 text-center"><div>Loading Products from Database...</div></section>
//   }
//   if (catalogError) {
//     return <section className="w-full max-w-xl mx-auto p-8 text-center text-red-600"><div>Error: {catalogError}</div></section>
//   }

//   return (
//     <section className="w-full max-w-xl mx-auto px-4 sm:px-0">
//       <div className="rounded-2xl border bg-background shadow-sm">
//         <div className="p-5 border-b">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             {step > 0 && step < 4 ? (<button type="button" className={`${buttonOutline} h-9 w-9 p-0`} onClick={() => setStep((s) => Math.max(0, s - 1))} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></button>) : <div />}
//             <h2 className="text-lg font-semibold text-blue-900 text-balance">{getStepTitle()}</h2>
//             <div className="text-sm text-muted-foreground">{progressPct}%</div>
//           </div>
//           {step > 0 && step < 4 && (<div className="mt-4"><Stepper current={step} total={TOTAL_ESTIMATE_STEPS} labels={["Site", "Context", "Location"]} /></div>)}
//         </div>
//         <div className="p-5">
//           <AnimatePresence>
//             {msg && (<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-sm" role="status" aria-live="polite" ><p className="font-medium text-blue-900">{msg.title}</p>{msg.desc && <p className="text-muted-foreground">{msg.desc}</p>}</motion.div>)}
//           </AnimatePresence>
//           <AnimatePresence mode="wait">
//             <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease: "easeOut" }} >
//               {step === 0 && (
//                 <form onSubmit={handleSubmitDetails} className="space-y-5">
//                   <div className="bg-muted/40 rounded-full p-1 grid grid-cols-2 gap-1">
//                     {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
//                       <button key={type} type="button" onClick={() => { setCustomerType(type); setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" }) }} className={`h-9 rounded-full text-sm font-semibold transition-colors ${customerType === type ? "bg-[#0a2351] text-white" : "text-muted-foreground hover:bg-muted"}`} aria-pressed={customerType === type}>
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="space-y-1.5"><label htmlFor="fullName" className="text-sm">Full Name <span className="text-destructive">*</span></label><input id="fullName" required className={inputBase} value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} /></div>
//                   {customerType === "Commercial" ? (
//                     <>
//                       <div className="space-y-1.5"><label htmlFor="companyName" className="text-sm">Company Name <span className="text-destructive">*</span></label><input id="companyName" required className={inputBase} value={formData.companyName ?? ""} onChange={(e) => updateForm("companyName", e.target.value)} /></div>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-1.5"><label htmlFor="city" className="text-sm">City <span className="text-destructive">*</span></label><input id="city" required className={inputBase} value={formData.city} onChange={(e) => updateForm("city", e.target.value)} /></div>
//                         <div className="space-y-1.5"><label htmlFor="pinCommercial" className="text-sm">PIN Code</label><input id="pinCommercial" className={inputBase} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value)} /></div>
//                       </div>
//                       <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm("whatsappNumber", e.target.value)} /></div>
//                       <div className="space-y-1.5"><label htmlFor="bill" className="text-sm">Average Monthly Bill <span className="text-destructive">*</span></label><input id="bill" type="number" required className={inputBase} placeholder="Enter amount in ₹" value={formData.monthlyBill} onChange={(e) => updateForm("monthlyBill", e.target.value)} /></div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm("whatsappNumber", e.target.value)} /></div>
//                       <div className="space-y-1.5"><label htmlFor="pin" className="text-sm">PIN Code <span className="text-destructive">*</span></label><input id="pin" required className={inputBase} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value)} /></div>
//                       <div className="space-y-1.5">
//                         <span className="text-sm">Average monthly bill? <span className="text-destructive">*</span></span>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<button key={range} type="button" onClick={() => updateForm("monthlyBill", range)} className={`${chip} ${formData.monthlyBill === range ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`} aria-pressed={formData.monthlyBill === range}>{range}</button>))}</div>
//                       </div>
//                     </>
//                   )}
//                   <div className="flex items-start gap-3 pt-2"><input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border" /><label htmlFor="agree" className="text-sm text-muted-foreground">I agree to the terms of service & privacy policy.</label></div>
//                   <button type="submit" disabled={loading} className={`${buttonPrimary} w-full h-11 font-semibold`}>{loading ? "Submitting..." : "Submit Details"}</button>
//                 </form>
//               )}
//               {step === 1 && (
//                 <div className="space-y-6">
//                   <div className="space-y-1.5"><span className="text-sm">Do you have roof ownership?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("roofOwnership", v)} className={`${chip} ${estimateData.roofOwnership === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">Is your house fully constructed?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("constructed", v)} className={`${chip} ${estimateData.constructed === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">Select the roof type</span><div className="grid grid-cols-1 gap-2">{(["Concrete", "Metal", "Brick"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("roofType", v)} className={`${chip} ${estimateData.roofType === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v} Roof</button>))}</div></div>
//                   <button onClick={() => setStep(2)} className={`${buttonPrimary} w-full`}>Next</button>
//                 </div>
//               )}
//               {step === 2 && (
//                 <div className="space-y-6">
//                   <div className="space-y-1.5"><label htmlFor="terrace" className="text-sm">Approx. Terrace Size (in Sq. ft)</label><input id="terrace" type="number" min={0} className={inputBase} placeholder="Enter Roof Area" value={estimateData.terraceSize} onChange={(e) => updateEstimate("terraceSize", e.target.value)} /></div>
//                   <div className="space-y-1.5"><span className="text-sm">Do you face regular power cuts?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("powerCuts", v)} className={`${chip} ${estimateData.powerCuts === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
//                   <div className="space-y-1.5"><span className="text-sm">When are you planning to get Solar?</span><div className="grid grid-cols-1 gap-2">{(["Immediately", "3 Months", "6 Months"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate("planning", v)} className={`${chip} ${estimateData.planning === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v === "Immediately" ? "Immediately" : `In ${v}`}</button>))}</div></div>
//                   <button onClick={() => setStep(3)} className={`${buttonPrimary} w-full`}>Next</button>
//                 </div>
//               )}
//               {step === 3 && (
//                 <div className="space-y-5">
//                   <button onClick={handleShareLocation} className={`${buttonOutline} w-full`} type="button"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Share my current location</span></button>
//                   <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div></div>
//                   <div className="space-y-1.5"><label htmlFor="addr" className="text-sm">Enter your full address</label><input id="addr" className={inputBase} value={estimateData.fullAddress} onChange={(e) => updateEstimate("fullAddress", e.target.value)} /></div>
//                   <div className="space-y-1.5"><label htmlFor="landmark" className="text-sm">Landmark</label><input id="landmark" className={inputBase} value={estimateData.landmark} onChange={(e) => updateEstimate("landmark", e.target.value)} /></div>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div className="space-y-1.5"><label className="text-sm">PIN Code</label><input className={inputBase} value={formData.pinCode} readOnly /></div>
//                     <div className="space-y-1.5"><label className="text-sm">City</label><input className={inputBase} value={formData.city || "Varanasi"} onChange={(e) => updateForm("city", e.target.value)} /></div>
//                     <div className="space-y-1.5"><label className="text-sm">State</label><input className={inputBase} value="Uttar Pradesh" readOnly /></div>
//                   </div>
//                   <button onClick={handleCalculate} disabled={loading} className={`${buttonPrimary} w-full`}>{loading ? "Calculating..." : "Get Estimates"}</button>
//                 </div>
//               )}
//               {step === 4 && (
//                 <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//                   <div className="text-center space-y-2"><h3 className="text-xl font-semibold text-blue-900">Your Solar Estimate</h3><p className="text-sm text-muted-foreground">A quick overview based on your inputs</p></div>
//                   <div className="rounded-lg border bg-blue-50 p-4 grid grid-cols-2 gap-4 text-center">
//                     <div><p className="text-xs text-muted-foreground">Required System Size</p><p className="mt-1 text-2xl font-bold inline-flex items-center justify-center gap-2"><Zap className="h-5 w-5 text-yellow-500" />{results.systemSize} kW</p></div>
//                     <div><p className="text-xs text-muted-foreground">Approx. Roof Area Needed</p><p className="mt-1 text-xl font-semibold">{results.requiredRoofArea} sq. ft.</p></div>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2 text-blue-900">Estimated Savings</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                       <div className="rounded-lg border bg-gradient-to-r from-cyan-600 to-blue-700 p-3 text-center"><p className="text-xs text-white/80">Monthly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.monthlySavings.toLocaleString("en-IN")}</p></div>
//                       <div className="rounded-lg border bg-gradient-to-r from-sky-600 to-indigo-700 p-3 text-center"><p className="text-xs text-white/80">Yearly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.yearlySavings.toLocaleString("en-IN")}</p></div>
//                       <div className="rounded-lg border bg-gradient-to-r from-cyan-600 to-blue-700 p-3 text-center"><p className="text-xs text-white/80">5-Year</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.fiveYearSavings.toLocaleString("en-IN")}</p></div>
//                     </div>
//                   </div>
//                   {!!recommendedProducts.length && (
//                     <div>
//                       <h4 className="text-sm font-semibold mb-2 inline-flex items-center gap-2 text-blue-900"><ShoppingCart className="h-4 w-4" /> Product Recommendations</h4>
//                       <div className={`grid grid-cols-1 ${recommendedProducts.length > 1 ? "md:grid-cols-3" : ""} gap-3`}>
//                         {recommendedProducts.map((p) => {
//                           const id = `${p.brand}-${p.size}-${p.mountingType ?? 'default'}`
//                           const isSubmitting = submittingProductId === id
//                           return (
//                             <div key={id} className="rounded-lg border bg-background p-3 flex flex-col">
//                               <div className="flex-1 space-y-2">
//                                 <div><p className="text-xs text-muted-foreground">Brand</p><p className="font-semibold">{p.brand}</p></div>
//                                 <div className="grid grid-cols-2 gap-2">
//                                   <div><p className="text-xs text-muted-foreground">System Size</p><p className="font-medium">{p.size} kWp</p></div>
//                                   <div><p className="text-xs text-muted-foreground">Phase</p><p className="font-medium">{p.phase}</p></div>
//                                 </div>
//                                 {p.mountingType && (
//                                   <div><p className="text-xs text-muted-foreground">Mounting Type</p><p className="font-medium">{p.mountingType}</p></div>
//                                 )}
//                                 {p.price ? (<div className="pt-2 border-t"><p className="text-xs text-muted-foreground">Est. Price</p><p className="text-lg font-bold text-blue-900">₹{p.price.toLocaleString("en-IN")}</p></div>) : null}
//                               </div>
//                               <button className={`${buttonPrimary} mt-3`} onClick={() => handleDirectQuote(p)} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Get Instant Quote"}</button>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )}
//                   <div className="rounded-lg border bg-blue-50 p-4 space-y-2">
//                     <p className="flex items-center gap-2 text-sm"><PiggyBank className="h-4 w-4 text-emerald-600" /><span className="font-medium">Gross System Cost:</span> ₹{results.grossCost.toLocaleString("en-IN")}</p>
//                     <p className="flex items-center gap-2 text-sm"><IndianRupee className="h-4 w-4 text-amber-600" /><span className="font-medium">Net Cost (after subsidy):</span> ₹{results.netCost.toLocaleString("en-IN")}</p>
//                     <p className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4 text-orange-600" /><span className="font-medium">Estimated Payback:</span> {results.paybackYears} years</p>
//                     <p className="flex items-center gap-2 text-sm"><Leaf className="h-4 w-4 text-emerald-700" /><span className="font-medium">CO₂ Savings:</span> {results.co2Savings} tons/year</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => setStep(0)} className={buttonOutline} type="button">Start New Estimate</button>
//                     <button onClick={() => window?.scrollTo?.({ top: 0, behavior: "smooth" })} className={buttonOutline} type="button">Back to top</button>
//                   </div>
//                 </motion.div>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default HeroGetQuote;