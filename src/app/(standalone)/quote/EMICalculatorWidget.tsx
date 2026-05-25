"use client";

import React, { useState } from "react";

const SYSTEM_DATA = [
    { size: "3 kW", emi: "₹3,450", savings: "₹4,200" },
    { size: "5 kW", emi: "₹5,750", savings: "₹7,000" },
    { size: "10 kW", emi: "₹11,500", savings: "₹14,000" },
];

export function EMICalculatorWidget() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const activeData = SYSTEM_DATA[selectedIndex];

    return (
        <div className="bg-white rounded-2xl p-7 max-w-md mx-auto lg:ml-auto lg:mr-0 text-slate-900 shadow-2xl">
            <h3 className="text-xl font-bold mb-5">Get Savings and EMI Estimates</h3>
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Select System Size</label>
                    <div className="grid grid-cols-3 gap-3">
                        {SYSTEM_DATA.map((data, idx) => {
                            const isSelected = selectedIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`text-center py-3 px-2 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold ${
                                        isSelected
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
                                    }`}
                                >
                                    {data.size}
                                    {idx === 0 && (
                                        <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
                                            Recommended
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Estimated EMI</p>
                        <p className="text-2xl font-black text-blue-600">
                            {activeData.emi}<span className="text-xs text-slate-400 font-medium">/mo</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Est. Savings</p>
                        <p className="text-2xl font-black text-green-600">
                            {activeData.savings}<span className="text-xs text-slate-400 font-medium">/mo</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
