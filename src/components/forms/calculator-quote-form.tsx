"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Zap, Sun, IndianRupee } from "lucide-react"

interface CalculationResult {
  userInputKw: number;
  numberOfPanels: number;
  actualSystemSizeKwp: number;
  inverterSizeKw: number;
  pricePerWatt: number;
  totalPrice: number;
  basePrice: number;
  gstAmount: number;
}

interface CalculatorQuoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quoteData: CalculationResult | null
  mountingType: string | null
}

const CalculatorQuoteForm = ({ open, onOpenChange, quoteData, mountingType }: CalculatorQuoteFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    entity_type: "",
    solution_classification: "",
    project_location: "",
  })

  useEffect(() => {
    if (quoteData) {
      const isCommercial = quoteData.userInputKw > 10
      setFormData((prev) => ({
        ...prev,
        entity_type: isCommercial ? "Enterprise" : "Individual",
        solution_classification: isCommercial ? "Commercial" : "Residential",
      }))
    }
  }, [quoteData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quoteData) return

    setLoading(true)

    try {
      const isCommercial = quoteData.userInputKw > 10;
      const insertData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
        solution_classification: (formData.solution_classification as "Residential" | "Commercial") || null,
        power_demand_kw: quoteData.actualSystemSizeKwp,
        project_location: formData.project_location || null,
        product_name: `${quoteData.actualSystemSizeKwp} kWp Custom HJT System`,
        product_category: "Reliance",
        source: "Calculator Quote Form" as const,
        customer_type: isCommercial ? "commercial" : "residential",
        mounting_type: mountingType || null,
        metadata: {
          estimated_price: quoteData.totalPrice,
          panel_config: `${quoteData.numberOfPanels} x 710Wp`,
          inverter_size_kw: quoteData.inverterSizeKw,
          price_per_watt: quoteData.pricePerWatt,
          original_input_kw: quoteData.userInputKw,
          base_price: quoteData.basePrice,
          gst_amount: quoteData.gstAmount,
        }
      };

      await supabase.from('solar_quote_requests').insert(insertData)

      try {
        await fetch('https://solar-quote-server.onrender.com/generate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertData),
        });
      } catch (err) {
        console.warn("Local server failed:", err)
      }

      // Optional CRM - Kit19 (non-blocking)
      try {
        const crmPayload = {
          PersonName: insertData.name || '',
          CompanyName: '',
          MobileNo: insertData.phone || '',
          MobileNo1: '',
          MobileNo2: '',
          EmailID: insertData.email || '',
          EmailID1: '',
          EmailID2: '',
          City: insertData.project_location || '',
          State: '',
          Country: 'India',
          CountryCode: '+91',
          CountryCode1: '',
          CountryCode2: '',
          PinCode: '',
          ResidentialAddress: '',
          OfficeAddress: '',
          SourceName: insertData.source || 'Website',
          MediumName: (typeof window !== 'undefined' ? (document.title || window.location.pathname) : 'Website'),
          CampaignName: insertData.product_name || insertData.product_category || 'Quote Form',
          InitialRemarks: insertData.product_name ? `Product: ${insertData.product_name}` : '',
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
        description: "Our Reliance Solar team will contact you within 24 hours. You'll also receive your detailed custom quote via WhatsApp.",
      })

      setFormData({
        name: "", phone: "", email: "", entity_type: "",
        solution_classification: "", project_location: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting quote:", error)
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isCommercial = (quoteData?.userInputKw ?? 0) > 10;
  const formTitle = isCommercial ? "Custom Commercial Solar Quote" : "Custom Residential Solar Quote";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-12 w-auto" />
          </div>
          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">{formTitle}</DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Confirm your details to receive a personalized quote for your calculated system.
            </DialogDescription>
          </div>
          {quoteData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
              <span className="font-semibold text-gray-800 mb-3 block">Your Custom System Configuration:</span>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2"><Sun className="h-4 w-4 text-yellow-500" /> System Size: <b className="ml-auto">{quoteData.actualSystemSizeKwp} kWp</b></div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Inverter: <b className="ml-auto">{quoteData.inverterSizeKw} kW</b></div>
                <div className="flex items-center gap-2 text-gray-600"> Panels: <b className="ml-auto text-gray-800">{quoteData.numberOfPanels} x 710Wp</b></div>
                {mountingType && <div className="flex items-center gap-2 text-gray-600">Mounting: <b className="ml-auto text-gray-800">{mountingType}</b></div>}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t font-bold text-lg"><IndianRupee className="h-5 w-5 text-green-600" /> Estimated Price: <b className="ml-auto text-green-600">₹{quoteData.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</b></div>
            </div>
          )}
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="px-0 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="98765 43210" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_location">Project Location *</Label>
                  <Input id="project_location" required value={formData.project_location} onChange={(e) => handleInputChange("project_location", e.target.value)} placeholder="City, State" />
                </div>
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={loading || !formData.name || !formData.phone || !formData.project_location} className="w-full bg-black hover:bg-gray-800 text-white font-semibold h-12 text-base">
                  {loading ? "Submitting..." : "Confirm & Get My Quote"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">By submitting, you agree to be contacted by our solar experts.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CalculatorQuoteForm;