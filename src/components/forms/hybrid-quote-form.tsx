/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CheckCircle, AlertCircle, Battery, Zap } from "lucide-react"

interface HybridQuoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: {
    id: number;
    system_capacity: string;
    variant: 'WITH_BATTERY' | 'WOBB';
    price: number;
    battery_kwh?: number | null;
    inverter_kwp?: number;
    module_watt?: number;
    module_count?: number;
    category?: 'DCR' | 'NON_DCR' | 'NDCR' | null;
    phase?: string | null;
  } | null
  productName?: string
  hasBattery?: boolean
  powerDemandKw?: number | null
}

type HybridQuotePayload = {
  name: string
  phone: string
  email: string | null
  project_location: string
  product_category: string
  source: string
  customer_type: string
  referral_source: string | null
  power_demand_kw: number | null
  estimated_system_size_kw: number | null
  product_name: string
  additional_details: {
    category: 'DCR' | 'NON_DCR' | 'NDCR'
    variant: 'WITH_BATTERY' | 'WOBB'
    system_capacity?: string
    price?: number
    battery_kwh?: number | null
    inverter_kwp?: number
    module_watt?: number
    module_count?: number
    phase?: string | null
  }
  entity_type: string | null
  solution_classification: string | null
  estimated_area_sqft: number | null
  monthly_bill: number | null
  referral_name: string | null
  referral_phone: string | null
}

const normalizeCapacityValue = (value: string | null | undefined) => {
  if (!value) return null
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""))
  return Number.isFinite(numeric) ? numeric : null
}

