// Arpit Solar Shop - Company Details
export const companyDetails = {
    name: "Arpit Solar Shop",
    tagline: "ILLUMINATING YOUR FUTURE WITH CLEAN ENERGY",
    gstin: "09APKPM6299L1ZW",

    // Addresses
    headOffice: "Sh16/114/25-K-2, Sharvodaya Nagar, Kadipur Shivpur, Varanasi 221003",
    registeredOffice: "1st Floor, Maurya Bhawan, Malgodam Road, Ballia 277001",

    // Contact
    phone: "+91 9005770466",
    alternatePhone: "9044555572",
    email: "arpitsolarshop@gmail.com",

    // Bank Details
    bank: {
        name: "Bank of Baroda",
        branch: "Shivpur, Varanasi",
        accountName: "Arpit Solar Shop",
        accountNumber: "28660200000614",
        ifsc: "BARB0SHIVBS",
        upiId: "9044555574@okbizaxis", // Updated UPI ID
    },

    // Logo
    logo: "/logo.webp",

    // Authorized Signatory
    authorizedSignatory: "Ratnesh Mishra",
};

// PM Surya Ghar Tiered Central Subsidy Calculator
// User defined rules: 90k for 2kW, 108k for 3kW+, 0 for < 2kW
export const calculateCentralSubsidy = (requestedCapacityKw: number): number => {
    const kw = Math.floor(Math.max(0, requestedCapacityKw));
    if (kw < 2) return 0;
    if (kw === 2) return 90000;
    return 108000; // Cap for 3kW+
};

// Default Subsidy Amounts (can be overridden per quotation)
export const defaultSubsidy = {
    central: 108000,  // PM Surya Ghar (for 3kW+ systems)
    state: 0,         // Integrated into central total as per user preference
};

// GST Configuration
export const gstConfig = {
    compositeRate: 8.9, // Default composite rate
    supplyRate: 5,      // 5% on 70% (Supply)
    serviceRate: 18,    // 18% on 30% (Service)
    supplyShare: 70,    // 70% supply
    serviceShare: 30,   // 30% service
};

// Calculation: Effective GST = (70% × 5%) + (30% × 18%) = 3.5% + 5.4% = 8.9%

// Quote Number Prefix
export const quoteNumberPrefix = "ASS"; // Arpit Solar Shop

// Generate Quote Number
export const generateQuoteNumber = (customerInitials: string): string => {
    const now = new Date();
    const year = now.getFullYear();
    const day = String(now.getDate()).padStart(2, '0');
    return `${quoteNumberPrefix}/${year}/${customerInitials}/${day}`;
};

// Default Terms by System Type
export const defaultTerms = {
    'On-grid': [
        'Payment: 10% Advance on structure installation.',
        'Delivery: 85% Before delivery of kit. 5% Post installation.',
        'Insurance: Freight and transit insurance included.',
        'Discom: Net meter fee charged directly to electricity bill.',
        'Consumer Scope: Structure elevation & civil material.',
        'Permits: Name change/Load increment charged extra.',
        'Structure: 80 Micron GI Sheet with wind resistance.',
        'Support: Assistance in Net Metering documentation.',
        'Grid Voltage: 185V to 275V without frequent fluctuation.',
        'Delivery Timeline: Within 4 weeks from confirmed order.',
        'Installation: Within 45 days from confirmed order & payment.',
        'AC Wire: Up to 10m included. Extra charged as per actual.',
        'Earthing Wire: Up to 30m included. Extra charged as per actual.',
        'Warranty: Solar Module 25 Years, PCU 5 Years. External damages not covered.',
    ],
    'Off-grid': [
        'Payment: 50% Advance. 50% Before delivery.',
        'Insurance: Freight and transit insurance included.',
        'Consumer Scope: Structure elevation & civil material.',
        'Delivery Timeline: Within 4 weeks from confirmed order.',
        'Installation: Within 45 days from confirmed order & payment.',
        'AC Wire: Up to 10m included. Extra charged as per actual.',
        'Earthing Wire: Up to 30m included. Extra charged as per actual.',
        'Warranty: Solar Module 25 Years, Inverter 2 Years, Battery 2 Years.',
    ],
    'Hybrid': [
        'Payment: 10% Advance on structure installation.',
        'Delivery: 85% Before delivery of kit. 5% Post installation.',
        'Insurance: Freight and transit insurance included.',
        'Discom: Net meter fee charged directly to electricity bill.',
        'Consumer Scope: Structure elevation & civil material.',
        'Permits: Name change/Load increment charged extra.',
        'Structure: 80 Micron GI Sheet with wind resistance.',
        'Support: Assistance in Net Metering documentation.',
        'Grid Voltage: 185V to 275V without frequent fluctuation.',
        'Delivery Timeline: Within 4 weeks from confirmed order.',
        'Installation: Within 45 days from confirmed order & payment.',
        'AC Wire: Up to 10m included. Extra charged as per actual.',
        'Earthing Wire: Up to 30m included. Extra charged as per actual.',
        'Warranty: Solar Module 25 Years, Hybrid Inverter 5 Years, Li-Ion Battery 5 Years.',
    ],
    'VFD/Drive': [
        'Payment: 50% Advance with order confirmation.',
        'Delivery: 50% Before delivery.',
        'Insurance: Freight and transit insurance included.',
        'Installation: Charges as per site conditions.',
        'Warranty: VFD 2 Years, Solar Modules 25 Years.',
    ],
};

