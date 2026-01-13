export type SolarQuoteRequest = {
  id?: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  entity_type: "Individual" | "Enterprise" | null;
  solution_classification: string | null;
  monthly_bill: number | null;
  power_demand_kw: number | null;
  project_location: string | null;
  product_name: string | null;
  product_category: string | null;
  mounting_type: string | null;
  referral_name: string | null;
  referral_phone: string | null;
  source: string | null;
  customer_type: string | null;
  created_at?: string;
};

export type ProductSystem = {
  id?: number | string;
  sl_no?: number;
  system_size?: number;
  system_size_kwp?: number;
  phase?: string;
};
