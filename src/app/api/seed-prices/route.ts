import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * POST /api/seed-prices
 * 
 * Updates the solar_products table with the latest On-Grid and Integrated pricing data.
 * This replaces old entries for categories: Tata, Integrated
 * and inserts fresh rows with current prices.
 *
 * Pass ?dry=true to preview changes without writing.
 */

// ──────────────────────────────────────────────
// Tata Power Solar Rooftop DCR — On-Grid SPS
// ──────────────────────────────────────────────
const TATA_ONGRID = [
  { kw: 2,  phase: '1Ph', price: 145000, inverter_kw: 2,  module_wp: 590, modules: 4,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 90000,  effective_cost: 55000  },
  { kw: 4,  phase: '1Ph', price: 195000, inverter_kw: 3,  module_wp: 590, modules: 6,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 87000  },
  { kw: 5,  phase: '1Ph', price: 255000, inverter_kw: 4,  module_wp: 590, modules: 8,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 147000 },
  { kw: 5,  phase: '1Ph', price: 295000, inverter_kw: 5,  module_wp: 590, modules: 9,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 187000 },
  { kw: 6,  phase: '1Ph', price: 310000, inverter_kw: 5,  module_wp: 590, modules: 10, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 202000 },
  { kw: 5,  phase: '3Ph', price: 325000, inverter_kw: 5,  module_wp: 590, modules: 9,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 217000 },
  { kw: 6,  phase: '3Ph', price: 375500, inverter_kw: 6,  module_wp: 590, modules: 11, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 267500 },
  { kw: 9,  phase: '3Ph', price: 480000, inverter_kw: 8,  module_wp: 590, modules: 15, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 372000 },
  { kw: 11, phase: '3Ph', price: 551000, inverter_kw: 10, module_wp: 590, modules: 18, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 443000 },
];

// ──────────────────────────────────────────────────────
// Waaree/Adani/Premier/Emmvee/Shakti — On-Grid SPS
// ──────────────────────────────────────────────────────
const GENERIC_ONGRID = [
  { kw: 2,  phase: '1Ph', price: 135000, inverter_kw: 2,  module_wp: 535, modules: 4,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 90000,  effective_cost: 45000  },
  { kw: 3,  phase: '1Ph', price: 185000, inverter_kw: 3,  module_wp: 535, modules: 6,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 77000  },
  { kw: 4,  phase: '1Ph', price: 245000, inverter_kw: 4,  module_wp: 535, modules: 8,  acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 137000 },
  { kw: 5,  phase: '1Ph', price: 285000, inverter_kw: 5,  module_wp: 535, modules: 10, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 177000 },
  { kw: 6,  phase: '3Ph', price: 362000, inverter_kw: 6,  module_wp: 535, modules: 12, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 254000 },
  { kw: 8,  phase: '3Ph', price: 445000, inverter_kw: 8,  module_wp: 535, modules: 15, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 337000 },
  { kw: 10, phase: '3Ph', price: 540000, inverter_kw: 10, module_wp: 535, modules: 19, acdb: 1, dcdb: 1, earthing_rod: 3, earthing_chemical: 3, ac_wire: 10, dc_wire: 20, earthing_wire: 90, lightning_arrestor: 1, subsidy: 108000, effective_cost: 432000 },
];

const INTEGRATED_BRANDS = ['Waaree', 'Adani', 'Premier'];

function buildTataRows() {
  return TATA_ONGRID.map((item, idx) => ({
    name: `Tata Power Solar ${item.kw} kW ${item.phase} On-Grid DCR`,
    description: `Tata Power Solar Rooftop DCR ${item.kw} kW ${item.phase} On-Grid Solar System with ${item.modules}x ${item.module_wp}Wp modules and ${item.inverter_kw} kW inverter`,
    brand: 'Tata',
    category: 'Tata',
    system_size_kw: item.kw,
    phase: item.phase,
    price: item.price,
    is_published: true,
    sort_order: idx + 1,
    specifications: {
      brand: 'Tata Power Solar',
      product_type: 'Grid-Tie System',
      gst_rate: 8.9,
      price_includes_gst: true,
      inverter_capacity_kw: item.inverter_kw,
      module_watt: item.module_wp,
      module_type: 'DCR',
      no_of_modules: item.modules,
      module_count: item.modules,
      subsidy: item.subsidy,
      effective_cost: item.effective_cost,
      component_qtys: {
        acdb: item.acdb,
        dcdb: item.dcdb,
        earthing_rod: item.earthing_rod,
        earthing_chemical: item.earthing_chemical,
        ac_wire_mtr: item.ac_wire,
        dc_wire_mtr: item.dc_wire,
        earthing_wire_mtr: item.earthing_wire,
        lightning_arrester: item.lightning_arrestor,
      },
      wire_brands: {
        ac: 'Polycab',
        dc: 'Polycab',
        earthing: 'AL Wire',
      },
    },
  }));
}

