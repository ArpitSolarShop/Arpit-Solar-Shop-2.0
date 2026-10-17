import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export const runtime = 'nodejs';

// Owner numbers to notify on new customer feedback
const OWNER_NUMBERS = ['+919044555572', '+919278599345'];
const GOOGLE_REVIEW_URL = 'https://g.page/r/CcJZzDtcNJTgEAE/review';

/**
 * Send feedback notification as a WhatsApp message to owner numbers via DoubleTick API.
 */
async function sendFeedbackWhatsApp(
    toPhone: string,
    feedback: Record<string, any>,
    apiKey: string,
    senderPhone: string
) {
    const now = new Date().toLocaleString('hi-IN', { timeZone: 'Asia/Kolkata' });

    const stars = (rating: number) => '⭐'.repeat(Math.min(Math.max(rating || 0, 0), 5));
    const avgScore = feedback.average_rating ? Number(feedback.average_rating).toFixed(1) : '—';

    const message = [
        `⭐ *नया सोलर इंस्टॉलेशन फीडबैक प्राप्त हुआ!*`,
        `━━━━━━━━━━━━━━━━`,
        `👤 *ग्राहक का नाम:* ${feedback.customer_name}`,
        `📞 *मोबाइल:* ${feedback.customer_mobile}`,
        `📍 *स्थान:* ${feedback.location || '—'}`,
        `⚡ *सोलर क्षमता:* ${feedback.solar_capacity || '—'}`,
        `🏆 *औसत रेटिंग:* ${avgScore} / 5.0 ${stars(Math.round(feedback.average_rating || 0))}`,
        `━━━━━━━━━━━━━━━━`,
        `📋 *चरणवार रेटिंग (1 से 5 Star):*`,
        `1. परामर्श व साइट सर्वे: ${feedback.rating_stage_1 || '—'} ⭐`,
        `2. प्रस्ताव व सिस्टम डिजाइन: ${feedback.rating_stage_2 || '—'} ⭐`,
        `3. इंस्टॉलेशन टीम व समय: ${feedback.rating_stage_3 || '—'} ⭐`,
        `4. नेट मीटरिंग व PM Surya Ghar: ${feedback.rating_stage_4 || '—'} ⭐`,
        `5. साइट सफाई व हैंडओवर: ${feedback.rating_stage_5 || '—'} ⭐`,
        `6. सिस्टम परफॉर्मेंस व उत्पादन: ${feedback.rating_stage_6 || '—'} ⭐`,
        `7. कुल संतुष्टि: ${feedback.rating_stage_7 || '—'} ⭐`,
        `8. मित्रों/परिवार को सिफ़ारिश (Recommendation): ${feedback.rating_recommendation || feedback.rating_stage_8 || '—'} ⭐`,
        `━━━━━━━━━━━━━━━━`,
        feedback.comments ? `💬 *सुझाव/टिप्पणी:* ${feedback.comments}\n━━━━━━━━━━━━━━━━` : '',
        `✍️ *सत्यापन/हस्ताक्षर:* ${feedback.customer_signature || 'हाँ'}`,
        `🕐 *समय:* ${now}`,
    ].filter(Boolean).join('\n');

    const toClean = toPhone.replace(/[^0-9]/g, '');
    const fromClean = senderPhone.replace(/[^0-9]/g, '');
    const headers = {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: apiKey,
    };

    try {
        await axios.post(
            'https://public.doubletick.io/whatsapp/message/text',
            { to: toClean, from: fromClean, content: { text: message } },
            { headers, timeout: 15000 }
        );
        console.log('✅ Feedback WhatsApp sent to', toClean);
        return;
    } catch (textErr: any) {
        const status = textErr?.response?.status;
        console.warn(`⚠️ Text API failed (${status}) for ${toClean}, trying template API...`);
    }

    // Approach 2: Fall back to approved utility template 'internal_task_alert'
    try {
        const clientInfo = `${feedback.customer_name} (${feedback.customer_mobile})`;
        const stageInfo = `फीडबैक: ${avgScore}★ | क्षमता: ${feedback.solar_capacity || '—'} | ${feedback.location || 'वाराणसी'}`;
        const actionInfo = `समीक्षा: ${feedback.comments ? feedback.comments.slice(0, 40) : 'Google रिव्यू अनुरोध'}`;

        await axios.post(
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
        console.log('✅ Feedback WhatsApp template sent to', toClean, '(internal_task_alert)');
    } catch (templateErr: any) {
        console.error(`❌ Template API also failed for ${toClean}:`, templateErr?.response?.data || templateErr?.message);
    }
}

// POST — Submit Customer Feedback
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const customerName = (body.customer_name || body.name || '').trim();
        const mobile = (body.customer_mobile || body.mobile || body.phone || '')
            .replace(/[^0-9]/g, '')
            .slice(-10);

        if (!customerName) {
            return NextResponse.json(
                { success: false, message: 'कृपया ग्राहक का नाम दर्ज करें।' },
                { status: 400 }
            );
        }

        if (!mobile || mobile.length !== 10) {
            return NextResponse.json(
                { success: false, message: 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।' },
                { status: 400 }
            );
        }

        // Ratings 1 to 8
        const r1 = Number(body.rating_stage_1) || 0;
        const r2 = Number(body.rating_stage_2) || 0;
        const r3 = Number(body.rating_stage_3) || 0;
        const r4 = Number(body.rating_stage_4) || 0;
        const r5 = Number(body.rating_stage_5) || 0;
        const r6 = Number(body.rating_stage_6) || 0;
        const r7 = Number(body.rating_stage_7) || 0;
        const r8 = Number(body.rating_stage_8 || body.rating_recommendation) || 0;

        const ratings = [r1, r2, r3, r4, r5, r6, r7, r8].filter((r) => r >= 1 && r <= 5);
        if (ratings.length === 0) {
            return NextResponse.json(
                { success: false, message: 'कृपया कम से कम एक चरण का मूल्यांकन (1 से 5 स्टार) करें।' },
                { status: 400 }
            );
        }

        const averageRating = Number(
            (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
        );

        const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
            console.error('Missing Supabase env vars');
            return NextResponse.json(
                { success: false, message: 'सर्वर कॉन्फ़िगरेशन एरर।' },
                { status: 500 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey
        );

        const ip_address =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const user_agent = request.headers.get('user-agent') || 'unknown';

        const feedbackData = {
            customer_name: customerName,
            customer_mobile: mobile,
            submission_date: body.submission_date || new Date().toISOString().split('T')[0],
            solar_capacity: body.solar_capacity?.trim() || null,
            location: body.location?.trim() || null,
            rating_stage_1: r1 >= 1 && r1 <= 5 ? r1 : null,
            rating_stage_2: r2 >= 1 && r2 <= 5 ? r2 : null,
            rating_stage_3: r3 >= 1 && r3 <= 5 ? r3 : null,
            rating_stage_4: r4 >= 1 && r4 <= 5 ? r4 : null,
            rating_stage_5: r5 >= 1 && r5 <= 5 ? r5 : null,
            rating_stage_6: r6 >= 1 && r6 <= 5 ? r6 : null,
            rating_stage_7: r7 >= 1 && r7 <= 5 ? r7 : null,
            rating_stage_8: r8 >= 1 && r8 <= 5 ? r8 : null,
            rating_recommendation: r8 >= 1 && r8 <= 5 ? r8 : null,
            average_rating: averageRating,
            comments: body.comments?.trim() || null,
            customer_signature: body.customer_signature?.trim() || customerName,
            google_review_clicked: Boolean(body.google_review_clicked),
            source: body.source || 'feedback-form',
            ip_address,
            user_agent,
            metadata: body.metadata || null,
        };

        const { data, error } = await supabase
            .from('solar_feedbacks')
            .insert(feedbackData)
            .select('id, created_at')
            .single();

        if (error) {
            console.error('Supabase feedback insert error:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { success: false, message: 'फीडबैक सेव नहीं हो सका। कृपया पुनः प्रयास करें।' },
                { status: 500 }
            );
        }

        // Send WhatsApp notification in background
        const apiKey = process.env.DOUBLETICK_API_KEY;
        const senderPhone = process.env.DOUBLETICK_SENDER_PHONE;
        if (apiKey && senderPhone) {
            Promise.allSettled(
                OWNER_NUMBERS.map((phone) =>
                    sendFeedbackWhatsApp(phone, feedbackData, apiKey, senderPhone)
                )
            ).catch((err) => console.error('WhatsApp notify error:', err));
        }

        return NextResponse.json({
            success: true,
            id: data?.id,
            average_rating: averageRating,
            google_review_url: GOOGLE_REVIEW_URL,
            message: 'आपका फीडबैक सफलतापूर्वक दर्ज कर लिया गया है। धन्यवाद!',
        });
    } catch (err: any) {
        console.error('API /api/feedback error:', err);
        return NextResponse.json(
            { success: false, message: 'अनपेक्षित त्रुटि हुई। कृपया पुनः प्रयास करें।' },
            { status: 500 }
        );
    }
}

// PATCH — Track Google Review Click
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const id = body.id;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing feedback ID' }, { status: 400 });
        }

        const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey
        );

        await supabase
            .from('solar_feedbacks')
            .update({ google_review_clicked: true, updated_at: new Date().toISOString() })
            .eq('id', id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('PATCH error:', err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

// GET — Fetch recent feedbacks (with optional limit)
export async function GET(request: NextRequest) {
    try {
        const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
            return NextResponse.json({ success: false, message: 'Config error' }, { status: 500 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey
        );

        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

        const { data, error } = await supabase
            .from('solar_feedbacks')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            count: data?.length || 0,
            feedbacks: data,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
