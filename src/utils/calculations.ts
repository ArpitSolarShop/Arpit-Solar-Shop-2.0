/**
 * Solar system calculations and estimations
 */

import { SOLAR_CONSTANTS, STATE_TARIFFS } from '@/config/constants';

export interface SolarEstimate {
    systemSize: number;
    requiredRoofArea: number;
    monthlySavings: number;
    yearlySavings: number;
    fiveYearSavings: number;
    grossCost: number;
    netCost: number;
    paybackYears: number;
    co2Savings: number;
}

/**
 * Calculate solar system estimate based on monthly bill
 */
export function calculateSolarEstimate(
    monthlyBill: number,
    state: string = 'Uttar Pradesh'
): SolarEstimate {
    const tariff = STATE_TARIFFS[state] || 7.2;
    const monthlyUnits = monthlyBill / tariff;
    const systemSize = Math.ceil(monthlyUnits / SOLAR_CONSTANTS.AVG_GENERATION_PER_KW_MONTH);

    const requiredRoofArea = systemSize * SOLAR_CONSTANTS.AVG_ROOF_AREA_PER_KW;
    const monthlySavings = monthlyBill * 0.8; // 80% savings assumption
    const yearlySavings = monthlySavings * 12;
    const fiveYearSavings = yearlySavings * 5;

    const grossCost = systemSize * SOLAR_CONSTANTS.SYSTEM_COST_PER_KW;
    const subsidy = Math.min(
        systemSize * SOLAR_CONSTANTS.SUBSIDY_PER_KW,
        SOLAR_CONSTANTS.MAX_SUBSIDY
    );
    const netCost = grossCost - subsidy;

    const paybackYears = netCost / yearlySavings;
    const co2Savings = systemSize * SOLAR_CONSTANTS.CO2_SAVING_PER_KW_YEAR * 5;

    return {
        systemSize,
        requiredRoofArea,
        monthlySavings,
        yearlySavings,
        fiveYearSavings,
        grossCost,
        netCost,
        paybackYears,
        co2Savings,
    };
}

/**
 * Convert bill range string to numeric value
 */
export function convertBillRangeToNumber(range: string): number | null {
    if (!range) return null;

    const rangeMap: Record<string, number> = {
        "Less than ₹1500": 1000,
        "₹1500 - ₹2500": 2000,
        "₹2500 - ₹4000": 3250,
        "₹4000 - ₹8000": 6000,
        "More than ₹8000": 9000,
    };

    if (range in rangeMap) {
        return rangeMap[range];
    }

    // Try to parse as number
    const parsed = parseFloat(range);
    return isNaN(parsed) ? null : parsed;
}

/**
 * Calculate subsidy amount based on system size
 */
export function calculateSubsidy(systemSizeKW: number): number {
    if (systemSizeKW <= 2) {
        return systemSizeKW * 30000; // ₹30,000 per kW up to 2 kW
    } else if (systemSizeKW <= 3) {
        return 60000 + (systemSizeKW - 2) * 18000; // ₹60,000 for first 2 kW + ₹18,000 per kW for next 1 kW
    } else {
        return 78000; // Capped at ₹78,000 for systems > 3 kW
    }
}

/**
 * Estimate monthly generation (kWh) based on system size
 */
export function estimateMonthlyGeneration(systemSizeKW: number): number {
    return systemSizeKW * SOLAR_CONSTANTS.AVG_GENERATION_PER_KW_MONTH;
}