// Default Components by System Type
export const defaultComponents = {
    'On-grid': [
        { name: 'Solar Photovoltaic Modules', description: '580Wp (DCR) Topcon Modules', quantity: '6 Nos', make: 'Waaree/Adani/Premier', sort_order: 1 },
        { name: 'PCU / Inverter', description: 'On-Grid String Inverter 3KW', quantity: '01 No', make: 'Polycab/Shakti', sort_order: 2 },
        { name: 'DC Distribution Box (DCDB)', description: 'IP65 CRCA with DP MCB', quantity: '01 No', make: 'Standard', sort_order: 3 },
        { name: 'AC Distribution Box (ACDB)', description: 'SPD, Changeover, MCB, Meter', quantity: '01 No', make: 'Standard', sort_order: 4 },
        { name: 'AC Cable (Main Connection)', description: 'Copper Multi-strand, 4 Sq mm', quantity: '10 Mtrs', make: 'Standard', sort_order: 5 },
        { name: 'DC Interconnecting Cables', description: 'Polycab 4 Sq mm, UV Protected', quantity: '40 Mtrs', make: 'Standard', sort_order: 6 },
        { name: 'Module Mounting Structure', description: 'GI 80 Micron, 150kmph Wind Load', quantity: '01 Set', make: 'GI 80 Micron', sort_order: 7 },
        { name: 'Earthing System', description: '3 Nos Copper Bonded + Chemical', quantity: '03 Sets', make: 'Standard', sort_order: 8 },
        { name: 'Lightning Arrestor', description: 'Conventional Type 1.25" Dia', quantity: '01 Set', make: 'Standard', sort_order: 9 },
    ],
    'Off-grid': [
        { name: 'Solar Photovoltaic Modules', description: 'PV Modules', quantity: '4 Nos', make: 'Waaree/Adani', sort_order: 1 },
        { name: 'Off-Grid Inverter', description: 'PWM/MPPT Inverter', quantity: '01 No', make: 'Standard', sort_order: 2 },
        { name: 'Battery Bank', description: 'Tubular/SMF Battery', quantity: '04 Nos', make: 'Exide/Luminous', sort_order: 3 },
        { name: 'Charge Controller', description: 'MPPT/PWM Controller', quantity: '01 No', make: 'Standard', sort_order: 4 },
        { name: 'DC Cables', description: 'PVC Insulated, UV Protected', quantity: '30 Mtrs', make: 'Standard', sort_order: 5 },
        { name: 'Module Mounting Structure', description: 'GI 80 Micron', quantity: '01 Set', make: 'GI 80 Micron', sort_order: 6 },
        { name: 'Earthing System', description: 'Copper Bonded + Chemical', quantity: '02 Sets', make: 'Standard', sort_order: 7 },
    ],
    'Hybrid': [
        { name: 'Solar Photovoltaic Modules', description: '580Wp (NDCR) PV Modules', quantity: '9 Nos', make: 'Waaree/Adani/Premier', sort_order: 1 },
        { name: 'PCU / Inverter', description: 'Hybrid Inverter 3.6KW', quantity: '01 No', make: 'Servotech', sort_order: 2 },
        // Battery removed from default (added dynamically if variant=WITH_BATTERY via DB)
        { name: 'AC Cable', description: 'Copper, 6Sq mm', quantity: 'As per actual', make: 'Standard', sort_order: 5 },
        { name: 'DC Interconnecting Cables', description: '4 Sq mm, UV Protected', quantity: '150 Mtrs', make: 'Standard', sort_order: 6 },
        { name: 'Module Mounting Structure', description: 'MMS in pre GI sheet', quantity: '01 Set', make: 'GI 80 Micron', sort_order: 7 },
        { name: 'Earthing System', description: 'Copper Bonded + Chemical', quantity: '03 Sets', make: 'Standard', sort_order: 8 },
        { name: 'Lightning Arrestor', description: 'Conventional Type 1.25" Dia', quantity: '01 Set', make: 'Standard', sort_order: 9 },
    ],
    'VFD/Drive': [
        { name: 'Solar Photovoltaic Modules', description: '600Wp (NDCR) Pv Modules', quantity: '48 NOS', make: 'Waaree / Adani Solar / Premier', sort_order: 1 },
        { name: 'VFD Drive', description: '25HP VFD', quantity: '1 NOS', make: 'INVT / Crompton', sort_order: 2 },
        { name: 'AC Cable', description: 'Copper, 6Sq mm', quantity: 'As per actual', make: 'Standard', sort_order: 3 },
        { name: 'DC Interconnecting Cables', description: '1C x 4 sqmm 1.1kV, PVC insulated, UV Protected unarmored Cu Cable', quantity: '150 Mtrs', make: 'Standard', sort_order: 4 },
        { name: 'Module Mounting Structure', description: 'MMS in pre GI sheet', quantity: '1 Set', make: 'GI 80 Micron', sort_order: 5 },
        { name: 'Earthing System', description: '10 sqmm AL Solid Cable + Chemical earthing + 3nos copper bonded rod', quantity: 'As per actual', make: 'Standard', sort_order: 6 },
        { name: 'Lightning Arrestor', description: 'Conventional Type 1.25" Dia.', quantity: '1 Set', make: 'Standard', sort_order: 7 },
    ],
};

