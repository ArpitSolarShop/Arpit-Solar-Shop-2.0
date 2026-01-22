-- ============================================================================
-- ARPIT SOLAR SHOP - FIXED DATABASE MIGRATION
-- ============================================================================
-- This version uses INTEGER for product_id to match existing products table
-- Run this entire script in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/vqusgnzkxkzidjsohips/sql
-- ============================================================================

-- Create update timestamp function (used by all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
    ON categories FOR SELECT USING (true);

CREATE POLICY "Categories are editable by authenticated users" 
    ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. BRANDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands are viewable by everyone" 
    ON brands FOR SELECT USING (true);

CREATE POLICY "Brands are editable by authenticated users" 
    ON brands FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO brands (name, slug, description, is_active) VALUES
    ('Tata Power Solar', 'tata-power-solar', 'Leading solar panel manufacturer in India', true),
    ('Reliance Solar', 'reliance-solar', 'Reliance Industries solar division', true),
    ('Shakti Solar', 'shakti-solar', 'Premium solar solutions provider', true),
    ('Adani Solar', 'adani-solar', 'Adani Group solar manufacturing', true),
    ('Vikram Solar', 'vikram-solar', 'Indian solar panel manufacturer', true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. PRODUCT ATTRIBUTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'select', 'multiselect', 'boolean')),
    options JSONB DEFAULT '[]',
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attributes_code ON product_attributes(code);
CREATE INDEX IF NOT EXISTS idx_attributes_filterable ON product_attributes(is_filterable);

ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attributes are viewable by everyone" 
    ON product_attributes FOR SELECT USING (true);

CREATE POLICY "Attributes are editable by authenticated users" 
    ON product_attributes FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_product_attributes_updated_at 
    BEFORE UPDATE ON product_attributes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO product_attributes (name, code, type, options, is_filterable) VALUES
    ('Wattage', 'wattage', 'select', '["100W", "150W", "200W", "250W", "300W", "350W", "400W", "450W", "500W", "540W"]'::jsonb, true),
    ('Panel Type', 'panel_type', 'select', '["Monocrystalline", "Polycrystalline", "Thin Film", "Bifacial"]'::jsonb, true),
    ('Efficiency', 'efficiency', 'text', '[]'::jsonb, true),
    ('Warranty Years', 'warranty_years', 'select', '["10", "15", "20", "25", "30"]'::jsonb, true),
    ('System Type', 'system_type', 'select', '["On-Grid", "Off-Grid", "Hybrid"]'::jsonb, true),
    ('Phase', 'phase', 'select', '["Single Phase", "Three Phase"]'::jsonb, true),
    ('Capacity', 'capacity', 'select', '["1kW", "2kW", "3kW", "5kW", "7kW", "10kW", "15kW", "20kW"]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 4. ENHANCE PRODUCTS TABLE (Using UUID for foreign keys)
-- ============================================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- ============================================================================
-- 5. INVENTORY TRANSACTIONS TABLE (Using INTEGER for product_id)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('adjustment', 'sale', 'return', 'restock', 'damage', 'transfer')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory_transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory_transactions(created_by);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory transactions viewable by authenticated users" 
    ON inventory_transactions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Inventory transactions editable by authenticated users" 
    ON inventory_transactions FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET stock_quantity = NEW.new_quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stock_trigger
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- ============================================================================
-- 6. CUSTOMER GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer groups viewable by everyone" 
    ON customer_groups FOR SELECT USING (true);

CREATE POLICY "Customer groups editable by authenticated users" 
    ON customer_groups FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_customer_groups_updated_at 
    BEFORE UPDATE ON customer_groups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO customer_groups (name, description, discount_percentage) VALUES
    ('Residential', 'Individual homeowners', 0),
    ('Commercial', 'Small to medium businesses', 5),
    ('Wholesale', 'Bulk buyers and resellers', 10),
    ('VIP', 'Premium customers', 15)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 7. CUSTOMERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    customer_group_id UUID REFERENCES customer_groups(id) ON DELETE SET NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_group ON customers(customer_group_id);
CREATE INDEX IF NOT EXISTS idx_customers_tags ON customers USING GIN(tags);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers viewable by authenticated users" 
    ON customers FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Customers editable by authenticated users" 
    ON customers FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. ORDERS AND ORDER ITEMS TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    shipping DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders viewable by authenticated users" 
    ON orders FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Orders editable by authenticated users" 
    ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Order items viewable by authenticated users" 
    ON order_items FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Order items editable by authenticated users" 
    ON order_items FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' THEN
        UPDATE customers 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
    AFTER INSERT OR UPDATE OF payment_status ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid')
    EXECUTE FUNCTION update_customer_stats();

-- ============================================================================
-- 9. COUPONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
    value DECIMAL(10, 2) NOT NULL CHECK (value >= 0),
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER DEFAULT 1,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON coupons(start_date, end_date);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons viewable by everyone" 
    ON coupons FOR SELECT USING (true);

CREATE POLICY "Coupons editable by authenticated users" 
    ON coupons FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. MARKETING CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
    subject TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON marketing_campaigns(scheduled_at);

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by authenticated users" 
    ON marketing_campaigns FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Campaigns editable by authenticated users" 
    ON marketing_campaigns FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_marketing_campaigns_updated_at 
    BEFORE UPDATE ON marketing_campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 11. CMS PAGES AND BLOG POSTS TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    tags TEXT[] DEFAULT '{}',
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON cms_pages(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMS pages viewable by everyone" 
    ON cms_pages FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "CMS pages editable by authenticated users" 
    ON cms_pages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Blog posts viewable by everyone" 
    ON blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Blog posts editable by authenticated users" 
    ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

CREATE TRIGGER update_cms_pages_updated_at 
    BEFORE UPDATE ON cms_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 12. ADMIN MANAGEMENT TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON admin_activity_log(action);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin roles viewable by authenticated users" 
    ON admin_roles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin roles editable by authenticated users" 
    ON admin_roles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users viewable by authenticated users" 
    ON admin_users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin users editable by authenticated users" 
    ON admin_users FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Activity log viewable by authenticated users" 
    ON admin_activity_log FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Activity log insertable by authenticated users" 
    ON admin_activity_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE TRIGGER update_admin_roles_updated_at 
    BEFORE UPDATE ON admin_roles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

INSERT INTO admin_roles (name, description, permissions) VALUES
    ('Super Admin', 'Full system access', '{"all": true}'::jsonb),
    ('Admin', 'Standard admin access', '{"products": true, "orders": true, "customers": true}'::jsonb),
    ('Manager', 'Limited management access', '{"products": true, "orders": true}'::jsonb),
    ('Editor', 'Content management only', '{"cms": true, "blog": true}'::jsonb),
    ('Viewer', 'Read-only access', '{"view_only": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- Verify all tables were created in the Table Editor
-- Check that default data was inserted (brands, attributes, groups, roles)
-- ============================================================================
