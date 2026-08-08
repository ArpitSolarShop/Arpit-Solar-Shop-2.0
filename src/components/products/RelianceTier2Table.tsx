import React from 'react';
import { Button } from "@/components/ui/button";

export interface RelianceSystemData {
  systemSize: number;
  noOfModules: number;
  inverterCapacity: number;
  phase: string;
  hdgElevatedPrice: number;
}

export function RelianceTier2Table({ data, onRowClick }: { data: any[]; onRowClick: (product: any) => void }) {
  return (
    <div className="bg-[#FAF9F5] p-6 md:p-8 rounded-xl font-sans w-full border border-[#E9E4D6]">
      <div className="mb-6">
        <h4 className="text-[#C1A065] text-sm font-bold tracking-widest uppercase mb-1">Tier 02</h4>
        <h2 className="text-[#132A4B] text-3xl md:text-4xl font-extrabold mb-2">Customer Price</h2>
        <p className="text-gray-600 text-sm md:text-base">Reliance New Energy Solar rooftop systems · ex-GST, per system · Retail / end-customer selling price</p>
      </div>

      <div className="bg-white overflow-hidden shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#182C4E] text-white">
                <th className="py-4 px-6 font-semibold text-sm tracking-wide border-b border-[#0f1d35]">SYSTEM SIZE</th>
                <th className="py-4 px-6 font-semibold text-sm tracking-wide border-b border-[#0f1d35]">PANELS</th>
                <th className="py-4 px-6 font-semibold text-sm tracking-wide border-b border-[#0f1d35]">INVERTER</th>
                <th className="py-4 px-6 font-semibold text-sm tracking-wide text-right border-b border-[#0f1d35]">CUSTOMER PRICE</th>
                <th className="py-4 px-6 font-semibold text-sm tracking-wide text-center border-b border-[#0f1d35]">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE8]">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#132A4B] text-base">{item.systemSize} kW</span>
                      {item.phase?.includes('Three') && (
                        <span className="bg-[#E9F0FA] text-[#3B6BAE] text-xs font-bold px-3 py-1 rounded-full">3-Phase</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {item.noOfModules} (710W)
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {item.inverterCapacity} kW
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-[#1C7A4A] font-extrabold text-lg whitespace-nowrap">
                      ₹ {item.totalPrice?.toLocaleString('en-IN')}/-
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Button onClick={() => onRowClick(item)} size="sm" className="bg-[#182C4E] hover:bg-[#0f1d35] text-white rounded px-6 whitespace-nowrap">
                      Get Quote
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-[#F6F5ED] py-3 px-6 flex justify-between items-center text-sm text-gray-600 border-t border-gray-200">
          <span>{data.length} system sizes</span>
          <span>Prices in ₹ (INR)</span>
        </div>
      </div>
    </div>
  );
}
