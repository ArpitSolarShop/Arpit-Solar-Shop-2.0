-- Migration: Create Solar Feedbacks Table
-- Description: Stores customer installation feedback and ratings for Arpit Solar Shop / Krushnanuja Renewables Pvt Ltd

CREATE TABLE IF NOT EXISTS solar_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer & Installation Details
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    submission_date DATE DEFAULT CURRENT_DATE,
    solar_capacity TEXT,                -- e.g. "3 kW"
    location TEXT,                      -- e.g. "शिवपुर, वाराणसी"
    
    -- 7 Installation Stages Ratings (1 to 5)
    rating_stage_1 INTEGER CHECK (rating_stage_1 >= 1 AND rating_stage_1 <= 5), -- चरण 1: प्रारंभिक परामर्श और साइट सर्वे
    rating_stage_2 INTEGER CHECK (rating_stage_2 >= 1 AND rating_stage_2 <= 5), -- चरण 2: प्रस्ताव, डिजाइन और सिस्टम विवरण
    rating_stage_3 INTEGER CHECK (rating_stage_3 >= 1 AND rating_stage_3 <= 5), -- चरण 3: टीम का पेशेवर व्यवहार और समय पर इंस्टॉलेशन
    rating_stage_4 INTEGER CHECK (rating_stage_4 >= 1 AND rating_stage_4 <= 5), -- चरण 4: नेट मीटरिंग और सरकारी सब्सिडी (PM Surya Ghar) प्रक्रिया
    rating_stage_5 INTEGER CHECK (rating_stage_5 >= 1 AND rating_stage_5 <= 5), -- चरण 5: इंस्टॉलेशन के बाद साइट की सफाई और हैंडओवर
    rating_stage_6 INTEGER CHECK (rating_stage_6 >= 1 AND rating_stage_6 <= 5), -- चरण 6: सिस्टम का प्रदर्शन और बिजली उत्पादन
    rating_stage_7 INTEGER CHECK (rating_stage_7 >= 1 AND rating_stage_7 <= 5), -- चरण 7: कुल मिलाकर संतुष्टि (Overall Satisfaction)
    rating_stage_8 INTEGER CHECK (rating_stage_8 >= 1 AND rating_stage_8 <= 5), -- चरण 8: दोस्तों और परिवार को सिफारिश (Recommendation)
    rating_recommendation INTEGER CHECK (rating_recommendation >= 1 AND rating_recommendation <= 5),
    
    -- Summary Metrics
    average_rating NUMERIC(3, 2),
    comments TEXT,                      -- अतिरिक्त सुझाव या टिप्पणियां
    customer_signature TEXT,            -- ग्राहक हस्ताक्षर / डिजिटल पुष्टि
    google_review_clicked BOOLEAN DEFAULT false,
    
    -- Tracking & Metadata
    source TEXT DEFAULT 'feedback-form',
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_solar_feedbacks_mobile ON solar_feedbacks(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_solar_feedbacks_created_at ON solar_feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_solar_feedbacks_avg_rating ON solar_feedbacks(average_rating);

-- Enable RLS
ALTER TABLE solar_feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow public/anonymous inserts (for customers submitting feedback)
CREATE POLICY "Solar feedbacks insertable by anyone" 
    ON solar_feedbacks FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to view all feedbacks
CREATE POLICY "Solar feedbacks viewable by authenticated users" 
    ON solar_feedbacks FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Allow authenticated users full access
CREATE POLICY "Solar feedbacks manageable by authenticated users" 
    ON solar_feedbacks FOR ALL 
    USING (auth.role() = 'authenticated');

-- Grants for Supabase API roles
GRANT ALL ON TABLE solar_feedbacks TO anon, authenticated, service_role;
