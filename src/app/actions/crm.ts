'use server'

import { pushLeadToCRM, CRMLead } from '@/lib/server/services/kit19-crm';

export async function submitHeroLead(formData: any, customerType: string) {
    try {
        const lead: CRMLead = {
            name: formData.fullName,
            companyName: formData.companyName,
            phone: formData.whatsappNumber,
            email: "", // Hero form Step 1 doesn't capture email
            address: formData.city || "Varanasi",
            city: formData.city,
            pincode: formData.pinCode,
            source: "Website Hero",
            medium: "Quick Estimate Form",
            campaign: "Hero Section Lead",
            remarks: `Customer Type: ${customerType}, Monthly Bill: ${formData.monthlyBill}`
        };

        await pushLeadToCRM(lead);
        return { success: true };
    } catch (error) {
        console.error("Failed to submit hero lead:", error);
    }
}

export async function submitContactForm(formData: any) {
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
