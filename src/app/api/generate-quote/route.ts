
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
        const { product_category, power_demand_kw, phone, source, metadata, phase, name, address } = formData;

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
            calculatedValues.centralSubsidy = 78000; // Approx

            const capacity = parseFloat(power_demand_kw);
            if (capacity <= 2) calculatedValues.centralSubsidy = 30000 * capacity;
            else if (capacity <= 3) calculatedValues.centralSubsidy = 60000 + 18000 * (capacity - 2);
            else calculatedValues.centralSubsidy = 78000;

            calculatedValues.effectiveCost = Math.max(0, calculatedValues.grandTotal - calculatedValues.centralSubsidy - calculatedValues.stateSubsidy);

            // Attempt to fetch extra details if available
            const config = await fetchConfig('reliance_system_config');
            if (config) {
                selectedProductData.panelWattage = (config.product_description || '550').replace(/\D/g, '');
                selectedProductData.panelType = config.product_description || 'Monocrystalline';
            }

        } else {
            // Unified Fetch from solar_products
            let categoryFilter = product_category;
            // Map simple category names to DB valid enum
            if (['Tata', 'Shakti', 'Reliance', 'Hybrid', 'Integrated'].includes(product_category)) {
                categoryFilter = product_category;
            } else {
                categoryFilter = 'Tata'; // Default?
            }

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
                // Find match within small tolerance
                systemData = products.find((p: any) =>
                    Math.abs(p.system_size_kw - Number(power_demand_kw)) < 0.1
                );

                // If no exact match, find closest
                if (!systemData) {
                    systemData = products.reduce((prev: any, curr: any) =>
                        Math.abs(curr.system_size_kw - Number(power_demand_kw)) < Math.abs(prev.system_size_kw - Number(power_demand_kw)) ? curr : prev
                    );
                }
            }

            if (systemData) {
                let basePriceNum = Number(systemData.price);
                const specs = systemData.specifications || {};

                // Handle Reliance Special Pricing logic (structure types)
                if (product_category === 'Reliance' && specs.structure_prices) {
                    if (formData.mounting_type === 'Tin Shed') basePriceNum = Number(specs.structure_prices.tin_shed || basePriceNum);
                    else if (formData.mounting_type === 'RCC Elevated') basePriceNum = Number(specs.structure_prices.rcc_elevated || specs.structure_prices.hdg_elevated || basePriceNum);
                    else if (formData.mounting_type === 'Pre GI MMS') basePriceNum = Number(specs.structure_prices.pre_gi_mms || basePriceNum);
                    else if (formData.mounting_type === 'Without MMS') basePriceNum = Number(specs.structure_prices.without_mms || basePriceNum);
                }

                // GST Logic
                if (product_category === 'Reliance') {
                    if (systemData.system_size_kw <= 13.8) {
                        // DB Price is Total (hdg_elevated_price)
                        calculatedValues.total = Number(basePriceNum);
                        calculatedValues.basePrice = Math.round(calculatedValues.total / 1.138);
                        calculatedValues.gstAmount = calculatedValues.total - calculatedValues.basePrice;
                        calculatedValues.grandTotal = calculatedValues.total;
                    } else {
                        // Large: DB Price is usually Base. But previous logic treated it as base? 
                        // Reliance large systems table had `hdg_elevated_rcc_price` (Total?)
                        // User's reliance_large_systems schema doesn't explicitly say if it includes GST.
                        // BUT, looking at `reliance_grid_tie_systems`, `hdg_elevated_price` WAS matched to `total_price` in the old code.
                        // Let's assume consistent behavior: Price in DB is "Total Project Cost" usually?
                        // Wait, previous code for Large:
                        // `const gst = basePriceNum * 0.138; const total = basePriceNum + gst;`
                        // So Previous code treated Large System DB prices as EXCLUSIVE of GST (Base).

                        calculatedValues.basePrice = Number(basePriceNum);
                        calculatedValues.gstAmount = Math.round(calculatedValues.basePrice * 0.138);
                        calculatedValues.total = calculatedValues.basePrice + calculatedValues.gstAmount;
                        calculatedValues.grandTotal = calculatedValues.total;
                    }
                } else if (product_category === 'Integrated') {
                    // Integrated DB prices are Total (13.8% GST included)
                    calculatedValues.total = Number(basePriceNum);
                    calculatedValues.basePrice = Math.round(calculatedValues.total / 1.138);
                    calculatedValues.gstAmount = calculatedValues.total - calculatedValues.basePrice;
                    calculatedValues.grandTotal = calculatedValues.total;

                } else if (product_category === 'Tata' || product_category === 'Shakti') {
                    // Tata/Shakti DB prices are Total (8.9% GST included?)
                    // Old Code: `base = total / 1.089`
                    calculatedValues.total = Number(basePriceNum);
                    calculatedValues.basePrice = Math.round(calculatedValues.total / 1.089);
                    calculatedValues.gstAmount = calculatedValues.total - calculatedValues.basePrice;
                    calculatedValues.grandTotal = calculatedValues.total;
                } else {
                    // Hybrid or others
                    // Assume DB price is total?
                    calculatedValues.grandTotal = Number(basePriceNum);
                    calculatedValues.total = Number(basePriceNum);
                    calculatedValues.basePrice = Number(basePriceNum);
                }

                selectedProductData.capacity = systemData.system_size_kw;
                selectedProductData.phase = systemData.phase === 'Three' ? 3 : 1;
                if (specs.module_watt) selectedProductData.panelWattage = specs.module_watt;
                if (specs.module_count) selectedProductData.panelCount = specs.module_count;
                if (specs.inverter_kw) selectedProductData.inverterSize = specs.inverter_kw;
                if (specs.technology) selectedProductData.panelType = specs.technology;
                if (specs.brand) selectedProductData.panelBrand = specs.brand;

            } else {
                // Fallback if NO data found even in unified table (rare)
                console.log('⚠️ No unified product found, using fallback estimation.');
                const systemSizeNum = parseFloat(power_demand_kw) || 3;
                calculatedValues.grandTotal = systemSizeNum * 45000;
                selectedProductData.capacity = systemSizeNum;
            }

            // Subsidy calc
            const capacity = selectedProductData.capacity;
            if (capacity <= 2) calculatedValues.centralSubsidy = 30000 * capacity;
            else if (capacity <= 3) calculatedValues.centralSubsidy = 60000 + 18000 * (capacity - 2);
            else calculatedValues.centralSubsidy = 78000;
            calculatedValues.effectiveCost = Math.max(0, calculatedValues.grandTotal - calculatedValues.centralSubsidy);
        }

        // 2. Prepare Assets (Logo, Sig, Payment)
        let logoUrl = '';
        try {
            const logoPath = path.join(process.cwd(), 'public', 'logo.png');
            const logoBuffer = await fs.readFile(logoPath);
            logoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        } catch (e) { }

        let qrCodeUrl = '';
        const upiLink = `upi://pay?pa=9044555574@okbizaxis&pn=Arpit%20Solar%20Shop&am=${calculatedValues.grandTotal}&cu=INR`;
        try {
            const qrPath = path.join(process.cwd(), 'public', 'payment.png');
            const qrBuffer = await fs.readFile(qrPath);
            qrCodeUrl = `data:image/png;base64,${qrBuffer.toString('base64')}`;
        } catch (e) { }

        let signatureUrl = '';
        try {
            const sigPath = path.join(process.cwd(), 'public', 'signature.png');
            const sigBuffer = await fs.readFile(sigPath);
            signatureUrl = `data:image/png;base64,${sigBuffer.toString('base64')}`;
        } catch (e) { }

        // 3. Components Selection
        const compKey = selectedProductData.systemType === 'Hybrid' ? 'Hybrid' :
            (power_demand_kw > 10 ? 'Commercial' : 'On-grid');

        const selectedComponents = defaultComponents[compKey as keyof typeof defaultComponents] || defaultComponents['On-grid'];

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
                annualUnits: selectedProductData.capacity * 1400,
                annualSavings: selectedProductData.capacity * 1400 * 6.5,
                roiYears: (calculatedValues.effectiveCost > 0
                    ? (calculatedValues.effectiveCost / (selectedProductData.capacity * 1400 * 6.5)).toFixed(1)
                    : '0')
            }
        });

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
            await sendWhatsAppMessage(phone, pdfUrl);
            whatsappResult.sent = true;
        } catch (waError: any) {
            console.error('WhatsApp failed:', waError);
            whatsappResult.error = waError.message;
        }

        return NextResponse.json({ success: true, pdfUrl, whatsappResult });

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
