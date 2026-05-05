/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import UniversalQuoteForm from '@/components/forms/UniversalQuoteForm'
import { supabase } from '@/integrations/supabase/client'
import { waareeTopconProducts, adaniTopconProducts, premierTopconProducts, tataProducts } from '@/data/priceList'

const normalizeModuleType = (type: string | null): string => {
  if (!type) return 'TOPCON';
  const t = type.toUpperCase();
  if (t.includes('MONO') || t.includes('PERC')) return 'Mono PERC';
  if (t.includes('TOPCON')) return 'TOPCON';
  return 'TOPCON';
};

const INTEGRATED_FALLBACK_DATA: IntegratedRow[] = [
  ...waareeTopconProducts.map((p, idx) => ({
    id: 1000 + idx,
    brand: 'Waaree',
    system_kw: p.kWp,
    phase: p.phase === 1 ? '1Ph' : '3Ph',
    price: p.price,
    inverter_capacity_kw: Math.ceil(p.kWp),
    module_watt: p.module,
    module_type: 'TOPCON',
    no_of_modules: p.qty,
    price_includes_gst: true,
    gst_rate: 8.9
  })),
  ...adaniTopconProducts.map((p, idx) => ({
    id: 2000 + idx,
    brand: 'Adani',
    system_kw: p.kWp,
    phase: p.phase === 1 ? '1Ph' : '3Ph',
    price: p.price,
    inverter_capacity_kw: Math.ceil(p.kWp),
    module_watt: p.module,
    module_type: 'TOPCON',
    no_of_modules: p.qty,
    price_includes_gst: true,
    gst_rate: 8.9
  })),
  ...premierTopconProducts.map((p, idx) => ({
    id: 3000 + idx,
    brand: 'Premier',
    system_kw: p.kWp,
    phase: p.phase === 1 ? '1Ph' : '3Ph',
    price: p.price,
    inverter_capacity_kw: Math.ceil(p.kWp),
    module_watt: p.module,
    module_type: 'TOPCON',
    no_of_modules: p.qty,
    price_includes_gst: true,
    gst_rate: 8.9
  })),
  ...tataProducts.map((p, idx) => ({
    id: 4000 + idx,
    brand: 'Waaree',
    system_kw: p.kWp,
    phase: p.phase === 1 ? '1Ph' : '3Ph',
    price: p.price,
    inverter_capacity_kw: Math.ceil(p.kWp),
    module_watt: 545,
    module_type: 'Mono PERC',
    no_of_modules: p.qty,
    price_includes_gst: true,
    gst_rate: 8.9
  }))
];

type IntegratedRow = {
  id: number
  brand: string
  system_kw: number
  phase: string
  price: number
  inverter_capacity_kw: number
  module_watt: number
  module_type: string | null
  no_of_modules: number
  acdb_nos?: number
  dcdb_nos?: number
  earthing_rod_nos?: number
  earthing_chemical_nos?: number
  ac_wire_brand?: string
  ac_wire_length_mtr?: number
  dc_wire_brand?: string
  dc_wire_length_mtr?: number
  earthing_wire_brand?: string
  earthing_wire_length_mtr?: number
  lighting_arrestor_qty?: number
  price_includes_gst?: boolean
  gst_rate?: number
}

