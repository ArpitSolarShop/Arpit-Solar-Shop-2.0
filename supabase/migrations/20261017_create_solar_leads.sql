-- Migration: Create Solar Leads Table
-- Description: Stores lead capture form submissions for Arpit Solar Shop

CREATE TABLE IF NOT EXISTS solar_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic info
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    area TEXT,
    
    -- Solar details
    property_type TEXT,                -- आवासीय, दुकान/कमर्शियल, फैक्ट्री, अन्य
    installation_location TEXT,        -- अपना मकान, साझा छत वाला मकान, दुकान/बिज़नेस, अन्य
    property_ownership TEXT,           -- अपनी, परिवार की, किराये पर
    monthly_bill TEXT,                 -- ₹2,000 से कम, ₹2,000–₹5,000, ₹5,000–₹10,000, ₹10,000 से ज़्यादा
    roof_available TEXT,               -- हाँ, साझा छत, अभी पता नहीं, नहीं
    installation_timeline TEXT,        -- जल्द से जल्द, अगले 1 महीने में, अगले 1–3 महीने, अभी सिर्फ जानकारी
    consent_given BOOLEAN DEFAULT false,
    
    -- Tracking
    source TEXT DEFAULT 'lead-form',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_solar_leads_mobile ON solar_leads(mobile);
CREATE INDEX IF NOT EXISTS idx_solar_leads_created_at ON solar_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_solar_leads_area ON solar_leads(area);

-- Enable RLS
ALTER TABLE solar_leads ENABLE ROW LEVEL SECURITY;

-- Allow public/anonymous inserts (for the form)
CREATE POLICY "Solar leads insertable by anyone" 
    ON solar_leads FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to view all leads
CREATE POLICY "Solar leads viewable by authenticated users" 
    ON solar_leads FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Allow authenticated users full access
CREATE POLICY "Solar leads manageable by authenticated users" 
    ON solar_leads FOR ALL 
    USING (auth.role() = 'authenticated');

-- Auto-update updated_at trigger (reuse function if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_solar_leads_updated_at 
    BEFORE UPDATE ON solar_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant table-level permissions for Supabase roles
GRANT INSERT, SELECT ON solar_leads TO anon;
GRANT ALL ON solar_leads TO authenticated;
GRANT ALL ON solar_leads TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
