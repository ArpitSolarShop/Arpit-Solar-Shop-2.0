-- Create products table for e-commerce
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  brand VARCHAR(50) NOT NULL,
  category VARCHAR(50),
  product_type VARCHAR(50),
  
  -- Pricing
  price NUMERIC(14,2),
  discount_price NUMERIC(14,2),
  
  -- Media
  image_url TEXT,
  images JSONB,  -- Array of image URLs
  
  -- Specifications (Flexible)
  specifications JSONB,
  
  -- E-commerce
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  
  -- SEO
  slug VARCHAR(255) UNIQUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, brand, category, product_type, price, image_url, specifications, is_published, sort_order, sku, slug) VALUES

-- Tata Solar Products
(
  'Tata Solar 3kW On-Grid System',
  'Complete 3kW on-grid solar system with high-efficiency panels and inverter. Perfect for residential use with net metering capability.',
  'Tata Power Solar',
  'Solar Systems',
  'On-Grid',
  185000,
  '/Tata%20Power%20Solar.png',
  '{"system_capacity": "3kW", "inverter_capacity": "3kW", "panel_wattage": "540W", "panel_count": 6, "warranty": "25 years", "efficiency": "21%", "technology": "Monocrystalline PERC"}'::jsonb,
  true,
  1,
  'TATA-ONGRID-3KW',
  'tata-solar-3kw-on-grid-system'
),
(
  'Tata Solar 5kW Hybrid System',
  'Advanced 5kW hybrid solar system with battery backup. Ideal for areas with frequent power cuts. Includes 5kWh lithium battery.',
  'Tata Power Solar',
  'Solar Systems',
  'Hybrid',
  425000,
  '/Tata%20Power%20Solar.png',
  '{"system_capacity": "5kW", "inverter_capacity": "5kW", "battery_capacity": "5kWh", "panel_wattage": "540W", "panel_count": 10, "warranty": "25 years", "backup_hours": "4-6 hours"}'::jsonb,
  true,
  2,
  'TATA-HYBRID-5KW',
  'tata-solar-5kw-hybrid-system'
),
(
  'Tata Solar 10kW Commercial System',
  'High-capacity 10kW commercial solar system designed for businesses and large homes. Maximum energy generation with premium components.',
  'Tata Power Solar',
  'Solar Systems',
  'Commercial',
  650000,
  '/Tata%20Power%20Solar.png',
  '{"system_capacity": "10kW", "inverter_capacity": "10kW", "panel_wattage": "540W", "panel_count": 19, "warranty": "25 years", "phase": "3-Phase", "annual_generation": "14000 kWh"}'::jsonb,
  true,
  3,
  'TATA-COMMERCIAL-10KW',
  'tata-solar-10kw-commercial-system'
),

-- Reliance Solar Products
(
  'Reliance Solar 4kW On-Grid System',
  'Premium 4kW on-grid solar solution from Reliance. Features high-efficiency panels and smart monitoring system.',
  'Reliance',
  'Solar Systems',
  'On-Grid',
  245000,
  '/reliance-industries-ltd.png',
  '{"system_capacity": "4kW", "inverter_capacity": "4kW", "panel_wattage": "545W", "panel_count": 8, "warranty": "25 years", "monitoring": "Smart App", "efficiency": "21.5%"}'::jsonb,
  true,
  4,
  'RELIANCE-ONGRID-4KW',
  'reliance-solar-4kw-on-grid-system'
),
(
  'Reliance Solar 6kW Hybrid System',
  'Complete 6kW hybrid solar system with advanced battery management. Perfect for medium to large homes with backup requirements.',
  'Reliance',
  'Solar Systems',
  'Hybrid',
  525000,
  '/reliance-industries-ltd.png',
  '{"system_capacity": "6kW", "inverter_capacity": "6kW", "battery_capacity": "7.5kWh", "panel_wattage": "545W", "panel_count": 11, "warranty": "25 years", "backup_hours": "5-7 hours"}'::jsonb,
  true,
  5,
  'RELIANCE-HYBRID-6KW',
  'reliance-solar-6kw-hybrid-system'
),

-- Shakti Solar Products
(
  'Shakti Solar 2kW On-Grid System',
  'Affordable 2kW on-grid solar system ideal for small homes. Quality components with excellent performance.',
  'Shakti Solar',
  'Solar Systems',
  'On-Grid',
  125000,
  '/Shakti%20Solar.png',
  '{"system_capacity": "2kW", "inverter_capacity": "2kW", "panel_wattage": "540W", "panel_count": 4, "warranty": "25 years", "efficiency": "20.5%"}'::jsonb,
  true,
  6,
  'SHAKTI-ONGRID-2KW',
  'shakti-solar-2kw-on-grid-system'
),
(
  'Shakti Solar 3kW Hybrid System',
  'Compact 3kW hybrid solar system with battery backup. Great value for money with reliable performance.',
  'Shakti Solar',
  'Solar Systems',
  'Hybrid',
  285000,
  '/Shakti%20Solar.png',
  '{"system_capacity": "3kW", "inverter_capacity": "3kW", "battery_capacity": "3kWh", "panel_wattage": "540W", "panel_count": 6, "warranty": "25 years", "backup_hours": "3-4 hours"}'::jsonb,
  true,
  7,
  'SHAKTI-HYBRID-3KW',
  'shakti-solar-3kw-hybrid-system'
),

-- Individual Components
(
  'Tata 540W Monocrystalline Solar Panel',
  'High-efficiency 540W monocrystalline solar panel with PERC technology. Industry-leading performance and durability.',
  'Tata Power Solar',
  'Solar Panels',
  'Panel',
  15500,
  '/Tata%20Power%20Solar.png',
  '{"wattage": "540W", "efficiency": "21%", "technology": "Monocrystalline PERC", "dimensions": "2278 x 1134 x 35 mm", "weight": "27.5 kg", "warranty": "25 years performance, 12 years product"}'::jsonb,
  true,
  8,
  'TATA-PANEL-540W',
  'tata-540w-monocrystalline-solar-panel'
),
(
  'Reliance 5kW Solar Inverter',
  'Advanced 5kW solar inverter with MPPT technology and WiFi monitoring. Compatible with all major panel brands.',
  'Reliance',
  'Inverters',
  'Inverter',
  65000,
  '/reliance-industries-ltd.png',
  '{"capacity": "5kW", "type": "Hybrid", "mppt_range": "150-850V", "efficiency": "97.5%", "display": "LCD with WiFi", "warranty": "5 years"}'::jsonb,
  true,
  9,
  'RELIANCE-INV-5KW',
  'reliance-5kw-solar-inverter'
),
(
  'Lithium Battery 5kWh',
  'High-capacity 5kWh lithium-ion battery for solar energy storage. Long cycle life and fast charging capability.',
  'Waree',
  'Batteries',
  'Battery',
  185000,
  '/Integrated.png',
  '{"capacity": "5kWh", "voltage": "51.2V", "chemistry": "LiFePO4", "cycle_life": "6000+ cycles", "warranty": "10 years", "depth_of_discharge": "90%"}'::jsonb,
  true,
  10,
  'WAREE-BATTERY-5KWH',
  'lithium-battery-5kwh'
);

-- Verify insertion
SELECT COUNT(*) as total_products FROM products;
