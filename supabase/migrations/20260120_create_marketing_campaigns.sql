-- Migration: Create Marketing Campaigns Table
-- Description: Email/SMS marketing campaigns

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
    subject TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing_campaigns(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON marketing_campaigns(scheduled_at);

-- Enable RLS
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Campaigns viewable by authenticated users" 
    ON marketing_campaigns FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Campaigns editable by authenticated users" 
    ON marketing_campaigns FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER update_marketing_campaigns_updated_at 
    BEFORE UPDATE ON marketing_campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
