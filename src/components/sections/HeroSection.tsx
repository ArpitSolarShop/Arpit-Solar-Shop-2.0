// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   Zap,
//   Shield,
//   Award,
//   Calculator,
//   Leaf,
//   IndianRupee,
//   PiggyBank,
//   Timer,
//   PhoneCall,
// } from "lucide-react";
// import CountUp from "react-countup";

// const HeroSection = () => {
//   const [videoError, setVideoError] = useState(false);
//   const [showCalculator, setShowCalculator] = useState(false);

//   // Calculator States
//   const [consumption, setConsumption] = useState<number>(0);
//   const [stateValue, setStateValue] = useState<string>("Delhi");
//   const [results, setResults] = useState<any>(null);

//   // Tariff per unit by state (₹/kWh)
//   const stateTariffs: Record<string, number> = {
//     Delhi: 8,
//     "Uttar Pradesh": 7.2,
//     Maharashtra: 9,
//     Gujarat: 7,
//     Rajasthan: 8.5,
//     Karnataka: 9.5,
//     "Tamil Nadu": 8.8,
//     Haryana: 7.5,
//     Punjab: 8,
//     Kerala: 8.2,
//     Telangana: 9.2,
//     "Madhya Pradesh": 8.6,
//     Bihar: 7.8,
//     Jharkhand: 8.1,
//     Chhattisgarh: 7.4,
//     Odisha: 7.6,
//     "West Bengal": 8.3,
//     Assam: 7.9,
//     "Andhra Pradesh": 8.7,
//   };

//   // Assumptions for calculation
//   const avgSolarGenerationPerKW = 120; // 1 kW system generates ~120 units per month in India
//   const co2SavingPerKWYear = 1.2; // 1.2 tons CO2 saved per kW per year
//   const systemCostPerKW = 60000; // Approx cost per kW before subsidy
//   const subsidy = 108000; // Government subsidy in ₹

//   const handleCalculate = () => {
//     if (!consumption || consumption <= 0) return;

//     const tariff = stateTariffs[stateValue] ?? 8; // default ₹8 if state not found
//     const requiredKW = Math.ceil(consumption / avgSolarGenerationPerKW);
//     const monthlyGeneration = requiredKW * avgSolarGenerationPerKW;
//     const yearlyGeneration = monthlyGeneration * 12;

//     const co2Savings = requiredKW * co2SavingPerKWYear;

//     const grossCost = requiredKW * systemCostPerKW;
//     const netCost = Math.max(grossCost - subsidy, 0);

//     const monthlySavings = consumption * tariff;
//     const paybackMonths = Math.ceil(netCost / monthlySavings);
//     const paybackYears = (paybackMonths / 12).toFixed(1);

//     setResults({
//       requiredKW,
//       monthlyGeneration,
//       yearlyGeneration,
//       co2Savings,
//       grossCost,
//       netCost,
//       monthlySavings,
//       paybackMonths,
//       paybackYears,
//       tariff,
//     });
//   };

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Video or Fallback Image */}
//       <div className="absolute inset-0">
//         {!videoError ? (
//           <video
//             autoPlay
//             muted
//             loop
//             playsInline
//             onError={() => setVideoError(true)}
//             className="w-full h-full object-cover scale-105"
//           >
//             <source src="/Solar_Video_Ready_Arpit_Solar.mp4" type="video/mp4" />
//           </video>
//         ) : (
//           <img
//             src="/enhance-quality.png"
//             alt="Fallback: solar house"
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         )}
//         <div className="absolute inset-0 bg-black/40"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left Column */}
//           <div className="text-center lg:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
//               Powering Your Future with{" "}
//               <span className="bg-gradient-to-r from-solar-orange to-solar-gold bg-clip-text text-transparent">
//                 the Sun
//               </span>
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
//               Transform your energy costs with premium solar solutions.
//               Join thousands of satisfied customers who've made the switch to
//               clean, renewable energy.
//             </p>

