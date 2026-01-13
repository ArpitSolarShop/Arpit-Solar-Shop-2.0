/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react"; // Import useState for managing modal state
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import Dialog components
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram } from "lucide-react";

// Inline Pinterest Icon to match your Navbar component
const PinterestIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12c1.018 0 2.006-.133 2.939-.379-1.339-.723-2.028-2.168-2.028-2.168s-.277-1.104-.277-2.615c0-1.53.874-2.676 1.96-2.676.926 0 1.375.695 1.375 1.528 0 .93-.593 2.322-.9 3.616-.256 1.083.544 1.966 1.613 1.966 1.938 0 3.432-2.043 3.432-4.991 0-2.612-1.878-4.439-4.555-4.439-3.103 0-4.924 2.326-4.924 4.732 0 .937.361 1.943.814 2.486.089.108.102.202.075.313-.08.336-.258 1.035-.293 1.181-.046.192-.149.233-.344.14-1.295-.603-2.106-2.494-2.106-4.016 0-3.273 2.378-6.278 6.854-6.278 3.599 0 6.398 2.565 6.398 5.996 0 3.578-2.255 6.456-5.386 6.456-1.051 0-2.041-.547-2.379-1.201 0 0-.52 1.982-.647 2.469-.234.897-.866 2.024-1.289 2.708.97.299 2 .458 3.063.458 6.626 0 12-5.374 12-12S18.626 0 12 0z" />
    </svg>
);

// Content for the modals
const policyData = {
    privacy: {
        title: "Privacy Policy",
        content: (
            <div className="space-y-4 text-sm text-gray-600">
                <p><strong>Last Updated:</strong> August 10, 2025</p>
                <p>Arpit Solar Shop ("us", "we", or "our") operates the arpitsolar.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
                <h3 className="font-semibold text-gray-800">1. Information Collection and Use</h3>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you. This may include personal data, such as your email address, name, phone number, and usage data.</p>
                <h3 className="font-semibold text-gray-800">2. Use of Data</h3>
                <p>Arpit Solar Shop uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to provide customer care and support, and to monitor the usage of the Service.</p>
                <h3 className="font-semibold text-gray-800">3. Data Security</h3>
                <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            </div>
        )
    },
    terms: {
        title: "Terms of Service",
        content: (
            <div className="space-y-4 text-sm text-gray-600">
                <p><strong>Last Updated:</strong> August 10, 2025</p>
                <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the arpitsolar.com website (the "Service") operated by Arpit Solar Shop ("us", "we", or "our").</p>
                <h3 className="font-semibold text-gray-800">1. Agreement to Terms</h3>
                <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
                <h3 className="font-semibold text-gray-800">2. Intellectual Property</h3>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Arpit Solar Shop and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.</p>
                <h3 className="font-semibold text-gray-800">3. Limitation Of Liability</h3>
                <p>In no event shall Arpit Solar Shop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </div>
        )
    },
    cookies: {
        title: "Cookie Policy",
        content: (
            <div className="space-y-4 text-sm text-gray-600">
                <p><strong>Last Updated:</strong> August 10, 2025</p>
                <p>This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies and how that information is used.</p>
                <h3 className="font-semibold text-gray-800">1. What are Cookies?</h3>
                <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide information to the owners of the site.</p>
                <h3 className="font-semibold text-gray-800">2. How We Use Cookies</h3>
                <p>We use cookies to enhance your Browse experience by: remembering your preferences, understanding how you use our site to improve functionality, and providing content that is relevant to you.</p>
                <p>We use both session and persistent cookies on our Service.</p>
            </div>
        )
    }
};

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContentKey, setModalContentKey] = useState<string | null>(null);

    const handlePolicyClick = (key: string) => {
        setModalContentKey(key);
        setIsModalOpen(true);
    };

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
                                    <img
                                        src="/logo.png"
                                        alt="Arpit Solar Logo"
                                        className="h-14 w-auto p-2 md:p-3"
                                    />
                                </div>
                            </Link>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Leading the transition to clean, renewable energy with cutting-edge solar solutions.
                                Powering homes and businesses across India with sustainable energy.
                            </p>
                            <div className="flex space-x-3">
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10" onClick={() => window.open('https://www.facebook.com/@arpitsolar', '_blank')}> <Facebook className="w-4 h-4" /> </Button>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10" onClick={() => window.open('https://www.linkedin.com/in/arpit-solar-shop', '_blank')}> <Linkedin className="w-4 h-4" /> </Button>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10" onClick={() => window.open('https://www.instagram.com/arpitsolarweb/', '_blank')}> <Instagram className="w-4 h-4" /> </Button>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10" onClick={() => window.open('https://in.pinterest.com/arpitsolar/', '_blank')}> <PinterestIcon /> </Button>
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
                                {[{ name: "Reliance Solar", href: "/reliance" }, { name: "Shakti Solar", href: "/shakti-solar" }, { name: "Tata Solar", href: "/tata-solar" }].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-300 hover:text-solar-orange transition-colors duration-200 text-sm"> {link.name} </Link>
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
                        </div>
                    </div>
                </div>

                {/* UPDATED Bottom Bar */}
                <div className="border-t border-white/10 bg-solar-navy/90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                            <p className="text-gray-400 text-sm"> © {currentYear} Arpit Solar Shop. All rights reserved. </p>
                            <div className="flex space-x-6">
                                {/* These are now buttons that trigger the modal */}
                                <button onClick={() => handlePolicyClick('privacy')} className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200"> Privacy Policy </button>
                                <button onClick={() => handlePolicyClick('terms')} className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200"> Terms of Service </button>
                                <button onClick={() => handlePolicyClick('cookies')} className="text-gray-400 hover:text-solar-orange text-sm transition-colors duration-200"> Cookie Policy </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* The Modal Dialog component */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl bg-white text-black p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="text-2xl">{modalContentKey && (policyData as any)[modalContentKey].title}</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
                        {modalContentKey && (policyData as any)[modalContentKey].content}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Footer;