// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Sparkles, Sun, Zap, RefreshCcw, BarChart, Loader2, Search, ArrowUpDown } from "lucide-react"
// import CalculatorQuoteForm from "@/components/forms/calculator-quote-form"
// import { supabase } from "@/integrations/supabase/client"

// // --- TYPES ---
// type GridTieSystemData = {
//   slNo: number;
//   systemSize: number;
//   noOfModules: number;
//   inverterCapacity?: number;
//   phase: string;
//   pricePerWatt?: number;
//   pricePerKwp?: number;
//   hdgElevatedWithGst?: number;
//   preGiElevatedWithGst?: number;
//   totalPrice?: number;
//   hdgElevatedPrice?: number;
//   preGiElevatedPrice?: number;
// }

// type LargeSystemData = {
//   slNo: number;
//   systemSizeKWp: number;
//   systemSizeKW: number;
//   noOfModules: number;
//   inverterCapacity: number;
//   phase: string;
//   shortRailTinShedPricePerWatt: number;
//   shortRailTinShedPrice: number;
//   hdgElevatedRccPricePerWatt: number;
//   hdgElevatedRccPrice: number;
//   preGiMmsPricePerWatt: number;
//   preGiMmsPrice: number;
//   priceWithoutMmsPricePerWatt: number;
//   priceWithoutMmsPrice: number;
// }

// interface CalculationResult {
//   userInputKw: number;
//   numberOfPanels: number;
//   actualSystemSizeKwp: number;
//   inverterSizeKw: number | null;
//   pricePerWatt: number;
//   basePrice: number;
//   gstAmount: number;
//   totalPrice: number;
//   estimateBasis: string;
//   company: string;
// }

// interface SolarQuoteCalculatorProps {
//   gridData: GridTieSystemData[];
//   largeData?: LargeSystemData[];
//   company: string;
//   loading: boolean;
//   productDescription?: string;
//   workScope?: string;
//   panelWattage: number;
//   residentialThreshold: number;
//   hasMountingOptions: boolean;
//   systemSizeLimit?: number;
// }

// type TataGridData = GridTieSystemData & {
//   pricePerKwp: number;
//   totalPrice: number;
// }

// type ShaktiGridData = GridTieSystemData & {
//   preGiElevatedWithGst: number;
//   preGiElevatedPrice: number;
//   inverterCapacity: number;
// }

// // Universal Solar Quote Calculator
// const SolarQuoteCalculator = ({ 
//   gridData, 
//   largeData, 
//   company, 
//   loading, 
//   productDescription = "", 
//   workScope = "", 
//   panelWattage, 
//   residentialThreshold,
//   hasMountingOptions,
//   systemSizeLimit
// }: SolarQuoteCalculatorProps) => {
//   const [kilowattInput, setKilowattInput] = useState<string>("")
//   const [result, setResult] = useState<CalculationResult | null>(null)
//   const [error, setError] = useState<string>("")
//   const [mountingType, setMountingType] = useState<string>("rcc-elevated")
//   const [isFormOpen, setIsFormOpen] = useState(false)

//   const RESIDENTIAL_THRESHOLD_KW = residentialThreshold

//   const handleCalculate = () => {
//     setError("")
//     const kw = parseFloat(kilowattInput)
//     if (isNaN(kw) || kw <= 0) {
//       setError("Please enter a valid power requirement (e.g., 5, 10.5).")
//       setResult(null)
//       return
//     }

//     if (company === "Reliance" && systemSizeLimit && kw > systemSizeLimit) {
//       setError(`${company} systems up to ${systemSizeLimit} kWp are available for instant calculation. For larger systems, please contact sales for a custom quote.`)
//       setResult(null)
//       return
//     }

//     let pricePerWatt = 0
//     let inverterSizeKw: number | null = kw
//     let estimateBasis = ""
//     if (kw <= RESIDENTIAL_THRESHOLD_KW) {
//       if (!gridData || gridData.length === 0) {
//         setError(`${company} residential pricing data is not available. Cannot calculate.`)
//         setResult(null)
//         return
//       }
//       const applicableSlabs = gridData.filter(slab => slab.systemSize <= kw)
//       let matchingSlab: GridTieSystemData
//       if (applicableSlabs.length > 0) {
//         matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
//       } else {
//         matchingSlab = gridData.reduce((prev, curr) => curr.systemSize < prev.systemSize ? curr : prev)
//       }
      
//       if (matchingSlab.pricePerWatt) {
//         pricePerWatt = matchingSlab.pricePerWatt
//       } else if (matchingSlab.hdgElevatedWithGst) {
//         pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
//       } else if (matchingSlab.preGiElevatedWithGst) {
//         pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
//       } else if (matchingSlab.pricePerKwp) {
//         pricePerWatt = matchingSlab.pricePerKwp / 1000
//       } else {
//         setError("No valid pricing data found for the selected system size.")
//         setResult(null)
//         return
//       }
      
//       inverterSizeKw = matchingSlab.inverterCapacity ?? null
//       estimateBasis = `Based on ${matchingSlab.systemSize} kWp ${company} Residential price slab`
//     } else {
//       if (company === "Reliance") {
//         if (!largeData || largeData.length === 0) {
//           setError(`${company} commercial pricing data is not available. Please contact sales for a custom quote.`)
//           setResult(null)
//           return
//         }
//         const applicableSlabs = largeData.filter(slab => slab.systemSizeKWp <= kw)
//         let matchingSlab: LargeSystemData
//         if (applicableSlabs.length > 0) {
//           matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSizeKWp > prev.systemSizeKWp ? curr : prev)
//         } else {
//           matchingSlab = largeData.reduce((prev, curr) => curr.systemSizeKWp < prev.systemSizeKWp ? curr : prev)
//         }
        
//         if (hasMountingOptions) {
//           switch (mountingType) {
//             case 'tin-shed':
//               pricePerWatt = matchingSlab.shortRailTinShedPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Tin Shed) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'pre-gi-mms':
//               pricePerWatt = matchingSlab.preGiMmsPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Pre GI MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'without-mms':
//               pricePerWatt = matchingSlab.priceWithoutMmsPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Without MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'rcc-elevated':
//             default:
//               pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (RCC Elevated) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//           }
//         } else {
//           pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
//           estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSizeKWp} kWp`
//         }
//         inverterSizeKw = matchingSlab.inverterCapacity
//       } else {
//         if (!gridData || gridData.length === 0) {
//           setError(`${company} pricing data is not available. Cannot calculate.`)
//           setResult(null)
//           return
//         }
//         const matchingSlab = gridData.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
        
//         if (matchingSlab.pricePerWatt) {
//           pricePerWatt = matchingSlab.pricePerWatt
//         } else if (matchingSlab.hdgElevatedWithGst) {
//           pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
//         } else if (matchingSlab.preGiElevatedWithGst) {
//           pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
//         } else if (matchingSlab.pricePerKwp) {
//           pricePerWatt = matchingSlab.pricePerKwp / 1000
//         } else {
//           setError("No valid pricing data found for the selected system size.")
//           setResult(null)
//           return
//         }
        
//         inverterSizeKw = matchingSlab.inverterCapacity ?? kw
//         estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSize} kWp`
//       }
//     }
    
//     const numberOfPanels = Math.ceil((kw * 1000) / panelWattage)
//     const actualSystemSizeWp = numberOfPanels * panelWattage
//     const actualSystemSizeKwp = parseFloat((actualSystemSizeWp / 1000).toFixed(2))
//     const basePrice = actualSystemSizeWp * pricePerWatt
//     const gstRate = 0.138
//     const gstAmount = basePrice * gstRate
//     const totalPrice = basePrice + gstAmount
//     setResult({ 
//       userInputKw: kw, 
//       numberOfPanels, 
//       actualSystemSizeKwp, 
//       inverterSizeKw, 
//       pricePerWatt, 
//       basePrice, 
//       gstAmount, 
//       totalPrice, 
//       estimateBasis,
//       company 
//     })
//   }

//   const handlePricePerWattChange = (value: string) => {
//     setError("")
//     const newPricePerWatt = value === "" ? 0 : parseFloat(value)
//     if (isNaN(newPricePerWatt) || newPricePerWatt < 0) {
//       setError("Please enter a valid price per watt (e.g., 50 or 50.5).")
//       return
//     }
//     if (result) {
//       const newBasePrice = result.actualSystemSizeKwp * 1000 * newPricePerWatt
//       const newGstAmount = newBasePrice * 0.138
//       const newTotalPrice = newBasePrice + newGstAmount
//       setResult({
//         ...result,
//         pricePerWatt: newPricePerWatt,
//         basePrice: newBasePrice,
//         gstAmount: newGstAmount,
//         totalPrice: newTotalPrice,
//         estimateBasis: `${result.estimateBasis} (Price per watt modified)`
//       })
//     }
//   }

//   const handleBasePriceChange = (value: string) => {
//     setError("")
//     const newBasePrice = value === "" ? 0 : parseFloat(value)
//     if (isNaN(newBasePrice) || newBasePrice < 0) {
//       setError("Please enter a valid base price.")
//       return
//     }
//     if (result) {
//       const newPricePerWatt = newBasePrice / (result.actualSystemSizeKwp * 1000)
//       const newGstAmount = newBasePrice * 0.138
//       const newTotalPrice = newBasePrice + newGstAmount
//       setResult({
//         ...result,
//         pricePerWatt: newPricePerWatt,
//         basePrice: newBasePrice,
//         gstAmount: newGstAmount,
//         totalPrice: newTotalPrice,
//         estimateBasis: `${result.estimateBasis} (Base price modified)`
//       })
//     }
//   }

//   const handleKilowattInputChange = (value: string) => {
//     setKilowattInput(value)
//     if (value === "" || parseFloat(value) > 0) {
//       setError("")
//     }
//   }

//   const handleReset = () => {
//     setKilowattInput("")
//     setResult(null)
//     setError("")
//     setMountingType("rcc-elevated")
//   }

//   const isCommercialSize = parseFloat(kilowattInput) > RESIDENTIAL_THRESHOLD_KW

//   return (
//     <>
//       <Card className="bg-white shadow-lg border-blue-400 border-2 mb-8 overflow-hidden">
//         <CardHeader className="bg-gray-50/50 px-4 py-6 sm:px-6">
//           <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl text-gray-900">
//             <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//             Instant {company} Solar Quote Calculator
//           </CardTitle>
//           <CardDescription className="text-sm sm:text-base">
//             Get a dynamic price estimate for {productDescription}. {workScope}. 
//             {company === "Reliance" 
//               ? `For commercial quotes (>${RESIDENTIAL_THRESHOLD_KW} kW), select a mounting type.`
//               : `Commercial quotes (>${RESIDENTIAL_THRESHOLD_KW} kW) are calculated based on the highest available residential slab.`}
//           </CardDescription>
//         </CardHeader>
//         <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 sm:p-6 space-y-4">
//             <div>
//               <Label htmlFor="kilowatt-input" className="text-base sm:text-lg font-medium text-gray-800">
//                 Your Power Requirement (kW)
//               </Label>
//               <div className="flex items-center mt-2">
//                 <Input
//                   id="kilowatt-input"
//                   type="number"
//                   value={kilowattInput}
//                   onChange={(e) => handleKilowattInputChange(e.target.value)}
//                   placeholder={loading ? "Loading data..." : "e.g., 25"}
//                   className="text-base sm:text-lg w-full"
//                   disabled={loading}
//                   min="0"
//                   step="0.1"
//                 />
//               </div>
//             </div>
//             {hasMountingOptions && isCommercialSize && company === "Reliance" && (
//               <div className="animate-in fade-in-50 duration-500">
//                 <Label htmlFor="mounting-type" className="text-base sm:text-lg font-medium text-gray-800">
//                   Mounting Type (Commercial)
//                 </Label>
//                 <Select value={mountingType} onValueChange={setMountingType} disabled={loading}>
//                   <SelectTrigger className="w-full mt-2 text-base sm:text-lg">
//                     <SelectValue placeholder="Select a mounting type" />
//                   </SelectTrigger>
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
//             <div className="flex flex-col sm:flex-row gap-4 pt-2">
//               <Button
//                 onClick={handleCalculate}
//                 size="lg"
//                 className="w-full bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Prices...
//                   </>
//                 ) : (
//                   <>
//                     <BarChart className="mr-2 h-4 w-4" /> Calculate
//                   </>
//                 )}
//               </Button>
//               <Button
//                 onClick={handleReset}
//                 size="lg"
//                 variant="outline"
//                 className="w-full text-base sm:text-lg py-2 sm:py-3"
//                 disabled={loading}
//               >
//                 <RefreshCcw className="mr-2 h-4 w-4" /> Reset
//               </Button>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 sm:p-6 space-y-4 border-l md:border-l md:border-t-0 border-t">
//             <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">
//               Your {company} Estimated Quote
//             </h3>
//             {result ? (
//               <div className="space-y-3 animate-in fade-in-50 duration-500">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                   <span className="text-gray-600 flex items-center gap-2">
//                     <Sun className="h-4 w-4 text-yellow-500" /> System Size:
//                   </span>
//                   <span className="font-bold text-gray-900">{result.actualSystemSizeKwp} kWp</span>
//                 </div>
//                 {result.inverterSizeKw !== null && (
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600 flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-blue-500" /> Recommended Inverter:
//                     </span>
//                     <span className="font-bold text-gray-900">{result.inverterSizeKw} kW</span>
//                   </div>
//                 )}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
//                   <span className="text-gray-500">Panel Configuration:</span>
//                   <span className="font-medium text-gray-700">
//                     {result.numberOfPanels} x {panelWattage}Wp Modules
//                   </span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
//                   <span className="text-gray-500">Pricing Basis:</span>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="text"
//                       value={result.pricePerWatt.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
//                       onChange={(e) => handlePricePerWattChange(e.target.value)}
//                       className="w-24 text-sm"
//                       placeholder="e.g., 50.5"
//                     />
//                     <span className="font-medium text-gray-700">₹/Watt</span>
//                   </div>
//                 </div>
//                 <div className="pt-3 border-t mt-3">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600">Base Price (excl. GST):</span>
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="number"
//                         value={result.basePrice.toFixed(0)}
//                         onChange={(e) => handleBasePriceChange(e.target.value)}
//                         className="w-32 text-sm"
//                         min="0"
//                         step="1"
//                       />
//                       <span className="font-semibold text-gray-900">₹</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600">GST @ 13.8%:</span>
//                     <span className="font-semibold text-gray-900">
//                       ₹{result.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-lg sm:text-xl pt-3 border-t mt-3">
//                   <span className="font-bold text-gray-800">Total Estimated Price:</span>
//                   <span className="font-extrabold text-xl sm:text-2xl text-green-600">
//                     ₹{result.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                   </span>
//                 </div>
//                 <Button
//                   onClick={() => setIsFormOpen(true)}
//                   size="lg"
//                   className="w-full mt-4 bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3"
//                 >
//                   Proceed to Get {company} Quote
//                 </Button>
//                 <p className="text-xs text-center text-gray-500 pt-2">
//                   {result.estimateBasis}. This is an estimate and is subject to final survey and terms.
//                 </p>
//               </div>
//             ) : (
//               <div className="text-center text-gray-500 py-8 sm:py-16">
//                 <p className="text-sm sm:text-base">Your detailed {company} quote will appear here.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </Card>
//       <CalculatorQuoteForm
//         open={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         quoteData={result}
//         productName={`${company} ${result?.actualSystemSizeKwp || kilowattInput || "Custom"} kWp Solar System`}
//         powerDemandKw={result?.userInputKw || parseFloat(kilowattInput) || null}
//         company={company}
//         mountingType={company === "Reliance" && isCommercialSize ? mountingType : null}
//       />
//     </>
//   )
// }

