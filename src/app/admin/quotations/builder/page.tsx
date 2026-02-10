"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
    Plus,
    Trash2,
    Edit2,
    Printer,
    RotateCcw,
    Zap,
    Battery,
    Settings2,
    Droplets,
    ChevronDown,
    User,
    Settings,
    DollarSign,
    List,
    MessageCircle,
    Mail,
    ArrowLeft
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import {
    companyDetails,
    defaultTerms,
    gstConfig,
    defaultSubsidy,
    calculateSavings,
    generateQuoteNumber,
    defaultComponents,
    calculateCentralSubsidy,
} from "@/lib/companyDetails";
import type { QuotationComponent } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// System type configuration
const systemTypes = [
    { id: "On-grid", name: "On-grid", icon: <Zap className="h-4 w-4" />, color: "bg-green-500" },
    { id: "Off-grid", name: "Off-grid", icon: <Battery className="h-4 w-4" />, color: "bg-orange-500" },
    { id: "Hybrid", name: "Hybrid", icon: <Settings2 className="h-4 w-4" />, color: "bg-blue-500" },
    { id: "VFD/Drive", name: "VFD/Drive", icon: <Droplets className="h-4 w-4" />, color: "bg-purple-500" },
];

// Panel types
const panelTypes = [
    { value: "Monoperc", label: "Monoperc" },
    { value: "Bifacial", label: "Bifacial" },
    { value: "Topcon", label: "Topcon" },
    { value: "Topcon Bifacial", label: "Topcon Bifacial" },
    { value: "HJT", label: "HJT" },
    { value: "DCR", label: "DCR" },
    { value: "NDCR", label: "NDCR" },
];

// Solar panel brands
const panelBrands = ["Adani", "Tata", "Waaree", "Reliance", "Premier", "Emvee", "Vikram Solar", "Goldi Solar", "RenewSys", "Jakson", "Longi", "Jinko", "Canadian Solar", "Other"];

// Inverter brands
const inverterBrands = ["Polycab", "Shakti", "Growatt", "Sungrow", "Huawei", "Deye", "Servotech", "Luminous", "GoodWe", "Solis", "Solax", "Sofar Solar", "Other"];

