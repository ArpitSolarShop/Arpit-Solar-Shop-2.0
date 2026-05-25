-- Migration: Create Solar Quote Requests Table
-- Description: Stores lead submissions from quote calculators and forms

CREATE TABLE IF NOT EXISTS solar_quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    phone TEXT,
    email TEXT,
    source TEXT,
    customer_type TEXT DEFAULT 'residential',
    project_location TEXT,
    remarks TEXT,
    message TEXT,
    city TEXT,
    state TEXT,
    pin_code TEXT,
    referral_phone TEXT,
    mounting_type TEXT,
    product_category TEXT,
    power_demand_kw TEXT,
    monthly_bill TEXT,
    load_required TEXT,
    battery_backup TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for phone/email
CREATE INDEX IF NOT EXISTS idx_solar_quote_requests_phone ON solar_quote_requests(phone);
CREATE INDEX IF NOT EXISTS idx_solar_quote_requests_created_at ON solar_quote_requests(created_at DESC);

-- Enable RLS
ALTER TABLE solar_quote_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Quote requests viewable by authenticated users" 
    ON solar_quote_requests FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Quote requests insertable by public/anonymous users" 
    ON solar_quote_requests FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Quote requests editable by authenticated users" 
    ON solar_quote_requests FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_solar_quote_requests_updated_at 
    BEFORE UPDATE ON solar_quote_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
