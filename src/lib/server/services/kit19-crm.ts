
const CRM_API_URL = 'https://sipapi.kit19.com/Enquiry/Add';
// Key provided by user
const CRM_AUTH_KEY = '4e7bb26557334f91a21e56a4ea9c8752';

export interface CRMLead {
    name: string;
    phone: string;
    email: string;
    address: string; // Used for City/ResidentialAddress
    source?: string;
    medium?: string;
    campaign?: string;
    remarks?: string;
}

export async function pushLeadToCRM(lead: CRMLead) {
    try {
        // Construct payload as per Kit19 requirements
        const payload = {
            "PersonName": lead.name,
            "MobileNo": lead.phone,
            "EmailID": lead.email,
            "City": lead.address, // Mapping project_location to City
            "State": "",          // Not captured in current form
            "Country": "India",
            "CountryCode": "+91",
            "PinCode": "",
            "ResidentialAddress": lead.address,
            "OfficeAddress": "",
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
