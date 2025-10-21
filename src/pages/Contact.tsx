import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageCircle, Globe, Shield } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Contact Arpit Solar Shop</h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4 rounded"></div>
            <p className="mt-4 text-lg md:text-xl text-gray-700">
              M/s. Arpit Solar Shop — Authorized Channel Partner: Reliance New Energy
            </p>
          </div>
        </div>
      </section>

      {/* Contact Card */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-yellow-500 mt-1" />
                <p>
                  <span className="font-semibold">Office:</span> Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-500 mt-1" />
                <p>
                  <span className="font-semibold">Authorized Channel Partner:</span> Reliance New Energy, Shakti Solar Rooftop
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-yellow-500 mt-1" />
                <p>
                  <span className="font-semibold">Branches:</span> Varanasi | Mau | Ballia 
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-yellow-500 mt-1" />
                  <p>
                    <span className="font-semibold">Contact:</span> 9005770466
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-yellow-500 mt-1" />
                  <p>
                    <span className="font-semibold">WA Chatbot:</span> 9044555572
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-yellow-500 mt-1" />
                  <p>
                    <span className="font-semibold">Email:</span> info@arpitsolar.com
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-yellow-500 mt-1" />
                  <p>
                    <span className="font-semibold">Web:</span> www.arpitsolar.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-500 mt-1" />
                <p>
                  <span className="font-semibold">GSTIN:</span> 09APKPM6299L1ZW
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Card className="border-black/10 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Find Us on Google Maps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full" style={{ height: 450 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.536770874559!2d82.94755207516889!3d25.35332077761076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db16a9c907f%3A0xe094345c3bcc59c2!2sArpit%20Solar%20Shop!5e0!3m2!1sen!2sin!4v1754655482123!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Arpit Solar Shop Location"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}