// {/* CTA Buttons */}
// <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
//   {/* Get Quote Button */}
//   <Button
//     asChild
//     size="lg"
//     className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0"
//   >
//     <Link to="/get-quote" className="flex items-center justify-center">
//       Get Free Quote
//       <ArrowRight className="ml-2 w-5 h-5" />
//     </Link>
//   </Button>

//   {/* Call Button */}
//   <Button
//     asChild
//     size="lg"
//     className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0"
//   >
//     <a href="tel:+919044555572" className="flex items-center justify-center">
//       Call Our Solar Expert
//       <PhoneCall className="ml-2 w-5 h-5" />
//     </a>
//   </Button>
// </div>


//             {/* Trust Indicators */}
//             <div className="grid grid-cols-3 gap-6">
//               <div className="text-center lg:text-left">
//                 <div className="flex items-center justify-center lg:justify-start mb-2">
//                   <Zap className="w-6 h-6 text-solar-orange mr-2" />
//                   <span className="text-2xl font-bold text-white">5000+</span>
//                 </div>
//                 <p className="text-gray-300 text-sm">Installations</p>
//               </div>
//               <div className="text-center lg:text-left">
//                 <div className="flex items-center justify-center lg:justify-start mb-2">
//                   <Shield className="w-6 h-6 text-solar-orange mr-2" />
//                   <span className="text-2xl font-bold text-white">25 Year</span>
//                 </div>
//                 <p className="text-gray-300 text-sm">Warranty</p>
//               </div>
//               <div className="text-center lg:text-left">
//                 <div className="flex items-center justify-center lg:justify-start mb-2">
//                   <Award className="w-6 h-6 text-solar-orange mr-2" />
//                   <span className="text-2xl font-bold text-white">Award</span>
//                 </div>
//                 <p className="text-gray-300 text-sm">Winning</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="hidden lg:flex items-center justify-center">
//             <div className="relative">
//               <div className="w-64 h-64 rounded-full bg-white/5 backdrop-blur-sm opacity-20 animate-float border border-white/10"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-sm text-center text-white">
//                   <h3 className="text-2xl font-bold mb-2">Save Up To</h3>
//                   <div className="text-4xl font-bold text-solar-orange mb-4">
//                     90%
//                   </div>
//                   <p className="text-gray-200 mb-4">
//                     on your electricity bills
//                   </p>
//                   <Button
//                     size="sm"
//                     onClick={() => setShowCalculator(true)}
//                     className="bg-solar-orange hover:bg-solar-gold text-white rounded-lg flex items-center gap-2"
//                   >
//                     <Calculator size={18} />
//                     Solar Savings Calculator
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
//         </div>
//       </div>

//       {/* Calculator Modal */}
//       {showCalculator && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
//             <button
//               onClick={() => setShowCalculator(false)}
//               className="absolute top-3 right-3 text-gray-600 hover:text-black"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold text-solar-orange mb-4 text-center">
//               Solar Savings Calculator
//             </h2>

//             {/* Inputs */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Monthly Electricity Consumption (units/kWh)
//                 </label>
//                 <input
//                   type="number"
//                   value={consumption || ""}
//                   onChange={(e) => setConsumption(Number(e.target.value))}
//                   className="w-full px-4 py-2 border rounded-lg"
//                   placeholder="e.g., 600"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   State
//                 </label>
//                 <select
//                   value={stateValue}
//                   onChange={(e) => setStateValue(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg"
//                 >
//                   {Object.keys(stateTariffs).map((st) => (
//                     <option key={st} value={st}>
//                       {st}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <Button
//                 onClick={handleCalculate}
//                 className="w-full bg-solar-orange hover:bg-solar-gold text-white rounded-lg"
//               >
//                 Calculate
//               </Button>
//             </div>

//             {/* Results */}
//             {results && (
//               <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                   <Zap className="text-solar-orange" /> Results:
//                 </h3>

