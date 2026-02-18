"use client";

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
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

    // Track if fields have been manually modified
    const [touched, setTouched] = useState({
        slug: !!initialData?.slug,
        excerpt: !!initialData?.excerpt,
        seo_title: !!initialData?.seo_title,
        seo_description: !!initialData?.seo_description,
    });

    // Load draft from localStorage on mount (only for create mode)
    useEffect(() => {
        if (mode === "create") {
            const savedDraft = localStorage.getItem("blog_post_draft");
            const savedTouched = localStorage.getItem("blog_post_touched");

            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    // Ask user if they want to restore? For now, just restore if title is empty
                    if (!formData.title && parsed.title) {
                        setFormData(prev => ({ ...prev, ...parsed }));
                        toast({
                            title: "Draft Restored",
                            description: "Restored your unsaved blog post draft.",
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }

            if (savedTouched) {
                try {
                    setTouched(JSON.parse(savedTouched));
                } catch (e) {
                    console.error("Failed to parse touched state", e);
                }
            }
        }
    }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

    // Save to localStorage on change
    useEffect(() => {
        if (mode === "create") {
            const timeoutId = setTimeout(() => {
                localStorage.setItem("blog_post_draft", JSON.stringify(formData));
                localStorage.setItem("blog_post_touched", JSON.stringify(touched));
            }, 1000); // 1s debounce
            return () => clearTimeout(timeoutId);
        }
    }, [formData, touched, mode]);

    // Auto-generate slug and SEO title from title
    useEffect(() => {
        if (mode === "create" && formData.title) {
            // Auto-slug
            if (!touched.slug) {
                const generatedSlug = formData.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
                setFormData(prev => ({ ...prev, slug: generatedSlug }));
            }

            // Auto-SEO Title
            if (!touched.seo_title) {
                setFormData(prev => ({ ...prev, seo_title: formData.title }));
            }
        }
    }, [formData.title, mode, touched.slug, touched.seo_title]);

    // Auto-generate Excerpt from Content (first 160 chars)
    useEffect(() => {
        if (mode === "create" && formData.content && !touched.excerpt) {
            const plainText = formData.content.replace(/<[^>]+>/g, " ").substring(0, 160).trim() + "...";
            setFormData(prev => ({ ...prev, excerpt: plainText }));
        }
    }, [formData.content, mode, touched.excerpt]);

    // Auto-generate SEO description from excerpt
    useEffect(() => {
        if (mode === "create" && formData.excerpt && !touched.seo_description) {
            setFormData(prev => ({ ...prev, seo_description: formData.excerpt }));
        }
    }, [formData.excerpt, mode, touched.seo_description]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Mark as touched if user manually edits these fields
        if (["slug", "excerpt", "seo_title", "seo_description"].includes(field)) {
            setTouched(prev => ({ ...prev, [field]: true }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get content directly from state
            const content = formData.content;

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

            // Clear draft on successful save
            if (mode === "create") {
                localStorage.removeItem("blog_post_draft");
                localStorage.removeItem("blog_post_touched");
            }
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

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        await uploadFile(e.target.files[0]);
    };

    const uploadFile = async (file: File) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `blog/${formData.slug || "draft"}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        setUploading(true);

        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { error: uploadError } = await supabase.storage
                .from("object storage")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("object storage").getPublicUrl(filePath);

            if (data) {
                setFormData((prev) => ({ ...prev, featured_image: data.publicUrl }));
                toast({
                    title: "Image Uploaded",
                    description: "Featured image has been uploaded successfully.",
                });
            }
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload image.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, featured_image: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                        <Label htmlFor="featured_image">Featured Image</Label>

                        <div className="mt-2 space-y-4">
                            {/* Drag & Drop Zone */}
                            {!formData.featured_image ? (
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                        disabled={uploading || loading}
                                    />

                                    <div className="flex flex-col items-center justify-center gap-2">
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                                <p className="text-sm text-gray-500">Uploading image...</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-gray-100 rounded-full">
                                                    <UploadCloud className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        SVG, PNG, JPG or GIF (max. 5MB)
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Image Preview with Actions */
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                                    <div className="aspect-video w-full bg-gray-100 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={formData.featured_image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="h-9"
                                                onClick={() => window.open(formData.featured_image, '_blank')}
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="h-9"
                                                onClick={removeImage}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Manual URL Input (Collapsible/Optional) */}
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-gray-200"></div>
                                <span className="text-xs text-gray-400 font-medium">OR USE URL</span>
                                <div className="h-px flex-1 bg-gray-200"></div>
                            </div>

                            <Input
                                id="featured_image"
                                type="url"
                                value={formData.featured_image}
                                onChange={(e) => handleChange("featured_image", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="text-sm bg-gray-50"
                            />
                        </div>
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
                    <RichTextEditor
                        value={formData.content}
                        onChange={(content) => {
                            setFormData(prev => ({ ...prev, content }));
                        }}
                        placeholder="Start writing your blog post here..."
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
