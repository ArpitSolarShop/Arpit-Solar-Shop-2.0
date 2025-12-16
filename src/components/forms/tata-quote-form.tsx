// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { supabase } from "@/integrations/supabase/client"
// import { CheckCircle, AlertCircle } from "lucide-react"

// interface TataQuoteFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   productName?: string
//   isLargeSystem?: boolean
//   powerDemandKw?: number | null
// }

// const TataQuoteForm = ({
//   open,
//   onOpenChange,
//   productName = "Tata Power Solar Product",
//   isLargeSystem = false,
//   powerDemandKw = null,
// }: TataQuoteFormProps) => {
//   const { toast } = useToast()
//   const [loading, setLoading] = useState(false)
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
//   })

//   useEffect(() => {
//     // Pre-fill power demand if it's passed from the pricing table
//     if (powerDemandKw !== null && powerDemandKw !== undefined) {
//       setFormData((prev) => ({
//         ...prev,
//         power_demand_kw: String(powerDemandKw),
//       }))
//     } else {
//       // Clear the field if no power demand is specified
//       setFormData((prev) => ({
//         ...prev,
//         power_demand_kw: "",
//       }))
//     }
//   }, [powerDemandKw, open]) // Re-run when the modal opens or the product changes

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // Build payload matching the database schema
//       const insertData = {
//         name: formData.name,
//         phone: formData.phone,
//         email: formData.email || null,
//         entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
//         solution_classification: (formData.solution_classification as "Residential" | "Commercial") || null,
//         estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
//         monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
//         power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
//         project_location: formData.project_location || null,
//         referral_name: formData.referral_name || null,
//         referral_phone: formData.referral_phone || null,
//         product_name: productName,
//         product_category: "Tata", // Set product category to Tata
        source: "Tata Quote Form" as const,
//         customer_type: formData.entity_type === "Individual" ? "residential" : "commercial",
//         referral_source: formData.referral_name ? "referral" : null,
//       };

//       // Insert into Supabase
//       const { error } = await supabase.from('solar_quote_requests').insert(insertData)
//       if (error) throw error

//       // Optional secondary server
//       try {
//         // await fetch('https://solar-quote-server.onrender.com/generate-quote', {
//         await fetch('https://solar-quote-server.onrender.com/generate-quote', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(insertData),
//         });
//       } catch (err) {
//         console.warn("Secondary server failed:", err);
//       }

//       toast({
//         title: "Quote Request Submitted!",
//         description: isLargeSystem
//           ? "Our sales team will contact you within 24 hours to discuss your large-scale solar project."
//           : "Our Tata Power Solar team will contact you within 24 hours to discuss your solar solution.",
//       })

//       // Reset form and close dialog
//       setFormData({ name: "", phone: "", email: "", entity_type: "", solution_classification: "", estimated_area_sqft: "", monthly_bill: "", power_demand_kw: "", project_location: "", referral_name: "", referral_phone: "" })
//       onOpenChange(false)
//     } catch (error) {
//       console.error("Error submitting quote:", error)
//       toast({
//         title: "Error",
//         description: "Failed to submit quote request. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
//         <DialogHeader className="relative">
//           <div className="flex justify-center mb-4">
//             <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-16 w-auto" />
//           </div>

//           <div className="text-center mb-4">
//             <DialogTitle className="text-2xl font-bold text-gray-900">
//               {isLargeSystem ? "Large Scale Solar Quote" : "Tata Power Solar Quote"}
//             </DialogTitle>
//             <DialogDescription className="text-base text-gray-600">
//               {isLargeSystem
//                 ? "Get a customized quote for large-scale solar installations"
//                 : "Get a personalized quote for India's most trusted solar solutions"}
//             </DialogDescription>
//           </div>

//           {isLargeSystem && (
//             <Alert className="mb-4 border-blue-300 bg-blue-50">
//               <AlertCircle className="h-4 w-4 text-blue-700" />
//               <AlertDescription className="text-blue-800">
//                 <strong>Large Scale Project:</strong> Our sales team will provide customized pricing for systems above 15 kWp.
//               </AlertDescription>
//             </Alert>
//           )}

