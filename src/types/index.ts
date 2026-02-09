// System Types
export type SystemType = {
    id: string;
    name: string;
    description: string | null;
    default_terms: string[] | null;
    created_at: string;
};

// Products (solar system packages)
export type Product = {
    id: string;
    system_type_id: string | null;
    name: string;
    brand: string | null;
    capacity_kw: number | null;
    phase: number;
    base_price: number;
    gst_rate: number;
    is_active: boolean;
    created_at: string;
};

// Components (BOM items)
export type Component = {
    id: string;
    system_type_id: string | null;
    name: string;
    description: string | null;
    default_quantity: string;
    default_make: string;
    sort_order: number;
    is_default: boolean;
    created_at: string;
};

// Quotation
export type Quotation = {
    id: string;
    quote_number: string | null;
    customer_name: string;
    customer_phone: string | null;
    customer_address: string | null;
    customer_email: string | null;
    quote_date: string;
    system_type_id: string | null;
    system_type?: SystemType;
    capacity_kw: number | null;
    phase: number;
    brand: string | null;
    base_price: number | null;
    gst_rate: number;
    gst_amount: number | null;
    total_amount: number | null;
    central_subsidy: number;
    state_subsidy: number;
    terms: string[] | null;
    components: QuotationComponent[] | null;
    savings_data: SavingsData | null;
    salesperson: string | null;
    status: string;
    pdf_url: string | null;
    created_at: string;
};

// Quotation Component (items in a quote)
export type QuotationComponent = {
    id?: string;
    name: string;
    description: string;
    quantity: string;
    make: string;
    sort_order: number;
    is_default?: boolean; // Optional
};

// Savings Calculator Data
export type SavingsData = {
    capacity_kw: number;
    units_per_day: number;
    annual_units: number;
    cost_per_unit: number;
    annual_savings: number;
    central_subsidy: number;
    state_subsidy: number;
    total_subsidy: number;
    net_cost: number;
    roi_years: number;
};
