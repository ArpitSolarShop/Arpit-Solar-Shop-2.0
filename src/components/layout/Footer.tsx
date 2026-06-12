/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";

// Inline Pinterest Icon to match your Navbar component
const PinterestIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12c1.018 0 2.006-.133 2.939-.379-1.339-.723-2.028-2.168-2.028-2.168s-.277-1.104-.277-2.615c0-1.53.874-2.676 1.96-2.676.926 0 1.375.695 1.375 1.528 0 .93-.593 2.322-.9 3.616-.256 1.083.544 1.966 1.613 1.966 1.938 0 3.432-2.043 3.432-4.991 0-2.612-1.878-4.439-4.555-4.439-3.103 0-4.924 2.326-4.924 4.732 0 .937.361 1.943.814 2.486.089.108.102.202.075.313-.08.336-.258 1.035-.293 1.181-.046.192-.149.233-.344.14-1.295-.603-2.106-2.494-2.106-4.016 0-3.273 2.378-6.278 6.854-6.278 3.599 0 6.398 2.565 6.398 5.996 0 3.578-2.255 6.456-5.386 6.456-1.051 0-2.041-.547-2.379-1.201 0 0-.52 1.982-.647 2.469-.234.897-.866 2.024-1.289 2.708.97.299 2 .458 3.063.458 6.626 0 12-5.374 12-12S18.626 0 12 0z" />
    </svg>
);

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="bg-solar-navy text-white">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Company Info with Button-Like Logo */}
                        <div className="space-y-4">
                            <Link href="/" className="inline-block">
                                <div className="bg-white rounded-md shadow-md transition-shadow duration-200 hover:shadow-lg">
                                    <Image
                                        src="/logo.webp"
                                        alt="Arpit Solar Logo"
                                        width={120}
                                        height={56}
                                        className="h-14 w-auto p-2 md:p-3"
                                    />
                                </div>
                            </Link>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Leading the transition to clean, renewable energy with cutting-edge solar solutions.
                                Powering homes and businesses across India with sustainable energy.
                            </p>

                            <div className="text-sm text-gray-300 space-y-2 mt-2">
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 shrink-0 text-solar-orange mt-0.5" />
                                    <span>Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP), India</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-solar-orange" />
                                    <span>+91-9005770466</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-solar-orange" />
                                    <span>info@arpitsolar.com</span>
                                </p>
                            </div>

                            <div className="flex space-x-3 mt-4">
                                <Button asChild variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <a href="https://www.facebook.com/@arpitsolar" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <a href="https://www.linkedin.com/in/arpit-solar-shop" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <a href="https://www.instagram.com/arpitsolarweb/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <a href="https://in.pinterest.com/arpitsolar/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><PinterestIcon /></a>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <a href="https://youtube.com/@arpitsolar" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
                                </Button>
                            </div>
                        </div>

                        {/* Solutions Links Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Solutions</h3>
                            <ul className="space-y-2">
                                {[{ name: "Residential", href: "/solutions/residential" }, { name: "Commercial/Industrial", href: "/solutions/commercial-industrial" },].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-300 hover:text-solar-orange transition-colors duration-200 text-sm"> {link.name} </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Products Links Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Products</h3>
                            <ul className="space-y-2">
                                {[
                                    { name: "Reliance Solar", href: "/reliance", disabled: true, disabledLabel: "Coming Soon" },
                                    { name: "Shakti Solar", href: "/shakti-solar", disabled: true, disabledLabel: "Discontinued" },
                                    { name: "Tata Solar", href: "/tata-solar" },
                                    { name: "Waree | Adani", href: "/integrated" },
                                    { name: "Hybrid Solar", href: "/hybrid-solar" },
                                ].map((link) => (
                                    <li key={link.name}>
                                        {link.disabled ? (
                                            <span className="text-gray-500 text-sm cursor-not-allowed inline-flex items-center gap-2">
                                                {link.name}
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${link.disabledLabel === "Discontinued" ? "bg-gray-700/40 text-gray-400" : "bg-amber-900/40 text-amber-400"}`}>{link.disabledLabel}</span>
                                            </span>
                                        ) : (
                                            <Link href={link.href} className="text-gray-300 hover:text-solar-orange transition-colors duration-200 text-sm"> {link.name} </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company & Other Links Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Company</h3>
                            <ul className="space-y-2">
                                {[{ name: "About Us", href: "/about-us" }, { name: "Services", href: "/services" }, { name: "Contact Us", href: "/contact" },].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-300 hover:text-solar-orange transition-colors duration-200 text-sm"> {link.name} </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Top Locations */}
                            <h3 className="text-lg font-semibold mt-6">Top Locations</h3>
                            <ul className="space-y-2">
                                {[{ name: "Solar in Varanasi", href: "/solar-installation/varanasi" }, { name: "Solar in Mau", href: "/solar-installation/mau" }, { name: "Solar in Jaunpur", href: "/solar-installation/jaunpur" }].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-300 hover:text-solar-orange transition-colors duration-200 text-sm"> {link.name} </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Consent & Promotional Message Bar */}
                <div className="border-t border-white/10 bg-[#071a3d]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <p className="text-xs sm:text-sm text-gray-400 text-center leading-relaxed">
                            By using this website, you agree to receive promotional messages through WhatsApp / RCS / SMS according to our{" "}
                            <Link href="/terms-and-conditions" className="text-solar-orange hover:underline font-medium">Terms &amp; Conditions</Link>
                            {" "}and{" "}
                            <Link href="/privacy-policy" className="text-solar-orange hover:underline font-medium">Privacy Policy</Link>.
                            {" "}You also consent to receive marketing and promotional emails, messages, WhatsApp communications, and calls from Arpit Solar Shop.
                            {" "}You may opt out at any time by replying STOP or contacting us at info@arpitsolar.com.
                        </p>
                    </div>
                </div>

                {/* UPDATED Bottom Bar */}
                <div className="border-t border-white/10 bg-solar-navy/90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                            <p className="text-gray-400 text-sm order-2 md:order-1"> © {currentYear} Arpit Solar Shop. All rights reserved. </p>
                            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-6 order-1 md:order-2">
                                {/* These are now proper links to dedicated pages */}
                                <Link href="/privacy-policy" className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200"> Privacy Policy </Link>
                                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200"> Terms &amp; Conditions </Link>
                                <Link href="/admin/login" className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200">Admin</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;