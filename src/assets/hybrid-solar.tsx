"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { Battery, Zap, Info } from "lucide-react"
import HybridQuoteForm from "@/components/forms/hybrid-quote-form"

type HybridSystemData = {
  id: number
  category: 'DCR' | 'NON_DCR'
  variant: 'WITH_BATTERY' | 'WOBB'
  capacity_kw: number
  phase: string
  price_inr: number
  inverter_kwp: number
  battery_kwh: number | null
  module_watt: number
  module_count: number
  structure_type: string | null
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function HybridSolarPricing() {
  const [pricingData, setPricingData] = useState<HybridSystemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<HybridSystemData | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

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
        .order('category', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Sort to ensure DCR comes first, then by capacity
        const sortedData = [...data].sort((a, b) => {
          if (a.category !== b.category) {
            return a.category === 'DCR' ? -1 : 1;
          }
          return (a.capacity_kw || 0) - (b.capacity_kw || 0);
        });
        
        setPricingData(sortedData as HybridSystemData[]);
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

  const handleRowClick = (system: HybridSystemData) => {
    setSelectedSystem(system)
    setIsFormOpen(true)
  }

  const handleCustomSystemClick = () => {
    setSelectedSystem(null)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 animate-pulse">Loading pricing options...</div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hybrid Solar System Pricing</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choose from our range of hybrid solar systems with battery backup for your home or business
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  System Size
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Inverter
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                  Storage Configuration
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-white uppercase tracking-wider">
                  Total Package Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pricingData.map((system) => (
                <tr 
                  key={system.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(system)}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-lg font-semibold text-gray-900">
                      {system.capacity_kw} kW {system.phase}
                      <div className="text-sm font-normal text-gray-500">
                        {system.category === 'DCR' ? 'DCR' : 'Non-DCR'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Zap className="h-3 w-3 mr-1" />
                        DURASOL HYBRID SOLAR INVERTER
                      </span>
                      <span className="text-xs text-gray-500">Smart Grid Technology</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="font-medium">
                        {system.variant === 'WITH_BATTERY' ? 'Full Hybrid Backup' : 'Grid-Tie (Daytime Only)'}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Inverter: {system.inverter_kwp} kWp
                        </div>
                        {system.variant === 'WITH_BATTERY' && system.battery_kwh && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Battery className="h-3 w-3 mr-1 text-yellow-500" />
                            {system.battery_kwh} kWh Battery
                          </span>
                        )}
                        {system.variant === 'WOBB' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No Battery Backup
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        {formatCurrency(system.price_inr)}
                      </div>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(system);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded-md text-sm"
                      >
                        Get Quote
                      </Button>
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="inline-flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          Prices include GST (5% System, 18% Service) & Installation
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
        productName={selectedSystem ? `${selectedSystem.capacity_kw} kW ${selectedSystem.phase} ${selectedSystem.category} Hybrid System` : "Hybrid Solar System"}
        hasBattery={selectedSystem?.variant === 'WITH_BATTERY'}
        powerDemandKw={selectedSystem?.capacity_kw || null}
      />
    </div>
  )
}