// // Reliance-specific table
// function RelianceGridTable({ data, largeData, onRowClick }: { data: GridTieSystemData[]; largeData: LargeSystemData[]; onRowClick: (product: any, type: string) => void }) {
//   const [sortField, setSortField] = useState<keyof GridTieSystemData | keyof LargeSystemData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof GridTieSystemData | keyof LargeSystemData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredGridData = data
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSize.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField as keyof GridTieSystemData]
//       const bValue = b[sortField as keyof GridTieSystemData]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   const filteredLargeData = largeData
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSizeKWp.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField as keyof LargeSystemData]
//       const bValue = b[sortField as keyof LargeSystemData]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
//       </div>
//       <div className="space-y-8">
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Residential Systems (≤ 10 kWp)</h3>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50">
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">No of Modules</TableHead>
//                   <TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//                   <TableHead className="font-semibold">Phase</TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedWithGst")} className="p-0 h-auto font-semibold">Price/Wp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredGridData.map((item) => (
//                   <TableRow key={item.slNo} className="hover:bg-gray-50">
//                     <TableCell className="font-medium">{item.slNo}</TableCell>
//                     <TableCell>{item.systemSize}</TableCell>
//                     <TableCell>{item.noOfModules}</TableCell>
//                     <TableCell>{item.inverterCapacity ?? "N/A"}</TableCell>
//                     <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                     <TableCell className="font-medium">₹{(item.hdgElevatedWithGst || 0).toFixed(2)}</TableCell>
//                     <TableCell className="font-bold text-green-600">₹{(item.hdgElevatedPrice || 0).toLocaleString("en-IN")}</TableCell>
//                     <TableCell><Button onClick={() => onRowClick(item, "grid")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold mb-4">
//   Commercial Systems (&gt; 10 kWp)
// </h3>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50">
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("systemSizeKWp")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">No of Modules</TableHead>
//                   <TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//                   <TableHead className="font-semibold">Phase</TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedRccPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (RCC Elevated, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("shortRailTinShedPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (Tin Shed, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("preGiMmsPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (Pre GI MMS, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("priceWithoutMmsPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (No MMS, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredLargeData.map((item) => (
//                   <TableRow key={item.slNo} className="hover:bg-gray-50">
//                     <TableCell className="font-medium">{item.slNo}</TableCell>
//                     <TableCell>{item.systemSizeKWp}</TableCell>
//                     <TableCell>{item.noOfModules}</TableCell>
//                     <TableCell>{item.inverterCapacity}</TableCell>
//                     <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                     <TableCell className="font-medium">₹{item.hdgElevatedRccPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.shortRailTinShedPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.preGiMmsPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.priceWithoutMmsPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell><Button onClick={() => onRowClick(item, "large")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Tata-specific table
// function TataGridTable({ data, onRowClick }: { data: TataGridData[]; onRowClick: (product: TataGridData) => void }) {
//   const [sortField, setSortField] = useState<keyof TataGridData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof TataGridData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredAndSortedData = data
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSize.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField]
//       const bValue = b[sortField]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
//       </div>
//       <div className="rounded-md border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead className="font-semibold">No of Modules</TableHead>
//               <TableHead className="font-semibold">Phase</TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("pricePerKwp")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("totalPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead className="font-semibold">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredAndSortedData.map((item) => (
//               <TableRow key={item.slNo} className="hover:bg-gray-50">
//                 <TableCell className="font-medium">{item.slNo}</TableCell>
//                 <TableCell>{item.systemSize}</TableCell>
//                 <TableCell>{item.noOfModules}</TableCell>
//                 <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                 <TableCell className="font-medium">₹{item.pricePerKwp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
//                 <TableCell className="font-bold text-green-600">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
//                 <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// // Shakti-specific table
// function ShaktiGridTable({ data, onRowClick }: { data: ShaktiGridData[]; onRowClick: (product: ShaktiGridData) => void }) {
//   const [sortField, setSortField] = useState<keyof ShaktiGridData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof ShaktiGridData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredAndSortedData = data
//     .filter(
//       (item) =>
//         item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.systemSize.toString().includes(searchTerm) ||
//         item.slNo.toString().includes(searchTerm),
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField]
//       const bValue = b[sortField]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input
//           placeholder="Search by phase, system size, or serial number..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>
//       <div className="rounded-md border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead className="font-semibold">No of Modules</TableHead>
//               <TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//               <TableHead className="font-semibold">Phase</TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("preGiElevatedWithGst")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("preGiElevatedPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead className="font-semibold">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredAndSortedData.map((item) => (
//               <TableRow key={item.slNo} className="hover:bg-gray-50">
//                 <TableCell className="font-medium">{item.slNo}</TableCell>
//                 <TableCell>{item.systemSize}</TableCell>
//                 <TableCell>{item.noOfModules}</TableCell>
//                 <TableCell>{item.inverterCapacity}</TableCell>
//                 <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                 <TableCell className="font-medium">₹{item.preGiElevatedWithGst.toFixed(2)}</TableCell>
//                 <TableCell className="font-bold text-green-600">₹{item.preGiElevatedPrice.toLocaleString("en-IN")}</TableCell>
//                 <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       {filteredAndSortedData.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No systems found matching your search criteria.</div>
//       )}
//     </div>
//   )
// }

// // Company sections
// const RelianceSection = ({ 
//   gridData, 
//   largeData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: GridTieSystemData[]; 
//   largeData: LargeSystemData[]; 
//   config: any; 
//   onRowClick: (product: any, type: string) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//     <div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">Reliance HJT Solar System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive pricing for {config.productDescription} and complete system packages</p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">710 Wp HJT Modules</Badge>
//         <Badge variant="secondary">Excluding GST</Badge>
//         <Badge variant="secondary">Net Metering Not Included</Badge>
//       </div>
//     </div>
//     <SolarQuoteCalculator
//       gridData={gridData}
//       largeData={largeData}
//       company="Reliance"
//       loading={loading}
//       productDescription={config.productDescription}
//       workScope="Complete system with installation"
//       panelWattage={710}
//       residentialThreshold={10}
//       hasMountingOptions={true}
//       systemSizeLimit={config.commercialLimit}
//     />
//     <Card className="bg-white">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <img src="/reliance-industries-ltd.png" alt="Reliance" className="h-5 w-auto" />
//           Solar Systems
//         </CardTitle>
//         <CardDescription>Complete solar systems with 710 Wp HJT modules and string inverters.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <RelianceGridTable data={gridData} largeData={largeData} onRowClick={onRowClick} />
//       </CardContent>
//     </Card>
//     <Card className="bg-gray-100">
//       <CardContent className="pt-6 text-center space-y-2">
//         <h3 className="text-lg font-semibold">Need a system larger than {config.commercialLimit} kWp?</h3>
//         <p className="text-gray-600">For utility-scale installations, please contact our sales team for customized pricing.</p>
//         <Button variant="outline" className="mt-4 border-gray-400 bg-transparent" onClick={() => {
//           const largeSystemProduct = { systemSize: 0, systemSizeKWp: 0, noOfModules: 0, inverterCapacity: 0, phase: "Three" }
//           onRowClick(largeSystemProduct, "commercial")
//         }} disabled={loading}>
//           Contact Sales Team
//         </Button>
//       </CardContent>
//     </Card>
//   </div>
// )

// const TataSection = ({ 
//   gridData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: TataGridData[]; 
//   config: any; 
//   onRowClick: (product: TataGridData) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//     <div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/Tata Power Solar.png" alt="Tata Power Solar Logo" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">{config.companyName} System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">{config.description} ({config.scope})</p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">550 Wp Modules</Badge>
//         <Badge variant="secondary">Including GST</Badge>
//         <Badge variant="secondary">String Inverters</Badge>
//       </div>
//     </div>
//     <SolarQuoteCalculator
//       gridData={gridData}
//       company="Tata"
//       loading={loading}
//       productDescription={config.description}
//       workScope={config.scope}
//       panelWattage={550}
//       residentialThreshold={15}
//       hasMountingOptions={false}
//     />
//     <Card className="bg-white">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <img src="/Tata Power Solar.png" alt="Tata" className="h-5 w-auto" />
//           Grid Tie Systems
//         </CardTitle>
//         <CardDescription>Complete solar systems with 550 Wp modules and string inverters.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <TataGridTable data={gridData} onRowClick={onRowClick} />
//       </CardContent>
//     </Card>
//   </div>
// )

// const ShaktiSection = ({ 
//   gridData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: ShaktiGridData[]; 
//   config: any; 
//   onRowClick: (product: ShaktiGridData) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//     <div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">{config.companyName} System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//         Grid Tie System - {config.productDescription} ({config.workScope})
//       </p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">535 Wp DCR RIL Modules</Badge>
//         <Badge variant="secondary">String Inverter Included</Badge>
//         <Badge variant="secondary">Civil Material Excluded</Badge>
//       </div>
//     </div>
//     <SolarQuoteCalculator
//       gridData={gridData}
//       company="Shakti"
//       loading={loading}
//       productDescription={config.productDescription}
//       workScope={config.workScope}
//       panelWattage={535}
//       residentialThreshold={10}
//       hasMountingOptions={false}
//     />
//     <Card className="bg-white">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-gray-900">
//           <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-5 w-auto" />
//           Grid Tie Systems - DCR RIL 535 Wp Modules
//         </CardTitle>
//         <CardDescription>
//           Complete solar systems with 535 Wp modules and string inverters. Single and three-phase options available. Civil material not included.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ShaktiGridTable data={gridData} onRowClick={onRowClick} />
//       </CardContent>
//     </Card>
//   </div>
// )

// // Main Products Page
// export default function Products() {
//   const [activeTab, setActiveTab] = useState("reliance")
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [relianceGridData, setRelianceGridData] = useState<GridTieSystemData[]>([])
//   const [relianceLargeData, setRelianceLargeData] = useState<LargeSystemData[]>([])
//   const [tataGridData, setTataGridData] = useState<TataGridData[]>([])
//   const [shaktiGridData, setShaktiGridData] = useState<ShaktiGridData[]>([])
//   const [relianceConfig, setRelianceConfig] = useState<any>({ productDescription: "RIL 690-720 Wp HJT Solar Modules", commercialLimit: 165.6 })
//   const [tataConfig, setTataConfig] = useState<any>({ companyName: "Tata Power Solar", description: "Complete solar systems", scope: "Turnkey installation" })
//   const [shaktiConfig, setShaktiConfig] = useState<any>({ companyName: "Shakti Solar", productDescription: "DCR RIL 535 Wp Modules with String Inverter", workScope: "Complete Work Excluding Civil Material" })
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<any>(null)
//   const [selectedCompany, setSelectedCompany] = useState<string>("")

//   useEffect(() => {
//     const loadAllData = async () => {
//       try {
//         // Reliance data
//         const [relianceGridRes, relianceLargeRes, relianceConfigRes] = await Promise.all([
//           supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('reliance_system_config').select('*'),
//         ])
//         if (relianceGridRes.error) throw new Error("Failed to fetch Reliance grid data")
//         if (relianceLargeRes.error) throw new Error("Failed to fetch Reliance large data")
//         if (relianceConfigRes.error) throw new Error("Failed to fetch Reliance config")
//         if (relianceGridRes.data) {
//           setRelianceGridData(relianceGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//             inverterCapacity: Number(r.inverter_capacity) || undefined,
//             phase: r.phase,
//             hdgElevatedWithGst: Number(r.price_per_watt ?? r.hdg_elevated_with_gst ?? 0),
//             hdgElevatedPrice: Number(r.hdg_elevated_price ?? 0),
//           })))
//         }
//         if (relianceLargeRes.data) {
//           setRelianceLargeData(relianceLargeRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSizeKWp: Number(r.system_size_kwp),
//             systemSizeKW: Number(r.system_size_kw),
//             noOfModules: r.no_of_modules,
//             inverterCapacity: Number(r.inverter_capacity),
//             phase: r.phase,
//             shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt),
//             shortRailTinShedPrice: Number(r.short_rail_tin_shed_price),
//             hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt),
//             hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price),
//             preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt),
//             preGiMmsPrice: Number(r.pre_gi_mms_price),
//             priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt),
//             priceWithoutMmsPrice: Number(r.price_without_mms_price),
//           })))
//         }
//         if (relianceConfigRes.data) {
//           const config = Object.fromEntries(relianceConfigRes.data.map((c: any) => [c.key, c.value]))
//           setRelianceConfig({
//             productDescription: config['PRODUCT_DESCRIPTION'] || "RIL 690-720 Wp HJT Solar Modules",
//             commercialLimit: parseFloat(config['COMMERCIAL_SYSTEM_SIZE_LIMIT']) || 165.6
//           })
//         }

