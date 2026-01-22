-- Migration: Create Coupons Table
-- Description: Discount codes and promotional offers

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
    value DECIMAL(10, 2) NOT NULL CHECK (value >= 0),
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER DEFAULT 1,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON coupons(start_date, end_date);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Coupons viewable by everyone" 
    ON coupons FOR SELECT 
    USING (true);

CREATE POLICY "Coupons editable by authenticated users" 
    ON coupons FOR ALL 
    USING (auth.role() = 'authenticated');

-- Trigger
CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to validate coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    order_total DECIMAL,
    customer_email TEXT
)
RETURNS TABLE (
    is_valid BOOLEAN,
    discount_amount DECIMAL,
    message TEXT
) AS $$
DECLARE
    coupon RECORD;
    customer_usage INTEGER;
BEGIN
    -- Get coupon details
    SELECT * INTO coupon FROM coupons WHERE code = coupon_code AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid coupon code';
        RETURN;
    END IF;
    
    -- Check dates
    IF coupon.start_date IS NOT NULL AND NOW() < coupon.start_date THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon not yet active';
        RETURN;
    END IF;
    
    IF coupon.end_date IS NOT NULL AND NOW() > coupon.end_date THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon has expired';
        RETURN;
    END IF;
    
    -- Check usage limit
    IF coupon.usage_limit IS NOT NULL AND coupon.usage_count >= coupon.usage_limit THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon usage limit reached';
        RETURN;
    END IF;
    
    -- Check minimum purchase
    IF coupon.min_purchase IS NOT NULL AND order_total < coupon.min_purchase THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Minimum purchase amount not met';
        RETURN;
    END IF;
    
    -- Calculate discount
    DECLARE
        discount DECIMAL;
    BEGIN
        IF coupon.type = 'percentage' THEN
            discount := order_total * (coupon.value / 100);
            IF coupon.max_discount IS NOT NULL AND discount > coupon.max_discount THEN
                discount := coupon.max_discount;
            END IF;
        ELSIF coupon.type = 'fixed' THEN
            discount := coupon.value;
        ELSE
            discount := 0;
        END IF;
        
        RETURN QUERY SELECT true, discount, 'Coupon applied successfully';
    END;
END;
$$ LANGUAGE plpgsql;
