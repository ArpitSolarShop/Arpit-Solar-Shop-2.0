'use server'

import { pushLeadToCRM, CRMLead } from '@/lib/server/services/kit19-crm';

export async function submitHeroLead(formData: any, customerType: string) {
    try {
        const lead: CRMLead = {
            name: formData.fullName,
            phone: formData.whatsappNumber,
            email: "", // Hero form Step 1 doesn't capture email
            address: formData.city || "Varanasi",
            source: "Website Hero",
            medium: "Quick Estimate Form",
            campaign: "Hero Section Lead",
            remarks: `Customer Type: ${customerType}, Monthly Bill: ${formData.monthlyBill}`
        };

        await pushLeadToCRM(lead);
        return { success: true };
    } catch (error) {
        console.error("Failed to submit hero lead:", error);
        return { success: false };
    }
}
