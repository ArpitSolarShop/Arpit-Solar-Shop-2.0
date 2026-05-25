'use server'

import { pushLeadToCRM, CRMLead } from "@/lib/server/services/kit19-crm";
import { insertQuoteRequest } from "@/lib/server/services/supabase";

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

        // 2. Push to Neodove - MUST SUCCEED
        await pushLeadToNeodove(formData);

        // 3. Push to Kit19 (Best effort)
        const lead: CRMLead = {
            name: formData.name,
            phone: formData.phone,
            email: "",
            address: formData.city || "Varanasi",
            city: formData.city || "Varanasi",
            source: "Website Hero Section",
            medium: "Organic",
            campaign: "Hero Lead Form",
            remarks: `Type: ${customerType} | Monthly Bill: ${formData.monthlyBill || 'N/A'}`
        };
        await pushLeadToCRM(lead);

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

        // 2. Push to Neodove - MUST SUCCEED
        await pushLeadToNeodove(formData);

        // 3. Push to Kit19 (Best effort)
        const lead: CRMLead = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: "Contact Page Inquiry",
            city: formData.city || "Varanasi",
            source: "Website Contact Page",
            medium: "Contact Form",
            campaign: "Organic Website Traffic",
            remarks: `Message: ${formData.message}`
        };
        await pushLeadToCRM(lead);

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

        // 2. Push to Neodove - MUST SUCCEED
        await pushLeadToNeodove(formData);

        // 3. Push to Kit19 (Best effort)
        const lead: CRMLead = {
            name: formData.name,
            phone: formData.phone,
            email: "",
            address: formData.address || formData.location || "N/A",
            city: formData.city || formData.location, // Use location as city if city not provided
            source: "Quick Site Visit",
            medium: "Site Visit Popup",
            campaign: `Site Visit - ${formData.location}`,
            remarks: `Requested Site Visit in ${formData.location}`
        };
        await pushLeadToCRM(lead);

        return { success: true };
    } catch (error) {
        console.error("Failed to submit site visit:", error);
        return { success: false, error: "Failed to submit" };
    }
}

async function pushLeadToNeodove(formData: any) {
    const payload = {
        name: formData.name || "Unknown",
        mobile: formData.phone ? Number(formData.phone.replace(/\D/g, '')) : 0,
        email: formData.email || "",
        detail1: formData.city || formData.location || "",
        detail2: formData.category || formData.message || "Website Lead"
    };

    const res = await fetch('https://6513442b-f879-45c9-be19-944f45086e60.neodove.com/integration/custom/1e376832-40d7-47df-bb80-682287d9e15a/leads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Spoof headers to bypass basic bot protection
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Neodove CRM error:", errorText);
        throw new Error(`Failed to push to Neodove: ${res.status} ${errorText}`);
    }
    
    return true;
}
