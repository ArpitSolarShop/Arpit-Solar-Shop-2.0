"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, IndianRupee, Leaf, MapPin, PiggyBank, Timer, Zap, ShoppingCart } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

// ---------------------------
// Types
// ---------------------------
type CustomerType = "Residential" | "Commercial"
type ProductSystem = { brand: string; size: number; phase: string; price?: number; mountingType?: string }
type QuoteFormData = { fullName: string; whatsappNumber: string; pinCode: string; companyName?: string; city: string; monthlyBill: string }
type EstimateData = { roofOwnership: "" | "Yes" | "No"; constructed: "" | "Yes" | "No"; roofType: "" | "Concrete" | "Metal" | "Brick"; terraceSize: string; powerCuts: "" | "Yes" | "No"; planning: "" | "Immediately" | "3 Months" | "6 Months"; fullAddress: string; landmark: string; latitude: number | null; longitude: number | null }
type Results = { systemSize: number; requiredRoofArea: number; monthlySavings: number; yearlySavings: number; fiveYearSavings: number; grossCost: number; netCost: number; paybackYears: number; co2Savings: number }
type ProductCatalog = { residential: ProductSystem[]; commercial: ProductSystem[] }

// ---------------------------
// Constants & Helpers
// ---------------------------
const BILL_RANGES = ["Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000", "₹4000 - ₹8000", "More than ₹8000"]
const TOTAL_ESTIMATE_STEPS = 3
const stateTariffs: Record<string, number> = { "Uttar Pradesh": 7.2, Delhi: 8, Maharashtra: 9, Gujarat: 7, Rajasthan: 8.5 }
const avgSolarGenerationPerKWMonth = 120
const avgRoofAreaPerKW = 60
const systemCostPerKW = 60000
const subsidyPerKW = 18000
const maxSubsidy = 108000
const co2SavingPerKWYear = 1.2

const convertBillRangeToNumber = (range: string): number | null => {
    if (!range) return null
    switch (range) {
        case "Less than ₹1500": return 1000
        case "₹1500 - ₹2500": return 2000
        case "₹2500 - ₹4000": return 3250
        case "₹4000 - ₹8000": return 6000
        case "More than ₹8000": return 9000
        default: {
            const parsed = Number.parseFloat(range)
            return isNaN(parsed) ? null : parsed
        }
    }
}

// ---------------------------
// Small UI Helpers/styles
// ---------------------------
const inputBase = "w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0a2351] px-3 py-2 text-sm"
const buttonBase = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2351] disabled:opacity-50 disabled:pointer-events-none"
const buttonPrimary = `${buttonBase} bg-gradient-to-r from-[#0a2351] to-[#0d2e67] text-white hover:opacity-90`
const buttonOutline = `${buttonBase} border hover:bg-muted`
const chip = "rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"

// ---------------------------
// Inline toast (self-contained)
// ---------------------------
function useInlineToast() {
    const [msg, setMsg] = useState<{ title: string; desc?: string } | null>(null)
    useEffect(() => {
        if (!msg) return
        const t = setTimeout(() => setMsg(null), 2800)
        return () => clearTimeout(t)
    }, [msg])
    return { msg, setMsg }
}

