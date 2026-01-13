// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ArrowUpDown, Search } from "lucide-react"
// import TataQuoteForm from "@/components/forms/tata-quote-form"
// import { supabase } from "@/integrations/supabase/client"

// type GridTieSystemData = {
//   slNo: number
//   systemSize: number
//   noOfModules: number
//   phase: string
//   pricePerKwp: number
//   totalPrice: number
// }

// function GridTieSystemTable({ data, onRowClick }: { data: GridTieSystemData[]; onRowClick: (product: GridTieSystemData) => void }) {
//   const [sortField, setSortField] = useState<keyof GridTieSystemData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof GridTieSystemData) => {
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
//           <TableHeader><TableRow className="bg-gray-50">
//             <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead className="font-semibold">No of Modules</TableHead>
//             <TableHead className="font-semibold">Phase</TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("pricePerKwp")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("totalPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead className="font-semibold">Action</TableHead>
//           </TableRow></TableHeader>
//           <TableBody>{filteredAndSortedData.map((item) => (
//             <TableRow key={item.slNo} className="hover:bg-gray-50">
//               <TableCell className="font-medium">{item.slNo}</TableCell>
//               <TableCell>{item.systemSize}</TableCell>
//               <TableCell>{item.noOfModules}</TableCell>
//               <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//               <TableCell className="font-medium">₹{item.pricePerKwp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
//               <TableCell className="font-bold text-green-600">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
//               <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//             </TableRow>
//           ))}</TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// export default function TataSolarPricingPage() {
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<GridTieSystemData | null>(null)
//   const [gridData, setGridData] = useState<GridTieSystemData[]>([])
//   const [config, setConfig] = useState({ limit: 15, companyName: "Tata Power Solar", description: "", scope: "" })

//   useEffect(() => {
//     const loadData = async () => {
//       const { data: grid } = await supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true })
//       if (grid) setGridData(grid.map((r: any) => ({ ...r, slNo: r.sl_no, systemSize: Number(r.system_size), noOfModules: r.no_of_modules, pricePerKwp: Number(r.price_per_kwp), totalPrice: Number(r.total_price) })))
//       const { data: cfg } = await supabase.from('tata_config').select('*')
//       if (cfg) {
//         const configMap = Object.fromEntries(cfg.map((c: any) => [c.config_key, c.config_value]))
//         setConfig({ limit: parseFloat(configMap['system_size_limit']) || 15, companyName: configMap['company_name'] || "Tata Power Solar", description: configMap['product_description'] || "", scope: configMap['work_scope'] || "" })
//       }
//     }
//     loadData()
//   }, [])

//   const handleRowClick = (product: GridTieSystemData) => {
//     setSelectedProduct(product)
//     setIsFormOpen(true)
//   }

//   const handleLargeSystemClick = () => {
//     setSelectedProduct({ slNo: 0, systemSize: 0, noOfModules: 0, phase: "Three", pricePerKwp: 0, totalPrice: 0 })
//     setIsFormOpen(true)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <img src="/Tata Power Solar.png" alt="Tata Power Solar Logo" className="h-12 w-auto" />
//             <h1 className="text-4xl font-bold text-gray-900">{config.companyName} System Pricing</h1>
//           </div>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">{config.description} ({config.scope})</p>
//         </div>
//         <Card className="bg-white">
//           <CardHeader><CardTitle>Grid Tie Systems</CardTitle><CardDescription>Complete solar systems with string inverters.</CardDescription></CardHeader>
//           <CardContent><GridTieSystemTable data={gridData} onRowClick={handleRowClick} /></CardContent>
//         </Card>
//         <Card className="bg-gray-100"><CardContent className="pt-6 text-center space-y-2">
//           <h3 className="text-lg font-semibold">Need a system larger than {config.limit} kWp?</h3>
//           <p className="text-gray-600">For commercial installations, contact our sales team for customized solutions.</p>
//           <Button variant="outline" className="mt-4" onClick={handleLargeSystemClick}>Contact Sales</Button>
//         </CardContent></Card>
//         <TataQuoteForm
//           open={isFormOpen} onOpenChange={setIsFormOpen}
//           productName={selectedProduct?.systemSize === 0 ? `Large Scale System (> ${config.limit} kWp)` : selectedProduct ? `${selectedProduct.systemSize} kWp Solar System` : "Tata Power Solar Product"}
//           isLargeSystem={selectedProduct?.systemSize === 0}
//           powerDemandKw={selectedProduct?.systemSize === 0 ? null : selectedProduct?.systemSize || null}
//         />
//       </div>
//     </div>
//   )
// }







// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ArrowUpDown, Search } from "lucide-react"
// import TataQuoteForm from "@/components/forms/tata-quote-form"
// import { supabase } from "@/integrations/supabase/client"

// type GridTieSystemData = {
//   slNo: number
//   systemSize: number
//   noOfModules: number
//   phase: string
//   pricePerKwp: number
//   totalPrice: number
// }

// function GridTieSystemTable({ data, onRowClick }: { data: GridTieSystemData[]; onRowClick: (product: GridTieSystemData) => void }) {
//   const [sortField, setSortField] = useState<keyof GridTieSystemData | null>("slNo")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleSort = (field: keyof GridTieSystemData) => {
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
//           <TableHeader><TableRow className="bg-gray-50">
//             <TableHead><Button variant="ghost" onClick={() => handleSort("slNo")} className="p-0 h-auto font-semibold">Sl No.<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("systemSize")} className="p-0 h-auto font-semibold">System Size (kWp)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead className="font-semibold">No of Modules</TableHead>
//             <TableHead className="font-semibold">Phase</TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("pricePerKwp")} className="p-0 h-auto font-semibold">Price/kWp (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead><Button variant="ghost" onClick={() => handleSort("totalPrice")} className="p-0 h-auto font-semibold">Total Price (₹)<ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
//             <TableHead className="font-semibold">Action</TableHead>
//           </TableRow></TableHeader>
//           <TableBody>{filteredAndSortedData.map((item) => (
//             <TableRow key={item.slNo} className="hover:bg-gray-50">
//               <TableCell className="font-medium">{item.slNo}</TableCell>
//               <TableCell>{item.systemSize}</TableCell>
//               <TableCell>{item.noOfModules}</TableCell>
//               <TableCell><Badge variant={item.phase === "Single" ? "default" : "secondary"}>{item.phase}</Badge></TableCell>
//               <TableCell className="font-medium">₹{item.pricePerKwp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
//               <TableCell className="font-bold text-green-600">₹{item.totalPrice.toLocaleString("en-IN")}</TableCell>
//               <TableCell><Button onClick={() => onRowClick(item)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Quote</Button></TableCell>
//             </TableRow>
//           ))}</TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// export default function TataSolarPricingPage() {
//   const [isFormOpen, setIsFormOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<GridTieSystemData | null>(null)
//   const [gridData, setGridData] = useState<GridTieSystemData[]>([])
//   const [config, setConfig] = useState({ limit: 15, companyName: "Tata Power Solar", description: "", scope: "" })

//   useEffect(() => {
//     const loadData = async () => {
//       const { data: grid } = await supabase.from('tata_grid_tie_systems').select('*').order('sl_no', { ascending: true })
//       if (grid) setGridData(grid.map((r: any) => ({ ...r, slNo: r.sl_no, systemSize: Number(r.system_size), noOfModules: r.no_of_modules, pricePerKwp: Number(r.price_per_kwp), totalPrice: Number(r.total_price) })))
//       const { data: cfg } = await supabase.from('tata_config').select('*')
//       if (cfg) {
//         const configMap = Object.fromEntries(cfg.map((c: any) => [c.config_key, c.config_value]))
//         setConfig({ limit: parseFloat(configMap['system_size_limit']) || 15, companyName: configMap['company_name'] || "Tata Power Solar", description: configMap['product_description'] || "", scope: configMap['work_scope'] || "" })
//       }
//     }
//     loadData()
//   }, [])

