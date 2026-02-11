import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/blog/ShareButton";

// Force dynamic rendering since we fetch data
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Fetch blog post data
async function getBlogPost(slug: string) {
    try {
        const port = process.env.PORT || 3000;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`;
        console.log(`Fetching blog post from: ${baseUrl}/api/cms/blog?slug=${slug}&status=published`);

        const res = await fetch(`${baseUrl}/api/cms/blog?slug=${slug}&status=published`, {
            cache: 'no-store'
        });

        if (!res.ok) return null;

        const json = await res.json();
        // API returns { data: { ...post } } when slug is used
        return json.data || null;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    return {
        title: `${post.seo_title || post.title} | Arpit Solar Shop`,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            images: post.featured_image ? [{ url: post.featured_image }] : [],
            type: 'article',
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const blogPost = await getBlogPost(slug);

    if (!blogPost) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Breadcrumbs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-900 line-clamp-1">{blogPost.title}</span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {blogPost.featured_image && (
                <div className="w-full h-96 relative">
                    <img
                        src={blogPost.featured_image}
                        alt={blogPost.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            {/* Article Content */}
            <div className="container mx-auto px-4 py-12 pb-24">
                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 ${blogPost.featured_image ? '-mt-24 relative z-10' : ''}`}>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {blogPost.title}
                        </h1>

                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>{new Date(blogPost.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>

                            <ShareButton
                                title={blogPost.title}
                                text={blogPost.excerpt}
                            />
                        </div>

                        {/* Tags */}
                        {blogPost.tags && blogPost.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <Tag className="w-5 h-5 text-gray-400" />
                                {blogPost.tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Excerpt */}
                        {blogPost.excerpt && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                                <p className="text-lg text-gray-700 italic">{blogPost.excerpt}</p>
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: blogPost.content }}
                        />
                    </div>

                    {/* Back to Blog Button */}
                    <div className="text-center mt-12">
                        <Link href="/blog">
                            <Button variant="outline" size="lg" className="gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                Back to All Articles
                            </Button>
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}
