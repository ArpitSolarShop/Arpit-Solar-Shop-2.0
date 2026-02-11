-- Migration: Link solar_products and solar_product_components via a new solar_categories table
-- Created at: 2026-02-10T17:55:00+05:30

-- 1. Create the master categories table
CREATE TABLE IF NOT EXISTS public.solar_categories (
    name text PRIMARY KEY,
    display_name text,
    description text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 2. Seed standard categories
INSERT INTO public.solar_categories (name, display_name, sort_order)
VALUES 
    ('Tata', 'Tata Power Solar', 1),
    ('Shakti', 'Shakti Solar', 2),
    ('Reliance', 'Reliance Solar', 3),
    ('Hybrid', 'Hybrid Systems', 4),
    ('Integrated', 'Integrated Bundle', 5)
ON CONFLICT (name) DO NOTHING;

-- 3. Ensure any other existing categories in products/components are added
INSERT INTO public.solar_categories (name)
SELECT DISTINCT category FROM public.solar_products
WHERE category NOT IN (SELECT name FROM public.solar_categories)
ON CONFLICT DO NOTHING;

INSERT INTO public.solar_categories (name)
SELECT DISTINCT category FROM public.solar_product_components
WHERE category NOT IN (SELECT name FROM public.solar_categories)
ON CONFLICT DO NOTHING;

-- 4. Link Reference: solar_products -> solar_categories
-- First, drop the old hardcoded CHECK constraint if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'solar_products_category_check') THEN 
        ALTER TABLE public.solar_products DROP CONSTRAINT solar_products_category_check; 
    END IF; 
END $$;

-- Add Foreign Key
ALTER TABLE public.solar_products
ADD CONSTRAINT fk_solar_products_category
FOREIGN KEY (category) REFERENCES public.solar_categories (name)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- 5. Link Reference: solar_product_components -> solar_categories
ALTER TABLE public.solar_product_components
ADD CONSTRAINT fk_solar_product_components_category
FOREIGN KEY (category) REFERENCES public.solar_categories (name)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- 6. Grant permissions (if needed for authenticated users)
GRANT SELECT ON public.solar_categories TO authenticated;
GRANT SELECT ON public.solar_categories TO anon;
