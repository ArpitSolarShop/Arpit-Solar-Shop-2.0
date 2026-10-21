import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export const runtime = 'nodejs';

// Owner numbers to notify on every new lead
const OWNER_NUMBERS = ['+919044555572', '+919278599345'];

/**
 * Send lead details as a WhatsApp message to an owner number via DoubleTick API.
 * Tries text API first (works within 24h window), falls back to template API.
 */
async function sendLeadWhatsApp(
    toPhone: string,
    leadData: Record<string, any>,
    apiKey: string,
    senderPhone: string
) {
    const now = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' });

    const propertyInfo = leadData.property_type || leadData.installation_location || '—';
    const sourceLabel = leadData.utm_source
        ? `Meta Ads (${leadData.utm_source}${leadData.utm_campaign ? ` - ${leadData.utm_campaign}` : ''})`
        : (leadData.source || 'Direct Website');

    const message = [
        `🔔 *नई लीड आई है!*`,
        `━━━━━━━━━━━━━━━━`,
        `👤 *नाम:* ${leadData.full_name}`,
        `📞 *मोबाइल:* ${leadData.mobile}`,
        `📍 *क्षेत्र / पिन कोड:* ${leadData.area || '—'}`,
        `🏢 *प्रॉपर्टी का प्रकार:* ${propertyInfo}`,
        `💡 *मासिक बिजली बिल:* ${leadData.monthly_bill || '—'}`,
        `⏰ *कब लगवाना चाहते हैं:* ${leadData.installation_timeline || '—'}`,
        `✅ *कॉल अनुमति:* ${leadData.consent_given ? 'हाँ' : 'नहीं'}`,
        `━━━━━━━━━━━━━━━━`,
        `🕐 *समय:* ${now}`,
        `📋 *सोर्स:* ${sourceLabel}`,
    ].join('\n');

    const toClean = toPhone.replace(/[^0-9]/g, '');
    const fromClean = senderPhone.replace(/[^0-9]/g, '');
    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': apiKey,
    };

    console.log('📱 Sending WhatsApp lead notification to', toClean);

    // Approach 1: Try text message API (works if 24h session window is open)
    try {
        const textRes = await axios.post(
            'https://public.doubletick.io/whatsapp/message/text',
            { to: toClean, from: fromClean, content: { text: message } },
            { headers, timeout: 15000 }
        );
        console.log('✅ Text message sent to', toClean);
        return textRes.data;
    } catch (textErr: any) {
        const status = textErr?.response?.status;
        console.warn(`⚠️ Text API failed (${status}) for ${toClean}, trying template API...`);
    }

    // Approach 2: Fall back to template API (approved UTILITY template 'internal_task_alert')
    try {
        const clientInfo = `${leadData.full_name} (${leadData.mobile})`;
        const stageInfo = `लीड: ${propertyInfo} | ${leadData.area || 'वाराणसी'} | बिल: ${leadData.monthly_bill || '—'}`;
        const actionInfo = `तुरंत संपर्क करें (${leadData.installation_timeline || 'जल्द से जल्द'})`;

        const templateRes = await axios.post(
            'https://public.doubletick.io/whatsapp/message/template',
            {
                messages: [{
                    to: toClean.startsWith('+') ? toClean : `+${toClean}`,
                    from: fromClean.startsWith('+') ? fromClean : `+${fromClean}`,
                    content: {
                        templateName: 'internal_task_alert',
                        language: 'en',
                        templateData: {
                            body: {
                                placeholders: [clientInfo, stageInfo, actionInfo],
                            },
                        },
                    },
                }],
            },
            { headers, timeout: 15000 }
        );
        console.log('✅ Template message sent to', toClean, '(internal_task_alert)');
        return templateRes.data;
    } catch (templateErr: any) {
        const errBody = templateErr?.response?.data
            ? JSON.stringify(templateErr.response.data)
            : templateErr?.message;
        console.error(`❌ Template API also failed for ${toClean}:`, errBody);
        throw templateErr;
    }
}

/**
 * Push lead data to Google Sheet via Google Apps Script Webhook
 */
async function pushToGoogleSheet(data: {
    name: string;
    phone: string;
    area: string;
    property_type: string;
    monthly_bill: string;
    installation_timeline: string;
}) {
    const webhookUrl = process.env.GOOGLE_SHEET_LEAD_WEBHOOK_URL ||
        'https://script.google.com/macros/s/AKfycbzvXlc9es8uhJzM-n9AQQTR90MhsP_xDM3-JIIdjAooS438p89mwSx39qF3xJTJ7kAk5A/exec';

    try {
        console.log('📊 Pushing lead to Google Sheet webhook...');
        const params = new URLSearchParams({
            name: data.name,
            phone: data.phone,
            area: data.area || '',
            property_type: data.property_type || '',
            monthly_bill: data.monthly_bill || '',
            installation_timeline: data.installation_timeline || '',
        });

        const res = await axios.post(webhookUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000,
            maxRedirects: 5,
        });

        console.log('✅ Google Sheet webhook response:', res.status, JSON.stringify(res.data));
        return res.data;
    } catch (err: any) {
        console.error('❌ Google Sheet webhook error:', err?.response?.data || err?.message);
    }
}

