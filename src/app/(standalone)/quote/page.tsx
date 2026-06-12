import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { QuoteForm } from "./QuoteForm";
import { EMICalculatorWidget } from "./EMICalculatorWidget";
import { Phone, Mail, Shield, CheckCircle2, IndianRupee, SunMedium, Smartphone, Zap, Wrench, ThumbsUp, ChevronDown, Star, MapPin } from "lucide-react";
import { companyDetails } from "@/lib/companyDetails";
import { siteConfig } from "@/config/site";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const cityTranslations: Record<string, string> = {
    "varanasi": "वाराणसी",
    "gorakhpur": "गोरखपुर",
    "azamgarh": "आजमगढ़",
    "ghazipur": "गाजीपुर",
    "mirzapur": "मिर्जापुर",
    "jaunpur": "जौनपुर",
    "mau": "मऊ",
    "ballia": "बलिया",
    "bhadhohi": "भदोही",
    "chandauli": "चंदौली"
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const rawCity = typeof resolvedParams.city === 'string' ? resolvedParams.city : 'Varanasi';
    const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
    
    const url = `${siteConfig.url}/quote${rawCity.toLowerCase() !== 'varanasi' ? `?city=${rawCity}` : ''}`;

    return {
        title: `Best Solar Company in ${city} & Purvanchal | Arpit Solar Shop`,
        description: `Looking for the best solar company in ${city} and Purvanchal? Arpit Solar Shop offers affordable solar panel installation with government subsidy, guaranteed savings & expert service since 2013.`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `Best Solar Company in ${city} | Arpit Solar Shop`,
            description: `Looking for the best solar company in ${city}? Get a free quote for solar panel installation with government subsidy.`,
            url: url,
            siteName: siteConfig.name,
            images: [
                {
                    url: `${siteConfig.url}/hero-family.png`,
                    width: 1200,
                    height: 630,
                    alt: "Happy family with solar panels",
                }
            ],
            locale: "en_IN",
            type: "website",
        }
    };
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default async function QuoteLandingPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const rawCity = typeof resolvedParams.city === 'string' ? resolvedParams.city : 'Varanasi';
    const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);
    const hindiCity = cityTranslations[rawCity.toLowerCase()] || city;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SolarInstallationCompany",
        "name": companyDetails.name,
        "image": `${siteConfig.url}${companyDetails.logo}`,
        "@id": `${siteConfig.url}/quote?city=${rawCity}`,
        "url": `${siteConfig.url}/quote?city=${rawCity}`,
        "telephone": companyDetails.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": companyDetails.headOffice,
            "addressLocality": city,
            "addressRegion": "UP",
            "addressCountry": "IN"
        },
        "description": `Best solar company in ${city} offering zero-investment solar panel installation with government subsidy.`,
        "areaServed": {
            "@type": "City",
            "name": city
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "5000"
        }
    };

    return (
        <main className="min-h-[100dvh] bg-white font-sans text-slate-900 selection:bg-blue-100">
            {/* Meta Pixel Code */}
            <Script id="meta-pixel" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '3086320038230023');
                    fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=3086320038230023&ev=PageView&noscript=1" alt="" />
            </noscript>
            {/* End Meta Pixel Code */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <QuoteHeader />

            {/* ─── HERO ─── */}
            <section className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image src="/hero-family.png" alt="Happy family with solar panels" fill className="object-cover object-right-top" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:to-transparent" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
                        {/* Left text */}
                        <div className="flex-1 text-[#0B1221] pt-2 lg:pt-6">
                            <p className="text-lg sm:text-xl text-slate-500 font-semibold mb-3">नमस्ते {hindiCity} !</p>
                            <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold leading-[1.15] tracking-tight mb-2">Power Your Home with Solar in {city}</h1>
                            <h2 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold leading-[1.15] tracking-tight text-blue-600 mb-8">At Zero Investment!</h2>
                            
                            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200 mb-10 shadow-sm">
                                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-4 w-auto object-contain" />
                                    <span className="text-amber-400 ml-1">★</span> 4.9/5
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                                <span className="text-sm font-medium text-slate-600">5,000+ happy homes</span>
                            </div>

                            <div className="hidden lg:flex gap-6 text-sm">
                                <a href="#emi-calculator" className="text-slate-600 hover:text-blue-600 font-semibold transition">🧮 Try Solar Calculator →</a>
                                <Link href="/blog" className="text-slate-600 hover:text-blue-600 font-semibold transition">📖 Explore our Blog →</Link>
                            </div>
                        </div>
                        {/* Right form */}
                        <div className="w-full lg:w-[440px] xl:w-[460px] shrink-0 mt-8 lg:mt-0">
                            <QuoteForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY TRUST ─── */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-center text-[#0B1221] mb-14 leading-tight">
                        Why Families Across {city} <br className="hidden sm:block" /> Trust Arpit Solar Shop
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { img: "/customers/customer-1.jpg", title: "Guaranteed Savings", desc: `${city}'s most trusted solar partner with guaranteed savings on electricity bills.` },
                            { img: "/customers/customer-2.jpg", title: "Hassle-free process", desc: "Installation, subsidy and service — all handled directly by us. Zero middlemen." },
                            { img: "/customers/customer-3.jpg", title: "Storm-proof Structure", desc: "80-micron GI structures tested for 150 km/h winds — built for India's toughest weather." },
                            { img: "/customers/customer-4.jpg", title: "Reliable after-sales", desc: "Regular proactive maintenance for steady, year-after-year performance." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col group cursor-pointer">
                                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="text-[17px] font-bold text-[#0B1221] mb-2 leading-snug">{item.title}</h3>
                                <p className="text-[13px] text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── GUARANTEED SAVINGS (GoodZero-style) ─── */}
            <section className="bg-gradient-to-r from-white via-[#F0F7FF] to-[#E1EFFF] py-16 lg:py-20 border-y border-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="lg:w-1/3">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mb-2">Introducing</p>
                            <h3 className="text-[32px] sm:text-[40px] font-black text-[#0B1221] mb-3 tracking-tight leading-none">GoodZero™</h3>
                            <p className="text-slate-600 text-sm font-semibold mb-6">India&apos;s only Guaranteed Solar<br/>Savings Plan</p>
                            <a href="#quote-form" className="inline-flex px-8 py-3.5 bg-[#0B1221] text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-blue-900/10">Know more about GoodZero</a>
                        </div>

                        <div className="lg:w-1/3 flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1221] text-sm mb-1">Money-back promise on<br/>savings</h4>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Wrench className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1221] text-sm mb-1">Regular proactive<br/>maintenance visits</h4>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1221] text-sm mb-1">EMI begins following successful<br/>commissioning</h4>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 flex justify-center lg:justify-end shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 blur-[80px] rounded-full opacity-30"></div>
                                <Shield className="w-48 h-48 lg:w-64 lg:h-64 text-blue-500 relative z-10 drop-shadow-2xl fill-blue-500/10 stroke-[0.5]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── ZERO INVESTMENT (Dark) ─── */}
            <section id="emi-calculator" className="bg-[#0B1221] py-16 lg:py-24 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">Go Solar with<br /><span className="text-blue-400">Zero Investment</span></h2>
                            <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">Government subsidy covers your downpayment, and monthly solar saving covers your EMI.</p>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 max-w-md backdrop-blur">
                                <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><Phone className="h-5 w-5 text-blue-400" /></div>
                                <div>
                                    <h4 className="font-bold text-white mb-0.5 text-sm">Got questions?</h4>
                                    <p className="text-slate-400 text-xs mb-2">Our solar experts are just a call away.</p>
                                    <a href="tel:+919044555572" className="text-blue-400 font-bold text-sm hover:text-blue-300">+91 9044555572 →</a>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <EMICalculatorWidget />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STATS ─── */}
            <section className="py-14 lg:py-16 bg-[#FAFAFA] border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-center text-[#0B1221] mb-12">Powering Homes Across India</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        {[
                            { icon: <SunMedium className="h-6 w-6" />, val: "5000+", lbl: "Installations Done" },
                            { icon: <ThumbsUp className="h-6 w-6" />, val: "3453+", lbl: "Happy Customers" },
                            { icon: <Shield className="h-6 w-6" />, val: "25 Yrs", lbl: "Module Warranty" },
                            { icon: <Star className="h-6 w-6" />, val: "3123+", lbl: "Awards Won" },
                        ].map((s, i) => (
                            <div key={i} className="text-center p-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 mx-auto">{s.icon}</div>
                                <div className="text-[28px] font-black text-[#0B1221] mb-1 leading-none">{s.val}</div>
                                <div className="text-[13px] text-slate-500 font-medium">{s.lbl}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-[15px] font-medium text-[#0B1221]">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <span>{city}'s most trusted solar partner with over 10 years of experience.</span>
                        </div>
                        <a href="#quote-form" className="px-6 py-2.5 bg-[#0B1221] text-white rounded-lg font-bold hover:bg-slate-800 transition text-sm shadow-md">Book a free consult</a>
                    </div>
                </div>
            </section>

            {/* ─── MONITORING APP ─── */}
            <section className="py-16 lg:py-24 bg-[#E0F2FE] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1221] mb-4 leading-tight">Real-time Monitoring App</h2>
                            <p className="text-slate-700 font-medium text-lg mb-8 max-w-md">Track the performance of your Solar System, anywhere, anytime.</p>
                            
                            <div className="inline-block cursor-pointer hover:opacity-90 transition-opacity">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-14" />
                            </div>
                        </div>
                        <div className="lg:w-1/2 flex justify-center relative">
                            {/* Decorative elements from image */}
                            <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl p-3 flex items-center gap-3 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><SunMedium className="w-4 h-4 text-blue-600" /></div>
                                <div className="text-xs font-bold text-[#0B1221]">Total Power<br/>Generated</div>
                            </div>
                            <div className="absolute bottom-20 left-10 bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                                <div className="text-xs font-bold text-[#0B1221]">System Status:<br/>Online</div>
                            </div>
                            <div className="w-[260px] h-[540px] bg-white rounded-[2.5rem] shadow-2xl border-[7px] border-slate-900 overflow-hidden relative z-10">
                                <div className="w-28 h-5 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-10" />
                                <div className="p-5 pt-10 h-full flex flex-col bg-slate-50">
                                    <div className="text-center mb-5"><p className="text-xs text-slate-500 font-medium">Today&apos;s Generation</p><h3 className="text-3xl font-black text-blue-600">18.5 <span className="text-sm">kWh</span></h3></div>
                                    <div className="bg-white rounded-xl p-3 shadow-sm mb-3 border border-slate-100"><p className="text-[10px] text-slate-500 font-medium mb-0.5">System Status</p><div className="flex items-center gap-1.5 text-green-600 font-bold text-sm"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Online</div></div>
                                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex-1 flex flex-col"><p className="text-[10px] text-slate-500 font-medium mb-2">Weekly Savings</p><div className="flex items-end justify-between flex-1 gap-1.5">{[40,60,30,80,50,90,70].map((h,j) => (<div key={j} className="w-full bg-blue-100 rounded-t h-full flex items-end"><div className="w-full bg-blue-500 rounded-t" style={{height:`${h}%`}} /></div>))}</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ─── */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1221] mb-4">Happy Customers</h2>
                    <p className="text-slate-500 text-sm mb-12">Real reviews from Google Maps</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "Shashwat Tiwari", city: "Varanasi", stars: 5, quote: "Very professional solar installation service. The plant is working perfectly and electricity bills reduced a lot." },
                            { name: "Ashish Prajapati", city: "Varanasi", stars: 5, quote: "Bahut badhiya service hai aur product bhi ekdam original diye hai." },
                            { name: "Rani Xylo", city: "Varanasi", stars: 5, quote: "Unka Kam karne ka Tarika bahut achcha Laga service kafi acchi hai." },
                            { name: "Anmol Upadhyay", city: "Varanasi", stars: 5, quote: "Expert team, problem-solving time bhi shi hai inka." },
                            { name: "Shalu Mishra", city: "Varanasi", stars: 5, quote: "Good company very good service best product." },
                            { name: "Rahul Mishra", city: "Varanasi", stars: 5, quote: "Branded Solar panels at best price." },
                            { name: "Anushikha Mishra", city: "Varanasi", stars: 5, quote: "New connection taken, now going to see it uses, finally very happy." },
                            { name: "Arun Kumar", city: "Varanasi", stars: 5, quote: "V good 👍 bahut acchi service hai Arpit Solar ki." },
                            { name: "Sandeep Chaturvedi", city: "Varanasi", stars: 5, quote: "The company is very good 👍" },
                        ].map((t, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-7 border border-slate-100 relative">
                                <div className="flex gap-0.5 mb-4">{Array.from({length: t.stars}).map((_,j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                                <p className="text-slate-700 text-sm leading-relaxed mb-6">{t.quote}</p>
                                <div><div className="font-bold text-[#0B1221] text-sm">{t.name}</div><div className="text-xs text-slate-500">{t.city}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-14 lg:py-20 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1221] mb-10">FAQ</h2>
                    <div className="divide-y divide-slate-200">
                        {[
                            { q: "What's the solar panel price in Varanasi with subsidy?", a: "A 3kW system receives a PM Surya Ghar subsidy of up to ₹1,08,000. A 2kW system receives ₹90,000." },
                            { q: "Which solar is best for a house?", a: "An on-grid solar system is best for homes with reliable grid power, allowing savings via net metering. Off-grid is ideal for areas with frequent outages." },
                            { q: "How many ACs can run on a 3 kW solar system?", a: "A 3 kW system generates enough units daily to power one 1.5-ton AC along with standard home appliances." },
                            { q: "How does the zero-investment plan work?", a: "Government subsidy covers your down payment, and your monthly solar savings cover the EMI. So your out-of-pocket cost is effectively zero." },
                        ].map((faq, i) => (
                            <details key={i} className="group py-5">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <h3 className="font-bold text-[#0B1221] group-open:text-blue-600 transition-colors pr-4">{faq.q}</h3>
                                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="text-slate-600 text-sm leading-relaxed mt-3 pr-8">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <QuoteFooter />

            {/* ─── STICKY MOBILE CTA ─── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0B1221] border-t border-white/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-white"><p className="text-xs font-bold">Switch to solar at ₹0</p><p className="text-[10px] text-slate-400">Save up to ₹78,000 with subsidy</p></div>
                    <a href="#quote-form" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition shrink-0">Book Free Consultation</a>
                </div>
            </div>
        </main>
    );
}

/* ================================================================
   HEADER
   ================================================================ */
function QuoteHeader() {
    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between">
                <img src={companyDetails.logo} alt={companyDetails.name} className="h-9 lg:h-10 w-auto object-contain" />
                <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-slate-700">
                    <Link href="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link href="/services" className="hover:text-blue-600 transition">Services</Link>
                    <Link href="/residential" className="hover:text-blue-600 transition">Solutions</Link>
                    <Link href="/products" className="hover:text-blue-600 transition">Products</Link>
                    <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
                    <Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="#quote-form" className="px-6 py-2.5 bg-[#0B1221] text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition shadow-md">
                        Book a FREE Consultation
                    </a>
                </div>
            </div>
        </header>
    );
}

/* ================================================================
   FOOTER
   ================================================================ */
function QuoteFooter() {
    return (
        <footer className="bg-[#0B1221] text-slate-400 pt-14 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-10 pb-10 border-b border-slate-800">
                    <div className="col-span-2 md:col-span-4">
                        <img src={companyDetails.logo} alt={companyDetails.name} className="h-10 w-auto object-contain mb-4 brightness-0 invert" />
                        <p className="text-xs leading-relaxed text-slate-500 max-w-xs">Purvanchal&apos;s most trusted solar company. Powering homes with sustainable and affordable solar energy since 2013.</p>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold text-sm mb-3">Our Offerings</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/solar-installation/varanasi" className="hover:text-white transition">Solar Installation</Link></li>
                            <li><Link href="/hybrid-solar" className="hover:text-white transition">Hybrid Solar</Link></li>
                            <li><Link href="/solar-system/3kw-on-grid" className="hover:text-white transition">Solar Systems</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold text-sm mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
                            <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 md:col-span-4">
                        <h4 className="text-white font-bold text-sm mb-3">Contact Us</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" />{companyDetails.phone}, {companyDetails.alternatePhone}</li>
                            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 shrink-0" />{companyDetails.email}</li>
                            <li className="flex items-start gap-2 mt-2"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" /><span>{companyDetails.headOffice}</span></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
                    <p>© {new Date().getFullYear()} {companyDetails.name}. All rights reserved.</p>
                    <div className="flex gap-5">
                        <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
                        <Link href="/contact" className="hover:text-white transition">Contact Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
