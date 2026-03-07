"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Shield, Zap, Settings, ArrowRight, CheckCircle2, XCircle, Info, Layers } from 'lucide-react';

// --- DATA ---
const MATERIALS = [
    {
        id: 1,
        name: "Hot-Dip Galvanized Mild Steel",
        description: "Mild steel fabricated into frames and hot-dip galvanized.",
        specs: { zinc: "80\u2013120 micron", thickness: "2\u20136 mm", life: "20\u201330 years" },
        uses: ["Large utility farms", "Commercial rooftops", "Elevated structures"],
        pros: ["Very strong and rigid", "Good corrosion protection", "Cost-effective"],
        cons: ["Heavy", "Rusts if galvanization is poor"]
    },
    {
        id: 2,
        name: "Aluminium (Extruded)",
        description: "Extruded rails and brackets used mainly for lightweight installations.",
        specs: { alloy: "6005-T5", finish: "Anodized", life: "25\u201330 years" },
        uses: ["Residential rooftops", "Lightweight roofs"],
        pros: ["No rust", "Lightweight", "Easy installation"],
        cons: ["Higher cost than steel", "Lower strength for large spans"]
    },
    {
        id: 3,
        name: "Galvanized Iron (GI Steel)",
        description: "Steel coated with zinc to resist corrosion. Similar to HDG but thinner.",
        specs: { zinc: "40\u201380 micron", thickness: "1.6\u20133 mm", life: "15\u201320 years" },
        uses: ["Commercial structures", "Medium-scale installations"],
        pros: ["Cheaper than aluminium", "Good corrosion resistance"],
        cons: ["Heavier", "Life depends on coating thickness"]
    }
];

const STRUCTURE_TYPES = [
    { title: "Rooftop", desc: "Installed on building roofs.", tilt: "5\u00b0 \u2013 25\u00b0", pros: ["Uses existing space", "Lower cost"], cons: ["Limited capacity"] },
    { title: "Ground Mount", desc: "Fixed directly in the ground.", tilt: "15\u00b0 \u2013 30\u00b0", pros: ["Large capacity", "Easy maintenance"], cons: ["Requires land"] },
    { title: "Elevated", desc: "High steel structures.", tilt: "Custom", pros: ["Dual use space"], cons: ["Expensive", "Heavy structure"] },
];

export default function MountingStructuresGuide() {
    return (
        <div className="space-y-12">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Layers className="w-6 h-6" /> Types of Mounting Structures
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {STRUCTURE_TYPES.map((type, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-2">{type.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">{type.desc}</p>
                            <div className="text-sm">
                                <div className="font-medium text-green-600">Pros:</div>
                                <ul className="list-disc pl-4 text-gray-600 mb-2">
                                    {type.pros.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                                <div className="font-medium text-red-600">Cons:</div>
                                <ul className="list-disc pl-4 text-gray-600">
                                    {type.cons.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-7 h-7 text-green-600" /> Structure Materials
                </h3>
                <div className="space-y-4">
                    {MATERIALS.map((material) => (
                        <div key={material.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <h4 className="text-lg font-bold text-gray-900">{material.name}</h4>
                                <p className="text-sm text-gray-600">{material.description}</p>
                            </div>
                            <div className="p-6 grid md:grid-cols-2 gap-6 bg-white">
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Advantages
                                    </h5>
                                    <ul className="space-y-2">
                                        {material.pros.map((pro, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" /> {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-500" /> Disadvantages
                                    </h5>
                                    <ul className="space-y-2">
                                        {material.cons.map((con, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" /> {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