//           {productName !== "Tata Power Solar Product" && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-4 w-auto" />
//                 <span className="font-semibold text-gray-800">Selected Product:</span>
//               </div>
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">{productName}</Badge>
//               <p className="text-sm text-gray-700 mt-2">560 Wp Mono PERC Modules with String Inverter</p>
//             </div>
//           )}
//         </DialogHeader>

//         <Card className="border-0 shadow-none">
//           <CardHeader className="px-0 pb-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>#1 Trusted Brand</span>
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>32+ Years Experience</span>
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>Superior Performance</span>
//             </div>
//           </CardHeader>
//           <CardContent className="px-0">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
//                   <Input id="name" type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
//                   <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="98765 43210" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
//                   <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="entity_type" className="text-sm font-medium">Entity Type</Label>
//                   <Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}><SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
//                     <SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="solution_classification" className="text-sm font-medium">Solution Type</Label>
//                   <Select value={formData.solution_classification} onValueChange={(value) => handleInputChange("solution_classification", value)}><SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger>
//                     <SelectContent><SelectItem value="Residential">Residential Solar</SelectItem><SelectItem value="Commercial">Commercial Solar</SelectItem></SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="power_demand_kw" className="text-sm font-medium">Power Demand (kW)</Label>
//                   <Input id="power_demand_kw" type="number" value={formData.power_demand_kw} onChange={(e) => handleInputChange("power_demand_kw", e.target.value)} readOnly={powerDemandKw !== null} placeholder="e.g. 5" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="project_location" className="text-sm font-medium">Project Location *</Label>
//                 <Input id="project_location" type="text" required value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" />
//               </div>
//               <div className="pt-4">
//                 <Button type="submit" disabled={loading || !formData.name || !formData.phone || !formData.project_location} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base">
//                   {loading ? "Submitting..." : isLargeSystem ? "Contact Sales Team" : "Get My Tata Power Solar Quote"}
//                 </Button>
//                 <p className="text-xs text-gray-500 text-center mt-3">By submitting this form, you agree to be contacted by Tata Power Solar representatives</p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default TataQuoteForm






// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { supabase } from "@/integrations/supabase/client"
// import { CheckCircle, AlertCircle } from "lucide-react"

// interface TataQuoteFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   productName?: string
//   isLargeSystem?: boolean
//   powerDemandKw?: number | null
// }

// const TataQuoteForm = ({
//   open,
//   onOpenChange,
//   productName = "Tata Power Solar Product",
//   isLargeSystem = false,
//   powerDemandKw = null,
// }: TataQuoteFormProps) => {
//   const { toast } = useToast()
//   const [loading, setLoading] = useState(false)
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
//   })

//   useEffect(() => {
//     // Pre-fill power demand if it's passed from the pricing table
//     if (powerDemandKw !== null && powerDemandKw !== undefined) {
//       setFormData((prev) => ({
//         ...prev,
//         power_demand_kw: String(powerDemandKw),
//       }))
//     } else {
//       // Clear the field if no power demand is specified
//       setFormData((prev) => ({
//         ...prev,
//         power_demand_kw: "",
//       }))
//     }
//   }, [powerDemandKw, open]) // Re-run when the modal opens or the product changes

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // Build payload matching the database schema
//       const insertData = {
//         name: formData.name,
//         phone: formData.phone,
//         email: formData.email || null,
//         entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
//         solution_classification: (formData.solution_classification as "Residential" | "Commercial") || null,
//         estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
//         monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
//         power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
//         project_location: formData.project_location || null,
//         referral_name: formData.referral_name || null,
//         referral_phone: formData.referral_phone || null,
//         product_name: productName,
//         product_category: "Tata", // Set product category to Tata
//         source: "Quote Form" as const,
//         customer_type: formData.entity_type === "Individual" ? "residential" : "commercial",
//         referral_source: formData.referral_name ? "referral" : null,
//       };

//       // Insert into Supabase
//       const { error } = await supabase.from('solar_quote_requests').insert(insertData)
//       if (error) throw error

//       // Optional secondary server
//       try {
//        // await fetch('http://localhost:3000/generate-quote', {
//         await fetch('https://solar-quote-server.onrender.com/generate-quote', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(insertData),
//         });
//       } catch (err) {
//         console.warn("Secondary server failed:", err);
//       }

