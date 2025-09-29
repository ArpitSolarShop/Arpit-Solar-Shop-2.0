import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Define component-specific types and constants
type CustomerType = "Residential" | "Commercial";
const BILL_RANGES = [
  "Less than ₹1500",
  "₹1500 - ₹2500",
  "₹2500 - ₹4000",
  "₹4000 - ₹8000",
  "More than ₹8000",
];

// ✅ FIX 1: Added a helper function to convert text ranges to numbers
const convertBillRangeToNumber = (range: string): number | null => {
  if (!range) return null;
  switch (range) {
    case "Less than ₹1500":
      return 1000; // Representative value
    case "₹1500 - ₹2500":
      return 2000; // Average
    case "₹2500 - ₹4000":
      return 3250; // Average
    case "₹4000 - ₹8000":
      return 6000; // Average
    case "More than ₹8000":
      return 9000; // Representative value
    default:
      // If it's already a number string (from commercial input), parse it
      const parsed = parseFloat(range);
      return isNaN(parsed) ? null : parsed;
  }
};

export const HeroGetQuote = () => {
  const { toast } = useToast();
  const [customerType, setCustomerType] = useState<CustomerType>("Residential");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    pinCode: "",
    companyName: "",
    city: "",
    monthlyBill: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      whatsappNumber: "",
      pinCode: "",
      companyName: "",
      city: "",
      monthlyBill: "",
    });
    setAgreed(false);
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms of service and privacy policy.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const isCommercial = customerType === "Commercial";

    try {
      // ✅ FIX 2: Updated the data object to always send a numeric bill
      const dataToInsert = {
        name: formData.fullName,
        phone: formData.whatsappNumber,
        customer_type: customerType.toLowerCase(),
        company_name: isCommercial ? formData.companyName : null,
        project_location: isCommercial
          ? `${formData.city}, ${formData.pinCode}`
          : formData.pinCode,
        source: "Hero Quote Form",
        // This now handles both cases and sends a number to the correct column
        monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
      };

      const { error } = await supabase.from("solar_quote_requests").insert(dataToInsert);

      if (error) throw error;

      toast({
        title: "Request Submitted!",
        description: "Thank you! Our team will contact you shortly.",
      });

      resetForm();
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render different form fields based on the selected customer type
  const renderFormFields = () => {
    if (customerType === "Commercial") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
            <Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pinCodeCommercial">Pin code</Label>
              <Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label>
            <Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label>
            <Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} />
          </div>
        </>
      );
    }

    // Default to Residential form
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label>
          <Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label>
          <Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>What is your average monthly bill? <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BILL_RANGES.map((range) => (
              <Button
                key={range}
                type="button"
                variant={formData.monthlyBill === range ? "default" : "outline"}
                onClick={() => handleInputChange("monthlyBill", range)}
                className="justify-center text-center h-auto py-2 px-2 text-sm"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border">
      <CardContent className="p-6">
        {/* Customer Type Toggle */}
        <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
          {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
            <Button
              key={type}
              onClick={() => handleCustomerTypeChange(type)}
              variant="ghost"
              className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${
                customerType === type
                  ? "bg-white text-blue-900 shadow"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
            <Input id="fullName" required value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} />
          </div>

          {renderFormFields()}

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">
                I agree to SolarSquare's{" "}
                <Link to="/terms-of-service" target="_blank" className="underline font-medium hover:text-primary">
                  terms of service
                </Link>{" "}
                &{" "}
                <Link to="/privacy-policy" target="_blank" className="underline font-medium hover:text-primary">
                  privacy policy
                </Link>
              </Label>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold text-base h-12 bg-gradient-to-r from-[#0a2351] to-[#0d2e67] hover:opacity-90 transition-opacity"
          >
            {loading ? "Submitting..." : "Submit Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};