export default function QuotationBuilder() {
    // Customer Details
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    // System Configuration
    const [selectedSystemType, setSelectedSystemType] = useState("On-grid");
    const [capacityKw, setCapacityKw] = useState<string>("3"); // Start as string for Input
    const [phase, setPhase] = useState<string>("1"); // Select uses string

    // Panel Configuration
    const [panelWattage, setPanelWattage] = useState<string>("620"); // String for Input
    const [panelBrand, setPanelBrand] = useState("Adani");
    const [customPanelBrand, setCustomPanelBrand] = useState("");
    const [panelType, setPanelType] = useState("Monoperc");
    const [panelWarranty, setPanelWarranty] = useState("25 Years");
    const effectivePanelBrand = panelBrand === "Other" ? customPanelBrand : panelBrand;

    // Inverter Configuration
    const [inverterBrand, setInverterBrand] = useState("Polycab");
    const [customInverterBrand, setCustomInverterBrand] = useState("");
    const [inverterModel, setInverterModel] = useState("3 KW On-Grid String");
    const [inverterWarranty, setInverterWarranty] = useState("5 Years");
    const effectiveInverterBrand = inverterBrand === "Other" ? customInverterBrand : inverterBrand;

    // Pricing
    const [priceInput, setPriceInput] = useState<string>("180000"); // Represents Price Included GST
    const [gstRate, setGstRate] = useState<string>(gstConfig.compositeRate.toString());
    const [centralSubsidy, setCentralSubsidy] = useState<string>(defaultSubsidy.central.toString());
    const [stateSubsidy, setStateSubsidy] = useState<string>(defaultSubsidy.state.toString());

    // Extra Costs (Optional)
    const [extraStructureEnabled, setExtraStructureEnabled] = useState(false);
    const [extraStructureRate, setExtraStructureRate] = useState<string>("5"); // Rate per watt

    const [extraPanelsEnabled, setExtraPanelsEnabled] = useState(false);
    const [extraPanelCount, setExtraPanelCount] = useState<string>("1");
    const [extraPanelPrice, setExtraPanelPrice] = useState<string>("15000"); // Per panel price

    const [extraWireEnabled, setExtraWireEnabled] = useState(false);
    const [extraWireLength, setExtraWireLength] = useState<string>("10"); // in meters
    const [extraWireRate, setExtraWireRate] = useState<string>("50"); // Per meter rate

    // Components (Bill of Materials)
    const [components, setComponents] = useState<QuotationComponent[]>([]);
    const [terms, setTerms] = useState<string[]>([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [editComponentDialog, setEditComponentDialog] = useState(false);
    const [editingComponent, setEditingComponent] = useState<QuotationComponent | null>(null);
    const [editingIndex, setEditingIndex] = useState<number>(-1);
    const [addComponentDialog, setAddComponentDialog] = useState(false);
    const [newComponent, setNewComponent] = useState<QuotationComponent>({ name: "", description: "", quantity: "1 Nos", make: "Standard", sort_order: 0, is_default: false });

    const printRef = useRef<HTMLDivElement>(null);

    // Derived numeric values
    const numCapacityKw = parseFloat(capacityKw) || 0;
    const numPanelWattage = parseInt(panelWattage) || 0;
    const numPriceInput = parseFloat(priceInput) || 0;
    const numGstRate = parseFloat(gstRate) || 0;
    const numCentralSubsidy = parseFloat(centralSubsidy) || 0;
    const numStateSubsidy = parseFloat(stateSubsidy) || 0;
    const numExtraStructureRate = parseFloat(extraStructureRate) || 0;
    const numExtraPanelCount = parseInt(extraPanelCount) || 0;
    const numExtraPanelPrice = parseFloat(extraPanelPrice) || 0;
    const numExtraWireLength = parseFloat(extraWireLength) || 0;
    const numExtraWireRate = parseFloat(extraWireRate) || 0;


    // Calculate number of panels needed
    const numberOfPanels = useMemo(() => Math.ceil((numCapacityKw * 1000) / (numPanelWattage || 1)), [numCapacityKw, numPanelWattage]);
    const actualSystemSize = useMemo(() => +((numberOfPanels * (numPanelWattage || 0)) / 1000).toFixed(2), [numberOfPanels, numPanelWattage]);

    // Load default components when system type changes
    useEffect(() => {
        const currentDefaults = defaultComponents[selectedSystemType as keyof typeof defaultComponents] || [];
        const defaults = currentDefaults.map((c: any, i: number) => {
            let comp = { ...c, sort_order: i };
            if (i === 0) return { ...comp, description: `${numPanelWattage}Wp (${panelType}) Modules`, quantity: `${numberOfPanels.toString().padStart(2, '0')} Nos`, make: effectivePanelBrand };
            return comp;
        });

        setComponents(defaults as QuotationComponent[]);

        const defaultTermsList = defaultTerms ? defaultTerms[selectedSystemType as keyof typeof defaultTerms] : [];
        if (defaultTermsList) setTerms(defaultTermsList.slice(0, 8));
    }, [selectedSystemType, numPanelWattage, effectivePanelBrand, panelType, numberOfPanels, effectiveInverterBrand, inverterModel]);


    // Update inverter model when capacity changes
    useEffect(() => {
        const inverterCapacity = numCapacityKw <= 3 ? 3 : numCapacityKw <= 5 ? 5 : numCapacityKw <= 10 ? 10 : Math.ceil(numCapacityKw);
        setInverterModel(`${inverterCapacity} KW ${selectedSystemType} String`);
    }, [numCapacityKw, selectedSystemType]);

    // Handle Subsidy Logic — auto-calculate central subsidy based on requested capacity
    useEffect(() => {
        if (panelType === "NDCR" || selectedSystemType === "Off-grid") {
            setCentralSubsidy("0");
            setStateSubsidy("0");
        } else {
            const requestedKw = Math.floor(parseFloat(capacityKw) || 0);
            const computedCentral = calculateCentralSubsidy(requestedKw);
            setCentralSubsidy(computedCentral.toString());
            setStateSubsidy(defaultSubsidy.state.toString());
        }
    }, [panelType, selectedSystemType, capacityKw]);

    // Calculate extra costs
    const extraCosts = useMemo(() => {
        const structureCost = extraStructureEnabled ? (actualSystemSize * 1000 * numExtraStructureRate) : 0;
        const panelsCost = extraPanelsEnabled ? (numExtraPanelCount * numExtraPanelPrice) : 0;
        const wireCost = extraWireEnabled ? (numExtraWireLength * numExtraWireRate) : 0;
        return { structureCost, panelsCost, wireCost, total: structureCost + panelsCost + wireCost };
    }, [extraStructureEnabled, numExtraStructureRate, actualSystemSize, extraPanelsEnabled, numExtraPanelCount, numExtraPanelPrice, extraWireEnabled, numExtraWireLength, numExtraWireRate]);

    // Calculate GST and totals
    const calculations = useMemo(() => {
        const derivedBasePrice = numPriceInput / (1 + numGstRate / 100);
        const totalTaxableValue = derivedBasePrice + extraCosts.total;
        const gstAmount = +(totalTaxableValue * (numGstRate / 100)).toFixed(2);
        const totalAmount = +(totalTaxableValue + gstAmount).toFixed(2);
        const savings = calculateSavings(actualSystemSize, totalAmount, numCentralSubsidy, numStateSubsidy);
        const effectiveCost = Math.max(0, totalAmount - numCentralSubsidy - numStateSubsidy);

        return {
            basePrice: totalTaxableValue,
            originalBasePrice: derivedBasePrice,
            extraCostsTotal: extraCosts.total,
            gstRate: numGstRate,
            gstAmount,
            totalAmount,
            ...savings,
            effectiveCost,
            systemPriceIncGst: numPriceInput
        };
    }, [numPriceInput, extraCosts.total, numGstRate, actualSystemSize, numCentralSubsidy, numStateSubsidy]);

    const quoteNumber = useMemo(() => {
        if (!customerName) return "";
        const initials = customerName.split(" ").map((n) => n.charAt(0).toUpperCase()).join("");
        return generateQuoteNumber(initials);
    }, [customerName]);

    const currentDate = useMemo(() => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }), []);

    const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `Quotation_${customerName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}` });

    const handleEditComponent = (index: number) => { setEditingComponent({ ...components[index] }); setEditingIndex(index); setEditComponentDialog(true); };
    const handleSaveComponentEdit = () => { if (editingComponent && editingIndex >= 0) { const updated = [...components]; updated[editingIndex] = editingComponent; setComponents(updated); } setEditComponentDialog(false); setEditingComponent(null); setEditingIndex(-1); };
    const handleDeleteComponent = (index: number) => setComponents(components.filter((_, i) => i !== index));
    const handleAddComponent = () => { if (newComponent.name) { setComponents([...components, { ...newComponent, sort_order: components.length }]); setNewComponent({ name: "", description: "", quantity: "1 Nos", make: "Standard", sort_order: 0, is_default: false }); setAddComponentDialog(false); } };

    const handleReset = () => {
        setCustomerName(""); setCustomerPhone(""); setCustomerAddress("");
        setCapacityKw("3"); setPhase("1"); setPanelWattage("620"); setPanelBrand("Adani"); setPriceInput("180000");
    };

    const saveToDatabase = async () => {
        if (!customerName) return;
        try {
            await fetch("/api/quotations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    customer_email: customerEmail,
                    system_type_name: selectedSystemType,
                    capacity_kw: actualSystemSize,
                    phase: parseInt(phase),
                    brand: effectivePanelBrand,
                    base_price: calculations.basePrice,
                    gst_rate: numGstRate,
                    gst_amount: calculations.gstAmount,
                    total_amount: calculations.totalAmount,
                    central_subsidy: numCentralSubsidy,
                    state_subsidy: numStateSubsidy,
                    terms,
                    components,
                    salesperson: companyDetails.authorizedSignatory,
                    status: 'draft'
                })
            });
            console.log("Quotation auto-saved to database");
        } catch (error) {
            console.error("Auto-save failed", error);
        }
    };

    const getQuotationData = () => ({
        customerName,
        systemSize: actualSystemSize,
        panelBrand: effectivePanelBrand,
        panelWattage: numPanelWattage,
        panelType,
        inverterModel,
        totalAmount: calculations.totalAmount,
        effectiveCost: calculations.effectiveCost,
        centralSubsidy: numCentralSubsidy,
        stateSubsidy: numStateSubsidy,
        companyDetails
    });

    const handleSendWhatsApp = async () => {
        if (!customerName) { toast.error("Customer name is required"); return; }
        if (!customerPhone) { toast.error("Customer phone is required for WhatsApp"); return; }

        setLoading(true);
        toast.info("Generating PDF and sending to WhatsApp...");

        try {
            const quoteData = {
                customerInfo: {
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress || ""
                },
                selectedProduct: {
                    systemType: selectedSystemType,
                    capacity: actualSystemSize,
                    phase: parseInt(phase),
                    panelBrand: effectivePanelBrand,
                    panelWattage: numPanelWattage,
                    panelType: panelType,
                    panelWarranty: panelWarranty,
                    inverterBrand: inverterModel,
                    inverterWarranty: inverterWarranty
                },
                calculations: {
                    basePrice: calculations.originalBasePrice,
                    extraCosts: extraCosts.total,
                    subtotal: calculations.basePrice,
                    gstAmount: calculations.gstAmount,
                    total: calculations.totalAmount,
                    discount: 0,
                    grandTotal: calculations.totalAmount,
                    centralSubsidy: numCentralSubsidy,
                    stateSubsidy: numStateSubsidy,
                    effectiveCost: calculations.effectiveCost
                },
                savings: calculations,
                taxRate: numGstRate / 100,
                components,
                terms,
                companyDetails
            };

            const response = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(quoteData)
            });

            const result = await response.json();

            if (response.ok) {
                saveToDatabase();
                toast.success("Quotation PDF sent to WhatsApp successfully!");
            } else {
                throw new Error(result.message || "Failed to send WhatsApp");
            }
        } catch (error: any) {
            console.error("WhatsApp error:", error);
            toast.error(error.message);
        }
        finally { setLoading(false); }
    };

    const handleSendEmail = async () => {
        const emailToUse = customerEmail || prompt("Enter customer email address:");
        if (!emailToUse) { toast.error("Email address is required"); return; }
        if (customerEmail !== emailToUse) setCustomerEmail(emailToUse);

        setLoading(true);
        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToUse, quotationData: getQuotationData() })
            });
            const result = await response.json();
            if (result.success) {
                if (result.useMailto) {
                    window.open(result.mailtoLink, "_blank");
                    toast.success("Email client opened with quotation details");
                } else {
                    toast.success("Email sent successfully!");
                }
            } else throw new Error(result.message || "Failed to send email");
        } catch (error: any) { toast.error(error.message); }
        finally { setLoading(false); }
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

    return (
        <div className="flex flex-col md:flex-row h-auto md:h-screen bg-slate-50 overflow-auto md:overflow-hidden">
            <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-wrapper { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 0 !important; visibility: visible !important; background: white !important; overflow: visible !important; }
          .print-page { visibility: visible !important; width: 210mm !important; max-width: 100% !important; padding: 15mm !important; margin: 0 auto !important; border: none !important; box-shadow: none !important; height: auto !important; min-height: 297mm !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          .avoid-break { page-break-inside: avoid; break-inside: avoid; }
          body, html { visibility: hidden; height: auto !important; overflow: visible !important; }
          .print-wrapper * { visibility: visible; }
        }

        /* External Template Styles */
        .print-page { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #333; line-height: 1.2; }
        .print-page * { box-sizing: border-box; }
        
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #1e3a5f; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo { width: 60px; height: 60px; object-fit: contain; }
        .company-name { font-size: 24px; font-weight: 900; color: #1e3a5f; letter-spacing: -0.5px; margin-bottom: 0; }
        .company-tagline { font-size: 9px; font-weight: 600; color: #64748b; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }
        .company-info { font-size: 9px; color: #64748b; margin-top: 8px; line-height: 1.6; }
        .gstin { color: #1d4ed8; font-weight: 700; }
        
        .quote-badge { background: #eab308; color: white; padding: 8px 20px; font-size: 16px; font-weight: 900; border-radius: 4px; text-transform: uppercase; letter-spacing: 2px; display: inline-block; }
        .quote-info { text-align: right; margin-top: 8px; font-size: 11px; color: #64748b; }
        .quote-number { font-size: 9px; color: #94a3b8; }
        
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        
        .info-box { background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-title { font-weight: 700; color: #1e3a5f; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
        .customer-name { font-weight: 900; color: #1e40af; font-size: 15px; margin-bottom: 4px; }
        .customer-detail { color: #475569; font-size: 10px; margin-bottom: 2px; }
        .system-row { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 3px; }
        .system-row strong { color: #1e293b; }
        
        .table-container { border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 16px; }
        .print-page table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .print-page th { background: #f1f5f9; color: #1e3a5f; font-weight: 700; padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .print-page td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
        .highlight-row { background: #f8fafc; }
        .td-center { text-align: center; }
        .td-right { text-align: right; }
        
        .subsidy-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; margin-bottom: 12px; }
        .subsidy-row { display: flex; justify-content: space-between; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #bbf7d0; }
        
        .bank-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 8px; font-size: 9px; margin-top: 15px; }
        
        .investment-box { background: #f8fafc; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; }
        .effective-box { background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 14px; text-align: center; margin-top: 14px; }
        .effective-value { font-size: 22px; font-weight: 900; color: #16a34a; letter-spacing: -1px; }
        
        .terms-section { border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 16px; }
        .terms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 24px; }
        .term-item { font-size: 9px; color: #64748b; padding-left: 12px; position: relative; line-height: 1.5; }
        .term-item::before { content: "•"; position: absolute; left: 0; color: #94a3b8; }
        
        .signature-section { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; }
        .sig-box { text-align: center; }
        .sig-line { width: 150px; height: 1px; background: #cbd5e1; margin: 0 auto 6px; }
      `}</style>

            {/* LEFT EDIT PANEL */}
            <div className="no-print w-full md:w-[380px] md:min-w-[380px] bg-white border-r border-b md:border-b-0 flex flex-col overflow-hidden h-auto md:h-full">
                {/* ... existing sidebar code ... */}
                <div className="p-4 border-b bg-slate-900 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold flex items-center">
                            <Zap className="mr-2 h-5 w-5" />
                            Quotation Builder
                        </h2>
                        <Link href="/admin/quotations">
                            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    <Accordion type="multiple" defaultValue={["system", "customer", "config", "pricing", "components"]}>
                        {/* System Type */}
                        <AccordionItem value="system" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <Zap className="mr-2 h-4 w-4 text-slate-900" />
                                    System Type
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {systemTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedSystemType(type.id)}
                                            className={cn(
                                                "cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2 text-sm border transition-colors",
                                                selectedSystemType === type.id
                                                    ? `${type.color} text-white border-transparent`
                                                    : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100"
                                            )}
                                        >
                                            {selectedSystemType === type.id ? (
                                                <div className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{type.icon}</div>
                                            ) : (
                                                <div className="h-4 w-4 text-slate-500 [&>svg]:h-full [&>svg]:w-full">{type.icon}</div>
                                            )}

                                            {type.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Customer Details */}
                        <AccordionItem value="customer" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <User className="mr-2 h-4 w-4 text-slate-900" />
                                    Customer Details
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <Label>Customer Name</Label>
                                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>Mobile Number</Label>
                                    <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Address</Label>
                                    <Textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* System Configuration */}
                        <AccordionItem value="config" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <Settings className="mr-2 h-4 w-4 text-slate-900" />
                                    System Configuration
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Capacity (KW)</Label>
                                        <Input type="number" step="0.1" value={capacityKw} onChange={(e) => setCapacityKw(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Wattage (Wp)</Label>
                                        <Input type="number" step="5" value={panelWattage} onChange={(e) => setPanelWattage(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Panels</Label>
                                        <Input value={numberOfPanels} readOnly className="font-bold text-slate-900 bg-slate-100" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Actual (KW)</Label>
                                        <Input value={actualSystemSize} readOnly className="font-bold text-slate-900 bg-slate-100" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Brand</Label>
                                        <Select value={panelBrand} onValueChange={setPanelBrand}>
                                            <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
                                            <SelectContent>
                                                {panelBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Type</Label>
                                        <Select value={panelType} onValueChange={setPanelType}>
                                            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                            <SelectContent>
                                                {panelTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {panelBrand === "Other" && (
                                    <div className="space-y-1">
                                        <Label>Custom Brand</Label>
                                        <Input value={customPanelBrand} onChange={(e) => setCustomPanelBrand(e.target.value)} />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Inverter</Label>
                                        <Select value={inverterBrand} onValueChange={setInverterBrand}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {inverterBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Phase</Label>
                                        <Select value={phase} onValueChange={setPhase}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1Φ</SelectItem>
                                                <SelectItem value="3">3Φ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {inverterBrand === "Other" && (
                                    <div className="space-y-1">
                                        <Label>Custom Inverter Brand</Label>
                                        <Input value={customInverterBrand} onChange={(e) => setCustomInverterBrand(e.target.value)} />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Panel Warranty</Label>
                                        <Select value={panelWarranty} onValueChange={setPanelWarranty}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="25 Years">25 Years</SelectItem>
                                                <SelectItem value="30 Years">30 Years</SelectItem>
                                                <SelectItem value="10 Years">10 Years</SelectItem>
                                                <SelectItem value="12 Years">12 Years</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {panelWarranty === "Other" && <div className="flex-1 space-y-1"><Label>Custom</Label><Input onChange={(e) => setPanelWarranty(e.target.value)} /></div>}
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Inverter Warranty</Label>
                                        <Select value={inverterWarranty} onValueChange={setInverterWarranty}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5 Years">5 Years</SelectItem>
                                                <SelectItem value="7 Years">7 Years</SelectItem>
                                                <SelectItem value="8 Years">8 Years</SelectItem>
                                                <SelectItem value="10 Years">10 Years</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {inverterWarranty === "Other" && <div className="flex-1 space-y-1"><Label>Custom</Label><Input onChange={(e) => setInverterWarranty(e.target.value)} /></div>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Pricing */}
                        <AccordionItem value="pricing" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <DollarSign className="mr-2 h-4 w-4 text-slate-900" />
                                    Pricing
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <Label>System Price (Incl. GST)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                        <Input type="number" className="pl-7" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>GST Rate (%)</Label>
                                        <Input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>GST Amount</Label>
                                        <Input value={`₹ ${formatCurrency(calculations.gstAmount)}`} readOnly className="bg-slate-100" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Central Subsidy</Label>
                                        <Input type="number" value={centralSubsidy} onChange={(e) => setCentralSubsidy(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>State Subsidy</Label>
                                        <Input type="number" value={stateSubsidy} onChange={(e) => setStateSubsidy(e.target.value)} />
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-md text-center">
                                    <div className="text-xs font-bold text-blue-800 uppercase">Effective Cost</div>
                                    <div className="text-2xl font-black text-green-600">₹ {formatCurrency(calculations.effectiveCost)}</div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Extra Costs */}
                        <AccordionItem value="extra" className="border-b-0">
                            <AccordionTrigger className="bg-amber-100 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-amber-900 text-sm font-bold w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Extra Costs
                                    {extraCosts.total > 0 && <Badge variant="secondary" className="ml-auto bg-amber-200 text-amber-900 hover:bg-amber-300">₹{formatCurrency(extraCosts.total)}</Badge>}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className={cn("p-3 rounded-md border", extraStructureEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraStructure" checked={extraStructureEnabled} onCheckedChange={(c) => setExtraStructureEnabled(!!c)} />
                                        <Label htmlFor="extraStructure" className="font-bold">Extra Structure Cost</Label>
                                    </div>
                                    {extraStructureEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-24"><Label className="text-xs">Rate/Watt</Label><Input type="number" value={extraStructureRate} onChange={(e) => setExtraStructureRate(e.target.value)} className="h-8" /></div>
                                            <div className="text-xs text-slate-500 mt-5">× {actualSystemSize * 1000}W =</div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.structureCost)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={cn("p-3 rounded-md border", extraPanelsEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraPanels" checked={extraPanelsEnabled} onCheckedChange={(c) => setExtraPanelsEnabled(!!c)} />
                                        <Label htmlFor="extraPanels" className="font-bold">Extra Panels</Label>
                                    </div>
                                    {extraPanelsEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-20"><Label className="text-xs">Qty</Label><Input type="number" value={extraPanelCount} onChange={(e) => setExtraPanelCount(e.target.value)} className="h-8" /></div>
                                            <div className="w-28"><Label className="text-xs">Price/Panel</Label><Input type="number" value={extraPanelPrice} onChange={(e) => setExtraPanelPrice(e.target.value)} className="h-8" /></div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.panelsCost)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={cn("p-3 rounded-md border", extraWireEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraWire" checked={extraWireEnabled} onCheckedChange={(c) => setExtraWireEnabled(!!c)} />
                                        <Label htmlFor="extraWire" className="font-bold">Extra Wire</Label>
                                    </div>
                                    {extraWireEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-20"><Label className="text-xs">Length (m)</Label><Input type="number" value={extraWireLength} onChange={(e) => setExtraWireLength(e.target.value)} className="h-8" /></div>
                                            <div className="w-24"><Label className="text-xs">Rate/m</Label><Input type="number" value={extraWireRate} onChange={(e) => setExtraWireRate(e.target.value)} className="h-8" /></div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.wireCost)}</div>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Components */}
                        <AccordionItem value="components" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <List className="mr-2 h-4 w-4 text-slate-900" />
                                    Components ({components.length})
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="space-y-2">
                                    {components.map((comp, index) => (
                                        <div key={index} className={cn("flex items-center gap-2 p-2 rounded-md", index % 2 === 0 ? "bg-slate-50" : "bg-white border")}>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-xs font-bold truncate">{comp.name}</div>
                                                <div className="text-xs text-slate-500 truncate">{comp.quantity}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditComponent(index)}><Edit2 className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteComponent(index)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => setAddComponentDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Component
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Actions */}
                <div className="p-4 border-t bg-white space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => { saveToDatabase(); handlePrint(); }}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={handleSendWhatsApp} disabled={loading}>
                            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                        <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleSendEmail} disabled={loading}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50">
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div className="print-wrapper flex-1 w-full overflow-auto p-4 md:p-8 flex justify-center bg-slate-200">
                <div ref={printRef} className="print-page">
                    {/* Header */}
                    <div className="header">
                        <div className="logo-section">
                            <img src="/logo.png" className="logo" alt="Logo" onError={(e: any) => { e.target.style.display = 'none'; }} />
                            <div>
                                <div className="company-name">ARPIT SOLAR SHOP</div>
                                <div className="company-tagline">{companyDetails.tagline}</div>
                                <div className="company-info">
                                    <div className="gstin">GSTIN: {companyDetails.gstin}</div>
                                    <div><strong>HO:</strong> {companyDetails.headOffice}</div>
                                    <div><strong>Contact:</strong> {companyDetails.phone} | <strong>Email:</strong> {companyDetails.email}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div className="quote-badge">Quotation</div>
                            <div className="quote-info">
                                <strong>Date:</strong> {currentDate}
                                <div className="quote-number">Quote No: {quoteNumber}</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer & System Overview */}
                    <div className="grid-2">
                        <div className="info-box">
                            <div className="info-title">Customer Details</div>
                            <div className="customer-name">{customerName || "________________"}</div>
                            {customerAddress && <div className="customer-detail" style={{ fontStyle: "italic" }}>{customerAddress}</div>}
                            {customerPhone && <div className="customer-detail">Mo No: {customerPhone}</div>}
                        </div>
                        <div className="info-box">
                            <div className="info-title">System Overview</div>
                            <div className="system-row"><span>System Size:</span> <strong>{actualSystemSize} KW ({parseInt(phase) === 1 ? "1Φ" : "3Φ"})</strong></div>
                            <div className="system-row"><span>Modules:</span> <strong>{effectivePanelBrand} {numPanelWattage}Wp ({panelType})</strong></div>
                            <div className="system-row" style={{ color: "#475569" }}><span>Module Warranty:</span> <strong>{panelWarranty}</strong></div>
                            <div className="system-row"><span>Inverter:</span> <strong>{effectiveInverterBrand}</strong></div>
                            <div className="system-row" style={{ color: "#475569" }}><span>Inverter Warranty:</span> <strong>{inverterWarranty}</strong></div>
                            <div className="system-row"><span>Type:</span> <strong>{selectedSystemType}</strong></div>
                        </div>
                    </div>

                    {/* Components Table */}
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "40px", textAlign: "center" }}>S.N</th>
                                    <th style={{ width: "25%" }}>Components</th>
                                    <th>Description</th>
                                    <th style={{ width: "10%", textAlign: "center" }}>Quantity</th>
                                    <th style={{ width: "15%", textAlign: "center" }}>Make</th>
                                </tr>
                            </thead>
                            <tbody>
                                {components.map((comp, i) => (
                                    <tr key={i} className={i < 2 ? "highlight-row" : ""}>
                                        <td className="td-center">{i + 1}</td>
                                        <td style={{ fontWeight: 700 }}>{comp.name}</td>
                                        <td>{comp.description}</td>
                                        <td className="td-center">{comp.quantity}</td>
                                        <td className="td-center" style={{ fontWeight: 700, color: "#1e40af" }}>{comp.make}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pricing & Subsidy */}
                    <div className="grid-2" style={{ marginBottom: "20px" }}>
                        <div>
                            {(numCentralSubsidy + numStateSubsidy) > 0 && (
                                <div className="subsidy-box">
                                    <div className="info-title" style={{ color: "#166534" }}>PM Surya Ghar Subsidy</div>
                                    <div className="subsidy-row"><span>Central Subsidy:</span> <strong>₹ {formatCurrency(numCentralSubsidy)}/-</strong></div>
                                    <div className="subsidy-row"><span>State Subsidy:</span> <strong>₹ {formatCurrency(numStateSubsidy)}/-</strong></div>
                                    <div className="subsidy-row" style={{ color: "#166534", fontSize: "14px", marginTop: "4px", border: "none" }}>
                                        <span>Total Benefit:</span>
                                        <span style={{ fontSize: "16px", fontWeight: 900 }}>₹ {formatCurrency(numCentralSubsidy + numStateSubsidy)}/-</span>
                                    </div>
                                </div>
                            )}

                            <div className="bank-box">
                                <div className="info-title">Bank Details</div>
                                <p style={{ margin: "4px 0" }}><strong>A/c Name:</strong> {companyDetails.bank.accountName}</p>
                                <p style={{ margin: "4px 0" }}><strong>A/c No:</strong> {companyDetails.bank.accountNumber} | <strong>IFSC:</strong> {companyDetails.bank.ifsc}</p>
                                <p style={{ margin: "4px 0" }}><strong>Bank:</strong> {companyDetails.bank.name}, {companyDetails.bank.branch}</p>
                            </div>
                        </div>

                        <div className="investment-box">
                            <div className="info-title">Investment Summary</div>
                            <div className="system-row" style={{ justifyContent: "space-between" }}>
                                <span>Base Price:</span>
                                <span>₹ {formatCurrency(calculations.basePrice - calculations.extraCostsTotal)}</span>
                            </div>
                            {extraCosts.total > 0 && (
                                <div className="system-row" style={{ color: "#d97706", justifyContent: "space-between" }}>
                                    <span>+ Extra Costs:</span>
                                    <span>₹ {formatCurrency(extraCosts.total)}</span>
                                </div>
                            )}
                            <div className="system-row" style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "5px", marginBottom: "5px", justifyContent: "space-between" }}>
                                <span>GST (@ {numGstRate}%):</span>
                                <span>₹ {formatCurrency(calculations.gstAmount)}</span>
                            </div>
                            <div className="system-row" style={{ fontSize: "16px", fontWeight: 900, color: "#1e3a5f", paddingTop: "5px", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "11px", textTransform: "uppercase" }}>Total Amount:</span>
                                <span style={{ color: "#1e40af" }}>₹ {formatCurrency(calculations.totalAmount)}</span>
                            </div>
                            <div className="effective-box">
                                <div className="effective-label">
                                    {(numCentralSubsidy + numStateSubsidy) > 0 ? "Effective Cost After Subsidy" : "Effective Cost"}
                                </div>
                                <div className="effective-value">₹ {formatCurrency(calculations.effectiveCost)}*</div>
                            </div>
                        </div>
                    </div>

                    {/* Savings & Financial Breakdown Table */}
                    <div className="table-container" style={{ border: "none", marginBottom: "20px" }}>
                        <div className="info-title">Breakdown of Savings & Financials</div>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: "40px", textAlign: "center" }}>S.No</th>
                                    <th>Content</th>
                                    <th style={{ textAlign: "right" }}>Amount / Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="td-center">1</td>
                                    <td>Proposed Solar Plant Size</td>
                                    <td className="td-right">{actualSystemSize} KW</td>
                                </tr>
                                <tr>
                                    <td className="td-center">2</td>
                                    <td>Annual Units Generation (approx.)</td>
                                    <td className="td-right">{calculations.annualUnits} Units</td>
                                </tr>
                                <tr>
                                    <td className="td-center">3</td>
                                    <td>Average Grid Electricity Rate</td>
                                    <td className="td-right">Rs. 6.5 / Unit</td>
                                </tr>
                                <tr>
                                    <td className="td-center">4</td>
                                    <td><strong>Annual Savings</strong></td>
                                    <td className="td-right" style={{ color: "#16a34a", fontSize: "12px" }}>Rs. {formatCurrency(calculations.annualSavings)}</td>
                                </tr>
                                <tr style={{ backgroundColor: "#f0fdf4" }}>
                                    <td className="td-center">5</td>
                                    <td><strong>Subsidy Applicable</strong><br /><span style={{ fontSize: "9px", color: "#64748b" }}>(Central + State Government)</span></td>
                                    <td className="td-right" style={{ color: "#166534" }}>
                                        <div>Central: ₹ {formatCurrency(numCentralSubsidy)}</div>
                                        <div>State: ₹ {formatCurrency(numStateSubsidy)}</div>
                                        <div style={{ borderTop: "1px solid #bbf7d0", marginTop: "4px", paddingTop: "4px", fontSize: "13px" }}>Total: ₹ {formatCurrency(numCentralSubsidy + numStateSubsidy)}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="td-center">6</td>
                                    <td><strong>Return on Investment (ROI)</strong><br /><span style={{ fontSize: "9px", color: "#64748b" }}>Net Cost / Annual Savings</span></td>
                                    <td className="td-right">
                                        <div>Net Cost: ₹ {formatCurrency(calculations.effectiveCost)}</div>
                                        <div style={{ fontSize: "14px", color: "#ea580c", marginTop: "4px" }}>{calculations.roiYears} Years</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Terms */}
                    <div className="terms-section">
                        <div className="terms-title">Terms and Conditions</div>
                        <div className="terms-grid">
                            {(terms.length > 0 ? terms : [
                                "Payment: 10% Advance on structure installation.",
                                "Delivery: 85% Before delivery of kit. 5% Post installation.",
                                "Subsidy directly credited to customer bank account.",
                                "Installation completed within 7-10 working days.",
                                "Module Warranty: 25 Years. Inverter: 5 Years.",
                                "Free Annual Maintenance for 1st year."
                            ]).map((term, i) => (
                                <div key={i} className="term-item">
                                    <span dangerouslySetInnerHTML={{ __html: term.replace(/^([^:]+):/, "<strong>$1:</strong>") }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="signature-section">
                        <div className="sig-box">
                            <div className="sig-line"></div>
                            <div className="sig-label">Customer Signature</div>
                        </div>
                        <div className="sig-box" style={{ textAlign: "right" }}>
                            <div className="for-company" style={{ fontSize: "13px", fontWeight: 900, color: "#1e3a5f", marginBottom: "40px", textDecoration: "underline", textDecorationColor: "#eab308", textUnderlineOffset: "4px" }}>For Arpit Solar Shop</div>
                            <div style={{ height: "50px" }}></div>
                            <div className="sig-line" style={{ margin: "0 0 6px auto" }}></div>
                            <div className="sig-label">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEFT EDIT PANEL */}
            <div className="no-print w-full md:w-[380px] md:min-w-[380px] bg-white border-r border-b md:border-b-0 flex flex-col overflow-hidden h-auto md:h-full">
                <div className="p-4 border-b bg-slate-900 text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-bold flex items-center">
                            <Zap className="mr-2 h-5 w-5" />
                            Quotation Builder
                        </h2>
                        <Link href="/admin/quotations">
                            <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    <Accordion type="multiple" defaultValue={["system", "customer", "config", "pricing", "components"]}>
                        {/* System Type */}
                        <AccordionItem value="system" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <Zap className="mr-2 h-4 w-4 text-slate-900" />
                                    System Type
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {systemTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedSystemType(type.id)}
                                            className={cn(
                                                "cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2 text-sm border transition-colors",
                                                selectedSystemType === type.id
                                                    ? `${type.color} text-white border-transparent`
                                                    : "bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100"
                                            )}
                                        >
                                            {/* Icon clone to apply current color context */}
                                            {selectedSystemType === type.id ? (
                                                <div className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">{type.icon}</div>
                                            ) : (
                                                <div className="h-4 w-4 text-slate-500 [&>svg]:h-full [&>svg]:w-full">{type.icon}</div>
                                            )}

                                            {type.name}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Customer Details */}
                        <AccordionItem value="customer" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <User className="mr-2 h-4 w-4 text-slate-900" />
                                    Customer Details
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <Label>Customer Name</Label>
                                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <Label>Mobile Number</Label>
                                    <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Address</Label>
                                    <Textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* System Configuration */}
                        <AccordionItem value="config" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <Settings className="mr-2 h-4 w-4 text-slate-900" />
                                    System Configuration
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Capacity (KW)</Label>
                                        <Input type="number" step="0.1" value={capacityKw} onChange={(e) => setCapacityKw(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Wattage (Wp)</Label>
                                        <Input type="number" step="5" value={panelWattage} onChange={(e) => setPanelWattage(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Panels</Label>
                                        <Input value={numberOfPanels} readOnly className="font-bold text-slate-900 bg-slate-100" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Actual (KW)</Label>
                                        <Input value={actualSystemSize} readOnly className="font-bold text-slate-900 bg-slate-100" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Brand</Label>
                                        <Select value={panelBrand} onValueChange={setPanelBrand}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {panelBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Type</Label>
                                        <Select value={panelType} onValueChange={setPanelType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {panelTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {panelBrand === "Other" && (
                                    <div className="space-y-1">
                                        <Label>Custom Brand</Label>
                                        <Input value={customPanelBrand} onChange={(e) => setCustomPanelBrand(e.target.value)} />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Inverter</Label>
                                        <Select value={inverterBrand} onValueChange={setInverterBrand}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {inverterBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>Phase</Label>
                                        <Select value={phase} onValueChange={setPhase}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1Φ</SelectItem>
                                                <SelectItem value="3">3Φ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {inverterBrand === "Other" && (
                                    <div className="space-y-1">
                                        <Label>Custom Inverter Brand</Label>
                                        <Input value={customInverterBrand} onChange={(e) => setCustomInverterBrand(e.target.value)} />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Panel Warranty</Label>
                                        <Select value={panelWarranty} onValueChange={setPanelWarranty}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="25 Years">25 Years</SelectItem>
                                                <SelectItem value="30 Years">30 Years</SelectItem>
                                                <SelectItem value="10 Years">10 Years</SelectItem>
                                                <SelectItem value="12 Years">12 Years</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {panelWarranty === "Other" && <div className="flex-1 space-y-1"><Label>Custom</Label><Input onChange={(e) => setPanelWarranty(e.target.value)} /></div>}
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Inverter Warranty</Label>
                                        <Select value={inverterWarranty} onValueChange={setInverterWarranty}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5 Years">5 Years</SelectItem>
                                                <SelectItem value="7 Years">7 Years</SelectItem>
                                                <SelectItem value="8 Years">8 Years</SelectItem>
                                                <SelectItem value="10 Years">10 Years</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {inverterWarranty === "Other" && <div className="flex-1 space-y-1"><Label>Custom</Label><Input onChange={(e) => setInverterWarranty(e.target.value)} /></div>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Pricing */}
                        <AccordionItem value="pricing" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <DollarSign className="mr-2 h-4 w-4 text-slate-900" />
                                    Pricing
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className="space-y-1">
                                    <Label>System Price (Incl. GST)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                                        <Input type="number" className="pl-7" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>GST Rate (%)</Label>
                                        <Input type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>GST Amount</Label>
                                        <Input value={`₹ ${formatCurrency(calculations.gstAmount)}`} readOnly className="bg-slate-100" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label>Central Subsidy</Label>
                                        <Input type="number" value={centralSubsidy} onChange={(e) => setCentralSubsidy(e.target.value)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label>State Subsidy</Label>
                                        <Input type="number" value={stateSubsidy} onChange={(e) => setStateSubsidy(e.target.value)} />
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-md text-center">
                                    <div className="text-xs font-bold text-blue-800 uppercase">Effective Cost</div>
                                    <div className="text-2xl font-black text-green-600">₹ {formatCurrency(calculations.effectiveCost)}</div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Extra Costs */}
                        <AccordionItem value="extra" className="border-b-0">
                            <AccordionTrigger className="bg-amber-100 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-amber-900 text-sm font-bold w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Extra Costs
                                    {extraCosts.total > 0 && <Badge variant="secondary" className="ml-auto bg-amber-200 text-amber-900 hover:bg-amber-300">₹{formatCurrency(extraCosts.total)}</Badge>}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 space-y-3">
                                <div className={cn("p-3 rounded-md border", extraStructureEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraStructure" checked={extraStructureEnabled} onCheckedChange={(c) => setExtraStructureEnabled(!!c)} />
                                        <Label htmlFor="extraStructure" className="font-bold">Extra Structure Cost</Label>
                                    </div>
                                    {extraStructureEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-24"><Label className="text-xs">Rate/Watt</Label><Input type="number" value={extraStructureRate} onChange={(e) => setExtraStructureRate(e.target.value)} className="h-8" /></div>
                                            <div className="text-xs text-slate-500 mt-5">× {actualSystemSize * 1000}W =</div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.structureCost)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={cn("p-3 rounded-md border", extraPanelsEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraPanels" checked={extraPanelsEnabled} onCheckedChange={(c) => setExtraPanelsEnabled(!!c)} />
                                        <Label htmlFor="extraPanels" className="font-bold">Extra Panels</Label>
                                    </div>
                                    {extraPanelsEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-20"><Label className="text-xs">Qty</Label><Input type="number" value={extraPanelCount} onChange={(e) => setExtraPanelCount(e.target.value)} className="h-8" /></div>
                                            <div className="w-28"><Label className="text-xs">Price/Panel</Label><Input type="number" value={extraPanelPrice} onChange={(e) => setExtraPanelPrice(e.target.value)} className="h-8" /></div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.panelsCost)}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={cn("p-3 rounded-md border", extraWireEnabled ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="extraWire" checked={extraWireEnabled} onCheckedChange={(c) => setExtraWireEnabled(!!c)} />
                                        <Label htmlFor="extraWire" className="font-bold">Extra Wire</Label>
                                    </div>
                                    {extraWireEnabled && (
                                        <div className="flex gap-2 mt-2 items-center">
                                            <div className="w-20"><Label className="text-xs">Length (m)</Label><Input type="number" value={extraWireLength} onChange={(e) => setExtraWireLength(e.target.value)} className="h-8" /></div>
                                            <div className="w-24"><Label className="text-xs">Rate/m</Label><Input type="number" value={extraWireRate} onChange={(e) => setExtraWireRate(e.target.value)} className="h-8" /></div>
                                            <div className="font-bold text-amber-700 mt-5">₹{formatCurrency(extraCosts.wireCost)}</div>
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Components */}
                        <AccordionItem value="components" className="border-b-0">
                            <AccordionTrigger className="bg-slate-50 px-4 py-2 hover:no-underline rounded-none">
                                <div className="flex items-center text-slate-800 text-sm font-bold">
                                    <List className="mr-2 h-4 w-4 text-slate-900" />
                                    Components ({components.length})
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4">
                                <div className="space-y-2">
                                    {components.map((comp, index) => (
                                        <div key={index} className={cn("flex items-center gap-2 p-2 rounded-md", index % 2 === 0 ? "bg-slate-50" : "bg-white border")}>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-xs font-bold truncate">{comp.name}</div>
                                                <div className="text-xs text-slate-500 truncate">{comp.quantity}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditComponent(index)}><Edit2 className="h-3 w-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteComponent(index)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => setAddComponentDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Component
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Actions */}
                <div className="p-4 border-t bg-white space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => { saveToDatabase(); handlePrint(); }}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white" onClick={handleSendWhatsApp} disabled={loading}>
                            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                        <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={handleSendEmail} disabled={loading}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50">
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* PREVIEW AREA */}
            <div className="print-wrapper flex-1 w-full overflow-auto p-4 md:p-8 flex justify-center bg-slate-200">
                <div ref={printRef} className="print-page w-[210mm] min-h-[297mm] p-[15mm] bg-white shadow-xl text-slate-800 text-[11px] font-[Segoe_UI] box-border relative">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-4 border-yellow-500 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <img src="/logo.png" alt="Logo" className="max-h-20" onError={(e: any) => { e.target.style.display = 'none'; }} />
                            <div>
                                <h1 className="text-[26px] font-black text-slate-800 tracking-tighter leading-none m-0">ARPIT SOLAR SHOP</h1>
                                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{companyDetails.tagline}</p>
                                <div className="text-[10px] text-slate-500 mt-2">
                                    <p className="text-blue-700 font-bold mb-0.5">GSTIN: {companyDetails.gstin}</p>
                                    <p><strong>HO:</strong> {companyDetails.headOffice}</p>
                                    <p><strong>Contact:</strong> {companyDetails.phone} | <strong>Email:</strong> {companyDetails.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-yellow-500 text-white px-4 py-1.5 text-[16px] font-black rounded mb-2 uppercase tracking-widest inline-block">Quotation</div>
                            <p className="text-[12px] font-bold text-slate-500">Date: {currentDate}</p>
                            {quoteNumber && <p className="text-[10px] text-slate-400">Quote No: {quoteNumber}</p>}
                        </div>
                    </div>

                    {/* Customer & System Overview */}
                    <div className="avoid-break grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2 text-[10px] uppercase tracking-widest border-b border-slate-200 pb-1">Customer Details</h3>
                            <p className="font-black text-blue-800 text-[16px] break-words">{customerName || "________________"}</p>
                            {customerAddress && <p className="text-slate-600 font-medium text-[11px] italic break-words mt-1">{customerAddress}</p>}
                            {customerPhone && <p className="text-slate-600 font-medium text-[11px] mt-1">Mo No: {customerPhone}</p>}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2 text-[10px] uppercase tracking-widest border-b border-slate-200 pb-1">System Overview</h3>
                            <div className="text-[11px] space-y-1">
                                <div className="flex justify-between"><span>System Size:</span> <strong>{actualSystemSize} KW ({parseInt(phase) === 1 ? "Single Phase" : "Three Phase"})</strong></div>
                                <div className="flex justify-between"><span>Modules:</span> <strong className="text-right max-w-[60%]">{effectivePanelBrand} {numPanelWattage}Wp ({panelType})</strong></div>
                                <div className="flex justify-between text-slate-500"><span>Module Warranty:</span> <strong>{panelWarranty}</strong></div>
                                <div className="flex justify-between"><span>Inverter:</span> <strong className="text-right max-w-[60%]">{effectiveInverterBrand} {inverterModel}</strong></div>
                                <div className="flex justify-between text-slate-500"><span>Inverter Warranty:</span> <strong>{inverterWarranty}</strong></div>
                                <div className="flex justify-between"><span>Type:</span> <strong>{selectedSystemType}</strong></div>
                            </div>
                        </div>
                    </div>

                    {/* Components Table */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 mb-6">
                        <table className="w-full text-[11px] border-collapse">
                            <thead>
                                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                                    <th className="p-2.5 text-center w-10 font-bold">S.N</th>
                                    <th className="p-2.5 text-left w-1/4 font-bold">Components</th>
                                    <th className="p-2.5 text-left font-bold">Description</th>
                                    <th className="p-2.5 text-center w-16 font-bold">Qty</th>
                                    <th className="p-2.5 text-center w-20 font-bold">Make</th>
                                </tr>
                            </thead>
                            <tbody>
                                {components.map((comp, index) => (
                                    <tr key={index} className={cn("border-b border-slate-200", index % 2 === 1 ? "bg-slate-50/50" : "bg-white")}>
                                        <td className="p-2 text-center font-bold">{index + 1}</td>
                                        <td className="p-2 font-bold text-slate-800">{comp.name}</td>
                                        <td className={cn("p-2", index < 2 ? "text-slate-800" : "text-slate-500")}>{comp.description}</td>
                                        <td className="p-2 text-center font-bold">{comp.quantity}</td>
                                        <td className="p-2 text-center font-bold text-blue-700">{comp.make}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pricing & Subsidy */}
                    <div className="avoid-break grid grid-cols-2 gap-6 mb-6">
                        <div>
                            {calculations.totalSubsidy > 0 && (
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                                    <h4 className="font-black text-green-800 text-[10px] uppercase mb-2 tracking-widest">PM Surya Ghar Subsidy</h4>
                                    <div className="flex justify-between text-[12px] py-1 border-b border-green-200"><span>Central Subsidy:</span><strong>₹ {formatCurrency(numCentralSubsidy)}/-</strong></div>
                                    <div className="flex justify-between text-[12px] py-1 border-b border-green-200"><span>State Subsidy:</span><strong>₹ {formatCurrency(numStateSubsidy)}/-</strong></div>
                                    <div className="flex justify-between text-[14px] pt-3 font-black text-green-800 uppercase"><span>Total Benefit:</span><span className="text-[18px]">₹ {formatCurrency(calculations.totalSubsidy)}/-</span></div>
                                </div>
                            )}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-[10px]">
                                <h4 className="font-black text-slate-800 uppercase mb-2 border-b border-blue-200 pb-1">Bank Details</h4>
                                <p className="mb-1"><strong>A/c Name:</strong> {companyDetails.bank.accountName}</p>
                                <p className="mb-1"><strong>A/c No:</strong> {companyDetails.bank.accountNumber} | <strong>IFSC:</strong> {companyDetails.bank.ifsc}</p>
                                <p className="mb-1"><strong>Bank:</strong> {companyDetails.bank.name}, {companyDetails.bank.branch}</p>
                                <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-center">
                                    <p className="font-bold text-slate-800 text-[10px] mb-1">Scan to Pay</p>
                                    <a href={`upi://pay?pa=${companyDetails.bank.upiId}&pn=${encodeURIComponent(companyDetails.name)}&am=${calculations.totalAmount}&cu=INR`} className="inline-block">
                                        <img src="/payment.png" alt="Payment QR" className="w-24 h-24 object-contain mx-auto mix-blend-multiply" onError={(e: any) => e.target.style.display = 'none'} />
                                    </a>
                                    <p className="text-[8px] text-slate-500 mt-1">Click or Scan with UPI App</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-slate-800 text-[10px] uppercase mb-3 tracking-widest border-b border-blue-200 pb-1">Investment Summary</h4>
                            <div className="flex justify-between text-[11px] py-1 text-slate-500"><span>Base Price:</span><span>₹ {formatCurrency(calculations.originalBasePrice)}</span></div>
                            {extraCosts.structureCost > 0 && <div className="flex justify-between text-[11px] py-1 text-amber-600"><span>+ Extra Structure:</span><span>₹ {formatCurrency(extraCosts.structureCost)}</span></div>}
                            {extraCosts.panelsCost > 0 && <div className="flex justify-between text-[11px] py-1 text-amber-600"><span>+ Extra Panels ({extraPanelCount}):</span><span>₹ {formatCurrency(extraCosts.panelsCost)}</span></div>}
                            {extraCosts.wireCost > 0 && <div className="flex justify-between text-[11px] py-1 text-amber-600"><span>+ Extra Wire ({extraWireLength}m):</span><span>₹ {formatCurrency(extraCosts.wireCost)}</span></div>}
                            <div className="flex justify-between text-[11px] py-1 text-slate-500 border-b border-slate-200 pb-2 mb-1"><span>GST (@ {gstRate}%):</span><span>₹ {formatCurrency(calculations.gstAmount)}</span></div>
                            <div className="flex justify-between text-[16px] font-black text-slate-800 pt-2"><span className="text-[11px] uppercase">Total Amount:</span><span className="text-blue-700">₹ {formatCurrency(calculations.totalAmount)}</span></div>
                            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-center">
                                <p className="text-[9px] text-blue-800 uppercase font-black tracking-widest mb-1">{calculations.totalSubsidy > 0 ? "Effective Cost After Subsidy" : "Effective Cost"}</p>
                                <p className="text-[24px] font-black text-green-600 tracking-[-1px] leading-none">₹ {formatCurrency(calculations.effectiveCost)}*</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editing Dialog */}
            <Dialog open={editComponentDialog} onOpenChange={setEditComponentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Component</DialogTitle>
                        <DialogDescription>Modify the component details below.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input value={editingComponent?.name || ""} onChange={(e) => setEditingComponent(prev => prev ? { ...prev, name: e.target.value } : null)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <Textarea value={editingComponent?.description || ""} onChange={(e) => setEditingComponent(prev => prev ? { ...prev, description: e.target.value } : null)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Quantity</Label>
                            <Input value={editingComponent?.quantity || ""} onChange={(e) => setEditingComponent(prev => prev ? { ...prev, quantity: e.target.value } : null)} />
                        </div>
                        <div className="space-y-1">
                            <Label>Make</Label>
                            <Input value={editingComponent?.make || ""} onChange={(e) => setEditingComponent(prev => prev ? { ...prev, make: e.target.value } : null)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditComponentDialog(false)}>Cancel</Button>
                        <Button onClick={handleSaveComponentEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Component Dialog */}
            <Dialog open={addComponentDialog} onOpenChange={setAddComponentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Component</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input value={newComponent.name} onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })} placeholder="Component Name" />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <Textarea value={newComponent.description} onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })} placeholder="Description" />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <Label>Quantity</Label>
                                <Input value={newComponent.quantity} onChange={(e) => setNewComponent({ ...newComponent, quantity: e.target.value })} placeholder="1 Nos" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label>Make</Label>
                                <Input value={newComponent.make} onChange={(e) => setNewComponent({ ...newComponent, make: e.target.value })} placeholder="Standard" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddComponentDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddComponent}>Add Component</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
