# Supabase Database Migrations

This directory contains all SQL migration files for the Arpit Solar Shop database.

## Migration Files

1. **20260120_create_categories.sql** - Product categories with hierarchical structure
2. **20260120_create_brands.sql** - Solar panel brands and manufacturers
3. **20260120_create_product_attributes.sql** - Custom product attributes (Wattage, Panel Type, etc.)
4. **20260120_enhance_products.sql** - Add category, brand, and attributes to products table
5. **20260120_create_inventory_transactions.sql** - Inventory tracking and stock management
6. **20260120_create_customer_groups.sql** - Customer segmentation (Residential, Commercial, Wholesale)
7. **20260120_create_customers.sql** - Customer database
8. **20260120_create_orders.sql** - Orders and order items tables
9. **20260120_create_coupons.sql** - Discount codes and promotional offers
10. **20260120_create_marketing_campaigns.sql** - Email/SMS marketing campaigns
11. **20260120_create_cms_blog.sql** - CMS pages and blog posts
12. **20260120_create_admin_management.sql** - Admin users, roles, and activity logging

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file content in order
4. Run each migration one by one

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref vqusgnzkxkzidjsohips

# Run all migrations
supabase db push
```

### Option 3: Manual Execution

Run each SQL file in the Supabase SQL Editor in the order listed above.

## Features Included

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies for:
- Public read access where appropriate
- Authenticated user access for admin operations

### Triggers
- Auto-update `updated_at` timestamps
- Auto-update product stock quantities
- Auto-update customer statistics
- Activity logging

### Functions
- `generate_order_number()` - Auto-generate unique order numbers
- `validate_coupon()` - Validate coupon codes and calculate discounts
- `update_product_stock()` - Automatically update product stock
- `update_customer_stats()` - Track customer purchase history
- `log_admin_activity()` - Log all admin actions

### Indexes
Optimized indexes for:
- Fast lookups by slug, code, email
- Efficient filtering and sorting
- Full-text search support (GIN indexes for arrays)

## Default Data

The migrations include default data for:
- **Brands**: Tata Power Solar, Reliance Solar, Shakti Solar, Adani Solar, Vikram Solar
- **Product Attributes**: Wattage, Panel Type, Efficiency, Warranty, System Type, Phase, Capacity
- **Customer Groups**: Residential, Commercial, Wholesale, VIP
- **Admin Roles**: Super Admin, Admin, Manager, Editor, Viewer

## Next Steps

After running migrations:
1. Verify all tables are created in Supabase dashboard
2. Check RLS policies are active
3. Test with sample data
4. Update frontend to use new database structure
