import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const HeroSection = () => {
  const [videoError, setVideoError] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator States
  const [consumption, setConsumption] = useState<number>(0);
  const [stateValue, setStateValue] = useState<string>("Delhi");
  const [results, setResults] = useState<any>(null);

  // Tariff per unit by state (₹/kWh)
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

  // Assumptions for calculation
  const avgSolarGenerationPerKW = 120; // 1 kW system generates ~120 units per month in India
  const co2SavingPerKWYear = 1.2; // 1.2 tons CO2 saved per kW per year
  const systemCostPerKW = 60000; // Approx cost per kW before subsidy
  const subsidy = 108000; // Government subsidy in ₹

  const handleCalculate = () => {
    if (!consumption || consumption <= 0) return;

    const tariff = stateTariffs[stateValue] ?? 8; // default ₹8 if state not found
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video or Fallback Image */}
      <div className="absolute inset-0">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover scale-105"
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
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Powering Your Future with{" "}
              <span className="bg-gradient-to-r from-solar-orange to-solar-gold bg-clip-text text-transparent">
                the Sun
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Transform your energy costs with premium solar solutions.
              Join thousands of satisfied customers who've made the switch to
              clean, renewable energy.
            </p>

{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
  {/* Get Quote Button */}
  <Button
    asChild
    size="lg"
    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0"
  >
    <Link to="/get-quote" className="flex items-center justify-center">
      Get Free Quote
      <ArrowRight className="ml-2 w-5 h-5" />
    </Link>
  </Button>

  {/* Call Button */}
  <Button
    asChild
    size="lg"
    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 rounded-xl w-[80%] sm:w-auto mx-auto sm:mx-0"
  >
    <a href="tel:+919044555572" className="flex items-center justify-center">
      Call Our Solar Expert
      <PhoneCall className="ml-2 w-5 h-5" />
    </a>
  </Button>
</div>


            {/* Trust Indicators */}
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

          {/* Right Column */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-64 h-64 rounded-full bg-white/5 backdrop-blur-sm opacity-20 animate-float border border-white/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-sm text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Save Up To</h3>
                  <div className="text-4xl font-bold text-solar-orange mb-4">
                    90%
                  </div>
                  <p className="text-gray-200 mb-4">
                    on your electricity bills
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setShowCalculator(true)}
                    className="bg-solar-orange hover:bg-solar-gold text-white rounded-lg flex items-center gap-2"
                  >
                    <Calculator size={18} />
                    Solar Savings Calculator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowCalculator(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-solar-orange mb-4 text-center">
              Solar Savings Calculator
            </h2>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Monthly Electricity Consumption (units/kWh)
                </label>
                <input
                  type="number"
                  value={consumption || ""}
                  onChange={(e) => setConsumption(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., 600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  State
                </label>
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

            {/* Results */}
            {results && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="text-solar-orange" /> Results:
                </h3>

                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <Zap className="text-yellow-500" />
                    <strong>Required Solar System:</strong>{" "}
                    <CountUp end={results.requiredKW} duration={2} /> kW
                  </p>

                  <p className="flex items-center gap-2">
                    <Zap className="text-green-600" />
                    <strong>Monthly Generation:</strong>{" "}
                    <CountUp end={results.monthlyGeneration} duration={2} /> units
                  </p>

                  <p className="flex items-center gap-2">
                    <Zap className="text-blue-500" />
                    <strong>Yearly Generation:</strong>{" "}
                    <CountUp end={results.yearlyGeneration} duration={2} /> units
                  </p>

                  <p className="flex items-center gap-2">
                    <Leaf className="text-green-700" />
                    <strong>CO₂ Savings:</strong>{" "}
                    <CountUp end={results.co2Savings} decimals={1} duration={2} /> tons/year
                  </p>

                  <p className="flex items-center gap-2">
                    <IndianRupee className="text-solar-orange" />
                    <strong>Gross Cost:</strong> ₹
                    <CountUp end={results.grossCost} duration={2} separator="," />
                  </p>

                  <p className="flex items-center gap-2">
                    <PiggyBank className="text-pink-500" />
                    <strong>Government Subsidy:</strong> ₹
                    <CountUp end={subsidy} duration={2} separator="," />
                  </p>

                  <p className="flex items-center gap-2">
                    <IndianRupee className="text-green-600" />
                    <strong>Net Cost after Subsidy:</strong> ₹
                    <CountUp end={results.netCost} duration={2} separator="," />
                  </p>

                  <p className="flex items-center gap-2">
                    <PiggyBank className="text-blue-600" />
                    <strong>Monthly Savings:</strong> ₹
                    <CountUp end={results.monthlySavings} duration={2} separator="," />
                  </p>

                  <p className="flex items-center gap-2">
                    <Timer className="text-gray-700" />
                    <strong>Estimated Payback:</strong>{" "}
                    <CountUp end={results.paybackMonths} duration={2} /> months (~
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









