
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import {
    fetchClosestRow,
    fetchFirstRow,
    fetchAllRows,
    fetchConfig,
    uploadToBucket,
    insertQuoteRequest
} from '@/lib/server/services/supabase';
import { generatePdfFromHtml, enhancePdf } from '@/lib/server/services/pdf';
import { sendWhatsAppMessage } from '@/lib/server/services/whatsapp';

export const maxDuration = 120; // Allow longer timeout for PDF gen (increased from 60)

export async function POST(req: NextRequest) {
    console.log('🔵 API Route /api/generate-quote called');
    try {
        console.log('🔵 Step 1: Parsing request body...');
        const body = await req.json();
        console.log('✅ Step 1 Complete - Received form data:', JSON.stringify(body, null, 2));

        const formData = body;
        const { product_category, power_demand_kw, phone, source, metadata, phase, name, address } = formData;
        let tempVars: any = { ...formData };

        console.log('🔵 Step 2: Setting up template variables...');
        // Default meta for invoice
        tempVars.ref_number = `Q-${Date.now().toString().slice(-6)}`;
        tempVars.name = name || 'Valued Customer';
        tempVars.address = address || 'N/A';
        console.log('✅ Step 2 Complete - Template vars initialized');
        console.log('🔵 Step 3: Processing product category:', product_category);

        // Add current date and time (India timezone)
        const generationDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
        tempVars.quote_date = generationDate;

        // -----------------------------
        // Data Fetching Logic (Same as before)
        // -----------------------------
        if (source === 'Calculator Quote Form') {
            if (!metadata) throw new Error('Calculator form submission is missing metadata.');
            tempVars.system_size = power_demand_kw;
            tempVars.number_of_modules = metadata.panel_config ? metadata.panel_config.split(' ')[0] : 'N/A';
            tempVars.inverter_capacity = metadata.inverter_size_kw;
            tempVars.phase = formData.customer_type === 'commercial' ? 'Three' : 'Single';
            if (phase) tempVars.phase = phase;
            tempVars.price_per_watt = metadata.price_per_watt;
            tempVars.total_price = metadata.estimated_price;
            tempVars.base_price = metadata.base_price;
            tempVars.gst_amount = metadata.gst_amount;

            const config = await fetchConfig('reliance_system_config');
            tempVars.module_wattage = config.PRODUCT_DESCRIPTION || config.product_description || 'N/A';
            tempVars.scope_of_work = config.WORK_SCOPE || config.work_scope || '';
            const dcCable: any = await fetchFirstRow('reliance_dc_cable_data');
            tempVars.dc_cable_per_meter = dcCable ? dcCable.price : 'N/A';
            const kitItems: any = await fetchAllRows('reliance_kit_items');
            tempVars.kit_items = (kitItems || []).map((item: any) => `${item.item}: ${item.description}`).join(', ');
            // Identify mounting type for template roughly if needed, purely data for now.
            tempVars.mounting_type = 'Standard';

        } else if (product_category === 'Reliance') {
            let systemData: any;
            let basePriceNum: number = 0;

            if (Number(power_demand_kw) <= 13.8) {
                systemData = await fetchClosestRow('reliance_grid_tie_systems', power_demand_kw, 'system_size');
                if (!systemData) throw new Error('No matching data in reliance_grid_tie_systems');
                tempVars.system_size = systemData.system_size;
                tempVars.number_of_modules = systemData.no_of_modules;
                tempVars.inverter_capacity = systemData.inverter_capacity;
                tempVars.phase = systemData.phase ?? tempVars.phase;
                tempVars.price_per_watt = systemData.price_per_watt ?? systemData.hdg_elevated_with_gst ?? 'N/A';
                basePriceNum = systemData.total_price ?? systemData.hdg_elevated_price ?? 0;
            } else {
                systemData = await fetchClosestRow('reliance_large_systems', power_demand_kw, 'system_size_kw');
                if (!systemData) throw new Error('No matching data in reliance_large_systems');
                tempVars.system_size = systemData.system_size_kw;
                tempVars.number_of_modules = systemData.no_of_modules;
                tempVars.inverter_capacity = systemData.inverter_capacity;
                tempVars.phase = systemData.phase ?? tempVars.phase;

                if (formData.mounting_type === 'Tin Shed') {
                    tempVars.price_per_watt = systemData.short_rail_tin_shed_price_per_watt;
                    basePriceNum = systemData.short_rail_tin_shed_price;
                } else if (formData.mounting_type === 'RCC Elevated') {
                    tempVars.price_per_watt = systemData.hdg_elevated_rcc_price_per_watt;
                    basePriceNum = systemData.hdg_elevated_rcc_price;
                } else if (formData.mounting_type === 'Pre GI MMS') {
                    tempVars.price_per_watt = systemData.pre_gi_mms_price_per_watt;
                    basePriceNum = systemData.pre_gi_mms_price;
                } else if (formData.mounting_type === 'Without MMS') {
                    tempVars.price_per_watt = systemData.price_without_mms_price_per_watt;
                    basePriceNum = systemData.price_without_mms_price;
                } else {
                    tempVars.price_per_watt = 'N/A';
                    basePriceNum = 0;
                }
            }

            if (basePriceNum > 0) {
                const gstAmount = basePriceNum * 0.138;
                const totalPrice = basePriceNum + gstAmount;
                tempVars.base_price = Math.round(basePriceNum);
                tempVars.gst_amount = Math.round(gstAmount);
                tempVars.total_price = Math.round(totalPrice);
            } else {
                tempVars.base_price = 'N/A';
                tempVars.gst_amount = 'N/A';
                tempVars.total_price = 'N/A';
            }

            const config = await fetchConfig('reliance_system_config');
            tempVars.module_wattage = config.PRODUCT_DESCRIPTION || config.product_description || 'N/A';
            tempVars.scope_of_work = config.WORK_SCOPE || config.work_scope || '';
            const dcCable: any = await fetchFirstRow('reliance_dc_cable_data');
            tempVars.dc_cable_per_meter = dcCable ? dcCable.price : 'N/A';
            const kitItems: any = await fetchAllRows('reliance_kit_items');
            tempVars.kit_items = (kitItems || []).map((item: any) => `${item.item}: ${item.description}`).join(', ');

        } else if (product_category === 'Shakti' || product_category === 'Tata') {
            const tableName = product_category === 'Shakti' ? 'shakti_grid_tie_systems' : 'tata_grid_tie_systems';
            if (product_category === 'Tata' && !phase) {
                console.warn('⚠️ Phase not provided for Tata, defaulting to Three');
                tempVars.phase = 'Three';
            }

            try {
                const allSystems: any = await fetchAllRows(tableName);
                let systemData = (allSystems || []).find((sys: any) => sys.system_size == power_demand_kw && (!phase || sys.phase === phase));
                if (!systemData) systemData = await fetchClosestRow(tableName, power_demand_kw, 'system_size');

                if (!systemData) {
                    console.warn(`⚠️ No matching data found in ${tableName}, using fallback pricing`);
                    // Fallback: Calculate approximate pricing
                    const systemSizeNum = parseFloat(power_demand_kw) || 3;
                    const pricePerKw = product_category === 'Tata' ? 45000 : 42000; // Approximate prices
                    const basePriceNum = systemSizeNum * pricePerKw;
                    const gstAmount = basePriceNum * 0.089;
                    const totalPriceNum = basePriceNum + gstAmount;

                    tempVars.base_price = Math.round(basePriceNum);
                    tempVars.gst_amount = Math.round(gstAmount);
                    tempVars.total_price = Math.round(totalPriceNum);
                    tempVars.system_size = systemSizeNum;
                    tempVars.number_of_modules = Math.ceil(systemSizeNum * 1000 / 550); // Assuming 550W panels
                    tempVars.inverter_capacity = systemSizeNum;
                    tempVars.phase = phase || 'Three';
                    tempVars.price_per_kwp = Math.round(pricePerKw);
                    tempVars.module_wattage = '550W Monocrystalline';
                } else {
                    const totalPriceNum = systemData.total_price ?? systemData.pre_gi_elevated_price ?? 0;
                    if (totalPriceNum > 0) {
                        const basePriceNum = totalPriceNum / 1.089;
                        const gstAmount = totalPriceNum - basePriceNum;
                        tempVars.base_price = Math.round(basePriceNum);
                        tempVars.gst_amount = Math.round(gstAmount);
                        tempVars.total_price = Math.round(totalPriceNum);
                    } else {
                        tempVars.base_price = 'N/A';
                        tempVars.gst_amount = 'N/A';
                        tempVars.total_price = 'N/A';
                    }

                    tempVars.system_size = systemData.system_size;
                    tempVars.number_of_modules = systemData.no_of_modules;
                    tempVars.inverter_capacity = systemData.inverter_capacity;
                    tempVars.phase = systemData.phase;
                    if (product_category === 'Tata') tempVars.price_per_kwp = systemData.price_per_kwp ?? 'N/A';
                    else tempVars.price_per_watt = systemData.pre_gi_elevated_with_gst ?? 'N/A';
                }

                const config = await fetchConfig(`${product_category.toLowerCase()}_config`);
                tempVars.module_wattage = config.product_description || config.PRODUCT_DESCRIPTION || '550W Monocrystalline';
            } catch (err) {
                console.error(`❌ Error fetching ${product_category} data:`, err);
                // Use fallback pricing even on error
                const systemSizeNum = parseFloat(power_demand_kw) || 3;
                const pricePerKw = product_category === 'Tata' ? 45000 : 42000;
                const basePriceNum = systemSizeNum * pricePerKw;
                const gstAmount = basePriceNum * 0.089;
                const totalPriceNum = basePriceNum + gstAmount;

                tempVars.base_price = Math.round(basePriceNum);
                tempVars.gst_amount = Math.round(gstAmount);
                tempVars.total_price = Math.round(totalPriceNum);
                tempVars.system_size = systemSizeNum;
                tempVars.number_of_modules = Math.ceil(systemSizeNum * 1000 / 550);
                tempVars.inverter_capacity = systemSizeNum;
                tempVars.phase = phase || 'Three';
                tempVars.price_per_kwp = Math.round(pricePerKw);
                tempVars.module_wattage = '550W Monocrystalline';
            }
        } else if (product_category === 'Integrated') {
            const tableName = 'integrated_products';
            const brand = (formData as any).brand; // Extract brand from body

            const allSystems: any = await fetchAllRows(tableName);

            // Filter by system_kw (mapped to power_demand_kw) and phase. 
            // Also filter by Brand if provided.
            let systemData = (allSystems || []).find((sys: any) =>
                sys.system_kw == power_demand_kw &&
                (!phase || sys.phase === phase) &&
                (!brand || sys.brand === brand)
            );

            // Fallback: search closest by system_kw, but still try to respect brand if possible
            if (!systemData) {
                const closest = await fetchClosestRow(tableName, power_demand_kw, 'system_kw');
                // If the closest row doesn't match brand/phase, we might want to search specifically within filtered set
                // But simplified: just use closest for now if strict match fails.
                systemData = closest;
            }

            if (!systemData) throw new Error(`No matching data found in ${tableName}`);

            const totalPriceNum = Number(systemData.price) || 0;
            if (totalPriceNum > 0) {
                // Assuming 13.8% GST structure for consistency with Reliance
                const basePriceNum = totalPriceNum / 1.138;
                const gstAmount = totalPriceNum - basePriceNum;
                tempVars.base_price = Math.round(basePriceNum);
                tempVars.gst_amount = Math.round(gstAmount);
                tempVars.total_price = Math.round(totalPriceNum);
            } else {
                tempVars.base_price = 'N/A';
                tempVars.gst_amount = 'N/A';
                tempVars.total_price = 'N/A';
            }

            tempVars.system_size = systemData.system_kw;
            tempVars.number_of_modules = systemData.no_of_modules;
            tempVars.inverter_capacity = systemData.inverter_capacity_kw;
            tempVars.phase = systemData.phase;
            tempVars.price_per_watt = systemData.module_watt; // Using module watt as proxy for 'tech spec' 
            tempVars.module_wattage = `${systemData.brand} ${systemData.module_type || ''}`;
            tempVars.scope_of_work = "Complete Supply, Installation, and Commissioning of Integrated Solar Power Plant";


        } else if (['Tata', 'Shakti', 'Reliance', 'Hybrid', 'Generic'].includes(product_category)) {
            // Valid categories from UniversalQuoteForm - use fallback pricing
            console.log('⚠️ Using fallback pricing for category:', product_category);
            const systemSizeNum = parseFloat(power_demand_kw) || 3;
            const pricePerKw = 45000; // Default price per kW
            const basePriceNum = systemSizeNum * pricePerKw;
            const gstAmount = basePriceNum * 0.089;
            const totalPriceNum = basePriceNum + gstAmount;

            tempVars.base_price = Math.round(basePriceNum);
            tempVars.gst_amount = Math.round(gstAmount);
            tempVars.total_price = Math.round(totalPriceNum);
            tempVars.system_size = systemSizeNum;
            tempVars.number_of_modules = Math.ceil(systemSizeNum * 1000 / 550);
            tempVars.inverter_capacity = systemSizeNum;
            tempVars.phase = phase || 'Three';
            tempVars.price_per_kwp = Math.round(pricePerKw);
            tempVars.module_wattage = '550W Monocrystalline';
            tempVars.mounting_type = 'Elevated';
        } else {
            console.log('❌ Invalid product_category or source:', { product_category, source });
            return NextResponse.json({ error: 'Invalid product_category or source' }, { status: 400 });
        }

        // Format numbers
        ['total_price', 'base_price', 'gst_amount'].forEach(field => {
            if (typeof tempVars[field] === 'number') {
                tempVars[field] = tempVars[field].toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
        });

        console.log('✅ Step 3 Complete - Data fetching done');
        console.log('🔵 Step 4: Starting PDF generation flow...');
        // -----------------------------
        // PDF Generation Flow
        // -----------------------------

        // 1. Read HTML Template
        console.log('🔵 Step 4a: Reading HTML template...');
        const templatePath = path.join(process.cwd(), 'src', 'lib', 'server', 'templates', 'invoice.hbs');
        const templateSource = await fs.readFile(templatePath, 'utf-8');

        console.log('✅ Step 4a Complete - Template read');
        // 2. Compile Template
        console.log('🔵 Step 4b: Compiling template...');
        const template = handlebars.compile(templateSource);
        const html = template(tempVars);
        console.log('✅ Step 4b Complete - HTML generated');

        // 3. Generate Preliminary PDF
        console.log('🔵 Step 4c: Generating PDF from HTML (this may take 30-60 seconds)...');
        const pdfPath = await generatePdfFromHtml({ html });
        console.log('✅ Step 4c Complete - PDF generated at:', pdfPath);

        // 4. Enhance PDF (QR Code, Signature, Lock)
        console.log('🔵 Step 4d: Enhancing PDF with QR code and signature...');
        const qrData = `Ref:${tempVars.ref_number}|Amt:${tempVars.total_price}|Date:${tempVars.quote_date}`;
        const finalPdfPath = await enhancePdf(
            pdfPath,
            qrData,
            'Digitally Signed by Arpit Solar Shop | Immutable'
        );
        console.log('✅ Step 4d Complete - PDF enhanced');

        // 5. Upload to Bucket
        console.log('🔵 Step 5: Uploading PDF to Supabase...');
        const pdfUrl = await uploadToBucket(finalPdfPath);
        console.log('✅ Step 5 Complete - PDF uploaded:', pdfUrl);

        // 6. DB Record
        console.log('🔵 Step 6: Saving to database...');
        try {
            await insertQuoteRequest(formData);
            console.log('✅ Step 6 Complete - Data saved to database');
        } catch (dbErr) {
            console.error('❌ Step 6 Failed - Database error:', dbErr);
        }

        // 7. Send WhatsApp
        console.log('🔵 Step 7: Sending WhatsApp message...');
        await sendWhatsAppMessage(phone, pdfUrl);
        console.log('✅ Step 7 Complete - WhatsApp sent');

        // Cleanup (optional, or rely on OS/restart)
        // await fs.remove(finalPdfPath);

        console.log('🎉 ALL STEPS COMPLETE - Returning success response');
        return NextResponse.json({ success: true, pdfUrl });

    } catch (err: any) {
        console.error('❌❌❌ FATAL ERROR in generate-quote:', err);
        console.error('Error stack:', err.stack);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
