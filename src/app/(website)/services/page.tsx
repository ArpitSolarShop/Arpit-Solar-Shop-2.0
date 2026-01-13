"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Wrench,
    Shield,
    Zap,
    Users,
    Settings,
    ArrowRight,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    Droplets,
    Hammer,
    BarChart3,
    HeadphonesIcon,
    LucideIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar"; // Keep Navbar here? NO.
import Footer from "@/components/layout/Footer"; // Keep Footer here? NO.

interface Service {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    features: string[];
    contactNumber: string;
    contactEmail: string;
    availability: string;
    price?: string;
}

const services: Service[] = [
    {
        id: "1",
        title: "Solar Panel Cleaning",
        description:
            "Professional cleaning services to maintain optimal solar panel performance and efficiency. Regular cleaning can improve energy output by up to 25%.",
        icon: Droplets,
        features: [
            "Eco-friendly cleaning solutions",
            "Soft brush and deionized water cleaning",
            "Performance inspection during cleaning",
            "Monthly, quarterly, or annual packages",
            "Before and after efficiency reports",
            "Safe cleaning procedures for all roof types",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "7 Days a Week, 8 AM - 6 PM",
        price: "Starting from ₹5 per panel",
    },
    {
        id: "2",
        title: "Solar Installation",
        description:
            "Complete solar system installation services from site assessment to grid connection. Professional installation with certified technicians and quality assurance.",
        icon: Hammer,
        features: [
            "Site survey and system design",
            "Professional installation team",
            "Grid connection and net metering setup",
            "System commissioning and testing",
            "Documentation and warranty registration",
            "Post-installation performance verification",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "Monday to Saturday, 9 AM - 5 PM",
        price: "Free quote based on system size",
    },
    {
        id: "3",
        title: "Maintenance & Repair",
        description:
            "Comprehensive maintenance and repair services to ensure your solar system operates at peak performance throughout its lifetime.",
        icon: Wrench,
        features: [
            "Preventive maintenance schedules",
            "Inverter servicing and repairs",
            "Electrical connection inspections",
            "Performance monitoring and optimization",
            "Component replacement services",
            "Emergency repair services",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "24/7 Emergency Support",
        price: "AMC starting from ₹2,500/year",
    },
    {
        id: "4",
        title: "System Monitoring",
        description:
            "Advanced monitoring solutions to track your solar system's performance in real-time and identify issues before they impact energy production.",
        icon: BarChart3,
        features: [
            "Real-time performance monitoring",
            "Mobile app and web dashboard",
            "Automated alerts and notifications",
            "Monthly performance reports",
            "Remote diagnostics and troubleshooting",
            "Energy production analytics",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "24/7 Online Support",
        price: "₹500/month per system",
    },
    {
        id: "5",
        title: "Technical Support",
        description:
            "Expert technical support for all your solar system queries, troubleshooting, and guidance on optimal system operation.",
        icon: HeadphonesIcon,
        features: [
            "Phone and email support",
            "Remote system diagnostics",
            "Technical guidance and consultation",
            "Warranty claim assistance",
            "System optimization recommendations",
            "Training for system operation",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "Monday to Friday, 9 AM - 7 PM",
        price: "Free for warranty customers",
    },
    {
        id: "6",
        title: "System Upgrades",
        description:
            "Upgrade your existing solar system with latest technology, additional capacity, or enhanced monitoring capabilities.",
        icon: Zap,
        features: [
            "System capacity expansion",
            "Inverter upgrades and replacements",
            "Battery storage integration",
            "Smart monitoring system installation",
            "Efficiency optimization upgrades",
            "Technology refresh services",
        ],
        contactNumber: "9044555572",
        contactEmail: "info@arpitsolar.com",
        availability: "Monday to Saturday, 10 AM - 6 PM",
        price: "Quote based on upgrade requirements",
    },
];

const Services = () => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <section className="bg-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Solar Services</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8">
                        From installation to maintenance, we provide comprehensive solar solutions tailored to meet your energy
                        needs and exceed your expectations.
                    </p>
                    <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                                <Card
                                    key={service.id}
                                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-blue-50 cursor-pointer"
                                    onClick={() => setSelectedService(service)}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {service.title}
                                        </CardTitle>
                                        {service.price && (
                                            <Badge variant="secondary" className="w-fit">
                                                {service.price}
                                            </Badge>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-600 leading-relaxed mb-4">
                                            {service.description}
                                        </CardDescription>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                                {service.contactNumber}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                                {service.contactEmail}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                                {service.availability}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 bg-transparent"
                                        >
                                            Learn More
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                                        <selectedService.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedService.title}</h2>
                                </div>
                                <Button variant="ghost" onClick={() => setSelectedService(null)}>
                                    ×
                                </Button>
                            </div>

                            <p className="text-gray-600 mb-6">{selectedService.description}</p>

                            {selectedService.price && (
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-semibold text-blue-900 mb-2">Pricing</h3>
                                    <p className="text-blue-800">{selectedService.price}</p>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Service Features</h3>
                                <div className="space-y-2">
                                    {selectedService.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Phone className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-600">{selectedService.contactNumber}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-600">{selectedService.contactEmail}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-600">{selectedService.availability}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Benefits */}
            <section className="py-20 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Services?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">25-Year Warranty</h3>
                            <p className="text-gray-600">All our installations come with comprehensive warranty coverage</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Expert Team</h3>
                            <p className="text-gray-600">Certified professionals with years of solar industry experience</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Settings className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Round-the-clock monitoring and maintenance support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-4 md:px-8 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Contact us today for a free consultation and discover how our solar services can benefit you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
                        >
                            <Phone className="mr-2 w-5 h-5" />
                            Call 9044555572
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
                        >
                            <Mail className="mr-2 w-5 h-5" />
                            Email Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* Emergency Contact */}
            <section className="py-12 px-4 md:px-8 bg-red-50 border-t-4 border-red-500">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-red-800 mb-4">Emergency Solar Service</h3>
                    <p className="text-red-700 mb-4">
                        For urgent solar system issues or emergency repairs, contact our 24/7 emergency hotline:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                            <Phone className="mr-2 w-5 h-5" />
                            Emergency: 9044555572
                        </Button>
                        <span className="text-red-700 font-medium">Available 24/7 for emergencies</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