//         // Tata data
//         const [tataGridRes, tataConfigRes] = await Promise.all([
//           supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('tata_config').select('*'),
//         ])
//         if (tataGridRes.error) throw new Error("Failed to fetch Tata grid data")
//         if (tataConfigRes.error) throw new Error("Failed to fetch Tata config")
//         if (tataGridRes.data) {
//           setTataGridData(tataGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//             phase: r.phase,
//             pricePerKwp: Number(r.price_per_kwp),
//             totalPrice: Number(r.total_price),
//           })))
//         }
//         if (tataConfigRes.data) {
//           const configMap = Object.fromEntries(tataConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
//           setTataConfig({
//             companyName: configMap['company_name'] || "Tata Power Solar",
//             description: configMap['product_description'] || "Complete solar systems",
//             scope: configMap['work_scope'] || "Turnkey installation"
//           })
//         }

//         // Shakti data
//         const [shaktiGridRes, shaktiConfigRes] = await Promise.all([
//           supabase.from('shakti_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('shakti_config').select('*'),
//         ])
//         if (shaktiGridRes.error) throw new Error("Failed to fetch Shakti grid data")
//         if (shaktiConfigRes.error) throw new Error("Failed to fetch Shakti config")
//         if (shaktiGridRes.data) {
//           setShaktiGridData(shaktiGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//             inverterCapacity: Number(r.inverter_capacity),
//             phase: r.phase,
//             preGiElevatedWithGst: Number(r.pre_gi_elevated_with_gst),
//             preGiElevatedPrice: Number(r.pre_gi_elevated_price),
//           })))
//         }
//         if (shaktiConfigRes.data) {
//           const config = Object.fromEntries(shaktiConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
//           setShaktiConfig({
//             companyName: config['company_name'] || "Shakti Solar",
//             productDescription: config['product_description'] || "DCR RIL 535 Wp Modules with String Inverter",
//             workScope: config['work_scope'] || "Complete Work Excluding Civil Material"
//           })
//         }
//       } catch (err) {
//         setError("Failed to load product data. Please try again later.")
//         console.error("Error loading data:", err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadAllData()
//   }, [])

//   const handleRelianceRowClick = (product: any, type: string) => {
//     setSelectedProduct({ ...product, type })
//     setSelectedCompany("Reliance")
//     setIsFormOpen(true)
//   }

//   const handleTataRowClick = (product: TataGridData) => {
//     setSelectedProduct(product)
//     setSelectedCompany("Tata")
//     setIsFormOpen(true)
//   }

//   const handleShaktiRowClick = (product: ShaktiGridData) => {
//     setSelectedProduct(product)
//     setSelectedCompany("Shakti")
//     setIsFormOpen(true)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <h1 className="text-4xl font-bold text-gray-900">Solar Products & Quote Calculator</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore solar systems from Reliance, Tata Power Solar, and Shakti Solar. Calculate instant quotes or browse available systems.</p>
//         </div>

//         {error && <div className="text-center text-red-500 py-4">{error}</div>}

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
//             <TabsTrigger value="reliance" className="flex items-center gap-2 justify-center">
//               <img src="/reliance-industries-ltd.png" alt="Reliance" className="h-6 w-auto" />
//               <span className="hidden sm:inline">Reliance</span>
//             </TabsTrigger>
//             <TabsTrigger value="tata" className="flex items-center gap-2 justify-center">
//               <img src="/Tata Power Solar.png" alt="Tata" className="h-6 w-auto" />
//               <span className="hidden sm:inline">Tata</span>
//             </TabsTrigger>
//             <TabsTrigger value="shakti" className="flex items-center gap-2 justify-center">
//               <img src="/Shakti Solar.png" alt="Shakti" className="h-6 w-auto" />
//               <span className="hidden sm:inline">Shakti</span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="reliance">
//             <RelianceSection 
//               gridData={relianceGridData} 
//               largeData={relianceLargeData}
//               config={relianceConfig}
//               onRowClick={handleRelianceRowClick}
//               loading={loading}
//             />
//           </TabsContent>

//           <TabsContent value="tata">
//             <TataSection 
//               gridData={tataGridData} 
//               config={tataConfig}
//               onRowClick={handleTataRowClick}
//               loading={loading}
//             />
//           </TabsContent>

//           <TabsContent value="shakti">
//             <ShaktiSection 
//               gridData={shaktiGridData} 
//               config={shaktiConfig}
//               onRowClick={handleShaktiRowClick}
//               loading={loading}
//             />
//           </TabsContent>
//         </Tabs>

//         <div className="text-center text-sm text-gray-500 border-t pt-8">
//           <p>All prices are subject to change. Contact us for the latest pricing and availability.</p>
//           <p className="mt-2">Reliance Industries Ltd. | Tata Power Solar | Shakti Solar | {new Date().getFullYear()}</p>
//         </div>

//         <CalculatorQuoteForm
//           open={isFormOpen}
//           onOpenChange={setIsFormOpen}
//           quoteData={selectedProduct?.type === "grid" || selectedProduct?.type === "large" || selectedProduct?.type === "commercial" ? null : selectedProduct}
//           productName={
//             selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0
//               ? `Large Scale ${selectedCompany} System`
//               : selectedProduct
//                 ? `${selectedCompany} ${selectedProduct.systemSize || selectedProduct.systemSizeKWp} kWp Solar System`
//                 : `${selectedCompany} Solar Product`
//           }
//           powerDemandKw={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0 ? null : (selectedProduct?.systemSize || selectedProduct?.systemSizeKWp || null)}
//           isLargeSystem={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0}
//           company={selectedCompany}
//           mountingType={selectedCompany === "Reliance" && (selectedProduct?.type === "large" || selectedProduct?.type === "commercial") ? "RCC Elevated" : null}
//         />
//       </div>
//     </div>
//   )
// }













// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Sparkles, Sun, Zap, RefreshCcw, BarChart, Loader2, Search, ArrowUpDown } from "lucide-react"
// import CalculatorQuoteForm from "@/components/forms/calculator-quote-form"
// import { supabase } from "@/integrations/supabase/client"

// // --- TYPES ---
// type GridTieSystemData = {
//   slNo: number;
//   systemSize: number;
//   noOfModules: number;
//   inverterCapacity?: number;
//   phase: string;
//   pricePerWatt?: number;
//   pricePerKwp?: number;
//   hdgElevatedWithGst?: number;
//   preGiElevatedWithGst?: number;
//   totalPrice?: number;
//   hdgElevatedPrice?: number;
//   preGiElevatedPrice?: number;
// }

// type LargeSystemData = {
//   slNo: number;
//   systemSizeKWp: number;
//   systemSizeKW: number;
//   noOfModules: number;
//   inverterCapacity: number;
//   phase: string;
//   shortRailTinShedPricePerWatt: number;
//   shortRailTinShedPrice: number;
//   hdgElevatedRccPricePerWatt: number;
//   hdgElevatedRccPrice: number;
//   preGiMmsPricePerWatt: number;
//   preGiMmsPrice: number;
//   priceWithoutMmsPricePerWatt: number;
//   priceWithoutMmsPrice: number;
// }

// interface CalculationResult {
//   userInputKw: number;
//   numberOfPanels: number;
//   actualSystemSizeKwp: number;
//   inverterSizeKw: number | null;
//   pricePerWatt: number;
//   basePrice: number;
//   gstAmount: number;
//   totalPrice: number;
//   estimateBasis: string;
//   company: string;
// }

// interface SolarQuoteCalculatorProps {
//   gridData: GridTieSystemData[];
//   largeData?: LargeSystemData[];
//   company: string;
//   loading: boolean;
//   productDescription?: string;
//   workScope?: string;
//   panelWattage: number;
//   residentialThreshold: number;
//   hasMountingOptions: boolean;
//   systemSizeLimit?: number;
// }

// type TataGridData = GridTieSystemData & {
//   pricePerKwp: number;
//   totalPrice: number;
// }

// type ShaktiGridData = GridTieSystemData & {
//   preGiElevatedWithGst: number;
//   preGiElevatedPrice: number;
//   inverterCapacity: number;
// }

// // Universal Solar Quote Calculator
// const SolarQuoteCalculator = ({ 
//   gridData, 
//   largeData, 
//   company, 
//   loading, 
//   productDescription = "", 
//   workScope = "", 
//   panelWattage, 
//   residentialThreshold,
//   hasMountingOptions,
//   systemSizeLimit
// }: SolarQuoteCalculatorProps) => {
//   const [kilowattInput, setKilowattInput] = useState<string>("")
//   const [result, setResult] = useState<CalculationResult | null>(null)
//   const [error, setError] = useState<string>("")
//   const [mountingType, setMountingType] = useState<string>("rcc-elevated")
//   const [isFormOpen, setIsFormOpen] = useState(false)

//   const RESIDENTIAL_THRESHOLD_KW = residentialThreshold

//   const handleCalculate = () => {
//     setError("")
//     const kw = parseFloat(kilowattInput)
//     if (isNaN(kw) || kw <= 0) {
//       setError("Please enter a valid power requirement (e.g., 5, 10.5).")
//       setResult(null)
//       return
//     }

//     if (company === "Reliance" && systemSizeLimit && kw > systemSizeLimit) {
//       setError(`${company} systems up to ${systemSizeLimit} kWp are available for instant calculation. For larger systems, please contact sales for a custom quote.`)
//       setResult(null)
//       return
//     }

//     let pricePerWatt = 0
//     let inverterSizeKw: number | null = kw
//     let estimateBasis = ""
//     if (kw <= RESIDENTIAL_THRESHOLD_KW) {
//       if (!gridData || gridData.length === 0) {
//         setError(`${company} residential pricing data is not available. Cannot calculate.`)
//         setResult(null)
//         return
//       }
//       const applicableSlabs = gridData.filter(slab => slab.systemSize <= kw)
//       let matchingSlab: GridTieSystemData
//       if (applicableSlabs.length > 0) {
//         matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
//       } else {
//         matchingSlab = gridData.reduce((prev, curr) => curr.systemSize < prev.systemSize ? curr : prev)
//       }
//       
//       if (matchingSlab.pricePerWatt) {
//         pricePerWatt = matchingSlab.pricePerWatt
//       } else if (matchingSlab.hdgElevatedWithGst) {
//         pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
//       } else if (matchingSlab.preGiElevatedWithGst) {
//         pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
//       } else if (matchingSlab.pricePerKwp) {
//         pricePerWatt = matchingSlab.pricePerKwp / 1000
//       } else {
//         setError("No valid pricing data found for the selected system size.")
//         setResult(null)
//         return
//       }
//       
//       inverterSizeKw = matchingSlab.inverterCapacity ?? null
//       estimateBasis = `Based on ${matchingSlab.systemSize} kWp ${company} Residential price slab`
//     } else {
//       if (company === "Reliance") {
//         if (!largeData || largeData.length === 0) {
//           setError(`${company} commercial pricing data is not available. Please contact sales for a custom quote.`)
//           setResult(null)
//           return
//         }
//         const applicableSlabs = largeData.filter(slab => slab.systemSizeKWp <= kw)
//         let matchingSlab: LargeSystemData
//         if (applicableSlabs.length > 0) {
//           matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSizeKWp > prev.systemSizeKWp ? curr : prev)
//         } else {
//           matchingSlab = largeData.reduce((prev, curr) => curr.systemSizeKWp < prev.systemSizeKWp ? curr : prev)
//         }
//         
//         if (hasMountingOptions) {
//           switch (mountingType) {
//             case 'tin-shed':
//               pricePerWatt = matchingSlab.shortRailTinShedPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Tin Shed) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'pre-gi-mms':
//               pricePerWatt = matchingSlab.preGiMmsPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Pre GI MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'without-mms':
//               pricePerWatt = matchingSlab.priceWithoutMmsPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (Without MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//             case 'rcc-elevated':
//             default:
//               pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
//               estimateBasis = `Based on ${company} Commercial (RCC Elevated) price slab >= ${matchingSlab.systemSizeKWp} kWp`
//               break
//           }
//         } else {
//           pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
//           estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSizeKWp} kWp`
//         }
//         inverterSizeKw = matchingSlab.inverterCapacity
//       } else {
//         if (!gridData || gridData.length === 0) {
//           setError(`${company} pricing data is not available. Cannot calculate.`)
//           setResult(null)
//           return
//         }
//         const matchingSlab = gridData.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
//         
//         if (matchingSlab.pricePerWatt) {
//           pricePerWatt = matchingSlab.pricePerWatt
//         } else if (matchingSlab.hdgElevatedWithGst) {
//           pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
//         } else if (matchingSlab.preGiElevatedWithGst) {
//           pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
//         } else if (matchingSlab.pricePerKwp) {
//           pricePerWatt = matchingSlab.pricePerKwp / 1000
//         } else {
//           setError("No valid pricing data found for the selected system size.")
//           setResult(null)
//           return
//         }
//         
//         inverterSizeKw = matchingSlab.inverterCapacity ?? kw
//         estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSize} kWp`
//       }
//     }
//     
//     const numberOfPanels = Math.ceil((kw * 1000) / panelWattage)
//     const actualSystemSizeWp = numberOfPanels * panelWattage
//     const actualSystemSizeKwp = parseFloat((actualSystemSizeWp / 1000).toFixed(2))

