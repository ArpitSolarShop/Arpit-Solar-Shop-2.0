





/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
import UniversalQuoteForm from "@/components/forms/UniversalQuoteForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Type definition for grid tie system data
const TATA_FALLBACK_DATA: GridTieSystemData[] = [
  { slNo: 1, systemSize: 2.24, phase: "Single", moduleWattage: 560, noOfModules: 4, totalPrice: 130000, pricePerKwp: 58035.71, priceIncludesGst: true },
  { slNo: 2, systemSize: 3.36, phase: "Single", moduleWattage: 560, noOfModules: 6, totalPrice: 180000, pricePerKwp: 53571.43, priceIncludesGst: true },
  { slNo: 3, systemSize: 4.48, phase: "Single", moduleWattage: 560, noOfModules: 8, totalPrice: 240000, pricePerKwp: 53571.43, priceIncludesGst: true },
  { slNo: 4, systemSize: 5.04, phase: "Single", moduleWattage: 560, noOfModules: 9, totalPrice: 270000, pricePerKwp: 53571.43, priceIncludesGst: true },
  { slNo: 5, systemSize: 5.60, phase: "Single", moduleWattage: 560, noOfModules: 9, totalPrice: 300000, pricePerKwp: 53571.43, priceIncludesGst: true },
  { slNo: 6, systemSize: 5.04, phase: "Three", moduleWattage: 560, noOfModules: 9, totalPrice: 300000, pricePerKwp: 59523.81, priceIncludesGst: true },
  { slNo: 7, systemSize: 6.16, phase: "Three", moduleWattage: 560, noOfModules: 11, totalPrice: 345000, pricePerKwp: 56006.49, priceIncludesGst: true },
  { slNo: 8, systemSize: 8.40, phase: "Three", moduleWattage: 560, noOfModules: 15, totalPrice: 440000, pricePerKwp: 52380.95, priceIncludesGst: true },
  { slNo: 9, systemSize: 10.08, phase: "Three", moduleWattage: 560, noOfModules: 18, totalPrice: 510000, pricePerKwp: 50595.24, priceIncludesGst: true },
];

type GridTieSystemData = {
  slNo: number;
  systemSize: number;
  noOfModules: number;
  moduleWattage?: number;
  phase: string;
  pricePerKwp: number;
  totalPrice: number;
  priceIncludesGst?: boolean;
  gstRate?: number;
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
        (item.moduleWattage?.toString() || "").includes(searchTerm) ||
        item.pricePerKwp.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField] ?? 0;
      const bValue = b[sortField] ?? 0;
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
          placeholder="Search by phase, system size, modules, wattage, or price..."
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
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("moduleWattage")}
                  className="p-0 h-auto font-semibold"
                >
                  Module (W)
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
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No data available. Please try again later.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((item) => (
                <TableRow key={item.slNo} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.slNo}</TableCell>
                  <TableCell>{item.systemSize}</TableCell>
                  <TableCell>{item.moduleWattage ? `${item.moduleWattage}W` : 'N/A'}</TableCell>
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
                    <div className="flex flex-col">
                      <span>₹{item.totalPrice.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-gray-500 font-normal">
                        {item.priceIncludesGst ? "Incl. GST" : "+ GST"}
                      </span>
                    </div>
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
        // Fetch grid tie systems data from unified solar_products table
        const { data: grid, error: gridError } = await supabase
          .from("solar_products")
          .select("*")
          .eq("category", "Tata")
          .order("system_size_kw", { ascending: true });
        if (gridError) throw new Error(`Failed to fetch grid systems: ${gridError.message}`);
        if (grid && grid.length > 0) {
          if (isMounted) {
            setGridData(
              grid.map((r: any, idx: number) => {
                let specs = r.specifications || {};
                if (typeof specs === 'string') {
                  try {
                    specs = JSON.parse(specs);
                  } catch (e) {
                    console.error("Failed to parse specifications", e);
                  }
                }
                
                return {
                  slNo: specs.sl_no || idx + 1,
                  systemSize: Number(r.system_size_kw),
                  noOfModules: specs.module_count || 0,
                  moduleWattage: Number(specs.module_watt || 0),
                  phase: r.phase || '1Ph',
                  pricePerKwp: specs.price_per_kw || (r.price / r.system_size_kw),
                  totalPrice: Number(r.price),
                  priceIncludesGst: r.price_includes_gst,
                  gstRate: r.gst_rate,
                };
              })
            );
          }
        } else if (isMounted) {
          // Fallback to hardcoded data if database returns nothing
          console.log("Using fallback Tata pricing data");
          setGridData(TATA_FALLBACK_DATA);
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
    setSelectedProduct(product);
    setIsLargeSystem(false);
    setIsFormOpen(true);
  };

  // Handle large system contact request
  const handleLargeSystemClick = () => {
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
            <img src="/Tata Power Solar.webp" alt="Tata Power Solar Logo" className="h-12 w-auto" />
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
        <UniversalQuoteForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          category="Tata"
          productDetails={
            selectedProduct || isLargeSystem ? {
              name: isLargeSystem
                ? `Large Scale System (> ${config.limit} kWp)`
                : `${selectedProduct!.systemSize} kWp Solar System (${selectedProduct!.phase}-Phase)`,
              systemSize: isLargeSystem ? 15 : selectedProduct!.systemSize,
              phase: isLargeSystem ? "Three" : selectedProduct!.phase,
              price: isLargeSystem ? undefined : selectedProduct!.totalPrice,
              price_includes_gst: isLargeSystem ? true : selectedProduct?.priceIncludesGst,
              gst_rate: isLargeSystem ? 8.9 : selectedProduct?.gstRate,
              description: isLargeSystem
                ? "Commercial Grade Solar Solution"
                : `${selectedProduct!.noOfModules} Modules | ${selectedProduct!.phase} Phase`
            } : undefined
          }
          config={{
            title: isLargeSystem ? "Commercial Solar Quote" : "Tata Solar Quote"
          }}
        />
      </div>
    </div>
  );
}