export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hybrid_solar_pricing: {
        Row: {
          id: number
          category: 'DCR' | 'NON_DCR'
          variant: 'WITH_BATTERY' | 'WOBB'
          capacity_kw: number
          phase: string
          price_inr: number
          inverter_kwp: number
          battery_kwh: number | null
          module_watt: number
          module_count: number
          structure_type: string | null
          acdb_qty: number | null
          dcdb_qty: number | null
          earthing_rod_qty: number | null
          earthing_chemical_qty: number | null
          lightning_arrester_qty: number | null
          ac_wire_mtr: number | null
          dc_wire_mtr: number | null
          earthing_wire_mtr: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
    }
  }
}
