-- Migration to Consolidated Solar Products Table

-- 1. Create the Unified Product Table
CREATE TABLE IF NOT EXISTS solar_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Tata', 'Shakti', 'Reliance', 'Hybrid', 'Integrated')),
    system_size_kw NUMERIC NOT NULL,
    price NUMERIC NOT NULL,     -- Base/Standard price. Variants in specs.
    phase VARCHAR(20) DEFAULT '1Ph',
    
    -- Common Specs (JSONB for flexibility)
    specifications JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_products_category ON solar_products(category);
CREATE INDEX IF NOT EXISTS idx_products_size ON solar_products(system_size_kw);

-- 2. Migrate Data from Existing Tables

-- A. Tata Power Solar
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Tata',
    system_size,
    total_price,
    phase,
    jsonb_strip_nulls(jsonb_build_object(
        'module_count', no_of_modules,
        'price_per_kw', price_per_kwp,
        'inverter_kw', inverter_capacity,
        'sl_no', sl_no,
        'acdb_kit', acdb_kit,
        'dcdb_kit', dcdb_kit,
        'ac_cable', ac_cable,
        'dc_cable', dc_cable,
        'structure', module_structure,
        'earthing_rod', earthing_rod,
        'earthing_chemical', earthing_chemical,
        'earthing_wire', earthing_wire,
        'lighting_arrestor', lighting_arrestor
    ))
FROM tata_grid_tie_systems;

-- B. Shakti Solar
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Shakti',
    system_size,
    pre_gi_elevated_price,
    phase,
    jsonb_build_object(
        'module_count', no_of_modules,
        'inverter_kw', inverter_capacity,
        'price_per_kw', pre_gi_elevated_with_gst,
        'sl_no', sl_no
    )
FROM shakti_grid_tie_systems;

-- C. Hybrid Solar Pricing
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Hybrid',
    capacity_kw,
    price_inr,
    phase,
    jsonb_strip_nulls(jsonb_build_object(
        'battery_kwh', battery_kwh,
        'inverter_kw', inverter_kwp,
        'technology', technology,
        'variant', variant,
        'module_watt', module_watt,
        'module_count', module_count,
        'structure_type', structure_type,
        'category_type', category, -- DCR/Non-DCR
        'component_qtys', jsonb_build_object(
            'acdb', acdb_qty,
            'dcdb', dcdb_qty,
            'earthing_rod', earthing_rod_qty,
            'earthing_chemical', earthing_chemical_qty,
            'lightning_arrester', lightning_arrester_qty,
            'ac_wire_mtr', ac_wire_mtr,
            'dc_wire_mtr', dc_wire_mtr,
            'earthing_wire_mtr', earthing_wire_mtr
        )
    ))
FROM hybrid_solar_pricing;

-- D. Integrated Products
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Integrated',
    system_kw,
    price,
    phase,
    jsonb_strip_nulls(jsonb_build_object(
        'brand', brand,
        'module_type', module_type,
        'module_watt', module_watt,
        'module_count', no_of_modules,
        'inverter_kw', inverter_capacity_kw,
        'inverter_brand', 'Inverter', 
        'component_qtys', jsonb_build_object(
            'acdb', acdb_nos,
            'dcdb', dcdb_nos,
            'earthing_rod', earthing_rod_nos,
            'earthing_chemical', earthing_chemical_nos,
            'lightning_arrester', lighting_arrestor_qty,
            'ac_wire_mtr', ac_wire_length_mtr,
            'dc_wire_mtr', dc_wire_length_mtr,
            'earthing_wire_mtr', earthing_wire_length_mtr
        ),
        'wire_brands', jsonb_build_object(
            'ac', ac_wire_brand,
            'dc', dc_wire_brand,
            'earthing', earthing_wire_brand
        )
    ))
FROM integrated_products;

-- E. Reliance (Small Systems <= 13.8 kW)
-- Fixed: Removed non-existent 'total_price' column
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Reliance',
    system_size,
    hdg_elevated_price, 
    CASE WHEN system_size > 5 THEN '3Ph' ELSE '1Ph' END, 
    jsonb_build_object(
        'module_count', no_of_modules,
        'inverter_kw', inverter_capacity,
        'price_per_kw', price_per_watt,
        'structure_prices', jsonb_build_object(
             'hdg_elevated', hdg_elevated_price
        )
    )
FROM reliance_grid_tie_systems;

-- F. Reliance (Large Systems > 13.8 kW)
INSERT INTO solar_products (category, system_size_kw, price, phase, specifications)
SELECT 
    'Reliance',
    system_size_kw,
    hdg_elevated_rcc_price, -- Default standard
    '3Ph',
    jsonb_build_object(
         'module_count', no_of_modules,
         'inverter_kw', inverter_capacity,
        'structure_prices', jsonb_build_object(
            'tin_shed', short_rail_tin_shed_price,
            'rcc_elevated', hdg_elevated_rcc_price,
            'pre_gi_mms', pre_gi_mms_price,
            'without_mms', price_without_mms_price
        )
    )
FROM reliance_large_systems;
