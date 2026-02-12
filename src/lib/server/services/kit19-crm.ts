
const CRM_API_URL = process.env.NEXT_PUBLIC_KIT19_API || 'https://sipapi.kit19.com/Enquiry/Add';
const CRM_AUTH_KEY = process.env.NEXT_PUBLIC_KIT19_AUTH || '';

export interface CRMLead {
    name: string;
    phone: string;
    email: string;
    address: string; // Used for City/ResidentialAddress if not specific
    city?: string;
    state?: string;
    pincode?: string;
    companyName?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    remarks?: string;
}

export async function pushLeadToCRM(lead: CRMLead) {
    if (!CRM_AUTH_KEY) {
        console.warn("⚠️ CRM Auth Key missing. Skipping Kit19 sync.");
        return null;
    }

    try {
        // Construct payload strictly matching user request
        const payload = {
            "PersonName": lead.name,
            "CompanyName": lead.companyName || "",
            "MobileNo": lead.phone,
            "MobileNo1": "",
            "MobileNo2": "",
            "EmailID": lead.email,
            "EmailID1": "",
            "EmailID2": "",
            "City": lead.city || lead.address,
            "State": lead.state || "",
            "Country": "India",
            "CountryCode": "+91",
            "CountryCode1": "",
            "CountryCode2": "",
            "PinCode": lead.pincode || "",
            "ResidentialAddress": lead.address,
            "OfficeAddress": lead.companyName ? lead.address : "", // Use address as Office Address if Commercial?
            "SourceName": lead.source || "Website",
            "MediumName": lead.medium || "Solar Shop Quote",
            "CampaignName": lead.campaign || "Lead Form",
            "InitialRemarks": lead.remarks || ""
        };

        console.log(`🚀 Pushing Lead to Kit19 CRM: ${lead.name}`);

        const response = await fetch(CRM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'kit19-Auth-Key': CRM_AUTH_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`CRM API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Kit19 CRM Response:', result);
        return result;

    } catch (error) {
        console.error('❌ Failed to push lead to Kit19 CRM:', error);
        // We do not rethrow, as CRM failure shouldn't block the user flow
        return null;
    }
}
