-- Create system_types table
CREATE TABLE IF NOT EXISTS public.system_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default system types
INSERT INTO public.system_types (name, description) VALUES
    ('On-grid', 'Grid-connected solar power system'),
    ('Off-grid', 'Standalone solar power system with battery'),
    ('Hybrid', 'Grid-connected system with battery backup'),
    ('VFD/Drive', 'Variable Frequency Drive for solar water pumps')
ON CONFLICT (name) DO NOTHING;

-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_number TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    customer_email TEXT,
    
    system_type_id UUID REFERENCES public.system_types(id),
    system_type_name TEXT, -- Fallback or direct storage
    
    capacity_kw NUMERIC,
    phase INTEGER DEFAULT 1,
    brand TEXT,
    
    -- Pricing
    base_price NUMERIC,
    gst_rate NUMERIC DEFAULT 8.9,
    gst_amount NUMERIC,
    total_amount NUMERIC,
    
    -- Subsidy
    central_subsidy NUMERIC DEFAULT 0,
    state_subsidy NUMERIC DEFAULT 0,
    
    -- JSON Data
    terms JSONB,
    components JSONB,
    savings_data JSONB,
    
    salesperson TEXT,
    status TEXT DEFAULT 'draft',
    pdf_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS Policies (basic for now, allow public read/write for demo/admin)
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.quotations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.quotations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.quotations
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.quotations
    FOR DELETE USING (true);

-- System Types RLS
ALTER TABLE public.system_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.system_types FOR SELECT USING (true);
