// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calculator, Cable, Package, ArrowUpDown, Search, CheckCircle, Zap, Sparkles, Sun, IndianRupee, RefreshCcw, BarChart, Loader2 } from "lucide-react"
// import RelianceQuoteForm from "@/components/forms/reliance-quote-form"
// import CalculatorQuoteForm from "@/components/forms/calculator-quote-form"
// import { supabase } from "@/integrations/supabase/client"

// // --- TYPES ---
// type GridTieSystemData = {
//   slNo: number; systemSize: number; noOfModules: number; inverterCapacity: number; phase: string; hdgElevatedWithGst: number; hdgElevatedPrice: number;
// }
// type LargeSystemData = {
//   slNo: number; systemSizeKWp: number; systemSizeKW: number; noOfModules: number; inverterCapacity: number; phase: string; shortRailTinShedPricePerWatt: number; shortRailTinShedPrice: number; hdgElevatedRccPricePerWatt: number; hdgElevatedRccPrice: number; preGiMmsPricePerWatt: number; preGiMmsPrice: number; priceWithoutMmsPricePerWatt: number; priceWithoutMmsPrice: number;
// }
// type DCCableData = {
//   srNo: number; productDescription: string; uom: string; quantity: number; price: number; total: number;
// }
// type KitItem = {
//   srNo: number; item: string; description: string;
// }

// // --- DYNAMIC SOLAR QUOTE CALCULATOR ---
// interface CalculationResult {
//   userInputKw: number; numberOfPanels: number; actualSystemSizeKwp: number; inverterSizeKw: number; pricePerWatt: number; basePrice: number; gstAmount: number; totalPrice: number; estimateBasis: string;
// }
// interface SolarQuoteCalculatorProps {
//   gridData: GridTieSystemData[];
//   largeData: LargeSystemData[];
//   loading: boolean;
// }

// const SolarQuoteCalculator = ({ gridData, largeData, loading }: SolarQuoteCalculatorProps) => {
//   const [kilowattInput, setKilowattInput] = useState<string>("")
//   const [result, setResult] = useState<CalculationResult | null>(null)
//   const [error, setError] = useState<string>("")
//   const [mountingType, setMountingType] = useState<string>("rcc-elevated");
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const PANEL_WATTAGE = 710;
//   const RESIDENTIAL_THRESHOLD_KW = 10;

//   const handleCalculate = () => {
//     setError("")
//     const kw = parseFloat(kilowattInput)
//     if (isNaN(kw) || kw <= 0) {
//       setError("Please enter a valid power requirement (e.g., 5, 10.5).")
//       setResult(null); return;
//     }
//     let pricePerWatt = 0;
//     let inverterSizeKw = kw;
//     let estimateBasis = "";
//     if (kw <= RESIDENTIAL_THRESHOLD_KW) {
//       if (!gridData || gridData.length === 0) {
//         setError("Residential pricing data is not available. Cannot calculate.");
//         setResult(null); return;
//       }
//       const applicableSlabs = gridData.filter(slab => slab.systemSize <= kw);
//       let matchingSlab: GridTieSystemData;
//       if (applicableSlabs.length > 0) {
//         matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev);
//       } else {
//         matchingSlab = gridData.reduce((prev, curr) => curr.systemSize < prev.systemSize ? curr : prev);
//       }
//       pricePerWatt = matchingSlab.hdgElevatedWithGst;
//       inverterSizeKw = matchingSlab.inverterCapacity;
//       estimateBasis = `Based on ${matchingSlab.systemSize} kWp Residential price slab`;
//     } else {
//       if (!largeData || largeData.length === 0) {
//         setError("Commercial pricing data is not available. Cannot calculate.");
//         setResult(null); return;
//       }
//       const applicableSlabs = largeData.filter(slab => slab.systemSizeKWp <= kw);
//       let matchingSlab: LargeSystemData;
//       if (applicableSlabs.length > 0) {
//         matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSizeKWp > prev.systemSizeKWp ? curr : prev);
//       } else {
//         matchingSlab = largeData.reduce((prev, curr) => curr.systemSizeKWp < prev.systemSizeKWp ? curr : prev);
//       }
//       switch (mountingType) {
//         case 'tin-shed': pricePerWatt = matchingSlab.shortRailTinShedPricePerWatt; estimateBasis = `Based on Commercial (Tin Shed) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
//         case 'pre-gi-mms': pricePerWatt = matchingSlab.preGiMmsPricePerWatt; estimateBasis = `Based on Commercial (Pre GI MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
//         case 'without-mms': pricePerWatt = matchingSlab.priceWithoutMmsPricePerWatt; estimateBasis = `Based on Commercial (Without MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
//         case 'rcc-elevated': default: pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt; estimateBasis = `Based on Commercial (RCC Elevated) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
//       }
//       inverterSizeKw = matchingSlab.inverterCapacity;
//     }
//     const numberOfPanels = Math.ceil((kw * 1000) / PANEL_WATTAGE);
//     const actualSystemSizeWp = numberOfPanels * PANEL_WATTAGE;
//     const actualSystemSizeKwp = parseFloat((actualSystemSizeWp / 1000).toFixed(2));
//     const basePrice = actualSystemSizeWp * pricePerWatt;
//     const gstRate = 0.138;
//     const gstAmount = basePrice * gstRate;
//     const totalPrice = basePrice + gstAmount;
//     setResult({ userInputKw: kw, numberOfPanels, actualSystemSizeKwp, inverterSizeKw, pricePerWatt, basePrice, gstAmount, totalPrice, estimateBasis });
//   };

//   const handleReset = () => {
//     setKilowattInput("");
//     setResult(null);
//     setError("");
//   };

//   const isCommercialSize = parseFloat(kilowattInput) > RESIDENTIAL_THRESHOLD_KW;

