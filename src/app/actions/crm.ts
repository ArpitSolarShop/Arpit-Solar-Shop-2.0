'use server'

import { pushLeadToCRM, CRMLead } from "@/lib/server/services/kit19-crm";
import { insertQuoteRequest } from "@/lib/server/services/supabase";

export async function submitHeroLead(formData: any, customerType: string = "residential") {
    // 1. Log to Local DB (Redundancy)
    try {
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            source: "Hero Section",
            customer_type: customerType || "residential",
            project_location: "Varanasi (Hero Default)", // or parse if available
            remarks: `Initial Interest. Category: ${formData.category}`
        });
    } catch (dbErr) {
        console.error("Home DB Log failed:", dbErr);
    }

    // 2. Push to Kit19
    try {
        const lead: CRMLead = {
            name: formData.name,
            phone: formData.phone,
            email: "",
            address: "Varanasi",
            city: "Varanasi",
            source: "Website Hero Section",
            medium: "Organic",
            campaign: "Hero Lead Form",
            remarks: `Interested in ${formData.category}`
        };

        await pushLeadToCRM(lead);
        return { success: true };
    } catch (error) {
        console.error("Failed to submit hero lead:", error);
        return { success: false };
    }
}

export async function submitContactForm(formData: any) {
    // 1. Log to Local DB (Redundancy)
    try {
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            project_location: formData.city,
            source: "Contact Page",
            customer_type: "residential",
            remarks: `Message: ${formData.message}`
        });
    } catch (dbErr) {
        console.error("Contact DB Log failed:", dbErr);
    }

    // 2. Push to Kit19
    try {
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
    // 1. Log to Local DB (Redundancy)
    try {
        await insertQuoteRequest({
            name: formData.name,
            phone: formData.phone,
            project_location: formData.location || formData.city,
            source: "Quick Site Visit",
            customer_type: "residential",
            remarks: `Requested visit for: ${formData.location}`
        });
    } catch (dbErr) {
        console.error("Site Visit DB Log failed:", dbErr);
    }

    // 2. Push to Kit19
    try {
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
