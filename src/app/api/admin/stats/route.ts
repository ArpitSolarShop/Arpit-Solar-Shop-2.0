import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: Request) {
    try {
        // Fetch products
        const { data: products, error: productsError } = await supabase
            .from('solar_products')
            .select('price, is_published, stock_quantity');

        if (productsError) {
            console.error('Products fetch error:', productsError);
            // Continue with empty array if error
        }

        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, status');

        if (ordersError) {
            console.error('Orders fetch error:', ordersError);
            // Continue with empty array if error
        }

        const total = products?.length || 0;
        const published = products?.filter(p => p.is_published).length || 0;
        const totalValue = products?.reduce((sum, p) => sum + ((p.price || 0) * (p.stock_quantity || 0)), 0) || 0;

        // Order stats
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

        return NextResponse.json({
            totalProducts: total,
            publishedProducts: published,
            totalValue,
            totalOrders,
            totalRevenue,
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch stats',
                totalProducts: 0,
                publishedProducts: 0,
                totalValue: 0,
                totalOrders: 0,
                totalRevenue: 0,
            },
            { status: 500 }
        );
    }
}
