import { supabase } from '@/lib/server/services/supabase';

export async function getPublishedPosts() {
    console.log('Fetching published posts via Supabase direct...');
    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching published posts:', error);
        return [];
    }
    return data;
}

export async function getBlogPostBySlug(slug: string) {
    console.log(`Fetching post ${slug} via Supabase direct...`);
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) {
        console.error(`Error fetching post ${slug}:`, error);
        return null;
    }
    return data;
}
