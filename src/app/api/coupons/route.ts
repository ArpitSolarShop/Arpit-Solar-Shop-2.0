import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/coupons - Get all coupons
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get('is_active');
        const code = searchParams.get('code');

        let query = supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (isActive !== null) {
            query = query.eq('is_active', isActive === 'true');
        }

        if (code) {
            query = query.eq('code', code.toUpperCase());
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/coupons - Create a new coupon
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Ensure code is uppercase
        if (body.code) {
            body.code = body.code.toUpperCase();
        }

        const { data, error } = await supabase
            .from('coupons')
            .insert([body])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/coupons - Update a coupon
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        // Ensure code is uppercase if being updated
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }

        const { data, error } = await supabase
            .from('coupons')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/coupons - Delete a coupon
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json(
            { message: 'Coupon deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
