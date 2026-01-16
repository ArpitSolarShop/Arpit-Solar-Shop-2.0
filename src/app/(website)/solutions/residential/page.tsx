/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// import Navbar
// import Footer
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, Search, Home, Sun, TrendingUp, DollarSign, Battery, CheckCircle, Lock, LucideIcon } from "lucide-react";
import UniversalQuoteForm, { QuoteCategory } from "@/components/forms/UniversalQuoteForm";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/asian-women-working-hard-together-innovation.jpg";
import Link from "next/link";

// Interface for a residential solar system to ensure type safety.
interface ResidentialSystem {
  slNo: number;
  systemSize: number;
  noOfModules: number;
  inverterCapacity: number;
  phase: "Single" | "Three";
  pricePerWatt: number;
  totalPrice: number;
  monthlyGeneration: number;
  roofAreaRequired: number;
  monthlySavings: number;
  paybackPeriod: string;
}

// Reusable Card Component for Benefits Sections
const BenefitCard = ({ title, description, Icon }: { title: string; description: string; Icon: LucideIcon }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-green-500"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    role="article"
  >
    <div className="flex items-center mb-4">
      <Icon className="h-10 w-10 text-green-600" />
      <h3 className="text-xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

// Reusable Checklist Item Component
const ChecklistItem = ({ text }: { text: string }) => (
  <div className="flex items-center mb-3">
    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
    <p className="text-gray-600">{text}</p>
  </div>
);

// A single, reusable table component for all products.
function ResidentialSolarTable({ data, onRowClick }: { data: ResidentialSystem[]; onRowClick: (product: ResidentialSystem) => void }) {
  const [sortField, setSortField] = useState<keyof ResidentialSystem | null>("systemSize");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (field: keyof ResidentialSystem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = data
    .filter(
      (item) =>
        item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.systemSize.toString().includes(searchTerm) ||
        item.slNo.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by phase, system size, or serial number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Sl No.</TableHead>
              <TableHead className="font-semibold">
                <Button variant="ghost" onClick={() => handleSort("systemSize")} className="h-auto p-0 font-semibold">
                  System Size (kWp) <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">No of Modules</TableHead>
              <TableHead className="font-semibold">Inverter (kW)</TableHead>
              <TableHead className="font-semibold">Phase</TableHead>
              <TableHead className="font-semibold">Monthly Generation (kWh)</TableHead>
              <TableHead className="font-semibold">Roof Area (sq ft)</TableHead>
              <TableHead className="font-semibold">
                <Button variant="ghost" onClick={() => handleSort("pricePerWatt")} className="h-auto p-0 font-semibold">
                  Price/Watt (â‚¹) <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">
                <Button variant="ghost" onClick={() => handleSort("totalPrice")} className="h-auto p-0 font-semibold">
                  Total Price (â‚¹) <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">Monthly Savings (â‚¹)</TableHead>
              <TableHead className="font-semibold">Payback (Years)</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((item) => (
              <TableRow key={item.slNo} className="hover:bg-gray-50">
                <TableCell className="font-medium">{item.slNo}</TableCell>
                <TableCell className="font-medium text-blue-600">{item.systemSize}</TableCell>
                <TableCell>{item.noOfModules}</TableCell>
                <TableCell>{item.inverterCapacity}</TableCell>
                <TableCell>
                  <Badge variant={item.phase === "Single" ? "default" : "secondary"} className="text-xs">
                    {item.phase}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-green-600">{item.monthlyGeneration}</TableCell>
                <TableCell>{item.roofAreaRequired}</TableCell>
                <TableCell className="font-medium">â‚¹{item.pricePerWatt.toFixed(2)}</TableCell>
                <TableCell className="font-bold text-green-600">â‚¹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-medium text-green-600">â‚¹{item.monthlySavings.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-medium text-blue-600">{item.paybackPeriod}</TableCell>
                <TableCell>
                  <Button onClick={() => onRowClick(item)} size="sm" className="bg-black hover:bg-gray-800 text-white">
                    Get Quote
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No systems found matching your search criteria.</div>
      )}
    </div>
  );
}

// Price Comparison Component
function PriceComparison({ dataShakti, dataReliance, dataTata }: { dataShakti: ResidentialSystem[]; dataReliance: ResidentialSystem[]; dataTata: ResidentialSystem[] }) {
  const [availableSizes, setAvailableSizes] = useState<number[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  useEffect(() => {
    const allSizes = [
      ...dataShakti.map(s => s.systemSize),
      ...dataReliance.map(s => s.systemSize),
      ...dataTata.map(s => s.systemSize)
    ];

    const uniqueSortedSizes = [...new Set(allSizes)].sort((a, b) => a - b);

    setAvailableSizes(uniqueSortedSizes);

    if (uniqueSortedSizes.length > 0) {
      if (selectedSize === null || !uniqueSortedSizes.includes(selectedSize)) {
        const defaultSize = uniqueSortedSizes.find(s => s >= 5) || uniqueSortedSizes[0];
        setSelectedSize(defaultSize);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShakti, dataReliance, dataTata]);

  const nearest = (arr: ResidentialSystem[], size: number | null) => {
    if (size === null || !arr || arr.length === 0) return null;
    return arr.reduce((prev, curr) =>
      Math.abs(curr.systemSize - size) < Math.abs(prev.systemSize - size) ? curr : prev
    );
  };

  const shaktiSystem = nearest(dataShakti, selectedSize);
  const relianceSystem = nearest(dataReliance, selectedSize);
  const tataSystem = nearest(dataTata, selectedSize);

  const systemsToCompare = [
    { brand: 'Shakti Solar', logo: '/Shakti Solar.png', data: shaktiSystem },
    { brand: 'Reliance Solar', logo: '/reliance-industries-ltd.png', data: relianceSystem },
    { brand: 'Tata Power Solar', logo: '/Tata Power Solar.png', data: tataSystem }
  ].filter(s => s.data);

  let bestValue = null;
  if (systemsToCompare.length > 0) {
    bestValue = systemsToCompare.reduce((prev, curr) => (curr.data!.totalPrice < prev.data!.totalPrice ? curr : prev));
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="h-5 w-5 text-blue-600" /> Price Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare prices between top solar brands for similar system sizes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="system-size-select" className="text-sm font-medium text-gray-700 mb-2 block">Select System Size (kWp):</label>
            <select
              id="system-size-select"
              value={selectedSize ?? ''}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={availableSizes.length === 0}
            >
              {availableSizes.map(size => (
                <option key={size} value={size}>
                  {size} kWp
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {systemsToCompare.map(({ brand, logo, data }) => data && (
              <div key={brand} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <img src={logo} alt={brand} className="h-6 w-auto" />
                  <h4 className="font-semibold text-gray-900">{brand}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>System Size:</span><span className="font-medium">{data.systemSize} kWp</span></div>
                  <div className="flex justify-between"><span>Price/Watt:</span><span className="font-medium">â‚¹{data.pricePerWatt.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total Price:</span><span className="font-bold text-green-600">â‚¹{data.totalPrice.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>Monthly Savings:</span><span className="font-medium text-green-600">â‚¹{data.monthlySavings.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span>Payback Period:</span><span className="font-medium text-blue-600">{data.paybackPeriod} years</span></div>
                </div>
              </div>
            ))}
          </div>

          {bestValue && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <h5 className="font-semibold text-gray-900 mb-2">Analysis:</h5>
              <div className="text-sm space-y-1">
                <div className="flex justify-between items-center">
                  <span>Best Value (for selected size):</span>
                  <div className="flex items-center gap-2">
                    <img src={bestValue.logo} alt={bestValue.brand} className="h-4 w-auto" />
                    <span className="font-bold text-blue-600">{bestValue.brand}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Lowest Price:</span>
                  <span className="font-bold text-green-600">
                    â‚¹{bestValue.data!.totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Template for creating a custom quote request to avoid duplicate code.
const customQuoteTemplate: Omit<ResidentialSystem, "slNo"> = {
  systemSize: 0,
  noOfModules: 0,
  inverterCapacity: 0,
  phase: "Single",
  pricePerWatt: 0,
  totalPrice: 0,
  monthlyGeneration: 0,
  roofAreaRequired: 0,
  monthlySavings: 0,
  paybackPeriod: "N/A",
};

// Main Component
export default function Residential() {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory>("Generic");
  const [selectedProduct, setSelectedProduct] = useState<ResidentialSystem | null>(null);

  const [shaktiRows, setShaktiRows] = useState<ResidentialSystem[]>([]);
  const [relianceRows, setRelianceRows] = useState<ResidentialSystem[]>([]);
  const [tataRows, setTataRows] = useState<ResidentialSystem[]>([]);

  const [shaktiCompanyName, setShaktiCompanyName] = useState('Shakti Solar');
  const [shaktiProductDesc, setShaktiProductDesc] = useState('DCR RIL 535 Wp Modules with String Inverter');
  const [shaktiWorkScope, setShaktiWorkScope] = useState('Complete Work Excluding Civil Material');
  const [relianceCompanyName, setRelianceCompanyName] = useState('Reliance Solar');
  const [relianceProductDesc, setRelianceProductDesc] = useState('RIL 690-720 Wp HJT Solar Modules');
  const [relianceWorkScope, setRelianceWorkScope] = useState('Complete System Package');
  const [tataCompanyName, setTataCompanyName] = useState('Tata Power Solar');
  const [tataProductDesc, setTataProductDesc] = useState('');
  const [tataWorkScope, setTataWorkScope] = useState('');

  useEffect(() => {
    const computeDerived = (systemSize: number, totalPrice: number) => {
      const monthlyGeneration = Math.round(systemSize * 4.5 * 30);
      const roofAreaRequired = Math.round(systemSize * 100);
      const tariff = 8;
      const monthlySavings = Math.round(monthlyGeneration * tariff);
      const paybackPeriod = monthlySavings > 0 ? (totalPrice / (monthlySavings * 12)).toFixed(1) : 'N/A';
      return { monthlyGeneration, roofAreaRequired, monthlySavings, paybackPeriod };
    };

    const loadData = async () => {
      // Fetch Shakti Data
      const { data: shakti } = await supabase.from('shakti_grid_tie_systems').select('*').order('sl_no', { ascending: true });
      if (shakti) {
        setShaktiRows(shakti.map((r: any): ResidentialSystem => {
          const systemSize = Number(r.system_size);
          const totalPrice = Number(r.pre_gi_elevated_price);
          const d = computeDerived(systemSize, totalPrice);
          return {
            slNo: r.sl_no, systemSize, totalPrice, noOfModules: r.no_of_modules,
            inverterCapacity: Number(r.inverter_capacity), phase: r.phase,
            pricePerWatt: Number(r.pre_gi_elevated_with_gst), ...d,
          };
        }));
      }

      // Fetch Reliance Data
      const { data: rel } = await supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true });
      if (rel) {
        setRelianceRows(rel.map((r: any): ResidentialSystem => {
          const systemSize = Number(r.system_size);
          const totalPrice = Number(r.hdg_elevated_price);
          const d = computeDerived(systemSize, totalPrice);
          return {
            slNo: r.sl_no, systemSize, totalPrice, noOfModules: r.no_of_modules,
            inverterCapacity: Number(r.inverter_capacity), phase: r.phase,
            pricePerWatt: Number(r.price_per_watt), ...d,
          };
        }));
      }

      // Fetch Tata Data
      const { data: tata } = await supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true });
      if (tata) {
        setTataRows(tata.map((r: any): ResidentialSystem => {
          const systemSize = Number(r.system_size);
          const totalPrice = Number(r.total_price);
          const d = computeDerived(systemSize, totalPrice);
          return {
            slNo: r.sl_no,
            systemSize,
            totalPrice,
            noOfModules: r.no_of_modules,
            inverterCapacity: Number(r.inverter_capacity) || Number(r.system_size),
            phase: r.phase,
            pricePerWatt: totalPrice > 0 && systemSize > 0 ? totalPrice / (systemSize * 1000) : 0,
            ...d,
          };
        }));
      }

      // Fetch Config Data
      const { data: scfg } = await supabase.from('shakti_config').select('*');
      if (scfg) {
        const m = Object.fromEntries(scfg.map((c: any) => [c.config_key, c.config_value]));
        if (m['company_name']) setShaktiCompanyName(m['company_name']);
        if (m['product_description']) setShaktiProductDesc(m['product_description']);
        if (m['work_scope']) setShaktiWorkScope(m['work_scope']);
      }
      const { data: rcfg } = await supabase.from('reliance_system_config').select('*');
      if (rcfg) {
        const m = Object.fromEntries(rcfg.map((c: any) => [c.key, c.value]));
        if (m['COMPANY_NAME']) setRelianceCompanyName(m['COMPANY_NAME']);
        if (m['PRODUCT_DESCRIPTION']) setRelianceProductDesc(m['PRODUCT_DESCRIPTION']);
        if (m['WORK_SCOPE']) setRelianceWorkScope(m['WORK_SCOPE']);
      }
      const { data: tcfg } = await supabase.from('tata_config').select('*');
      if (tcfg) {
        const m = Object.fromEntries(tcfg.map((c: any) => [c.config_key, c.config_value]));
        if (m['company_name']) setTataCompanyName(m['company_name']);
        if (m['product_description']) setTataProductDesc(m['product_description']);
        if (m['work_scope']) setTataWorkScope(m['work_scope']);
      }
    };
    loadData();
  }, []);

  const handleShaktiRowClick = (product: ResidentialSystem) => {
    setSelectedProduct(product);
    setSelectedCategory("Shakti");
    setIsFormOpen(true);
  };

  const handleRelianceRowClick = (product: ResidentialSystem) => {
    setSelectedProduct(product);
    setSelectedCategory("Reliance");
    setIsFormOpen(true);
  };

  const handleTataRowClick = (product: ResidentialSystem) => {
    setSelectedProduct(product);
    setSelectedCategory("Tata");
    setIsFormOpen(true);
  };

  const whyChooseSolar = [
    { title: "Lower Bills", description: "Drastically reduce your electricity bills with solar power.", Icon: DollarSign },
    { title: "Price Protection", description: "Protect against rising energy costs with a fixed, renewable energy source.", Icon: Lock },
    { title: "Long-Term Power", description: "Enjoy 25+ years of clean, low-maintenance power.", Icon: Sun },
    { title: "Home Value", description: "Increase your home's value and environmental contribution.", Icon: Home },
  ];

  const solarOfferings = [
    { title: "System Sizes", description: "1kW to 10kW systems for small to medium homes.", Icon: Battery },
    { title: "Phase Options", description: "Single-phase and three-phase options available.", Icon: Battery },
    { title: "Mounting Support", description: "RCC and tin shed mounting support for versatile installation.", Icon: Home },
    { title: "Net Metering", description: "Net metering ready for maximum ROI.", Icon: DollarSign },
  ];

  const whatsIncluded = [
    "Site survey and load analysis", "Custom system design", "Inverter + Solar panels + Mounting structure",
    "Wiring, safety devices, earthing", "Government net-metering support", "25-year performance warranty on panels",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[70vh] pt-20" style={{ backgroundImage: `url(${heroImage.src})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <motion.div className="text-center text-white px-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Residential Solar Solutions</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
              Power your home with clean, renewable energy. Save on bills and contribute to a sustainable future.
            </p>
            <a href="#pricing" className="inline-block bg-green-500 text-white py-3 px-8 rounded-full hover:bg-green-600 transition font-semibold">
              Get a Free Quote
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Residential Solar Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">Why Choose Residential Solar?</h2>
          <p className="text-center text-gray-600 mb-8">Visualize the power of solar: from the sun to your home's lights.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseSolar.map((benefit, index) => (<BenefitCard key={index} {...benefit} />))}
          </div>
        </div>
      </section>

      {/* Our Residential Solar Offerings Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">Tailored Solar Solutions for Every Home</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {solarOfferings.map((offering, index) => (<BenefitCard key={index} {...offering} />))}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Tier-1 PV modules (Mono PERC / HJT)</li>
              <li>BIS-certified Inverters</li>
              <li>Remote Monitoring Systems (optional)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">What's Included in Our Installation?</h2>
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
            {whatsIncluded.map((item, index) => (<ChecklistItem key={index} text={item} />))}
          </div>
        </div>
      </section>

      {/* Price Comparison Tool */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <PriceComparison dataShakti={shaktiRows} dataReliance={relianceRows} dataTata={tataRows} />
        </div>
      </section>

      {/* Company Comparison Tabs */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">Compare Solar Solutions</h2>
          <Tabs defaultValue="shakti" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="shakti" className="flex items-center gap-2">
                <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-4 w-auto" />
                <span>Shakti Solar</span>
              </TabsTrigger>
              <TabsTrigger value="reliance" className="flex items-center gap-2">
                <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-4 w-auto" />
                <span>Reliance Solar</span>
              </TabsTrigger>
              <TabsTrigger value="tata" className="flex items-center gap-2">
                <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-4 w-auto" />
                <span>Tata Power Solar</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="shakti" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-5 w-auto" />
                    {shaktiCompanyName} - Residential Solar Systems
                  </CardTitle>
                  <CardDescription>{shaktiProductDesc} ({shaktiWorkScope})</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResidentialSolarTable data={shaktiRows} onRowClick={handleShaktiRowClick} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-5 w-auto" />
                    {relianceCompanyName} - Residential Solar Systems
                  </CardTitle>
                  <CardDescription>{relianceProductDesc} ({relianceWorkScope})</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResidentialSolarTable data={relianceRows} onRowClick={handleRelianceRowClick} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tata" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-5 w-auto" />
                    {tataCompanyName} - Residential Solar Systems
                  </CardTitle>
                  <CardDescription>{tataProductDesc} ({tataWorkScope})</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResidentialSolarTable data={tataRows} onRowClick={handleTataRowClick} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How We Work (Residential Theme) */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm text-green-700 border border-green-200">How We Work</span>
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-4">Simple. Fast. Reliable.</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Four easy steps to deliver residential solar with clarity and speed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Consultation</h3>
                  <p className="text-gray-600">We evaluate your energy usage and roof conditions to propose the most effective home solar configuration.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Custom Design</h3>
                  <p className="text-gray-600">Tailored system layout with yield estimates, space planning, and phase compatibility for your residence.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Professional Installation</h3>
                  <p className="text-gray-600">Certified installers complete the setup with safety, aesthetics, and quality checks.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Monitoring & Support</h3>
                  <p className="text-gray-600">Real-time monitoring and reliable support to ensure your solar system performs as expected.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gray-100 border-gray-300">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Need a Custom Solution for Your Home?</h3>
                <p className="text-gray-600">Every home is unique. Our experts can design a custom solar solution based on your roof space, energy consumption, and budget requirements.</p>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-200 bg-transparent" onClick={() => {
                    setSelectedProduct({ ...customQuoteTemplate, slNo: 0, systemSize: 3 });
                    setSelectedCategory("Shakti");
                    setIsFormOpen(true);
                  }}>
                    Get Shakti Solar Quote
                  </Button>
                  <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-200 bg-transparent" onClick={() => {
                    setSelectedProduct({ ...customQuoteTemplate, slNo: 0, systemSize: 5 });
                    setSelectedCategory("Reliance");
                    setIsFormOpen(true);
                  }}>
                    Get Reliance Solar Quote
                  </Button>
                  <Button variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-200 bg-transparent" onClick={() => {
                    setSelectedProduct({
                      ...customQuoteTemplate,
                      slNo: 0,
                      systemSize: 4,
                    });
                    setSelectedCategory("Tata");
                    setIsFormOpen(true);
                  }}>
                    Get Tata Power Solar Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 px-4 md:px-8 bg-green-600 text-white text-center">
        <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Go Solar?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Contact us today to learn how solar energy can benefit your home. Get a free, no-obligation quote!</p>
          <Link href="/get-quote"><Button className="bg-white text-green-600 hover:bg-gray-100">Request Your Free Quote</Button></Link>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-8 pb-8 bg-white">
        <p>All prices include GST and are subject to change. Actual savings may vary based on location and usage patterns.</p>
        <p className="mt-2">Monthly generation estimates are based on 4.5 peak sun hours. Actual generation may vary based on weather conditions.</p>
      </div>

      {/* Universal Quote Form */}
      <UniversalQuoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        productDetails={
          selectedProduct ? {
            name: selectedProduct.systemSize > 0
              ? `${selectedCategory} ${selectedProduct.systemSize}kW System`
              : `Custom ${selectedCategory} System`,
            systemSize: selectedProduct.systemSize,
            price: selectedProduct.totalPrice,
            phase: selectedProduct.phase,
            description: `${selectedProduct.noOfModules} Modules | ${selectedProduct.inverterCapacity}kW Inverter`
          } : undefined
        }
        config={{
          features: ["Certified Installation", "25 Year Warranty", "Net Metering Support"]
        }}
      />


    </div>
  );
}
