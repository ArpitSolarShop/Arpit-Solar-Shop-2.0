"use client";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogFormProps {
    initialData?: {
        id?: string;
        title?: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        featured_image?: string;
        tags?: string[];
        status?: string;
        seo_title?: string;
        seo_description?: string;
    };
    mode?: "create" | "edit";
}

export default function BlogForm({ initialData, mode = "create" }: BlogFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const editorRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        featured_image: initialData?.featured_image || "",
        tags: initialData?.tags?.join(", ") || "",
        status: initialData?.status || "draft",
        seo_title: initialData?.seo_title || "",
        seo_description: initialData?.seo_description || "",
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (mode === "create" && formData.title && !formData.slug) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, mode]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get content from TinyMCE - the editor instance is accessed via editorRef.current
            const content = editorRef.current ? editorRef.current.getContent() : "";

            // Prepare payload
            const payload = {
                ...formData,
                content,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
                author_id: "00000000-0000-0000-0000-000000000000", // TODO: Replace with actual user ID
            };

            const url = "/api/cms/blog";
            const method = mode === "create" ? "POST" : "PUT";
            const body = mode === "edit" ? { ...payload, id: initialData?.id } : payload;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save blog post");
            }

            toast({
                title: "Success!",
                description: `Blog post ${mode === "create" ? "created" : "updated"} successfully.`,
            });

            router.push("/admin/cms/blog");
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;

        setDeleting(true);
        try {
            const response = await fetch(`/api/cms/blog?id=${initialData?.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete blog post");
            }

            toast({
                title: "Success!",
                description: "Blog post deleted successfully.",
            });

            router.push("/admin/cms/blog");
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete blog post",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="Enter blog post title"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => handleChange("slug", e.target.value)}
                            placeholder="url-friendly-slug"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">URL: /blog/{formData.slug || "your-slug"}</p>
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => handleChange("excerpt", e.target.value)}
                            placeholder="Short summary of the post..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="featured_image">Featured Image URL</Label>
                        <Input
                            id="featured_image"
                            type="url"
                            value={formData.featured_image}
                            onChange={(e) => handleChange("featured_image", e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => handleChange("tags", e.target.value)}
                            placeholder="solar, energy, sustainability (comma-separated)"
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <Editor
                        onInit={(evt, editor) => {
                            editorRef.current = editor;
                        }}
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'fullscreen', 'preview', 'help'
                            ],
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen preview',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Arpit Solar',
                            branding: false,
                        }}
                        initialValue={initialData?.content || "<p>Start writing your blog post here...</p>"}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                            id="seo_title"
                            value={formData.seo_title}
                            onChange={(e) => handleChange("seo_title", e.target.value)}
                            placeholder="SEO optimized title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="seo_description">SEO Description</Label>
                        <Textarea
                            id="seo_description"
                            value={formData.seo_description}
                            onChange={(e) => handleChange("seo_description", e.target.value)}
                            placeholder="Meta description for search engines..."
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div>
                    {mode === "edit" && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting || loading}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Post
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/cms/blog")}
                        disabled={loading || deleting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading || deleting} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {mode === "create" ? "Create Post" : "Update Post"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
