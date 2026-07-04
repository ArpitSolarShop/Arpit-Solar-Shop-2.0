
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';
import { createClient } from '@supabase/supabase-js';
import {
    fetchClosestRow, // Still used for specific reliance config if needed, or legacy fallback
    fetchConfig,
    uploadToBucket,
    insertQuoteRequest
} from '@/lib/server/services/supabase';
import { generatePdfFromHtml } from '@/lib/server/services/pdf';
import { sendWhatsAppMessage } from '@/lib/server/services/whatsapp';
import { generateQuoteHtml } from '@/lib/quoteTemplate';
import { defaultComponents } from '@/lib/companyDetails';
import { pushLeadToCRM } from '@/lib/server/services/kit19-crm';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
    console.log('🔵 API Route /api/generate-quote called (Unified)');
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const body = await req.json();
        const formData = body;
        const {
            product_category,
            power_demand_kw,
            phone,
            source,
            metadata,
            phase,
            name,
            address,
            price_includes_gst: reqPriceIncludesGst, // Allow passing from frontend
            gst_rate: reqGstRate // Allow passing from frontend
        } = formData;

        // 1. Calculations & Data Fetching
        let tempVars: any = { ...formData };
        tempVars.ref_number = `Q-${Date.now().toString().slice(-6)}`;

        let calculatedValues = {
            basePrice: 0,
            gstAmount: 0,
            total: 0,
            grandTotal: 0,
            centralSubsidy: 0,
            stateSubsidy: 0,
            effectiveCost: 0,
            extraCosts: 0
        };

        let selectedProductData: any = {
            capacity: parseFloat(power_demand_kw) || 0,
            phase: phase === 'Three' ? 3 : 1,
            systemType: product_category === 'Hybrid' ? 'Hybrid' : 'On-grid',
            panelBrand: product_category,
            panelWattage: '550',
            panelType: 'Monocrystalline',
            inverterBrand: 'Best in Class',
            panelWarranty: '25 Years',
            inverterWarranty: '5 Years'
        };

        // --- Data Fetching Logic (Unified) ---
        if (source === 'Calculator Quote Form') {
            if (!metadata) throw new Error('Calculator form submission is missing metadata.');
            calculatedValues.basePrice = metadata.base_price;
            calculatedValues.gstAmount = metadata.gst_amount;
            calculatedValues.total = metadata.estimated_price;
            calculatedValues.grandTotal = metadata.estimated_price;
            // Subsidy calc for calculator form — PM Surya Ghar (Central) + UP State
            const capacity = parseFloat(power_demand_kw);
            const sanctionedKw = Math.floor(capacity); // Uses sanctioned load in whole kW
            // Central Subsidy: 1kW=30k, 2kW=60k, 3kW+=78k
            if (sanctionedKw < 1) calculatedValues.centralSubsidy = 0;
            else if (sanctionedKw === 1) calculatedValues.centralSubsidy = 30000;
            else if (sanctionedKw === 2) calculatedValues.centralSubsidy = 60000;
            else calculatedValues.centralSubsidy = 78000; // 3kW and above
            // UP State Subsidy: 1kW=15k, 2kW+=30k
            if (sanctionedKw < 1) calculatedValues.stateSubsidy = 0;
            else if (sanctionedKw === 1) calculatedValues.stateSubsidy = 15000;
            else calculatedValues.stateSubsidy = 30000; // 2kW and above

            calculatedValues.effectiveCost = Math.max(0, calculatedValues.grandTotal - calculatedValues.centralSubsidy - calculatedValues.stateSubsidy);

            // Attempt to fetch extra details if available
            const config = await fetchConfig('reliance_system_config');
            if (config) {
                selectedProductData.panelWattage = (config.product_description || '550').replace(/\D/g, '');
                selectedProductData.panelType = config.product_description || 'Monocrystalline';
            }

        } else {
            // Fetch Subsidies
            const { data: subsidies } = await supabase
                .from('solar_subsidies')
                .select('*')
                .eq('is_active', true);

            // Unified Fetch from solar_products
            // FIX: Robust source mapping - handle "Tata Power Solar", "Shakti Solar" etc.
            let categoryFilter = 'Tata';
            const catLower = (product_category || '').toLowerCase();
            if (catLower.includes('tata')) categoryFilter = 'Tata';
            else if (catLower.includes('shakti')) categoryFilter = 'Shakti';
            else if (catLower.includes('reliance')) categoryFilter = 'Reliance';
            else if (catLower.includes('hybrid')) categoryFilter = 'Hybrid';
            else if (catLower.includes('integrated')) categoryFilter = 'Integrated';
            else if (catLower.includes('adani') || catLower.includes('waree')) categoryFilter = 'Integrated';
            else categoryFilter = product_category || 'Tata';

            console.log(`🔎 Searching solar_products for ${categoryFilter}, Size: ${power_demand_kw}`);

            const { data: products, error } = await supabase
                .from('solar_products')
                .select('*')
                .eq('category', categoryFilter)
                .order('system_size_kw', { ascending: true });

            if (error) {
                console.error('Unified DB Query Error:', error);
                throw error;
            }

            let systemData: any;
            if (products && products.length > 0) {
                let filteredProducts = products;

                // HUGE FIX: Filter by Variant for Hybrid (With Battery vs Without Battery)
                if (categoryFilter === 'Hybrid' && formData.additional_details?.variant) {
                    const requestedVariant = formData.additional_details.variant;
                    const variantMatches = products.filter((p: any) =>
                        (p.specifications?.variant || 'WITH_BATTERY') === requestedVariant
                    );
                    if (variantMatches.length > 0) {
                        filteredProducts = variantMatches;
                    }
                }

                // FIX: Filter by Brand for Integrated Products (Waaree vs Adani vs Premier)
                if (categoryFilter === 'Integrated' && formData.additional_details?.brand) {
                    const requestedBrand = formData.additional_details.brand.toLowerCase();
                    const brandMatches = filteredProducts.filter((p: any) =>
                        (p.brand || '').toLowerCase() === requestedBrand ||
                        (p.specifications?.brand || '').toLowerCase() === requestedBrand
                    );
                    if (brandMatches.length > 0) {
                        filteredProducts = brandMatches;
                    }
                }

                // Find closest match — prefer exact match by kW AND price (from frontend) to disambiguate duplicate kW entries
                const frontendPrice = formData.additional_details?.price ? Number(formData.additional_details.price) : null;

                // Step 1: Try exact kW + price match (handles duplicate kW products like two 5.04kW at different prices)
                if (frontendPrice) {
                    systemData = filteredProducts.find((p: any) =>
                        Math.abs(p.system_size_kw - Number(power_demand_kw)) < 0.1 &&
                        Math.abs(Number(p.price) - frontendPrice) < 100 // Allow small rounding differences
                    );
                }

                // Step 2: Fall back to kW-only match
                if (!systemData) {
                    systemData = filteredProducts.find((p: any) =>
                        Math.abs(p.system_size_kw - Number(power_demand_kw)) < 0.1
                    );
                }

                // Step 3: Fall back to closest kW match
                if (!systemData) {
                    systemData = filteredProducts.reduce((prev: any, curr: any) =>
                        Math.abs(curr.system_size_kw - Number(power_demand_kw)) < Math.abs(prev.system_size_kw - Number(power_demand_kw)) ? curr : prev
                    );
                }

                console.log('✅ Matched product:', systemData?.name, '| Price:', systemData?.price, '| Frontend price hint:', frontendPrice);
            }

            let initialPrice = 0;
            let gstRate = 8.9;
            let priceIncludesGst = true;

            if (systemData) {
                initialPrice = Number(systemData.price);
                let specs = systemData.specifications || {};
                if (typeof specs === 'string') {
                    try {
                        specs = JSON.parse(specs);
                    } catch (e) {
                        console.error("Failed to parse specifications", e);
                    }
                }

                // Handle Reliance Special Pricing (Structure)
                if (product_category === 'Reliance' && specs.structure_prices) {
                    if (formData.mounting_type === 'Tin Shed') initialPrice = Number(specs.structure_prices.tin_shed || initialPrice);
                    else if (formData.mounting_type === 'RCC Elevated') initialPrice = Number(specs.structure_prices.rcc_elevated || specs.structure_prices.hdg_elevated || initialPrice);
                    else if (formData.mounting_type === 'Pre GI MMS') initialPrice = Number(specs.structure_prices.pre_gi_mms || initialPrice);
                    else if (formData.mounting_type === 'Without MMS') initialPrice = Number(specs.structure_prices.without_mms || initialPrice);
                }

                // Dynamic GST Calculation
                gstRate = systemData.gst_rate ?? 8.9;
                priceIncludesGst = systemData.price_includes_gst ?? true;

                // Product Data Population
                selectedProductData.capacity = systemData.system_size_kw;
                selectedProductData.phase = systemData.phase === 'Three' ? 3 : 1;
                if (specs.module_watt) selectedProductData.panelWattage = specs.module_watt;
                if (specs.module_count) selectedProductData.panelCount = specs.module_count;
                if (specs.inverter_capacity_kw || specs.inverter_kw) selectedProductData.inverterSize = specs.inverter_capacity_kw || specs.inverter_kw;
                if (specs.technology || specs.module_type) selectedProductData.panelType = specs.technology || specs.module_type;
                if (specs.brand) selectedProductData.panelBrand = specs.brand;
                if (specs.variant) selectedProductData.variant = specs.variant;

            } else {
                // Fallback Estimation
                console.log('⚠️ No unified product found, using fallback estimation.');
                const systemSizeNum = parseFloat(power_demand_kw) || 3;

                if (categoryFilter === 'Hybrid') {
                    initialPrice = systemSizeNum * 95000;
                    gstRate = 12;
                } else {
                    initialPrice = systemSizeNum * 45000;
                    gstRate = 8.9;
                }
                priceIncludesGst = true; // Default fallbacks are inclusive
                selectedProductData.capacity = systemSizeNum;
            }

            // OVERRIDE with request values if provided (helpful for custom manual quotes or frontends that know the rate)
            if (reqPriceIncludesGst !== undefined) priceIncludesGst = reqPriceIncludesGst;
            if (reqGstRate !== undefined) gstRate = Number(reqGstRate);

            // FINAL GST CALCULATION (Unified for both matched and fallback)
            // DO NOT apply if it's from the generic Calculator which already provided exact math in metadata
            if (source !== 'Calculator Quote Form') {
                if (priceIncludesGst) {
                    // Reverse Calc: Total = Base * (1 + Rate/100) -> Base = Total / (1 + Rate/100)
                    calculatedValues.basePrice = Math.round(initialPrice / (1 + gstRate / 100));
                    calculatedValues.gstAmount = initialPrice - calculatedValues.basePrice;
                    calculatedValues.total = initialPrice;
                } else {
                    // Forward Calc: Total = Base + (Base * Rate/100)
                    calculatedValues.basePrice = Math.round(initialPrice);
                    calculatedValues.gstAmount = Math.round(initialPrice * (gstRate / 100));
                    calculatedValues.total = initialPrice + calculatedValues.gstAmount;
                }
                calculatedValues.grandTotal = calculatedValues.total;
            }

            (calculatedValues as any).taxRate = gstRate;
            (calculatedValues as any).priceIncludesGst = priceIncludesGst;

            // Dynamic Subsidy Calculation — use requested (sanctioned) capacity, not panel-rounded
            const requestedKw = parseFloat(power_demand_kw) || selectedProductData.capacity;
            const capacity = Math.floor(requestedKw); // PM Surya Ghar uses sanctioned load in whole kW

            if (subsidies && subsidies.length > 0) {
                let centralTotal = 0;
                let stateTotal = 0;

                subsidies.forEach((sub: any) => {
                    let amount = 0;

                    // STRATEGY PATTERN
                    switch (sub.calculation_type) {
                        case 'per_kw':
                            amount = capacity * (sub.amount_per_kw || 0);
                            break;

                        case 'flat':
                            amount = Number(sub.flat_amount || 0);
                            break;

                        case 'capped_per_kw':
                            const raw = capacity * (sub.amount_per_kw || 0);
                            const cap = Number(sub.max_cap || 0);
                            amount = (cap > 0 && raw > cap) ? cap : raw;
                            break;

                        case 'tiered_surya_ghar':
                            // Central Subsidy: 1kW=30k, 2kW=60k, 3kW+=78k
                            if (capacity < 1) {
                                amount = 0;
                            } else if (capacity === 1) {
                                amount = 30000;
                            } else if (capacity === 2) {
                                amount = 60000;
                            } else {
                                amount = 78000; // 3kW and above
                            }
                            break;

                        default:
                            amount = 0;
                    }

                    if (sub.scheme_type === 'Central') {
                        centralTotal += amount;
                    } else if (sub.scheme_type === 'State') {
                        // Use string matching or state field if we had customer state. 
                        // For now assuming all active state subsidies apply (or just UP as default).
                        // In future: Check if customer.state === sub.state
                        stateTotal += amount;
                    }
                });

                calculatedValues.centralSubsidy = centralTotal;
                calculatedValues.stateSubsidy = stateTotal;

            } else {
                // Legacy Fallback — Central: 1kW=30k, 2kW=60k, 3kW+=78k
                if (capacity < 1) calculatedValues.centralSubsidy = 0;
                else if (capacity === 1) calculatedValues.centralSubsidy = 30000;
                else if (capacity === 2) calculatedValues.centralSubsidy = 60000;
                else calculatedValues.centralSubsidy = 78000; // 3kW and above
                // UP State: 1kW=15k, 2kW+=30k
                if (capacity < 1) calculatedValues.stateSubsidy = 0;
                else if (capacity === 1) calculatedValues.stateSubsidy = 15000;
                else calculatedValues.stateSubsidy = 30000; // 2kW and above
            }

            calculatedValues.effectiveCost = Math.max(0, calculatedValues.grandTotal - calculatedValues.centralSubsidy - calculatedValues.stateSubsidy);
        }

        // 2. Prepare Assets (Logo, Sig, Payment)
        let logoUrl = '';
        try {
            const logoPath = path.join(process.cwd(), 'public', 'logo.webp');
            const logoBuffer = await fs.readFile(logoPath);
            logoUrl = `data:image/webp;base64,${logoBuffer.toString('base64')}`;
        } catch (e) { }

        let qrCodeUrl = '';
        const upiLink = `upi://pay?pa=9044555574@okbizaxis&pn=Arpit%20Solar%20Shop&am=${calculatedValues.grandTotal}&cu=INR`;
        try {
            const qrPath = path.join(process.cwd(), 'public', 'payment.webp');
            const qrBuffer = await fs.readFile(qrPath);
            qrCodeUrl = `data:image/webp;base64,${qrBuffer.toString('base64')}`;
        } catch (e) { }

        let signatureUrl = '';
        try {
            const sigPath = path.join(process.cwd(), 'public', 'signature.webp');
            const sigBuffer = await fs.readFile(sigPath);
            signatureUrl = `data:image/webp;base64,${sigBuffer.toString('base64')}`;
        } catch (e) { }

        // 3. Components Selection — fetch from DB by brand, with hardcoded fallback
        const compKey = selectedProductData.systemType === 'Hybrid' ? 'Hybrid' :
            (power_demand_kw > 10 ? 'Commercial' : 'On-grid');

        let selectedComponents = defaultComponents[compKey as keyof typeof defaultComponents] || defaultComponents['On-grid'];

        try {
            const { createClient } = await import('@supabase/supabase-js');
            const sbAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
            );
            // Use product_category (brand name: Tata, Shakti, Reliance, Integrated, Hybrid)
            // as the direct DB category lookup
            const brandCategory = product_category || compKey;
            const { data: dbComponents } = await sbAdmin
                .from('solar_product_components')
                .select('name, description, quantity, make, sort_order')
                .eq('category', brandCategory)
                .eq('is_active', true)
                .order('sort_order');

            if (dbComponents && dbComponents.length > 0) {
                selectedComponents = dbComponents;

                // --- DYNAMIC QUANTITY SCALING ---
                const panelWattageNum = parseFloat(selectedProductData.panelWattage) || 550;

                // HUGE FIX: Consistency Check
                // If the selected product (which determined PRICE) is WOBB, or user requested WOBB,
                // we MUST remove Battery/BMS from components to avoid misleading quotes.
                const isWOBB = (formData.additional_details?.variant === 'WOBB') || (selectedProductData.variant === 'WOBB');

                if (brandCategory === 'Hybrid' && isWOBB) {
                    selectedComponents = selectedComponents.filter((c: any) =>
                        !c.name.toLowerCase().includes('battery') &&
                        !c.name.toLowerCase().includes('bms')
                    );
                }

                // Calculate needed panels: (Capacity (kW) * 1000) / Wattage
                const neededPanels = Math.ceil((selectedProductData.capacity * 1000) / panelWattageNum);
                selectedProductData.panelCount = neededPanels;

                // Update Panel Component
                const panelCompIndex = selectedComponents.findIndex((c: any) =>
                    c.name.toLowerCase().includes('panel') ||
                    c.name.toLowerCase().includes('module') ||
                    c.name.toLowerCase().includes('pv')
                );

                if (panelCompIndex !== -1) {
                    selectedComponents[panelCompIndex] = {
                        ...selectedComponents[panelCompIndex],
                        quantity: `${neededPanels} Nos`,
                        description: `${selectedProductData.panelWattage}Wp (${selectedProductData.panelType})`
                    };
                    if (selectedComponents[panelCompIndex].make) {
                        selectedProductData.panelBrand = selectedComponents[panelCompIndex].make;
                    }
                }

                // Update Inverter Component (keep quantity 1 usually, but update makes)
                const inverterCompIndex = selectedComponents.findIndex((c: any) =>
                    c.name.toLowerCase().includes('inverter') || c.name.toLowerCase().includes('pcu')
                );
                if (inverterCompIndex !== -1) {
                    if (selectedComponents[inverterCompIndex].make) {
                        selectedProductData.inverterBrand = selectedComponents[inverterCompIndex].make;
                    }
                }

                // Update Structure (if it exists and looks like it needs scaling, though usually it's "1 Set")
                // For now, only scaling panels is critical for user trust.
            }
        } catch (dbErr) {
            console.warn('Could not fetch components from DB, using defaults:', dbErr);
        }

        // 4. Generate HTML
        const html = generateQuoteHtml({
            customerInfo: {
                name: name || 'Valued Customer',
                phone: phone,
                address: address || 'N/A'
            },
            selectedProduct: selectedProductData,
            calculations: calculatedValues,
            components: selectedComponents,
            logoUrl,
            signatureUrl,
            qrCodeUrl,
            upiLink,
            panelWarranty: selectedProductData.panelWarranty,
            inverterWarranty: selectedProductData.inverterWarranty,
            savings: {
                annualUnits: Math.round(selectedProductData.capacity * 1400 * 100) / 100,
                annualSavings: Math.round(selectedProductData.capacity * 1400 * 6.5 * 100) / 100,
                roiYears: (calculatedValues.effectiveCost > 0
                    ? (calculatedValues.effectiveCost / (selectedProductData.capacity * 1400 * 6.5)).toFixed(1)
                    : '0')
            }
        });

        // 5. Generate PDF
        // 5. Generate PDF
        console.log('📄 Generating PDF...');
        const pdfPath = await generatePdfFromHtml({ html });
        console.log('✅ PDF Generated at:', pdfPath);

        // 6. Upload
        const pdfUrl = await uploadToBucket(pdfPath);
        console.log('✅ Uploaded to bucket:', pdfUrl);

        // 7. Save to DB
        await insertQuoteRequest(formData);

        // 8. WhatsApp
        let whatsappResult = { sent: false, error: null };
        try {
            await sendWhatsAppMessage(phone, pdfUrl, name);
            whatsappResult.sent = true;
            
            // Send copy to referral phone if provided
            const referralPhone = formData.referral_phone?.replace(/\D/g, '');
            if (referralPhone && referralPhone.length >= 10) {
                try {
                    console.log('📱 Sending copy to referral phone:', referralPhone);
                    await sendWhatsAppMessage(referralPhone, pdfUrl);
                } catch (refError) {
                    console.error('WhatsApp to referral failed:', refError);
                }
            }
        } catch (waError: any) {
            console.error('WhatsApp failed:', waError);
            whatsappResult.error = waError.message;
        }

        // 9. Sync to CRM (Kit19)
        try {
            console.log('🔄 Syncing to Kit19 CRM...');
            await pushLeadToCRM({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address || 'N/A', // Matches project_location
                city: formData.city,
                state: formData.state,
                pincode: formData.pin_code || formData.pincode, // Check both keys
                source: "Website",
                medium: "Quote API",
                campaign: formData.product_category || "Solar Quote",
                remarks: `Interested in ${formData.product_category} (${formData.power_demand_kw}kW) | Variant: ${formData.additional_details?.variant || 'Standard'}`
            });
        } catch (crmErr) {
            console.error('CRM Sync Warning:', crmErr);
        }

        return NextResponse.json({ success: true, pdfUrl, whatsappResult });
    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
