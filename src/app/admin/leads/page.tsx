import { createClient } from "@supabase/supabase-js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Initialize Supabase Client (Prefer Service Role for Admin)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
    // Fetch data
    const { data: leads, error } = await supabase
        .from("solar_quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return (
            <div className="p-8 text-red-500 bg-red-50 rounded-lg border border-red-200">
                <h2 className="font-bold text-lg mb-2">Error loading leads</h2>
                <p>{error.message}</p>
                <p className="text-sm mt-2 text-gray-600">The database table 'solar_quote_requests' might be missing or inaccessible.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Leads & Inquiries</h1>
                <Badge variant="outline" className="text-sm py-1 px-3">
                    Total: {leads?.length || 0}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions (Database Backup)</CardTitle>
                    <p className="text-sm text-gray-500">
                        These are all leads captured in your local database. Use this as a backup if the CRM (Neodove) misses any data.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Date</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Remarks / Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No leads found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leads?.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="font-medium">
                                                {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}
                                                <div className="text-xs text-gray-400">
                                                    {lead.created_at ? new Date(lead.created_at).toLocaleTimeString() : ''}
                                                </div>
                                            </TableCell>
                                            <TableCell>{lead.name}</TableCell>
                                            <TableCell>{lead.phone}</TableCell>
                                            <TableCell>{lead.project_location || lead.city || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal">
                                                    {lead.source || "Website"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`capitalize ${lead.customer_type === 'commercial' ? 'font-bold text-blue-600' : ''}`}>
                                                    {lead.customer_type || 'residential'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[300px] truncate" title={lead.remarks || lead.message}>
                                                {lead.remarks || lead.message || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
