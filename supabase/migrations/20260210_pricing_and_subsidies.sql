
-- 1. Add pricing configuration to solar_products (Idempotent)
ALTER TABLE "public"."solar_products" 
ADD COLUMN IF NOT EXISTS "price_includes_gst" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "gst_rate" NUMERIC DEFAULT 8.9;

-- 2. Create solar_subsidies table (Refined Schema)
-- If table exists, we drop it to ensure schema change (since it's a dev migration)
DROP TABLE IF EXISTS "public"."solar_subsidies";

CREATE TABLE "public"."solar_subsidies" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scheme_type" TEXT NOT NULL, -- 'Central' or 'State'
    "state" TEXT,                -- e.g. 'UP', NULL for Central
    "calculation_type" TEXT NOT NULL, -- 'per_kw', 'flat', 'capped_per_kw', 'tiered_surya_ghar'
    "amount_per_kw" NUMERIC DEFAULT 0,
    "flat_amount" NUMERIC DEFAULT 0,
    "max_cap" NUMERIC DEFAULT 0,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ DEFAULT now()
);

-- 3. Seed Verified Subsidies using Calculation Strategies

-- PM Surya Ghar (Tiered)
INSERT INTO "public"."solar_subsidies" 
("name", "scheme_type", "state", "calculation_type", "description") 
VALUES
('PM Surya Ghar Muft Bijli Yojana', 'Central', NULL, 'tiered_surya_ghar', 'Central Subsidy: 30k/kW (0-2kW) + 18k/kW (2-3kW), capped at 78k');

-- State Subsidy (UP) (Capped per kW)
INSERT INTO "public"."solar_subsidies" 
("name", "scheme_type", "state", "calculation_type", "amount_per_kw", "max_cap", "description") 
VALUES
('UP State Subsidy', 'State', 'Uttar Pradesh', 'capped_per_kw', 15000, 30000, '₹15,000 per kW, capped at ₹30,000');
