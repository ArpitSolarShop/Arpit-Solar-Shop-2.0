'use server'

import { insertQuoteRequest } from "@/lib/server/services/supabase";

// ============================================================
// NEODOVE CRM — Facebook Lead-Gen Webhook Format
// Endpoint: POST https://api.neodove.com/integration/fb/<integration_id>/leads
// ============================================================
const NEODOVE_FB_WEBHOOK_URL = 'https://api.neodove.com/integration/fb/07f1ea3f-f2c6-4955-8397-fee0d6d17bd6/leads';
const NEODOVE_PAGE_ID = '101734858445127'; // Facebook Page ID used in the webhook payload

/**
 * Push a lead to Neodove CRM using the Facebook lead-gen webhook format.
 * This is a fire-and-forget style call — errors are logged but do not block user flow
 * unless explicitly needed.
 */
async function pushLeadToNeodove(formData: any) {
    const now = Math.floor(Date.now() / 1000);
    // Use a unique leadgen_id based on timestamp + phone hash to avoid duplicates
    const leadgenId = `web_${now}_${(formData.phone || '').replace(/\D/g, '').slice(-6)}`;
    const formId = `web_form_${now}`;

    const payload = {
        object: "page",
        entry: [
            {
                id: NEODOVE_PAGE_ID,
                time: now,
                changes: [
                    {
                        value: {
                            form_id: formId,
                            leadgen_id: leadgenId,
                            created_time: now,
                            page_id: NEODOVE_PAGE_ID,
                            // Pass lead data as additional fields — Neodove extracts from the webhook
                            field_data: [
                                { name: "full_name", values: [formData.name || "Unknown"] },
                                { name: "phone_number", values: [formData.phone ? `+91${formData.phone.replace(/\D/g, '').slice(-10)}` : ""] },
                                { name: "email", values: [formData.email || ""] },
                                { name: "city", values: [formData.city || formData.location || formData.project_location || ""] },
                                { name: "source", values: [formData._source || "Website"] },
                            ]
                        },
                        field: "leadgen"
                    }
                ]
            }
        ]
    };

    const res = await fetch(NEODOVE_FB_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Neodove CRM error:", res.status, errorText);
        throw new Error(`Failed to push to Neodove: ${res.status} ${errorText}`);
    }

    console.log(`✅ Lead pushed to Neodove: ${formData.name} (${formData.phone})`);
    return true;
}

// ============================================================
// SERVER ACTIONS — One per form type
// ============================================================

export async function submitHeroLead(formData: any, customerType: string = "residential") {
    try {
        // 1. Log to Local DB (Supabase) - MUST SUCCEED
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            source: "Hero Section",
            customer_type: customerType || "residential",
            project_location: formData.city || "Varanasi (Hero Default)",
            monthly_bill: formData.monthlyBill || null,
            remarks: `Initial Interest. Category: ${formData.category} | Monthly Bill: ${formData.monthlyBill || 'N/A'}`
        });

        // 2. Push to Neodove CRM
        await pushLeadToNeodove({ ...formData, _source: "Website Hero Section" });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit hero lead:", error);
        return { success: false, error: error instanceof Error ? error.message : "Submission failed" };
    }
}

export async function submitContactForm(formData: any) {
    try {
        // 1. Log to Local DB (Supabase) - MUST SUCCEED
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            project_location: formData.city,
            source: "Contact Page",
            customer_type: "residential",
            remarks: `Message: ${formData.message}`
        });

        // 2. Push to Neodove CRM
        await pushLeadToNeodove({ ...formData, _source: "Website Contact Page" });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit contact form:", error);
        return { success: false, error: "Failed to submit" };
    }
}

export async function submitSiteVisit(formData: any) {
    try {
        // 1. Log to Local DB (Supabase) - MUST SUCCEED
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            project_location: formData.location || formData.city,
            source: "Quick Site Visit",
            customer_type: "residential",
            remarks: `Requested visit for: ${formData.location}`
        });

        // 2. Push to Neodove CRM
        await pushLeadToNeodove({ ...formData, _source: "Quick Site Visit" });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit site visit:", error);
        return { success: false, error: "Failed to submit" };
    }
}

/**
 * Server action for the Universal Quote Form (Tata/Reliance/Shakti/Hybrid/Integrated).
 * Pushes the lead to Neodove CRM.
 * DB insertion is handled by /api/generate-quote, so we only do CRM here.
 */
export async function submitUniversalQuoteLead(formData: any) {
    try {
        await pushLeadToNeodove({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || "",
            city: formData.project_location || "",
            _source: `${formData.product_category || 'Generic'} Quote Form`,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit universal quote lead:", error);
        return { success: false, error: "Failed to submit" };
    }
}

/**
 * Server action for the AI Chatbot (Yami).
 */
export async function submitChatbotLead(formData: any) {
    try {
        await pushLeadToNeodove({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || "",
            city: formData.location || "",
            _source: "AI Chatbot (Yami)",
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit chatbot lead:", error);
        return { success: false, error: "Failed to submit" };
    }
}

/**
 * Server action for Checkout / Order form.
 * Pushes the customer's order info as a lead to Neodove CRM.
 */
export async function submitCheckoutLead(formData: any) {
    try {
        await pushLeadToNeodove({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || "",
            city: formData.city || "",
            _source: "Checkout / Order",
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit checkout lead:", error);
        return { success: false, error: "Failed to submit" };
    }
}

/**
 * Standalone Neodove push function for use in API routes (server-side only).
 * Exported so generate-quote route can call it directly.
 */
export { pushLeadToNeodove };