// Savings Calculator Constants
export const savingsConfig = {
    unitsPerKwPerDay: 4,      // Average units generated per KW per day
    daysPerYear: 365,
    gridCostPerUnit: 6.5,     // Average cost per unit from grid (Rs.)
};

// Calculate savings data
export const calculateSavings = (
    capacityKw: number,
    totalCost: number,
    centralSubsidy: number = defaultSubsidy.central,
    stateSubsidy: number = defaultSubsidy.state
): {
    unitsPerDay: number;
    annualUnits: number;
    annualSavings: number;
    totalSubsidy: number;
    netCost: number;
    roiYears: number;
} => {
    const unitsPerDay = capacityKw * savingsConfig.unitsPerKwPerDay;
    const annualUnits = unitsPerDay * savingsConfig.daysPerYear;
    const annualSavings = annualUnits * savingsConfig.gridCostPerUnit;
    const totalSubsidy = (centralSubsidy || 0) + (stateSubsidy || 0);
    const netCost = Math.max(0, totalCost - totalSubsidy);
    const roiYears = annualSavings > 0 ? netCost / annualSavings : 0;

    return {
        unitsPerDay: Math.round(unitsPerDay * 100) / 100,
        annualUnits: Math.round(annualUnits * 100) / 100,
        annualSavings: Math.round(annualSavings * 100) / 100,
        totalSubsidy,
        netCost,
        roiYears: Math.round(roiYears * 10) / 10,
    };
};