//       toast({
//         title: "Quote Request Submitted!",
//         description: isLargeSystem
//           ? "Our sales team will contact you within 24 hours to discuss your large-scale solar project."
//           : "Our Tata Power Solar team will contact you within 24 hours to discuss your solar solution.",
//       })

//       // Reset form and close dialog
//       setFormData({ name: "", phone: "", email: "", entity_type: "", solution_classification: "", estimated_area_sqft: "", monthly_bill: "", power_demand_kw: "", project_location: "", referral_name: "", referral_phone: "" })
//       onOpenChange(false)
//     } catch (error) {
//       console.error("Error submitting quote:", error)
//       toast({
//         title: "Error",
//         description: "Failed to submit quote request. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
//         <DialogHeader className="relative">
//           <div className="flex justify-center mb-4">
//             <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-16 w-auto" />
//           </div>

//           <div className="text-center mb-4">
//             <DialogTitle className="text-2xl font-bold text-gray-900">
//               {isLargeSystem ? "Large Scale Solar Quote" : "Tata Power Solar Quote"}
//             </DialogTitle>
//             <DialogDescription className="text-base text-gray-600">
//               {isLargeSystem
//                 ? "Get a customized quote for large-scale solar installations"
//                 : "Get a personalized quote for India's most trusted solar solutions"}
//             </DialogDescription>
//           </div>

//           {isLargeSystem && (
//             <Alert className="mb-4 border-blue-300 bg-blue-50">
//               <AlertCircle className="h-4 w-4 text-blue-700" />
//               <AlertDescription className="text-blue-800">
//                 <strong>Large Scale Project:</strong> Our sales team will provide customized pricing for systems above 15 kWp.
//               </AlertDescription>
//             </Alert>
//           )}

//           {productName !== "Tata Power Solar Product" && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-4 w-auto" />
//                 <span className="font-semibold text-gray-800">Selected Product:</span>
//               </div>
//               <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">{productName}</Badge>
//               <p className="text-sm text-gray-700 mt-2">560 Wp Mono PERC Modules with String Inverter</p>
//             </div>
//           )}
//         </DialogHeader>

//         <Card className="border-0 shadow-none">
//           <CardHeader className="px-0 pb-4">
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>#1 Trusted Brand</span>
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>32+ Years Experience</span>
//               <CheckCircle className="h-4 w-4 text-blue-700" /><span>Superior Performance</span>
//             </div>
//           </CardHeader>
//           <CardContent className="px-0">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
//                   <Input id="name" type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
//                   <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="98765 43210" />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
//                   <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="entity_type" className="text-sm font-medium">Entity Type</Label>
//                   <Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}><SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
//                     <SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="solution_classification" className="text-sm font-medium">Solution Type</Label>
//                   <Select value={formData.solution_classification} onValueChange={(value) => handleInputChange("solution_classification", value)}><SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger>
//                     <SelectContent><SelectItem value="Residential">Residential Solar</SelectItem><SelectItem value="Commercial">Commercial Solar</SelectItem></SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="power_demand_kw" className="text-sm font-medium">Power Demand (kW)</Label>
//                   <Input id="power_demand_kw" type="number" value={formData.power_demand_kw} onChange={(e) => handleInputChange("power_demand_kw", e.target.value)} readOnly={powerDemandKw !== null} placeholder="e.g. 5" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="project_location" className="text-sm font-medium">Project Location *</Label>
//                 <Input id="project_location" type="text" required value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" />
//               </div>

//               {/* START: Added Referral Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="referral_name" className="text-sm font-medium text-gray-700">
//                     Referral Name (Optional)
//                   </Label>
//                   <Input
//                     id="referral_name"
//                     type="text"
//                     value={formData.referral_name}
//                     onChange={(e) => handleInputChange("referral_name", e.target.value)}
//                     placeholder="Name of person who referred you"
//                     className="h-10 border-gray-300"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="referral_phone" className="text-sm font-medium text-gray-700">
//                     Referral Phone Number (Optional)
//                   </Label>
//                   <Input
//                     id="referral_phone"
//                     type="tel"
//                     value={formData.referral_phone}
//                     onChange={(e) => handleInputChange("referral_phone", e.target.value)}
//                     placeholder="+91 98765 43210"
//                     className="h-10 border-gray-300"
//                   />
//                 </div>
//               </div>
//               {/* END: Added Referral Fields */}

