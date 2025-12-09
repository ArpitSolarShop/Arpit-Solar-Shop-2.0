"use client"

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
  productName?: string
  systemCapacity?: string
  hasBattery?: boolean
}

const HybridQuoteForm = ({
  open,
  onOpenChange,
  productName = "Hybrid Solar System",
  systemCapacity = "",
  hasBattery = false,
}: HybridQuoteFormProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    entity_type: "",
    usage_type: "",
    monthly_bill: "",
    backup_requirements: "",
    project_location: "",
    referral_name: "",
    referral_phone: "",
  })

  useEffect(() => {
    // Reset form when modal opens/closes
    if (!open) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        entity_type: "",
        usage_type: "",
        monthly_bill: "",
        backup_requirements: "",
        project_location: "",
        referral_name: "",
        referral_phone: "",
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.name || !formData.phone || !formData.project_location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number starting with 6-9.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Build payload for Supabase
      const insertData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        entity_type: (formData.entity_type as "Individual" | "Enterprise") || null,
        solution_classification: (formData.usage_type as "Residential" | "Commercial" | "Industrial" | "Agricultural") || null,
        estimated_area_sqft: null,
        monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
        power_demand_kw: systemCapacity ? parseFloat(systemCapacity.replace(/[^0-9.]/g, '')) : null,
        project_location: formData.project_location,
        referral_name: formData.referral_name || null,
        referral_phone: formData.referral_phone || null,
        product_name: productName,
        product_category: "Hybrid",
        source: "Hybrid Quote Form" as const,
        customer_type: formData.entity_type === "Individual" ? "residential" : "commercial",
        referral_source: formData.referral_name ? "referral" : null,
        backup_requirements: formData.backup_requirements || null,
        system_capacity: systemCapacity || null,
        has_battery: hasBattery,
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('solar_quote_requests')
        .insert(insertData)
      
      if (error) throw error

      // Send to secondary server
      try {
        const response = await fetch('https://solar-quote-server.onrender.com/generate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertData),
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

      // Show success message
      toast({
        title: "Thank You!",
        description: "Our hybrid solar experts will contact you within 24 hours to discuss your requirements.",
      })

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        entity_type: "",
        usage_type: "",
        monthly_bill: "",
        backup_requirements: "",
        project_location: "",
        referral_name: "",
        referral_phone: "",
      })
      
      // Close the form
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit your request. Please try again later.",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="relative">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg">
              <Zap className="h-5 w-5" />
              <span className="text-xl font-bold">Hybrid Solar Solutions</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Get Your Hybrid Solar Quote
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Fill in your details and our experts will contact you with a customized solution
            </DialogDescription>
          </div>

          {productName && systemCapacity && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Selected System:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                  {systemCapacity} {productName}
                </Badge>
                {hasBattery && (
                  <Badge className="bg-green-100 text-green-800 text-sm flex items-center gap-1">
                    <Battery className="h-3 w-3" /> With Battery Backup
                  </Badge>
                )}
              </div>
            </div>
          )}
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>24/7 Power Backup</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Smart Energy Management</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>5-Year Warranty</span>
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => handleInputChange("name", e.target.value)} 
                    placeholder="Enter your full name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange("phone", e.target.value)} 
                    placeholder="9876543210" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange("email", e.target.value)} 
                    placeholder="your.email@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type" className="text-sm font-medium">I am a</Label>
                  <Select 
                    value={formData.entity_type} 
                    onValueChange={(value) => handleInputChange("entity_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Homeowner</SelectItem>
                      <SelectItem value="Business">Business Owner</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage_type" className="text-sm font-medium">Primary Usage</Label>
                  <Select 
                    value={formData.usage_type} 
                    onValueChange={(value) => handleInputChange("usage_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select usage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Home Use</SelectItem>
                      <SelectItem value="Commercial">Commercial Use</SelectItem>
                      <SelectItem value="Industrial">Industrial Use</SelectItem>
                      <SelectItem value="Agricultural">Agricultural Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_bill" className="text-sm font-medium">Current Monthly Electricity Bill (₹)</Label>
                  <Input 
                    id="monthly_bill" 
                    type="number" 
                    value={formData.monthly_bill} 
                    onChange={(e) => handleInputChange("monthly_bill", e.target.value)} 
                    placeholder="e.g. 5000" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup_requirements" className="text-sm font-medium">Backup Requirements</Label>
                <Select 
                  value={formData.backup_requirements} 
                  onValueChange={(value) => handleInputChange("backup_requirements", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select backup requirements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Home Backup">Full Home Backup</SelectItem>
                    <SelectItem value="Partial Backup">Partial Backup (Essential Loads)</SelectItem>
                    <SelectItem value="Battery Backup">Battery Backup Only</SelectItem>
                    <SelectItem value="Not Sure">Not Sure - Need Advice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project_location" className="text-sm font-medium">Project Location *</Label>
                <Input 
                  id="project_location" 
                  type="text" 
                  required 
                  value={formData.project_location} 
                  onChange={(e) => handleInputChange("project_location", e.target.value)} 
                  placeholder="City, State" 
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Referral Information (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral_name" className="text-sm text-gray-600">Referral Name</Label>
                    <Input
                      id="referral_name"
                      type="text"
                      value={formData.referral_name}
                      onChange={(e) => handleInputChange("referral_name", e.target.value)}
                      placeholder="Name of person who referred you"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral_phone" className="text-sm text-gray-600">Referral Phone</Label>
                    <Input
                      id="referral_phone"
                      type="tel"
                      value={formData.referral_phone}
                      onChange={(e) => handleInputChange("referral_phone", e.target.value)}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold h-12 text-base"
                >
                  {loading ? "Processing..." : "Get My Hybrid Solar Quote"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  Our team will contact you shortly.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default HybridQuoteForm
