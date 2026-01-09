import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import GetQuote from "./pages/GetQuote";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Sustainability from "./pages/Sustainability";

import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Reliance from "./pages/Reliance";
import ShaktiSolar from "./pages/ShaktiSolar";
import TataSolar from "./pages/TataSolar";
import Residential from "./pages/Residential";
import CommercialIndustrial from "./pages/CommercialIndustrial";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import HybridSolar from "./pages/HybridSolar";
import ProductManager from "./pages/ProductManager";
import Integrated from "./pages/Integrated";
import FloatingChatButton from "@/components/FloatingChatButton";
import CityPage from "./pages/CityPage"; // ✅ Import kept

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Standard Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/get-quote" element={<GetQuote />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about/sustainability" element={<Sustainability />} />
            
            <Route path="/about/us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reliance" element={<Reliance />} />
            <Route path="/shakti-solar" element={<ShaktiSolar />} />
            <Route path="/tata-solar" element={<TataSolar />} />
            <Route path="/solutions/residential" element={<Residential />} />
            <Route path="/solutions/commercial-industrial" element={<CommercialIndustrial />} />
            <Route path="/hybrid-solar" element={<HybridSolar />} />
            <Route path="/integrated" element={<Integrated />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/products" element={<ProductManager />} />

            {/* ✅ FIXED: Use a generic slug to catch "solar-in-..." URLs */}
            {/* This must be placed AFTER all specific routes but BEFORE the 404 */}
            <Route path="/:slug" element={<CityPage />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChatButton />
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;