//     // --- CORRECTION START ---
//     // Correctly calculate prices based on company-specific rules derived from server.js
//     // Reliance rates are exclusive of GST.
//     // Tata/Shakti rates are inclusive of GST.
//     let basePrice = 0
//     let gstAmount = 0
//     let totalPrice = 0
//     const gstRate = 0.138

//     if (company === "Reliance") {
//       // For Reliance, pricePerWatt is a base rate (exclusive of GST).
//       basePrice = actualSystemSizeWp * pricePerWatt
//       gstAmount = basePrice * gstRate
//       totalPrice = basePrice + gstAmount
//     } else {
//       // For Tata & Shakti, the derived pricePerWatt is GST-inclusive.
//       // Calculate total price first, then back-calculate base and GST for display.
//       totalPrice = actualSystemSizeWp * pricePerWatt
//       basePrice = totalPrice / (1 + gstRate)
//       gstAmount = totalPrice - basePrice
//     }
//     // --- CORRECTION END ---

//     setResult({ 
//       userInputKw: kw, 
//       numberOfPanels, 
//       actualSystemSizeKwp, 
//       inverterSizeKw, 
//       pricePerWatt, 
//       basePrice, 
//       gstAmount, 
//       totalPrice, 
//       estimateBasis,
//       company 
//     })
//   }

//   const handlePricePerWattChange = (value: string) => {
//     setError("")
//     const newPricePerWatt = value === "" ? 0 : parseFloat(value)
//     if (isNaN(newPricePerWatt) || newPricePerWatt < 0) {
//       setError("Please enter a valid price per watt (e.g., 50 or 50.5).")
//       return
//     }
//     if (result) {
//       // --- CORRECTION START ---
//       const gstRate = 0.138
//       let newBasePrice = 0
//       let newGstAmount = 0
//       let newTotalPrice = 0

//       if (result.company === "Reliance") {
//         // For Reliance, the user is editing the BASE price per watt.
//         newBasePrice = result.actualSystemSizeKwp * 1000 * newPricePerWatt
//         newGstAmount = newBasePrice * gstRate
//         newTotalPrice = newBasePrice + newGstAmount
//       } else {
//         // For Tata/Shakti, the user is editing the TOTAL price per watt (inclusive).
//         newTotalPrice = result.actualSystemSizeKwp * 1000 * newPricePerWatt
//         newBasePrice = newTotalPrice / (1 + gstRate)
//         newGstAmount = newTotalPrice - newBasePrice
//       }
//       // --- CORRECTION END ---

//       setResult({
//         ...result,
//         pricePerWatt: newPricePerWatt,
//         basePrice: newBasePrice,
//         gstAmount: newGstAmount,
//         totalPrice: newTotalPrice,
//         estimateBasis: `${result.estimateBasis} (Price per watt modified)`
//       })
//     }
//   }

//   const handleBasePriceChange = (value: string) => {
//     setError("")
//     const newBasePrice = value === "" ? 0 : parseFloat(value)
//     if (isNaN(newBasePrice) || newBasePrice < 0) {
//       setError("Please enter a valid base price.")
//       return
//     }
//     if (result) {
//       const newPricePerWatt = newBasePrice / (result.actualSystemSizeKwp * 1000)
//       const newGstAmount = newBasePrice * 0.138
//       const newTotalPrice = newBasePrice + newGstAmount
//       setResult({
//         ...result,
//         pricePerWatt: newPricePerWatt,
//         basePrice: newBasePrice,
//         gstAmount: newGstAmount,
//         totalPrice: newTotalPrice,
//         estimateBasis: `${result.estimateBasis} (Base price modified)`
//       })
//     }
//   }

//   const handleKilowattInputChange = (value: string) => {
//     setKilowattInput(value)
//     if (value === "" || parseFloat(value) > 0) {
//       setError("")
//     }
//   }

//   const handleReset = () => {
//     setKilowattInput("")
//     setResult(null)
//     setError("")
//     setMountingType("rcc-elevated")
//   }

//   const isCommercialSize = parseFloat(kilowattInput) > RESIDENTIAL_THRESHOLD_KW

//   return (
//     <>
//       <Card className="bg-white shadow-lg border-blue-400 border-2 mb-8 overflow-hidden">
//         <CardHeader className="bg-gray-50/50 px-4 py-6 sm:px-6">
//           <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl text-gray-900">
//             <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//             Instant {company} Solar Quote Calculator
//           </CardTitle>
//           <CardDescription className="text-sm sm:text-base">
//             Get a dynamic price estimate for {productDescription}. {workScope}. 
//             {company === "Reliance" 
//               ? `For commercial quotes (>${RESIDENTIAL_THRESHOLD_KW} kW), select a mounting type.`
//               : `Commercial quotes (>${RESIDENTIAL_THRESHOLD_KW} kW) are calculated based on the highest available residential slab.`}
//           </CardDescription>
//         </CardHeader>
//         <div className="flex flex-col sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 sm:p-6 space-y-4">
//             <div>
//               <Label htmlFor="kilowatt-input" className="text-base sm:text-lg font-medium text-gray-800">
//                 Your Power Requirement (kW)
//               </Label>
//               <div className="flex items-center mt-2">
//                 <Input
//                   id="kilowatt-input"
//                   type="number"
//                   value={kilowattInput}
//                   onChange={(e) => handleKilowattInputChange(e.target.value)}
//                   placeholder={loading ? "Loading data..." : "e.g., 25"}
//                   className="text-base sm:text-lg w-full"
//                   disabled={loading}
//                   min="0"
//                   step="0.1"
//                 />
//               </div>
//             </div>
//             {hasMountingOptions && isCommercialSize && company === "Reliance" && (
//               <div className="animate-in fade-in-50 duration-500">
//                 <Label htmlFor="mounting-type" className="text-base sm:text-lg font-medium text-gray-800">
//                   Mounting Type (Commercial)
//                 </Label>
//                 <Select value={mountingType} onValueChange={setMountingType} disabled={loading}>
//                   <SelectTrigger className="w-full mt-2 text-base sm:text-lg">
//                     <SelectValue placeholder="Select a mounting type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="rcc-elevated">RCC Elevated</SelectItem>
//                     <SelectItem value="tin-shed">Tin Shed</SelectItem>
//                     <SelectItem value="pre-gi-mms">Pre GI MMS</SelectItem>
//                     <SelectItem value="without-mms">Without MMS</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//             <div className="flex flex-col sm:flex-row gap-4 pt-2">
//               <Button
//                 onClick={handleCalculate}
//                 size="lg"
//                 className="w-full bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Prices...
//                   </>
//                 ) : (
//                   <>
//                     <BarChart className="mr-2 h-4 w-4" /> Calculate
//                   </>
//                 )}
//               </Button>
//               <Button
//                 onClick={handleReset}
//                 size="lg"
//                 variant="outline"
//                 className="w-full text-base sm:text-lg py-2 sm:py-3"
//                 disabled={loading}
//               >
//                 <RefreshCcw className="mr-2 h-4 w-4" /> Reset
//               </Button>
//             </div>
//           </div>
//           <div className="bg-gray-50 p-4 sm:p-6 space-y-4 border-l md:border-l md:border-t-0 border-t">
//             <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4">
//               Your {company} Estimated Quote
//             </h3>
//             {result ? (
//               <div className="space-y-3 animate-in fade-in-50 duration-500">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                   <span className="text-gray-600 flex items-center gap-2">
//                     <Sun className="h-4 w-4 text-yellow-500" /> System Size:
//                   </span>
//                   <span className="font-bold text-gray-900">{result.actualSystemSizeKwp} kWp</span>
//                 </div>
//                 {result.inverterSizeKw !== null && (
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600 flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-blue-500" /> Recommended Inverter:
//                     </span>
//                     <span className="font-bold text-gray-900">{result.inverterSizeKw} kW</span>
//                   </div>
//                 )}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
//                   <span className="text-gray-500">Panel Configuration:</span>
//                   <span className="font-medium text-gray-700">
//                     {result.numberOfPanels} x {panelWattage}Wp Modules
//                   </span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm">
//                   <span className="text-gray-500">Pricing Basis:</span>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="text"
//                       value={result.pricePerWatt.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
//                       onChange={(e) => handlePricePerWattChange(e.target.value)}
//                       className="w-24 text-sm"
//                       placeholder="e.g., 50.5"
//                     />
//                     <span className="font-medium text-gray-700">₹/Watt</span>
//                   </div>
//                 </div>
//                 <div className="pt-3 border-t mt-3">
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600">Base Price (excl. GST):</span>
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="number"
//                         value={result.basePrice.toFixed(0)}
//                         onChange={(e) => handleBasePriceChange(e.target.value)}
//                         className="w-32 text-sm"
//                         min="0"
//                         step="1"
//                       />
//                       <span className="font-semibold text-gray-900">₹</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-md">
//                     <span className="text-gray-600">GST @ 13.8%:</span>
//                     <span className="font-semibold text-gray-900">
//                       ₹{result.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-lg sm:text-xl pt-3 border-t mt-3">
//                   <span className="font-bold text-gray-800">Total Estimated Price:</span>
//                   <span className="font-extrabold text-xl sm:text-2xl text-green-600">
//                     ₹{result.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                   </span>
//                 </div>
//                 <Button
//                   onClick={() => setIsFormOpen(true)}
//                   size="lg"
//                   className="w-full mt-4 bg-black hover:bg-gray-800 text-white text-base sm:text-lg py-2 sm:py-3"
//                 >
//                   Proceed to Get {company} Quote
//                 </Button>
//                 <p className="text-xs text-center text-gray-500 pt-2">
//                   {result.estimateBasis}. This is an estimate and is subject to final survey and terms.
//                 </p>
//               </div>
//             ) : (
//               <div className="text-center text-gray-500 py-8 sm:py-16">
//                 <p className="text-sm sm:text-base">Your detailed {company} quote will appear here.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </Card>
//       <CalculatorQuoteForm
//         open={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         quoteData={result}
//         productName={`${company} ${result?.actualSystemSizeKwp || kilowattInput || "Custom"} kWp Solar System`}
//         powerDemandKw={result?.userInputKw || parseFloat(kilowattInput) || null}
//         company={company}
//         mountingType={company === "Reliance" && isCommercialSize ? mountingType : null}
//       />
//     </>
//   )
// }

// // Reliance-specific table
// function RelianceGridTable({ data, largeData, onRowClick }: { data: GridTieSystemData[]; largeData: LargeSystemData[]; onRowClick: (product: any, type: string) => void }) {
//   const [sortField, setSortField] = useState<keyof GridTieSystemData | keyof LargeSystemData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof GridTieSystemData | keyof LargeSystemData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredGridData = data
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSize.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField as keyof GridTieSystemData]
//       const bValue = b[sortField as keyof GridTieSystemData]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   const filteredLargeData = largeData
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSizeKWp.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField as keyof LargeSystemData]
//       const bValue = b[sortField as keyof LargeSystemData]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
//       </div>
//       <div className="space-y-8">
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Residential Systems (≤ 10 kWp)</h3>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50">
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">No of Modules</TableHead>
//                   <TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//                   <TableHead className="font-semibold">Phase</TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedWithGst")} className="p-0 h-auto font-semibold">Price/Wp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredGridData.map((item) => (
//                   <TableRow key={item.slNo} className="hover:bg-gray-50">
//                     <TableCell className="font-medium">{item.slNo}</TableCell>
//                     <TableCell>{item.systemSize}</TableCell>
//                     <TableCell>{item.noOfModules}</TableCell>
//                     <TableCell>{item.inverterCapacity ?? "N/A"}</TableCell>
//                     <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                     <TableCell className="font-medium">₹{(item.hdgElevatedWithGst || 0).toFixed(2)}</TableCell>
//                     <TableCell className="font-bold text-green-600">₹{(item.hdgElevatedPrice || 0).toLocaleString("en-IN")}</TableCell>
//                     <TableCell><Button onClick={() => onRowClick(item, "grid")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold mb-4">
//   Commercial Systems (&gt; 10 kWp)
// </h3>
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50">
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("systemSizeKWp")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">No of Modules</TableHead>
//                   <TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//                   <TableHead className="font-semibold">Phase</TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("hdgElevatedRccPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (RCC Elevated, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("shortRailTinShedPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (Tin Shed, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("preGiMmsPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (Pre GI MMS, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead><Button variant="ghost" onClick={() => handleSort("priceWithoutMmsPricePerWatt")} className="p-0 h-auto font-semibold">Price/Wp (No MMS, ₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//                   <TableHead className="font-semibold">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//             	<TableBody>
//                 {filteredLargeData.map((item) => (
//                   <TableRow key={item.slNo} className="hover:bg-gray-50">
//                     <TableCell className="font-medium">{item.slNo}</TableCell>
//                     <TableCell>{item.systemSizeKWp}</TableCell>
//                     <TableCell>{item.noOfModules}</TableCell>
//                     <TableCell>{item.inverterCapacity}</TableCell>
//                     <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                     <TableCell className="font-medium">₹{item.hdgElevatedRccPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.shortRailTinShedPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.preGiMmsPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell className="font-medium">₹{item.priceWithoutMmsPricePerWatt.toFixed(2)}</TableCell>
//                     <TableCell><Button onClick={() => onRowClick(item, "large")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//                   </TableRow>
//                 ))}
//             	</TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Tata-specific table
// function TataGridTable({ data, onRowClick }: { data: TataGridData[]; onRowClick: (product: TataGridData) => void }) {
//   const [sortField, setSortField] = useState<keyof TataGridData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof TataGridData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredAndSortedData = data
//     .filter(item =>
//       item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.systemSize.toString().includes(searchTerm)
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField]
//       const bValue = b[sortField]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input placeholder="Search by phase or system size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
//       </div>
//       <div className="rounded-md border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//               <TableHead className="font-semibold">No of Modules</TableHead>
//               <TableHead className="font-semibold">Phase</TableHead>
//               <TableHead><Button variant="ghost" onClick={() => handleSort("pricePerKwp")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead><Button variant="ghost" onClick={() => handleSort("totalPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead className="font-semibold">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredAndSortedData.map((item) => (
//               <TableRow key={item.slNo} className="hover:bg-gray-50">
//                 <TableCell className="font-medium">{item.slNo}</TableCell>
//                 <TableCell>{item.systemSize}</TableCell>
//                 <TableCell>{item.noOfModules}</TableCell>
//                 <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                 <TableCell className="font-medium">₹{item.pricePerKwp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
//                 <TableCell className="font-bold text-green-600">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
//                 <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//             	</TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// // Shakti-specific table
// function ShaktiGridTable({ data, onRowClick }: { data: ShaktiGridData[]; onRowClick: (product: ShaktiGridData) => void }) {
//   const [sortField, setSortField] = useState<keyof ShaktiGridData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof ShaktiGridData) => {
//     const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
//     setSortField(field)
//     setSortDirection(newDirection)
//   }

