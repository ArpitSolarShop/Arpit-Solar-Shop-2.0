export interface QuotationComponent {
    name: string;
    description: string;
    quantity: string;
    make: string;
    sort_order: number;
    is_default?: boolean;
}