const HybridQuoteForm = ({
  open,
  onOpenChange,
  product = null,
  productName = "Hybrid Solar System",
  hasBattery = false,
  powerDemandKw = null,
}: HybridQuoteFormProps) => {
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
  })

  // Pre-fill power_demand_kw if provided
  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      const pk = product?.system_capacity ? product.system_capacity.replace(/[^0-9.]/g, '') : null
      setFormData((prev) => ({
        ...prev,
        power_demand_kw: product?.system_capacity ? String(pk) : (powerDemandKw !== null && powerDemandKw !== undefined ? String(powerDemandKw) : ("")),
      }))
    }
    return () => {
      isMounted = false
    }
  }, [product, powerDemandKw, open])

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
    console.log("Submitting hybrid form with data:", {
      ...formData,
      power_demand_kw: formData.power_demand_kw,
      productName,
      product_system_capacity: product?.system_capacity ?? null,
      hasBattery,
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
      // Prepare the payload for Supabase + secondary server
      const derivedCapacity = product
        ? normalizeCapacityValue(product.system_capacity)
        : normalizeCapacityValue(formData.power_demand_kw)

      const customerType =
        formData.entity_type === "Individual"
          ? "residential"
          : formData.entity_type === "Enterprise"
            ? "commercial"
            : "residential"

      const payload: HybridQuotePayload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email ? formData.email : null,
        project_location: formData.project_location,
        product_category: "Hybrid",
        source: "Hybrid Quote Form",
        customer_type: customerType,
        referral_source: formData.referral_name ? "referral" : null,
        power_demand_kw: derivedCapacity,
        estimated_system_size_kw: derivedCapacity,
        product_name: product
          ? `${product.system_capacity} ${product.variant === "WITH_BATTERY" ? "Hybrid with Battery" : "Hybrid without Battery"
          }`
          : productName,
        additional_details: {
          category: product?.category ?? "DCR",
          variant: product?.variant ?? (hasBattery ? "WITH_BATTERY" : "WOBB"),
          ...(product
            ? {
              system_capacity: product.system_capacity,
              price: product.price,
              battery_kwh: product.battery_kwh ?? null,
              inverter_kwp: product.inverter_kwp,
              module_watt: product.module_watt,
              module_count: product.module_count,
              phase: product.phase ?? (product.system_capacity?.includes("3Ph") ? "3Ph" : "1Ph"),
            }
            : {}),
        },
        entity_type: formData.entity_type || null,
        solution_classification: formData.solution_classification || null,
        estimated_area_sqft: formData.estimated_area_sqft
          ? parseFloat(formData.estimated_area_sqft)
          : null,
        monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
        referral_name: formData.referral_name || null,
        referral_phone: formData.referral_phone || null,
      }

      const { error: supabaseError } = await supabase
        .from("solar_quote_requests")
        .insert(payload)

      if (supabaseError) {
        console.error("Supabase insert error:", supabaseError)
        const fallbackData = {
          ...payload,
          system_category: payload.additional_details.category,
          system_variant: payload.additional_details.variant,
          full_payload: payload,
        } satisfies HybridQuotePayload & {
          system_category: "DCR" | "NON_DCR" | "NDCR"
          system_variant: "WITH_BATTERY" | "WOBB"
          full_payload: HybridQuotePayload
        }

        const { error: fallbackErr } = await supabase
          .from("solar_quote_requests")
          .insert(fallbackData)

        if (fallbackErr) {
          throw new Error(fallbackErr.message || "Failed to save quote request")
        }
      }

      // Send to secondary server
      try {
        // const response = await fetch("http://localhost:3000/generate-quote", {
        const response = await fetch('https://solar-quote-server.onrender.com/generate-quote', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Secondary server error: ${errorText}`)
        }
      } catch (err) {
        console.warn("Secondary server failed:", err)
        toast({
          title: "Warning",
          description:
            "Quote saved, but failed to send to secondary server. Our team will still contact you.",
          variant: "default",
        })
      }

      // Optional CRM - Kit19 (non-blocking)
      try {
        const crmPayload = {
          PersonName: payload.name || "",
          CompanyName: "",
          MobileNo: payload.phone || "",
          MobileNo1: "",
          MobileNo2: "",
          EmailID: payload.email || "",
          EmailID1: "",
          EmailID2: "",
          City: payload.project_location || "",
          State: "",
          Country: "India",
          CountryCode: "+91",
          CountryCode1: "",
          CountryCode2: "",
          PinCode: "",
          ResidentialAddress: "",
          OfficeAddress: "",
          SourceName: payload.source || "Website",
          MediumName:
            typeof window !== "undefined" ? document.title || window.location.pathname : "Website",
          CampaignName: payload.product_name || payload.product_category || "Quote Form",
          InitialRemarks: payload.product_name ? `Product: ${payload.product_name}` : "",
        }

        const resp = await fetch("https://sipapi.kit19.com/Enquiry/Add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "kit19-Auth-Key": "4e7bb26557334f91a21e56a4ea9c8752",
          },
          body: JSON.stringify(crmPayload),
        })

        if (!resp.ok) {
          console.warn("CRM (Kit19) returned non-OK response", await resp.text())
        } else {
          console.log("CRM (Kit19) accepted payload", crmPayload)
        }
      } catch (err) {
        console.warn("CRM (Kit19) failed:", err)
      }

      toast({
        title: "Quote Request Submitted!",
        description: "Our hybrid solar experts will contact you within 24 hours to discuss your hybrid solar solution.",
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="relative">
          <div className="flex justify-center mb-4">
            <img src="/Hybrid.png" alt="Hybrid Solar System" className="h-16 w-auto" />
          </div>

          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Hybrid Solar Quote
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Get a personalized quote for 24/7 energy independence with battery backup
            </DialogDescription>
          </div>

          {productName !== "Hybrid Solar System" && (product?.system_capacity || productName !== "Hybrid Solar System") && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-gray-800">Selected Product:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                  {product?.system_capacity || "Custom"} {productName}
                </Badge>
                {hasBattery && (
                  <Badge className="bg-green-100 text-green-800 text-sm flex items-center gap-1">
                    <Battery className="h-3 w-3" /> With Battery Backup
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-2">
                SERVOTECH Hybrid Solar Inverter with {hasBattery ? "INTU /SERVOTECH Battery" : "Grid-Tie"} Configuration
              </p>
            </div>
          )}
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>24/7 Power Backup</span>
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>Smart Energy Management</span>
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>5-Year Warranty</span>
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
                  <Input id="power_demand_kw" type="number" value={formData.power_demand_kw} onChange={(e) => handleInputChange("power_demand_kw", e.target.value)} readOnly={powerDemandKw !== null || Boolean(product?.system_capacity)} placeholder="e.g. 3" />
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
                  {loading ? "Submitting..." : "Get My Hybrid Solar Quote"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">By submitting this form, you agree to be contacted by our hybrid solar representatives</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default HybridQuoteForm