//                 <div className="space-y-3">
//                   <p className="flex items-center gap-2">
//                     <Zap className="text-yellow-500" />
//                     <strong>Required Solar System:</strong>{" "}
//                     <CountUp end={results.requiredKW} duration={2} /> kW
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Zap className="text-green-600" />
//                     <strong>Monthly Generation:</strong>{" "}
//                     <CountUp end={results.monthlyGeneration} duration={2} /> units
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Zap className="text-blue-500" />
//                     <strong>Yearly Generation:</strong>{" "}
//                     <CountUp end={results.yearlyGeneration} duration={2} /> units
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Leaf className="text-green-700" />
//                     <strong>CO₂ Savings:</strong>{" "}
//                     <CountUp end={results.co2Savings} decimals={1} duration={2} /> tons/year
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <IndianRupee className="text-solar-orange" />
//                     <strong>Gross Cost:</strong> ₹
//                     <CountUp end={results.grossCost} duration={2} separator="," />
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <PiggyBank className="text-pink-500" />
//                     <strong>Government Subsidy:</strong> ₹
//                     <CountUp end={subsidy} duration={2} separator="," />
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <IndianRupee className="text-green-600" />
//                     <strong>Net Cost after Subsidy:</strong> ₹
//                     <CountUp end={results.netCost} duration={2} separator="," />
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <PiggyBank className="text-blue-600" />
//                     <strong>Monthly Savings:</strong> ₹
//                     <CountUp end={results.monthlySavings} duration={2} separator="," />
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Timer className="text-gray-700" />
//                     <strong>Estimated Payback:</strong>{" "}
//                     <CountUp end={results.paybackMonths} duration={2} /> months (~
//                     <CountUp end={parseFloat(results.paybackYears)} decimals={1} duration={2} /> years)
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default HeroSection;













import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  Zap,
  Shield,
  Award,
  Calculator,
  Leaf,
  IndianRupee,
  PiggyBank,
  Timer,
  PhoneCall,
} from "lucide-react";
import CountUp from "react-countup";

// Helper function to convert bill ranges to a number
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

