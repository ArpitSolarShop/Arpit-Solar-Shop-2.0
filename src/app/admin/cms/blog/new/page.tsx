"use client";

import dynamic from 'next/dynamic';

const BlogForm = dynamic(() => import('@/components/admin/BlogForm'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    ),
});

export default function NewBlogPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
                <p className="text-gray-600 mt-1">Write and publish solar energy content</p>
            </div>

            <BlogForm mode="create" />
        </div>
    );
}
