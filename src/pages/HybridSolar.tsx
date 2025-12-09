"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import HybridSolarPricing from "../assets/hybrid-solar"
import { GetQuoteForm } from "@/pages/GetQuote"
import { Zap, Battery, Sun, Moon, Clock, Shield, Settings, Check } from "lucide-react"

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full">
    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-4 text-blue-600">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default function HybridSolar() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("residential")
  
  const faqs = [
    {
      q: "What is a Hybrid Solar System?",
      a: "A hybrid solar system combines solar panels with battery storage and can work with or without grid connection, providing reliable power 24/7."
    },
    {
      q: "How does battery backup work?",
      a: "Excess solar energy charges the batteries during the day, which can be used at night or during power cuts, ensuring uninterrupted power supply."
    }
  ]
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Hybrid Solar Systems
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Get the best of both worlds with our advanced hybrid solar solutions that combine solar power with battery storage for 24/7 energy independence.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Get Free Quote
                </button>
                <a 
                  href="#how-it-works"
                  className="bg-transparent hover:bg-blue-800 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="/Hybrid.png" 
                alt="Hybrid Solar System" 
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Hybrid Solar?</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our hybrid solar systems are designed to maximize your energy independence while reducing your electricity bills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Sun} 
                title="Solar Power" 
                description="Generate clean energy from the sun during the day to power your home and charge your batteries."
              />
              <FeatureCard 
                icon={Battery} 
                title="Battery Backup" 
                description="Store excess solar energy for use at night or during power outages, ensuring uninterrupted power."
              />
              <FeatureCard 
                icon={Zap} 
                title="Grid Connection" 
                description="Remain connected to the grid for backup power when needed, while still saving on electricity bills."
              />
              <FeatureCard 
                icon={Shield} 
                title="Power Protection" 
                description="Protect your appliances from power surges and voltage fluctuations with built-in surge protection."
              />
              <FeatureCard 
                icon={Settings} 
                title="Smart Energy Management" 
                description="Intelligent system that optimizes energy usage between solar, battery, and grid power."
              />
              <FeatureCard 
                icon={Check} 
                title="Government Subsidies Available" 
                description="Benefit from various government schemes and subsidies for installing hybrid solar systems."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <HybridSolarPricing />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full text-left p-4 font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                  >
                    {faq.q}
                    <span className="text-blue-600">
                      {openFaqIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-white border-t">
                      <p className="text-gray-700">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Quote Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsQuoteOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 relative">
              <button 
                onClick={() => setIsQuoteOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6">Get a Free Quote for Hybrid Solar</h2>
              <GetQuoteForm compact={true} showHeader={false} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