//   const filteredAndSortedData = data
//     .filter(
//       (item) =>
//         item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.systemSize.toString().includes(searchTerm) ||
//         item.slNo.toString().includes(searchTerm),
//     )
//     .sort((a, b) => {
//       if (!sortField) return 0
//       const aValue = a[sortField]
//       const bValue = b[sortField]
//       let comparison = 0
//       if (typeof aValue === "number" && typeof bValue === "number") {
//         comparison = aValue > bValue ? 1 : -1
//       } else if (typeof aValue === "string" && typeof bValue === "string") {
//         comparison = aValue.localeCompare(bValue)
//       }
//       return sortDirection === "asc" ? comparison : -comparison
//     })

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-2">
//         <Search className="h-4 w-4 text-gray-400" />
//         <Input
//           placeholder="Search by phase, system size, or serial number..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>
//       <div className="rounded-md border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gray-50">
//               <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead className="font-semibold">No of Modules</TableHead>
//             	<TableHead className="font-semibold">Inverter Capacity (kW)</TableHead>
//             	<TableHead className="font-semibold">Phase</TableHead>
//             	<TableHead><Button variant="ghost" onClick={() => handleSort("preGiElevatedWithGst")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead><Button variant="ghost" onClick={() => handleSort("preGiElevatedPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             	<TableHead className="font-semibold">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredAndSortedData.map((item) => (
//               <TableRow key={item.slNo} className="hover:bg-gray-50">
//                 <TableCell className="font-medium">{item.slNo}</TableCell>
//                 <TableCell>{item.systemSize}</TableCell>
//                 <TableCell>{item.noOfModules}</TableCell>
//                 <TableCell>{item.inverterCapacity}</TableCell>
//                 <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//                 <TableCell className="font-medium">₹{item.preGiElevatedWithGst.toFixed(2)}</TableCell>
//                 <TableCell className="font-bold text-green-600">₹{item.preGiElevatedPrice.toLocaleString("en-IN")}</TableCell>
//                 <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//             	</TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       {filteredAndSortedData.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No systems found matching your search criteria.</div>
//       )}
//     </div>
//   )
// }

// // Company sections
// const RelianceSection = ({ 
//   gridData, 
//   largeData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: GridTieSystemData[]; 
//   largeData: LargeSystemData[]; 
//   config: any; 
//   onRowClick: (product: any, type: string) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//     <div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">Reliance HJT Solar System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive pricing for {config.productDescription} and complete system packages</p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">710 Wp HJT Modules</Badge>
//         <Badge variant="secondary">Excluding GST</Badge>
//         <Badge variant="secondary">Net Metering Not Included</Badge>
//       </div>
//     </div>
//     <SolarQuoteCalculator
//       gridData={gridData}
//       largeData={largeData}
//       company="Reliance"
//       loading={loading}
//       productDescription={config.productDescription}
//       workScope="Complete system with installation"
//       panelWattage={710}
//       residentialThreshold={10}
//       hasMountingOptions={true}
//       systemSizeLimit={config.commercialLimit}
//     />
//     <Card className="bg-white">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <img src="/reliance-industries-ltd.png" alt="Reliance" className="h-5 w-auto" />
//           Solar Systems
//         </CardTitle>
//         <CardDescription>Complete solar systems with 710 Wp HJT modules and string inverters.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <RelianceGridTable data={gridData} largeData={largeData} onRowClick={onRowClick} />
//       </CardContent>
//     </Card>
//   	<Card className="bg-gray-100">
//       <CardContent className="pt-6 text-center space-y-2">
//         <h3 className="text-lg font-semibold">Need a system larger than {config.commercialLimit} kWp?</h3>
//         <p className="text-gray-600">For utility-scale installations, please contact our sales team for customized pricing.</p>
//         <Button variant="outline" className="mt-4 border-gray-400 bg-transparent" onClick={() => {
//           const largeSystemProduct = { systemSize: 0, systemSizeKWp: 0, noOfModules: 0, inverterCapacity: 0, phase: "Three" }
//           onRowClick(largeSystemProduct, "commercial")
//         }} disabled={loading}>
//           Contact Sales Team
//         </Button>
//       </CardContent>
//   	</Card>
//   </div>
// )

// const TataSection = ({ 
//   gridData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: TataGridData[]; 
//   config: any; 
//   onRowClick: (product: TataGridData) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//   	<div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/Tata Power Solar.png" alt="Tata Power Solar Logo" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">{config.companyName} System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">{config.description} ({config.scope})</p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">550 Wp Modules</Badge>
//         <Badge variant="secondary">Including GST</Badge>
//         <Badge variant="secondary">String Inverters</Badge>
//       </div>
//   	</div>
//   	<SolarQuoteCalculator
//       gridData={gridData}
//       company="Tata"
//       loading={loading}
//       productDescription={config.description}
//       workScope={config.scope}
//       panelWattage={550}
//       residentialThreshold={15}
//       hasMountingOptions={false}
//   	/>
//   	<Card className="bg-white">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//         	<img src="/Tata Power Solar.png" alt="Tata" className="h-5 w-auto" />
//         	Grid Tie Systems
//         </CardTitle>
//         <CardDescription>Complete solar systems with 550 Wp modules and string inverters.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <TataGridTable data={gridData} onRowClick={onRowClick} />
//       </CardContent>
//   	</Card>
//   </div>
// )

// const ShaktiSection = ({ 
//   gridData, 
//   config, 
//   onRowClick,
//   loading 
// }: { 
//   gridData: ShaktiGridData[]; 
//   config: any; 
//   onRowClick: (product: ShaktiGridData) => void;
//   loading: boolean;
// }) => (
//   <div className="space-y-6">
//   	<div className="text-center space-y-4">
//       <div className="flex items-center justify-center gap-4 mb-4">
//         <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-12 w-auto" />
//         <h2 className="text-3xl font-bold text-gray-900">{config.companyName} System Pricing</h2>
//       </div>
//       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//       	Grid Tie System - {config.productDescription} ({config.workScope})
//       </p>
//       <div className="flex flex-wrap justify-center gap-2">
//         <Badge variant="secondary">535 Wp DCR RIL Modules</Badge>
//         <Badge variant="secondary">String Inverter Included</Badge>
//         <Badge variant="secondary">Civil Material Excluded</Badge>
//       </div>
//   	</div>
//   	<SolarQuoteCalculator
//       gridData={gridData}
//       company="Shakti"
//       loading={loading}
//       productDescription={config.productDescription}
//     	workScope={config.workScope}
//     	panelWattage={535}
//     	residentialThreshold={10}
//     	hasMountingOptions={false}
//   	/>
//   	<Card className="bg-white">
//     	<CardHeader>
//       	<CardTitle className="flex items-center gap-2 text-gray-900">
//         	<img src="/Shakti Solar.png" alt="Shakti Solar" className="h-5 w-auto" />
//         	Grid Tie Systems - DCR RIL 535 Wp Modules
//       	</CardTitle>
//       	<CardDescription>
//         	Complete solar systems with 535 Wp modules and string inverters. Single and three-phase options available. Civil material not included.
//       	</CardDescription>
//     	</CardHeader>
//     	<CardContent>
//       	<ShaktiGridTable data={gridData} onRowClick={onRowClick} />
//     	</CardContent>
//   	</Card>
//   </div>
// )

// // Main Products Page
// export default function Products() {
//   const [activeTab, setActiveTab] = useState("reliance")
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [relianceGridData, setRelianceGridData] = useState<GridTieSystemData[]>([])
//   const [relianceLargeData, setRelianceLargeData] = useState<LargeSystemData[]>([])
//   const [tataGridData, setTataGridData] = useState<TataGridData[]>([])
//   const [shaktiGridData, setShaktiGridData] = useState<ShaktiGridData[]>([])
//   const [relianceConfig, setRelianceConfig] = useState<any>({ productDescription: "RIL 690-720 Wp HJT Solar Modules", commercialLimit: 165.6 })
//   const [tataConfig, setTataConfig] = useState<any>({ companyName: "Tata Power Solar", description: "Complete solar systems", scope: "Turnkey installation" })
//   const [shaktiConfig, setShaktiConfig] = useState<any>({ companyName: "Shakti Solar", productDescription: "DCR RIL 535 Wp Modules with String Inverter", workScope: "Complete Work Excluding Civil Material" })
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<any>(null)
//   const [selectedCompany, setSelectedCompany] = useState<string>("")

//   useEffect(() => {
//     const loadAllData = async () => {
//       try {
//         // Reliance data
//         const [relianceGridRes, relianceLargeRes, relianceConfigRes] = await Promise.all([
//           supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('reliance_system_config').select('*'),
//         ])
//         if (relianceGridRes.error) throw new Error("Failed to fetch Reliance grid data")
//         if (relianceLargeRes.error) throw new Error("Failed to fetch Reliance large data")
//         if (relianceConfigRes.error) throw new Error("Failed to fetch Reliance config")
//         if (relianceGridRes.data) {
//           setRelianceGridData(relianceGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//           	inverterCapacity: Number(r.inverter_capacity) || undefined,
//           	phase: r.phase,
//           	hdgElevatedWithGst: Number(r.price_per_watt ?? r.hdg_elevated_with_gst ?? 0),
//           	hdgElevatedPrice: Number(r.hdg_elevated_price ?? 0),
//           })))
//         }
//         if (relianceLargeRes.data) {
//           setRelianceLargeData(relianceLargeRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSizeKWp: Number(r.system_size_kwp),
//             systemSizeKW: Number(r.system_size_kw),
//             noOfModules: r.no_of_modules,
//           	inverterCapacity: Number(r.inverter_capacity),
//           	phase: r.phase,
//           	shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt),
//           	shortRailTinShedPrice: Number(r.short_rail_tin_shed_price),
//           	hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt),
//           	hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price),
//           	preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt),
//           	preGiMmsPrice: Number(r.pre_gi_mms_price),
//           	priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt),
//           	priceWithoutMmsPrice: Number(r.price_without_mms_price),
//           })))
//         }
//         if (relianceConfigRes.data) {
//           const config = Object.fromEntries(relianceConfigRes.data.map((c: any) => [c.key, c.value]))
//         	setRelianceConfig({
//           	productDescription: config['PRODUCT_DESCRIPTION'] || "RIL 690-720 Wp HJT Solar Modules",
//           	commercialLimit: parseFloat(config['COMMERCIAL_SYSTEM_SIZE_LIMIT']) || 165.6
//         	})
//         }

//         // Tata data
//         const [tataGridRes, tataConfigRes] = await Promise.all([
//           supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('tata_config').select('*'),
//         ])
//         if (tataGridRes.error) throw new Error("Failed to fetch Tata grid data")
//         if (tataConfigRes.error) throw new Error("Failed to fetch Tata config")
//         if (tataGridRes.data) {
//           setTataGridData(tataGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//             phase: r.phase,
//             pricePerKwp: Number(r.price_per_kwp),
//             totalPrice: Number(r.total_price),
//           })))
//         }
//         if (tataConfigRes.data) {
//           const configMap = Object.fromEntries(tataConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
//         	setTataConfig({
//           	companyName: configMap['company_name'] || "Tata Power Solar",
//           	description: configMap['product_description'] || "Complete solar systems",
//           	scope: configMap['work_scope'] || "Turnkey installation"
//         	})
//         }

//         // Shakti data
//         const [shaktiGridRes, shaktiConfigRes] = await Promise.all([
//           supabase.from('shakti_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
//           supabase.from('shakti_config').select('*'),
//         ])
//         if (shaktiGridRes.error) throw new Error("Failed to fetch Shakti grid data")
//         if (shaktiConfigRes.error) throw new Error("Failed to fetch Shakti config")
//         if (shaktiGridRes.data) {
//           setShaktiGridData(shaktiGridRes.data.map((r: any) => ({
//             slNo: r.sl_no,
//             systemSize: Number(r.system_size),
//             noOfModules: r.no_of_modules,
//           	inverterCapacity: Number(r.inverter_capacity),
//           	phase: r.phase,
//           	preGiElevatedWithGst: Number(r.pre_gi_elevated_with_gst),
//           	preGiElevatedPrice: Number(r.pre_gi_elevated_price),
//           })))
//         }
//         if (shaktiConfigRes.data) {
//           const config = Object.fromEntries(shaktiConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
//         	setShaktiConfig({
//           	companyName: config['company_name'] || "Shakti Solar",
//           	productDescription: config['product_description'] || "DCR RIL 535 Wp Modules with String Inverter",
//           	workScope: config['work_scope'] || "Complete Work Excluding Civil Material"
//         	})
//         }
//       } catch (err) {
//       	setError("Failed to load product data. Please try again later.")
//     	console.error("Error loading data:", err)
//       } finally {
//     	setLoading(false)
//       }
//     }
//     loadAllData()
//   }, [])

//   const handleRelianceRowClick = (product: any, type: string) => {
//     setSelectedProduct({ ...product, type })
//     setSelectedCompany("Reliance")
//     setIsFormOpen(true)
//   }

//   const handleTataRowClick = (product: TataGridData) => {
//   	setSelectedProduct(product)
//   	setSelectedCompany("Tata")
//   	setIsFormOpen(true)
//   }