//               <div className="pt-4">
//                 <Button type="submit" disabled={loading || !formData.name || !formData.phone || !formData.project_location} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base">
//                   {loading ? "Submitting..." : isLargeSystem ? "Contact Sales Team" : "Get My Tata Power Solar Quote"}
//                 </Button>
//                 <p className="text-xs text-gray-500 text-center mt-3">By submitting this form, you agree to be contacted by Tata Power Solar representatives</p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default TataQuoteForm













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
import { CheckCircle, AlertCircle } from "lucide-react"

interface TataQuoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName?: string
  isLargeSystem?: boolean
  powerDemandKw?: number | null
  phase?: string
}

const TataQuoteForm = ({
  open,
  onOpenChange,
  productName = "Tata Power Solar Product",
  isLargeSystem = false,
  powerDemandKw = null,
  phase = "Three",
}: TataQuoteFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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
    phase: "Three",
  })

  // Pre-fill power_demand_kw and phase
  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setFormData((prev) => ({
        ...prev,
        power_demand_kw: powerDemandKw !== null && powerDemandKw !== undefined ? String(powerDemandKw) : "",
        phase: phase || "Three",
      }))
    }
    return () => {
      isMounted = false
    }
  }, [powerDemandKw, phase, open])

  // Client-side validation
  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.name) return "Name is required"
    if (!formData.phone || !phoneRegex.test(formData.phone)) return "Valid phone number is required (10 digits, starting with 6-9)"
    if (formData.email && !emailRegex.test(formData.email)) return "Invalid email format"
    if (!formData.project_location) return "Project location is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Debug: Log form data being sent
    console.log("Submitting form with data:", {
      ...formData,
      power_demand_kw: formData.power_demand_kw,
      phase: formData.phase,
      productName,
      isLargeSystem,
    })

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Build payload for Supabase (omit phase)
      const insertData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
        solution_classification: (formData.solution_classification as "Residential" | "Commercial") || null,
        estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
        monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
        power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
        project_location: formData.project_location || null,
        referral_name: formData.referral_name || null,
        referral_phone: formData.referral_phone || null,
        product_name: productName,
        product_category: "Tata",
        source: "Tata Quote Form" as const,
        customer_type: formData.entity_type === "Individual" ? "residential" : "commercial",
        referral_source: formData.referral_name ? "referral" : null,
      }

      // Insert into Supabase
      const { error } = await supabase.from('solar_quote_requests').insert(insertData)
      if (error) {
        throw new Error(`Failed to save quote request: ${error.message}`)
      }

      // Build payload for backend (include phase)
      const backendData = {
        ...insertData,
        phase: formData.phase,
      }

      // Debug: Log backend payload
      console.log("Sending to backend:", backendData)

      // Send to secondary server
      try {
        const response = await fetch('https://solar-quote-server.onrender.com/generate-quote', {
        //const response = await fetch('http://localhost:3000/generate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendData),
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Secondary server error: ${errorText}`)
        }
      } catch (err) {
        console.warn("Secondary server failed:", err)
        toast({
          title: "Warning",
          description: "Quote saved, but failed to send to secondary server. Our team will still contact you.",
          variant: "default",
        })
      }

      // Optional CRM - Kit19 (non-blocking)
      try {
        const crmPayload = {
          PersonName: backendData.name || '',
          CompanyName: '',
          MobileNo: backendData.phone || '',
          MobileNo1: '',
          MobileNo2: '',
          EmailID: backendData.email || '',
          EmailID1: '',
          EmailID2: '',
          City: backendData.project_location || '',
          State: '',
          Country: 'India',
          CountryCode: '+91',
          CountryCode1: '',
          CountryCode2: '',
          PinCode: '',
          ResidentialAddress: '',
          OfficeAddress: '',
          SourceName: backendData.source || 'Website',
          MediumName: (typeof window !== 'undefined' ? (document.title || window.location.pathname) : 'Website'),
          CampaignName: backendData.product_name || backendData.product_category || 'Quote Form',
          InitialRemarks: backendData.product_name ? `Product: ${backendData.product_name}` : '',
        }

        const resp = await fetch('https://sipapi.kit19.com/Enquiry/Add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'kit19-Auth-Key': '4e7bb26557334f91a21e56a4ea9c8752' },
          body: JSON.stringify(crmPayload),
        })

        if (!resp.ok) {
          console.warn('CRM (Kit19) returned non-OK response', await resp.text())
        } else {
          console.log('CRM (Kit19) accepted payload', crmPayload)
        }
      } catch (err) {
        console.warn('CRM (Kit19) failed:', err)
      }

      toast({
        title: "Quote Request Submitted!",
        description: isLargeSystem
          ? "Our sales team will contact you within 24 hours to discuss your large-scale solar project."
          : "Our Tata Power Solar team will contact you within 24 hours to discuss your solar solution.",
      })

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
        phase: "Three",
      })
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error submitting quote:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="relative">
          <div className="flex justify-center mb-4">
            <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-16 w-auto" />
          </div>

          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isLargeSystem ? "Large Scale Solar Quote" : "Tata Power Solar Quote"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              {isLargeSystem
                ? "Get a customized quote for large-scale solar installations"
                : `Request a quote for a ${formData.phase}-Phase system`}
            </DialogDescription>
          </div>

          {isLargeSystem && (
            <Alert className="mb-4 border-blue-300 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-blue-800">
                <strong>Large Scale Project:</strong> Our sales team will provide customized pricing for systems above 15 kWp.
              </AlertDescription>
            </Alert>
          )}

          {productName !== "Tata Power Solar Product" && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-4 w-auto" />
                <span className="font-semibold text-gray-800">Selected Product:</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">{productName}</Badge>
              <p className="text-sm text-gray-700 mt-2">560 Wp Mono PERC Modules with String Inverter ({formData.phase}-Phase)</p>
            </div>
          )}
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>#1 Trusted Brand</span>
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>32+ Years Experience</span>
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>Superior Performance</span>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input id="name" type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="9876543210" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type" className="text-sm font-medium">Entity Type</Label>
                  <Select value={formData.entity_type} onValueChange={(value) => handleInputChange("entity_type", value)}>
                    <SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
                    <SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="solution_classification" className="text-sm font-medium">Solution Type</Label>
                  <Select value={formData.solution_classification} onValueChange={(value) => handleInputChange("solution_classification", value)}>
                    <SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger>
                    <SelectContent><SelectItem value="Residential">Residential Solar</SelectItem><SelectItem value="Commercial">Commercial Solar</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power_demand_kw" className="text-sm font-medium">Power Demand (kW)</Label>
                  <Input id="power_demand_kw" type="number" value={formData.power_demand_kw} onChange={(e) => handleInputChange("power_demand_kw", e.target.value)} readOnly={powerDemandKw !== null} placeholder="e.g. 5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_location" className="text-sm font-medium">Project Location *</Label>
                <Input id="project_location" type="text" required value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referral_name" className="text-sm font-medium text-gray-700">Referral Name (Optional)</Label>
                  <Input
                    id="referral_name"
                    type="text"
                    value={formData.referral_name}
                    onChange={(e) => handleInputChange("referral_name", e.target.value)}
                    placeholder="Name of person who referred you"
                    className="h-10 border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral_phone" className="text-sm font-medium text-gray-700">Referral Phone Number (Optional)</Label>
                  <Input
                    id="referral_phone"
                    type="tel"
                    value={formData.referral_phone}
                    onChange={(e) => handleInputChange("referral_phone", e.target.value)}
                    placeholder="+91 9876543210"
                    className="h-10 border-gray-300"
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={loading || !formData.name || !formData.phone || !formData.project_location} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base">
                  {loading ? "Submitting..." : isLargeSystem ? "Contact Sales Team" : "Get My Tata Power Solar Quote"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">By submitting this form, you agree to be contacted by Tata Power Solar representatives</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default TataQuoteForm