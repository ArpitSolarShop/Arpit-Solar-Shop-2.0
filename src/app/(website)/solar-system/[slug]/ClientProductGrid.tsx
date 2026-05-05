"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, FileText, Loader2 } from "lucide-react";
import ClientQuoteTrigger from "./ClientQuoteTrigger";

export default function ClientProductGrid({
    slug,
    slugInfo
}: {
    slug: string,
    slugInfo: {
        capacityKw: number | null,
        systemType: string | null,
        isPumpOrChakki: boolean,
        rawQuery: string
    }
}) {
    const [matchingConfigs, setMatchingConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all published products from Supabase
                const { data: products, error } = await supabase
                    .from('solar_products')
                    .select('*')
                    .eq('is_published', true);

                if (error || !products) throw error;

                // Filter Logic to find matching configurations across all products
                const arr: any[] = [];

                products.forEach((product) => {
                    // FIX: The database deleted the string column for brand, so we must extract it from the generic product name
                    const parsedBrand = (product as any).brand || (
                        product.name?.includes('Tata') ? 'Tata' :
                            product.name?.includes('Reliance') ? 'Reliance' :
                                product.name?.includes('Shakti') ? 'Shakti' :
                                    product.name?.includes('Sakti') ? 'Sakti' :
                                        'Unknown'
                    );
                    (product as any).brand = parsedBrand;

                    // Normalize the product type string by removing all spaces and hyphens
                    const prodTypeStr = (product.product_type || '').toLowerCase().replace(/[\s-]/g, '');
                    let typeMatches = true;

                    if (slugInfo.systemType && !slugInfo.isPumpOrChakki) {
                        const isGridTie = prodTypeStr.includes('gridtie') || prodTypeStr.includes('ongrid') || prodTypeStr.includes('commercial') || prodTypeStr.includes('residential');

                        // FIX: Debugging the category logic match

                        if (slugInfo.systemType === 'On-Grid' && !isGridTie) {
                            typeMatches = false;
                        }
                        if (slugInfo.systemType === 'Off-Grid' && !prodTypeStr.includes('offgrid')) {
                            typeMatches = false;
                        }
                        if (slugInfo.systemType === 'Hybrid' && !prodTypeStr.includes('hybrid')) {
                            typeMatches = false;
                        }
                    }

                    if (slugInfo.isPumpOrChakki) {
                        if (slugInfo.systemType === 'Solar Pump' && !prodTypeStr.includes('pump')) typeMatches = false;
                        if (slugInfo.systemType === 'Solar Chakki' && !prodTypeStr.includes('chakki')) typeMatches = false;
                    }

                    if (!typeMatches) return; // Skip this product brand entirely if type doesn't match

                    // Safely extract the configuration array regardless of how it was seeded
                    let configsData = (product as any).system_configurations;
                    let configsArray: any[] = [];

                    if (Array.isArray(configsData) && configsData.length > 0) {
                        configsArray = configsData;
                    } else if (configsData && typeof configsData === 'object') {
                        // Sometimes it's nested like { data: [ ... ] }
                        const possibleArrays = Object.values(configsData).find(v => Array.isArray(v));
                        if (possibleArrays) {
                            configsArray = possibleArrays as any[];
                        } else if (Array.isArray(configsData.data)) {
                            configsArray = configsData.data;
                        } else {
                            // Convert object values to an array if it's a map
                            configsArray = Object.values(configsData).filter(v => typeof v === 'object' && v !== null);
                        }
                    }

                    // FIX: If the database is missing system_configurations (as seen in current schema), we extract from name!
                    if (configsArray.length === 0) {
                        const extractedMatch = product.name.match(/(\d+(?:\.\d+)?)\s*[kK][wW]/);
                        const extractedKw = extractedMatch ? parseFloat(extractedMatch[1]) : 0;

                        if (extractedKw > 0 || !slugInfo.capacityKw) {
                            configsArray = [{
                                systemSize: extractedKw,
                                systemSizeKW: extractedKw,
                                capacityKw: extractedKw,
                                price: product.price || 0,
                                numberOfModules: extractedKw ? Math.ceil((extractedKw * 1000) / 540) : 0, // estimate 540W panels
                                inverterCapacity: `${Math.ceil(extractedKw)}kW`,
                                phase: extractedKw > 5 ? '3-Phase' : '1-Phase'
                            }];
                        }
                    }

                    if (configsArray.length > 0) {
                        if (slugInfo.capacityKw) {
                            // Robust system size extractor (handles '5', '5 kW', 5.35)
                            const getSysSize = (cfg: any) => {
                                if (!cfg) return 0;
                                const val = cfg.systemSize || cfg.systemSizeKW || cfg.systemSizeKWp || cfg.capacityKw || 0;
                                if (typeof val === 'number') return val;
                                // Extract just the numbers/decimals if it's a string like "5 kW"
                                const match = String(val).match(/[\d.]+/);
                                return match ? parseFloat(match[0]) : 0;
                            };

                            let closestConfig = configsArray[0];
                            let minDiff = Math.abs(getSysSize(configsArray[0]) - slugInfo.capacityKw);

                            for (let i = 1; i < configsArray.length; i++) {
                                const sysSize = getSysSize(configsArray[i]);
                                if (sysSize > 0) {
                                    const diff = Math.abs(sysSize - slugInfo.capacityKw);
                                    if (diff < minDiff) {
                                        minDiff = diff;
                                        closestConfig = configsArray[i];
                                    }
                                }
                            }

                            // Only include if the closest match is within a 50% margin
                            const maxAllowance = slugInfo.capacityKw * 0.50;
                            // FIX: Console log the closest check

                            if (minDiff <= maxAllowance) {
                                arr.push({
                                    brand: product.brand,
                                    parentProduct: product,
                                    configDetails: closestConfig
                                });
                            } else {
                                // console.log(`REJECTED ${product.brand} - Diff ${minDiff} exceeds allowance ${maxAllowance}`);
                            }
                        } else {
                            arr.push({
                                brand: product.brand,
                                parentProduct: product,
                                configDetails: configsArray[0]
                            });
                        }
                    }
                });

                arr.sort((a, b) => {
                    const getSysSize = (cfg: any) => {
                        if (!cfg) return 0;
                        const val = cfg.systemSize || cfg.systemSizeKW || cfg.systemSizeKWp || cfg.capacityKw || 0;
                        if (typeof val === 'number') return val;
                        const match = String(val).match(/[\d.]+/);
                        return match ? parseFloat(match[0]) : 0;
                    };

                    if (slugInfo.capacityKw) {
                        const distA = Math.abs(getSysSize(a.configDetails) - slugInfo.capacityKw);
                        const distB = Math.abs(getSysSize(b.configDetails) - slugInfo.capacityKw);
                        return distA - distB;
                    }
                    return 0;
                });

                setMatchingConfigs(arr);
            } catch (err) {
                console.error("Error fetching configurations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, slugInfo]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (matchingConfigs.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border p-12 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {slugInfo.rawQuery.toUpperCase()} Solutions Available
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    We offer customized {slugInfo.rawQuery} solutions configured for your exact needs. Contact us directly to get the best brand options available in Varanasi.
                </p>
                <ClientQuoteTrigger
                    category="Generic"
                    btnText={`Get Quote for ${slugInfo.rawQuery}`}
                />
            </div>
        );
    }

    const formatPrice = (price?: number) => price ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price) : "Contact for Price";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingConfigs.map((item, idx) => {
                const conf = item.configDetails;
                const price = conf.preGiElevatedPrice || conf.price;
                const sysSizeVal = conf.systemSize || conf.systemSizeKW || conf.systemSizeKWp || conf.capacityKw;

                return (
                    <Card key={idx} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-100 flex flex-col">
                        <div className="bg-gray-50 p-6 flex items-center justify-center border-b h-40">
                            <h3 className="text-3xl font-bold text-center text-gray-800">
                                {sysSizeVal} kWp
                                <br />
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block mt-2">{item.brand}</span>
                            </h3>
                        </div>
                        <CardContent className="p-6 flex-grow flex flex-col">
                            <ul className="space-y-4 flex-grow mb-8">
                                <li className="flex items-start">
                                    <Zap className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Inverter: <span className="font-normal">{conf.inverterCapacity || sysSizeVal} kW</span></span>
                                </li>
                                <li className="flex items-start">
                                    <Shield className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">Phase: <span className="font-normal">{conf.phase || 'Single/Three'} Phase</span></span>
                                </li>
                                {conf.noOfModules && (
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">Modules: <span className="font-normal">{conf.noOfModules} Panels</span></span>
                                    </li>
                                )}
                                <li className="flex items-start">
                                    <FileText className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium text-sm">Base Product: {item.parentProduct.name}</span>
                                </li>
                            </ul>

                            <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-100">
                                <p className="text-sm text-gray-500 mb-1 font-medium">Estimated System Price</p>
                                <p className="text-3xl font-bold text-gray-900">{formatPrice(price)}</p>
                                <p className="text-xs text-gray-400 mt-2 leading-relaxed">*Prices are indicative and vary based on precise roof structure and AC/DC cable length.</p>
                            </div>

                            <div className="mt-auto">
                                <ClientQuoteTrigger
                                    category={item.brand.includes('Tata') ? 'Tata' : item.brand.includes('Reliance') ? 'Reliance' : item.brand.includes('Shakti') ? 'Shakti' : 'Generic'}
                                    btnText={`Get Quote for ${sysSizeVal}kW ${item.brand}`}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
}
