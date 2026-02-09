import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import { generateQuoteNumber } from '@/lib/companyDetails';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const supabase = getServerSupabase();
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const { data, error, count } = await supabase
            .from('quotations')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return NextResponse.json({ success: true, data, count });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customer_name,
            customer_phone,
            customer_address,
            customer_email,
            system_type_name, // e.g., "On-grid"
            capacity_kw,
            phase,
            brand,
            base_price,
            gst_rate,
            gst_amount,
            total_amount,
            central_subsidy,
            state_subsidy,
            terms,
            components,
            savings_data,
            salesperson,
            status,
            pdf_url,
        } = body;

        if (!customer_name) {
            return NextResponse.json({ success: false, message: 'Customer name is required' }, { status: 400 });
        }

        // Generate Quote Number
        const initials = customer_name
            .split(' ')
            .map((n: string) => n.charAt(0).toUpperCase())
            .join('')
            .substring(0, 3); // Limit initials
        const quote_number = generateQuoteNumber(initials);

        const supabase = getServerSupabase();

        // Optional: Resolve system_type_id if you want to link strictly
        // For now, we'll store system_type_name directly or as fallback
        let system_type_id = null;
        if (system_type_name) {
            const { data: typeData } = await supabase
                .from('system_types')
                .select('id')
                .eq('name', system_type_name)
                .single();
            if (typeData) system_type_id = typeData.id;
        }

        const { data, error } = await supabase
            .from('quotations')
            .insert([{
                quote_number,
                customer_name,
                customer_phone,
                customer_address,
                customer_email,
                system_type_id,
                system_type_name,
                capacity_kw,
                phase,
                brand,
                base_price,
                gst_rate,
                gst_amount,
                total_amount,
                central_subsidy,
                state_subsidy,
                terms,
                components,
                savings_data,
                salesperson,
                status: status || 'draft',
                pdf_url,
            }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Error creating quotation:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
