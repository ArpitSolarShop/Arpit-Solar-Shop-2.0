-- Migration: Create Product Attributes Table
-- Description: Custom product attributes for variants and specifications

CREATE TABLE IF NOT EXISTS product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'number', 'select', 'multiselect', 'boolean')),
    options JSONB DEFAULT '[]', -- For select/multiselect types
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attributes_code ON product_attributes(code);
CREATE INDEX IF NOT EXISTS idx_attributes_filterable ON product_attributes(is_filterable);

-- Enable RLS
ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Attributes are viewable by everyone" 
    ON product_attributes FOR SELECT 
    USING (true);

CREATE POLICY "Attributes are editable by authenticated users" 
    ON product_attributes FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER update_product_attributes_updated_at 
    BEFORE UPDATE ON product_attributes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert common solar product attributes
INSERT INTO product_attributes (name, code, type, options, is_filterable) VALUES
    ('Wattage', 'wattage', 'select', '["100W", "150W", "200W", "250W", "300W", "350W", "400W", "450W", "500W", "540W"]'::jsonb, true),
    ('Panel Type', 'panel_type', 'select', '["Monocrystalline", "Polycrystalline", "Thin Film", "Bifacial"]'::jsonb, true),
    ('Efficiency', 'efficiency', 'text', '[]'::jsonb, true),
    ('Warranty Years', 'warranty_years', 'select', '["10", "15", "20", "25", "30"]'::jsonb, true),
    ('System Type', 'system_type', 'select', '["On-Grid", "Off-Grid", "Hybrid"]'::jsonb, true),
    ('Phase', 'phase', 'select', '["Single Phase", "Three Phase"]'::jsonb, true),
    ('Capacity', 'capacity', 'select', '["1kW", "2kW", "3kW", "5kW", "7kW", "10kW", "15kW", "20kW"]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;