//   const handleRowClick = (product: GridTieSystemData) => {
//     setSelectedProduct(product)
//     setIsFormOpen(true)
//   }

//   const handleLargeSystemClick = () => {
//     setSelectedProduct({ slNo: 0, systemSize: 0, noOfModules: 0, phase: "Three", pricePerKwp: 0, totalPrice: 0 })
//     setIsFormOpen(true)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <div className="flex items-center justify-center gap-4 mb-4">
//             <img src="/Tata Power Solar.png" alt="Tata Power Solar Logo" className="h-12 w-auto" />
//             <h1 className="text-4xl font-bold text-gray-900">{config.companyName} System Pricing</h1>
//           </div>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">{config.description} ({config.scope})</p>
//         </div>
//         <Card className="bg-white">
//           <CardHeader><CardTitle>Grid Tie Systems</CardTitle><CardDescription>Complete solar systems with string inverters.</CardDescription></CardHeader>
//           <CardContent><GridTieSystemTable data={gridData} onRowClick={handleRowClick} /></CardContent>
//         </Card>
//         <Card className="bg-gray-100"><CardContent className="pt-6 text-center space-y-2">
//           <h3 className="text-lg font-semibold">Need a system larger than {config.limit} kWp?</h3>
//           <p className="text-gray-600">For commercial installations, contact our sales team for customized solutions.</p>
//           <Button variant="outline" className="mt-4" onClick={handleLargeSystemClick}>Contact Sales</Button>
//         </CardContent></Card>
//         <TataQuoteForm
//           open={isFormOpen}
//           onOpenChange={setIsFormOpen}
//           productName={selectedProduct?.systemSize === 0 ? `Large Scale System (> ${config.limit} kWp)` : selectedProduct ? `${selectedProduct.systemSize} kWp Solar System` : "Tata Power Solar Product"}
//           isLargeSystem={selectedProduct?.systemSize === 0}
//           powerDemandKw={selectedProduct?.systemSize === 0 ? null : selectedProduct?.systemSize || null}
//           phase={selectedProduct?.phase || "Three"}
//         />
//       </div>
//     </div>
//   )
// }
















/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
import TataQuoteForm from "@/components/forms/tata-quote-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Type definition for grid tie system data
type GridTieSystemData = {
  slNo: number;
  systemSize: number;
  noOfModules: number;
  phase: string;
  pricePerKwp: number;
  totalPrice: number;
};