function buildIntegratedRows() {
  const rows: any[] = [];
  let sortOrder = 1;

  for (const brand of INTEGRATED_BRANDS) {
    for (const item of GENERIC_ONGRID) {
      rows.push({
        name: `${brand} ${item.kw} kW ${item.phase} Integrated Solar`,
        description: `${brand} ${item.kw} kW ${item.phase} Integrated Solar System with ${item.modules}x ${item.module_wp}Wp TOPCON modules and ${item.inverter_kw} kW inverter`,
        brand,
        category: 'Integrated',
        system_size_kw: item.kw,
        phase: item.phase,
        price: item.price,
        is_published: true,
        sort_order: sortOrder++,
        specifications: {
          brand,
          product_type: 'Grid-Tie System',
          gst_rate: 8.9,
          price_includes_gst: true,
          inverter_capacity_kw: item.inverter_kw,
          module_watt: item.module_wp,
          module_type: 'TOPCON',
          no_of_modules: item.modules,
          module_count: item.modules,
          subsidy: item.subsidy,
          effective_cost: item.effective_cost,
          component_qtys: {
            acdb: item.acdb,
            dcdb: item.dcdb,
            earthing_rod: item.earthing_rod,
            earthing_chemical: item.earthing_chemical,
            ac_wire_mtr: item.ac_wire,
            dc_wire_mtr: item.dc_wire,
            earthing_wire_mtr: item.earthing_wire,
            lightning_arrester: item.lightning_arrestor,
          },
          wire_brands: {
            ac: 'Polycab',
            dc: 'Polycab',
            earthing: 'AL Wire',
          },
        },
      });
    }
  }

  return rows;
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const isDry = url.searchParams.get('dry') === 'true';

    // Must use service role key to bypass RLS!
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase service_role environment variables' },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, supabaseKey);

    const tataRows = buildTataRows();
    const integratedRows = buildIntegratedRows();

    if (isDry) {
      return NextResponse.json({
        message: 'Dry run — no changes made',
        tata: { count: tataRows.length, rows: tataRows },
        integrated: { count: integratedRows.length, rows: integratedRows },
      });
    }

    const results: any = { tata: {}, integrated: {} };

    // ── Step 1: Delete old Tata products ──
    const { error: delTataErr, count: delTataCount } = await adminSupabase
      .from('solar_products')
      .delete()
      .eq('category', 'Tata');

    results.tata.deleted = { count: delTataCount, error: delTataErr?.message };

    // ── Step 2: Insert new Tata products ──
    const { data: insTata, error: insTataErr } = await adminSupabase
      .from('solar_products')
      .insert(tataRows)
      .select('id, name, system_size_kw, price');

    results.tata.inserted = {
      count: insTata?.length ?? 0,
      error: insTataErr?.message,
      rows: insTata,
    };

    // ── Step 3: Delete old Integrated products ──
    const { error: delIntErr, count: delIntCount } = await adminSupabase
      .from('solar_products')
      .delete()
      .eq('category', 'Integrated');

    results.integrated.deleted = { count: delIntCount, error: delIntErr?.message };

    // ── Step 4: Insert new Integrated products ──
    const { data: insInt, error: insIntErr } = await adminSupabase
      .from('solar_products')
      .insert(integratedRows)
      .select('id, name, system_size_kw, price');

    results.integrated.inserted = {
      count: insInt?.length ?? 0,
      error: insIntErr?.message,
      rows: insInt,
    };

    const hasErrors = [delTataErr, insTataErr, delIntErr, insIntErr].some(Boolean);

    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors
        ? 'Completed with errors — check individual results'
        : `Successfully updated: ${tataRows.length} Tata + ${integratedRows.length} Integrated products`,
      results,
    }, { status: hasErrors ? 207 : 200 });

  } catch (err: any) {
    console.error('seed-prices error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler to preview what would be seeded
export async function GET() {
  const tataRows = buildTataRows();
  const integratedRows = buildIntegratedRows();

  return NextResponse.json({
    message: 'Preview of data to be seeded. Use POST to execute.',
    tata: { count: tataRows.length, sample: tataRows[0] },
    integrated: { count: integratedRows.length, sample: integratedRows[0] },
    total: tataRows.length + integratedRows.length,
  });
}
