/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { Battery } from "lucide-react"
import HybridQuoteForm from "@/components/forms/hybrid-quote-form"

type HybridSystemData = {
  id: number
  category: 'DCR' | 'NON_DCR' | 'NDCR'
  variant: 'WITH_BATTERY' | 'WOBB'
  capacity_kw: number
  phase: string
  price_inr: number
  inverter_kwp: number
  battery_kwh: number | null
  module_watt: number
  module_count: number
  structure_type: string | null
  technology: 'TOPCON' | 'MONO_BIFACIAL' | 'TOPCON_NDCR'
  acdb_qty: number | null
  dcdb_qty: number | null
  earthing_rod_qty: number | null
  earthing_chemical_qty: number | null
  lightning_arrester_qty: number | null
  ac_wire_mtr: number | null
  dc_wire_mtr: number | null
  earthing_wire_mtr: number | null
  created_at: string | null
  updated_at: string | null
}

type TechnologyFilter = 'all' | 'TOPCON' | 'MONO_BIFACIAL' | 'TOPCON_NDCR'
type VariantFilter = 'all' | 'WITH_BATTERY' | 'WOBB'

export default function HybridSolarPricing() {
  const [pricingData, setPricingData] = useState<HybridSystemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSystem, setSelectedSystem] = useState<HybridSystemData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [technologyFilter, setTechnologyFilter] = useState<TechnologyFilter>('all')
  const [variantFilter, setVariantFilter] = useState<VariantFilter>('all')

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      setLoading(true);

      // Fetch data from Supabase with proper typing
      const { data, error } = await supabase
        .from('hybrid_solar_pricing')
        .select('*')
        .order('capacity_kw', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map and ensure all fields are properly typed
        const mappedData = data.map((r: any) => {
          // Normalize category to ensure consistent values
          const normalizedCategory = (r.category || '').toUpperCase().trim()
          let category: 'DCR' | 'NON_DCR' | 'NDCR' = 'DCR'
          if (normalizedCategory === 'NON_DCR' || normalizedCategory === 'NON-DCR') {
            category = 'NON_DCR'
          } else if (normalizedCategory === 'NDCR') {
            category = 'NDCR'
          } else {
            category = 'DCR'
          }

          return {
            id: r.id,
            category: category,
            variant: r.variant as 'WITH_BATTERY' | 'WOBB',
            capacity_kw: Number(r.capacity_kw),
            phase: r.phase || '1Ph',
            price_inr: Number(r.price_inr),
            inverter_kwp: Number(r.inverter_kwp),
            battery_kwh: r.battery_kwh ? Number(r.battery_kwh) : null,
            module_watt: Number(r.module_watt),
            module_count: Number(r.module_count),
            structure_type: r.structure_type || '3x6',
            technology: (r.technology || 'TOPCON') as 'TOPCON' | 'MONO_BIFACIAL' | 'TOPCON_NDCR',
            acdb_qty: r.acdb_qty ? Number(r.acdb_qty) : 1,
            dcdb_qty: r.dcdb_qty ? Number(r.dcdb_qty) : 1,
            earthing_rod_qty: r.earthing_rod_qty ? Number(r.earthing_rod_qty) : 3,
            earthing_chemical_qty: r.earthing_chemical_qty ? Number(r.earthing_chemical_qty) : 3,
            lightning_arrester_qty: r.lightning_arrester_qty ? Number(r.lightning_arrester_qty) : 1,
            ac_wire_mtr: r.ac_wire_mtr ? Number(r.ac_wire_mtr) : 10,
            dc_wire_mtr: r.dc_wire_mtr ? Number(r.dc_wire_mtr) : 20,
            earthing_wire_mtr: r.earthing_wire_mtr ? Number(r.earthing_wire_mtr) : 90,
            created_at: r.created_at,
            updated_at: r.updated_at,
          }
        });

        // Debug: Log unique categories and technologies to verify data
        const uniqueCategories = [...new Set(mappedData.map(r => r.category))]
        const uniqueTechnologies = [...new Set(mappedData.map(r => r.technology))]
        console.log('Hybrid Solar Data Loaded:', {
          total: mappedData.length,
          categories: uniqueCategories,
          technologies: uniqueTechnologies,
          categoryCounts: {
            DCR: mappedData.filter(r => r.category === 'DCR').length,
            NON_DCR: mappedData.filter(r => r.category === 'NON_DCR').length,
            NDCR: mappedData.filter(r => r.category === 'NDCR').length,
          }
        })

        setPricingData(mappedData);
      } else {
        console.warn('No data found in hybrid_solar_pricing table');
        setPricingData([]);
      }

      setLoading(false)
    } catch (err) {
      console.error('Error fetching pricing:', err)
      setError('Failed to load pricing data. Please try again later.')
      setLoading(false)
    }
  }

  // Filter rows based on selected filters
  const filteredRows = useMemo(() => {
    return pricingData.filter(row => {
      // Normalize values for comparison
      const rowTech = (row.technology || '').toUpperCase().trim()
      const rowVariant = (row.variant || '').toUpperCase().trim()

      const matchesTechnology = technologyFilter === 'all' || rowTech === technologyFilter.toUpperCase()
      const matchesVariant = variantFilter === 'all' || rowVariant === variantFilter.toUpperCase()

      return matchesTechnology && matchesVariant
    })
  }, [pricingData, technologyFilter, variantFilter])

  // Get statistics for filter buttons
  const filterStats = useMemo(() => {
    return {
      technology: {
        all: pricingData.length,
        TOPCON: pricingData.filter(r => (r.technology || '').toUpperCase().trim() === 'TOPCON').length,
        MONO_BIFACIAL: pricingData.filter(r => (r.technology || '').toUpperCase().trim() === 'MONO_BIFACIAL').length,
        TOPCON_NDCR: pricingData.filter(r => (r.technology || '').toUpperCase().trim() === 'TOPCON_NDCR').length,
      },
      variant: {
        all: pricingData.length,
        WITH_BATTERY: pricingData.filter(r => (r.variant || '').toUpperCase().trim() === 'WITH_BATTERY').length,
        WOBB: pricingData.filter(r => (r.variant || '').toUpperCase().trim() === 'WOBB').length,
      },
    }
  }, [pricingData])

  const handleRowClick = (system: HybridSystemData) => {
    setSelectedSystem(system)
    setIsFormOpen(true)
  }

  const handleCustomSystemClick = () => {
    setSelectedSystem(null)
    setIsFormOpen(true)
  }

  const getTechnologyBadgeColor = (tech: string) => {
    if (tech === 'TOPCON') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (tech === 'TOPCON_NDCR') return 'bg-cyan-100 text-cyan-800 border-cyan-300'
    if (tech === 'MONO_BIFACIAL') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-slate-100 text-slate-800 border-slate-300'
  }

  const getCategoryBadgeColor = (cat: string) => {
    if (cat === 'DCR') return 'bg-purple-100 text-purple-800 border-purple-300'
    if (cat === 'NDCR') return 'bg-teal-100 text-teal-800 border-teal-300'
    return 'bg-orange-100 text-orange-800 border-orange-300'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-500">Loading pricing options...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 border border-red-200 bg-red-50 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto my-8 px-4">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Hybrid Solar System Pricing</h2>
          <p className="text-sm text-slate-600 mt-1">Choose from our range of hybrid solar systems with battery backup</p>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-4">
          {/* Technology Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-slate-700 mr-2">Technology:</span>
            <Button
              variant={technologyFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTechnologyFilter('all')}
              className={technologyFilter === 'all'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              All ({filterStats.technology.all})
            </Button>
            <Button
              variant={technologyFilter === 'TOPCON' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTechnologyFilter('TOPCON')}
              className={technologyFilter === 'TOPCON'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              TOPCon ({filterStats.technology.TOPCON})
            </Button>
            <Button
              variant={technologyFilter === 'TOPCON_NDCR' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTechnologyFilter('TOPCON_NDCR')}
              className={technologyFilter === 'TOPCON_NDCR'
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              TOPCon NDCR ({filterStats.technology.TOPCON_NDCR})
            </Button>
            <Button
              variant={technologyFilter === 'MONO_BIFACIAL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTechnologyFilter('MONO_BIFACIAL')}
              className={technologyFilter === 'MONO_BIFACIAL'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              Mono Bifacial ({filterStats.technology.MONO_BIFACIAL})
            </Button>
          </div>

          {/* Variant Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-slate-700 mr-2">Variant:</span>
            <Button
              variant={variantFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVariantFilter('all')}
              className={variantFilter === 'all'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              All ({filterStats.variant.all})
            </Button>
            <Button
              variant={variantFilter === 'WITH_BATTERY' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVariantFilter('WITH_BATTERY')}
              className={variantFilter === 'WITH_BATTERY'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              With Battery ({filterStats.variant.WITH_BATTERY})
            </Button>
            <Button
              variant={variantFilter === 'WOBB' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVariantFilter('WOBB')}
              className={variantFilter === 'WOBB'
                ? 'bg-slate-600 hover:bg-slate-700 text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300'
              }
            >
              Without Battery ({filterStats.variant.WOBB})
            </Button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        {filteredRows.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">No products found for the selected filters.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTechnologyFilter('all')
                setVariantFilter('all')
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <table className="min-w-[1400px] w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase border-b-2 border-slate-200">
                <th className="p-3 border-r">Technology</th>
                <th className="p-3 border-r">Category</th>
                <th className="p-3 border-r">System (kW)</th>
                <th className="p-3 border-r">Phase</th>
                <th className="p-3 border-r">Variant</th>
                <th className="p-3 border-r">Inverter (kW)</th>
                <th className="p-3 border-r">Battery (kWh)</th>
                <th className="p-3 border-r">Module (W)</th>
                <th className="p-3 border-r">Modules</th>
                <th className="p-3 border-r">Price (₹)</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((system) => (
                <tr
                  key={system.id}
                  className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-3 border-r">
                    <Badge className={`${getTechnologyBadgeColor(system.technology)} border font-medium`}>
                      {system.technology}
                    </Badge>
                  </td>
                  <td className="p-3 border-r">
                    <Badge className={`${getCategoryBadgeColor(system.category)} border font-medium`}>
                      {system.category}
                    </Badge>
                  </td>
                  <td className="p-3 border-r font-medium text-slate-900">{system.capacity_kw} kW</td>
                  <td className="p-3 border-r">
                    <Badge variant="outline" className="border-slate-300">
                      {system.phase}
                    </Badge>
                  </td>
                  <td className="p-3 border-r">
                    {system.variant === 'WITH_BATTERY' ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <Battery className="h-3 w-3 mr-1 inline" />
                        With Battery
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-800 border-slate-300">
                        Without Battery
                      </Badge>
                    )}
                  </td>
                  <td className="p-3 border-r text-slate-700">{system.inverter_kwp} kW</td>
                  <td className="p-3 border-r text-slate-700">
                    {system.battery_kwh ? `${system.battery_kwh} kWh` : 'N/A'}
                  </td>
                  <td className="p-3 border-r text-slate-700">{system.module_watt} W</td>
                  <td className="p-3 border-r text-slate-700">{system.module_count} Nos</td>
                  <td className="p-3 border-r font-semibold text-blue-700">
                    ₹{system.price_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      onClick={() => handleRowClick(system)}
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
      </div>

      {/* Show active filter info */}
      {filteredRows.length > 0 && (
        <div className="mt-4 text-sm text-slate-600">
          Showing <strong>{filteredRows.length}</strong> product{filteredRows.length !== 1 ? 's' : ''}
          {(technologyFilter !== 'all' || variantFilter !== 'all') && (
            <> with filters:
              {technologyFilter !== 'all' && <strong className="ml-1">{technologyFilter}</strong>}
              {variantFilter !== 'all' && <strong className="ml-1">{variantFilter === 'WITH_BATTERY' ? 'With Battery' : 'Without Battery'}</strong>}
            </>
          )}
        </div>
      )}

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">Not Sure Which System You Need?</h3>
        <p className="text-blue-100 max-w-2xl mx-auto mb-6">
          Our solar experts will analyze your energy needs and recommend the perfect hybrid solar solution for your home or business.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={handleCustomSystemClick}
            className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 text-base"
            size="lg"
          >
            Get a Free Consultation
          </Button>
          <a href="tel:+919044555572" className="inline-flex items-center justify-center bg-transparent border border-white text-white hover:bg-white/10 font-medium py-3 px-6 text-base rounded-lg" aria-label="Call Now">Call Now: +91 9044555572</a>
        </div>
      </div>

      {/* Hybrid Quote Form Modal */}
      <HybridQuoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedSystem ? {
          id: selectedSystem.id,
          system_capacity: `${selectedSystem.capacity_kw} kW ${selectedSystem.phase}`,
          variant: selectedSystem.variant,
          price: selectedSystem.price_inr,
          battery_kwh: selectedSystem.battery_kwh,
          inverter_kwp: selectedSystem.inverter_kwp,
          module_watt: selectedSystem.module_watt,
          module_count: selectedSystem.module_count,
          category: selectedSystem.category,
          phase: selectedSystem.phase
        } : null}
        productName={selectedSystem ? `${selectedSystem.capacity_kw} kW ${selectedSystem.phase} ${selectedSystem.category} ${selectedSystem.technology} Hybrid System` : "Hybrid Solar System"}
        hasBattery={selectedSystem?.variant === 'WITH_BATTERY'}
        powerDemandKw={selectedSystem?.capacity_kw || null}
      />
    </div>
  )
}