// GridTieSystemTable component for rendering the table
function GridTieSystemTable({
  data,
  onRowClick,
}: {
  data: GridTieSystemData[];
  onRowClick: (product: GridTieSystemData) => void;
}) {
  const [sortField, setSortField] = useState<keyof GridTieSystemData | null>("slNo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle sorting logic
  const handleSort = (field: keyof GridTieSystemData) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Filter and sort table data
  const filteredAndSortedData = data
    .filter(
      (item) =>
        item.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.systemSize.toString().includes(searchTerm) ||
        item.noOfModules.toString().includes(searchTerm) ||
        item.pricePerKwp.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue > bValue ? 1 : -1;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by phase, system size, modules, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("slNo")}
                  className="p-0 h-auto font-semibold"
                >
                  Sl No.
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("systemSize")}
                  className="p-0 h-auto font-semibold"
                >
                  System Size (kWp)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">No of Modules</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("phase")}
                  className="p-0 h-auto font-semibold"
                >
                  Phase
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("pricePerKwp")}
                  className="p-0 h-auto font-semibold"
                >
                  Price/kWp (₹)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("totalPrice")}
                  className="p-0 h-auto font-semibold"
                >
                  Total Price (₹)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No data available. Please try again later.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((item) => (
                <TableRow key={item.slNo} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.slNo}</TableCell>
                  <TableCell>{item.systemSize}</TableCell>
                  <TableCell>{item.noOfModules}</TableCell>
                  <TableCell>
                    <Badge variant={item.phase === "Single" ? "default" : "secondary"}>
                      {item.phase}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{item.pricePerKwp.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onRowClick(item)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Get Quote
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Main component for Tata Solar Pricing Page
export default function TataSolarPricingPage() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GridTieSystemData | null>(null);
  const [isLargeSystem, setIsLargeSystem] = useState(false);
  const [gridData, setGridData] = useState<GridTieSystemData[]>([]);
  const [config, setConfig] = useState({
    limit: 15,
    companyName: "Tata Power Solar",
    description: "",
    scope: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Fetch grid tie systems data
        const { data: grid, error: gridError } = await supabase
          .from("tata_grid_tie_systems")
          .select("*")
          .order("sl_no", { ascending: true });
        if (gridError) throw new Error(`Failed to fetch grid systems: ${gridError.message}`);
        if (grid && isMounted) {
          setGridData(
            grid.map((r: any) => ({
              ...r,
              slNo: r.sl_no,
              systemSize: Number(r.system_size),
              noOfModules: r.no_of_modules,
              pricePerKwp: Number(r.price_per_kwp),
              totalPrice: Number(r.total_price),
            }))
          );
        }

        // Fetch configuration data
        const { data: cfg, error: cfgError } = await supabase.from("tata_config").select("*");
        if (cfgError) throw new Error(`Failed to fetch config: ${cfgError.message}`);
        if (cfg && isMounted) {
          const configMap = Object.fromEntries(cfg.map((c: any) => [c.config_key, c.config_value]));
          setConfig({
            limit: parseFloat(configMap["system_size_limit"]) || 15,
            companyName: configMap["company_name"] || "Tata Power Solar",
            description: configMap["product_description"] || "",
            scope: configMap["work_scope"] || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: error.message || "Failed to load pricing data. Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false
    }
  }, [toast]);

  // Handle row click to open quote form
  const handleRowClick = (product: GridTieSystemData) => {
    console.log("Selected product:", {
      systemSize: product.systemSize,
      phase: product.phase,
      slNo: product.slNo,
    })
    setSelectedProduct(product);
    setIsLargeSystem(false);
    setIsFormOpen(true);
  };

  // Handle large system contact request
  const handleLargeSystemClick = () => {
    console.log("Large system selected, defaulting phase to Three")
    setSelectedProduct(null);
    setIsLargeSystem(true);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/Tata Power Solar.png" alt="Tata Power Solar Logo" className="h-12 w-auto" />
            <h1 className="text-4xl font-bold text-gray-900">{config.companyName} System Pricing</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {config.description} ({config.scope})
          </p>
        </div>

        {/* Grid Tie Systems Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Grid Tie Systems</CardTitle>
            <CardDescription>Complete solar systems with string inverters. Select phase carefully.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-gray-500">Loading pricing data...</div>
            ) : (
              <GridTieSystemTable data={gridData} onRowClick={handleRowClick} />
            )}
          </CardContent>
        </Card>

        {/* Large System Card */}
        <Card className="bg-gray-100">
          <CardContent className="pt-6 text-center space-y-2">
            <h3 className="text-lg font-semibold">Need a system larger than {config.limit} kWp?</h3>
            <p className="text-gray-600">For commercial installations, contact our sales team for customized solutions.</p>
            <Button variant="outline" className="mt-4" onClick={handleLargeSystemClick}>
              Contact Sales
            </Button>
          </CardContent>
        </Card>

        {/* Quote Form */}
        <TataQuoteForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          productName={
            isLargeSystem
              ? `Large Scale System (> ${config.limit} kWp)`
              : selectedProduct
                ? `${selectedProduct.systemSize} kWp Solar System (${selectedProduct.phase}-Phase)`
                : "Tata Power Solar Product"
          }
          isLargeSystem={isLargeSystem}
          powerDemandKw={isLargeSystem ? null : selectedProduct?.systemSize || null}
          phase={selectedProduct?.phase || "Three"}
        />
      </div>
    </div>
  );
}