import { z } from 'zod';

// Category validation schema
export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().optional(),
    parent_id: z.string().uuid().optional().nullable(),
    image_url: z.string().url().optional().nullable(),
    display_order: z.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    meta_title: z.string().max(60).optional().nullable(),
    meta_description: z.string().max(160).optional().nullable(),
});

// Brand validation schema
export const brandSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().optional().nullable(),
    logo_url: z.string().url().optional().nullable(),
    website_url: z.string().url().optional().nullable(),
    is_active: z.boolean().default(true),
});

// Customer validation schema
export const customerSchema = z.object({
    email: z.string().email('Invalid email address'),
    first_name: z.string().min(1, 'First name is required').max(50),
    last_name: z.string().min(1, 'Last name is required').max(50),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits').optional().nullable(),
    customer_group_id: z.string().uuid().optional().nullable(),
    notes: z.string().optional().nullable(),
    tags: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
});

// Order validation schema
export const orderSchema = z.object({
    customer_id: z.string().uuid('Invalid customer'),
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).default('pending'),
    payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
    subtotal: z.number().min(0),
    tax: z.number().min(0).default(0),
    shipping: z.number().min(0).default(0),
    discount: z.number().min(0).default(0),
    total: z.number().min(0),
    currency: z.string().default('INR'),
    shipping_address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postal_code: z.string(),
        country: z.string().default('India'),
    }).optional().nullable(),
    billing_address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        postal_code: z.string(),
        country: z.string().default('India'),
    }).optional().nullable(),
    notes: z.string().optional().nullable(),
});

// Order item validation schema
export const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    product_sku: z.string().optional().nullable(),
    quantity: z.number().int().min(1),
    unit_price: z.number().min(0),
    total_price: z.number().min(0),
});

// Coupon validation schema
export const couponSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').max(20).toUpperCase(),
    description: z.string().optional().nullable(),
    type: z.enum(['percentage', 'fixed', 'free_shipping']),
    value: z.number().min(0),
    min_purchase: z.number().min(0).optional().nullable(),
    max_discount: z.number().min(0).optional().nullable(),
    usage_limit: z.number().int().min(1).optional().nullable(),
    per_customer_limit: z.number().int().min(1).default(1),
    start_date: z.string().datetime().optional().nullable(),
    end_date: z.string().datetime().optional().nullable(),
    is_active: z.boolean().default(true),
});

// Product attribute validation schema
export const attributeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    code: z.string().min(1, 'Code is required').max(50).regex(/^[a-z0-9_]+$/, 'Code must be lowercase with underscores'),
    type: z.enum(['text', 'number', 'select', 'multiselect', 'boolean']),
    options: z.array(z.string()).default([]),
    is_required: z.boolean().default(false),
    is_filterable: z.boolean().default(false),
    display_order: z.number().int().min(0).default(0),
});

// CMS Page validation schema
export const cmsPageSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    content: z.string().optional().nullable(),
    excerpt: z.string().max(300).optional().nullable(),
    status: z.enum(['draft', 'published']).default('draft'),
    meta_title: z.string().max(60).optional().nullable(),
    meta_description: z.string().max(160).optional().nullable(),
    published_at: z.string().datetime().optional().nullable(),
});

// Blog post validation schema
export const blogPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    content: z.string().optional().nullable(),
    excerpt: z.string().max(300).optional().nullable(),
    featured_image: z.string().url().optional().nullable(),
    author_id: z.string().uuid().optional().nullable(),
    status: z.enum(['draft', 'published']).default('draft'),
    tags: z.array(z.string()).default([]),
    meta_title: z.string().max(60).optional().nullable(),
    meta_description: z.string().max(160).optional().nullable(),
    published_at: z.string().datetime().optional().nullable(),
});

// Inventory transaction validation schema
export const inventoryTransactionSchema = z.object({
    product_id: z.string().uuid('Invalid product'),
    type: z.enum(['adjustment', 'sale', 'return', 'restock', 'damage', 'transfer']),
    quantity: z.number().int(),
    notes: z.string().optional().nullable(),
});

// Export all schemas
export const validationSchemas = {
    category: categorySchema,
    brand: brandSchema,
    customer: customerSchema,
    order: orderSchema,
    orderItem: orderItemSchema,
    coupon: couponSchema,
    attribute: attributeSchema,
    cmsPage: cmsPageSchema,
    blogPost: blogPostSchema,
    inventoryTransaction: inventoryTransactionSchema,
};

// Type exports
export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type AttributeInput = z.infer<typeof attributeSchema>;
export type CMSPageInput = z.infer<typeof cmsPageSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type InventoryTransactionInput = z.infer<typeof inventoryTransactionSchema>;
