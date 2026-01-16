/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// import Navbar
// import Footer
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUpDown,
  Search,
  Building2,
  TrendingUp,
  DollarSign,
  Battery,
  CheckCircle,
  Lock,
  Leaf,
  Zap,
  LucideIcon,
} from "lucide-react"
import UniversalQuoteForm from "@/components/forms/UniversalQuoteForm"
import { supabase } from "@/integrations/supabase/client"
import heroImage from "@/assets/factory-businessmen-doing-sales-presentation-shareholders.jpg"
import Link from "next/link"

// Interface for a solar system product to ensure type safety across the component.
interface SolarSystem {
  slNo: number
  systemSize: number
  noOfModules: number
  inverterCapacity: number
  phase: string
  monthlyGeneration: number
  roofAreaRequired: number
  shortRailTinShedPricePerWatt: number
  shortRailTinShedPrice: number
  hdgElevatedRccPricePerWatt: number
  hdgElevatedRccPrice: number
  preGiMmsPricePerWatt: number
  preGiMmsPrice: number
  priceWithoutMmsPricePerWatt: number
  priceWithoutMmsPrice: number
  monthlySavings: number
  paybackPeriod: string
  co2Reduction: string
}

// Reusable Card Component for Benefits Sections
const BenefitCard = ({ title, description, Icon }: { title: string; description: string; Icon: LucideIcon }) => (
  <motion.div
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-t-4 border-blue-500"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    role="article"
  >
    <div className="flex items-center mb-4">
      <Icon className="h-10 w-10 text-blue-600" />
      <h3 className="text-xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
)

// Reusable Checklist Item Component
const ChecklistItem = ({ text }: { text: string }) => (
  <div className="flex items-center mb-3">
    <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
    <p className="text-gray-600">{text}</p>
  </div>
)

