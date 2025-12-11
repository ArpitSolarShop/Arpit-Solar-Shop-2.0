import React, { useState, useMemo, useEffect } from 'react';
import { Sun, Zap, Activity, ShieldCheck, Home, Radio, Anchor, ArrowRightLeft, Settings, ChevronDown, Wrench } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IntegratedPriceData from "@/assets/integrated-products";
// --- CONSTANTS & OPTIONS ---

const PANEL_TYPES = {
  WAAREE_TOPCON: {
    id: 'waaree_topcon',
    brand: 'Waaree',
    name: 'Waaree TopCon Bi-Facial',
    wattage: '575 Wp',
    desc: 'N-Type TopCon Bi-Facial Module (Glass-to-Glass)',
    colorStart: '#1d4ed8', // Deep Blue
    colorEnd: '#60a5fa',   // Light Blue
    gridColor: 'white',
    efficiency: '22.5%'
  },
  WAAREE_MONOPERC: {
    id: 'waaree_monoperc',
    brand: 'Waaree',
    name: 'Waaree Mono PERC',
    wattage: '540 Wp',
    desc: 'P-Type Mono PERC Module (High Efficiency)',
    colorStart: '#0f172a', // Dark Slate
    colorEnd: '#334155',   // Lighter Slate
    gridColor: 'rgba(255,255,255,0.4)',
    efficiency: '21.0%'
  },
  ADANI_TOPCON: {
    id: 'adani_topcon',
    brand: 'Adani',
    name: 'Adani Encore TopCon',
    wattage: '570 Wp',
    desc: 'Adani Solar N-Type TopCon Bifacial (Encore Series)',
    colorStart: '#0369a1', // Sky 700
    colorEnd: '#38bdf8',   // Sky 400
    gridColor: '#e0f2fe',
    efficiency: '22.8%'
  },
  ADANI_MONOPERC: {
    id: 'adani_monoperc',
    brand: 'Adani',
    name: 'Adani Eternal Mono',
    wattage: '535 Wp',
    desc: 'Adani Solar Mono PERC (Eternal Series)',
    colorStart: '#111827', // Gray 900
    colorEnd: '#374151',   // Gray 700
    gridColor: 'rgba(255,255,255,0.3)',
    efficiency: '21.2%'
  }
};

const INVERTER_TYPES = {
  THREE_KW: { id: '3kw', name: '3kW Single Phase', model: 'Standard String', capacity: '3.0 kW' },
  FIVE_KW: { id: '5kw', name: '5kW Single Phase', model: 'Standard String', capacity: '5.0 kW' },
};

// NOTE: Pricing is now served from Supabase `integrated_products`. See `src/assets/integrated-products.tsx` for the live table component.