// ---------------------------
// Stepper Component
// ---------------------------
function Stepper({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full">
            <ol className="flex items-center gap-2" aria-label="Progress">
                {Array.from({ length: total }).map((_, i) => {
                    const idx = i + 1
                    const isActive = idx <= current
                    return (
                        <li key={idx} className="flex-1">
                            <div className="flex items-center gap-2">
                                <div className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold ${isActive ? "bg-[#0a2351] text-white border-[#0a2351]" : "bg-background text-muted-foreground"}`}>
                                    {isActive ? <Check className="h-4 w-4" /> : idx}
                                </div>
                                {i < total - 1 && <div className={`h-1 w-full rounded-full ${i + 1 < current ? "bg-[#0a2351]" : "bg-muted"}`} />}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

// ---------------------------
// Hook: useProductCatalog
// ---------------------------
function useProductCatalog() {
    const [catalog, setCatalog] = useState<ProductCatalog | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        const fetchAndNormalize = async () => {
            try {
                const [tataRes, shaktiRes, relianceRes, relianceLargeRes] = await Promise.all([
                    supabase.from('tata_grid_tie_systems').select('*'),
                    supabase.from('shakti_grid_tie_systems').select('*'),
                    supabase.from('reliance_grid_tie_systems').select('*'),
                    supabase.from('reliance_large_systems').select('*')
                ])

                if (tataRes.error) throw tataRes.error
                if (shaktiRes.error) throw shaktiRes.error
                if (relianceRes.error) throw relianceRes.error
                if (relianceLargeRes.error) throw relianceLargeRes.error

                const tataProducts: ProductSystem[] = (tataRes.data || []).map((p: any) => ({ brand: 'Tata', size: Number(p.system_size), phase: p.phase, price: Number(p.total_price) }))
                const shaktiProducts: ProductSystem[] = (shaktiRes.data || []).map((p: any) => ({ brand: 'Shakti', size: Number(p.system_size), phase: p.phase, price: Number(p.pre_gi_elevated_price) }))
                const relianceProducts: ProductSystem[] = (relianceRes.data || []).map((p: any) => ({ brand: 'Reliance', size: Number(p.system_size), phase: p.phase, price: Number(p.hdg_elevated_price) }))

                const relianceLargeProducts: ProductSystem[] = []
                    ; (relianceLargeRes.data || []).forEach((p: any) => {
                        const size = Number(p.system_size_kwp)
                        const phase = p.phase
                        const getPrice = (totalField: string, perWattField: string): number => {
                            let totalPrice = Number(p[totalField])
                            if (isNaN(totalPrice) || totalPrice <= 0) {
                                const perWatt = Number(p[perWattField])
                                totalPrice = perWatt > 0 && size > 0 ? Math.round(perWatt * size * 1000) : 0
                            }
                            return totalPrice
                        }

                        const prices: Record<string, number> = {
                            "Tin Shed": getPrice('short_rail_tin_shed_price', 'short_rail_tin_shed_price_per_watt'),
                            "RCC Elevated": getPrice('hdg_elevated_rcc_price', 'hdg_elevated_rcc_price_per_watt'),
                            "Pre GI MMS": getPrice('pre_gi_mms_price', 'pre_gi_mms_price_per_watt'),
                            "Without MMS": getPrice('price_without_mms_price', 'price_without_mms_price_per_watt')
                        }

                        Object.entries(prices).forEach(([mountingType, price]) => {
                            if (price > 0 && size > 0) relianceLargeProducts.push({ brand: 'Reliance', size, phase, price, mountingType })
                        })
                    })

                const all = [...tataProducts, ...shaktiProducts, ...relianceProducts, ...relianceLargeProducts].filter(p => p.size > 0)
                const residential = all.filter(p => p.size <= 13.8)
                const commercial = all.filter(p => p.size > 13.8)

                if (mounted) setCatalog({ residential, commercial })

            } catch (err: any) {
                console.error(err)
                if (mounted) setError(err?.message || "Failed to load product catalog")
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchAndNormalize()
        return () => { mounted = false }
    }, [])

    return { catalog, loading, error }
}

// ---------------------------
// KIT19: SEND LEAD ONLY ONCE — ON INITIAL FORM SUBMIT
// ---------------------------
const sendToKit19 = async (formData: QuoteFormData, estimateData: EstimateData, customerType: CustomerType) => {
    const apiUrl = process.env.NEXT_PUBLIC_KIT19_API
    const authKey = process.env.NEXT_PUBLIC_KIT19_AUTH

    if (!apiUrl || !authKey) {
        console.warn("Kit19: Missing env vars (VITE_KIT19_API or VITE_KIT19_AUTH)")
        return
    }

    const payload = {
        PersonName: formData.fullName.trim(),
        CompanyName: customerType === "Commercial" ? (formData.companyName?.trim() || "") : "",
        MobileNo: formData.whatsappNumber.replace(/\D/g, "").slice(-10),
        MobileNo1: "", MobileNo2: "",
        EmailID: "", EmailID1: "", EmailID2: "",
        City: formData.city.trim() || "Varanasi",
        State: "Uttar Pradesh",
        Country: "India",
        CountryCode: "+91", CountryCode1: "", CountryCode2: "",
        PinCode: formData.pinCode.trim() || "221001",
        ResidentialAddress: estimateData.fullAddress.trim() || "Not provided",
        OfficeAddress: customerType === "Commercial" ? (estimateData.fullAddress.trim() || "Not provided") : "",
        SourceName: "Website",
        MediumName: "Solar Quote Form",
        CampaignName: "Hero Get Quote",
        InitialRemarks: `Customer Type: ${customerType}, Monthly Bill: ${formData.monthlyBill}, System Interest: Solar Rooftop`
    }

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: {
                "kit19-Auth-Key": authKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        // Kit19: Lead synced successfully
    } catch (err) {
        console.warn("Kit19: Sync failed (non-critical)", err)
    }
}

// ---------------------------
// Component: HeroGetQuote
// ---------------------------
export function HeroGetQuote() {
    const { catalog: productCatalog, loading: catalogLoading, error: catalogError } = useProductCatalog()
    const { msg, setMsg } = useInlineToast()

    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [customerType, setCustomerType] = useState<CustomerType>("Residential")
    const [agreed, setAgreed] = useState(false)
    const [submittingProductId, setSubmittingProductId] = useState<string | null>(null)
    const [newlyCreatedQuoteId, setNewlyCreatedQuoteId] = useState<string | null>(null)

    const [formData, setFormData] = useState<QuoteFormData>({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" })
    const [estimateData, setEstimateData] = useState<EstimateData>({ roofOwnership: "", constructed: "", roofType: "", terraceSize: "", powerCuts: "", planning: "", fullAddress: "", landmark: "", latitude: null, longitude: null })
    const [results, setResults] = useState<Results>({ systemSize: 0, requiredRoofArea: 0, monthlySavings: 0, yearlySavings: 0, fiveYearSavings: 0, grossCost: 0, netCost: 0, paybackYears: 0, co2Savings: 0 })
    const [recommendedProducts, setRecommendedProducts] = useState<ProductSystem[]>([])

    const updateForm = (k: keyof QuoteFormData, v: string) => setFormData(p => ({ ...p, [k]: v }))
    const updateEstimate = (k: keyof EstimateData, v: EstimateData[typeof k]) => setEstimateData(p => ({ ...p, [k]: v }))

    const detailsValid = Boolean(formData.fullName.trim() && formData.whatsappNumber.trim() && (customerType === "Residential" ? formData.pinCode.trim() : true) && (customerType === "Commercial" ? formData.companyName?.trim() : true) && formData.monthlyBill.trim() && agreed)
    const progressPct = step > 0 && step < 4 ? Math.round((step / TOTAL_ESTIMATE_STEPS) * 100) : step === 4 ? 100 : 0

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Quick Estimates (Step 1/3)"
            case 2: return "Quick Estimates (Step 2/3)"
            case 3: return "Quick Estimates (Step 3/3)"
            case 4: return "Your Solar Estimate"
            default: return "Get a Free Solar Quote"
        }
    }

    // ---------------------------
    // Submit initial details into supabase + KIT19 ONCE
    // ---------------------------
    const handleSubmitDetails = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!detailsValid) return setMsg({ title: "Please complete required fields" })
        setLoading(true)
        try {
            const dataToInsert: any = {
                name: formData.fullName,
                phone: formData.whatsappNumber,
                customer_type: customerType.toLowerCase(),
                company_name: customerType === "Commercial" ? formData.companyName : null,
                project_location: `${formData.city || ''}${formData.pinCode ? ', ' + formData.pinCode : ''}`,
                source: "Hero Quote Form",
                monthly_bill: convertBillRangeToNumber(formData.monthlyBill)
            }
            const { data, error } = await supabase.from('solar_quote_requests').insert(dataToInsert).select('id').single()
            if (error) throw error
            if (data?.id) setNewlyCreatedQuoteId(data.id)
            setMsg({ title: "Details saved", desc: "Let’s get a quick estimate." })
            setStep(1)

            // === KIT19: SEND ONLY ONCE — HERE ===
            sendToKit19(formData, estimateData, customerType)

        } catch (err: any) {
            console.error('Insert failed', err)
            setMsg({ title: "Could not save details", desc: err?.message ?? 'Proceeding without ID' })
            setStep(1)

            // === KIT19: STILL SEND EVEN IF SUPABASE FAILS ===
            sendToKit19(formData, estimateData, customerType)
        } finally {
            setLoading(false)
        }
    }

    // ---------------------------
    // Calculate estimates + recommendations
    // ---------------------------
    const handleCalculate = async () => {
        if (!productCatalog) return setMsg({ title: "Products are still loading, please wait." })
        setLoading(true)
        try {
            const actualMonthlyBill = convertBillRangeToNumber(formData.monthlyBill) || 0
            const tariff = stateTariffs[formData.city] || stateTariffs["Uttar Pradesh"]
            const estimatedMonthlyConsumption = actualMonthlyBill > 0 && tariff > 0 ? actualMonthlyBill / tariff : 0
            const systemSizeRaw = estimatedMonthlyConsumption > 0 ? Math.ceil(estimatedMonthlyConsumption / avgSolarGenerationPerKWMonth / 0.9) : 1
            const systemSize = Math.max(1, Math.min(systemSizeRaw, 100))

            const grossCost = systemSize * systemCostPerKW
            const applicableSubsidy = Math.min(systemSize * subsidyPerKW, maxSubsidy)
            const netCost = Math.max(0, grossCost - applicableSubsidy)
            const monthlySavings = Math.round(estimatedMonthlyConsumption * tariff * 0.9)

            setResults({
                systemSize,
                requiredRoofArea: Math.round(systemSize * avgRoofAreaPerKW),
                monthlySavings,
                yearlySavings: monthlySavings * 12,
                fiveYearSavings: monthlySavings * 60,
                grossCost,
                netCost,
                paybackYears: netCost > 0 && monthlySavings > 0 ? Number.parseFloat((netCost / (monthlySavings * 12)).toFixed(1)) : 0,
                co2Savings: Number.parseFloat((systemSize * co2SavingPerKWYear).toFixed(1))
            })

            const source = customerType === 'Residential' ? productCatalog.residential : productCatalog.commercial
            if (source && source.length) {
                const brands = [...new Set(source.map(p => p.brand))]
                const recommendations: ProductSystem[] = []
                brands.forEach(brand => {
                    const brandProducts = source.filter(p => p.brand === brand)
                    if (brandProducts.length > 0) {
                        if (brand === 'Reliance' && customerType === 'Commercial') {
                            const grouped = brandProducts.reduce((acc: Record<number, ProductSystem[]>, p) => {
                                if (!acc[p.size]) acc[p.size] = []
                                acc[p.size].push(p)
                                return acc
                            }, {})
                            const sizes = Object.keys(grouped).map(Number)
                            if (sizes.length > 0) {
                                const closestSize = sizes.reduce((prev, curr) => Math.abs(curr - systemSize) < Math.abs(prev - systemSize) ? curr : prev)
                                recommendations.push(...grouped[closestSize])
                            }
                        } else {
                            const closestProduct = brandProducts.reduce((prev, curr) => (Math.abs(curr.size - systemSize) < Math.abs(prev.size - systemSize) ? curr : prev))
                            recommendations.push(closestProduct)
                        }
                    }
                })
                setRecommendedProducts(recommendations)
            } else {
                setRecommendedProducts([])
            }

            setStep(4)
        } catch (err: any) {
            console.error('Calculation error', err)
            setMsg({ title: "Calculation error", desc: "Please check details and try again." })
        } finally {
            setLoading(false)
        }
    }

    // ---------------------------
    // Update existing quote record and send to backend — NO KIT19 HERE
    // ---------------------------
    const handleDirectQuote = async (product: ProductSystem) => {
        const id = `${product.brand}-${product.size}-${product.mountingType ?? 'default'}`
        setSubmittingProductId(id)
        try {
            const payload: any = {
                name: formData.fullName,
                phone: formData.whatsappNumber,
                email: null,
                entity_type: null,
                solution_classification: null,
                estimated_area_sqft: Number(estimateData.terraceSize) || null,
                monthly_bill: formData.monthlyBill,
                power_demand_kw: product.size,
                project_location: `${estimateData.fullAddress || ''}${formData.pinCode ? ', ' + formData.pinCode : ''}`,
                product_name: `${product.size} kWp Solar System (${product.phase}-Phase)${product.mountingType ? ` - ${product.mountingType}` : ''}`,
                product_category: product.brand,
                source: "Quote Form",
                customer_type: customerType.toLowerCase(),
                phase: product.phase,
                mounting_type: product.mountingType || null,
                latitude: estimateData.latitude,
                longitude: estimateData.longitude,
            }

            if (newlyCreatedQuoteId) {
                try {
                    await supabase.from('solar_quote_requests').update({ power_demand_kw: product.size, product_name: payload.product_name, mounting_type: payload.mounting_type }).eq('id', newlyCreatedQuoteId)
                } catch (updateErr) {
                    console.warn('Failed to update quote record:', updateErr)
                }
            }

            const res = await fetch("/api/generate-quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error(`Server responded ${res.status}`)
            setMsg({ title: "Quote request sent!", desc: "We will get back to you shortly." })

            // === NO KIT19 CALL HERE ===

        } catch (err: any) {
            console.error('Direct quote failed', err)
            setMsg({ title: "Submission Failed", desc: err?.message ?? 'Please try again later.' })
        } finally {
            setSubmittingProductId(null)
        }
    }

    // ---------------------------
    // Location helper
    // ---------------------------
    const handleShareLocation = () => {
        if (!navigator.geolocation) return setMsg({ title: "Geolocation not supported" })
        navigator.geolocation.getCurrentPosition((pos) => {
            updateEstimate('latitude', pos.coords.latitude)
            updateEstimate('longitude', pos.coords.longitude)
            setMsg({ title: "Location shared" })
        }, () => setMsg({ title: "Location error", desc: "Try manual address" }))
    }

    // ---------------------------
    // UI rendering
    // ---------------------------
    if (catalogLoading) return <section className="w-full max-w-xl mx-auto p-8 text-center">Loading products...</section>
    if (catalogError) return <section className="w-full max-w-xl mx-auto p-8 text-center text-red-600">Error: {catalogError}</section>

    return (
        <section className="w-full max-w-xl mx-auto px-4 sm:px-0">
            <div className="rounded-2xl border bg-background shadow-sm">
                <div className="p-5 border-b">
                    <div className="flex items-center justify-between gap-3">
                        {step > 0 && step < 4 ? (<button type="button" className={`${buttonOutline} h-9 w-9 p-0`} onClick={() => setStep(s => Math.max(0, s - 1))} aria-label="Go back"><ArrowLeft className="h-4 w-4" /></button>) : <div />}
                        <h2 className="text-lg font-semibold text-blue-900">{getStepTitle()}</h2>
                        <div className="text-sm text-muted-foreground">{progressPct}%</div>
                    </div>
                    {step > 0 && step < 4 && (<div className="mt-4"><Stepper current={step} total={TOTAL_ESTIMATE_STEPS} /></div>)}
                </div>

                <div className="p-5">
                    <AnimatePresence>
                        {msg && (<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-sm" role="status" aria-live="polite" ><p className="font-medium text-blue-900">{msg.title}</p>{msg.desc && <p className="text-muted-foreground">{msg.desc}</p>}</motion.div>)}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease: "easeOut" }}>

                            {step === 0 && (
                                <form onSubmit={handleSubmitDetails} className="space-y-5">
                                    <div className="bg-muted/40 rounded-full p-1 grid grid-cols-2 gap-1">
                                        {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
                                            <button key={type} type="button" onClick={() => { setCustomerType(type); setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" }) }} className={`h-9 rounded-full text-sm font-semibold transition-colors ${customerType === type ? "bg-[#0a2351] text-white" : "text-muted-foreground hover:bg-muted"}`} aria-pressed={customerType === type}>{type}</button>
                                        ))}
                                    </div>

                                    <div className="space-y-1.5"><label htmlFor="fullName" className="text-sm">Full Name <span className="text-destructive">*</span></label><input id="fullName" required className={inputBase} value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} /></div>

                                    {customerType === 'Commercial' ? (
                                        <>
                                            <div className="space-y-1.5"><label htmlFor="companyName" className="text-sm">Company Name <span className="text-destructive">*</span></label><input id="companyName" required className={inputBase} value={formData.companyName ?? ''} onChange={(e) => updateForm('companyName', e.target.value)} /></div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5"><label htmlFor="city" className="text-sm">City <span className="text-destructive">*</span></label><input id="city" required className={inputBase} value={formData.city} onChange={(e) => updateForm('city', e.target.value)} /></div>
                                                <div className="space-y-1.5"><label htmlFor="pinCommercial" className="text-sm">PIN Code</label><input id="pinCommercial" className={inputBase} value={formData.pinCode} onChange={(e) => updateForm('pinCode', e.target.value)} /></div>
                                            </div>
                                            <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm('whatsappNumber', e.target.value)} /></div>
                                            <div className="space-y-1.5"><label htmlFor="bill" className="text-sm">Average Monthly Bill <span className="text-destructive">*</span></label><input id="bill" type="number" required className={inputBase} placeholder="Enter amount in ₹" value={formData.monthlyBill} onChange={(e) => updateForm('monthlyBill', e.target.value)} /></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1.5"><label htmlFor="wa" className="text-sm">WhatsApp Number <span className="text-destructive">*</span></label><input id="wa" type="tel" required className={inputBase} value={formData.whatsappNumber} onChange={(e) => updateForm('whatsappNumber', e.target.value)} /></div>
                                            <div className="space-y-1.5"><label htmlFor="pin" className="text-sm">PIN Code <span className="text-destructive">*</span></label><input id="pin" required className={inputBase} value={formData.pinCode} onChange={(e) => updateForm('pinCode', e.target.value)} /></div>
                                            <div className="space-y-1.5">
                                                <span className="text-sm">Average monthly bill? <span className="text-destructive">*</span></span>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<button key={range} type="button" onClick={() => updateForm('monthlyBill', range)} className={`${chip} ${formData.monthlyBill === range ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`} aria-pressed={formData.monthlyBill === range}>{range}</button>))}</div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-start gap-3 pt-2"><input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border" /><label htmlFor="agree" className="text-sm text-muted-foreground">I agree to the terms of service & privacy policy.</label></div>

                                    <button type="submit" disabled={loading} className={`${buttonPrimary} w-full h-11 font-semibold`}>{loading ? "Submitting..." : "Submit Details"}</button>
                                </form>
                            )}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-1.5"><span className="text-sm">Do you have roof ownership?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate('roofOwnership', v)} className={`${chip} ${estimateData.roofOwnership === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
                                    <div className="space-y-1.5"><span className="text-sm">Is your house fully constructed?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate('constructed', v)} className={`${chip} ${estimateData.constructed === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
                                    <div className="space-y-1.5"><span className="text-sm">Select the roof type</span><div className="grid grid-cols-1 gap-2">{(["Concrete", "Metal", "Brick"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate('roofType', v)} className={`${chip} ${estimateData.roofType === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v} Roof</button>))}</div></div>
                                    <button onClick={() => setStep(2)} className={`${buttonPrimary} w-full`}>Next</button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-1.5"><label htmlFor="terrace" className="text-sm">Approx. Terrace Size (in Sq. ft)</label><input id="terrace" type="number" min={0} className={inputBase} placeholder="Enter Roof Area" value={estimateData.terraceSize} onChange={(e) => updateEstimate('terraceSize', e.target.value)} /></div>
                                    <div className="space-y-1.5"><span className="text-sm">Do you face regular power cuts?</span><div className="grid grid-cols-2 gap-2">{(["Yes", "No"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate('powerCuts', v)} className={`${chip} ${estimateData.powerCuts === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v}</button>))}</div></div>
                                    <div className="space-y-1.5"><span className="text-sm">When are you planning to get Solar?</span><div className="grid grid-cols-1 gap-2">{(["Immediately", "3 Months", "6 Months"] as const).map((v) => (<button key={v} type="button" onClick={() => updateEstimate('planning', v)} className={`${chip} ${estimateData.planning === v ? "bg-[#0a2351] text-white border-[#0a2351]" : ""}`}>{v === "Immediately" ? "Immediately" : `In ${v}`}</button>))}</div></div>
                                    <button onClick={() => setStep(3)} className={`${buttonPrimary} w-full`}>Next</button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-5">
                                    <button onClick={handleShareLocation} className={`${buttonOutline} w-full`} type="button"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Share my current location</span></button>
                                    <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div></div>
                                    <div className="space-y-1.5"><label htmlFor="addr" className="text-sm">Enter your full address</label><input id="addr" className={inputBase} value={estimateData.fullAddress} onChange={(e) => updateEstimate('fullAddress', e.target.value)} /></div>
                                    <div className="space-y-1.5"><label htmlFor="landmark" className="text-sm">Landmark</label><input id="landmark" className={inputBase} value={estimateData.landmark} onChange={(e) => updateEstimate('landmark', e.target.value)} /></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-1.5"><label className="text-sm">PIN Code</label><input className={inputBase} value={formData.pinCode} readOnly /></div>
                                        <div className="space-y-1.5"><label className="text-sm">City</label><input className={inputBase} value={formData.city || "Varanasi"} onChange={(e) => updateForm('city', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm">State</label><input className={inputBase} value="Uttar Pradesh" readOnly /></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setStep(2)} className={buttonOutline} type="button">Back</button>
                                        <button onClick={handleCalculate} disabled={loading} className={`${buttonPrimary} flex-1`}>{loading ? "Calculating..." : "Get Estimates"}</button>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="text-center space-y-2"><h3 className="text-xl font-semibold text-blue-900">Your Solar Estimate</h3><p className="text-sm text-muted-foreground">A quick overview based on your inputs</p></div>

                                    <div className="rounded-lg border bg-blue-50 p-4 grid grid-cols-2 gap-4 text-center">
                                        <div><p className="text-xs text-muted-foreground">Required System Size</p><p className="mt-1 text-2xl font-bold inline-flex items-center justify-center gap-2"><Zap className="h-5 w-5 text-yellow-500" />{results.systemSize} kW</p></div>
                                        <div><p className="text-xs text-muted-foreground">Approx. Roof Area Needed</p><p className="mt-1 text-xl font-semibold">{results.requiredRoofArea} sq. ft.</p></div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 text-blue-900">Estimated Savings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="rounded-lg border bg-gradient-to-r from-cyan-600 to-blue-700 p-3 text-center"><p className="text-xs text-white/80">Monthly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.monthlySavings.toLocaleString('en-IN')}</p></div>
                                            <div className="rounded-lg border bg-gradient-to-r from-sky-600 to-indigo-700 p-3 text-center"><p className="text-xs text-white/80">Yearly</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.yearlySavings.toLocaleString('en-IN')}</p></div>
                                            <div className="rounded-lg border bg-gradient-to-r from-cyan-600 to-blue-700 p-3 text-center"><p className="text-xs text-white/80">5-Year</p><p className="text-xl font-bold inline-flex items-center justify-center gap-1 text-white"><IndianRupee className="h-4 w-4" />{results.fiveYearSavings.toLocaleString('en-IN')}</p></div>
                                        </div>
                                    </div>

                                    {!!recommendedProducts.length && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2 inline-flex items-center gap-2 text-blue-900"><ShoppingCart className="h-4 w-4" /> Product Recommendations</h4>
                                            <div className={`grid grid-cols-1 ${recommendedProducts.length > 1 ? "md:grid-cols-3" : ""} gap-3`}>
                                                {recommendedProducts.map((p) => {
                                                    const id = `${p.brand}-${p.size}-${p.mountingType ?? 'default'}`
                                                    const isSubmitting = submittingProductId === id
                                                    return (
                                                        <div key={id} className="rounded-lg border bg-background p-3 flex flex-col">
                                                            <div className="flex-1 space-y-2">
                                                                <div><p className="text-xs text-muted-foreground">Brand</p><p className="font-semibold">{p.brand}</p></div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div><p className="text-xs text-muted-foreground">System Size</p><p className="font-medium">{p.size} kWp</p></div>
                                                                    <div><p className="text-xs text-muted-foreground">Phase</p><p className="font-medium">{p.phase}</p></div>
                                                                </div>
                                                                {p.mountingType && (<div><p className="text-xs text-muted-foreground">Mounting Type</p><p className="font-medium">{p.mountingType}</p></div>)}
                                                                {p.price ? (<div className="pt-2 border-t"><p className="text-xs text-muted-foreground">Est. Price</p><p className="text-lg font-bold text-blue-900">₹{p.price.toLocaleString('en-IN')}</p></div>) : null}
                                                            </div>
                                                            <button className={`${buttonPrimary} mt-3`} onClick={() => handleDirectQuote(p)} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Get Instant Quote"}</button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-lg border bg-blue-50 p-4 space-y-2">
                                        <p className="flex items-center gap-2 text-sm"><PiggyBank className="h-4 w-4 text-emerald-600" /><span className="font-medium">Gross System Cost:</span> ₹{results.grossCost.toLocaleString('en-IN')}</p>
                                        <p className="flex items-center gap-2 text-sm"><IndianRupee className="h-4 w-4 text-amber-600" /><span className="font-medium">Net Cost (after subsidy):</span> ₹{results.netCost.toLocaleString('en-IN')}</p>
                                        <p className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4 text-orange-600" /><span className="font-medium">Estimated Payback:</span> {results.paybackYears} years</p>
                                        <p className="flex items-center gap-2 text-sm"><Leaf className="h-4 w-4 text-emerald-700" /><span className="font-medium">CO₂ Savings:</span> {results.co2Savings} tons/year</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => setStep(0)} className={buttonOutline} type="button">Start New Estimate</button>
                                        <button onClick={() => window?.scrollTo?.({ top: 0, behavior: 'smooth' })} className={buttonOutline} type="button">Back to top</button>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

// Backwards-compatible default export (so both named and default imports work)
export default HeroGetQuote