//   return (
//     <>
//       <Card className="bg-white shadow-lg border-yellow-400 border-2 mb-8 overflow-hidden">
//         <CardHeader className="bg-gray-50/50">
//           <CardTitle className="flex items-center gap-3 text-2xl text-gray-900"><Sparkles className="h-6 w-6 text-yellow-500" />Instant Solar Quote Calculator</CardTitle>
//           <CardDescription>Get a dynamic price estimate for any system size. For commercial quotes ({'>'}10 kW), select a mounting type.</CardDescription>
//         </CardHeader>
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <div className="p-6 space-y-4">
//             <div>
//               <Label htmlFor="kilowatt-input" className="text-lg font-medium text-gray-800">Your Power Requirement (kW)</Label>
//               <div className="flex items-center mt-2">
//                 <Input id="kilowatt-input" type="number" value={kilowattInput} onChange={(e) => setKilowattInput(e.target.value)} placeholder={loading ? "Loading data..." : "e.g., 25"} className="text-lg" disabled={loading} />
//               </div>
//             </div>
//             {isCommercialSize && (
//               <div className="animate-in fade-in-50 duration-500">
//                 <Label htmlFor="mounting-type" className="text-lg font-medium text-gray-800">Mounting Type (Commercial)</Label>
//                 <Select value={mountingType} onValueChange={setMountingType} disabled={loading}>
//                   <SelectTrigger className="w-full mt-2 text-lg"><SelectValue placeholder="Select a mounting type" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="rcc-elevated">RCC Elevated</SelectItem>
//                     <SelectItem value="tin-shed">Tin Shed</SelectItem>
//                     <SelectItem value="pre-gi-mms">Pre GI MMS</SelectItem>
//                     <SelectItem value="without-mms">Without MMS</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             <div className="flex gap-4 pt-2">
//               <Button onClick={handleCalculate} size="lg" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
//                 {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Prices...</>) : (<><BarChart className="mr-2 h-4 w-4" /> Calculate</>)}
//               </Button>
//               <Button onClick={handleReset} size="lg" variant="outline" className="w-full" disabled={loading}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-6 space-y-4 border-l">
//             <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Your Estimated Quote</h3>
//             {result ? (
//               <div className="space-y-3 animate-in fade-in-50 duration-500">
//                 <div className="flex justify-between items-center text-md"><span className="text-gray-600 flex items-center gap-2"><Sun className="h-4 w-4 text-yellow-500" /> System Size:</span><span className="font-bold text-gray-900">{result.actualSystemSizeKwp} kWp</span></div>
//                 <div className="flex justify-between items-center text-md"><span className="text-gray-600 flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Recommended Inverter:</span><span className="font-bold text-gray-900">{result.inverterSizeKw} kW</span></div>
//                 <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Panel Configuration:</span><span className="font-medium text-gray-700">{result.numberOfPanels} x {PANEL_WATTAGE}Wp Modules</span></div>
//                 <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Pricing Basis:</span><span className="font-medium text-gray-700">₹{result.pricePerWatt.toFixed(2)} / Watt</span></div>
//                 <div className="pt-3 border-t mt-3">
//                   <div className="flex justify-between items-center text-md"><span className="text-gray-600">Base Price (excl. GST):</span><span className="font-semibold text-gray-900">₹{result.basePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
//                   <div className="flex justify-between items-center text-md"><span className="text-gray-600">GST @ 13.8%:</span><span className="font-semibold text-gray-900">₹{result.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
//                 </div>
//                 <div className="flex justify-between items-center text-xl pt-3 border-t mt-3">
//                   <span className="font-bold text-gray-800">Total Estimated Price:</span>
//                   <span className="font-extrabold text-2xl text-green-600">₹{result.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
//                 </div>
//                 <Button
//                   onClick={() => setIsFormOpen(true)}
//                   size="lg"
//                   className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
//                 >
//                   Proceed to Get Quote
//                 </Button>
//                 <p className="text-xs text-center text-gray-500 pt-2">{result.estimateBasis}. This is an estimate and is subject to final survey and terms.</p>
//               </div>
//             ) : (<div className="text-center text-gray-500 py-16"><p>Your detailed quote will appear here.</p></div>)}
//           </div>
//         </div>
//       </Card>
//       <CalculatorQuoteForm
//         open={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         quoteData={result}
//         mountingType={isCommercialSize ? mountingType : null}
//       />
//     </>
//   )
// }

// // --- TABLE COMPONENTS ---
// function GridTieSystemTable({ data, onRowClick }: { data: GridTieSystemData[]; onRowClick: (product: GridTieSystemData, type: string) => void }) {
//   const [sortField, setSortField] = useState<keyof GridTieSystemData | null>(null); const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); const [searchTerm, setSearchTerm] = useState(""); const handleSort = (field: keyof GridTieSystemData) => { if (sortField === field) { setSortDirection(sortDirection === "asc" ? "desc" : "asc"); } else { setSortField(field); setSortDirection("asc"); } }; const filteredAndSortedData = data.filter((item) => item.phase.toLowerCase().includes(searchTerm.toLowerCase()) || item.systemSize.toString().includes(searchTerm)).sort((a, b) => { if (!sortField) return 0; const aValue = a[sortField]; const bValue = b[sortField]; if (typeof aValue === 'string' && typeof bValue === 'string') { return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue); } if (typeof aValue === 'number' && typeof bValue === 'number') { return sortDirection === 'asc' ? aValue - bValue : bValue - aValue; } return 0; });
//   return (<div className="space-y-4"><div className="flex items-center space-x-2"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="font-semibold">Sl No.</TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("systemSize")} className="h-auto p-0 font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold">No of Modules</TableHead><TableHead className="font-semibold">Inverter Capacity (kW)</TableHead><TableHead className="font-semibold">Phase</TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("hdgElevatedWithGst")} className="h-auto p-0 font-semibold">Price/Watt (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("hdgElevatedPrice")} className="h-auto p-0 font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold">Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell className="font-medium">{item.slNo}</TableCell><TableCell>{item.systemSize}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"} className="text-xs">{item.phase}</Badge></TableCell><TableCell className="font-medium">₹{item.hdgElevatedWithGst.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.hdgElevatedPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "residential")} size="sm" variant="default" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div>{filteredAndSortedData.length === 0 && (<div className="text-center py-8 text-gray-500">No systems found.</div>)}</div>);
// }
// function LargeSystemTable({ data, onRowClick }: { data: LargeSystemData[]; onRowClick: (product: LargeSystemData, type: string) => void }) {
//   const [searchTerm, setSearchTerm] = useState(""); const [sortField, setSortField] = useState<keyof LargeSystemData | null>(null); const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); const handleSort = (field: keyof LargeSystemData) => { if (sortField === field) { setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); } else { setSortField(field); setSortDirection('asc'); } }; const filteredAndSortedData = data.filter((item) => item.systemSizeKWp.toString().includes(searchTerm) || item.systemSizeKW.toString().includes(searchTerm)).sort((a, b) => { if (!sortField) return 0; const aValue = a[sortField]; const bValue = b[sortField]; if (typeof aValue === 'number' && typeof bValue === 'number') { return sortDirection === 'asc' ? aValue - bValue : bValue - aValue; } return 0; });
//   return (<div className="space-y-4"><div className="flex items-center space-x-2"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search by system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div><Tabs defaultValue="tin-shed" className="w-full"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="tin-shed">Tin Shed</TabsTrigger><TabsTrigger value="rcc-elevated">RCC Elevated</TabsTrigger><TabsTrigger value="pre-gi-mms">Pre GI MMS</TabsTrigger><TabsTrigger value="without-mms">Without MMS</TabsTrigger></TabsList><TabsContent value="tin-shed" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead><Button variant="ghost" onClick={() => handleSort("systemSizeKWp")} className="h-auto p-0 font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.shortRailTinShedPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.shortRailTinShedPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-tin-shed")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="rcc-elevated" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.hdgElevatedRccPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.hdgElevatedRccPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-rcc")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="pre-gi-mms" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.preGiMmsPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.preGiMmsPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-mms")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="without-mms" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.priceWithoutMmsPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.priceWithoutMmsPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-without-mms")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent></Tabs></div>);
// }
// function DCCableTable({ data, onRowClick }: { data: DCCableData[]; onRowClick: (product: any, type: string) => void }) {
//   const totalAmount = data.reduce((sum, item) => sum + item.total, 0);
//   return (<div className="space-y-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sr No</TableHead><TableHead>Product Description</TableHead><TableHead>UOM</TableHead><TableHead>Quantity</TableHead><TableHead>Price (₹)</TableHead><TableHead>Total (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{data.map((item) => (<TableRow key={item.srNo} className="hover:bg-gray-50"><TableCell>{item.srNo}</TableCell><TableCell>{item.productDescription}</TableCell><TableCell><Badge variant="outline">{item.uom}</Badge></TableCell><TableCell>{item.quantity}</TableCell><TableCell>₹{item.price.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.total.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "cables")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody><TableFooter><TableRow className="bg-gray-50"><TableCell colSpan={6} className="font-bold text-right">Total Amount:</TableCell><TableCell className="font-bold text-lg">₹{totalAmount.toLocaleString("en-IN")}</TableCell></TableRow></TableFooter></Table></div></div>);
// }
// function KitItemsTable({ items }: { items: KitItem[] }) {
//   return (<div className="space-y-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sr No.</TableHead><TableHead>Component</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => (<TableRow key={item.srNo} className="hover:bg-gray-50"><TableCell>{item.srNo}</TableCell><TableCell><Badge variant="secondary">{item.item}</Badge></TableCell><TableCell className="max-w-md">{item.description || "Standard component"}</TableCell><TableCell><div className="flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4" /><span className="text-sm font-medium">Included</span></div></TableCell></TableRow>))}</TableBody></Table></div><div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold mb-2">{"What's Included in Our Scope:"}</h4><ul className="text-sm space-y-1"><li>• Complete system design and engineering</li><li>• All components listed above</li><li>• Installation and commissioning</li><li>• 5-year monitoring service</li><li>• Warranty as per manufacturer terms</li></ul></div></div>);
// }

