"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Search, MessageCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Define Quotation type based on DB schema
type Quotation = {
    id: string;
    quote_number: string | null;
    customer_name: string;
    customer_phone: string | null;
    capacity_kw: number | null;
    total_amount: number | null;
    status: string;
    created_at: string;
    pdf_url: string | null;
};

export default function QuotationsAdminPage() {
    const router = useRouter();
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchQuotations = async () => {
        try {
            const res = await fetch("/api/quotations?limit=100");
            const data = await res.json();
            if (data.success) {
                setQuotations(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch quotations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quotation?")) return;

        try {
            const res = await fetch(`/api/quotations/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchQuotations();
            } else {
                alert("Failed to delete. API might need update.");
            }
        } catch (error) {
            console.error("Failed to delete quotation:", error);
        }
    };

    const handleWhatsApp = async (phone: string | null, pdfUrl: string | null) => {
        if (!phone || !pdfUrl) return alert("Phone number or PDF URL missing.");
        window.open(pdfUrl, '_blank');
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return "-";
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "draft": return "secondary";
            case "sent": return "default"; // Info-like, usually blueish or primary
            case "accepted": return "outline"; // Success-like needs custom or just outline for now
            case "rejected": return "destructive";
            default: return "outline";
        }
    };

    // Helper for status badge custom styling if needed
    const getStatusClassName = (status: string) => {
        switch (status) {
            case "accepted": return "bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent";
            case "draft": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-transparent";
            case "sent": return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent";
            default: return "";
        }
    };

    const filteredQuotations = quotations.filter(
        (q) =>
            q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (q.quote_number && q.quote_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.customer_phone && q.customer_phone.includes(searchQuery))
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
                    <div className="flex gap-4">
                        <div className="relative w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Link href="/admin/quotations/builder">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Quote
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quotations Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredQuotations.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                {searchQuery ? "No quotations match your search." : "No quotations found."}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Quote No.</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Capacity</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredQuotations.map((quotation) => (
                                        <TableRow key={quotation.id}>
                                            <TableCell className="font-medium">
                                                {quotation.quote_number || "-"}
                                            </TableCell>
                                            <TableCell>{quotation.customer_name}</TableCell>
                                            <TableCell>{quotation.customer_phone || "-"}</TableCell>
                                            <TableCell>{quotation.capacity_kw ? `${quotation.capacity_kw} KW` : "-"}</TableCell>
                                            <TableCell>{formatCurrency(quotation.total_amount)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(quotation.status) as any}
                                                    className={getStatusClassName(quotation.status)}
                                                >
                                                    {quotation.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(quotation.created_at)}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-2">
                                                    {quotation.pdf_url && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View PDF"
                                                            onClick={() => window.open(quotation.pdf_url!, '_blank')}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {quotation.pdf_url && quotation.customer_phone && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            title="Send via WhatsApp"
                                                            onClick={() => handleWhatsApp(quotation.customer_phone, quotation.pdf_url)}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(quotation.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Summary */}
                <div className="flex justify-end mt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredQuotations.length} of {quotations.length} quotations
                    </p>
                </div>
            </div>
        </div>
    );
}
