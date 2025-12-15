// "use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface IntegratedQuoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: { id: number; brand: string; system_kw: number; price: number } | null
  productName?: string
  isLargeSystem?: boolean
  powerDemandKw?: number | null
}

export default function IntegratedQuoteForm({
  open,
  onOpenChange,
  product = null,
  productName = 'Integrated Product',
  isLargeSystem = false,
  powerDemandKw = null,
}: IntegratedQuoteFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    entity_type: '',
    solution_classification: '',
    estimated_area_sqft: '',
    monthly_bill: '',
    power_demand_kw: '',
    project_location: '',
    referral_name: '',
    referral_phone: '',
  })

  useEffect(() => {
    if (product && product.system_kw !== undefined) {
      setFormData((prev) => ({ ...prev, power_demand_kw: String(product.system_kw) }))
    } else if (powerDemandKw !== null && powerDemandKw !== undefined) {
      setFormData((prev) => ({ ...prev, power_demand_kw: String(powerDemandKw) }))
    } else {
      setFormData((prev) => ({ ...prev, power_demand_kw: '' }))
    }
  }, [product, powerDemandKw, open])

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.name) return 'Name is required'
    if (!formData.phone || !phoneRegex.test(formData.phone)) return 'Valid phone number is required (10 digits, starting with 6-9)'
    if (formData.email && !emailRegex.test(formData.email)) return 'Invalid email format'
    if (!formData.project_location) return 'Project location is required'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Client-side validation
    const validationError = validateForm()
    if (validationError) {
      toast({ title: 'Error', description: validationError, variant: 'destructive' })
      setLoading(false)
      return
    }

    try {
      const insertData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        entity_type: formData.entity_type || null,
        solution_classification: formData.solution_classification || null,
        estimated_area_sqft: formData.estimated_area_sqft ? parseFloat(formData.estimated_area_sqft) : null,
        monthly_bill: formData.monthly_bill ? parseFloat(formData.monthly_bill) : null,
        power_demand_kw: formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null,
        project_location: formData.project_location || null,
        referral_name: formData.referral_name || null,
        referral_phone: formData.referral_phone || null,
        product_name: product ? `${product.brand} ${product.system_kw} kW - ₹${product.price?.toLocaleString('en-IN')}` : productName,
        product_category: product?.brand ?? 'Integrated',
        source: 'Integrated Quote Form' as const,
        customer_type: formData.entity_type === 'Individual' ? 'residential' : 'commercial',
        referral_source: formData.referral_name ? 'referral' : null,
        estimated_system_size_kw: product?.system_kw ?? (formData.power_demand_kw ? parseFloat(formData.power_demand_kw) : null),
        additional_details: product ? { product_id: product.id, product_brand: product.brand, product_price: product.price } : null,
      }

      // Attempt insert with extended product fields first
      console.log('Attempting to insert quote payload:', insertData)
      const { error } = await supabase.from('solar_quote_requests' as any).insert(insertData)
      if (error) {
        console.error('Supabase insert error (extended payload):', error)
        // Try a fallback payload without potentially unknown DB columns
        const fallback = {
          name: insertData.name,
          phone: insertData.phone,
          email: insertData.email,
          entity_type: insertData.entity_type,
          solution_classification: insertData.solution_classification,
          estimated_area_sqft: insertData.estimated_area_sqft,
          monthly_bill: insertData.monthly_bill,
          power_demand_kw: insertData.power_demand_kw,
          project_location: insertData.project_location,
          referral_name: insertData.referral_name,
          referral_phone: insertData.referral_phone,
          product_name: insertData.product_name,
          product_category: insertData.product_category,
          source: insertData.source,
          customer_type: insertData.customer_type,
          referral_source: insertData.referral_source,
          estimated_system_size_kw: insertData.estimated_system_size_kw ?? null,
          additional_details: insertData.additional_details ?? null,
        }

        console.log('Attempting fallback insert payload:', fallback)
        const { error: fallbackErr } = await supabase.from('solar_quote_requests' as any).insert(fallback)
        if (fallbackErr) {
          console.error('Supabase insert error (fallback):', fallbackErr)
          throw new Error(fallbackErr.message || 'Failed to save quote request')
        }
      }

      try {
        await fetch('https://solar-quote-server.onrender.com/generate-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertData),
        })
      } catch (err) {
        console.warn('Secondary server failed:', err)
      }

      toast({
        title: 'Quote Request Submitted!',
        description: isLargeSystem
          ? 'Our sales team will contact you within 24 hours to discuss your large-scale solar project.'
          : 'Our team will contact you within 24 hours to discuss your solar solution.',
      })

      setFormData({ name: '', phone: '', email: '', entity_type: '', solution_classification: '', estimated_area_sqft: '', monthly_bill: '', power_demand_kw: '', project_location: '', referral_name: '', referral_phone: '' })
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error submitting quote:', error)
      toast({ title: 'Error', description: error.message || 'Failed to submit quote request. Please try again.', variant: 'destructive' })
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
            <img src="/Integrated.png" alt="Integrated" className="h-16 w-auto" />
          </div>

          <div className="text-center mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">{isLargeSystem ? 'Large Scale Solar Quote' : 'Integrated Product Quote'}</DialogTitle>
            <DialogDescription className="text-base text-gray-600">{isLargeSystem ? 'Get a customized quote for large-scale solar installations' : 'Get a personalized quote for our integrated solar solutions'}</DialogDescription>
          </div>

          {product && (
            <div className="flex items-center justify-center mb-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 flex items-center gap-4">
                <div><strong>{product.brand}</strong></div>
                <div>{product.system_kw} kW</div>
                <div className="text-slate-600">₹{product.price?.toLocaleString('en-IN')}</div>
                <Badge>{'Integrated'}</Badge>
              </div>
            </div>
          )}
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>#1 Integrated Solutions</span>
              <CheckCircle className="h-4 w-4 text-blue-700" /><span>Trusted Brands</span>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input id="name" type="text" required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="98765 43210" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type" className="text-sm font-medium">Entity Type</Label>
                  <Select value={formData.entity_type} onValueChange={(value) => handleInputChange('entity_type', value)}><SelectTrigger><SelectValue placeholder="Select entity type" /></SelectTrigger>
                    <SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Enterprise">Enterprise</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="solution_classification" className="text-sm font-medium">Solution Type</Label>
                  <Select value={formData.solution_classification} onValueChange={(value) => handleInputChange('solution_classification', value)}><SelectTrigger><SelectValue placeholder="Select solution type" /></SelectTrigger>
                    <SelectContent><SelectItem value="Residential">Residential Solar</SelectItem><SelectItem value="Commercial">Commercial Solar</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power_demand_kw" className="text-sm font-medium">Power Demand (kW)</Label>
                  <Input id="power_demand_kw" type="number" value={formData.power_demand_kw} onChange={(e) => handleInputChange('power_demand_kw', e.target.value)} readOnly={powerDemandKw !== null} placeholder="e.g. 5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_location" className="text-sm font-medium">Project Location *</Label>
                <Input id="project_location" type="text" required value={formData.project_location} onChange={(e) => handleInputChange('project_location', e.target.value)} placeholder="City, State" />
              </div>
              <div className="pt-4">
                <Button type="submit" disabled={loading || !formData.name || !formData.phone || !formData.project_location} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base">
                  {loading ? 'Submitting...' : isLargeSystem ? 'Contact Sales Team' : 'Get My Quote'}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">By submitting this form, you agree to be contacted by our representatives</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
