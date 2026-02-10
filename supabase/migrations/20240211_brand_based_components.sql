-- Update solar_product_components to use brand-based categories
-- Instead of system types (On-grid, Hybrid, etc.), use product brands (Tata, Shakti, Reliance, Integrated, Hybrid)
-- This allows each brand to have its own component set

-- First, update existing categories to brand names
UPDATE solar_product_components SET category = 'Tata' WHERE category = 'On-grid';
-- Note: Off-grid becomes 'Shakti' as default mapping
UPDATE solar_product_components SET category = 'Shakti' WHERE category = 'Off-grid';
-- Hybrid stays as brand name
-- VFD/Drive stays as-is

-- Now duplicate Tata components for other brands that need On-grid style components

-- Reliance (copy from Tata/On-grid defaults)
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order)
SELECT 'Reliance', name, description, quantity, make, sort_order
FROM solar_product_components WHERE category = 'Tata';

-- Integrated (copy from Tata/On-grid defaults)
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order)
SELECT 'Integrated', name, description, quantity, make, sort_order
FROM solar_product_components WHERE category = 'Tata';

-- Shakti On-grid (the existing Shakti was Off-grid, add On-grid style too)
-- Actually let's make Shakti have proper on-grid components
DELETE FROM solar_product_components WHERE category = 'Shakti';
INSERT INTO solar_product_components (category, name, description, quantity, make, sort_order) VALUES
  ('Shakti', 'Solar Photovoltaic Modules', '580Wp (DCR) Topcon Modules', '6 Nos', 'Waaree/Adani/Premier', 1),
  ('Shakti', 'PCU / Inverter', 'On-Grid String Inverter 3KW', '01 No', 'Shakti', 2),
  ('Shakti', 'DC Distribution Box (DCDB)', 'IP65 CRCA with DP MCB', '01 No', 'Standard', 3),
  ('Shakti', 'AC Distribution Box (ACDB)', 'SPD, Changeover, MCB, Meter', '01 No', 'Standard', 4),
  ('Shakti', 'AC Cable (Main Connection)', 'Copper Multi-strand, 4 Sq mm', '10 Mtrs', 'Standard', 5),
  ('Shakti', 'DC Interconnecting Cables', 'Polycab 4 Sq mm, UV Protected', '40 Mtrs', 'Standard', 6),
  ('Shakti', 'Module Mounting Structure', 'GI 80 Micron, 150kmph Wind Load', '01 Set', 'GI 80 Micron', 7),
  ('Shakti', 'Earthing System', '3 Nos Copper Bonded + Chemical', '03 Sets', 'Standard', 8),
  ('Shakti', 'Lightning Arrestor', 'Conventional Type 1.25" Dia', '01 Set', 'Standard', 9);