//   const handleShaktiRowClick = (product: ShaktiGridData) => {
//   	setSelectedProduct(product)
//   	setSelectedCompany("Shakti")
//   	setIsFormOpen(true)
//   }

//   return (
//   	<div className="min-h-screen bg-gray-50 p-4 md:p-8">
//   	<div className="max-w-7xl mx-auto space-y-8">
//     	<div className="text-center space-y-4">
//       	<h1 className="text-4xl font-bold text-gray-900">Solar Products & Quote Calculator</h1>
//       	<p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore solar systems from Reliance, Tata Power Solar, and Shakti Solar. Calculate instant quotes or browse available systems.</p>
//     	</div>

//     	{error && <div className="text-center text-red-500 py-4">{error}</div>}

//     	<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//       	<TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8">
//         	<TabsTrigger value="reliance" className="flex items-center gap-2 justify-center">
//           	<img src="/reliance-industries-ltd.png" alt="Reliance" className="h-6 w-auto" />
//           	<span className="hidden sm:inline">Reliance</span>
//         	</TabsTrigger>
//         	<TabsTrigger value="tata" className="flex items-center gap-2 justify-center">
//           	<img src="/Tata Power Solar.png" alt="Tata" className="h-6 w-auto" />
//           	<span className="hidden sm:inline">Tata</span>
//         	</TabsTrigger>
//         	<TabsTrigger value="shakti" className="flex items-center gap-2 justify-center">
//           	<img src="/Shakti Solar.png" alt="Shakti" className="h-6 w-auto" />
//           	<span className="hidden sm:inline">Shakti</span>
//         	</TabsTrigger>
//       	</TabsList>

//       	<TabsContent value="reliance">
//         	<RelianceSection 
//           	gridData={relianceGridData} 
//           	largeData={relianceLargeData}
//           	config={relianceConfig}
//           	onRowClick={handleRelianceRowClick}
//           	loading={loading}
//         	/>
//       	</TabsContent>

//       	<TabsContent value="tata">
//         	<TataSection 
//           	gridData={tataGridData} 
//           	config={tataConfig}
//           	onRowClick={handleTataRowClick}
//           	loading={loading}
//         	/>
//       	</TabsContent>

//       	<TabsContent value="shakti">
//         	<ShaktiSection 
//           	gridData={shaktiGridData} 
//           	config={shaktiConfig}
//           	onRowClick={handleShaktiRowClick}
//           	loading={loading}
//         	/>
//       	</TabsContent>
//     	</Tabs>

//     	<div className="text-center text-sm text-gray-500 border-t pt-8">
//       	<p>All prices are subject to change. Contact us for the latest pricing and availability.</p>
//       	<p className="mt-2">Reliance Industries Ltd. | Tata Power Solar | Shakti Solar | {new Date().getFullYear()}</p>
//     	</div>

//     	<CalculatorQuoteForm
//       	open={isFormOpen}
//       	onOpenChange={setIsFormOpen}
//       	quoteData={selectedProduct?.type === "grid" || selectedProduct?.type === "large" || selectedProduct?.type === "commercial" ? null : selectedProduct}
//       	productName={
//         	selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0
//           	? `Large Scale ${selectedCompany} System`
//           	: selectedProduct
//             	? `${selectedCompany} ${selectedProduct.systemSize || selectedProduct.systemSizeKWp} kWp Solar System`
//             	: `${selectedCompany} Solar Product`
//       	}
//       	powerDemandKw={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0 ? null : (selectedProduct?.systemSize || selectedProduct?.systemSizeKWp || null)}
//       	isLargeSystem={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0}
//       	company={selectedCompany}
//       	mountingType={selectedCompany === "Reliance" && (selectedProduct?.type === "large" || selectedProduct?.type === "commercial") ? "RCC Elevated" : null}
//     	/>
//   	</div>
//   	</div>
//   )
// }








"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Sun, Zap, RefreshCcw, BarChart, Loader2, Search, ArrowUpDown } from "lucide-react"

// Mock Supabase client for testing
const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({
        data: [], // Mock empty data; replace with actual Supabase response
        error: null,
      }),
    }),
  }),
}

// Mock data for testing
const mockRelianceGridData: GridTieSystemData[] = [
  { slNo: 1, systemSize: 5, noOfModules: 7, inverterCapacity: 5, phase: "Single", hdgElevatedWithGst: 70, hdgElevatedPrice: 350000 },
  { slNo: 2, systemSize: 10, noOfModules: 14, inverterCapacity: 10, phase: "Three", hdgElevatedWithGst: 65, hdgElevatedPrice: 650000 },
]

const mockRelianceLargeData: LargeSystemData[] = [
  {
    slNo: 1,
    systemSizeKWp: 20,
    systemSizeKW: 20,
    noOfModules: 28,
    inverterCapacity: 20,
    phase: "Three",
    shortRailTinShedPricePerWatt: 60,
    shortRailTinShedPrice: 1200000,
    hdgElevatedRccPricePerWatt: 65,
    hdgElevatedRccPrice: 1300000,
    preGiMmsPricePerWatt: 62,
    preGiMmsPrice: 1240000,
    priceWithoutMmsPricePerWatt: 58,
    priceWithoutMmsPrice: 1160000,
  },
]

const mockTataGridData: TataGridData[] = [
  { slNo: 1, systemSize: 5, noOfModules: 9, phase: "Single", pricePerKwp: 70000, totalPrice: 350000 },
  { slNo: 2, systemSize: 15, noOfModules: 27, phase: "Three", pricePerKwp: 65000, totalPrice: 975000 },
]

const mockShaktiGridData: ShaktiGridData[] = [
  { slNo: 1, systemSize: 5, noOfModules: 9, inverterCapacity: 5, phase: "Single", preGiElevatedWithGst: 68000, preGiElevatedPrice: 340000 },
  { slNo: 2, systemSize: 10, noOfModules: 19, inverterCapacity: 10, phase: "Three", preGiElevatedWithGst: 64000, preGiElevatedPrice: 640000 },
]

// --- TYPES ---
type GridTieSystemData = {
  slNo: number;
  systemSize: number;
  noOfModules: number;
  inverterCapacity?: number;
  phase: string;
  pricePerWatt?: number;
  pricePerKwp?: number;
  hdgElevatedWithGst?: number;
  preGiElevatedWithGst?: number;
  totalPrice?: number;
  hdgElevatedPrice?: number;
  preGiElevatedPrice?: number;
}

type LargeSystemData = {
  slNo: number;
  systemSizeKWp: number;
  systemSizeKW: number;
  noOfModules: number;
  inverterCapacity: number;
  phase: string;
  shortRailTinShedPricePerWatt: number;
  shortRailTinShedPrice: number;
  hdgElevatedRccPricePerWatt: number;
  hdgElevatedRccPrice: number;
  preGiMmsPricePerWatt: number;
  preGiMmsPrice: number;
  priceWithoutMmsPricePerWatt: number;
  priceWithoutMmsPrice: number;
}

interface CalculationResult {
  userInputKw: number;
  numberOfPanels: number;
  actualSystemSizeKwp: number;
  inverterSizeKw: number | null;
  pricePerWatt: number;
  basePrice: number;
  gstAmount: number;
  totalPrice: number;
  estimateBasis: string;
  company: string;
}

interface SolarQuoteCalculatorProps {
  gridData: GridTieSystemData[];
  largeData?: LargeSystemData[];
  company: string;
  loading: boolean;
  productDescription?: string;
  workScope?: string;
  panelWattage: number;
  residentialThreshold: number;
  hasMountingOptions: boolean;
  systemSizeLimit?: number;
}

type TataGridData = GridTieSystemData & {
  pricePerKwp: number;
  totalPrice: number;
}

type ShaktiGridData = GridTieSystemData & {
  preGiElevatedWithGst: number;
  preGiElevatedPrice: number;
  inverterCapacity: number;
}

