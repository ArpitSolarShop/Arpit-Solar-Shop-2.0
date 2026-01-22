-- Migration: Create Brands Table
-- Description: Product brand/manufacturer management

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Brands are viewable by everyone" 
    ON brands FOR SELECT 
    USING (true);

CREATE POLICY "Brands are editable by authenticated users" 
    ON brands FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE TRIGGER update_brands_updated_at 
    BEFORE UPDATE ON brands 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default brands for solar products
INSERT INTO brands (name, slug, description, is_active) VALUES
    ('Tata Power Solar', 'tata-power-solar', 'Leading solar panel manufacturer in India', true),
    ('Reliance Solar', 'reliance-solar', 'Reliance Industries solar division', true),
    ('Shakti Solar', 'shakti-solar', 'Premium solar solutions provider', true),
    ('Adani Solar', 'adani-solar', 'Adani Group solar manufacturing', true),
    ('Vikram Solar', 'vikram-solar', 'Indian solar panel manufacturer', true)
ON CONFLICT (slug) DO NOTHING;
