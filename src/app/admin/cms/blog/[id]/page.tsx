"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

const BlogForm = dynamic(() => import('@/components/admin/BlogForm'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    ),
});

export default function EditBlogPage() {
    const params = useParams();
    const [blogPost, setBlogPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const response = await fetch(`/api/cms/blog?id=${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch blog post");

                const data = await response.json();
                setBlogPost(data.data);
            } catch (err: any) {
                setError(err.message || "Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlogPost();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
                <p className="text-gray-600 mt-1">Update your blog content</p>
            </div>

            {blogPost && <BlogForm mode="edit" initialData={blogPost} />}
        </div>
    );
}
