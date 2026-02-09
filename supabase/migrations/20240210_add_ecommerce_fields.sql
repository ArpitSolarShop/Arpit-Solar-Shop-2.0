-- Add e-commerce fields to solar_products table

-- Display name for product catalog
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Marketing description
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS description TEXT;

-- Product image URL
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Visibility in storefront
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Optional brand field for filtering
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS brand VARCHAR(100);

-- Sort order for display
ALTER TABLE solar_products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Populate name field with auto-generated names based on category and size
UPDATE solar_products 
SET name = category || ' ' || system_size_kw || ' kW Solar System',
    brand = category,
    description = 'Complete ' || category || ' solar system with ' || system_size_kw || ' kW capacity'
WHERE name IS NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_published ON solar_products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_brand ON solar_products(brand);
