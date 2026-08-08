import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions | Arpit Solar Shop",
    description: "Read the Terms and Conditions for Arpit Solar Shop. Understand our policies regarding solar product purchases, installation services, warranties, communication consent, and more.",
};

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Banner */}
            <section className="bg-gradient-to-r from-[#0a2351] to-[#0d2e67] text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Terms &amp; Conditions</h1>
                    <p className="text-lg text-blue-200 max-w-2xl mx-auto">
                        Please read these terms carefully before using our services or purchasing our products.
                    </p>
                    <p className="text-sm text-blue-300 mt-4">Last Updated: May 7, 2026</p>
                </div>
            </section>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="prose prose-lg prose-gray max-w-none space-y-10">

                    {/* 1. Introduction */}
                    <section id="introduction">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">1. Introduction &amp; Acceptance</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to Arpit Solar Shop (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your use of our website{" "}
                            <a href="https://arpitsolar.com" className="text-blue-600 hover:underline">arpitsolar.com</a> (&quot;Website&quot;), our mobile applications, and all related services, including but not limited to solar product sales, installation, consultation, quotation, and maintenance services (collectively, &quot;Services&quot;).
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            By accessing or using our Website, submitting any inquiry or quotation form, making a purchase, or engaging with our Services in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms along with our <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>. If you do not agree with any part of these Terms, please do not use our Services.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Registered Address:</strong> Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003, Uttar Pradesh, India.
                        </p>
                    </section>

                    {/* 2. Definitions */}
                    <section id="definitions">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">2. Definitions</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>&quot;Customer&quot;</strong> or <strong>&quot;You&quot;</strong> refers to any individual or entity who accesses our Website, submits an inquiry, or purchases our products/services.</li>
                            <li><strong>&quot;Products&quot;</strong> refers to solar panels, inverters, batteries, mounting structures, cables, and any related solar energy equipment sold by us.</li>
                            <li><strong>&quot;Services&quot;</strong> includes solar system design, consultation, installation, commissioning, net-metering assistance, annual maintenance contracts (AMC), and after-sales support.</li>
                            <li><strong>&quot;Quotation&quot;</strong> refers to a price estimate generated via our Website, WhatsApp, or any other communication channel.</li>
                            <li><strong>&quot;IVR&quot;</strong> refers to Interactive Voice Response, an automated telephony system used for customer communication.</li>
                        </ul>
                    </section>

                    {/* 3. Products & Services */}
                    <section id="products-services">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">3. Products &amp; Services</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">3.1 Product Information</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We make every effort to display accurate descriptions, specifications, images, and pricing of our solar products. However, product images are for illustration purposes only and may slightly differ from the actual products delivered. All specifications are subject to change by the manufacturers without prior notice.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">3.2 Pricing &amp; Quotations</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>All prices displayed on the Website are indicative and may vary based on site survey, location, system design, and prevailing market conditions.</li>
                            <li>Quotations generated via our online tools, WhatsApp, or in-person are valid for <strong>15 days</strong> from the date of issue unless otherwise stated.</li>
                            <li>GST and other applicable taxes will be charged as per prevailing government rates.</li>
                            <li>Subsidy amounts mentioned are estimates based on current government schemes (PM Surya Ghar Muft Bijli Yojana or applicable state schemes) and are subject to government approval and disbursement.</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">3.3 Brands We Deal In</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We are authorized dealers/partners for various solar brands including but not limited to Tata Power Solar, Shakti Solar, Waaree, Adani, and other integrated/hybrid solar system manufacturers. Brand availability may vary based on location and stock.
                        </p>
                    </section>

                    {/* 4. Order & Payment */}
                    <section id="payment-terms">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">4. Order &amp; Payment Terms</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">4.1 Payment Schedule</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-3">
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#0a2351] shrink-0">10% Advance:</span>
                                    <span>Due at the time of order confirmation/booking.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#0a2351] shrink-0">80% Pre-Dispatch:</span>
                                    <span>Due when materials are ready for dispatch to the project site.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-[#0a2351] shrink-0">10% Final Payment:</span>
                                    <span>Due after successful installation, commissioning, and inspection of the solar system.</span>
                                </li>
                            </ul>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">4.2 Payment Methods</h3>
                        <p className="text-gray-700 leading-relaxed">
                            We accept payments via Bank Transfer (NEFT/RTGS/IMPS), UPI, Cheque, and Demand Draft. Cash payments may be accepted subject to applicable tax regulations. All payments should be made in Indian Rupees (INR) only.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">4.3 Cancellation &amp; Refund</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Orders may be cancelled within <strong>48 hours</strong> of booking for a full refund of the advance amount.</li>
                            <li>After 48 hours, cancellation charges of up to <strong>10% of the total order value</strong> may apply.</li>
                            <li>Once materials are dispatched, cancellations are subject to restocking fees and logistics costs.</li>
                            <li>Refunds, where applicable, will be processed within <strong>15-30 business days</strong> via the original payment method.</li>
                        </ul>
                    </section>

                    {/* 5. Installation & Timeline */}
                    <section id="installation">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">5. Installation &amp; Project Timeline</h2>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">5.1 Scope of Work</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Included:</strong> Solar panels, inverter, mounting structure, wiring, installation &amp; commissioning (I&amp;C), and transportation to the project site.</li>
                            <li><strong>Excluded (unless explicitly agreed):</strong> Civil work (foundations, platform construction), electrical panel upgrades, tree cutting/trimming, and crane charges for difficult installations.</li>
                            <li><strong>Customer&apos;s Responsibility:</strong> Providing safe access to the roof/terrace, arranging Net-Metering/Net-Billing with the local DISCOM, and ensuring necessary electrical readiness.</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">5.2 Timeline</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><strong>Material Delivery:</strong> Within 15-30 days after 90% payment is received (subject to stock availability).</li>
                            <li><strong>Installation &amp; Commissioning:</strong> Within 7-15 days after materials arrive at the project site.</li>
                            <li>Delays caused by weather, government approvals, DISCOM processes, or customer-side readiness are beyond our control and will not attract any penalty.</li>
                        </ul>
                    </section>

                    {/* 6. Warranty */}
                    <section id="warranty">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">6. Warranties</h2>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-3">
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-green-800 shrink-0">Solar Panels:</span>
                                    <span>25-30 years performance warranty (as per manufacturer) + 10-12 years product warranty.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-green-800 shrink-0">Solar Inverter:</span>
                                    <span>5-10 years manufacturer warranty (varies by brand and model).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-green-800 shrink-0">Battery (Hybrid):</span>
                                    <span>5-10 years warranty depending on battery type and manufacturer.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-green-800 shrink-0">Complete System:</span>
                                    <span>5 years comprehensive warranty on workmanship and installation quality.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="font-bold text-green-800 shrink-0">Mounting Structure:</span>
                                    <span>10-15 years warranty against corrosion and structural defects.</span>
                                </li>
                            </ul>
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-3">
                            <strong>Warranty Exclusions:</strong> Damage caused by lightning, fire, flood, cyclone, earthquake, or any other natural disaster; unauthorized modifications or repairs; improper use or neglect; and normal wear and tear are not covered under warranty.
                        </p>
                    </section>

                    {/* 7. Communication Consent — IVR, WhatsApp, SMS, RCS */}
                    <section id="communication-consent" className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">7. Communication &amp; Promotional Consent</h2>
                        
                        <div className="mt-4 space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">7.1 Consent for IVR (Interactive Voice Response)</h3>
                            <p className="text-gray-700 leading-relaxed">
                                By submitting your contact details through any form on our Website, WhatsApp, or any other channel, you expressly consent to receiving automated and/or pre-recorded calls/messages via our IVR (Interactive Voice Response) system. These calls may include:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Order confirmation and status updates</li>
                                <li>Installation scheduling and reminders</li>
                                <li>Payment reminders and receipts</li>
                                <li>Customer satisfaction surveys</li>
                                <li>Service and maintenance reminders</li>
                                <li>Promotional offers on solar products and government subsidy updates</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6">7.2 Consent for WhatsApp / RCS / SMS Communications</h3>
                            <p className="text-gray-700 leading-relaxed">
                                By providing your phone number and agreeing to these Terms, you give explicit consent to Arpit Solar Shop to contact you via:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li><strong>WhatsApp:</strong> Transactional messages, quotation PDFs, order updates, and promotional offers related to solar energy.</li>
                                <li><strong>RCS (Rich Communication Services):</strong> Rich media messages including product catalogues, interactive quotation cards, and promotional content.</li>
                                <li><strong>SMS:</strong> OTPs, order confirmations, payment alerts, delivery updates, and promotional messages.</li>
                            </ul>

                            <div className="bg-white border border-amber-200 rounded-lg p-4 mt-4">
                                <p className="text-gray-800 font-semibold text-sm leading-relaxed">
                                    ✅ &quot;I have agreed to receive promotional messages through WhatsApp / RCS / SMS according to the Terms &amp; Conditions and Privacy Policy. I agree to receive marketing and promotional emails, messages, WhatsApp communications, and calls from Arpit Solar Shop.&quot;
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6">7.3 Consent for Email Communications</h3>
                            <p className="text-gray-700 leading-relaxed">
                                By providing your email address, you consent to receiving transactional emails (quotations, order confirmations, invoices) and promotional emails (offers, new product launches, government scheme updates, solar tips, and newsletters). You can unsubscribe from promotional emails at any time by clicking the &quot;Unsubscribe&quot; link in the email.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mt-6">7.4 Opt-Out / Do Not Disturb</h3>
                            <p className="text-gray-700 leading-relaxed">
                                You may opt out of promotional communications at any time by:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Replying <strong>&quot;STOP&quot;</strong> to any SMS or WhatsApp message</li>
                                <li>Sending an email to <strong>info@arpitsolar.com</strong> with subject &quot;Unsubscribe&quot;</li>
                                <li>Calling us at <strong>+91-9005770466</strong> and requesting removal from the list</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-2">
                                <strong>Note:</strong> Opting out of promotional messages will not affect essential transactional communications related to your active orders, installations, or service requests.
                            </p>
                        </div>
                    </section>

                    {/* 8. Data Collection & Privacy */}
                    <section id="data-privacy">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">8. Data Collection &amp; Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We collect personal information (name, phone, email, address, location, electricity consumption data) to provide you with accurate solar quotations, facilitate installations, and improve our services. For detailed information on how we collect, use, store, and protect your data, please refer to our <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Key points:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Your data may be shared with our authorized brand partners, installation teams, and CRM service providers solely for the purpose of fulfilling your order.</li>
                            <li>We do not sell your personal data to third-party advertisers.</li>
                            <li>We use industry-standard security measures to protect your data.</li>
                            <li>Your data may be processed through third-party platforms including Supabase, Neodove CRM, DoubleTick WhatsApp API, and similar service providers.</li>
                        </ul>
                    </section>

                    {/* 9. Website Usage */}
                    <section id="website-usage">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">9. Website Usage &amp; Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All content on this Website — including but not limited to text, graphics, logos, images, product descriptions, calculations, and software — is the intellectual property of Arpit Solar Shop or its licensors. You may not reproduce, distribute, modify, or commercially exploit any content without prior written permission.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            The solar savings calculator, quotation tools, and estimation tools on our Website provide approximate results for informational purposes only. Actual savings, system sizing, and costs may vary based on real-world conditions, site surveys, and final system design.
                        </p>
                    </section>

                    {/* 10. Limitation of Liability */}
                    <section id="liability">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">10. Limitation of Liability</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Arpit Solar Shop shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our products or services.</li>
                            <li>Our total liability for any claim shall not exceed the total amount paid by the customer for the specific product or service in question.</li>
                            <li>We are not liable for delays, defects, or failures caused by force majeure events including natural disasters, government policy changes, supply chain disruptions, or pandemic-related restrictions.</li>
                            <li>Solar generation estimates and savings projections are approximate. We do not guarantee specific energy output, savings amounts, or return on investment timelines.</li>
                        </ul>
                    </section>

                    {/* 11. Government Subsidies */}
                    <section id="subsidies">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">11. Government Subsidies &amp; Net Metering</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Subsidy amounts displayed on our Website are based on current government schemes and guidelines. We assist customers in the subsidy application process; however:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Subsidy approval and disbursement is solely at the discretion of the respective government authority (MNRE, State Nodal Agencies).</li>
                            <li>We do not guarantee subsidy approval, amount, or timeline.</li>
                            <li>Changes in government policies may affect subsidy eligibility and amounts after quotation or order placement.</li>
                            <li>Net-metering approval is subject to local DISCOM policies and is the customer&apos;s responsibility unless explicitly included in the scope of work.</li>
                        </ul>
                    </section>

                    {/* 12. AMC */}
                    <section id="amc">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">12. Annual Maintenance Contract (AMC)</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Optional AMC is available at competitive rates (starting from ₹650 per kWp per year). AMC includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Periodic system health check and performance monitoring</li>
                            <li>Panel cleaning (as per agreed frequency)</li>
                            <li>Inverter diagnostics and minor repairs</li>
                            <li>Remote monitoring support (where applicable)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-2">
                            AMC does not cover damage from natural disasters, theft, vandalism, or unauthorized modifications.
                        </p>
                    </section>

                    {/* 13. Dispute Resolution */}
                    <section id="disputes">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">13. Dispute Resolution &amp; Governing Law</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>These Terms are governed by the laws of India.</li>
                            <li>Any disputes arising from these Terms or related services shall first be attempted to be resolved through amicable negotiation.</li>
                            <li>If negotiation fails, the dispute shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with Varanasi, Uttar Pradesh as the seat of arbitration.</li>
                            <li>The courts of Varanasi, Uttar Pradesh shall have exclusive jurisdiction over any legal proceedings.</li>
                        </ul>
                    </section>

                    {/* 14. Changes */}
                    <section id="changes">
                        <h2 className="text-2xl font-bold text-[#0a2351] border-b-2 border-solar-orange pb-2">14. Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We reserve the right to update or modify these Terms at any time without prior notice. Changes become effective immediately upon posting on this page. Your continued use of our Services after any changes constitutes acceptance of the revised Terms. We encourage you to review this page periodically.
                        </p>
                    </section>

                    {/* 15. Contact */}
                    <section id="contact" className="bg-[#0a2351] text-white rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-bold border-b-2 border-solar-orange pb-2">15. Contact Us</h2>
                        <p className="text-blue-200 mt-4 leading-relaxed">
                            If you have any questions about these Terms and Conditions, please contact us:
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
