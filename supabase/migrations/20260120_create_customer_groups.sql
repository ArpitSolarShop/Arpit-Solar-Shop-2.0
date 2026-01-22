-- Migration: Create Customer Groups Table
-- Description: Customer segmentation for pricing and marketing

CREATE TABLE IF NOT EXISTS customer_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Customer groups viewable by everyone" 
    ON customer_groups FOR SELECT 
    USING (true);

CREATE POLICY "Customer groups editable by authenticated users" 
    ON customer_groups FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER update_customer_groups_updated_at 
    BEFORE UPDATE ON customer_groups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default customer groups
INSERT INTO customer_groups (name, description, discount_percentage) VALUES
    ('Residential', 'Individual homeowners', 0),
    ('Commercial', 'Small to medium businesses', 5),
    ('Wholesale', 'Bulk buyers and resellers', 10),
    ('VIP', 'Premium customers', 15)
ON CONFLICT (name) DO NOTHING;
