// Database Types - Auto-generated from Supabase schema

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    parent_id: string | null;
                    image_url: string | null;
                    display_order: number;
                    is_active: boolean;
                    meta_title: string | null;
                    meta_description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
            };
            brands: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    logo_url: string | null;
                    website_url: string | null;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['brands']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['brands']['Insert']>;
            };
            product_attributes: {
                Row: {
                    id: string;
                    name: string;
                    code: string;
                    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
                    options: any[];
                    is_required: boolean;
                    is_filterable: boolean;
                    display_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['product_attributes']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['product_attributes']['Insert']>;
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    stock_quantity: number;
                    sku: string | null;
                    category_id: string | null;
                    brand_id: string | null;
                    attributes: Record<string, any>;
                    variants: any[];
                    tags: string[];
                    images: string[];
                    is_published: boolean;
                    meta_title: string | null;
                    meta_description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['products']['Insert']>;
            };
            inventory_transactions: {
                Row: {
                    id: string;
                    product_id: string;
                    type: 'adjustment' | 'sale' | 'return' | 'restock' | 'damage' | 'transfer';
                    quantity: number;
                    previous_quantity: number;
                    new_quantity: number;
                    reference_id: string | null;
                    notes: string | null;
                    created_by: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['inventory_transactions']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['inventory_transactions']['Insert']>;
            };
            customer_groups: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    discount_percentage: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['customer_groups']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['customer_groups']['Insert']>;
            };
            customers: {
                Row: {
                    id: string;
                    email: string;
                    first_name: string | null;
                    last_name: string | null;
                    phone: string | null;
                    customer_group_id: string | null;
                    total_orders: number;
                    total_spent: number;
                    notes: string | null;
                    tags: string[];
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['customers']['Insert']>;
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    customer_id: string | null;
                    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
                    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
                    subtotal: number;
                    tax: number;
                    shipping: number;
                    discount: number;
                    total: number;
                    currency: string;
                    shipping_address: any;
                    billing_address: any;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['orders']['Insert']>;
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string | null;
                    product_name: string;
                    product_sku: string | null;
                    quantity: number;
                    unit_price: number;
                    total_price: number;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
            };
            coupons: {
                Row: {
                    id: string;
                    code: string;
                    description: string | null;
                    type: 'percentage' | 'fixed' | 'free_shipping';
                    value: number;
                    min_purchase: number | null;
                    max_discount: number | null;
                    usage_limit: number | null;
                    usage_count: number;
                    per_customer_limit: number;
                    start_date: string | null;
                    end_date: string | null;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['coupons']['Insert']>;
            };
            marketing_campaigns: {
                Row: {
                    id: string;
                    name: string;
                    type: 'email' | 'sms' | 'whatsapp';
                    subject: string | null;
                    content: string;
                    status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
                    scheduled_at: string | null;
                    sent_at: string | null;
                    recipient_count: number;
                    open_count: number;
                    click_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['marketing_campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['marketing_campaigns']['Insert']>;
            };
            cms_pages: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string | null;
                    excerpt: string | null;
                    status: 'draft' | 'published';
                    meta_title: string | null;
                    meta_description: string | null;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['cms_pages']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['cms_pages']['Insert']>;
            };
            blog_posts: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string | null;
                    excerpt: string | null;
                    featured_image: string | null;
                    author_id: string | null;
                    status: 'draft' | 'published';
                    tags: string[];
                    meta_title: string | null;
                    meta_description: string | null;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
            };
            admin_roles: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    permissions: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['admin_roles']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['admin_roles']['Insert']>;
            };
            admin_users: {
                Row: {
                    id: string;
                    role_id: string | null;
                    is_active: boolean;
                    last_login: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
            };
            admin_activity_log: {
                Row: {
                    id: string;
                    user_id: string | null;
                    action: string;
                    resource_type: string | null;
                    resource_id: string | null;
                    details: any;
                    ip_address: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['admin_activity_log']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['admin_activity_log']['Insert']>;
            };
        };
    };
}

// Helper types
export type Category = Database['public']['Tables']['categories']['Row'];
export type Brand = Database['public']['Tables']['brands']['Row'];
export type ProductAttribute = Database['public']['Tables']['product_attributes']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'];
export type CustomerGroup = Database['public']['Tables']['customer_groups']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];
export type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
export type CMSPage = Database['public']['Tables']['cms_pages']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type AdminRole = Database['public']['Tables']['admin_roles']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type AdminActivityLog = Database['public']['Tables']['admin_activity_log']['Row'];