const SolarDiagram = () => {
  // --- STATE ---
  const [activeId, setActiveId] = useState(null);
  const [showFlow, setShowFlow] = useState(true);
  
  // Configuration State
  const [panelType, setPanelType] = useState('WAAREE_TOPCON');
  const [inverterType, setInverterType] = useState('THREE_KW');

  // --- FIX: Inject Tailwind if missing ---
  useEffect(() => {
    // Using bracket notation window['tailwind'] avoids the TypeScript error:
    // "Property 'tailwind' does not exist on type 'Window & typeof globalThis'."
    if (typeof window !== 'undefined' && !window['tailwind']) {
      const script = document.createElement('script');
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Get current config objects
  const currentPanel = PANEL_TYPES[panelType];
  const currentInverter = INVERTER_TYPES[inverterType];

  // Dynamic Bill of Materials Data
  const systemData = useMemo(() => [
    { id: 'solar', sn: '1', component: 'Solar PV Modules', spec: currentPanel.name, desc: currentPanel.desc, qty: '6 NOS', make: `${currentPanel.brand} Solar`, icon: <Sun className="w-4 h-4 text-orange-500"/> },
    { id: 'inverter', sn: '2', component: 'PCU / INVERTER', spec: currentInverter.name, desc: `On-Grid String Inverter (${currentInverter.model})`, qty: '1 NOS', make: 'Waaree / Adani Approved', icon: <Zap className="w-4 h-4 text-yellow-500"/> },
    { id: 'dcdb', sn: '3', component: 'DC Distribution Box', spec: '1-in 1-out', desc: 'CRCA IP65, DP MCB for Solar', qty: '1 NOS', make: 'Approved Vendor', icon: <Activity className="w-4 h-4 text-red-500"/> },
    { id: 'acdb', sn: '4', component: 'AC Distribution Box', spec: '1 Phase', desc: 'CRCA IP65, Meter, SPD, MCB, Changeover', qty: '1 NOS', make: 'Approved Vendor', icon: <Home className="w-4 h-4 text-blue-500"/> },
    { id: 'ac_cable', sn: '5', component: 'AC Cable', spec: '4 Core', desc: 'Copper, 4Sq mm. Armoured', qty: '10 mtr', make: 'Polycab / Havells', icon: <ArrowRightLeft className="w-4 h-4 text-slate-500"/> },
    { id: 'dc_cable', sn: '6', component: 'DC Cables', spec: '1 Core 4sqmm', desc: '1C x 4 sqmm 1.1kV, UV Protected', qty: 'As per Site', make: 'Polycab / Siechem', icon: <ArrowRightLeft className="w-4 h-4 text-red-500"/> },
    { id: 'structure', sn: '7', component: 'Mounting Structure', spec: 'GI 80 Micron', desc: 'Pre-galvanized, 150 kmph wind load', qty: '1 Set', make: 'Custom Fabricated', icon: <Anchor className="w-4 h-4 text-slate-500"/> },
    { id: 'earthing', sn: '8', component: 'Earthing', spec: 'Maintenance Free', desc: 'Chemical compound, 3 copper rods', qty: '3 sets', make: 'Approved Vendor', icon: <Radio className="w-4 h-4 text-green-600"/> },
    { id: 'la', sn: '9', component: 'Lightning Arrestor', spec: 'Conventional', desc: 'Copper Type 1.25 Dia.', qty: '1 set', make: 'Approved Vendor', icon: <Zap className="w-4 h-4 text-orange-600"/> },
    { id: 'accessories', sn: '10', component: 'System Accessories', spec: 'Installation Kit', desc: 'MC4 Connectors, Cable Ties, Conduits, Danger Boards', qty: '1 Lot', make: 'Standard', icon: <Wrench className="w-4 h-4 text-slate-600"/> },
  ], [currentPanel, currentInverter]);

  // Helpers for SVG styles
  const getOpacity = (id) => (activeId && activeId !== id ? 0.3 : 1);
  const getStrokeWidth = (id) => (activeId === id ? 3 : 1.5);
  const getFilter = (id) => (activeId === id ? 'url(#glow)' : 'url(#dropShadow)');

  // use top-level constant PRICE_DATA instead
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <Navbar />
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            Solar System Configurator
          </h1>
          <p className="text-slate-500 text-sm">Customize components and view connections</p>
        </div>
        
        {/* CONFIGURATION PANEL */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 flex gap-4 items-center flex-wrap justify-center">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
            <Settings className="w-4 h-4" />
            <span>Customize:</span>
          </div>
          
          {/* Panel Dropdown */}
          <div className="relative group">
            <select 
              value={panelType}
              onChange={(e) => setPanelType(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-56 p-2.5 pr-8 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <optgroup label="Waaree Solar">
                <option value="WAAREE_TOPCON">Waaree TopCon (575W)</option>
                <option value="WAAREE_MONOPERC">Waaree Mono PERC (540W)</option>
              </optgroup>
              <optgroup label="Adani Solar">
                <option value="ADANI_TOPCON">Adani Encore TopCon (570W)</option>
                <option value="ADANI_MONOPERC">Adani Eternal Mono (535W)</option>
              </optgroup>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Inverter Dropdown */}
          <div className="relative group">
             <select 
              value={inverterType}
              onChange={(e) => setInverterType(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 pr-8 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="THREE_KW">3kW Inverter</option>
              <option value="FIVE_KW">5kW Inverter</option>
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Top hero image removed — unified brand section acts as the page header now */}

      {/* Unified hero header — full-height (~95vh) and responsive */}
      <div className="w-full mb-8">
        <header className="min-h-[95vh] flex items-center bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-6xl mx-auto w-full p-6 md:p-12 flex flex-col lg:flex-row items-center gap-8">
            {/* Left: main copy */}
            <div className="lg:w-7/12 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 leading-tight">Waaree & Adani Integrated Solutions</h2>
              <p className="mt-4 text-lg md:text-xl text-slate-700 max-w-3xl">Bringing together Waaree’s manufacturing scale and Adani’s vertically integrated supply chain to deliver reliable, high-efficiency solar systems tailored for India’s needs.</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto lg:mx-0 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>End-to-end integration:</strong> From polysilicon to modules and system supply.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Performance & warranty:</strong> Long-term performance guarantees and proven reliability.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Local supply strength:</strong> DCR/ALMM-ready modules and rapid logistics.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span><strong>Scalable solutions:</strong> From rooftop to commercial-scale deployments.</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a href="#priceTable" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md text-sm font-semibold">See Prices & Get Quote</a>
                <a href="/contact" className="inline-block bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg text-sm">Contact Sales</a>
              </div>
            </div>

            {/* Right: compact card with logos/specs */}
            <div className="lg:w-5/12 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/AdaniSolar.png" alt="Adani" className="h-10 object-contain" />
                    <img src="/Waree.webp" alt="Waaree" className="h-10 object-contain" />
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600 text-center lg:text-left">Integrated: choose panel & inverter brand, size, mounting type and all system components</div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>
                    <div className="font-semibold">Typical System</div>
                    <div className="text-slate-600">3.3 kW • 6 Modules</div>
                  </div>
                  <div>
                    <div className="font-semibold">Inverter</div>
                    <div className="text-slate-600">3 kW / 5 kW</div>
                  </div>
                  <div>
                    <div className="font-semibold">Warranty</div>
                    <div className="text-slate-600">25-30 yrs Performance</div>
                  </div>
                  <div>
                    <div className="font-semibold">Support</div>
                    <div className="text-slate-600">Pan-India Service</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <a href="#priceTable" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Get Quote</a>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Price table (applies to both Waaree & Adani) - Supabase driven component */}
      <div id="priceTable"><IntegratedPriceData /></div>

     

      
     
 <Footer />
    </div>
  );
};

export default SolarDiagram;







