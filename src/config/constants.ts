/**
 * Application-wide constants
 */

// Solar calculation constants
export const SOLAR_CONSTANTS = {
    AVG_GENERATION_PER_KW_MONTH: 120, // kWh
    AVG_ROOF_AREA_PER_KW: 60, // sq ft
    SYSTEM_COST_PER_KW: 60000, // INR
    SUBSIDY_PER_KW: 18000, // INR
    MAX_SUBSIDY: 108000, // INR
    CO2_SAVING_PER_KW_YEAR: 1.2, // tons
} as const;

// State-wise electricity tariffs (INR per unit)
export const STATE_TARIFFS: Record<string, number> = {
    "Uttar Pradesh": 7.2,
    "Delhi": 8.0,
    "Maharashtra": 9.0,
    "Gujarat": 7.0,
    "Rajasthan": 8.5,
    "Karnataka": 7.5,
    "Tamil Nadu": 6.5,
    "West Bengal": 7.0,
} as const;

// Monthly bill ranges for quote form
export const BILL_RANGES = [
    "Less than ₹1500",
    "₹1500 - ₹2500",
    "₹2500 - ₹4000",
    "₹4000 - ₹8000",
    "More than ₹8000",
] as const;

// Form validation constants
export const VALIDATION = {
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 10,
    PINCODE_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
    PROJECTS: 300, // 5 minutes
    PRODUCTS: 600, // 10 minutes
    STATIC_DATA: 3600, // 1 hour
} as const;
