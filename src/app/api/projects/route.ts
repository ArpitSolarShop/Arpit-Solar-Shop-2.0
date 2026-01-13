import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        const { data, error } = await supabaseAdmin
            .from('projects')
            .select('id, title, category, location, cover_image_url')
            .limit(limit)
            .order('created_at', { ascending: false });

        if (error) {
            // Return empty array if table doesn't exist
            if (error.code === 'PGRST116' || error.code === 'PGRST205') {
                return NextResponse.json({ data: [], error: null });
            }
            throw error;
        }

        return NextResponse.json({ data, error: null });

    } catch (error) {
        console.error('Projects API error:', error);
        return NextResponse.json(
            {
                data: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
