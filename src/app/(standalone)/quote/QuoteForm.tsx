"use client";

import React, { useState } from "react";
import { submitHeroLead } from "@/app/actions/crm";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner"; 

export function QuoteForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        city: "",
        monthlyBill: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await submitHeroLead({
                ...formData,
                category: "Facebook Ad Quote Lead"
            }, "residential");

            if (res.success) {
                setSuccess(true);
                toast.success("Details Submitted!", {
                    description: "Our team will contact you shortly."
                });
            } else {
                throw new Error("Failed to submit");
            }
        } catch (err) {
            toast.error("Submission failed", {
                description: "Please try again or call us directly."
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                <p className="text-slate-600">
                    Your consultation request is received. Our solar experts will contact you shortly.
                </p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-blue-600 font-semibold text-sm hover:underline"
                >
                    Submit another request
                </button>
            </div>
        );
    }

    return (
        <div id="quote-form" className="bg-white rounded-[16px] shadow-[0_4px_30px_-5px_rgba(0,0,0,0.1),0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8 w-full max-w-[440px] mx-auto scroll-mt-8">
            <div className="mb-6">
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] leading-tight mb-2 tracking-tight">
                    Book a FREE Solar Consultation
                </h2>
                <p className="text-slate-500 text-[14px]">
                    And save up to ₹78,000 with subsidy
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input 
                        id="name"
                        type="text" 
                        required
                        className="peer w-full h-[54px] rounded-[8px] border border-slate-200 bg-[#F8FAFC] px-4 pt-5 pb-1 text-[16px] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder-transparent"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                    <label htmlFor="name" className="absolute left-4 top-1.5 text-[11px] font-medium text-slate-500 transition-all peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-slate-400 peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-blue-600 pointer-events-none">
                        Full Name
                    </label>
                </div>

                <div className="relative">
                    <input 
                        id="phone"
                        type="tel" 
                        required
                        pattern="[0-9]{10}"
                        title="10 digit mobile number"
                        className="peer w-full h-[54px] rounded-[8px] border border-slate-200 bg-[#F8FAFC] px-4 pt-5 pb-1 text-[16px] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder-transparent"
                        placeholder="Whatsapp Number"
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    />
                    <label htmlFor="phone" className="absolute left-4 top-1.5 text-[11px] font-medium text-slate-500 transition-all peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-slate-400 peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-blue-600 pointer-events-none">
                        Whatsapp Number
                    </label>
                </div>

                <div className="relative">
                    <input 
                        id="pincode"
                        type="text" 
                        required
                        className="peer w-full h-[54px] rounded-[8px] border border-slate-200 bg-[#F8FAFC] px-4 pt-5 pb-1 text-[16px] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all placeholder-transparent"
                        placeholder="PIN Code"
                        value={formData.city}
                        onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                    />
                    <label htmlFor="pincode" className="absolute left-4 top-1.5 text-[11px] font-medium text-slate-500 transition-all peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-slate-400 peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-blue-600 pointer-events-none">
                        PIN Code
                    </label>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5">
                        <label className="text-[14px] font-semibold text-slate-800">Monthly Electricity Bill</label>
                        <div className="w-4 h-4 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[10px] font-bold cursor-help" title="Select your average monthly electricity bill">i</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Up to ₹1500", "₹1500 - ₹3000", "₹3000 - ₹5000", "₹5000 - ₹10000", "More than ₹10000"].map((bill) => (
                            <button
                                key={bill}
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, monthlyBill: bill }))}
                                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                                    formData.monthlyBill === bill 
                                    ? "bg-[#0F172A] text-white shadow-md border border-transparent"
                                    : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm"
                                }`}
                            >
                                {bill}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-3 pb-1">
                    <div className="flex items-center h-5 mt-0.5">
                        <input
                            id="terms"
                            type="checkbox"
                            defaultChecked
                            required
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                    </div>
                    <label htmlFor="terms" className="text-[12px] text-slate-500 leading-snug">
                        I agree to Arpit Solar Shop <a href="#" className="text-blue-700 underline decoration-blue-700/30 font-medium">Terms of use</a> and <a href="#" className="text-blue-700 underline decoration-blue-700/30 font-medium">Privacy Policy</a>.
                    </label>
                </div>

                <div className="pt-2 relative">
                    <div className="absolute -top-3 -right-2 z-10 rotate-[-8deg]">
                        <div className="bg-[#FEF08A] text-yellow-900 text-[11px] font-bold px-2.5 py-1 rounded-[4px] shadow-sm border border-yellow-200/60 whitespace-nowrap">
                            Limited slots only!
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-[54px] bg-[#0B1221] hover:bg-slate-800 text-white rounded-[8px] font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-slate-900/10"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Please wait...</span>
                            </>
                        ) : (
                            <span>Book a FREE Consultation</span>
                        )}
                    </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 bg-[#F8FAFC] rounded-xl p-3">
                    <img src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=150&h=150&fit=crop" alt="Quote Matcher" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                        <p className="text-[13px] font-semibold text-slate-800">Got a quote already?</p>
                        <a href="#" className="text-[12px] font-bold text-blue-600 hover:underline">Try Quote Matcher →</a>
                    </div>
                </div>
            </form>
        </div>
    );
}
