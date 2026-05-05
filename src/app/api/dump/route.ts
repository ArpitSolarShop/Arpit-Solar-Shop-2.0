import { supabase } from "@/integrations/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
    const { data, error } = await supabase.from('solar_products').select('id, name, price, product_type');
    if (error) return NextResponse.json({ error });
    return NextResponse.json(data);
}
