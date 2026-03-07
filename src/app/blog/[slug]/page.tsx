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

    const isFullWidth = blogPost.tags?.includes('__full_width');
    // Filter out the hidden tag for display
    const displayTags = (blogPost.tags || []).filter((t: string) => t !== '__full_width');

    // --- FULL-WIDTH LAYOUT (Dynamic from CMS) ---
    if (isFullWidth) {
        return (
            <div className="min-h-screen bg-white w-full">
                {/* Brand Header */}
                <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img src="/logo.webp" alt="Arpit Solar Shop" className="h-8 md:h-10 object-contain group-hover:scale-105 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                        <a href="tel:+919005770466" className="hidden sm:flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span className="tracking-wide">9005770466</span>
                        </a>
                        <a href="mailto:info@arpitsolar.com" className="hidden lg:flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span>info@arpitsolar.com</span>
                        </a>
                        <Link href="/contact" className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm text-xs md:text-sm">
                            Get Quote
                        </Link>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="px-6 md:px-12 py-3 text-sm text-gray-500 flex items-center gap-2 bg-gray-50 border-b border-gray-100">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span className="text-gray-300">&gt;</span>
                    <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
                    <span className="text-gray-300">&gt;</span>
                    <span className="text-gray-900 font-medium">{blogPost.title}</span>
                </div>

                {/* Full-Width HTML Content */}
                <div
                    className="full-width-blog-content w-full"
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                {/* Contact CTA */}
                <section className="py-24 px-6 bg-blue-600 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-8">
                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                <img src="/logo.webp" alt="Arpit Solar Shop Logo" className="h-12 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Need Expert Guidance?</h2>
                        <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
                            Connect with us for expert advice on your next project. We are here to help!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <a href="tel:+919005770466" className="flex flex-col items-center p-8 rounded-3xl bg-white/10 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/10 group">
                                <div className="p-4 bg-white/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span className="text-sm text-blue-200 mb-1 uppercase tracking-wider font-semibold">Call Us</span>
                                <span className="text-2xl font-bold">9005770466</span>
                            </a>
                            <a href="https://wa.me/919044555572" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-8 rounded-3xl bg-white/10 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/10 group">
                                <div className="p-4 bg-emerald-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                </div>
                                <span className="text-sm text-blue-200 mb-1 uppercase tracking-wider font-semibold">WhatsApp</span>
                                <span className="text-2xl font-bold">9044555572</span>
                            </a>
                            <a href="mailto:info@arpitsolar.com" className="flex flex-col items-center p-8 rounded-3xl bg-white/10 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 border border-white/10 group">
                                <div className="p-4 bg-white/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-sm text-blue-200 mb-1 uppercase tracking-wider font-semibold">Email</span>
                                <span className="text-xl font-bold">info@arpitsolar.com</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-gray-500 border-t border-gray-200 bg-white">
                    <p>© 2026 Arpit Solar Shop. All rights reserved.</p>
                </footer>
            </div>
        );
    }

    // --- STANDARD BLOG LAYOUT ---
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
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                    <img
                        src={blogPost.featured_image}
                        alt={blogPost.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto max-w-4xl">
                            {displayTags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    {displayTags.slice(0, 3).map((tag: string, index: number) => (
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
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        Arpit Solar Shop
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {publishDate}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {readingTime} min read
                                    </span>
                                </div>
                                <ShareButton title={blogPost.title} />
                            </div>
                        </div>

                        {/* Title (if no featured image) */}
                        {!blogPost.featured_image && (
                            <div className="px-8 pt-8 pb-4">
                                {displayTags.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {displayTags.map((tag: string, index: number) => (
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
                        {displayTags.length > 0 && (
                            <div className="px-8 pb-8">
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500 mr-1">Tags:</span>
                                        {displayTags.map((tag: string, index: number) => (
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
                                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold px-8">
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