// // --- MAIN RELIANCE COMPONENT ---
// export default function Reliance() {
//   const [isFormOpen, setIsFormOpen] = useState(false); const [selectedProduct, setSelectedProduct] = useState<any>(null); const [productType, setProductType] = useState<"residential" | "commercial" | "cables" | "kit">("residential"); const [selectedCommercialType, setSelectedCommercialType] = useState<string>(""); const [gridData, setGridData] = useState<GridTieSystemData[]>([]); const [largeData, setLargeData] = useState<LargeSystemData[]>([]); const [cableData, setCableData] = useState<DCCableData[]>([]); const [kitData, setKitData] = useState<KitItem[]>([]); const [productDescription, setProductDescription] = useState<string>("RIL 690-720 Wp HJT Solar Modules"); const [commercialLimit, setCommercialLimit] = useState<number>(165.6); const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const loadData = async () => { try { const [gridRes, largeRes, cablesRes, kitsRes, configRes] = await Promise.all([supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true }), supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true }), supabase.from('reliance_dc_cable_data').select('*').order('sr_no', { ascending: true }), supabase.from('reliance_kit_items').select('*').order('sr_no', { ascending: true }), supabase.from('reliance_system_config').select('*'),]); if (gridRes.data) { setGridData(gridRes.data.map((r: any) => ({ slNo: r.sl_no, systemSize: Number(r.system_size), noOfModules: r.no_of_modules, inverterCapacity: Number(r.inverter_capacity), phase: r.phase, hdgElevatedWithGst: Number(r.price_per_watt ?? r.hdg_elevated_with_gst ?? 0), hdgElevatedPrice: Number(r.hdg_elevated_price ?? 0), }))) } if (largeRes.data) { setLargeData(largeRes.data.map((r: any) => ({ slNo: r.sl_no, systemSizeKWp: Number(r.system_size_kwp), systemSizeKW: Number(r.system_size_kw), noOfModules: r.no_of_modules, inverterCapacity: Number(r.inverter_capacity), phase: r.phase, shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt), shortRailTinShedPrice: Number(r.short_rail_tin_shed_price), hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt), hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price), preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt), preGiMmsPrice: Number(r.pre_gi_mms_price), priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt), priceWithoutMmsPrice: Number(r.price_without_mms_price), }))) } if (cablesRes.data) { setCableData(cablesRes.data.map((r: any) => ({ srNo: r.sr_no, productDescription: r.product_description, uom: r.uom, quantity: r.quantity, price: Number(r.price), total: Number(r.total), }))) } if (kitsRes.data) { setKitData(kitsRes.data.map((r: any) => ({ srNo: r.sr_no, item: r.item, description: r.description, }))) } if (configRes.data) { const config = Object.fromEntries(configRes.data.map((c: any) => [c.key, c.value])); if (config['PRODUCT_DESCRIPTION']) setProductDescription(config['PRODUCT_DESCRIPTION']); if (config['COMMERCIAL_SYSTEM_SIZE_LIMIT']) setCommercialLimit(parseFloat(config['COMMERCIAL_SYSTEM_SIZE_LIMIT'])); } } catch (error) { console.error("Error loading data:", error); } finally { setLoading(false); } }; loadData();
//   }, []);

