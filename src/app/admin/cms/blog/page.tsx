"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Newspaper, Pencil, Trash2, Eye, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function BlogListPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const response = await fetch("/api/cms/blog");
            if (!response.ok) throw new Error("Failed to fetch blog posts");

            const data = await response.json();
            setBlogPosts(data.data || []);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load blog posts",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const response = await fetch(`/api/cms/blog?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete blog post");

            toast({
                title: "Success!",
                description: "Blog post deleted successfully.",
            });

            fetchBlogPosts();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete blog post",
                variant: "destructive",
            });
        }
    };

    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                    <p className="text-gray-600 mt-1">Manage your solar energy blog content</p>
                </div>
                <Link href="/admin/cms/blog/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <Newspaper className="w-5 h-5 mr-2" />
                                Blog Posts ({filteredPosts.length})
                            </CardTitle>
                            <CardDescription>All published and draft blog articles</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 w-64"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium mb-2">
                                {searchTerm || statusFilter !== "all"
                                    ? "No blog posts found"
                                    : "No blog posts yet"}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Create your first blog post to get started"}
                            </p>
                            {!searchTerm && statusFilter === "all" && (
                                <Link href="/admin/cms/blog/new">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Post
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{post.title}</h3>
                                            <Badge
                                                variant={post.status === "published" ? "default" : "secondary"}
                                                className={
                                                    post.status === "published"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }
                                            >
                                                {post.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt || "No excerpt"}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>Slug: /{post.slug}</span>
                                            <span>•</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            {post.tags && post.tags.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>Tags: {post.tags.join(", ")}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {post.status === "published" && (
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={`/admin/cms/blog/${post.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