export default function IntegratedPriceData() {
  const [rows, setRows] = useState<IntegratedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IntegratedRow | null>(null)
  const [moduleTypeFilter, setModuleTypeFilter] = useState<string>('all')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('solar_products')
          .select('*')
          .eq('category', 'Integrated')
          .order('system_size_kw', { ascending: true })

        if (error) throw error
        if (!data || data.length === 0) {
          setRows(INTEGRATED_FALLBACK_DATA)
          return
        }

        if (mounted) {
          setRows(data.map((r: any, idx: number) => {
            let specs = r.specifications || {};
            if (typeof specs === 'string') {
              try {
                specs = JSON.parse(specs);
              } catch (e) {
                console.error("Failed to parse specifications", e);
              }
            }
            const compQtys = specs.component_qtys || {};
            const wireBrands = specs.wire_brands || {};
            return {
              id: idx + 1,
              brand: specs.brand || 'Generic',
              system_kw: Number(r.system_size_kw),
              phase: r.phase || '1Ph',
              price: Number(r.price),
              inverter_capacity_kw: Number(specs.inverter_capacity_kw) || Math.ceil(Number(r.system_size_kw)),
              module_watt: Number(specs.module_watt) || 580,
              module_type: normalizeModuleType(specs.module_type),
              no_of_modules: Number(specs.no_of_modules) || Math.ceil(Number(r.system_size_kw) * 1000 / 580),
              acdb_nos: compQtys.acdb ? Number(compQtys.acdb) : 1,
              dcdb_nos: compQtys.dcdb ? Number(compQtys.dcdb) : 1,
              earthing_rod_nos: compQtys.earthing_rod ? Number(compQtys.earthing_rod) : 3,
              earthing_chemical_nos: compQtys.earthing_chemical ? Number(compQtys.earthing_chemical) : 3,
              ac_wire_brand: wireBrands.ac || 'Polycab',
              ac_wire_length_mtr: compQtys.ac_wire_mtr ? Number(compQtys.ac_wire_mtr) : 10,
              dc_wire_brand: wireBrands.dc || 'Polycab',
              dc_wire_length_mtr: compQtys.dc_wire_mtr ? Number(compQtys.dc_wire_mtr) : 20,
              earthing_wire_brand: wireBrands.earthing || 'AL Wire',
              earthing_wire_length_mtr: compQtys.earthing_wire_mtr ? Number(compQtys.earthing_wire_mtr) : 90,
              lighting_arrestor_qty: compQtys.lightning_arrester ? Number(compQtys.lightning_arrester) : 1,
              price_includes_gst: r.price_includes_gst,
              gst_rate: r.gst_rate,
            };
          }))

          if (data.length < 5) {
            setRows(prev => {
              const existingIds = new Set(prev.map(r => `${r.brand}-${r.system_kw}-${r.module_type}`));
              const additional = INTEGRATED_FALLBACK_DATA.filter(f => !existingIds.has(`${f.brand}-${f.system_kw}-${f.module_type}`));
              return [...prev, ...additional].sort((a, b) => a.system_kw - b.system_kw);
            });
          }
        }
      } catch (err: any) {
        console.error('Failed to load integrated products', err)
        setError(err?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filteredRows = useMemo(() => {
    if (moduleTypeFilter === 'all') {
      return rows
    }
    return rows.filter(row => row.module_type === moduleTypeFilter)
  }, [rows, moduleTypeFilter])

  const moduleTypeStats = useMemo(() => {
    const stats: Record<string, number> = {
      all: rows.length,
    }
    rows.forEach(r => {
      const type = r.module_type || 'TOPCON';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats
  }, [rows])

  const moduleTypes = useMemo(() => {
    const types = Array.from(new Set(rows.map(r => r.module_type || 'TOPCON')));
    return types.sort();
  }, [rows])

  const handleRowClick = (row: IntegratedRow) => {
    setSelectedProduct(row)
    setIsFormOpen(true)
  }

  const getModuleTypeBadgeColor = (moduleType: string | null) => {
    if (moduleType === 'TOPCON') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (moduleType === 'Mono PERC') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-slate-100 text-slate-800 border-slate-300'
  }

  return (
    <div className="max-w-full mx-auto my-8 px-4">
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Integrated Solar Products</h2>
            <p className="text-slate-500 mt-1">Browse our range of Waaree and Adani solar systems</p>
          </div>
        </div>

        <Tabs defaultValue="all" value={moduleTypeFilter} onValueChange={setModuleTypeFilter} className="w-full">
          <TabsList className="bg-slate-100 p-1 mb-6">
            <TabsTrigger value="all" className="px-6">
              All Systems ({moduleTypeStats.all})
            </TabsTrigger>
            {moduleTypes.map(type => (
              <TabsTrigger key={type} value={type} className="px-6">
                {type} ({moduleTypeStats[type] || 0})
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
            <table className="min-w-[1200px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                  <th className="p-4 border-b">Module Type</th>
                  <th className="p-4 border-b">Brand</th>
                  <th className="p-4 border-b">System (kW)</th>
                  <th className="p-4 border-b">Phase</th>
                  <th className="p-4 border-b">Price (₹)</th>
                  <th className="p-4 border-b">Inverter (kW)</th>
                  <th className="p-4 border-b">Module (W)</th>
                  <th className="p-4 border-b">No. of Modules</th>
                  <th className="p-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-20 text-slate-500">
                      <p className="text-lg font-medium">No products found for the selected technology.</p>
                      <p className="text-sm">Try selecting a different module type.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={row.id} className="group transition-colors hover:bg-slate-50/80">
                      <TableCell className="p-4">
                        <Badge variant="outline" className={`${getModuleTypeBadgeColor(row.module_type)} font-medium px-2.5 py-0.5 rounded-full`}>
                          {row.module_type || 'TOPCON'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-slate-900">{row.brand}</TableCell>
                      <TableCell className="p-4 font-medium">{row.system_kw} kW</TableCell>
                      <TableCell className="p-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-2 py-0">
                          {row.phase}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-blue-600">
                            ₹{row.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {row.price_includes_gst ? 'INCL. GST' : '+ GST'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-slate-600">{row.inverter_capacity_kw} kW</TableCell>
                      <TableCell className="p-4 text-slate-600">{row.module_watt} W</TableCell>
                      <TableCell className="p-4 text-slate-600">{row.no_of_modules} Nos</TableCell>
                      <TableCell className="p-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleRowClick(row)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 shadow-sm transition-all active:scale-95"
                        >
                          Get Quote
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </table>
          </div>
        </Tabs>
      </div>

      {!loading && !error && filteredRows.length > 0 && (
        <div className="mt-4 text-sm text-slate-600">
          Showing <strong>{filteredRows.length}</strong> product{filteredRows.length !== 1 ? 's' : ''}
          {moduleTypeFilter !== 'all' && (
            <> for <strong>{moduleTypeFilter}</strong> module type</>
          )}
        </div>
      )}

      <UniversalQuoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category="Integrated"
        productDetails={
          selectedProduct ? {
            name: `${selectedProduct.brand} ${selectedProduct.system_kw} kW System`,
            systemSize: selectedProduct.system_kw,
            price: selectedProduct.price,
            phase: selectedProduct.phase,
            brand: selectedProduct.brand,
            module_type: selectedProduct.module_type || 'N/A',
            price_includes_gst: selectedProduct.price_includes_gst,
            gst_rate: selectedProduct.gst_rate,
            description: `${selectedProduct.no_of_modules} Modules | ${selectedProduct.inverter_capacity_kw}kW Inverter | ${selectedProduct.module_watt}Wp Modules`
          } : undefined
        }
        config={{
          title: "Integrated Solar Solution Quote",
          description: "Complete system with panels, inverter, and installation."
        }}
      />
    </div>
  )
}

export function IntegratedBrands() {
  return (
    <div className="w-full mb-8">
      <div className="max-w-6xl mx-auto text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Powering India’s Future — Waaree & Adani Integrated Solutions</h2>
        <p className="mt-2 text-slate-600">A unified, vertically integrated solar ecosystem combining Waaree’s scale with Adani’s end-to-end manufacturing strength.</p>
      </div>
      <div className="flex flex-col lg:flex-row w-full lg:gap-6">
        {/* Adani - left */}
        <section id="adani" className="w-full lg:w-1/2 min-h-screen bg-white border border-slate-200 lg:rounded-l-2xl p-8 flex">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-900">Adani Solar</h3>
                <p className="mt-2 text-slate-600">India’s largest vertically integrated PV manufacturer — Tier-1, 4 GW+ capacity.</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#adani-products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Explore Our Products</a>
                  <a href="/downloads/adani-brochure.pdf" className="inline-block bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg">Download Brochure</a>
                </div>

                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><strong className="text-blue-700">Top Performer:</strong> PVEL Ranked for 7 Consecutive Years.</li>
                  <li className="flex items-start gap-3"><strong className="text-blue-700">Made in India:</strong> DCR Certified Modules Available.</li>
                  <li className="flex items-start gap-3"><strong className="text-blue-700">High Efficiency:</strong> Up to 22.3%+ Module Efficiency.</li>
                  <li className="flex items-start gap-3"><strong className="text-blue-700">Warranty:</strong> Industry-Leading 30-Year Performance Warranty.</li>
                </ul>
              </div>

              <div className="w-48 flex-shrink-0 hidden lg:block">
                <img src="/AdaniSolar.webp" alt="Adani Solar" className="w-full h-40 object-contain rounded-lg shadow-sm border border-slate-100" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-xl font-semibold">About Adani Solar</h3>
                <p className="mt-2 text-slate-600">Adani Solar (Mundra Solar PV Ltd) is the solar PV manufacturing arm of the Adani Group, India’s largest diversified business conglomerate. We are the creators of the world's first and only geographically co-located, fully integrated solar manufacturing ecosystem in Mundra, Gujarat.</p>
                <p className="mt-2 text-slate-600">From metallurgical-grade silicon to polysilicon, ingots, wafers, cells, and final PV modules, every stage of production happens under one roof. This complete vertical integration ensures unmatched quality control, supply chain reliability, and cost leadership.</p>
                <p className="mt-3 text-sm text-slate-700"><strong>Vision:</strong> To build a cleaner, greener India by delivering high-performance solar solutions that drive the global energy transition.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Product Showcase — Shine & Pride Series</h3>
                <div className="mt-3 space-y-3">
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <h4 className="font-bold">Shine Series (TOPCon Technology)</h4>
                    <p className="text-sm text-slate-700">Maximum Power. Minimum Degradation. N-Type TOPCon. Power: 535 Wp – 620+ Wp. Efficiency: &gt;22.3%. Bifaciality: Up to 85%.</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-slate-50">
                    <h4 className="font-bold">Pride Series (Mono PERC)</h4>
                    <p className="text-sm text-slate-700">Proven Reliability. Cost-Effective Performance. Mono PERC. Power: Up to 545 Wp. Efficiency: ~21.2%.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Why Choose Adani Solar?</h4>
                <ol className="list-decimal list-inside text-slate-700 mt-2 space-y-1 text-sm">
                  <li><strong>Vertical Integration:</strong> Full supply-chain control from silicon to module for superior quality.</li>
                  <li><strong>Award-Winning Reliability:</strong> PVEL Top Performer for 7 years running.</li>
                  <li><strong>DCR Compliant:</strong> Eligible for government subsidies and tenders.</li>
                  <li><strong>Built for India's Climate:</strong> Tested for high wind, heavy snow, and corrosive environments.</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Technical Specifications & Downloads</h4>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase text-xs">
                        <th className="p-2 border">Feature</th>
                        <th className="p-2 border">N-Type TOPCon (Shine)</th>
                        <th className="p-2 border">Mono PERC (Pride)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2 border">Cell Type</td><td className="p-2 border">N-Type 16BB</td><td className="p-2 border">P-Type 10BB</td></tr>
                      <tr><td className="p-2 border">Bifaciality</td><td className="p-2 border">80% ± 5%</td><td className="p-2 border">70% ± 5%</td></tr>
                      <tr><td className="p-2 border">Degradation (Year 1)</td><td className="p-2 border">&lt; 1.0%</td><td className="p-2 border">&lt; 2.0%</td></tr>
                      <tr><td className="p-2 border">Annual Degradation</td><td className="p-2 border">0.40%</td><td className="p-2 border">0.55%</td></tr>
                      <tr><td className="p-2 border">Warranty</td><td className="p-2 border">12 Product / 30 Performance</td><td className="p-2 border">12 Product / 25 Performance</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waaree - right */}
        <section id="waaree" className="w-full lg:w-1/2 min-h-screen bg-white border border-slate-200 lg:rounded-r-2xl p-8 flex">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">Waaree Energies</h3>
                <p className="mt-2 text-slate-600">India’s largest module manufacturer — 12 GW+ capacity and global exports to 68+ countries.</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#waaree-products" className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg">View Product Range</a>
                  <a href="#contact" className="inline-block bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg">Get a Quote</a>
                </div>

                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3"><strong className="text-slate-800">#1 in India:</strong> Largest Manufacturer by Capacity (12 GW+).</li>
                  <li className="flex items-start gap-3"><strong className="text-slate-800">Global Standard:</strong> PVEL Top Performer Reliability Score.</li>
                  <li className="flex items-start gap-3"><strong className="text-slate-800">Technology Leader:</strong> Pioneers of HJT & TOPCon in India.</li>
                  <li className="flex items-start gap-3"><strong className="text-slate-800">Made in India:</strong> ALMM Approved & DCR Certified Modules.</li>
                </ul>
              </div>

              <div className="w-48 flex-shrink-0 hidden lg:block">
                <img src="/Waree.webp" alt="Waaree Energies" className="w-full h-40 object-contain rounded-lg shadow-sm border border-slate-100" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-xl font-semibold">About Waaree Energies</h3>
                <p className="mt-2 text-slate-600">Founded in 1989, Waaree Energies Ltd. is India's largest solar PV module manufacturer with a massive manufacturing capacity of 12 GW. Headquartered in Mumbai with state-of-the-art factories in Surat and Gujarat, Waaree is a global force in renewable energy, recognized for delivering high-quality, export-grade solar solutions.</p>
                <p className="mt-2 text-slate-600">We are the only Indian company to be rated Tier-1 by BloombergNEF for over 36 consecutive quarters. Our commitment to innovation has made us the preferred partner for utility-scale projects and rooftops across India and 68+ countries worldwide.</p>
                <p className="mt-3 text-sm text-slate-700"><strong>Vision:</strong> Providing sustainable energy solutions today for a better tomorrow.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Product Showcase — Elite & Ahnay Series</h3>
                <div className="mt-3 space-y-3">
                  <div className="p-3 border rounded-lg bg-slate-50">
                    <h4 className="font-bold">Elite Series (N-Type TOPCon & HJT)</h4>
                    <p className="text-sm text-slate-700">The Future of Efficiency. Power Output: 580 Wp – 700+ Wp. Efficiency: &gt;22.8% (Up to 23%+).</p>
                  </div>

                  <div className="p-3 border rounded-lg bg-slate-50">
                    <h4 className="font-bold">Ahnay Series (Bifacial Mono PERC)</h4>
                    <p className="text-sm text-slate-700">Robust. Reliable. High-Yield. Power Output: 525 Wp – 550 Wp. Efficiency: ~21.5%.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Why Choose Waaree?</h4>
                <ol className="list-decimal list-inside text-slate-700 mt-2 space-y-1 text-sm">
                  <li><strong>Unmatched Scale:</strong> Consistent supply and rapid delivery.</li>
                  <li><strong>Export Quality:</strong> Modules meet USA & Europe standards.</li>
                  <li><strong>ALMM & DCR Ready:</strong> Compliant with MNRE ALMM and DCR.</li>
                  <li><strong>Rigorous Testing:</strong> NABL accredited labs and 50+ reliability tests.</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg font-semibold">Technical Specifications & Downloads</h4>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 uppercase text-xs">
                        <th className="p-2 border">Feature</th>
                        <th className="p-2 border">Elite (TOPCon/HJT)</th>
                        <th className="p-2 border">Ahnay (Mono PERC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="p-2 border">Cell Type</td><td className="p-2 border">N-Type / HJT 16BB</td><td className="p-2 border">P-Type Mono 10BB</td></tr>
                      <tr><td className="p-2 border">Power Range</td><td className="p-2 border">580W - 715W</td><td className="p-2 border">535W - 550W</td></tr>
                      <tr><td className="p-2 border">Module Efficiency</td><td className="p-2 border">&gt; 22.80%</td><td className="p-2 border">&gt; 21.30%</td></tr>
                      <tr><td className="p-2 border">Temp. Coefficient</td><td className="p-2 border">-0.26% / °C</td><td className="p-2 border">-0.34% / °C</td></tr>
                      <tr><td className="p-2 border">Warranty</td><td className="p-2 border">12 Product / 30 Performance</td><td className="p-2 border">12 Product / 27 Performance</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
