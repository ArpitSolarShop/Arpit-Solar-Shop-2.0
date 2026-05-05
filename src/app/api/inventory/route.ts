import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/inventory - Get inventory transactions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');
        const type = searchParams.get('type');

        let query = supabase
            .from('inventory_transactions')
            .select('*, products(name, sku)')
            .order('created_at', { ascending: false });

        if (productId) {
            query = query.eq('product_id', productId);
        }

        if (type) {
            query = query.eq('type', type);
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

// POST /api/inventory - Create inventory transaction
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { product_id, quantity, type, notes } = body;

        if (!product_id || quantity === undefined) {
            return NextResponse.json(
                { error: 'Product ID and quantity are required' },
                { status: 400 }
            );
        }

        // Get current product stock
        const { data: product, error: productError } = await supabase
            .from('solar_products')
            .select('stock_quantity')
            .eq('id', product_id)
            .single();

        if (productError) throw productError;

        const previousQuantity = product.stock_quantity || 0;
        let newQuantity = previousQuantity;

        // Calculate new quantity based on transaction type
        switch (type) {
            case 'restock':
            case 'return':
                newQuantity = previousQuantity + quantity;
                break;
            case 'sale':
            case 'damage':
                newQuantity = previousQuantity - quantity;
                break;
            case 'adjustment':
                newQuantity = quantity; // Direct set
                break;
            default:
                newQuantity = previousQuantity + quantity;
        }

        // Create transaction record
        const { data, error } = await supabase
            .from('inventory_transactions')
            .insert([{
                product_id,
                type: type || 'adjustment',
                quantity,
                previous_quantity: previousQuantity,
                new_quantity: newQuantity,
                notes,
            }])
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