// POST — Submit a new lead
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Support both field naming conventions (name/phone or full_name/mobile)
        const fullName = (body.name || body.full_name || '').trim();
        const mobile = (body.phone || body.mobile || '').replace(/[^0-9]/g, '').slice(-10);

        // Validate required fields
        if (!fullName) {
            return NextResponse.json({ success: false, message: 'नाम भरना ज़रूरी है।' }, { status: 400 });
        }
        if (!mobile || mobile.length !== 10) {
            return NextResponse.json({ success: false, message: 'सही 10 अंकों का मोबाइल नंबर भरें।' }, { status: 400 });
        }

        // Env validation
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
            console.error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL or KEY)');
            return NextResponse.json({ success: false, message: 'सर्वर कॉन्फ़िगरेशन एरर।' }, { status: 500 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey
        );

        // Extract UTM params
        const url = new URL(request.url);
        const utm_source = body.utm_source || url.searchParams.get('utm_source') || null;
        const utm_medium = body.utm_medium || url.searchParams.get('utm_medium') || null;
        const utm_campaign = body.utm_campaign || url.searchParams.get('utm_campaign') || null;

        // Get IP and User Agent
        const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                          request.headers.get('x-real-ip') || 
                          'unknown';
        const user_agent = request.headers.get('user-agent') || 'unknown';

        const propertyType = body.property_type || body.installation_location || null;

        const leadData = {
            full_name: fullName,
            mobile: mobile,
            area: body.area?.trim() || null,
            property_type: propertyType,
            installation_location: propertyType,
            property_ownership: body.property_ownership || null,
            monthly_bill: body.monthly_bill || null,
            roof_available: body.roof_available || null,
            installation_timeline: body.installation_timeline || null,
            consent_given: body.consent_given ?? true,
            source: body.source || 'lead-form',
            utm_source,
            utm_medium,
            utm_campaign,
            ip_address,
            user_agent,
            metadata: body.metadata || null,
        };

        // ─── 1. Save to Supabase ────────────────────────────────────────
        const { data, error } = await supabase
            .from('solar_leads')
            .insert(leadData)
            .select('id, created_at')
            .single();

        if (error) {
            console.error('Supabase insert error:', JSON.stringify(error, null, 2));
            return NextResponse.json({ success: false, message: 'डेटा सेव नहीं हो सका। कृपया दोबारा कोशिश करें।' }, { status: 500 });
        }

        console.log('✅ Lead saved to database:', data.id);

        // ─── 2. Push to Google Sheet Webhook ────────────────────────────
        const googleSheetPromise = pushToGoogleSheet({
            name: fullName,
            phone: mobile,
            area: leadData.area || '',
            property_type: propertyType || '',
            monthly_bill: leadData.monthly_bill || '',
            installation_timeline: leadData.installation_timeline || '',
        });

        // ─── 3. Send WhatsApp notifications to owners ───────────────────
        const apiKey = process.env.DOUBLETICK_API_KEY;
        const senderPhone = process.env.DOUBLETICK_SENDER_PHONE;

        const whatsappPromises = (apiKey && senderPhone)
            ? OWNER_NUMBERS.map(async (ownerPhone) => {
                try {
                    const result = await sendLeadWhatsApp(ownerPhone, leadData, apiKey, senderPhone);
                    console.log(`✅ WhatsApp sent to ${ownerPhone}:`, JSON.stringify(result));
                } catch (waError: any) {
                    const errDetail = waError?.response?.data 
                        ? JSON.stringify(waError.response.data) 
                        : waError?.message || 'Unknown error';
                    console.error(`❌ WhatsApp to ${ownerPhone} failed:`, errDetail);
                }
            })
            : [];

        // ─── 4. Push to Kit19 CRM (optional) ────────────────────────────
        const crmPromise = (async () => {
            try {
                if (process.env.NEXT_PUBLIC_KIT19_API && process.env.NEXT_PUBLIC_KIT19_AUTH) {
                    await fetch(process.env.NEXT_PUBLIC_KIT19_API, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'D-SECRET-TOKEN': process.env.NEXT_PUBLIC_KIT19_AUTH,
                        },
                        body: JSON.stringify({
                            Name: leadData.full_name,
                            MobileNo: leadData.mobile,
                            Address: leadData.area || '',
                            Source: 'Lead Form',
                            Remark: `Property: ${propertyType || '-'}, Bill: ${leadData.monthly_bill || '-'}, Timeline: ${leadData.installation_timeline || '-'}`,
                        }),
                    });
                }
            } catch (crmError) {
                console.warn('Kit19 CRM push failed (non-critical):', crmError);
            }
        })();

        // Execute all external notifications in parallel without blocking client
        await Promise.allSettled([
            googleSheetPromise,
            ...whatsappPromises,
            crmPromise,
        ]);

        return NextResponse.json({
            success: true,
            message: 'आपकी जानकारी मिल गई है!',
            lead_id: data.id,
        });

    } catch (error: any) {
        console.error('Lead API error:', error);
        return NextResponse.json({ success: false, message: 'कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।' }, { status: 500 });
    }
}

// GET — Health check
export async function GET() {
    return NextResponse.json({ status: 'ok', endpoint: '/api/leads' });
}
