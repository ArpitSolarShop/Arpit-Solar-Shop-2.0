"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const [blogPost, setBlogPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                // Fetch all published posts and find by slug
                const response = await fetch("/api/cms/blog?status=published");
                if (!response.ok) throw new Error("Failed to fetch blog post");

                const data = await response.json();
                const post = data.data?.find((p: any) => p.slug === params.slug);

                if (post) {
                    setBlogPost(post);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Failed to load blog post:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchBlogPost();
        }
    }, [params.slug]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blogPost?.title,
                text: blogPost?.excerpt || blogPost?.title,
                url: window.location.href,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (notFound || !blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
                    <Link href="/blog">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </div>
        );
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
                        <span className="text-gray-900">{blogPost.title}</span>
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

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
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
