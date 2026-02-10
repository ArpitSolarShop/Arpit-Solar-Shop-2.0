-- Solar Product Components Table
-- Each category (On-grid, Off-grid, Hybrid, VFD/Drive) has its own set of components
-- These components are used in quotation PDFs

CREATE TABLE IF NOT EXISTS solar_product_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,           -- 'On-grid', 'Hybrid', 'Off-grid', 'VFD/Drive'
  name TEXT NOT NULL,               -- e.g. 'Solar Photovoltaic Modules'
  description TEXT,                 -- e.g. '580Wp (DCR) Topcon Modules'
  quantity TEXT,                    -- e.g. '6 Nos'
  make TEXT,                        -- e.g. 'Waaree/Adani/Premier'
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE solar_product_components ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON solar_product_components FOR SELECT USING (true);
-- Allow authenticated insert/update/delete
CREATE POLICY "Allow all for service role" ON solar_product_components FOR ALL USING (true);

-- Seed data: On-grid components
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order) VALUES
  ('On-grid', 'Solar Photovoltaic Modules', '580Wp (DCR) Topcon Modules', '6 Nos', 'Waaree/Adani/Premier', 1),
  ('On-grid', 'PCU / Inverter', 'On-Grid String Inverter 3KW', '01 No', 'Polycab/Shakti', 2),
  ('On-grid', 'DC Distribution Box (DCDB)', 'IP65 CRCA with DP MCB', '01 No', 'Standard', 3),
  ('On-grid', 'AC Distribution Box (ACDB)', 'SPD, Changeover, MCB, Meter', '01 No', 'Standard', 4),
  ('On-grid', 'AC Cable (Main Connection)', 'Copper Multi-strand, 4 Sq mm', '10 Mtrs', 'Standard', 5),
  ('On-grid', 'DC Interconnecting Cables', 'Polycab 4 Sq mm, UV Protected', '40 Mtrs', 'Standard', 6),
  ('On-grid', 'Module Mounting Structure', 'GI 80 Micron, 150kmph Wind Load', '01 Set', 'GI 80 Micron', 7),
  ('On-grid', 'Earthing System', '3 Nos Copper Bonded + Chemical', '03 Sets', 'Standard', 8),
  ('On-grid', 'Lightning Arrestor', 'Conventional Type 1.25" Dia', '01 Set', 'Standard', 9);

-- Seed data: Off-grid components
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order) VALUES
  ('Off-grid', 'Solar Photovoltaic Modules', 'PV Modules', '4 Nos', 'Waaree/Adani', 1),
  ('Off-grid', 'Off-Grid Inverter', 'PWM/MPPT Inverter', '01 No', 'Standard', 2),
  ('Off-grid', 'Battery Bank', 'Tubular/SMF Battery', '04 Nos', 'Exide/Luminous', 3),
  ('Off-grid', 'Charge Controller', 'MPPT/PWM Controller', '01 No', 'Standard', 4),
  ('Off-grid', 'DC Cables', 'PVC Insulated, UV Protected', '30 Mtrs', 'Standard', 5),
  ('Off-grid', 'Module Mounting Structure', 'GI 80 Micron', '01 Set', 'GI 80 Micron', 6),
  ('Off-grid', 'Earthing System', 'Copper Bonded + Chemical', '02 Sets', 'Standard', 7);

-- Seed data: Hybrid components
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order) VALUES
  ('Hybrid', 'Solar Photovoltaic Modules', '580Wp (NDCR) PV Modules', '9 Nos', 'Waaree/Adani/Premier', 1),
  ('Hybrid', 'PCU / Inverter', 'Hybrid Inverter 3.6KW', '01 No', 'Servotech', 2),
  ('Hybrid', 'Lithium Ion Battery', '12.8V 100Ah 2000 Cycle', '02 Nos', 'Servotech', 3),
  ('Hybrid', 'BMS', 'Battery Management System', '01 No', 'Standard', 4),
  ('Hybrid', 'AC Cable', 'Copper, 6Sq mm', 'As per actual', 'Standard', 5),
  ('Hybrid', 'DC Interconnecting Cables', '4 Sq mm, UV Protected', '150 Mtrs', 'Standard', 6),
  ('Hybrid', 'Module Mounting Structure', 'MMS in pre GI sheet', '01 Set', 'GI 80 Micron', 7),
  ('Hybrid', 'Earthing System', 'Copper Bonded + Chemical', '03 Sets', 'Standard', 8),
  ('Hybrid', 'Lightning Arrestor', 'Conventional Type 1.25" Dia', '01 Set', 'Standard', 9);

-- Seed data: VFD/Drive components
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order) VALUES
  ('VFD/Drive', 'Solar Photovoltaic Modules', '600Wp (NDCR) Pv Modules', '48 NOS', 'Waaree / Adani Solar / Premier', 1),
  ('VFD/Drive', 'VFD Drive', '25HP VFD', '1 NOS', 'INVT / Crompton', 2),
  ('VFD/Drive', 'AC Cable', 'Copper, 6Sq mm', 'As per actual', 'Standard', 3),
  ('VFD/Drive', 'DC Interconnecting Cables', '1C x 4 sqmm 1.1kV, PVC insulated, UV Protected unarmored Cu Cable', '150 Mtrs', 'Standard', 4),
  ('VFD/Drive', 'Module Mounting Structure', 'MMS in pre GI sheet', '1 Set', 'GI 80 Micron', 5),
  ('VFD/Drive', 'Earthing System', '10 sqmm AL Solid Cable + Chemical earthing + 3nos copper bonded rod', 'As per actual', 'Standard', 6),
  ('VFD/Drive', 'Lightning Arrestor', 'Conventional Type 1.25" Dia.', '1 Set', 'Standard', 7);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_solar_product_components_category ON solar_product_components(category);
