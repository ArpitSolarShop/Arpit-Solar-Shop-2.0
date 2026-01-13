import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Factory, Shield, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Arpit Solar | Pioneering Sustainable Energy Since 2013",
    description: "Founded by engineers, Arpit Solar delivers turnkey solar solutions. Verified UPNEDA partner and authorized dealer for Tata Power, Reliance, and Shakti Pumps.",
};

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative h-16 w-48 md:h-20 md:w-64">
                            {/* Using a placeholder-like relative path assuming public/logo.png exists per previous verification */}
                            <img src="/logo.png" alt="Arpit Solar Logo" className="h-16 w-auto md:h-20 mx-auto" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Arpit Solar: Pioneering Sustainable Energy Solutions Since 2013
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Founded by engineers in Varanasi, we deliver reliable, affordable and turnkey solar EPC solutions
                        that power homes and businesses with clean, sustainable energy.
                    </p>
                    <div className="mt-6 flex gap-4 justify-center">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/get-quote">Get a Quote</Link>
                        </Button>
                        <Button asChild variant="outline" className="bg-transparent text-black border-input hover:bg-accent hover:text-accent-foreground">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Card className="border-0 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl">Our Story</CardTitle>
                            <CardDescription>
                                Founded in Varanasi by a dedicated team of engineers in 2013
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-700 space-y-4 leading-relaxed">
                            <p>
                                Arpit Solar was born from a vision to address one of our time&apos;s most critical challenges:
                                the need for a reliable and uninterrupted supply of clean energy. We are a leading Solar
                                EPC (Engineering, Procurement, and Construction) company committed to providing turnkey
                                solutions that are both renewable and affordable. At our core, we believe in harnessing the
                                power of the sun to build a brighter, greener future for all.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Expertise & Commitment to Quality */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-sm bg-gray-50/50">
                            <CardHeader>
                                <CardTitle className="text-2xl md:text-3xl">Our Expertise & Commitment to Quality</CardTitle>
                                <CardDescription>Technical mastery with a proven track record</CardDescription>
                            </CardHeader>
                            <CardContent className="text-gray-700 space-y-4">
                                <p>
                                    We have established ourselves as one of Varanasi&apos;s top solar players, a reputation built on the
                                    quality of our installations and our technical expertise. Our exceptionally talented team
                                    specializes in the seamless integration of:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>On-Grid, Off-Grid, and Hybrid Solar Systems</li>
                                    <li>Rooftop and Ground-Mounted Projects</li>
                                </ul>
                                <p>
                                    With a portfolio of successfully installed projects exceeding a combined capacity of <strong>25MW</strong>,
                                    our work stands as a testament to our capabilities. This commitment to excellence is recognized through our
                                    credentials in <strong>O&amp;M tracking</strong>, timely project execution, and cost optimization.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm bg-gray-50/50">
                            <CardHeader>
                                <CardTitle className="text-2xl md:text-3xl">What Sets Us Apart</CardTitle>
                                <CardDescription>Excellence, reliability, and value</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[{ title: 'Quality First', icon: Shield, text: 'Premium components and robust engineering standards.' },
                                    { title: 'Experienced Team', icon: Users, text: 'Engineer-led execution with process discipline.' },
                                    { title: 'Scale & Track Record', icon: Factory, text: '25MW+ deployed across varied use-cases.' },
                                    { title: 'Recognition', icon: Award, text: 'Known for timely execution and O&M excellence.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <item.icon className="h-5 w-5 text-blue-600 mt-1" />
                                            <div>
                                                <div className="font-semibold text-gray-900">{item.title}</div>
                                                <div className="text-sm text-gray-600">{item.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Trusted Partner */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Card className="border-0 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl">A Trusted Partner in India&apos;s Energy Transition</CardTitle>
                            <CardDescription>Empaneled, partnered, and trusted by industry leaders</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-700 space-y-6">
                            <p>
                                Arpit Solar is proud to be an officially empaneled agency by <strong>UPNEDA</strong> for the Government of India&apos;s
                                prestigious <strong>PM Surya Ghar: Muft Bijli Yojna</strong>, facilitating subsidies from the MNRE for our valued customers.
                            </p>
                            <p>
                                Our credibility is further reinforced by our strategic alliances. We are honored to be associated with
                                <strong> Indian Oil Corporation Ltd. (IOCL)</strong> under their Solarization Subsidy Scheme to install solar power systems on their
                                retail outlets. Furthermore, we are official channel partners in Uttar Pradesh for industry leaders like
                                <strong> Reliance New Energy</strong>, <strong>Shakti Pumps</strong>, and <strong>Tata Power Solar</strong>.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['UPNEDA Empaneled', 'PM Surya Ghar', 'IOCL Association', 'Reliance New Energy', 'Shakti Pumps', 'Tata Power Solar'].map((b) => (
                                    <Badge key={b} variant="secondary" className="text-sm">{b}</Badge>
                                ))}
                            </div>
                            <p>
                                At Arpit Solar, we combine technical mastery with last-mile reach to deliver unparalleled quality and
                                customer satisfaction. Join us in the renewable energy revolution.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Option 2 (Concise & Impactful) */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Card className="border-0 shadow-sm bg-gray-50/50">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl">Concise & Impactful</CardTitle>
                            <CardDescription>Perfect for a shorter section on the homepage or in a brochure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Arpit Solar: Your Trusted Partner for Solar Energy in Varanasi</h3>
                                <p>
                                    Since 2013, Arpit Solar has been a leading Solar EPC company in Varanasi, delivering excellence in turnkey
                                    solar solutions. Founded by engineers, our mission is to provide clean, affordable, and sustainable energy through
                                    superior quality installations.
                                </p>
                                <p className="mt-3">
                                    With over <strong>25MW</strong> of rooftop and ground-mounted systems installed, our expertise spans
                                    <strong> On-Grid, Off-Grid, and Hybrid</strong> projects. We are recognized for our timely execution, cost optimization,
                                    and meticulous O&amp;M services.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Why Choose Arpit Solar?</h4>
                                <ul className="space-y-2">
                                    {[
                                        'UPNEDA Empaneled: Officially approved for the PM Surya Ghar: Muft Bijli Yojna subsidy program.',
                                        'Proven Track Record: A portfolio of over 25MW of successful solar installations.',
                                        'Industry-Leading Partners: Channel partners for Reliance New Energy, Shakti Pumps, Tata Power Solar; associated with IOCL for their solarization scheme.',
                                        'Expert Team: Our foundation in engineering ensures technical excellence and complete customer satisfaction.'
                                    ].map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-2">
                                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                    <Link href="/get-quote">Partner with Arpit Solar</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Key Improvements Made (as provided) */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Card className="border-0 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl">Key improvements made</CardTitle>
                            <CardDescription>As highlighted in the redesigned content</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-700">
                            <ul className="space-y-2">
                                {[
                                    'Professional Tone: Formal and confident language throughout.',
                                    'Clear Structure: Grouped under headings like Our Story, Expertise, and Trusted Partner.',
                                    'Highlights Key Achievements: Emphasizes 25MW, UPNEDA, and major partners.',
                                    'Improved Flow: Guides the reader smoothly through the company story and strengths.',
                                    'Clarity: Government schemes and partnerships are explained to build trust.'
                                ].map((txt, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                        <span>{txt}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
