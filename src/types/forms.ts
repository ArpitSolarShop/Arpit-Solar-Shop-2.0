/**
 * Type definitions for form data and validation
 */

// Customer types
export type CustomerType = 'Residential' | 'Commercial';

// Form field types
export interface QuoteFormData {
    fullName: string;
    whatsappNumber: string;
    pinCode: string;
    companyName?: string;
    city: string;
    monthlyBill: string;
}

export interface EstimateData {
    roofOwnership: '' | 'Yes' | 'No';
    constructed: '' | 'Yes' | 'No';
    roofType: '' | 'Concrete' | 'Metal' | 'Brick';
    terraceSize: string;
    powerCuts: '' | 'Yes' | 'No';
    planning: '' | 'Immediately' | '3 Months' | '6 Months';
    fullAddress: string;
    landmark: string;
    latitude: number | null;
    longitude: number | null;
}

// Product system types
export interface ProductSystem {
    brand: string;
    size: number;
    phase: string;
    price?: number;
    mountingType?: string;
}

export interface ProductCatalog {
    residential: ProductSystem[];
    commercial: ProductSystem[];
}

// Form validation error types
export interface FormErrors {
    [key: string]: string | undefined;
}

// Form submission status
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface FormState {
    status: FormStatus;
    message?: string;
    errors?: FormErrors;
}
