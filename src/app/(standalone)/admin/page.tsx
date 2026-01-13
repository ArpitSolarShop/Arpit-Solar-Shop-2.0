"use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   Shield, 
//   Download, 
//   RefreshCw, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye,
//   Search,
//   Filter,
//   Calendar,
//   Phone,
//   Mail,
//   MapPin,
//   Building,
//   TrendingUp
// } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import * as XLSX from 'xlsx';
// // import Navbar
// // import Footer

// interface QuoteData {
//   id: string;
//   created_at: string;
//   name: string;
//   phone: string;
//   email?: string;
//   entity_type?: 'Individual' | 'Enterprise';
//   solution_classification?: 'Residential' | 'Commercial' | 'Commercial and industrial DG' | 'BIPv' | 'Utility-scale';
//   estimated_area_sqft?: number;
//   monthly_bill?: number;
//   monthly_bill_range?: string;
//   power_demand_kw?: number;
//   project_location?: string;
//   referral_name?: string;
//   referral_phone?: string;
//   product_name?: string;
//   product_category?: string;
//   source: 'Quote Form' | 'AI Chatbot' | 'Reliance Quote Form' | 'Shakti Quote Form';
//   customer_type?: string;
//   roof_area?: number;
//   referral_source?: string;
// }

// const AdminPage = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [adminCode, setAdminCode] = useState("");
//   const [quotes, setQuotes] = useState<QuoteData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterSource, setFilterSource] = useState<string>("all");
//   const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
//   const [isDetailOpen, setIsDetailOpen] = useState(false);
//   const { toast } = useToast();

//   // Admin authentication - simple code-based auth for demo
//   const handleAdminLogin = () => {
//     // Simple hardcoded admin code - in production, use proper auth
//     if (adminCode === "ARPIT2024ADMIN") {
//       setIsAuthenticated(true);
//       loadQuotes();
//       toast({
//         title: "Admin Access Granted",
//         description: "Welcome to the Admin Portal",
//       });
//     } else {
//       toast({
//         title: "Access Denied",
//         description: "Invalid admin code",
//         variant: "destructive",
//       });
//     }
//   };

//   const loadQuotes = async () => {
//     setLoading(true);
//     try {
//       console.log('Loading quotes...');
//       const { data, error } = await supabase
//         .from('quotes')
//         .select('*')
//         .order('created_at', { ascending: false });

//       console.log('Quotes response:', { data, error });
      
//       if (error) {
//         console.error('Supabase error:', error);
//         throw error;
//       }
      
//       setQuotes(data || []);
//       console.log('Quotes loaded successfully:', data?.length || 0);
//     } catch (error) {
//       console.error('Error loading quotes:', error);
//       toast({
//         title: "Error",
//         description: `Failed to load quotes: ${error.message || 'Unknown error'}`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteQuote = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this quote?")) return;

//     try {
//       const { error } = await supabase
//         .from('quotes')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;

//       setQuotes(quotes.filter(q => q.id !== id));
//       toast({
//         title: "Quote Deleted",
//         description: "Quote has been successfully deleted",
//       });
//     } catch (error) {
//       console.error('Error deleting quote:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete quote",
//         variant: "destructive",
//       });
//     }
//   };

//   const exportToExcel = () => {
//     const exportData = filteredQuotes.map(quote => ({
//       'Date': new Date(quote.created_at).toLocaleDateString(),
//       'Name': quote.name,
//       'Phone': quote.phone,
//       'Email': quote.email || 'N/A',
//       'Entity Type': quote.entity_type || 'N/A',
//       'Solution Type': quote.solution_classification || 'N/A',
//       'Customer Type': quote.customer_type || 'N/A',
//       'Area (sq ft)': quote.estimated_area_sqft || 'N/A',
//       'Roof Area (sq ft)': quote.roof_area || 'N/A',
//       'Monthly Bill': quote.monthly_bill || quote.monthly_bill_range || 'N/A',
//       'Power Demand (kW)': quote.power_demand_kw || 'N/A',
//       'Location': quote.project_location || 'N/A',
//       'Product': quote.product_name || 'N/A',
//       'Category': quote.product_category || 'N/A',
//       'Source': quote.source,
//       'Referral Name': quote.referral_name || 'N/A',
//       'Referral Phone': quote.referral_phone || 'N/A',
//       'Referral Source': quote.referral_source || 'N/A',
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Quotes');
    