//   const handleRowClick = (product: any, type: string) => { setSelectedProduct(product); setProductType(type.includes("commercial") ? "commercial" : (type as any)); setSelectedCommercialType(type); setIsFormOpen(true); };
//   const getProductName = (product: any, type: string) => { if (type === "residential") { return `${product.systemSize} kWp Residential Solar System - ${product.noOfModules} Modules`; } else if (type.includes("commercial")) { const mountingType = type.includes("tin-shed") ? "Tin Shed" : type.includes("rcc") ? "RCC Elevated" : type.includes("without-mms") ? "Without MMS" : type.includes("mms") ? "Pre GI MMS" : "Without MMS"; return `${product.systemSizeKWp} kWp Commercial System - ${mountingType} - ${product.noOfModules} Modules`; } else if (type === "cables") { return `${product.productDescription} - ${product.quantity} ${product.uom}`; } return "Reliance Solar Product"; };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Instant Solar Quote Calculator Section */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <h1 className="text-4xl font-bold text-gray-900">Solar Quote Calculator</h1>
//           </div>
//           <SolarQuoteCalculator
//             gridData={gridData}
//             largeData={largeData}
//             loading={loading}
//           />
//         </div>

//         {/* Original Header */}
//         <div className="text-center space-y-4">
//           <div className="flex items-center justify-center gap-4 mb-4"><img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-12 w-auto" /><h1 className="text-4xl font-bold text-gray-900">HJT Solar System Pricing</h1></div>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive pricing for {productDescription} and complete system packages</p>
//           <div className="flex flex-wrap justify-center gap-2"><Badge variant="secondary">Non DCR Modules</Badge><Badge variant="secondary">Excluding GST</Badge><Badge variant="secondary">Net Metering Not Included</Badge></div>
//         </div>

//         <Tabs defaultValue="residential" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8"><TabsTrigger value="residential" className="flex items-center gap-2"><Calculator className="h-4 w-4" /> <span className="hidden sm:inline">Residential</span></TabsTrigger><TabsTrigger value="commercial" className="flex items-center gap-2"><Zap className="h-4 w-4" /> <span className="hidden sm:inline">Commercial</span></TabsTrigger><TabsTrigger value="cables" className="flex items-center gap-2"><Cable className="h-4 w-4" /> <span className="hidden sm:inline">Cables</span></TabsTrigger><TabsTrigger value="kit" className="flex items-center gap-2"><Package className="h-4 w-4" /> <span className="hidden sm:inline">Kit Items</span></TabsTrigger></TabsList>
//           <TabsContent value="residential"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-gray-700" />Residential Grid Tie Systems</CardTitle><CardDescription>Perfect for homes and small businesses.</CardDescription></CardHeader><CardContent><GridTieSystemTable data={gridData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
//           <TabsContent value="commercial"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-gray-700" />Commercial & Industrial Systems</CardTitle><CardDescription>Large-scale installations with multiple mounting options.</CardDescription></CardHeader><CardContent><LargeSystemTable data={largeData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
//           <TabsContent value="cables"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Cable className="h-5 w-5 text-gray-700" />DC Cables - Bulk Supply</CardTitle><CardDescription>High-quality DC cables for solar installations.</CardDescription></CardHeader><CardContent><DCCableTable data={cableData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
//           <TabsContent value="kit"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-gray-700" />Complete Kit Components</CardTitle><CardDescription>All components included in our solar system packages.</CardDescription></CardHeader><CardContent><KitItemsTable items={kitData} /></CardContent></Card></TabsContent>
//         </Tabs>
//         <Card className="bg-gray-100 border-gray-300">
//           <CardContent className="pt-6">
//             <div className="text-center space-y-2">
//               <h3 className="text-lg font-semibold">Need a system larger than {commercialLimit} kWp?</h3>
//               <p className="text-gray-600">For utility-scale installations, please contact our sales team for customized pricing.</p>
//               <Button variant="outline" className="mt-4 border-gray-400 bg-transparent" onClick={() => { const largeSystemProduct = { systemSize: 0, systemSizeKWp: 0, noOfModules: 0, inverterCapacity: 0, phase: "Three", }; setSelectedProduct(largeSystemProduct); setProductType("commercial"); setSelectedCommercialType(""); setIsFormOpen(true); }} > Contact Sales Team</Button>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white"><CardHeader><CardTitle>Terms and Conditions</CardTitle></CardHeader><CardContent className="space-y-6"><div><h3 className="font-semibold">Payment Schedule</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>10% Advance:</strong> Due when the order is placed.</li><li><strong>80% Pre-Dispatch:</strong> Due when materials are ready for shipment.</li><li><strong>10% Final Payment:</strong> Due after project installation and commissioning.</li></ul></div><div><h3 className="font-semibold">Project Timeline</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Material Delivery:</strong> 30 days after 90% payment is received.</li><li><strong>Commissioning:</strong> Within 8 to 10 weeks after materials arrive at the project site.</li></ul></div><div><h3 className="font-semibold">Scope & Costs</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Included:</strong> Installation & Commissioning (I&C) and transportation.</li><li><strong>Excluded:</strong> Civil work (e.g., foundations). Net-Metering/Net-Billing above 8kW is in Customer's Scope.</li><li><strong>Customer's Responsibility:</strong> Arranging Net-Metering/Net-Billing.</li><li><strong>AMC:</strong> Optional Annual Maintenance Contract available at ₹650 per KWp per year.</li></ul></div><div><h3 className="font-semibold">Warranties</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Complete System:</strong> 5 years</li><li><strong>Solar Modules:</strong> 30 years (performance warranty)</li><li><strong>Inverter:</strong> 10 years</li></ul></div></CardContent></Card>
//         <div className="text-center text-sm text-gray-500 border-t pt-8">
//           <p>All prices are subject to change. Contact us for the latest pricing and availability.</p>
//           <p>Reliance Industries Ltd. | {new Date().getFullYear()}</p>
//         </div>

//         <RelianceQuoteForm open={isFormOpen} onOpenChange={setIsFormOpen} productName={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0 ? `Large Scale System (Above ${commercialLimit} kWp)` : selectedProduct ? getProductName(selectedProduct, selectedCommercialType || productType) : "Reliance Solar Product"} isLargeSystem={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0} productType={productType} powerDemandKw={productType === "commercial" ? selectedProduct?.systemSizeKWp || null : selectedProduct?.systemSize || selectedProduct?.systemSizeKW || null} mountingType={(() => { if (!selectedCommercialType) return null; if (selectedCommercialType.includes("tin-shed")) return "Tin Shed"; if (selectedCommercialType.includes("rcc")) return "RCC Elevated"; if (selectedCommercialType.includes("without-mms")) return "Without MMS"; if (selectedCommercialType.includes("mms")) return "Pre GI MMS"; return null; })()} />
//       </div>
//     </div>
//   )
// }













