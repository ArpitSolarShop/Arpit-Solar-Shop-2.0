/**
 * Type definitions for API requests and responses
 */

// Quote submission types
export interface QuoteSubmissionRequest {
    fullName: string;
    whatsappNumber: string;
    pinCode: string;
    city: string;
    monthlyBill: string;
    companyName?: string;
    customerType?: 'Residential' | 'Commercial';
    productBrand?: string;
    productSize?: number;
    productPhase?: string;
}

export interface QuoteSubmissionResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

// Projects API types
export interface Project {
    id: string;
    title: string;
    category: string;
    location: string | null;
    cover_image_url: string | null;
    created_at?: string;
}

export interface ProjectsResponse {
    data: Project[];
    error: string | null;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

// API error types
export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
}