const HeroSection = () => {
  // State for Video and Calculator Modal
  const [videoError, setVideoError] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [consumption, setConsumption] = useState<number>(0);
  const [stateValue, setStateValue] = useState<string>("Delhi");
  const [results, setResults] = useState<any>(null);

  // State and logic for the integrated Quote Form
  const { toast } = useToast();
  type CustomerType = "Residential" | "Commercial";
  const BILL_RANGES = ["Less than ₹1500", "₹1500 - ₹2500", "₹2500 - ₹4000", "₹4000 - ₹8000", "More than ₹8000"];
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

  // useEffect for mobile-only auto-scrolling
  useEffect(() => {
    if (window.innerWidth < 1024) { // Changed to lg breakpoint for tablets as well
      const quoteForm = document.querySelector('#quote-form');
      if (quoteForm) {
        quoteForm.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ fullName: "", whatsappNumber: "", pinCode: "", companyName: "", city: "", monthlyBill: "" });
    setAgreed(false);
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Agreement Required", description: "Please agree to the terms of service and privacy policy.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const isCommercial = customerType === "Commercial";
    try {
      const dataToInsert = {
        name: formData.fullName,
        phone: formData.whatsappNumber,
        customer_type: customerType.toLowerCase(),
        company_name: isCommercial ? formData.companyName : null,
        project_location: isCommercial ? `${formData.city}, ${formData.pinCode}` : formData.pinCode,
        source: "Hero Quote Form",
        monthly_bill: convertBillRangeToNumber(formData.monthlyBill),
      };
      const { error } = await supabase.from("solar_quote_requests").insert(dataToInsert);
      if (error) throw error;
      toast({ title: "Request Submitted!", description: "Thank you! Our team will contact you shortly." });
      resetForm();
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast({ title: "Submission Failed", description: error.message || "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (customerType === "Commercial") {
      return (
        <>
          <div className="space-y-2"><Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label><Input id="companyName" required value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="city">City <span className="text-red-500">*</span></Label><Input id="city" required value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="pinCodeCommercial">Pin code</Label><Input id="pinCodeCommercial" value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div></div>
          <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="avgMonthlyBill">Average Monthly Bill <span className="text-red-500">*</span></Label><Input id="avgMonthlyBill" type="number" required value={formData.monthlyBill} onChange={(e) => handleInputChange("monthlyBill", e.target.value)} /></div>
        </>
      );
    }
    return (
      <>
        <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp number <span className="text-red-500">*</span></Label><Input id="whatsappNumber" type="tel" required value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="pinCodeResidential">Pin code <span className="text-red-500">*</span></Label><Input id="pinCodeResidential" required value={formData.pinCode} onChange={(e) => handleInputChange("pinCode", e.target.value)} /></div>
        <div className="space-y-2"><Label>What is your average monthly bill? <span className="text-red-500">*</span></Label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BILL_RANGES.map((range) => (<Button key={range} type="button" variant={formData.monthlyBill === range ? "default" : "outline"} onClick={() => handleInputChange("monthlyBill", range)} className="justify-center text-center h-auto py-2 px-2 text-sm">{range}</Button>))}</div></div>
      </>
    );
  };

  const stateTariffs: Record<string, number> = {
    Delhi: 8,
    "Uttar Pradesh": 7.2,
    Maharashtra: 9,
    Gujarat: 7,
    Rajasthan: 8.5,
    Karnataka: 9.5,
    "Tamil Nadu": 8.8,
    Haryana: 7.5,
    Punjab: 8,
    Kerala: 8.2,
    Telangana: 9.2,
    "Madhya Pradesh": 8.6,
    Bihar: 7.8,
    Jharkhand: 8.1,
    Chhattisgarh: 7.4,
    Odisha: 7.6,
    "West Bengal": 8.3,
    Assam: 7.9,
    "Andhra Pradesh": 8.7,
  };
  const avgSolarGenerationPerKW = 120;
  const co2SavingPerKWYear = 1.2;
  const systemCostPerKW = 60000;
  const subsidy = 108000;
  const handleCalculate = () => {
    if (!consumption || consumption <= 0) return;
    const tariff = stateTariffs[stateValue] ?? 8;
    const requiredKW = Math.ceil(consumption / avgSolarGenerationPerKW);
    const monthlyGeneration = requiredKW * avgSolarGenerationPerKW;
    const yearlyGeneration = monthlyGeneration * 12;
    const co2Savings = requiredKW * co2SavingPerKWYear;
    const grossCost = requiredKW * systemCostPerKW;
    const netCost = Math.max(grossCost - subsidy, 0);
    const monthlySavings = consumption * tariff;
    const paybackMonths = Math.ceil(netCost / monthlySavings);
    const paybackYears = (paybackMonths / 12).toFixed(1);
    setResults({
      requiredKW,
      monthlyGeneration,
      yearlyGeneration,
      co2Savings,
      grossCost,
      netCost,
      monthlySavings,
      paybackMonths,
      paybackYears,
      tariff,
    });
  };

  return (
    <section className="relative z-0 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover scale-125 md:scale-110"
          >
            <source src="/Solar_Video_Ready_Arpit_Solar.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/enhance-quality.png"
            alt="Fallback: solar house"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Powering Your Future with{" "}
              <span className="bg-gradient-to-r from-solar-orange to-solar-gold bg-clip-text text-transparent">
                the Sun
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Transform your energy costs with premium solar solutions.{" "}
              <span className="font-bold text-solar-orange">Save up to 90% on your electricity bills.</span> Join
              thousands of satisfied customers who've made the switch to clean, renewable energy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0"
              >
                <a href="tel:+919044555572" className="flex items-center justify-center">
                  Call Our Solar Expert <PhoneCall className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                onClick={() => setShowCalculator(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0 flex items-center justify-center"
              >
                <Calculator className="mr-2 w-5 h-5" />
                Solar Savings Calculator
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Zap className="w-6 h-6 text-solar-orange mr-2" />
                  <span className="text-2xl font-bold text-white">5000+</span>
                </div>
                <p className="text-gray-300 text-sm">Installations</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Shield className="w-6 h-6 text-solar-orange mr-2" />
                  <span className="text-2xl font-bold text-white">25 Year</span>
                </div>
                <p className="text-gray-300 text-sm">Warranty</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Award className="w-6 h-6 text-solar-orange mr-2" />
                  <span className="text-2xl font-bold text-white">Award</span>
                </div>
                <p className="text-gray-300 text-sm">Winning</p>
              </div>
            </div>
          </div>
          <div id="quote-form" className="scroll-mt-24">
            <Card className="w-full max-w-md mx-auto shadow-xl rounded-2xl border bg-white">
              <CardContent className="p-6">
                <div className="bg-gray-100 rounded-full p-1 flex items-center justify-between gap-1 mb-6">
                  {(["Residential", "Commercial"] as CustomerType[]).map((type) => (
                    <Button
                      key={type}
                      onClick={() => handleCustomerTypeChange(type)}
                      variant="ghost"
                      className={`flex-1 rounded-full text-sm font-semibold h-9 transition-colors duration-300 ease-in-out ${
                        customerType === type ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  {renderFormFields()}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      className="mt-0.5"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">
                        I agree to Arpit Solar Shop's{" "}
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
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowCalculator(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-solar-orange mb-4 text-center">Solar Savings Calculator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Monthly Electricity Consumption (units/kWh)</label>
                <input
                  type="number"
                  value={consumption || ""}
                  onChange={(e) => setConsumption(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., 600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <select
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {Object.keys(stateTariffs).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleCalculate}
                className="w-full bg-solar-orange hover:bg-solar-gold text-white rounded-lg"
              >
                Calculate
              </Button>
            </div>
            {results && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="text-solar-orange" /> Results:
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <Zap className="text-yellow-500" />
                    <strong>Required Solar System:</strong> <CountUp end={results.requiredKW} duration={2} /> kW
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap className="text-green-600" />
                    <strong>Monthly Generation:</strong> <CountUp end={results.monthlyGeneration} duration={2} /> units
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap className="text-blue-500" />
                    <strong>Yearly Generation:</strong> <CountUp end={results.yearlyGeneration} duration={2} /> units
                  </p>
                  <p className="flex items-center gap-2">
                    <Leaf className="text-green-700" />
                    <strong>CO₂ Savings:</strong> <CountUp end={results.co2Savings} decimals={1} duration={2} /> tons/year
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee className="text-solar-orange" />
                    <strong>Gross Cost:</strong> ₹<CountUp end={results.grossCost} duration={2} separator="," />
                  </p>
                  <p className="flex items-center gap-2">
                    <PiggyBank className="text-pink-500" />
                    <strong>Government Subsidy:</strong> ₹<CountUp end={subsidy} duration={2} separator="," />
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee className="text-green-600" />
                    <strong>Net Cost after Subsidy:</strong> ₹<CountUp end={results.netCost} duration={2} separator="," />
                  </p>
                  <p className="flex items-center gap-2">
                    <PiggyBank className="text-blue-600" />
                    <strong>Monthly Savings:</strong> ₹<CountUp end={results.monthlySavings} duration={2} separator="," />
                  </p>
                  <p className="flex items-center gap-2">
                    <Timer className="text-gray-700" />
                    <strong>Estimated Payback:</strong> <CountUp end={results.paybackMonths} duration={2} /> months (~
                    <CountUp end={parseFloat(results.paybackYears)} decimals={1} duration={2} /> years)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;