//     const fileName = `solar_quotes_${new Date().toISOString().split('T')[0]}.xlsx`;
//     XLSX.writeFile(wb, fileName);

//     toast({
//       title: "Export Complete",
//       description: `${exportData.length} quotes exported successfully`,
//     });
//   };

//   // Filter quotes based on search and filters
//   const filteredQuotes = quotes.filter(quote => {
//     const matchesSearch = 
//       quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       quote.phone.includes(searchTerm) ||
//       (quote.email && quote.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (quote.project_location && quote.project_location.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesFilter = filterSource === "all" || quote.source === filterSource;
    
//     return matchesSearch && matchesFilter;
//   });

//   // Statistics
//   const stats = {
//     total: quotes.length,
//     today: quotes.filter(q => new Date(q.created_at).toDateString() === new Date().toDateString()).length,
//     thisWeek: quotes.filter(q => {
//       const quoteDate = new Date(q.created_at);
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);
//       return quoteDate >= weekAgo;
//     }).length,
//     bySource: {
//       'Quote Form': quotes.filter(q => q.source === 'Quote Form').length,
//       'AI Chatbot': quotes.filter(q => q.source === 'AI Chatbot').length,
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
//           <Card className="w-full max-w-md">
//             <CardHeader className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Shield className="w-8 h-8 text-white" />
//               </div>
//               <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
//               <p className="text-muted-foreground">Enter admin code to access</p>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="adminCode">Admin Code</Label>
//                 <Input
//                   id="adminCode"
//                   type="password"
//                   value={adminCode}
//                   onChange={(e) => setAdminCode(e.target.value)}
//                   placeholder="Enter admin code"
//                   onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
//                 />
//               </div>
//               <Button onClick={handleAdminLogin} className="w-full">
//                 Access Admin Portal
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//         
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       
//       <div className="p-4 pt-24">
//         <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Solar Quotes Admin Portal</h1>
//               <p className="text-gray-600">Manage all quote requests from forms and AI chatbot</p>
//             </div>
//             <div className="flex gap-2">
//               <Button onClick={loadQuotes} variant="outline" size="sm">
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Refresh
//               </Button>
//               <Button onClick={exportToExcel} size="sm">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export Excel
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <TrendingUp className="h-8 w-8 text-blue-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Total Quotes</p>
//                   <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Calendar className="h-8 w-8 text-green-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">Today</p>
//                   <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Calendar className="h-8 w-8 text-purple-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">This Week</p>
//                   <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Building className="h-8 w-8 text-orange-600" />
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">AI Chatbot</p>
//                   <p className="text-2xl font-bold text-gray-900">{stats.bySource['AI Chatbot']}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters and Search */}
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <Input
//                     placeholder="Search by name, phone, email, or location..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   value={filterSource}
//                   onChange={(e) => setFilterSource(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-md bg-white"
//                 >
//                   <option value="all">All Sources</option>
//                   <option value="Quote Form">Quote Forms</option>
//                   <option value="AI Chatbot">AI Chatbot</option>
//                 </select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Quotes Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Quote Requests ({filteredQuotes.length})</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="text-center py-8">Loading...</div>
//             ) : filteredQuotes.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">No quotes found</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left p-3">Date</th>
//                       <th className="text-left p-3">Name</th>
//                       <th className="text-left p-3">Contact</th>
//                       <th className="text-left p-3">Type</th>
//                       <th className="text-left p-3">Source</th>
//                       <th className="text-left p-3">Location</th>
//                       <th className="text-left p-3">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredQuotes.map((quote) => (
//                       <tr key={quote.id} className="border-b hover:bg-gray-50">
//                         <td className="p-3">
//                           {new Date(quote.created_at).toLocaleDateString()}
//                         </td>
//                         <td className="p-3 font-medium">{quote.name}</td>
//                         <td className="p-3">
//                           <div className="flex items-center gap-2">
//                             <Phone className="w-4 h-4 text-gray-400" />
//                             <span className="text-sm">{quote.phone}</span>
//                           </div>
//                           {quote.email && (
//                             <div className="flex items-center gap-2 mt-1">
//                               <Mail className="w-4 h-4 text-gray-400" />
//                               <span className="text-sm text-gray-600">{quote.email}</span>
//                             </div>
//                           )}
//                         </td>
//                         <td className="p-3">
//                           <Badge variant={quote.entity_type === 'Individual' ? 'secondary' : 'default'}>
//                             {quote.entity_type || 'N/A'}
//                           </Badge>
//                         </td>
//                         <td className="p-3">
//                           <Badge variant={quote.source === 'AI Chatbot' ? 'outline' : 'default'}>
//                             {quote.source}
//                           </Badge>
//                         </td>
//                         <td className="p-3">
//                           {quote.project_location && (
//                             <div className="flex items-center gap-2">
//                               <MapPin className="w-4 h-4 text-gray-400" />
//                               <span className="text-sm">{quote.project_location}</span>
//                             </div>
//                           )}
//                         </td>
//                         <td className="p-3">
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => {
//                                 setSelectedQuote(quote);
//                                 setIsDetailOpen(true);
//                               }}
//                             >
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => deleteQuote(quote.id)}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Quote Detail Modal */}
//         <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
//           <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Quote Details</DialogTitle>
//             </DialogHeader>
//             {selectedQuote && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Name</Label>
//                     <p className="font-medium">{selectedQuote.name}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Phone</Label>
//                     <p>{selectedQuote.phone}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Email</Label>
//                     <p>{selectedQuote.email || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Entity Type</Label>
//                     <p>{selectedQuote.entity_type || 'Not specified'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Solution Type</Label>
//                     <p>{selectedQuote.solution_classification || 'Not specified'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Customer Type</Label>
//                     <p>{selectedQuote.customer_type || 'Not specified'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Installation Area</Label>
//                     <p>{selectedQuote.estimated_area_sqft ? `${selectedQuote.estimated_area_sqft} sq ft` : 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Roof Area</Label>
//                     <p>{selectedQuote.roof_area ? `${selectedQuote.roof_area} sq ft` : 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Monthly Bill</Label>
//                     <p>{selectedQuote.monthly_bill ? `â‚¹${selectedQuote.monthly_bill}` : selectedQuote.monthly_bill_range || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Power Demand</Label>
//                     <p>{selectedQuote.power_demand_kw ? `${selectedQuote.power_demand_kw} kW` : 'Not provided'}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <Label className="text-sm font-medium text-gray-600">Location</Label>
//                     <p>{selectedQuote.project_location || 'Not provided'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Product</Label>
//                     <p>{selectedQuote.product_name || 'Not specified'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Category</Label>
//                     <p>{selectedQuote.product_category || 'Not specified'}</p>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Source</Label>
//                     <Badge>{selectedQuote.source}</Badge>
//                   </div>
//                   <div>
//                     <Label className="text-sm font-medium text-gray-600">Date</Label>
//                     <p>{new Date(selectedQuote.created_at).toLocaleString()}</p>
//                   </div>
//                   {selectedQuote.referral_name && (
//                     <>
//                       <div>
//                         <Label className="text-sm font-medium text-gray-600">Referral Name</Label>
//                         <p>{selectedQuote.referral_name}</p>
//                       </div>
//                       <div>
//                         <Label className="text-sm font-medium text-gray-600">Referral Phone</Label>
//                         <p>{selectedQuote.referral_phone || 'Not provided'}</p>
//                       </div>
//                     </>
//                   )}
//                   {selectedQuote.referral_source && (
//                     <div>
//                       <Label className="text-sm font-medium text-gray-600">Referral Source</Label>
//                       <p>{selectedQuote.referral_source}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//         </div>
//       </div>
//       
//     </div>
//   );
// };

