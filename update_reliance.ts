import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const newData = [
  { sl_no: 1, system_size: 2.84, no_of_modules: 4, inverter_capacity: 3, phase: '1Ph', hdg_elevated_price: 195000 },
  { sl_no: 2, system_size: 3.55, no_of_modules: 5, inverter_capacity: 3.3, phase: '1Ph', hdg_elevated_price: 215000 },
  { sl_no: 3, system_size: 4.97, no_of_modules: 7, inverter_capacity: 5, phase: '1Ph', hdg_elevated_price: 315000 },
  { sl_no: 4, system_size: 4.97, no_of_modules: 7, inverter_capacity: 5, phase: '3Ph', hdg_elevated_price: 345000 },
  { sl_no: 5, system_size: 9.23, no_of_modules: 13, inverter_capacity: 10, phase: '3Ph', hdg_elevated_price: 545000 },
  { sl_no: 6, system_size: 9.94, no_of_modules: 14, inverter_capacity: 10, phase: '3Ph', hdg_elevated_price: 565000 },
];

async function run() {
  console.log("Deleting old reliance grid tie systems data...");
  await supabase.from('reliance_grid_tie_systems').delete().neq('sl_no', -1);
  
  console.log("Inserting new reliance data...");
  const { data, error } = await supabase.from('reliance_grid_tie_systems').insert(newData).select();
  if (error) {
    console.error("Error inserting reliance_grid_tie_systems:", error);
    return;
  }
  console.log("Success inserting reliance_grid_tie_systems:", data.length, "rows.");

  console.log("Deleting old reliance from solar_products (<= 10kW)...");
  await supabase.from('solar_products').delete().eq('brand', 'Reliance').lte('system_size_kw', 10);

  const solarProductsData = newData.map(item => ({
    name: `Reliance ${item.system_size} kW ${item.phase} Solar System`,
    description: `Reliance New Energy Solar Rooftop System ${item.system_size} kW ${item.phase} with ${item.no_of_modules}x 710Wp modules and ${item.inverter_capacity} kW inverter`,
    brand: 'Reliance',
    category: 'Reliance',
    system_size_kw: item.system_size,
    phase: item.phase,
    price: item.hdg_elevated_price,
    is_published: true,
    sort_order: item.sl_no,
    specifications: {
      module_count: item.no_of_modules,
      inverter_kw: item.inverter_capacity,
      price_per_kw: item.hdg_elevated_price / (item.system_size * 1000),
      structure_prices: {
        hdg_elevated: item.hdg_elevated_price
      },
      module_watt: 710,
      module_type: 'HJT'
    }
  }));

  console.log("Inserting into solar_products...");
  const { data: spData, error: spError } = await supabase.from('solar_products').insert(solarProductsData).select();
  if (spError) {
    console.error("Error inserting solar_products:", spError);
  } else {
    console.log("Success inserting solar_products:", spData.length, "rows.");
  }
}

run();
