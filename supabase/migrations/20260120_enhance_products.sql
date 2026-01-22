-- Migration: Enhance Products Table
-- Description: Add category, brand, and attributes support

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Add comment
COMMENT ON COLUMN products.attributes IS 'Product-specific attribute values as key-value pairs';
COMMENT ON COLUMN products.variants IS 'Product variants with different attribute combinations';
COMMENT ON COLUMN products.tags IS 'Product tags for search and filtering';
