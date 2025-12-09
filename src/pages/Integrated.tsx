import React, { useState, useMemo, useEffect } from 'react';
import { Sun, Zap, Activity, ShieldCheck, Home, Radio, Anchor, ArrowRightLeft, Settings, ChevronDown, Wrench } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* <Navbar /> */}
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

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Diagram (8 cols) */}
        <div className="lg:col-span-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
          
          {/* Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={() => setShowFlow(!showFlow)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm border ${showFlow ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              <div className={`w-2 h-2 rounded-full ${showFlow ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
              {showFlow ? 'Live Flow' : 'Paused'}
            </button>
          </div>

          {/* Diagram Container */}
          <div className="w-full bg-gradient-to-b from-blue-50/50 to-white p-4 overflow-x-auto flex justify-center">
            <div className="min-w-[800px] w-full max-w-[900px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" className="w-full h-auto">
                <defs>
                  <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.15"/>
                  </filter>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Dynamic Panel Gradient based on Selection */}
                  <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentPanel.colorStart} className="transition-all duration-500" />
                    <stop offset="100%" stopColor={currentPanel.colorEnd} className="transition-all duration-500" />
                  </linearGradient>

                  <linearGradient id="inverterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  
                  {/* Panel Grid Pattern */}
                  <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke={currentPanel.gridColor} strokeWidth="0.5" opacity="0.3"/>
                  </pattern>

                  <style>
                    {`
                      .flow-line { stroke-dasharray: 8; animation: dash 1s linear infinite; }
                      @keyframes dash { to { stroke-dashoffset: -16; } }
                      .transition-obj { transition: all 0.3s ease; }
                    `}
                  </style>
                </defs>

                {/* --- CONNECTIONS --- */}
                
                {/* Earthing (Green) */}
                <g stroke="#16a34a" strokeWidth="1.5" fill="none" strokeDasharray="4,4" opacity={activeId === 'earthing' || activeId === null ? 0.6 : 0.2}>
                   <path d="M140,240 L140,450 L420,450" /> {/* From Panels */}
                   <path d="M420,330 L420,450" /> {/* From Inverter */}
                   <path d="M40,190 L40,450 L420,450" /> {/* From LA (Adjusted height) */}
                </g>

                {/* DC Wiring (Red) */}
                <g opacity={getOpacity('dc_cable')} 
                   onMouseEnter={() => setActiveId('dc_cable')} 
                   onMouseLeave={() => setActiveId(null)}
                   className="cursor-pointer transition-obj"
                >
                  <path d="M230,140 L320,140 L320,210" fill="none" stroke="#ef4444" strokeWidth={getStrokeWidth('dc_cable')} />
                  <path d="M380,260 L420,260 L420,230" fill="none" stroke="#ef4444" strokeWidth={getStrokeWidth('dc_cable')} />
                  {showFlow && (
                    <>
                      <path d="M230,140 L320,140 L320,210" fill="none" stroke="#fee2e2" strokeWidth="2" className="flow-line" />
                      <path d="M380,260 L420,260 L420,230" fill="none" stroke="#fee2e2" strokeWidth="2" className="flow-line" />
                    </>
                  )}
                </g>

                {/* AC Wiring (Black) */}
                <g opacity={getOpacity('ac_cable')}
                   onMouseEnter={() => setActiveId('ac_cable')} 
                   onMouseLeave={() => setActiveId(null)}
                   className="cursor-pointer transition-obj"
                >
                  <path d="M470,260 L580,260" fill="none" stroke="#1e293b" strokeWidth={getStrokeWidth('ac_cable')} />
                  <path d="M660,260 L750,260" fill="none" stroke="#1e293b" strokeWidth={getStrokeWidth('ac_cable')} />
                   {showFlow && (
                    <>
                      <path d="M470,260 L580,260" fill="none" stroke="#94a3b8" strokeWidth="2" className="flow-line" />
                      <path d="M660,260 L750,260" fill="none" stroke="#94a3b8" strokeWidth="2" className="flow-line" />
                    </>
                  )}
                </g>

                {/* --- COMPONENTS --- */}

                {/* 1. Solar Panels (Dynamic Visuals) */}
                <g transform="translate(60, 80)"
                   opacity={getOpacity('solar')}
                   onMouseEnter={() => setActiveId('solar')}
                   onMouseLeave={() => setActiveId(null)}
                   className="cursor-pointer transition-obj"
                >
                   {/* Structure */}
                   <path d="M20,130 L20,180 M150,130 L150,180" stroke="#94a3b8" strokeWidth="6" />
                   <rect x="10" y="175" width="150" height="8" fill="#64748b" rx="2" />

                   {/* Panels */}
                   <g transform="skewY(-5)" filter={getFilter('solar')}>
                      <rect x="0" y="0" width="170" height="130" fill="url(#panelGradient)" rx="2" stroke={currentPanel.gridColor} strokeWidth="2"/>
                      <rect x="0" y="0" width="170" height="130" fill="url(#gridPattern)" rx="2"/>
                      {/* Busbars / Frames */}
                      <line x1="56" y1="0" x2="56" y2="130" stroke={currentPanel.gridColor} strokeOpacity="0.5" strokeWidth="1" />
                      <line x1="113" y1="0" x2="113" y2="130" stroke={currentPanel.gridColor} strokeOpacity="0.5" strokeWidth="1" />
                   </g>

                   {/* Labels */}
                   <text x="10" y="205" fontSize="12" fontWeight="bold" fill="#1e3a8a">{currentPanel.name}</text>
                   <text x="10" y="220" fontSize="10" fill="#475569">{currentPanel.wattage} x 6</text>
                   <text x="120" y="190" fontSize="10" fill={currentPanel.brand === 'Adani' ? '#0369a1' : '#0f766e'} fontWeight="bold">{currentPanel.efficiency}</text>
                </g>

                {/* 2. Inverter (Dynamic Label) */}
                <g transform="translate(420, 180)"
                   opacity={getOpacity('inverter')}
                   filter={getFilter('inverter')}
                   onMouseEnter={() => setActiveId('inverter')}
                   onMouseLeave={() => setActiveId(null)}
                   className="cursor-pointer transition-obj"
                >
                  <rect x="-20" y="0" width="90" height="130" fill="url(#inverterGradient)" rx="6" stroke="#334155" strokeWidth="2"/>
                  <rect x="-5" y="20" width="60" height="30" fill="#022c22" rx="2" />
                  <text x="25" y="40" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="#4ade80">
                    {showFlow ? currentInverter.capacity : 'OFF'}
                  </text>
                  <circle cx="25" cy="80" r="12" stroke="#38bdf8" strokeWidth="2" fill="none"/>
                  <path d="M18,80 Q25,70 32,80" fill="none" stroke="#38bdf8" strokeWidth="2" />
                  <text x="25" y="150" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">Inverter</text>
                </g>

                {/* 9. Lightning Arrestor */}
                <g transform="translate(30, 30)" opacity={getOpacity('la')} filter={getFilter('la')} onMouseEnter={() => setActiveId('la')} onMouseLeave={() => setActiveId(null)} className="cursor-pointer">
                  <line x1="10" y1="0" x2="10" y2="160" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
                  <path d="M10,-5 L0,15 L20,15 Z" fill="#f59e0b" />
                  <path d="M18,0 L25,-10 L22,5 L30,0" fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="10" cy="160" r="4" fill="#78350f" />
                  <text x="25" y="30" fontSize="12" fontWeight="bold" fill="#b45309">Lightning</text>
                  <text x="25" y="45" fontSize="12" fontWeight="bold" fill="#b45309">Arrestor</text>
                </g>

                <g transform="translate(320, 210)" opacity={getOpacity('dcdb')} filter={getFilter('dcdb')} onMouseEnter={() => setActiveId('dcdb')} onMouseLeave={() => setActiveId(null)}>
                  <rect x="0" y="0" width="60" height="80" fill="#f8fafc" stroke="#475569" strokeWidth="2" rx="4" />
                  <text x="30" y="-10" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155">DCDB</text>
                  <rect x="25" y="40" width="10" height="20" fill="#ef4444" rx="1"/>
                </g>

                <g transform="translate(580, 210)" opacity={getOpacity('acdb')} filter={getFilter('acdb')} onMouseEnter={() => setActiveId('acdb')} onMouseLeave={() => setActiveId(null)}>
                  <rect x="0" y="0" width="80" height="100" fill="#f8fafc" stroke="#475569" strokeWidth="2" rx="4" />
                  <text x="40" y="27" fontSize="8" textAnchor="middle" fill="#64748b">METER</text>
                  <text x="40" y="-10" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#334155">ACDB</text>
                  <rect x="55" y="50" width="10" height="20" fill="#22c55e" rx="1"/>
                </g>

                <g transform="translate(750, 120)">
                   <rect x="40" y="0" width="10" height="250" fill="#64748b" />
                   <rect x="10" y="20" width="70" height="5" fill="#475569" rx="2" />
                   <circle cx="15" cy="15" r="4" fill="#b45309" />
                   <circle cx="75" cy="15" r="4" fill="#b45309" />
                   <path d="M0,130 Q45,150 90,130" fill="none" stroke="#1e293b" strokeWidth="2" />
                   <text x="45" y="270" textAnchor="middle" fontWeight="bold" fill="#475569">Grid</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT/BOTTOM: Interactive BOM Table (12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-blue-600" />
               System Bill of Materials
             </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b">S.N</th>
                  <th className="p-4 font-semibold border-b">Component</th>
                  <th className="p-4 font-semibold border-b">Specification</th>
                  <th className="p-4 font-semibold border-b">Description</th>
                  <th className="p-4 font-semibold border-b">Qty</th>
                  <th className="p-4 font-semibold border-b">Make</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {systemData.map((item) => (
                  <tr 
                    key={item.id}
                    onMouseEnter={() => setActiveId(item.id)}
                    onMouseLeave={() => setActiveId(null)}
                    className={`
                      transition-all duration-200 cursor-pointer border-b border-slate-50 last:border-0
                      ${activeId === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}
                    `}
                  >
                    <td className="p-3 font-medium text-slate-500">{item.sn}</td>
                    <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                      {item.icon}
                      {item.component}
                    </td>
                    <td className="p-3 text-blue-700 font-medium bg-blue-50/50 rounded-lg">
                      {item.spec}
                    </td>
                    <td className="p-3 text-slate-500 text-xs md:text-sm max-w-xs">{item.desc}</td>
                    <td className="p-3 font-mono text-xs">{item.qty}</td>
                    <td className="p-3 text-slate-700">{item.make}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      <footer className="max-w-6xl mx-auto mt-8 text-center text-slate-400 text-xs">
        <p>Designed for Solar Configuration & Visualization</p>
      </footer>
 <Footer />
    </div>
  );
};

export default SolarDiagram;







