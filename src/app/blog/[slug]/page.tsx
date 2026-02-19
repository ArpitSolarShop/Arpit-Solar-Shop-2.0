import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowLeft, Clock, User } from "lucide-react";
import { ShareButton } from "@/components/blog/ShareButton";

// Revalidate every hour
export const revalidate = 3600;
export const dynamicParams = true;

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

import { getPublishedPosts, getBlogPostBySlug } from "@/lib/server/services/blog-service";

// Generate static params for all published blog posts
export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        return posts.map((post: any) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Calculate reading time
function getReadingTime(html: string): number {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Blog Post Not Found',
        };
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        image: post.featured_image ? [post.featured_image] : [],
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
            '@type': 'Organization',
            name: 'Arpit Solar Shop',
            url: 'https://www.arpitsolar.com'
        }
    };

    return {
        title: `${post.seo_title || post.title} | Arpit Solar Shop`,
        description: post.seo_description || post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            images: post.featured_image ? [{ url: post.featured_image }] : [],
            type: 'article',
            publishedTime: post.published_at || post.created_at,
            authors: ['Arpit Solar Shop'],
        },
        other: {
            'script:ld+json': JSON.stringify(jsonLd)
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const blogPost = await getBlogPostBySlug(slug);

    if (!blogPost) {
        notFound();
    }

    const readingTime = getReadingTime(blogPost.content || '');
    const publishDate = new Date(blogPost.published_at || blogPost.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Breadcrumbs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <span className="text-gray-300">/</span>
                        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-700 font-medium line-clamp-1">{blogPost.title}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section with Featured Image */}
            {blogPost.featured_image && (
                <div className="w-full h-[28rem] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={blogPost.featured_image}
                        alt={blogPost.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto max-w-4xl">
                            {blogPost.tags && blogPost.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    {blogPost.tags.slice(0, 3).map((tag: string, index: number) => (
                                        <Badge key={index} className="bg-blue-600 text-white border-0 text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                {blogPost.title}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {/* Article Content */}
            <div className="container mx-auto px-4 py-8 pb-16">
                <div className="max-w-4xl mx-auto">

                    {/* Article Card */}
                    <article className={`bg-white rounded-xl shadow-sm border border-gray-100 ${blogPost.featured_image ? '-mt-16 relative z-10' : ''}`}>

                        {/* Meta Bar */}
                        <div className="px-8 py-5 border-b border-gray-100">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-5 text-sm text-gray-500">
                                    {/* Author */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-medium text-gray-700">Arpit Solar</span>
                                    </div>
                                    {/* Date */}
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{publishDate}</span>
                                    </div>
                                    {/* Reading Time */}
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{readingTime} min read</span>
                                    </div>
                                </div>

                                <ShareButton
                                    title={blogPost.title}
                                    text={blogPost.excerpt}
                                />
                            </div>
                        </div>

                        {/* Title (shown if no featured image) */}
                        {!blogPost.featured_image && (
                            <div className="px-8 pt-8">
                                {blogPost.tags && blogPost.tags.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {blogPost.tags.map((tag: string, index: number) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                    {blogPost.title}
                                </h1>
                            </div>
                        )}

                        {/* Excerpt / TL;DR Box */}
                        {blogPost.excerpt && (
                            <div className="mx-8 mt-6">
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-600 font-bold text-sm">TL;DR</span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{blogPost.excerpt}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="px-8 py-8">
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: blogPost.content }}
                            />
                        </div>

                        {/* Tags Footer */}
                        {blogPost.tags && blogPost.tags.length > 0 && (
                            <div className="px-8 pb-8">
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500 mr-1">Tags:</span>
                                        {blogPost.tags.map((tag: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs hover:bg-blue-50 transition-colors cursor-pointer">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </article>

                    {/* CTA Section */}
                    <div className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-3">
                            Ready to Go Solar?
                        </h3>
                        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                            Get a free consultation and customized quote for your rooftop solar installation. Save up to 90% on your electricity bills!
                        </p>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Link href="/get-quote">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                                    Get Free Quote
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Back to Blog Button */}
                    <div className="text-center mt-8">
                        <Link href="/blog">
                            <Button variant="outline" size="lg" className="gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                Back to All Articles
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
