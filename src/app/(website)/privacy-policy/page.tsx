import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Arpit Solar Shop",
    description: "Read Arpit Solar Shop's Privacy Policy. Learn how we collect, use, store, and protect your personal information when you use our solar energy services.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Banner */}
            <section className="bg-gradient-to-r from-[#0a2351] to-[#0d2e67] text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                        Your privacy matters to us. Learn how Arpit Solar Shop collects, uses, and protects your personal information.
                    </p>
                    <p className="text-sm text-blue-300 mt-4">Last Updated: May 7, 2026</p>
                </div>
            </section>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="prose prose-lg prose-gray max-w-none space-y-10">

                    {/* 1. Introduction */}
                    <section id="introduction">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Arpit Solar Shop (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{" "}
                            <a href="https://arpitsolar.com" className="text-blue-600 hover:underline">arpitsolar.com</a> (&quot;Website&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our Website, use our services, or interact with us via phone, WhatsApp, SMS, RCS, email, or any other communication channel.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            By using our Website or Services, you agree to the collection and use of information in accordance with this Privacy Policy. Please also read our <a href="/terms-and-conditions" className="text-blue-600 hover:underline font-medium">Terms &amp; Conditions</a>.
                        </p>
                    </section>

                    {/* 2. Information We Collect */}
                    <section id="information-collected">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">2. Information We Collect</h2>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">2.1 Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed">When you submit a form, request a quotation, or contact us, we may collect:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Full name</li>
                            <li>Phone number / WhatsApp number</li>
                            <li>Email address</li>
                            <li>Residential or commercial address</li>
                            <li>PIN code and city/location</li>
                            <li>Company name (for commercial customers)</li>
                            <li>Monthly electricity bill amount</li>
                            <li>Roof type, area, and property details</li>
                            <li>GPS coordinates (if you choose to share your location)</li>
                            <li>Referral information</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-4">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited, time spent, and navigation patterns</li>
                            <li>Referral URL and search queries</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    {/* 3. How We Use Your Information */}
                    <section id="use-of-information">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed">We use your personal information for the following purposes:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Service Delivery:</strong> To generate quotations, process orders, schedule installations, and provide after-sales support.</li>
                            <li><strong>Communication:</strong> To contact you via phone, WhatsApp, RCS, SMS, email, and IVR regarding your inquiries, orders, and service updates.</li>
                            <li><strong>Marketing &amp; Promotions:</strong> To send promotional offers, new product updates, government subsidy news, and solar energy tips (with your consent).</li>
                            <li><strong>CRM Management:</strong> To manage customer relationships, track interactions, and improve service quality through our CRM platforms.</li>
                            <li><strong>Analytics:</strong> To analyze Website usage, improve user experience, and optimize our services.</li>
                            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal obligations.</li>
                        </ul>
                    </section>

                    {/* 4. Communication Channels */}
                    <section id="communication" className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">4. Communication Channels &amp; Consent</h2>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            When you submit your contact details through any form on our Website or via direct communication, you consent to being contacted through the following channels:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                            <li><strong>Phone Calls &amp; IVR:</strong> Automated and manual calls for order updates, surveys, and promotional offers.</li>
                            <li><strong>WhatsApp:</strong> Quotation PDFs, order tracking, promotional content, and customer support.</li>
                            <li><strong>RCS:</strong> Rich media messages for product information and promotions.</li>
                            <li><strong>SMS:</strong> OTPs, transactional alerts, and promotional messages.</li>
                            <li><strong>Email:</strong> Quotations, invoices, newsletters, and promotional emails.</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-3">
                            You can opt out of promotional communications at any time by replying <strong>&quot;STOP&quot;</strong> or contacting us at <strong>info@arpitsolar.com</strong>. See our <a href="/terms-and-conditions#communication-consent" className="text-blue-600 hover:underline font-medium">Terms &amp; Conditions</a> for full details.
                        </p>
                    </section>

                    {/* 5. Data Sharing */}
                    <section id="data-sharing">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">5. Data Sharing &amp; Third Parties</h2>
                        <p className="text-gray-700 leading-relaxed">We may share your personal information with:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Solar Brand Partners:</strong> Tata Power Solar, Shakti Solar, Waaree, Adani, etc. for order processing and warranty management.</li>
                            <li><strong>Installation Teams:</strong> Our authorized installation partners for scheduling and executing installations.</li>
                            <li><strong>CRM &amp; Communication Platforms:</strong> Neodove CRM, DoubleTick WhatsApp API, and similar service providers for customer communication management.</li>
                            <li><strong>Cloud Service Providers:</strong> Supabase, Vercel, and similar platforms for data storage and website hosting.</li>
                            <li><strong>Government Authorities:</strong> For subsidy applications and compliance with legal requirements.</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-2">
                            <strong>We do not sell your personal data to third-party advertisers or data brokers.</strong>
                        </p>
                    </section>

                    {/* 6. Data Security */}
                    <section id="security">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">6. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement industry-standard security measures including SSL encryption, secure databases, access controls, and regular security audits to protect your personal data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* 7. Cookies */}
                    <section id="cookies">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">7. Cookies &amp; Tracking</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your browsing experience, remember preferences, and analyze traffic. You can control cookies through your browser settings. Disabling cookies may affect certain features of the Website.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We may use third-party analytics tools (Google Analytics, Vercel Analytics) that collect anonymized usage data to help us understand how visitors interact with our Website.
                        </p>
                    </section>

                    {/* 8. Your Rights */}
                    <section id="your-rights">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">8. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations).</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from promotional communications at any time.</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw your consent for data processing at any time.</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-2">
                            To exercise any of these rights, please contact us at <strong>info@arpitsolar.com</strong> or call <strong>+91-9005770466</strong>.
                        </p>
                    </section>

                    {/* 9. Data Retention */}
                    <section id="retention">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">9. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce agreements. Typically, customer data is retained for the duration of the warranty period plus an additional 2 years for after-sales support.
                        </p>
                    </section>

                    {/* 10. Children's Privacy */}
                    <section id="children">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">10. Children&apos;s Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our Services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
                        </p>
                    </section>

                    {/* 11. Changes */}
                    <section id="changes">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">11. Changes to This Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this page periodically.
                        </p>
                    </section>

                    {/* 12. Contact */}
                    <section id="contact" className="bg-[#0a2351] text-white rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold border-b-2 border-solar-orange pb-2">12. Contact Us</h2>
                        <p className="text-blue-200 mt-4 leading-relaxed">
                            If you have any questions about this Privacy Policy or wish to exercise your data rights:
                        </p>
                        <div className="mt-4 space-y-2 text-blue-100">
                            <p><strong className="text-white">Company:</strong> Arpit Solar Shop</p>
                            <p><strong className="text-white">Address:</strong> Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP), India</p>
                            <p><strong className="text-white">Phone:</strong> +91-9005770466</p>
                            <p><strong className="text-white">Email:</strong> info@arpitsolar.com</p>
                            <p><strong className="text-white">Website:</strong> <a href="https://arpitsolar.com" className="text-solar-orange hover:underline">arpitsolar.com</a></p>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
