import React, { useEffect, useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import IntegratedQuoteForm from '../components/forms/integrated-quote-form'
import { supabase } from '@/integrations/supabase/client'

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
}

type ModuleTypeFilter = 'all' | 'Mono Bifacial' | 'TopCon'

export default function IntegratedPriceData() {
  const [rows, setRows] = useState<IntegratedRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IntegratedRow | null>(null)
  const [moduleTypeFilter, setModuleTypeFilter] = useState<ModuleTypeFilter>('all')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('integrated_products' as any)
          .select('*')
          .order('system_kw', { ascending: true })

        if (error) throw error
        if (!data) {
          setRows([])
          return
        }

        if (mounted) {
          setRows(data.map((r: any) => ({
            id: r.id,
            brand: r.brand,
            system_kw: Number(r.system_kw),
            phase: r.phase,
            price: Number(r.price),
            inverter_capacity_kw: Number(r.inverter_capacity_kw),
            module_watt: Number(r.module_watt),
            module_type: r.module_type || 'TopCon',
            no_of_modules: Number(r.no_of_modules),
            acdb_nos: r.acdb_nos ? Number(r.acdb_nos) : 1,
            dcdb_nos: r.dcdb_nos ? Number(r.dcdb_nos) : 1,
            earthing_rod_nos: r.earthing_rod_nos ? Number(r.earthing_rod_nos) : 3,
            earthing_chemical_nos: r.earthing_chemical_nos ? Number(r.earthing_chemical_nos) : 3,
            ac_wire_brand: r.ac_wire_brand || 'Polycab',
            ac_wire_length_mtr: r.ac_wire_length_mtr ? Number(r.ac_wire_length_mtr) : 10,
            dc_wire_brand: r.dc_wire_brand || 'Polycab',
            dc_wire_length_mtr: r.dc_wire_length_mtr ? Number(r.dc_wire_length_mtr) : 20,
            earthing_wire_brand: r.earthing_wire_brand || 'AL Wire',
            earthing_wire_length_mtr: r.earthing_wire_length_mtr ? Number(r.earthing_wire_length_mtr) : 90,
            lighting_arrestor_qty: r.lighting_arrestor_qty ? Number(r.lighting_arrestor_qty) : 1,
          })))
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

  // Filter rows based on selected module type
  const filteredRows = useMemo(() => {
    if (moduleTypeFilter === 'all') {
      return rows
    }
    return rows.filter(row => row.module_type === moduleTypeFilter)
  }, [rows, moduleTypeFilter])

  // Get unique module types for statistics
  const moduleTypeStats = useMemo(() => {
    const stats = {
      all: rows.length,
      'Mono Bifacial': rows.filter(r => r.module_type === 'Mono Bifacial').length,
      'TopCon': rows.filter(r => r.module_type === 'TopCon').length,
    }
    return stats
  }, [rows])

  const handleRowClick = (row: IntegratedRow) => {
    setSelectedProduct(row)
    setIsFormOpen(true)
  }

  const getModuleTypeBadgeColor = (moduleType: string | null) => {
    if (moduleType === 'TopCon') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (moduleType === 'Mono Bifacial') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-slate-100 text-slate-800 border-slate-300'
  }

  return (
    <div className="max-w-full mx-auto my-8 px-4">
      {/* Header with Filter Toggles */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Integrated Solar Products</h2>
            <p className="text-sm text-slate-600 mt-1">Browse our comprehensive range of integrated solar solutions</p>
          </div>
        </div>
        
        {/* Module Type Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-slate-700 mr-2">Filter by Module Type:</span>
          <Button
            variant={moduleTypeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setModuleTypeFilter('all')}
            className={moduleTypeFilter === 'all' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-white hover:bg-slate-50 border-slate-300'
            }
          >
            All ({moduleTypeStats.all})
          </Button>
          <Button
            variant={moduleTypeFilter === 'Mono Bifacial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setModuleTypeFilter('Mono Bifacial')}
            className={moduleTypeFilter === 'Mono Bifacial' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-white hover:bg-slate-50 border-slate-300'
            }
          >
            Mono Bifacial ({moduleTypeStats['Mono Bifacial']})
          </Button>
          <Button
            variant={moduleTypeFilter === 'TopCon' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setModuleTypeFilter('TopCon')}
            className={moduleTypeFilter === 'TopCon' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-white hover:bg-slate-50 border-slate-300'
            }
          >
            TopCon ({moduleTypeStats.TopCon})
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        {loading && (
          <div className="text-center py-8 text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 p-4 bg-red-50 border-l-4 border-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredRows.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-lg">No products found for the selected filter.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModuleTypeFilter('all')}
                  className="mt-4"
                >
                  Show All Products
                </Button>
              </div>
            ) : (
              <table className="min-w-[1200px] w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase border-b-2 border-slate-200">
                    <th className="p-3 border-r">Module Type</th>
                    <th className="p-3 border-r">Brand</th>
                    <th className="p-3 border-r">System (kW)</th>
                    <th className="p-3 border-r">Phase</th>
                    <th className="p-3 border-r">Price (₹)</th>
                    <th className="p-3 border-r">Inverter (kW)</th>
                    <th className="p-3 border-r">Module (W)</th>
                    <th className="p-3 border-r">No. of Modules</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr 
                      key={row.id} 
                      className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3 border-r">
                        <Badge className={`${getModuleTypeBadgeColor(row.module_type)} border font-medium`}>
                          {row.module_type || 'N/A'}
                        </Badge>
                      </td>
                      <td className="p-3 border-r font-medium text-slate-900">{row.brand}</td>
                      <td className="p-3 border-r text-slate-700">{row.system_kw} kW</td>
                      <td className="p-3 border-r">
                        <Badge variant="outline" className="border-slate-300">
                          {row.phase}
                        </Badge>
                      </td>
                      <td className="p-3 border-r font-semibold text-blue-700">
                        ₹{row.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 border-r text-slate-700">{row.inverter_capacity_kw} kW</td>
                      <td className="p-3 border-r text-slate-700">{row.module_watt} W</td>
                      <td className="p-3 border-r text-slate-700">{row.no_of_modules} Nos</td>
                      <td className="p-3">
                        <Button 
                          size="sm" 
                          onClick={() => handleRowClick(row)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
                        >
                          Get Quote
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Show active filter info */}
      {!loading && !error && filteredRows.length > 0 && (
        <div className="mt-4 text-sm text-slate-600">
          Showing <strong>{filteredRows.length}</strong> product{filteredRows.length !== 1 ? 's' : ''} 
          {moduleTypeFilter !== 'all' && (
            <> for <strong>{moduleTypeFilter}</strong> module type</>
          )}
        </div>
      )}

      <IntegratedQuoteForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        product={selectedProduct} 
        productName={selectedProduct ? `${selectedProduct.brand} ${selectedProduct.system_kw} kW (${selectedProduct.module_type || 'N/A'})` : undefined} 
        powerDemandKw={selectedProduct ? selectedProduct.system_kw : null} 
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
                <img src="/AdaniSolar.png" alt="Adani Solar" className="w-full h-40 object-contain rounded-lg shadow-sm border border-slate-100" />
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