"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Cable, Package, ArrowUpDown, Search, CheckCircle, Zap, Sparkles, Sun, IndianRupee, RefreshCcw, BarChart, Loader2 } from "lucide-react"
import RelianceQuoteForm from "@/components/forms/reliance-quote-form"
import CalculatorQuoteForm from "@/components/forms/calculator-quote-form"
import { supabase } from "@/integrations/supabase/client"

// --- TYPES ---
type GridTieSystemData = {
  slNo: number; systemSize: number; noOfModules: number; inverterCapacity: number; phase: string; hdgElevatedWithGst: number; hdgElevatedPrice: number;
}
type LargeSystemData = {
  slNo: number; systemSizeKWp: number; systemSizeKW: number; noOfModules: number; inverterCapacity: number; phase: string; shortRailTinShedPricePerWatt: number; shortRailTinShedPrice: number; hdgElevatedRccPricePerWatt: number; hdgElevatedRccPrice: number; preGiMmsPricePerWatt: number; preGiMmsPrice: number; priceWithoutMmsPricePerWatt: number; priceWithoutMmsPrice: number;
}
type DCCableData = {
  srNo: number; productDescription: string; uom: string; quantity: number; price: number; total: number;
}
type KitItem = {
  srNo: number; item: string; description: string;
}

// --- DYNAMIC SOLAR QUOTE CALCULATOR ---
interface CalculationResult {
  userInputKw: number; numberOfPanels: number; actualSystemSizeKwp: number; inverterSizeKw: number; pricePerWatt: number; basePrice: number; gstAmount: number; totalPrice: number; estimateBasis: string;
}
interface SolarQuoteCalculatorProps {
  gridData: GridTieSystemData[];
  largeData: LargeSystemData[];
  loading: boolean;
}