// export default AdminPage;













import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { 
  Shield, Download, RefreshCw, Trash2, Eye, Search, Calendar, Phone, Mail, MapPin, Building, TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
// import Navbar
// import Footer

// Interface remains the same
interface QuoteData {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  entity_type?: 'Individual' | 'Enterprise';
  solution_classification?: 'Residential' | 'Commercial' | 'Commercial and industrial DG' | 'BIPv' | 'Utility-scale';
  estimated_area_sqft?: number;
  monthly_bill?: number;
  monthly_bill_range?: string;
  power_demand_kw?: number;
  project_location?: string;
  referral_name?: string;
  referral_phone?: string;
  product_name?: string;
  product_category?: string;
  source: 'Quote Form' | 'AI Chatbot' | 'Reliance Quote Form' | 'Shakti Quote Form';
  customer_type?: string;
  roof_area?: number;
  referral_source?: string;
}

// ====================================================================
// 1. SMALLER, FOCUSED COMPONENTS
// ====================================================================

const StatisticsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="p-6 flex items-center">
        <TrendingUp className="h-8 w-8 text-blue-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Quotes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6 flex items-center">
        <Calendar className="h-8 w-8 text-green-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Today</p>
          <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6 flex items-center">
        <Calendar className="h-8 w-8 text-purple-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6 flex items-center">
        <Building className="h-8 w-8 text-orange-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">AI Chatbot</p>
          <p className="text-2xl font-bold text-gray-900">{stats.bySource['AI Chatbot']}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const FilterBar = ({ searchTerm, setSearchTerm, filterSource, setFilterSource }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, phone, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md bg-white">
            <option value="all">All Sources</option>
            <option value="Quote Form">Quote Forms</option>
            <option value="AI Chatbot">AI Chatbot</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuoteTable = ({ quotes, onView, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-3">Date</th>
          <th className="text-left p-3">Name</th>
          <th className="text-left p-3">Contact</th>
          <th className="text-left p-3">Type</th>
          <th className="text-left p-3">Source</th>
          <th className="text-left p-3">Location</th>
          <th className="text-left p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((quote) => (
          <tr key={quote.id} className="border-b hover:bg-gray-50">
            <td className="p-3 whitespace-nowrap">{new Date(quote.created_at).toLocaleDateString()}</td>
            <td className="p-3 font-medium">{quote.name}</td>
            <td className="p-3">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{quote.phone}</span></div>
              {quote.email && <div className="flex items-center gap-2 mt-1"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{quote.email}</span></div>}
            </td>
            <td className="p-3"><Badge variant={quote.entity_type === 'Individual' ? 'secondary' : 'default'}>{quote.entity_type || 'N/A'}</Badge></td>
            <td className="p-3"><Badge variant={quote.source === 'AI Chatbot' ? 'outline' : 'default'}>{quote.source}</Badge></td>
            <td className="p-3">{quote.project_location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>{quote.project_location}</span></div>}</td>
            <td className="p-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onView(quote)}><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(quote.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-end gap-4 p-4">
        <span className="text-sm text-gray-600">Page {currentPage + 1} of {totalPages}</span>
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
                <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>
                Next <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
);


const QuoteDetailModal = ({ isOpen, onOpenChange, quote }) => {
    if (!quote) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Quote Details</DialogTitle></DialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Details are rendered here */}
                        <div><Label className="text-sm font-medium text-gray-600">Name</Label><p className="font-medium">{quote.name}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Phone</Label><p>{quote.phone}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Email</Label><p>{quote.email || 'Not provided'}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Entity Type</Label><p>{quote.entity_type || 'Not specified'}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Monthly Bill</Label><p>{quote.monthly_bill ? `â‚¹${quote.monthly_bill}` : quote.monthly_bill_range || 'Not provided'}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Power Demand</Label><p>{quote.power_demand_kw ? `${quote.power_demand_kw} kW` : 'Not provided'}</p></div>
                        <div className="col-span-2"><Label className="text-sm font-medium text-gray-600">Location</Label><p>{quote.project_location || 'Not provided'}</p></div>
                        <div><Label className="text-sm font-medium text-gray-600">Source</Label><Badge>{quote.source}</Badge></div>
                        <div><Label className="text-sm font-medium text-gray-600">Date</Label><p>{new Date(quote.created_at).toLocaleString()}</p></div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};


// ====================================================================
// 2. MAIN ADMIN PAGE COMPONENT
// ====================================================================

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [allQuotes, setAllQuotes] = useState<QuoteData[]>([]); // For stats and export
  const [pagedQuotes, setPagedQuotes] = useState<QuoteData[]>([]); // For table display
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const pageSize = 10; // 10 quotes per page

  // Admin authentication (kept as is)
  const handleAdminLogin = () => {
    if (adminCode === "ARPIT2024ADMIN") {
      setIsAuthenticated(true);
      toast({ title: "Admin Access Granted", description: "Welcome to the Admin Portal" });
    } else {
      toast({ title: "Access Denied", description: "Invalid admin code", variant: "destructive" });
    }
  };

  // Memoized load function to prevent re-creation
  const loadQuotes = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      // Fetch total count and paged data in one go
      const { data, error, count } = await supabase
        .from('solar_quote_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      setPagedQuotes(data || []);
      setTotalQuotes(count || 0);
      setCurrentPage(page);
      
      // Load all quotes once for stats if not already loaded
      if (allQuotes.length === 0) {
          const { data: allData } = await supabase.from('solar_quote_requests').select('*');
          setAllQuotes(allData || []);
      }
      
    } catch (error) {
      toast({ title: "Error", description: `Failed to load quotes: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [allQuotes.length, toast]); // Dependency on toast and allQuotes.length

  // useEffect to load quotes on auth and page change
  useEffect(() => {
    if (isAuthenticated) {
      loadQuotes(currentPage);
    }
  }, [isAuthenticated, currentPage, loadQuotes]);
  
  // ====================================================================
  // 3. REAL-TIME SUBSCRIPTION
  // ====================================================================
  useEffect(() => {
    if (!isAuthenticated) return;
  
    const channel = supabase.channel('solar_quote_requests_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solar_quote_requests' },
        (payload) => {
          console.log('New quote received!', payload);
          // Show a toast notification
          toast({
            title: "ðŸš€ New Quote Received!",
            description: `Request from ${payload.new.name}. Click to update.`,
            action: <ToastAction altText="Refresh" onClick={() => loadQuotes(0)}>Refresh List</ToastAction>,
          });
          // Also update total count for stats
          setTotalQuotes(prev => prev + 1);
          setAllQuotes(prev => [payload.new as QuoteData, ...prev]);
        }
      )
      .subscribe();
  
    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, toast, loadQuotes]);


  const deleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    try {
      const { error } = await supabase.from('solar_quote_requests').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Quote Deleted" });
      loadQuotes(currentPage); // Refresh current page
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete quote", variant: "destructive" });
    }
  };

  const exportToExcel = () => {
    // Note: This exports ALL quotes, not just the filtered/paged ones.
    const exportData = allQuotes.map(quote => ({
      'Date': new Date(quote.created_at).toLocaleDateString(), 'Name': quote.name, 'Phone': quote.phone, 'Email': quote.email || 'N/A', 'Source': quote.source,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotes');
    XLSX.writeFile(wb, `solar_quotes_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({ title: "Export Complete", description: `${exportData.length} quotes exported.` });
  };
  
  // Filtering now happens on the paged data for display, but could be adapted
  // to re-fetch from Supabase for server-side filtering. For simplicity, we filter client-side.
  const filteredQuotes = pagedQuotes.filter(quote => 
    (quote.name.toLowerCase().includes(searchTerm.toLowerCase()) || quote.phone.includes(searchTerm)) &&
    (filterSource === "all" || quote.source === filterSource)
  );

  const stats = {
    total: allQuotes.length,
    today: allQuotes.filter(q => new Date(q.created_at).toDateString() === new Date().toDateString()).length,
    thisWeek: allQuotes.filter(q => new Date(q.created_at) >= new Date(new Date().setDate(new Date().getDate() - 7))).length,
    bySource: { 'AI Chatbot': allQuotes.filter(q => q.source === 'AI Chatbot').length }
  };
  
  const totalPages = Math.ceil(totalQuotes / pageSize);
  
  // --- RENDER LOGIC --- //

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"><Shield className="w-8 h-8 text-white" /></div>
              <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode">Admin Code</Label>
                <Input id="adminCode" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} />
              </div>
              <Button onClick={handleAdminLogin} className="w-full">Access Admin Portal</Button>
            </CardContent>
          </Card>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-4 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Solar Quotes Admin Portal</h1>
                <p className="text-gray-600">Managing all solar quote requests</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => loadQuotes(0)} variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                <Button onClick={exportToExcel} size="sm"><Download className="w-4 h-4 mr-2" />Export All</Button>
              </div>
            </div>
          </div>

          <StatisticsGrid stats={stats} />
          
          <FilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterSource={filterSource} setFilterSource={setFilterSource} />

          <Card>
            <CardHeader><CardTitle>Quote Requests ({totalQuotes})</CardTitle></CardHeader>
            <CardContent>
              {loading ? <div className="text-center py-8">Loading...</div> : 
               filteredQuotes.length === 0 ? <div className="text-center py-8 text-gray-500">No quotes found</div> : 
               <QuoteTable quotes={filteredQuotes} onView={(quote) => { setSelectedQuote(quote); setIsDetailOpen(true); }} onDelete={deleteQuote} />}
            </CardContent>
            {totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => loadQuotes(page)} />}
          </Card>
        </div>
      </div>
      
      <QuoteDetailModal isOpen={isDetailOpen} onOpenChange={setIsDetailOpen} quote={selectedQuote} />
    </div>
  );
};

export default AdminPage;