// CalculatorQuoteForm Component
const CalculatorQuoteForm = ({
  open,
  onOpenChange,
  quoteData,
  productName,
  powerDemandKw,
  company,
  mountingType,
  isLargeSystem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteData: CalculationResult | null;
  productName: string;
  powerDemandKw: number | null;
  company: string;
  mountingType: string | null;
  isLargeSystem?: boolean;
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [formError, setFormError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setFormError("Please fill in all fields.");
      return;
    }
    console.log("Form submitted:", { name, email, phone, quoteData, productName, powerDemandKw, company, mountingType });
    setName("");
    setEmail("");
    setPhone("");
    setFormError("");
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-white max-w-md w-full mx-4 p-4">
        <CardHeader className="px-3 py-2">
          <CardTitle className="text-lg">Request {company} Quote</CardTitle>
          <CardDescription className="text-sm">{productName}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="text-sm"
              />
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {quoteData && (
              <div className="text-sm space-y-2">
                <p><strong>System Size:</strong> {quoteData.actualSystemSizeKwp} kWp</p>
                <p><strong>Power Demand:</strong> {powerDemandKw} kW</p>
                <p><strong>Total Price:</strong> ₹{quoteData.totalPrice.toLocaleString("en-IN")}</p>
                {mountingType && <p><strong>Mounting Type:</strong> {mountingType}</p>}
                {isLargeSystem && <p className="text-gray-500">Large system: Custom quote required.</p>}
              </div>
            )}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="w-full text-sm">
                Submit Request
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full text-sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Universal Solar Quote Calculator
const SolarQuoteCalculator = ({ 
  gridData, 
  largeData, 
  company, 
  loading, 
  productDescription = "", 
  workScope = "", 
  panelWattage, 
  residentialThreshold,
  hasMountingOptions,
  systemSizeLimit
}: SolarQuoteCalculatorProps) => {
  const [kilowattInput, setKilowattInput] = useState<string>("")
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState<string>("")
  const [mountingType, setMountingType] = useState<string>("rcc-elevated")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const RESIDENTIAL_THRESHOLD_KW = residentialThreshold

  const handleCalculate = () => {
    setError("")
    const kw = parseFloat(kilowattInput)
    if (isNaN(kw) || kw <= 0) {
      setError("Please enter a valid power requirement (e.g., 5, 10.5).")
      setResult(null)
      return
    }

    if (company === "Reliance" && systemSizeLimit && kw > systemSizeLimit) {
      setError(`${company} systems up to ${systemSizeLimit} kWp are available for instant calculation. For larger systems, please contact sales for a custom quote.`)
      setResult(null)
      return
    }

    let pricePerWatt = 0
    let inverterSizeKw: number | null = kw
    let estimateBasis = ""
    if (kw <= RESIDENTIAL_THRESHOLD_KW) {
      if (!gridData || gridData.length === 0) {
        setError(`${company} residential pricing data is not available. Cannot calculate.`)
        setResult(null)
        return
      }
      const applicableSlabs = gridData.filter(slab => slab.systemSize <= kw)
      let matchingSlab: GridTieSystemData
      if (applicableSlabs.length > 0) {
        matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
      } else {
        matchingSlab = gridData.reduce((prev, curr) => curr.systemSize < prev.systemSize ? curr : prev)
      }
      
      if (matchingSlab.pricePerWatt) {
        pricePerWatt = matchingSlab.pricePerWatt
      } else if (matchingSlab.hdgElevatedWithGst) {
        pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
      } else if (matchingSlab.preGiElevatedWithGst) {
        pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
      } else if (matchingSlab.pricePerKwp) {
        pricePerWatt = matchingSlab.pricePerKwp / 1000
      } else {
        setError("No valid pricing data found for the selected system size.")
        setResult(null)
        return
      }
      
      inverterSizeKw = matchingSlab.inverterCapacity ?? null
      estimateBasis = `Based on ${matchingSlab.systemSize} kWp ${company} Residential price slab`
    } else {
      if (company === "Reliance") {
        if (!largeData || largeData.length === 0) {
          setError(`${company} commercial pricing data is not available. Please contact sales for a custom quote.`)
          setResult(null)
          return
        }
        const applicableSlabs = largeData.filter(slab => slab.systemSizeKWp <= kw)
        let matchingSlab: LargeSystemData
        if (applicableSlabs.length > 0) {
          matchingSlab = applicableSlabs.reduce((prev, curr) => curr.systemSizeKWp > prev.systemSizeKWp ? curr : prev)
        } else {
          matchingSlab = largeData.reduce((prev, curr) => curr.systemSizeKWp < prev.systemSizeKWp ? curr : prev)
        }
        
        if (hasMountingOptions) {
          switch (mountingType) {
            case 'tin-shed':
              pricePerWatt = matchingSlab.shortRailTinShedPricePerWatt
              estimateBasis = `Based on ${company} Commercial (Tin Shed) price slab >= ${matchingSlab.systemSizeKWp} kWp`
              break
            case 'pre-gi-mms':
              pricePerWatt = matchingSlab.preGiMmsPricePerWatt
              estimateBasis = `Based on ${company} Commercial (Pre GI MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
              break
            case 'without-mms':
              pricePerWatt = matchingSlab.priceWithoutMmsPricePerWatt
              estimateBasis = `Based on ${company} Commercial (Without MMS) price slab >= ${matchingSlab.systemSizeKWp} kWp`
              break
            case 'rcc-elevated':
            default:
              pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
              estimateBasis = `Based on ${company} Commercial (RCC Elevated) price slab >= ${matchingSlab.systemSizeKWp} kWp`
              break
          }
        } else {
          pricePerWatt = matchingSlab.hdgElevatedRccPricePerWatt
          estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSizeKWp} kWp`
        }
        inverterSizeKw = matchingSlab.inverterCapacity
      } else {
        if (!gridData || gridData.length === 0) {
          setError(`${company} pricing data is not available. Cannot calculate.`)
          setResult(null)
          return
        }
        const matchingSlab = gridData.reduce((prev, curr) => curr.systemSize > prev.systemSize ? curr : prev)
        
        if (matchingSlab.pricePerWatt) {
          pricePerWatt = matchingSlab.pricePerWatt
        } else if (matchingSlab.hdgElevatedWithGst) {
          pricePerWatt = matchingSlab.hdgElevatedWithGst / 1000
        } else if (matchingSlab.preGiElevatedWithGst) {
          pricePerWatt = matchingSlab.preGiElevatedWithGst / 1000
        } else if (matchingSlab.pricePerKwp) {
          pricePerWatt = matchingSlab.pricePerKwp / 1000
        } else {
          setError("No valid pricing data found for the selected system size.")
          setResult(null)
          return
        }
        
        inverterSizeKw = matchingSlab.inverterCapacity ?? kw
        estimateBasis = `Based on ${company} Commercial price slab >= ${matchingSlab.systemSize} kWp`
      }
    }
    
    const numberOfPanels = Math.ceil((kw * 1000) / panelWattage)
    const actualSystemSizeWp = numberOfPanels * panelWattage
    const actualSystemSizeKwp = parseFloat((actualSystemSizeWp / 1000).toFixed(2))

    let basePrice = 0
    let gstAmount = 0
    let totalPrice = 0
    const gstRate = 0.138

    if (company === "Reliance") {
      basePrice = actualSystemSizeWp * pricePerWatt
      gstAmount = basePrice * gstRate
      totalPrice = basePrice + gstAmount
    } else {
      totalPrice = actualSystemSizeWp * pricePerWatt
      basePrice = totalPrice / (1 + gstRate)
      gstAmount = totalPrice - basePrice
    }

    setResult({ 
      userInputKw: kw, 
      numberOfPanels, 
      actualSystemSizeKwp, 
      inverterSizeKw, 
      pricePerWatt, 
      basePrice, 
      gstAmount, 
      totalPrice, 
      estimateBasis,
      company 
    })
  }

  const handlePricePerWattChange = (value: string) => {
    setError("")
    const newPricePerWatt = value === "" ? 0 : parseFloat(value)
    if (isNaN(newPricePerWatt) || newPricePerWatt < 0) {
      setError("Please enter a valid price per watt (e.g., 50 or 50.5).")
      return
    }
    if (result) {
      const gstRate = 0.138
      let newBasePrice = 0
      let newGstAmount = 0
      let newTotalPrice = 0

      if (result.company === "Reliance") {
        newBasePrice = result.actualSystemSizeKwp * 1000 * newPricePerWatt
        newGstAmount = newBasePrice * gstRate
        newTotalPrice = newBasePrice + newGstAmount
      } else {
        newTotalPrice = result.actualSystemSizeKwp * 1000 * newPricePerWatt
        newBasePrice = newTotalPrice / (1 + gstRate)
        newGstAmount = newTotalPrice - newBasePrice
      }

      setResult({
        ...result,
        pricePerWatt: newPricePerWatt,
        basePrice: newBasePrice,
        gstAmount: newGstAmount,
        totalPrice: newTotalPrice,
        estimateBasis: `${result.estimateBasis} (Price per watt modified)`
      })
    }
  }

  const handleBasePriceChange = (value: string) => {
    setError("")
    const newBasePrice = value === "" ? 0 : parseFloat(value)
    if (isNaN(newBasePrice) || newBasePrice < 0) {
      setError("Please enter a valid base price.")
      return
    }
    if (result) {
      const newPricePerWatt = newBasePrice / (result.actualSystemSizeKwp * 1000)
      const newGstAmount = newBasePrice * 0.138
      const newTotalPrice = newBasePrice + newGstAmount
      setResult({
        ...result,
        pricePerWatt: newPricePerWatt,
        basePrice: newBasePrice,
        gstAmount: newGstAmount,
        totalPrice: newTotalPrice,
        estimateBasis: `${result.estimateBasis} (Base price modified)`
      })
    }
  }

  const handleKilowattInputChange = (value: string) => {
    setKilowattInput(value)
    if (value === "" || parseFloat(value) > 0) {
      setError("")
    }
  }

  const handleReset = () => {
    setKilowattInput("")
    setResult(null)
    setError("")
    setMountingType("rcc-elevated")
  }

  const isCommercialSize = parseFloat(kilowattInput) > RESIDENTIAL_THRESHOLD_KW

  return (
    <>
      <Card className="bg-white shadow-md border-gray-200 mb-4">
        <CardHeader className="px-3 py-2 bg-gray-50">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <Sparkles className="h-4 w-4 text-blue-500" />
            {company} Solar Calculator
          </CardTitle>
          <CardDescription className="text-sm">{productDescription}. {workScope}.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 space-y-3">
              <div>
                <Label htmlFor="kilowatt-input" className="text-sm font-medium text-gray-800">
                  Power Requirement (kW)
                </Label>
                <Input
                  id="kilowatt-input"
                  type="number"
                  value={kilowattInput}
                  onChange={(e) => handleKilowattInputChange(e.target.value)}
                  placeholder={loading ? "Loading..." : "e.g., 25"}
                  className="text-sm w-full mt-1"
                  disabled={loading}
                  min="0"
                  step="0.1"
                />
              </div>
              {hasMountingOptions && isCommercialSize && company === "Reliance" && (
                <div>
                  <Label htmlFor="mounting-type" className="text-sm font-medium text-gray-800">
                    Mounting Type (Commercial)
                  </Label>
                  <Select value={mountingType} onValueChange={setMountingType} disabled={loading}>
                    <SelectTrigger className="w-full mt-1 text-sm">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button
                  onClick={handleCalculate}
                  size="sm"
                  className="w-full bg-black text-white text-sm"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <BarChart className="mr-2 h-3 w-3" />}
                  Calculate
                </Button>
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                  className="w-full text-sm"
                  disabled={loading}
                >
                  <RefreshCcw className="mr-2 h-3 w-3" /> Reset
                </Button>
              </div>
            </div>
            <div className="flex-1 border-t md:border-t-0 md:border-l p-3">
              <h3 className="text-base font-bold text-center text-gray-800 mb-3">
                Your {company} Quote
              </h3>
              {result ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Sun className="h-3 w-3 text-yellow-500" /> System Size:
                    </span>
                    <span className="font-bold">{result.actualSystemSizeKwp} kWp</span>
                  </div>
                  {result.inverterSizeKw !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-blue-500" /> Inverter:
                      </span>
                      <span className="font-bold">{result.inverterSizeKw} kW</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Panels:</span>
                    <span>{result.numberOfPanels} x {panelWattage}Wp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price/Watt:</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={result.pricePerWatt.toFixed(2)}
                        onChange={(e) => handlePricePerWattChange(e.target.value)}
                        className="w-20 text-sm"
                        min="0"
                        step="0.01"
                      />
                      <span>₹/Watt</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={result.basePrice.toFixed(0)}
                          onChange={(e) => handleBasePriceChange(e.target.value)}
                          className="w-28 text-sm"
                          min="0"
                          step="1"
                        />
                        <span>₹</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (13.8%):</span>
                      <span>₹{result.gstAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-green-600">₹{result.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    size="sm"
                    className="w-full mt-3 bg-black text-white text-sm"
                  >
                    Get Quote
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-2">{result.estimateBasis}</p>
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">
                  Enter power requirement to see quote.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <CalculatorQuoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        quoteData={result}
        productName={`${company} ${result?.actualSystemSizeKwp || kilowattInput || "Custom"} kWp Solar System`}
        powerDemandKw={result?.userInputKw || parseFloat(kilowattInput) || null}
        company={company}
        mountingType={company === "Reliance" && isCommercialSize ? mountingType : null}
      />
    </>
  )
}

// Reliance-specific table
function RelianceGridTable({ data, largeData, onRowClick }: { data: GridTieSystemData[]; largeData: LargeSystemData[]; onRowClick: (product: any, type: string) => void }) {
  const [sortField, setSortField] = useState<keyof GridTieSystemData | keyof LargeSystemData | null>("slNo")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field: keyof GridTieSystemData | keyof LargeSystemData) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
  }

  const filteredGridData = data
    .filter(item =>
      item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemSize.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField as keyof GridTieSystemData]
      const bValue = b[sortField as keyof GridTieSystemData]
      let comparison = 0
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  const filteredLargeData = largeData
    .filter(item =>
      item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemSizeKWp.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField as keyof LargeSystemData]
      const bValue = b[sortField as keyof LargeSystemData]
      let comparison = 0
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input placeholder="Search by phase or size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs text-sm" />
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold mb-2">Residential Systems (≤ 10 kWp)</h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 text-sm">Sl No.<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
                  <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 text-sm">Size (kWp)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
                  <TableHead className="text-sm hidden sm:table-cell">Modules</TableHead>
                  <TableHead className="text-sm hidden sm:table-cell">Inverter (kW)</TableHead>
                  <TableHead className="text-sm">Phase</TableHead>
                  <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("hdgElevatedPrice")} className="p-0 text-sm">Price (₹)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
                  <TableHead className="text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGridData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-gray-500">No residential systems available.</TableCell>
                  </TableRow>
                ) : (
                  filteredGridData.map((item) => (
                    <TableRow key={item.slNo} className="hover:bg-gray-50">
                      <TableCell className="text-sm">{item.slNo}</TableCell>
                      <TableCell className="text-sm">{item.systemSize}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{item.noOfModules}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{item.inverterCapacity ?? "N/A"}</TableCell>
                      <TableCell className="text-sm"><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
                      <TableCell className="text-sm text-green-600">₹{(item.hdgElevatedPrice || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell><Button onClick={() => onRowClick(item, "grid")} size="sm" className="text-sm">Get Quote</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-2">Commercial Systems (> 10 kWp)</h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 text-sm">Sl No.<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
                  <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("systemSizeKWp")} className="p-0 text-sm">Size (kWp

)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
                  <TableHead className="text-sm hidden sm:table-cell">Modules</TableHead>
                  <TableHead className="text-sm hidden sm:table-cell">Inverter (kW)</TableHead>
                  <TableHead className="text-sm">Phase</TableHead>
                  <TableHead className="text-sm hidden md:table-cell">RCC Elevated (₹/Wp)</TableHead>
                  <TableHead className="text-sm hidden md:table-cell">Tin Shed (₹/Wp)</TableHead>
                  <TableHead className="text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLargeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-gray-500">No commercial systems available.</TableCell>
                  </TableRow>
                ) : (
                  filteredLargeData.map((item) => (
                    <TableRow key={item.slNo} className="hover:bg-gray-50">
                      <TableCell className="text-sm">{item.slNo}</TableCell>
                      <TableCell className="text-sm">{item.systemSizeKWp}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{item.noOfModules}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{item.inverterCapacity}</TableCell>
                      <TableCell className="text-sm"><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
                      <TableCell className="text-sm hidden md:table-cell">₹{item.hdgElevatedRccPricePerWatt.toFixed(2)}</TableCell>
                      <TableCell className="text-sm hidden md:table-cell">₹{item.shortRailTinShedPricePerWatt.toFixed(2)}</TableCell>
                      <TableCell><Button onClick={() => onRowClick(item, "large")} size="sm" className="text-sm">Get Quote</Button></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tata-specific table
function TataGridTable({ data, onRowClick }: { data: TataGridData[]; onRowClick: (product: TataGridData) => void }) {
  const [sortField, setSortField] = useState<keyof TataGridData | null>("slNo")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field: keyof TataGridData) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
  }

  const filteredAndSortedData = data
    .filter(item =>
      item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemSize.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
      let comparison = 0
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input placeholder="Search by phase or size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs text-sm" />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 text-sm">Sl No.<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 text-sm">Size (kWp)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm hidden sm:table-cell">Modules</TableHead>
              <TableHead className="text-sm">Phase</TableHead>
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("totalPrice")} className="p-0 text-sm">Price (₹)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-gray-500">No systems available.</TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((item) => (
                <TableRow key={item.slNo} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{item.slNo}</TableCell>
                  <TableCell className="text-sm">{item.systemSize}</TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{item.noOfModules}</TableCell>
                  <TableCell className="text-sm"><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
                  <TableCell className="text-sm text-green-600">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
                  <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="text-sm">Get Quote</Button></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Shakti-specific table
function ShaktiGridTable({ data, onRowClick }: { data: ShaktiGridData[]; onRowClick: (product: ShaktiGridData) => void }) {
  const [sortField, setSortField] = useState<keyof ShaktiGridData | null>("slNo")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field: keyof ShaktiGridData) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)
  }

  const filteredAndSortedData = data
    .filter(
      (item) =>
        item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.systemSize.toString().includes(searchTerm) ||
        item.slNo.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0
      const aValue = a[sortField]
      const bValue = b[sortField]
      let comparison = 0
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by phase, size, or serial..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs text-sm"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 text-sm">Sl No.<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 text-sm">Size (kWp)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm hidden sm:table-cell">Modules</TableHead>
              <TableHead className="text-sm hidden sm:table-cell">Inverter (kW)</TableHead>
              <TableHead className="text-sm">Phase</TableHead>
              <TableHead className="text-sm"><Button variant="ghost" onClick={() => handleSort("preGiElevatedPrice")} className="p-0 text-sm">Price (₹)<ArrowUpDown className="ml-1 h-3 w-3" /></Button></TableHead>
              <TableHead className="text-sm">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-gray-500">No systems available.</TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((item) => (
                <TableRow key={item.slNo} className="hover:bg-gray-50">
                  <TableCell className="text-sm">{item.slNo}</TableCell>
                  <TableCell className="text-sm">{item.systemSize}</TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{item.noOfModules}</TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{item.inverterCapacity}</TableCell>
                  <TableCell className="text-sm"><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
                  <TableCell className="text-sm text-green-600">₹{item.preGiElevatedPrice.toLocaleString("en-IN")}</TableCell>
                  <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="text-sm">Get Quote</Button></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Company sections
const RelianceSection = ({ 
  gridData, 
  largeData, 
  config, 
  onRowClick,
  loading 
}: { 
  gridData: GridTieSystemData[]; 
  largeData: LargeSystemData[]; 
  config: any; 
  onRowClick: (product: any, type: string) => void;
  loading: boolean;
}) => (
  <div className="space-y-4">
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <img src="/reliance-industries-ltd.png" alt="Reliance Solar" className="h-8 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
        <h2 className="text-2xl font-bold text-gray-900">Reliance Solar Pricing</h2>
      </div>
      <p className="text-base text-gray-600 max-w-xl mx-auto">{config.productDescription}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="secondary">710 Wp HJT Modules</Badge>
        <Badge variant="secondary">Excluding GST</Badge>
      </div>
    </div>
    <SolarQuoteCalculator
      gridData={gridData}
      largeData={largeData}
      company="Reliance"
      loading={loading}
      productDescription={config.productDescription}
      workScope="Complete system with installation"
      panelWattage={710}
      residentialThreshold={10}
      hasMountingOptions={true}
      systemSizeLimit={config.commercialLimit}
    />
    <Card className="bg-white">
      <CardHeader className="px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <img src="/reliance-industries-ltd.png" alt="Reliance" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
          Solar Systems
        </CardTitle>
        <CardDescription className="text-sm">Systems with 710 Wp HJT modules.</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <RelianceGridTable data={gridData} largeData={largeData} onRowClick={onRowClick} />
      </CardContent>
    </Card>
    <Card className="bg-gray-100">
      <CardContent className="p-3 text-center space-y-2">
        <h3 className="text-base font-semibold">Need a larger system?</h3>
        <Button
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => {
            const largeSystemProduct = { systemSize: 0, systemSizeKWp: 0, noOfModules: 0, inverterCapacity: 0, phase: "Three" }
            onRowClick(largeSystemProduct, "commercial")
          }}
          disabled={loading}
        >
          Contact Sales
        </Button>
      </CardContent>
    </Card>
  </div>
)

const TataSection = ({ 
  gridData, 
  config, 
  onRowClick,
  loading 
}: { 
  gridData: TataGridData[]; 
  config: any; 
  onRowClick: (product: TataGridData) => void;
  loading: boolean;
}) => (
  <div className="space-y-4">
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="h-8 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
        <h2 className="text-2xl font-bold text-gray-900">{config.companyName}</h2>
      </div>
      <p className="text-base text-gray-600 max-w-xl mx-auto">{config.description} ({config.scope})</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="secondary">550 Wp Modules</Badge>
        <Badge variant="secondary">Including GST</Badge>
        <Badge variant="secondary">String Inverters</Badge>
      </div>
    </div>
    <SolarQuoteCalculator
      gridData={gridData}
      company="Tata"
      loading={loading}
      productDescription={config.description}
      workScope={config.scope}
      panelWattage={550}
      residentialThreshold={15}
      hasMountingOptions={false}
    />
    <Card className="bg-white">
      <CardHeader className="px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <img src="/Tata Power Solar.png" alt="Tata" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
          Grid Tie Systems
        </CardTitle>
        <CardDescription className="text-sm">Systems with 550 Wp modules and string inverters.</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <TataGridTable data={gridData} onRowClick={onRowClick} />
      </CardContent>
    </Card>
  </div>
)

const ShaktiSection = ({ 
  gridData, 
  config, 
  onRowClick,
  loading 
}: { 
  gridData: ShaktiGridData[]; 
  config: any; 
  onRowClick: (product: ShaktiGridData) => void;
  loading: boolean;
}) => (
  <div className="space-y-4">
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-8 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
        <h2 className="text-2xl font-bold text-gray-900">{config.companyName}</h2>
      </div>
      <p className="text-base text-gray-600 max-w-xl mx-auto">Grid Tie System - {config.productDescription} ({config.workScope})</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="secondary">535 Wp DCR RIL Modules</Badge>
        <Badge variant="secondary">String Inverter Included</Badge>
        <Badge variant="secondary">Civil Material Excluded</Badge>
      </div>
    </div>
    <SolarQuoteCalculator
      gridData={gridData}
      company="Shakti"
      loading={loading}
      productDescription={config.productDescription}
      workScope={config.workScope}
      panelWattage={535}
      residentialThreshold={10}
      hasMountingOptions={false}
    />
    <Card className="bg-white">
      <CardHeader className="px-3 py-2">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
          <img src="/Shakti Solar.png" alt="Shakti Solar" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
          Grid Tie Systems - DCR RIL 535 Wp Modules
        </CardTitle>
        <CardDescription className="text-sm">
          Systems with 535 Wp modules and string inverters. Civil material not included.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <ShaktiGridTable data={gridData} onRowClick={onRowClick} />
      </CardContent>
    </Card>
  </div>
)

// Main Products Page
export default function Products() {
  const [activeTab, setActiveTab] = useState("reliance")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [relianceGridData, setRelianceGridData] = useState<GridTieSystemData[]>(mockRelianceGridData)
  const [relianceLargeData, setRelianceLargeData] = useState<LargeSystemData[]>(mockRelianceLargeData)
  const [tataGridData, setTataGridData] = useState<TataGridData[]>(mockTataGridData)
  const [shaktiGridData, setShaktiGridData] = useState<ShaktiGridData[]>(mockShaktiGridData)
  const [relianceConfig, setRelianceConfig] = useState<any>({ productDescription: "RIL 690-720 Wp HJT Solar Modules", commercialLimit: 165.6 })
  const [tataConfig, setTataConfig] = useState<any>({ companyName: "Tata Power Solar", description: "Complete solar systems", scope: "Turnkey installation" })
  const [shaktiConfig, setShaktiConfig] = useState<any>({ companyName: "Shakti Solar", productDescription: "DCR RIL 535 Wp Modules with String Inverter", workScope: "Complete Work Excluding Civil Material" })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>("")

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Reliance data
        const [relianceGridRes, relianceLargeRes, relianceConfigRes] = await Promise.all([
          supabase.from('reliance_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
          supabase.from('reliance_large_systems').select('*').order('sl_no', { ascending: true }),
          supabase.from('reliance_system_config').select('*'),
        ])
        if (relianceGridRes.error) throw new Error("Failed to fetch Reliance grid data")
        if (relianceLargeRes.error) throw new Error("Failed to fetch Reliance large data")
        if (relianceConfigRes.error) throw new Error("Failed to fetch Reliance config")
        if (relianceGridRes.data) {
          setRelianceGridData(relianceGridRes.data.map((r: any) => ({
            slNo: r.sl_no,
            systemSize: Number(r.system_size) || 0,
            noOfModules: r.no_of_modules || 0,
            inverterCapacity: Number(r.inverter_capacity) || undefined,
            phase: r.phase || "Unknown",
            hdgElevatedWithGst: Number(r.price_per_watt ?? r.hdg_elevated_with_gst ?? 0),
            hdgElevatedPrice: Number(r.hdg_elevated_price ?? 0),
          })))
        }
        if (relianceLargeRes.data) {
          setRelianceLargeData(relianceLargeRes.data.map((r: any) => ({
            slNo: r.sl_no,
            systemSizeKWp: Number(r.system_size_kwp) || 0,
            systemSizeKW: Number(r.system_size_kw) || 0,
            noOfModules: r.no_of_modules || 0,
            inverterCapacity: Number(r.inverter_capacity) || 0,
            phase: r.phase || "Unknown",
            shortRailTinShedPricePerWatt: Number(r.short_rail_tin_shed_price_per_watt) || 0,
            shortRailTinShedPrice: Number(r.short_rail_tin_shed_price) || 0,
            hdgElevatedRccPricePerWatt: Number(r.hdg_elevated_rcc_price_per_watt) || 0,
            hdgElevatedRccPrice: Number(r.hdg_elevated_rcc_price) || 0,
            preGiMmsPricePerWatt: Number(r.pre_gi_mms_price_per_watt) || 0,
            preGiMmsPrice: Number(r.pre_gi_mms_price) || 0,
            priceWithoutMmsPricePerWatt: Number(r.price_without_mms_price_per_watt) || 0,
            priceWithoutMmsPrice: Number(r.price_without_mms_price) || 0,
          })))
        }
        if (relianceConfigRes.data) {
          const config = Object.fromEntries(relianceConfigRes.data.map((c: any) => [c.key, c.value]))
          setRelianceConfig({
            productDescription: config['PRODUCT_DESCRIPTION'] || "RIL 690-720 Wp HJT Solar Modules",
            commercialLimit: parseFloat(config['COMMERCIAL_SYSTEM_SIZE_LIMIT']) || 165.6
          })
        }

        // Tata data
        const [tataGridRes, tataConfigRes] = await Promise.all([
          supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
          supabase.from('tata_config').select('*'),
        ])
        if (tataGridRes.error) throw new Error("Failed to fetch Tata grid data")
        if (tataConfigRes.error) throw new Error("Failed to fetch Tata config")
        if (tataGridRes.data) {
          setTataGridData(tataGridRes.data.map((r: any) => ({
            slNo: r.sl_no,
            systemSize: Number(r.system_size) || 0,
            noOfModules: r.no_of_modules || 0,
            phase: r.phase || "Unknown",
            pricePerKwp: Number(r.price_per_kwp) || 0,
            totalPrice: Number(r.total_price) || 0,
          })))
        }
        if (tataConfigRes.data) {
          const configMap = Object.fromEntries(tataConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
          setTataConfig({
            companyName: configMap['company_name'] || "Tata Power Solar",
            description: configMap['product_description'] || "Complete solar systems",
            scope: configMap['work_scope'] || "Turnkey installation"
          })
        }

        // Shakti data
        const [shaktiGridRes, shaktiConfigRes] = await Promise.all([
          supabase.from('shakti_grid_tie_systems').select('*').order('sl_no', { ascending: true }),
          supabase.from('shakti_config').select('*'),
        ])
        if (shaktiGridRes.error) throw new Error("Failed to fetch Shakti grid data")
        if (shaktiConfigRes.error) throw new Error("Failed to fetch Shakti config")
        if (shaktiGridRes.data) {
          setShaktiGridData(shaktiGridRes.data.map((r: any) => ({
            slNo: r.sl_no,
            systemSize: Number(r.system_size) || 0,
            noOfModules: r.no_of_modules || 0,
            inverterCapacity: Number(r.inverter_capacity) || 0,
            phase: r.phase || "Unknown",
            preGiElevatedWithGst: Number(r.pre_gi_elevated_with_gst) || 0,
            preGiElevatedPrice: Number(r.pre_gi_elevated_price) || 0,
          })))
        }
        if (shaktiConfigRes.data) {
          const config = Object.fromEntries(shaktiConfigRes.data.map((c: any) => [c.config_key, c.config_value]))
          setShaktiConfig({
            companyName: config['company_name'] || "Shakti Solar",
            productDescription: config['product_description'] || "DCR RIL 535 Wp Modules with String Inverter",
            workScope: config['work_scope'] || "Complete Work Excluding Civil Material"
          })
        }
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load product data. Using mock data for display.")
        // Keep mock data as fallback
      } finally {
        setLoading(false)
      }
    }
    loadAllData()
  }, [])

  const handleRelianceRowClick = (product: any, type: string) => {
    setSelectedProduct({ ...product, type })
    setSelectedCompany("Reliance")
    setIsFormOpen(true)
  }

  const handleTataRowClick = (product: TataGridData) => {
    setSelectedProduct(product)
    setSelectedCompany("Tata")
    setIsFormOpen(true)
  }

  const handleShaktiRowClick = (product: ShaktiGridData) => {
    setSelectedProduct(product)
    setSelectedCompany("Shakti")
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Solar Products & Quote Calculator</h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">Explore solar systems from Reliance, Tata Power Solar, and Shakti Solar.</p>
        </div>

        {error && <div className="text-center text-red-500 text-sm py-2">{error}</div>}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="reliance" className="flex items-center gap-2 justify-center text-sm">
              <img src="/reliance-industries-ltd.png" alt="Reliance" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
              <span className="hidden sm:inline">Reliance</span>
            </TabsTrigger>
            <TabsTrigger value="tata" className="flex items-center gap-2 justify-center text-sm">
              <img src="/Tata Power Solar.png" alt="Tata" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
              <span className="hidden sm:inline">Tata</span>
            </TabsTrigger>
            <TabsTrigger value="shakti" className="flex items-center gap-2 justify-center text-sm">
              <img src="/Shakti Solar.png" alt="Shakti" className="h-5 w-auto" onError={(e) => { e.currentTarget.src = "/fallback.png"; }} />
              <span className="hidden sm:inline">Shakti</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reliance">
            <RelianceSection 
              gridData={relianceGridData} 
              largeData={relianceLargeData}
              config={relianceConfig}
              onRowClick={handleRelianceRowClick}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="tata">
            <TataSection 
              gridData={tataGridData} 
              config={tataConfig}
              onRowClick={handleTataRowClick}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="shakti">
            <ShaktiSection 
              gridData={shaktiGridData} 
              config={shaktiConfig}
              onRowClick={handleShaktiRowClick}
              loading={loading}
            />
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>All prices are subject to change. Contact us for the latest pricing and availability.</p>
          <p className="mt-1">Reliance Industries Ltd. | Tata Power Solar | Shakti Solar | {new Date().getFullYear()}</p>
        </div>

        <CalculatorQuoteForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          quoteData={selectedProduct?.type === "grid" || selectedProduct?.type === "large" || selectedProduct?.type === "commercial" ? null : selectedProduct}
          productName={
            selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0
              ? `Large Scale ${selectedCompany} System`
              : selectedProduct
                ? `${selectedCompany} ${selectedProduct.systemSize || selectedProduct.systemSizeKWp} kWp Solar System`
                : `${selectedCompany} Solar Product`
          }
          powerDemandKw={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0 ? null : (selectedProduct?.systemSize || selectedProduct?.systemSizeKWp || null)}
          isLargeSystem={selectedProduct?.systemSize === 0 || selectedProduct?.systemSizeKWp === 0}
          company={selectedCompany}
          mountingType={selectedCompany === "Reliance" && (selectedProduct?.type === "large" || selectedProduct?.type === "commercial") ? "RCC Elevated" : null}
        />
      </div>
    </div>
  )
}