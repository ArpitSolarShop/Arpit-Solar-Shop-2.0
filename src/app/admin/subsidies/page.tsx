"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Plus,
    Save,
    Trash2,
    Loader2,
    ArrowLeft,
    Coins,
    Pencil,
    Check,
    X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Subsidy {
    id: string;
    name: string;
    scheme_type: 'Central' | 'State';
    state?: string | null;
    calculation_type: 'per_kw' | 'flat' | 'capped_per_kw' | 'tiered_surya_ghar';
    amount_per_kw: number;
    flat_amount: number;
    max_cap: number;
    description: string;
    is_active: boolean;
    _isNew?: boolean;
    _isEdited?: boolean;
}

function SubsidiesContent() {
    const { toast } = useToast();
    const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Fetch subsidies
    const fetchSubsidies = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("solar_subsidies")
                .select("*")
                .order("is_active", { ascending: false })
                .order("scheme_type")
                .order("name");

            if (error) throw error;
            const mapped = (data || []).map((c: any) => ({ ...c, _isNew: false, _isEdited: false }));
            setSubsidies(mapped);
        } catch (err: any) {
            console.error("Fetch error:", err);
            toast({
                title: "Error fetching subsidies",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSubsidies();
    }, [fetchSubsidies]);

    // Add new subsidy row
    const handleAdd = () => {
        const newSubsidy: Subsidy = {
            id: `new-${Date.now()}`,
            name: "New Subsidy Scheme",
            scheme_type: "State",
            state: "Uttar Pradesh",
            calculation_type: "capped_per_kw",
            amount_per_kw: 0,
            flat_amount: 0,
            max_cap: 0,
            description: "",
            is_active: true,
            _isNew: true,
            _isEdited: true,
        };

        setSubsidies((prev) => [newSubsidy, ...prev]);
        setEditingId(newSubsidy.id);
    };


    const handleFieldChange = (id: string, field: keyof Subsidy, value: any) => {
        setSubsidies((prev) =>
            prev.map((s) => (s.id === id ? { ...s, [field]: value, _isEdited: true } : s))
        );
    };

    const handleSave = async (subsidy: Subsidy) => {
        setSaving(true);
        try {
            const payload = {
                name: subsidy.name,
                scheme_type: subsidy.scheme_type,
                state: subsidy.scheme_type === 'Central' ? null : subsidy.state,
                calculation_type: subsidy.calculation_type,
                amount_per_kw: subsidy.amount_per_kw,
                flat_amount: subsidy.flat_amount,
                max_cap: subsidy.max_cap,
                description: subsidy.description,
                is_active: subsidy.is_active,
            };

            if (subsidy._isNew) {
                const { error } = await supabase.from("solar_subsidies").insert(payload);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("solar_subsidies").update(payload).eq("id", subsidy.id);
                if (error) throw error;
            }

            toast({ title: "Subsidy saved successfully" });
            setEditingId(null);
            await fetchSubsidies();
        } catch (err: any) {
            toast({
                title: "Save failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, isNew: boolean) => {
        if (!confirm("Delete this subsidy rule?")) return;
        if (!isNew) {
            try {
                const { error } = await supabase.from("solar_subsidies").delete().eq("id", id);
                if (error) throw error;
            } catch (err: any) {
                return toast({
                    title: "Delete failed",
                    description: err.message,
                    variant: "destructive",
                });
            }
        }
        setSubsidies((prev) => prev.filter((s) => s.id !== id));
        toast({ title: "Subsidy deleted" });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Coins className="w-8 h-8 text-yellow-600" />
                        Subsidy Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Configure Central and State subsidy rules for quotation calculations.
                    </p>
                </div>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">Loading subsidies...</p>
                </div>
            ) : subsidies.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <Coins className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="text-gray-500 mt-3 text-lg">No subsidy rules defined</p>
                    <Button onClick={handleAdd} variant="outline" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" /> Add First Subsidy Rule
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {subsidies.map((subsidy) => {
                        const isEditing = editingId === subsidy.id;
                        return (
                            <Card key={subsidy.id} className={cn("transition-all border-l-4", subsidy.is_active ? "border-l-green-500" : "border-l-gray-300 opacity-75")}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                                        <div className="flex-1 w-full">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <Label>Subsidy Scheme Name</Label>
                                                    <Input
                                                        value={subsidy.name}
                                                        onChange={(e) => handleFieldChange(subsidy.id, "name", e.target.value)}
                                                        placeholder="e.g. PM Surya Ghar"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                                        {subsidy.name}
                                                        {!subsidy.is_active && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Inactive</span>}
                                                    </h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", subsidy.scheme_type === 'Central' ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-orange-50 text-orange-700 border-orange-200")}>
                                                            {subsidy.scheme_type}
                                                        </span>
                                                        {subsidy.state && (
                                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                                                {subsidy.state}
                                                            </span>
                                                        )}
                                                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                                            {subsidy.calculation_type}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 self-end md:self-auto">
                                            {isEditing ? (
                                                <>
                                                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => subsidy._isNew ? handleDelete(subsidy.id, true) : setEditingId(null)}>
                                                        <X className="w-4 h-4" /> Cancel
                                                    </Button>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleSave(subsidy)} disabled={saving}>
                                                        {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                                                        Save
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingId(subsidy.id)}>
                                                        <Pencil className="w-3 h-3 mr-1" /> Edit
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(subsidy.id, false)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit Mode Fields */}
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Scheme Type</Label>
                                                <Select
                                                    value={subsidy.scheme_type}
                                                    onValueChange={(val) => handleFieldChange(subsidy.id, "scheme_type", val)}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Central">Central</SelectItem>
                                                        <SelectItem value="State">State</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {subsidy.scheme_type === 'State' && (
                                                <div className="space-y-1">
                                                    <Label className="text-xs">State Name</Label>
                                                    <Input className="h-8 text-xs" value={subsidy.state || ""} onChange={(e) => handleFieldChange(subsidy.id, "state", e.target.value)} placeholder="e.g. Uttar Pradesh" />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <Label className="text-xs">Calculation Strategy</Label>
                                                <Select
                                                    value={subsidy.calculation_type}
                                                    onValueChange={(val) => handleFieldChange(subsidy.id, "calculation_type", val)}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="per_kw">Per kW Rate</SelectItem>
                                                        <SelectItem value="flat">Flat Amount</SelectItem>
                                                        <SelectItem value="capped_per_kw">Capped Per kW</SelectItem>
                                                        <SelectItem value="tiered_surya_ghar">Tiered (PM Surya Ghar)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {subsidy.calculation_type !== 'tiered_surya_ghar' && (
                                                <>
                                                    {(subsidy.calculation_type === 'per_kw' || subsidy.calculation_type === 'capped_per_kw') && (
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Amount per kW (₹)</Label>
                                                            <Input type="number" className="h-8 text-xs" value={subsidy.amount_per_kw} onChange={(e) => handleFieldChange(subsidy.id, "amount_per_kw", parseFloat(e.target.value))} />
                                                        </div>
                                                    )}

                                                    {subsidy.calculation_type === 'flat' && (
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Flat Amount (₹)</Label>
                                                            <Input type="number" className="h-8 text-xs" value={subsidy.flat_amount} onChange={(e) => handleFieldChange(subsidy.id, "flat_amount", parseFloat(e.target.value))} />
                                                        </div>
                                                    )}

                                                    {subsidy.calculation_type === 'capped_per_kw' && (
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Max Cap Amount (₹)</Label>
                                                            <Input type="number" className="h-8 text-xs" value={subsidy.max_cap} onChange={(e) => handleFieldChange(subsidy.id, "max_cap", parseFloat(e.target.value))} />
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <div className="col-span-full space-y-1">
                                                <Label className="text-xs">Description / Notes</Label>
                                                <Input className="h-8 text-xs" value={subsidy.description || ""} onChange={(e) => handleFieldChange(subsidy.id, "description", e.target.value)} />
                                            </div>

                                            <div className="col-span-full flex items-center gap-2 mt-2">
                                                <Label className="text-xs cursor-pointer" htmlFor={`active-${subsidy.id}`}>Active Status:</Label>
                                                <input
                                                    type="checkbox"
                                                    id={`active-${subsidy.id}`}
                                                    checked={subsidy.is_active}
                                                    onChange={(e) => handleFieldChange(subsidy.id, "is_active", e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                                            {subsidy.calculation_type === 'tiered_surya_ghar' ? (
                                                <p className="italic text-gray-500">
                                                    Uses complex tiered logic: 30k/kW (0-2kW) + 18k/kW (2-3kW), capped at 78k.
                                                </p>
                                            ) : (
                                                <div className="flex gap-6">
                                                    {(subsidy.amount_per_kw > 0) && (
                                                        <div>
                                                            <span className="text-xs text-gray-500 block">Rate</span>
                                                            <span className="font-semibold text-gray-900">₹{subsidy.amount_per_kw.toLocaleString()} / kW</span>
                                                        </div>
                                                    )}
                                                    {(subsidy.flat_amount > 0) && (
                                                        <div>
                                                            <span className="text-xs text-gray-500 block">Flat</span>
                                                            <span className="font-semibold text-gray-900">₹{subsidy.flat_amount.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {(subsidy.max_cap > 0) && (
                                                        <div>
                                                            <span className="text-xs text-gray-500 block">Max Cap</span>
                                                            <span className="font-semibold text-red-700">₹{subsidy.max_cap.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {subsidy.description && <p className="mt-2 text-xs text-gray-500">{subsidy.description}</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function SubsidiesPage() {
    return (
        <Suspense fallback={<div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>}>
            <SubsidiesContent />
        </Suspense>
    );
}
