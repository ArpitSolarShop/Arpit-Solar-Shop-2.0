
export interface Address {
    street?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    phone?: string;
}

export interface Variant {
    id: string;
    name: string;
    sku?: string;
    price: number;
    stock?: number;
    attributes?: Record<string, string>;
}
