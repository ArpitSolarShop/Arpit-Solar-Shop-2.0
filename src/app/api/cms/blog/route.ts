import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

// GET /api/cms/blog - Get all blog posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const tag = searchParams.get('tag');
        const slug = searchParams.get('slug');

        let query: any = supabase
            .from('blog_posts')
            .select('*');

        // Order by created_at desc ONLY if we are fetching a list (no slug)
        if (!slug) {
            query = query.order('created_at', { ascending: false });
        }

        // Apply filters BEFORE calling .single()
        if (status) {
            query = query.eq('status', status);
        }

        if (tag) {
            query = query.contains('tags', [tag]);
        }

        // Call .single() LAST if fetching by slug
        if (slug) {
            query = query.eq('slug', slug).single();
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

// POST /api/cms/blog - Create a new blog post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { data, error } = await supabase
            .from('blog_posts')
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

// PUT /api/cms/blog - Update a blog post
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Blog post ID is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('blog_posts')
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

// DELETE /api/cms/blog - Delete a blog post
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Blog post ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json(
            { message: 'Blog post deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
