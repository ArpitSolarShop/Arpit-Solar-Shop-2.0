"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Save,
    Trash2,
    GripVertical,
    Check,
    Loader2,
    ArrowUp,
    ArrowDown,
    Pencil,
    Sun,
    PlusCircle,
    ArrowLeft,
    Package
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Component {
    id: string;
    category: string;
    name: string;
    description: string;
    quantity: string;
    make: string;
    sort_order: number;
    is_active: boolean;
    _isNew?: boolean;
    _isEdited?: boolean;
}

function SolarProductComponentsContent() {
    const searchParams = useSearchParams();
    const brandFromUrl = searchParams.get("brand");

    const [components, setComponents] = useState<Component[]>([]);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>(brandFromUrl || "");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [initialCategorySet, setInitialCategorySet] = useState(false);

    const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Fetch product counts per category
    const fetchProductCounts = useCallback(async () => {
        try {
            const { data } = await supabase
                .from("solar_products")
                .select("category");
            if (data) {
                const counts: Record<string, number> = {};
                data.forEach((p: any) => {
                    counts[p.category] = (counts[p.category] || 0) + 1;
                });
                setProductCounts(counts);
            }
        } catch (err) {
            console.error("Failed to fetch product counts", err);
        }
    }, []);

    // Fetch components
    const fetchComponents = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("solar_product_components")
                .select("*")
                .order("category")
                .order("sort_order");

            if (error) throw error;
            const mapped = (data || []).map((c: any) => ({ ...c, _isNew: false, _isEdited: false }));
            setComponents(mapped);

            // Set active category: prefer URL param, then first available
            if (!initialCategorySet && mapped.length > 0) {
                const cats = [...new Set(mapped.map((c: any) => c.category))];
                if (brandFromUrl && cats.includes(brandFromUrl)) {
                    setActiveCategory(brandFromUrl);
                } else if (!activeCategory) {
                    setActiveCategory(cats[0] as string);
                }
                setInitialCategorySet(true);
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            showToast("Failed to load components: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    }, [showToast, activeCategory, brandFromUrl, initialCategorySet]);

    useEffect(() => {
        fetchComponents();
        fetchProductCounts();
    }, []);

    // Dynamic categories from data
    const categories = [...new Set(components.map((c) => c.category))].sort();

    // Components for active tab
    const categoryComponents = components
        .filter((c) => c.category === activeCategory)
        .sort((a, b) => a.sort_order - b.sort_order);

    const getCategoryCount = (cat: string) => components.filter((c) => c.category === cat).length;

    // Add new component to current category
    const handleAdd = () => {
        if (!activeCategory) {
            showToast("Select or create a category first", "error");
            return;
        }
        const maxOrder = categoryComponents.length > 0
            ? Math.max(...categoryComponents.map((c) => c.sort_order))
            : 0;

        const newComp: Component = {
            id: `new-${Date.now()}`,
            category: activeCategory,
            name: "",
            description: "",
            quantity: "",
            make: "",
            sort_order: maxOrder + 1,
            is_active: true,
            _isNew: true,
            _isEdited: true,
        };

        setComponents((prev) => [...prev, newComp]);
        setEditingId(newComp.id);
    };

    // Create new category (brand)
    const handleCreateCategory = () => {
        const name = newCategoryName.trim();
        if (!name) return showToast("Enter a category name", "error");
        if (categories.includes(name)) return showToast("Category already exists", "error");

        setActiveCategory(name);
        setNewCategoryName("");
        setShowNewCategory(false);
        // Auto-add first component
        const newComp: Component = {
            id: `new-${Date.now()}`,
            category: name,
            name: "",
            description: "",
            quantity: "",
            make: "",
            sort_order: 1,
            is_active: true,
            _isNew: true,
            _isEdited: true,
        };
        setComponents((prev) => [...prev, newComp]);
        setEditingId(newComp.id);
        showToast(`Category "${name}" created. Add components below.`);
    };

    // Update a field
    const handleFieldChange = (id: string, field: keyof Component, value: any) => {
        setComponents((prev) =>
            prev.map((c) => (c.id === id ? { ...c, [field]: value, _isEdited: true } : c))
        );
    };

    // Delete
    const handleDelete = async (id: string, isNew: boolean) => {
        if (!confirm("Delete this component?")) return;
        if (!isNew) {
            try {
                const { error } = await supabase.from("solar_product_components").delete().eq("id", id);
                if (error) throw error;
            } catch (err: any) {
                return showToast("Delete failed: " + err.message, "error");
            }
        }
        setComponents((prev) => prev.filter((c) => c.id !== id));
        showToast("Component deleted");
    };

    // Reorder
    const handleMove = (id: string, direction: "up" | "down") => {
        const items = [...categoryComponents];
        const idx = items.findIndex((c) => c.id === id);
        if ((direction === "up" && idx === 0) || (direction === "down" && idx === items.length - 1)) return;

        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        const tempOrder = items[idx].sort_order;
        items[idx].sort_order = items[swapIdx].sort_order;
        items[swapIdx].sort_order = tempOrder;

        setComponents((prev) =>
            prev.map((c) => {
                if (c.id === items[idx].id) return { ...items[idx], _isEdited: true };
                if (c.id === items[swapIdx].id) return { ...items[swapIdx], _isEdited: true };
                return c;
            })
        );
    };

    // Save
    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const edited = categoryComponents.filter((c) => c._isEdited);
            if (edited.length === 0) {
                showToast("No changes to save");
                setSaving(false);
                return;
            }

            for (const comp of edited) {
                const payload = {
                    category: comp.category,
                    name: comp.name,
                    description: comp.description,
                    quantity: comp.quantity,
                    make: comp.make,
                    sort_order: comp.sort_order,
                    is_active: comp.is_active,
                    updated_at: new Date().toISOString(),
                };

                if (comp._isNew) {
                    const { error } = await supabase.from("solar_product_components").insert(payload);
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from("solar_product_components").update(payload).eq("id", comp.id);
                    if (error) throw error;
                }
            }

            showToast(`${edited.length} component(s) saved!`);
            await fetchComponents();
            setEditingId(null);
        } catch (err: any) {
            showToast("Save failed: " + err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    // Copy to another category
    const handleCopyTo = async (targetCategory: string) => {
        if (!confirm(`Copy all ${activeCategory} components to ${targetCategory}?`)) return;
        setSaving(true);
        try {
            const toCopy = categoryComponents.map((c) => ({
                category: targetCategory,
                name: c.name,
                description: c.description,
                quantity: c.quantity,
                make: c.make,
                sort_order: c.sort_order,
                is_active: c.is_active,
            }));
            const { error } = await supabase.from("solar_product_components").insert(toCopy);
            if (error) throw error;
            showToast(`Copied ${toCopy.length} components to ${targetCategory}`);
            await fetchComponents();
        } catch (err: any) {
            showToast("Copy failed: " + err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = categoryComponents.some((c) => c._isEdited);

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={cn(
                    "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in slide-in-from-right",
                    toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                )}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Solar Product Components</h1>
                    <p className="text-gray-600 mt-1">
                        Manage components per brand/product type. These appear in quotation PDFs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" /> Add Component
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        disabled={saving || !hasChanges}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Brand/Category Tabs — Dynamic */}
            <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setEditingId(null); }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all",
                            activeCategory === cat
                                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        )}
                    >
                        {cat}
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-bold",
                            activeCategory === cat ? "bg-white/20" : "bg-gray-100"
                        )}>
                            {getCategoryCount(cat)}
                        </span>
                        {productCounts[cat] && (
                            <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px]",
                                activeCategory === cat ? "bg-blue-500/30" : "bg-blue-50 text-blue-600"
                            )} title={`${productCounts[cat]} product(s) use these components`}>
                                <Package className="w-3 h-3 inline mr-0.5" />{productCounts[cat]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Copy Actions */}
            {categories.length > 1 && activeCategory && (
                <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-xs text-gray-500">Copy components to:</span>
                    {categories.filter((c) => c !== activeCategory).map((c) => (
                        <button
                            key={c}
                            onClick={() => handleCopyTo(c)}
                            disabled={saving || categoryComponents.length === 0}
                            className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}

            {/* Components Table */}
            {loading ? (
                <div className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">Loading components...</p>
                </div>
            ) : !activeCategory ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <Sun className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="text-gray-500 mt-3 text-lg">No categories yet</p>
                    <p className="text-gray-400 text-sm mt-1">Click "New Brand" above to create your first component set</p>
                </div>
            ) : categoryComponents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <Sun className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="text-gray-500 mt-3 text-lg">No components for <strong>{activeCategory}</strong></p>
                    <Button onClick={handleAdd} variant="outline" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" /> Add First Component
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-3">Component Name</div>
                        <div className="col-span-3">Description</div>
                        <div className="col-span-1">Qty</div>
                        <div className="col-span-2">Make / Brand</div>
                        <div className="col-span-2 text-center">Actions</div>
                    </div>

                    {/* Rows */}
                    {categoryComponents.map((comp, idx) => {
                        const isEditing = editingId === comp.id || comp._isNew;
                        return (
                            <div
                                key={comp.id}
                                className={cn(
                                    "grid grid-cols-12 gap-2 px-4 py-3 items-center border-b last:border-b-0 transition-colors",
                                    comp._isEdited ? "bg-amber-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                                    !comp.is_active && "opacity-50"
                                )}
                            >
                                <div className="col-span-1 flex items-center justify-center gap-1">
                                    <GripVertical className="w-3 h-3 text-gray-300" />
                                    <span className="text-sm font-mono text-gray-500">{idx + 1}</span>
                                </div>

                                <div className="col-span-3">
                                    {isEditing ? (
                                        <Input value={comp.name} onChange={(e) => handleFieldChange(comp.id, "name", e.target.value)} placeholder="Component name" className="h-9 text-sm" />
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-900">{comp.name}</span>
                                    )}
                                </div>

                                <div className="col-span-3">
                                    {isEditing ? (
                                        <Input value={comp.description || ""} onChange={(e) => handleFieldChange(comp.id, "description", e.target.value)} placeholder="Description" className="h-9 text-sm" />
                                    ) : (
                                        <span className="text-sm text-gray-600">{comp.description || "—"}</span>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    {isEditing ? (
                                        <Input value={comp.quantity || ""} onChange={(e) => handleFieldChange(comp.id, "quantity", e.target.value)} placeholder="Qty" className="h-9 text-sm" />
                                    ) : (
                                        <span className="text-sm text-gray-600">{comp.quantity || "—"}</span>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    {isEditing ? (
                                        <Input value={comp.make || ""} onChange={(e) => handleFieldChange(comp.id, "make", e.target.value)} placeholder="Make/Brand" className="h-9 text-sm" />
                                    ) : (
                                        <span className="text-sm text-blue-700 font-medium">{comp.make || "—"}</span>
                                    )}
                                </div>

                                <div className="col-span-2 flex items-center justify-center gap-1">
                                    <button onClick={() => handleMove(comp.id, "up")} disabled={idx === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" title="Move up">
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleMove(comp.id, "down")} disabled={idx === categoryComponents.length - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" title="Move down">
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    {isEditing ? (
                                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded hover:bg-green-100 text-green-600" title="Done">
                                            <Check className="w-3.5 h-3.5" />
                                        </button>
                                    ) : (
                                        <button onClick={() => setEditingId(comp.id)} className="p-1.5 rounded hover:bg-blue-100 text-blue-600" title="Edit">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleFieldChange(comp.id, "is_active", !comp.is_active)}
                                        className={cn("p-1.5 rounded text-xs font-bold", comp.is_active ? "hover:bg-yellow-100 text-yellow-600" : "hover:bg-green-100 text-green-600")}
                                        title={comp.is_active ? "Deactivate" : "Activate"}
                                    >
                                        {comp.is_active ? "ON" : "OFF"}
                                    </button>
                                    <button onClick={() => handleDelete(comp.id, !!comp._isNew)} className="p-1.5 rounded hover:bg-red-100 text-red-500" title="Delete">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Floating save button */}
            {hasChanges && (
                <div className="fixed bottom-6 right-6 z-40">
                    <Button onClick={handleSaveAll} disabled={saving} className="bg-green-600 hover:bg-green-700 shadow-xl rounded-full px-6 py-3 h-auto text-base">
                        {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                        Save {categoryComponents.filter((c) => c._isEdited).length} Change(s)
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function SolarProductComponentsPage() {
    return (
        <Suspense fallback={<div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /><p className="text-gray-500 mt-2">Loading...</p></div>}>
            <SolarProductComponentsContent />
        </Suspense>
    );
}