// Components for pricing tables
function RelianceCommercialTable({ data, onRowClick }: { data: SolarSystem[]; onRowClick: (product: SolarSystem, mountingType: string) => void }) {
  const [sortField, setSortField] = useState<keyof SolarSystem | null>("systemSize")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field: keyof SolarSystem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedData = data
    .filter(
      (item) =>
        item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.systemSize.toString().includes(searchTerm) ||
        item.slNo.toString().includes(searchTerm),
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })

  // Reusable button for the table cells
  const QuoteButton = ({ item, mountingType }: { item: SolarSystem; mountingType: string }) => (
    <Button
      onClick={() => onRowClick(item, mountingType)}
      size="sm"
      variant="default"
      className="bg-black hover:bg-gray-800 text-white w-full text-xs mt-2"
    >
      Get Quote
    </Button>
  );

  return (
    <div className="space-y-4 pt-16">
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
                  System Size (kWp)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">No of Modules</TableHead>
              <TableHead className="font-semibold">Inverter (kW)</TableHead>
              <TableHead className="font-semibold">Phase</TableHead>
              <TableHead className="font-semibold">Monthly Generation (kWh)</TableHead>
              <TableHead className="font-semibold">Roof Area (sq ft)</TableHead>
              <TableHead className="font-semibold text-center">Tin Shed (â‚¹)</TableHead>
              <TableHead className="font-semibold text-center">RCC Elevated (â‚¹)</TableHead>
              <TableHead className="font-semibold text-center">Pre GI MMS (â‚¹)</TableHead>
              <TableHead className="font-semibold text-center">Without MMS (â‚¹)</TableHead>
              <TableHead className="font-semibold">Monthly Savings (â‚¹)</TableHead>
              <TableHead className="font-semibold">Payback (Years)</TableHead>
              <TableHead className="font-semibold">COâ‚‚ Reduction (tons/year)</TableHead>
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
                  <Badge variant="secondary" className="text-xs">
                    {item.phase}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {item.monthlyGeneration.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>{item.roofAreaRequired.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-center">
                  <div className="font-bold text-green-600">â‚¹{item.shortRailTinShedPrice.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-gray-500">â‚¹{item.shortRailTinShedPricePerWatt.toFixed(2)}/W</div>
                  <QuoteButton item={item} mountingType="Tin Shed" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-bold text-green-600">â‚¹{item.hdgElevatedRccPrice.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-gray-500">â‚¹{item.hdgElevatedRccPricePerWatt.toFixed(2)}/W</div>
                  <QuoteButton item={item} mountingType="RCC Elevated" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-bold text-green-600">â‚¹{item.preGiMmsPrice.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-gray-500">â‚¹{item.preGiMmsPricePerWatt.toFixed(2)}/W</div>
                  <QuoteButton item={item} mountingType="Pre GI MMS" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-bold text-green-600">â‚¹{item.priceWithoutMmsPrice.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-gray-500">â‚¹{item.priceWithoutMmsPricePerWatt.toFixed(2)}/W</div>
                  <QuoteButton item={item} mountingType="Without MMS" />
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  â‚¹{item.monthlySavings.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="font-medium text-blue-600">{item.paybackPeriod}</TableCell>
                <TableCell className="font-medium text-green-600">{item.co2Reduction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No systems found matching your search criteria.</div>
      )}
    </div>
  )
}

// Price Comparison Component
function PriceComparison({ data }: { data: SolarSystem[] }) {
  const [selectedSize, setSelectedSize] = useState<number>(100.0)

  const nearest = (arr: SolarSystem[], size: number) => {
    if (!arr || arr.length === 0) return null
    return arr.reduce((prev, curr) =>
      (Math.abs(curr.systemSize - size) < Math.abs(prev.systemSize - size) ? curr : prev)
    );
  }

  const relianceSystem = nearest(data, selectedSize)
  const pricePerWatt = relianceSystem?.shortRailTinShedPricePerWatt ?? 0
  const totalPrice = relianceSystem?.shortRailTinShedPrice ?? 0

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Commercial Price Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare indicative prices for various commercial system sizes from Reliance Solar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="system-size-select" className="text-sm font-medium text-gray-700 mb-2 block">Select System Size (kWp):</label>
            <select
              id="system-size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={25.0}>~25 kWp</option>
              <option value={50.0}>~50 kWp</option>
              <option value={100.0}>~100 kWp</option>
              <option value={250.0}>~250 kWp</option>
              <option value={500.0}>~500 kWp</option>
              <option value={1000.0}>~1000 kWp</option>
            </select>
          </div>

          {relianceSystem && (
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-6 w-auto" />
                <h4 className="font-semibold text-gray-900">Reliance Solar</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>System Size:</span>
                  <span className="font-medium">{relianceSystem.systemSize} kWp</span>
                </div>
                <div className="flex justify-between">
                  <span>Price/Watt (Tin Shed):</span>
                  <span className="font-medium">â‚¹{pricePerWatt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Price (Tin Shed):</span>
                  <span className="font-bold text-green-600">â‚¹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Savings:</span>
                  <span className="font-medium text-green-600">
                    â‚¹{relianceSystem.monthlySavings.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payback Period:</span>
                  <span className="font-medium text-blue-600">{relianceSystem.paybackPeriod} years</span>
                </div>
                <div className="flex justify-between">
                  <span>COâ‚‚ Reduction:</span>
                  <span className="font-medium text-green-600">{relianceSystem.co2Reduction} tons/year</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Template for creating a custom quote request.
const customQuoteTemplate: Omit<SolarSystem, 'slNo'> = {
  systemSize: 0,
  noOfModules: 0,
  inverterCapacity: 0,
  phase: "Three",
  monthlyGeneration: 0,
  roofAreaRequired: 0,
  shortRailTinShedPricePerWatt: 0,
  shortRailTinShedPrice: 0,
  hdgElevatedRccPricePerWatt: 0,
  hdgElevatedRccPrice: 0,
  preGiMmsPricePerWatt: 0,
  preGiMmsPrice: 0,
  priceWithoutMmsPricePerWatt: 0,
  priceWithoutMmsPrice: 0,
  monthlySavings: 0,
  paybackPeriod: "N/A",
  co2Reduction: "N/A",
}

// Main Component
export default function CommercialIndustrial() {
  const [isRelianceFormOpen, setIsRelianceFormOpen] = useState(false)
  const [selectedRelianceProduct, setSelectedRelianceProduct] = useState<SolarSystem | null>(null)
  const [selectedMountingType, setSelectedMountingType] = useState<string>("")
  const [rows, setRows] = useState<SolarSystem[]>([])
  const [companyName, setCompanyName] = useState<string>('Reliance Solar')
  const [maxSystemSize, setMaxSystemSize] = useState<number>(0)

  useEffect(() => {
    const computeDerived = (systemSizeKWp: number, totalPrice: number) => {
      const monthlyGeneration = Math.round(systemSizeKWp * 4.5 * 30)
      const roofAreaRequired = Math.round(systemSizeKWp * 90)
      const tariff = 8
      const monthlySavings = Math.round(monthlyGeneration * tariff)
      const paybackPeriod = monthlySavings > 0 ? (totalPrice / (monthlySavings * 12)).toFixed(1) : 'N/A'
      const co2Reduction = (systemSizeKWp * 1.2).toFixed(1)
      return { monthlyGeneration, roofAreaRequired, monthlySavings, paybackPeriod, co2Reduction }
    }

    const load = async () => {
      const { data } = await supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true })
      if (data) {
        const processedRows = data.map((r: any): SolarSystem => {
          const systemSize = Number(r.system_size_kwp)
          // Note: Calculations are based on the 'Tin Shed' price as a default reference.
          const d = computeDerived(systemSize, Number(r.short_rail_tin_shed_price))
          return {
            slNo: r.sl_no,
            systemSize: systemSize,
            noOfModules: r.no_of_modules,
            inverterCapacity: Number(r.inverter_capacity),
            phase: r.phase,
            monthlyGeneration: d.monthlyGeneration,
            roofAreaRequired: d.roofAreaRequired,
            shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt),
            shortRailTinShedPrice: Number(r.short_rail_tin_shed_price),
            hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt),
            hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price),
            preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt),
            preGiMmsPrice: Number(r.pre_gi_mms_price),
            priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt),
            priceWithoutMmsPrice: Number(r.price_without_mms_price),
            monthlySavings: d.monthlySavings,
            paybackPeriod: d.paybackPeriod,
            co2Reduction: d.co2Reduction,
          }
        });
        setRows(processedRows);
        if (processedRows.length > 0) {
          const max = Math.max(...processedRows.map(r => r.systemSize));
          setMaxSystemSize(max);
        }
      }
      const { data: rcfg } = await supabase.from('reliance_system_config').select('*')
      if (rcfg) {
        const m = Object.fromEntries(rcfg.map((c: any) => [c.key, c.value]))
        if (m['COMPANY_NAME']) setCompanyName(m['COMPANY_NAME'])
      }
    }
    load()
  }, [])

  const handleRelianceRowClick = (product: SolarSystem, mountingType: string) => {
    setSelectedRelianceProduct(product)
    setSelectedMountingType(mountingType)
    setIsRelianceFormOpen(true)
  }

  // Data for Why Choose Commercial Solar
  const whyChooseCommercialSolar = [
    { title: "Reduce Operating Costs", description: "Significantly lower your business electricity expenses and improve profit margins.", Icon: DollarSign },
    { title: "Energy Independence", description: "Protect your business from rising energy costs with predictable solar power.", Icon: Lock },
    { title: "Sustainability Goals", description: "Meet corporate sustainability targets and enhance your brand reputation.", Icon: Leaf },
    { title: "Tax Benefits", description: "Take advantage of accelerated depreciation and government incentives.", Icon: Building2 },
  ]

  // Data for Commercial Solar Offerings
  const commercialSolarOfferings = [
    { title: "Large Scale Systems", description: "25kW to 1MW+ systems for commercial and industrial facilities.", Icon: Battery },
    { title: "Grid Integration", description: "Three-phase systems with advanced grid integration capabilities.", Icon: Zap },
    { title: "Monitoring & Analytics", description: "Real-time monitoring and performance analytics for optimal efficiency.", Icon: TrendingUp },
    { title: "Maintenance Support", description: "Comprehensive O&M services for maximum system uptime.", Icon: Building2 },
  ]

  // Data for What's Included
  const whatsIncluded = [
    "Detailed site assessment and energy audit",
    "Custom system design and engineering",
    "High-efficiency solar modules and inverters",
    "Mounting structures and electrical components",
    "Grid synchronization and net metering setup",
    "Comprehensive monitoring and analytics platform",
    "25-year performance warranty and O&M support",
  ]

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[70vh] pt-20"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Commercial & Industrial Solar Solutions
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
              Power your business with scalable solar energy solutions. Reduce
              costs, achieve sustainability goals, and gain energy independence.
            </p>
            <a
              href="#pricing"
              className="inline-block bg-blue-500 text-white py-3 px-8 rounded-full hover:bg-blue-600 transition font-semibold"
            >
              Get Commercial Quote
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Commercial Solar Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Why Choose Commercial Solar?
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Transform your business operations with clean energy and significant cost savings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseCommercialSolar.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Commercial Solar Offerings Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Enterprise Solar Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {commercialSolarOfferings.map((offering, index) => (
              <BenefitCard key={index} {...offering} />
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enterprise Features</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Tier-1 commercial-grade PV modules (Mono PERC / HJT)</li>
              <li>Industrial string inverters with SCADA integration</li>
              <li>Advanced monitoring and analytics platforms</li>
              <li>Comprehensive O&M and performance guarantees</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            What's Included in Our Commercial Installation?
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
            {whatsIncluded.map((item, index) => (
              <ChecklistItem key={index} text={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison Tool */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <PriceComparison data={rows} />
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Commercial Solar Solutions
          </h2>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-5 w-auto" />
                {companyName} - Commercial Solar Systems
              </CardTitle>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-sm">Non DCR RIL 690 Wp HJT Modules</Badge>
                <Badge variant="secondary" className="text-sm">String Inverter Included</Badge>
                <Badge variant="secondary" className="text-sm">Excluding GST & Net Metering</Badge>
                <Badge variant="secondary" className="text-sm">Price Without MMS NOC Required</Badge>
              </div>
              <CardDescription>
                Non DCR RIL 690 Wp HJT Solar Modules (Excluding GST & Net Metering) - Price Without MMS NOC Required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RelianceCommercialTable data={rows} onRowClick={handleRelianceRowClick} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How We Work (Commercial Theme) */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm text-blue-700 border border-blue-200">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-4">
              Simple. Fast. Reliable.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four streamlined steps to deliver commercial and industrial solar with speed and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Consultation</h3>
                  <p className="text-gray-600">We review your site, loads and targets to propose the optimal system footprint and connection architecture.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Custom Design</h3>
                  <p className="text-gray-600">Engineering-led system design with clear BOM, yield estimate, and mounting configuration for your facility.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Professional Installation</h3>
                  <p className="text-gray-600">Planned execution with safety compliance, quality checks, and timeline accountability.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Monitoring & Support</h3>
                  <p className="text-gray-600">Ongoing performance monitoring with proactive support to keep generation on target.</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Need a Custom Commercial Solution?</h3>
                <p className="text-gray-600">
                  Every business has unique energy requirements. Our experts can design a custom solar solution based on
                  your facility size, energy consumption, and operational needs.
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <Button
                    variant="outline"
                    className="border-gray-400 text-gray-700 hover:bg-gray-200 bg-transparent"
                    onClick={() => {
                      const customProduct = {
                        ...customQuoteTemplate,
                        slNo: 0,
                        systemSize: maxSystemSize || 165.6, // Use calculated max size or fallback
                      };
                      handleRelianceRowClick(customProduct, "Custom");
                    }}
                  >
                    Get Reliance Solar Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 px-4 md:px-8 bg-blue-600 text-white text-center">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Ready to Power Your Business with Solar?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Non DCR RIL 690 Wp HJT Solar Modules (Complete System Package - Excluding GST & Net Metering)
          </p>
          <Link href="/get-quote"><Button className="bg-white text-blue-600 hover:bg-gray-100">Request Commercial Energy Audit</Button></Link>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-8 pb-8 bg-white">
        <p>
          All prices include GST and are subject to change. Actual savings may vary based on location, usage patterns,
          and system performance.
        </p>
        <p className="mt-2">
          Monthly generation estimates are based on 4.5 peak sun hours. Actual generation may vary based on weather
          conditions and system maintenance.
        </p>
      </div>

      {/* Quote Form Dialogs */}
      <UniversalQuoteForm
        open={isRelianceFormOpen}
        onOpenChange={setIsRelianceFormOpen}
        category="Reliance"
        productDetails={
          selectedRelianceProduct ? {
            name: selectedRelianceProduct.systemSize === 0
              ? "Custom Reliance Solar Commercial Solution"
              : `${selectedRelianceProduct.systemSize} kWp Reliance Commercial Solar System`,
            systemSize: selectedRelianceProduct.systemSize,
            description: selectedRelianceProduct.systemSize === 0
              ? "Large scale commercial project"
              : `Mounting: ${selectedMountingType} | Modules: ${selectedRelianceProduct.noOfModules}`,
            mountingType: selectedMountingType
          } : undefined
        }
        config={{
          title: "Get Commercial Solar Quote",
          description: "Request a detailed proposal for your business."
        }}
      />

    </div>
  )
}