const SolarQuoteCalculator = ({ gridData, largeData, loading }: SolarQuoteCalculatorProps) => {
  const [kilowattInput, setKilowattInput] = useState<string>("")
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string>("")
  const [mountingType, setMountingType] = useState<string>("rcc-elevated");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const PANEL_WATTAGE = 710;
  const RESIDENTIAL_THRESHOLD_KW = 10;

  const handleCalculate = () => {
    setError("")
    const kw = parseFloat(kilowattInput)
    if (isNaN(kw) || kw <= 0) {
      setError("Please enter a valid power requirement (e.g., 5, 10.5).")
      setResult(null); return;
    }
    let pricePerWatt = 0;
    let inverterSizeKw = kw;
    let estimateBasis = "";
    if (kw <= RESIDENTIAL_THRESHOLD_KW) {
      if (!gridData || gridData.length === 0) {
        setError("Residential pricing data is not available. Cannot calculate.");
        setResult(null); return;
      }
      const applicableSlabs = gridData.filter(slab => slab.systemSize <= kw);
      let matchingSlab: GridTieSystemData;
      if (applicableSlabs.length > 0) {
        matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev);
      } else {
        matchingSlab = gridData.reduce((prev, curr) => curr.systemSize < prev.systemSize ? curr : prev);
      }
      pricePerWatt = matchingSlab.hdgElevatedWithGst;
      inverterSizeKw = matchingSlab.inverterCapacity;
      estimateBasis = `Based on ${matchingSlab.systemSize} kWp Residential price slab`;
    } else {
      if (!largeData || largeData.length === 0) {
        setError("Commercial pricing data is not available. Cannot calculate.");
        setResult(null); return;
      }
      const applicableSlabs = largeData.filter(slab => slab.systemSizeKWp <= kw);
      let matchingSlab: LargeSystemData;
      if (applicableSlabs.length > 0) {
        matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSizeKWp > prev.systemSizeKWp ? curr : prev);
      } else {
        matchingSlab = largeData.reduce((prev, curr) => curr.systemSizeKWp < prev.systemSizeKWp ? curr : prev);
      }
      switch (mountingType) {
        case 'tin-shed': pricePerWatt = matchingSlab.shortRailTinShedPricePerWatt; estimateBasis = `Based on Commercial (Tin Shed) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
        case 'pre-gi-mms': pricePerWatt = matchingSlab.preGiMmsPricePerWatt; estimateBasis = `Based on Commercial (Pre GI MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
        case 'without-mms': pricePerWatt = matchingSlab.priceWithoutMmsPricePerWatt; estimateBasis = `Based on Commercial (Without MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
        case 'rcc-elevated': default: pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt; estimateBasis = `Based on Commercial (RCC Elevated) price slab >= ${matchingSlab.systemSizeKWp} kWp`; break;
      }
      inverterSizeKw = matchingSlab.inverterCapacity;
    }
    const numberOfPanels = Math.ceil((kw * 1000) / PANEL_WATTAGE);
    const actualSystemSizeWp = numberOfPanels * PANEL_WATTAGE;
    const actualSystemSizeKwp = parseFloat((actualSystemSizeWp / 1000).toFixed(2));
    const basePrice = actualSystemSizeWp * pricePerWatt;
    const gstRate = 0.138;
    const gstAmount = basePrice * gstRate;
    const totalPrice = basePrice + gstAmount;
    setResult({ userInputKw: kw, numberOfPanels, actualSystemSizeKwp, inverterSizeKw, pricePerWatt, basePrice, gstAmount, totalPrice, estimateBasis });
  };

  const handleReset = () => {
    setKilowattInput("");
    setResult(null);
    setError("");
  };

  const isCommercialSize = parseFloat(kilowattInput) > RESIDENTIAL_THRESHOLD_KW;

  return (
    <>
      <Card className="bg-white shadow-lg border-yellow-400 border-2 mb-8 overflow-hidden">
        <CardHeader className="bg-gray-50/50 px-4 py-6 sm:px-6">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl text-gray-900"><Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />Instant Solar Quote Calculator</CardTitle>
          <CardDescription className="text-sm sm:text-base">Get a dynamic price estimate for any system size. For commercial quotes (&gt;10 kW), select a mounting type.</CardDescription>
        </CardHeader>
        <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <Label htmlFor="kilowatt-input" className="text-base sm:text-lg font-medium text-gray-800">Your Power Requirement (kW)</Label>
              <div className="flex items-center mt-2">
                <Input 
                  id="kilowatt-input" 
                  type="number" 
                  value={kilowattInput} 
                  onChange={(e) => setKilowattInput(e.target.value)} 
                  placeholder={loading ? "Loading data..." : "e.g., 25"} 
                  className="text-base sm:text-lg w-full" 
                  disabled={loading} 
                />
              </div>
            </div>
            {isCommercialSize && (
              <div className="animate-in fade-in-50 duration-500">
                <Label htmlFor="mounting-type" className="text-base sm:text-lg font-medium text-gray-800">Mounting Type (Commercial)</Label>
                <Select value={mountingType} onValueChange={setMountingType} disabled={loading}>
                  <SelectTrigger className="w-full mt-2 text-base sm:text-lg">
                    <SelectValue placeholder="Select a mounting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rcc-elevated">RCC Elevated</SelectItem>
                    <SelectItem value="tin-shed">Tin Shed</SelectItem>
                    <SelectItem value="pre-gi-mms">Pre GI MMS</SelectItem>
                    <SelectItem value="without-mms">Without MMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                onClick={handleCalculate} 
                size="lg" 
                className="w-full bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3" 
                disabled={loading}
              >
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Prices...</>) : (<><BarChart className="mr-2 h-4 w-4" /> Calculate</>)}
              </Button>
              <Button 
                onClick={handleReset} 
                size="lg" 
                variant="outline" 
                className="w-full text-base sm:text-lg py-2 sm:py-3" 
                disabled={loading}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 space-y-4 border-l md:border-l md:border-t-0 border-t">
            <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">Your Estimated Quote</h3>
            {result ? (
              <div className="space-y-3 animate-in fade-in-50 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
                  <span className="text-gray-600 flex items-center gap-2"><Sun className="h-4 w-4 text-yellow-500" /> System Size:</span>
                  <span className="font-bold text-gray-900">{result.actualSystemSizeKwp} kWp</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
                  <span className="text-gray-600 flex items-center gap-2"><Zap className="h-4 w-4 text-blue-500" /> Recommended Inverter:</span>
                  <span className="font-bold text-gray-900">{result.inverterSizeKw} kW</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Panel Configuration:</span>
                  <span className="font-medium text-gray-700">{result.numberOfPanels} x {PANEL_WATTAGE}Wp Modules</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Pricing Basis:</span>
                  <span className="font-medium text-gray-700">₹{result.pricePerWatt.toFixed(2)} / Watt</span>
                </div>
                <div className="pt-3 border-t mt-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
                    <span className="text-gray-600">Base Price (excl. GST):</span>
                    <span className="font-semibold text-gray-900">₹{result.basePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
                    <span className="text-gray-600">GST @ 13.8%:</span>
                    <span className="font-semibold text-gray-900">₹{result.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-lg sm:text-xl pt-3 border-t mt-3">
                  <span className="font-bold text-gray-800">Total Estimated Price:</span>
                  <span className="font-extrabold text-xl sm:text-2xl text-green-600">₹{result.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  size="lg"
                  className="w-full mt-4 bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3"
                >
                  Proceed to Get Quote
                </Button>
                <p className="text-xs text-center text-gray-500 pt-2">{result.estimateBasis}. This is an estimate and is subject to final survey and terms.</p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 sm:py-16">
                <p className="text-sm sm:text-base">Your detailed quote will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      <CalculatorQuoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        quoteData={result}
        mountingType={isCommercialSize ? mountingType : null}
      />
    </>
  )
}

// --- TABLE COMPONENTS ---
function GridTieSystemTable({ data, onRowClick }: { data: GridTieSystemData[]; onRowClick: (product: GridTieSystemData, type: string) => void }) {
  const [sortField, setSortField] = useState<keyof GridTieSystemData | null>(null); const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); const [searchTerm, setSearchTerm] = useState(""); const handleSort = (field: keyof GridTieSystemData) => { if (sortField === field) { setSortDirection(sortDirection === "asc" ? "desc" : "asc"); } else { setSortField(field); setSortDirection("asc"); } }; const filteredAndSortedData = data.filter((item) => item.phase.toLowerCase().includes(searchTerm.toLowerCase()) || item.systemSize.toString().includes(searchTerm)).sort((a, b) => { if (!sortField) return 0; const aValue = a[sortField]; const bValue = b[sortField]; if (typeof aValue === 'string' && typeof bValue === 'string') { return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue); } if (typeof aValue === 'number' && typeof bValue === 'number') { return sortDirection === 'asc' ? aValue - bValue : bValue - aValue; } return 0; });
  return (<div className="space-y-4"><div className="flex items-center space-x-2"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="font-semibold">Sl No.</TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("systemSize")} className="h-auto p-0 font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold">No of Modules</TableHead><TableHead className="font-semibold">Inverter Capacity (kW)</TableHead><TableHead className="font-semibold">Phase</TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("hdgElevatedWithGst")} className="h-auto p-0 font-semibold">Price/Watt (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold"><Button variant="ghost" onClick={() => handleSort("hdgElevatedPrice")} className="h-auto p-0 font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead className="font-semibold">Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell className="font-medium">{item.slNo}</TableCell><TableCell>{item.systemSize}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"} className="text-xs">{item.phase}</Badge></TableCell><TableCell className="font-medium">₹{item.hdgElevatedWithGst.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.hdgElevatedPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "residential")} size="sm" variant="default" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div>{filteredAndSortedData.length === 0 && (<div className="text-center py-8 text-gray-500">No systems found.</div>)}</div>);
}
function LargeSystemTable({ data, onRowClick }: { data: LargeSystemData[]; onRowClick: (product: LargeSystemData, type: string) => void }) {
  const [searchTerm, setSearchTerm] = useState(""); const [sortField, setSortField] = useState<keyof LargeSystemData | null>(null); const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); const handleSort = (field: keyof LargeSystemData) => { if (sortField === field) { setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); } else { setSortField(field); setSortDirection('asc'); } }; const filteredAndSortedData = data.filter((item) => item.systemSizeKWp.toString().includes(searchTerm) || item.systemSizeKW.toString().includes(searchTerm)).sort((a, b) => { if (!sortField) return 0; const aValue = a[sortField]; const bValue = b[sortField]; if (typeof aValue === 'number' && typeof bValue === 'number') { return sortDirection === 'asc' ? aValue - bValue : bValue - aValue; } return 0; });
  return (<div className="space-y-4"><div className="flex items-center space-x-2"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search by system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div><Tabs defaultValue="tin-shed" className="w-full"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="tin-shed">Tin Shed</TabsTrigger><TabsTrigger value="rcc-elevated">RCC Elevated</TabsTrigger><TabsTrigger value="pre-gi-mms">Pre GI MMS</TabsTrigger><TabsTrigger value="without-mms">Without MMS</TabsTrigger></TabsList><TabsContent value="tin-shed" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead><Button variant="ghost" onClick={() => handleSort("systemSizeKWp")} className="h-auto p-0 font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.shortRailTinShedPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.shortRailTinShedPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-tin-shed")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="rcc-elevated" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.hdgElevatedRccPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.hdgElevatedRccPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-rcc")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="pre-gi-mms" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.preGiMmsPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.preGiMmsPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-mms")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent><TabsContent value="without-mms" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sl No.</TableHead><TableHead>System Size (kWp)</TableHead><TableHead>No. of Modules</TableHead><TableHead>Inverter Capacity (kW)</TableHead><TableHead>Phase</TableHead><TableHead>Price/Watt (₹)</TableHead><TableHead>Total Price (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{filteredAndSortedData.map((item) => (<TableRow key={item.slNo} className="hover:bg-gray-50"><TableCell>{item.slNo}</TableCell><TableCell>{item.systemSizeKWp}</TableCell><TableCell>{item.noOfModules}</TableCell><TableCell>{item.inverterCapacity}</TableCell><TableCell><Badge variant="secondary">{item.phase}</Badge></TableCell><TableCell>₹{item.priceWithoutMmsPricePerWatt.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.priceWithoutMmsPrice.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "commercial-without-mms")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent></Tabs></div>);
}
function DCCableTable({ data, onRowClick }: { data: DCCableData[]; onRowClick: (product: any, type: string) => void }) {
  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);
  return (<div className="space-y-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sr No</TableHead><TableHead>Product Description</TableHead><TableHead>UOM</TableHead><TableHead>Quantity</TableHead><TableHead>Price (₹)</TableHead><TableHead>Total (₹)</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{data.map((item) => (<TableRow key={item.srNo} className="hover:bg-gray-50"><TableCell>{item.srNo}</TableCell><TableCell>{item.productDescription}</TableCell><TableCell><Badge variant="outline">{item.uom}</Badge></TableCell><TableCell>{item.quantity}</TableCell><TableCell>₹{item.price.toFixed(2)}</TableCell><TableCell className="font-bold text-green-600">₹{item.total.toLocaleString("en-IN")}</TableCell><TableCell><Button onClick={() => onRowClick(item, "cables")} size="sm" className="bg-black hover:bg-gray-800 text-white">Get Quote</Button></TableCell></TableRow>))}</TableBody><TableFooter><TableRow className="bg-gray-50"><TableCell colSpan={6} className="font-bold text-right">Total Amount:</TableCell><TableCell className="font-bold text-lg">₹{totalAmount.toLocaleString("en-IN")}</TableCell></TableRow></TableFooter></Table></div></div>);
}
function KitItemsTable({ items }: { items: KitItem[] }) {
  return (<div className="space-y-4"><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Sr No.</TableHead><TableHead>Component</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => (<TableRow key={item.srNo} className="hover:bg-gray-50"><TableCell>{item.srNo}</TableCell><TableCell><Badge variant="secondary">{item.item}</Badge></TableCell><TableCell className="max-w-md">{item.description || "Standard component"}</TableCell><TableCell><div className="flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4" /><span className="text-sm font-medium">Included</span></div></TableCell></TableRow>))}</TableBody></Table></div><div className="bg-gray-50 p-4 rounded-lg"><h4 className="font-semibold mb-2">{"What's Included in Our Scope:"}</h4><ul className="text-sm space-y-1"><li>• Complete system design and engineering</li><li>• All components listed above</li><li>• Installation and commissioning</li><li>• 5-year monitoring service</li><li>• Warranty as per manufacturer terms</li></ul></div></div>);
}

// --- MAIN RELIANCE COMPONENT ---
export default function Reliance() {
  const [isFormOpen, setIsFormOpen] = useState(false); const [selectedProduct, setSelectedProduct] = useState<any>(null); const [productType, setProductType] = useState<"residential" | "commercial" | "cables" | "kit">("residential"); const [selectedCommercialType, setSelectedCommercialType] = useState<string>(""); const [gridData, setGridData] = useState<GridTieSystemData[]>([]); const [largeData, setLargeData] = useState<LargeSystemData[]>([]); const [cableData, setCableData] = useState<DCCableData[]>([]); const [kitData, setKitData] = useState<KitItem[]>([]); const [productDescription, setProductDescription] = useState<string>("RIL 690-720 Wp HJT Solar Modules"); const [commercialLimit, setCommercialLimit] = useState<number>(165.6); const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => { try { const [gridRes, largeRes, cablesRes, kitsRes, configRes] = await Promise.all([supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true }), supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true }), supabase.from('reliance_dc_cable_data').select('*').order('sr_no', { ascending: true }), supabase.from('reliance_kit_items').select('*').order('sr_no', { ascending: true }), supabase.from('reliance_system_config').select('*'),]); if (gridRes.data) { setGridData(gridRes.data.map((r: any) => ({ slNo: r.sl_no, systemSize: Number(r.system_size), noOfModules: r.no_of_modules, inverterCapacity: Number(r.inverter_capacity), phase: r.phase, hdgElevatedWithGst: Number(r.price_per_watt ?? r.hdg_elevated_with_gst ?? 0), hdgElevatedPrice: Number(r.hdg_elevated_price ?? 0), }))) } if (largeRes.data) { setLargeData(largeRes.data.map((r: any) => ({ slNo: r.sl_no, systemSizeKWp: Number(r.system_size_kwp), systemSizeKW: Number(r.system_size_kw), noOfModules: r.no_of_modules, inverterCapacity: Number(r.inverter_capacity), phase: r.phase, shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt), shortRailTinShedPrice: Number(r.short_rail_tin_shed_price), hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt), hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price), preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt), preGiMmsPrice: Number(r.pre_gi_mms_price), priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt), priceWithoutMmsPrice: Number(r.price_without_mms_price), }))) } if (cablesRes.data) { setCableData(cablesRes.data.map((r: any) => ({ srNo: r.sr_no, productDescription: r.product_description, uom: r.uom, quantity: r.quantity, price: Number(r.price), total: Number(r.total), }))) } if (kitsRes.data) { setKitData(kitsRes.data.map((r: any) => ({ srNo: r.sr_no, item: r.item, description: r.description, }))) } if (configRes.data) { const config = Object.fromEntries(configRes.data.map((c: any) => [c.key, c.value])); if (config['PRODUCT_DESCRIPTION']) setProductDescription(config['PRODUCT_DESCRIPTION']); if (config['COMMERCIAL_SYSTEM_SIZE_LIMIT']) setCommercialLimit(parseFloat(config['COMMERCIAL_SYSTEM_SIZE_LIMIT'])); } } catch (error) { console.error("Error loading data:", error); } finally { setLoading(false); } }; loadData();
  }, []);

  const handleRowClick = (product: any, type: string) => { setSelectedProduct(product); setProductType(type.includes("commercial") ? "commercial" : (type as any)); setSelectedCommercialType(type); setIsFormOpen(true); };
  const getProductName = (product: any, type: string) => { if (type === "residential") { return `${product.systemSize} kWp Residential Solar System - ${product.noOfModules} Modules`; } else if (type.includes("commercial")) { const mountingType = type.includes("tin-shed") ? "Tin Shed" : type.includes("rcc") ? "RCC Elevated" : type.includes("without-mms") ? "Without MMS" : type.includes("mms") ? "Pre GI MMS" : "Without MMS"; return `${product.systemSizeKWp} kWp Commercial System - ${mountingType} - ${product.noOfModules} Modules`; } else if (type === "cables") { return `${product.productDescription} - ${product.quantity} ${product.uom}`; } return "Reliance Solar Product"; };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Instant Solar Quote Calculator Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Solar Quote Calculator</h1>
          </div>
          <SolarQuoteCalculator
            gridData={gridData}
            largeData={largeData}
            loading={loading}
          />
        </div>

        {/* Original Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4"><img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-12 w-auto" /><h1 className="text-4xl font-bold text-gray-900">HJT Solar System Pricing</h1></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive pricing for {productDescription} and complete system packages</p>
          <div className="flex flex-wrap justify-center gap-2"><Badge variant="secondary">Non DCR Modules</Badge><Badge variant="secondary">Excluding GST</Badge><Badge variant="secondary">Net Metering Not Included</Badge></div>
        </div>

        <Tabs defaultValue="residential" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8"><TabsTrigger value="residential" className="flex items-center gap-2"><Calculator className="h-4 w-4" /> <span className="hidden sm:inline">Residential</span></TabsTrigger><TabsTrigger value="commercial" className="flex items-center gap-2"><Zap className="h-4 w-4" /> <span className="hidden sm:inline">Commercial</span></TabsTrigger><TabsTrigger value="cables" className="flex items-center gap-2"><Cable className="h-4 w-4" /> <span className="hidden sm:inline">Cables</span></TabsTrigger><TabsTrigger value="kit" className="flex items-center gap-2"><Package className="h-4 w-4" /> <span className="hidden sm:inline">Kit Items</span></TabsTrigger></TabsList>
          <TabsContent value="residential"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-gray-700" />Residential Grid Tie Systems</CardTitle><CardDescription>Perfect for homes and small businesses.</CardDescription></CardHeader><CardContent><GridTieSystemTable data={gridData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
          <TabsContent value="commercial"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-gray-700" />Commercial & Industrial Systems</CardTitle><CardDescription>Large-scale installations with multiple mounting options.</CardDescription></CardHeader><CardContent><LargeSystemTable data={largeData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
          <TabsContent value="cables"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Cable className="h-5 w-5 text-gray-700" />DC Cables - Bulk Supply</CardTitle><CardDescription>High-quality DC cables for solar installations.</CardDescription></CardHeader><CardContent><DCCableTable data={cableData} onRowClick={handleRowClick} /></CardContent></Card></TabsContent>
          <TabsContent value="kit"><Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-gray-700" />Complete Kit Components</CardTitle><CardDescription>All components included in our solar system packages.</CardDescription></CardHeader><CardContent><KitItemsTable items={kitData} /></CardContent></Card></TabsContent>
        </Tabs>
        <Card className="bg-gray-100 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Need a system larger than {commercialLimit} kWp?</h3>
              <p className="text-gray-600">For utility-scale installations, please contact our sales team for customized pricing.</p>
              <Button variant="outline" className="mt-4 border-gray-400 bg-transparent" onClick={() => { const largeSystemProduct = { systemSize: 0, systemSizeKWp: 0, noOfModules: 0, inverterCapacity: 0, phase: "Three", }; setSelectedProduct(largeSystemProduct); setProductType("commercial"); setSelectedCommercialType(""); setIsFormOpen(true); }} > Contact Sales Team</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white"><CardHeader><CardTitle>Terms and Conditions</CardTitle></CardHeader><CardContent className="space-y-6"><div><h3 className="font-semibold">Payment Schedule</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>10% Advance:</strong> Due when the order is placed.</li><li><strong>80% Pre-Dispatch:</strong> Due when materials are ready for shipment.</li><li><strong>10% Final Payment:</strong> Due after project installation and commissioning.</li></ul></div><div><h3 className="font-semibold">Project Timeline</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Material Delivery:</strong> 30 days after 90% payment is received.</li><li><strong>Commissioning:</strong> Within 8 to 10 weeks after materials arrive at the project site.</li></ul></div><div><h3 className="font-semibold">Scope & Costs</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Included:</strong> Installation & Commissioning (I&C) and transportation.</li><li><strong>Excluded:</strong> Civil work (e.g., foundations). Net-Metering/Net-Billing above 8kW is in Customer's Scope.</li><li><strong>Customer's Responsibility:</strong> Arranging Net-Metering/Net-Billing.</li><li><strong>AMC:</strong> Optional Annual Maintenance Contract available at ₹650 per KWp per year.</li></ul></div><div><h3 className="font-semibold">Warranties</h3><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Complete System:</strong> 5 years</li><li><strong>Solar Modules:</strong> 30 years (performance warranty)</li><li><strong>Inverter:</strong> 10 years</li></ul></div></CardContent></Card>
        <div className="text-center text-sm text-gray-500 border-t pt-8">
          <p>All prices are subject to change. Contact us for the latest pricing and availability.</p>
          <p>Reliance Industries Ltd. | {new Date().getFullYear()}</p>
        </div>

        <RelianceQuoteForm open={isFormOpen} onOpenChange={setIsFormOpen} productName={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0 ? `Large Scale System (Above ${commercialLimit} kWp)` : selectedProduct ? getProductName(selectedProduct, selectedCommercialType || productType) : "Reliance Solar Product"} isLargeSystem={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0} productType={productType} powerDemandKw={productType === "commercial" ? selectedProduct?.systemSizeKWp || null : selectedProduct?.systemSize || selectedProduct?.systemSizeKW || null} mountingType={(() => { if (!selectedCommercialType) return null; if (selectedCommercialType.includes("tin-shed")) return "Tin Shed"; if (selectedCommercialType.includes("rcc")) return "RCC Elevated"; if (selectedCommercialType.includes("without-mms")) return "Without MMS"; if (selectedCommercialType.includes("mms")) return "Pre GI MMS"; return null; })()} />
      </div>
    </div>
  )
}