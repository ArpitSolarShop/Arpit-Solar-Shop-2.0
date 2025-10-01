// "use client"

// import { useState } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import TataSolarPricingPage from "@/assets/tata-solar"; // This path is now updated
// import GetQuote from "@/pages/GetQuote";
// import { Zap } from "lucide-react";

// const SolarSolutionCard = ({ title, image, features, benefits }: any) => (
//   <div className="bg-gray-100 rounded-xl p-6 shadow-md h-full">
//     <div className="w-full h-48 flex items-center justify-center mb-5">
//       <img src={image} alt={title} className="max-h-full object-contain" />
//     </div>
//     <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
//     <h4 className="text-xl font-semibold text-blue-700 mb-2">Features</h4>
//     <ul className="list-disc list-inside mb-4 space-y-1">{features.map((f: string, i: number) => <li key={i}>{f}</li>)}</ul>
//     <h4 className="text-xl font-semibold text-blue-700 mb-2">Benefits</h4>
//     <ul className="list-disc list-inside space-y-1">{benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul>
//   </div>
// );

// export default function TataSolar() {
//   const [isQuoteOpen, setIsQuoteOpen] = useState(false);
//   const faqs = [
//       { q: "Why choose Tata Power Solar?", a: "With over 32 years of experience, Tata Power Solar is India's most trusted solar brand, guaranteeing quality and reliability." },
//       { q: "What is the PM Surya Ghar Yojana?", a: "It is a government scheme promoting residential solar adoption by providing significant financial subsidies to make solar affordable." }
//     ];
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <Navbar />
//       <main>
//         <section className="w-full bg-[#E6F3FF] py-16">
//           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-10">
//             <div className="flex-1 text-center md:text-left space-y-4">
//               <p className="uppercase text-sm text-blue-800 font-semibold">TATA POWER SOLAR ROOFTOP SOLUTIONS</p>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">Harness the Sun with India's #1 Solar Rooftop Company.</h2>
//               <button onClick={() => setIsQuoteOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Request a Free Consultation</button>
//             </div>
//             <div className="flex-1 flex justify-center">
//               <img src="/Tata Power Solar.png" alt="Tata Power Solar" className="w-full max-w-md object-contain" />
//             </div>
//           </div>
//         </section>
//         {isQuoteOpen && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsQuoteOpen(false)}>
//             <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//               <div className="p-6 relative"><button onClick={() => setIsQuoteOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">✖</button><GetQuote /></div>
//             </div>
//           </div>
//         )}
//         <section className="py-16 bg-white text-center">
//           <h2 className="text-3xl font-bold mb-12">Our Solar Solutions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
//             <SolarSolutionCard title="Solar PV Modules" image="/tata-module.png" features={["High-Efficiency Mono PERC", "PID Resistant", "Durable Build"]} benefits={["Maximize energy generation", "Reliable for 25+ years", "Great ROI"]} />
//             <SolarSolutionCard title="String Inverters" image="/tata-inverter.png" features={["High Conversion Efficiency", "IP65 Rated", "Remote Monitoring"]} benefits={["Optimize power output", "Safe operation", "Track performance"]} />
//             <SolarSolutionCard title="Mounting Structures" image="/tata-mounting.png" features={["Corrosion-Resistant GI", "High Wind Speed Design", "Quick Installation"]} benefits={["Ensures panel safety", "Long lifespan", "Optimal orientation"]} />
//           </div>
//         </section>
//         <section className="bg-gray-50 py-16"><TataSolarPricingPage /></section>
//         <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4"><Zap className="w-12 h-12 text-yellow-300" />PM Surya Ghar <span className="text-yellow-300">मुफ्त बिजली योजना</span></h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg"><p className="text-4xl font-bold text-green-600 mb-2">₹30,000</p><p>per kWp up to 2 kWp</p></div>
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg"><p className="text-4xl font-bold text-green-600 mb-2">₹18,000</p><p>for additional capacity up to 3 kWp</p></div>
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg"><p className="text-4xl font-bold text-green-600 mb-2">₹78,000</p><p>Total subsidy for systems &gt; 3 kWp</p></div>
//             </div>
//           </div>
//         </section>
//         <section className="py-16">
//           <div className="max-w-4xl mx-auto px-4">
//             <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
//             <div className="space-y-4">{faqs.map((item, idx) => (
//               <div key={idx} className="border rounded-lg overflow-hidden">
//                 <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full text-left p-4 font-medium flex justify-between items-center">{item.q}<span>{openIndex === idx ? "−" : "+"}</span></button>
//                 {openIndex === idx && <p className="p-4 pt-0 text-gray-600">{item.a}</p>}
//               </div>
//             ))}</div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }











// "use client";

// import { useState } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import TataSolarPricingPage from "@/assets/tata-solar"; // This path is now updated
// import GetQuote from "@/pages/GetQuote";
// import { Zap } from "lucide-react";

// const SolarSolutionCard = ({ title, image, features, benefits }: any) => (
//   <div className="bg-gray-100 rounded-xl p-6 shadow-md h-full">
//     <div className="w-full h-48 flex items-center justify-center mb-5">
//       <img src={image} alt={title} className="max-h-full object-contain" />
//     </div>
//     <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
//     <h4 className="text-xl font-semibold text-blue-700 mb-2">Features</h4>
//     <ul className="list-disc list-inside mb-4 space-y-1">
//       {features.map((f: string, i: number) => (
//         <li key={i}>{f}</li>
//       ))}
//     </ul>
//     <h4 className="text-xl font-semibold text-blue-700 mb-2">Benefits</h4>
//     <ul className="list-disc list-inside space-y-1">
//       {benefits.map((b: string, i: number) => (
//         <li key={i}>{b}</li>
//       ))}
//     </ul>
//   </div>
// );

// export default function TataSolar() {
//   const [isQuoteOpen, setIsQuoteOpen] = useState(false);
//   const faqs = [
//     {
//       q: "Why choose Tata Power Solar?",
//       a: "With over 32 years of experience, Tata Power Solar is India's most trusted solar brand, guaranteeing quality and reliability.",
//     },
//     {
//       q: "What is the PM Surya Ghar Yojana?",
//       a: "It is a government scheme promoting residential solar adoption by providing significant financial subsidies to make solar affordable.",
//     },
//   ];
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       <Navbar />
//       {/* Added pt-16 for navbar height */}
//       <main className="pt-16">
//         <section className="scroll-mt-16 w-full bg-[#E6F3FF] py-16">
//           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-10">
//             <div className="flex-1 text-center md:text-left space-y-4">
//               <p className="uppercase text-sm text-blue-800 font-semibold">
//                 TATA POWER SOLAR ROOFTOP SOLUTIONS
//               </p>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
//                 Harness the Sun with India's #1 Solar Rooftop Company.
//               </h2>
//               <button
//                 onClick={() => setIsQuoteOpen(true)}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Request a Free Consultation
//               </button>
//             </div>
//             <div className="flex-1 flex justify-center">
//               <img
//                 src="/Tata Power Solar.png"
//                 alt="Tata Power Solar"
//                 className="w-full max-w-md object-contain"
//               />
//             </div>
//           </div>
//         </section>

//         {isQuoteOpen && (
//           <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setIsQuoteOpen(false)}
//           >
//             <div
//               className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6 relative">
//                 <button
//                   onClick={() => setIsQuoteOpen(false)}
//                   className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//                 >
//                   ✖
//                 </button>
//                 <GetQuote />
//               </div>
//             </div>
//           </div>
//         )}

//         <section className="scroll-mt-16 py-16 bg-white text-center">
//           <h2 className="text-3xl font-bold mb-12">Our Solar Solutions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
//             <SolarSolutionCard
//               title="Solar PV Modules"
//               image="/tata-module.png"
//               features={["High-Efficiency Mono PERC", "PID Resistant", "Durable Build"]}
//               benefits={["Maximize energy generation", "Reliable for 25+ years", "Great ROI"]}
//             />
//             <SolarSolutionCard
//               title="String Inverters"
//               image="/tata-inverter.png"
//               features={["High Conversion Efficiency", "IP65 Rated", "Remote Monitoring"]}
//               benefits={["Optimize power output", "Safe operation", "Track performance"]}
//             />
//             <SolarSolutionCard
//               title="Mounting Structures"
//               image="/tata-mounting.png"
//               features={["Corrosion-Resistant GI", "High Wind Speed Design", "Quick Installation"]}
//               benefits={["Ensures panel safety", "Long lifespan", "Optimal orientation"]}
//             />
//           </div>
//         </section>

//         <section className="scroll-mt-16 bg-gray-50 py-16">
//           <TataSolarPricingPage />
//         </section>

//         <section className="scroll-mt-16 py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4">
//               <Zap className="w-12 h-12 text-yellow-300" />
//               PM Surya Ghar <span className="text-yellow-300">मुफ्त बिजली योजना</span>
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
//                 <p className="text-4xl font-bold text-green-600 mb-2">₹30,000</p>
//                 <p>per kWp up to 2 kWp</p>
//               </div>
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
//                 <p className="text-4xl font-bold text-green-600 mb-2">₹18,000</p>
//                 <p>for additional capacity up to 3 kWp</p>
//               </div>
//               <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
//                 <p className="text-4xl font-bold text-green-600 mb-2">₹78,000</p>
//                 <p>Total subsidy for systems &gt; 3 kWp</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="scroll-mt-16 py-16">
//           <div className="max-w-4xl mx-auto px-4">
//             <h3 className="text-2xl font-bold mb-8 text-center">
//               Frequently Asked Questions
//             </h3>
//             <div className="space-y-4">
//               {faqs.map((item, idx) => (
//                 <div key={idx} className="border rounded-lg overflow-hidden">
//                   <button
//                     onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
//                     className="w-full text-left p-4 font-medium flex justify-between items-center"
//                   >
//                     {item.q}
//                     <span>{openIndex === idx ? "−" : "+"}</span>
//                   </button>
//                   {openIndex === idx && (
//                     <p className="p-4 pt-0 text-gray-600">{item.a}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }
















"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TataSolarPricingPage from "@/assets/tata-solar"; // This path is now updated
import GetQuote from "@/pages/GetQuote";
import { Zap } from "lucide-react";



import tataPowerSolarImg from "@/assets/Tata Solar Content/Tata Power Solar.png";
import tataModuleImg from "@/assets/Tata Solar Content/tata-module.png";
import tataInverterImg from "@/assets/Tata Solar Content/tata-inverter.png";
import tataMountingImg from "@/assets/Tata Solar Content/tata-mounting.png";



const SolarSolutionCard = ({ title, image, features, benefits }: any) => (
  <div className="bg-gray-100 rounded-xl p-6 shadow-md h-full">
    <div className="w-full h-48 flex items-center justify-center mb-5">
      <img src={image} alt={title} className="max-h-full object-contain" />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
    <h4 className="text-xl font-semibold text-blue-700 mb-2">Features</h4>
    <ul className="list-disc list-inside mb-4 space-y-1">
      {features.map((f: string, i: number) => (
        <li key={i}>{f}</li>
      ))}
    </ul>
    <h4 className="text-xl font-semibold text-blue-700 mb-2">Benefits</h4>
    <ul className="list-disc list-inside space-y-1">
      {benefits.map((b: string, i: number) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  </div>
);

export default function TataSolar() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const faqs = [
    {
      q: "Why choose Tata Power Solar?",
      a: "With over 32 years of experience, Tata Power Solar is India's most trusted solar brand, guaranteeing quality and reliability.",
    },
    {
      q: "What is the PM Surya Ghar Yojana?",
      a: "It is a government scheme promoting residential solar adoption by providing significant financial subsidies to make solar affordable.",
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      {/* Added pt-16 for navbar height */}
      <main className="pt-16">
        <section className="scroll-mt-16 w-full bg-[#E6F3FF] py-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-10">
            <div className="flex-1 text-center md:text-left space-y-4">
              <p className="uppercase text-sm text-blue-800 font-semibold">
                TATA POWER SOLAR ROOFTOP SOLUTIONS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Harness the Sun with India's #1 Solar Rooftop Company.
              </h2>
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Request a Free Consultation
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src="/Tata Power Solar.png"
                alt="Tata Power Solar"
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </section>

        {isQuoteOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsQuoteOpen(false)}
          >
            <div
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 relative">
                <button
                  onClick={() => setIsQuoteOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✖
                </button>
                <GetQuote />
              </div>
            </div>
          </div>
        )}

        <section className="scroll-mt-16 py-16 bg-white text-center">
          <h2 className="text-3xl font-bold mb-12">Our Solar Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
            <SolarSolutionCard
              title="Solar PV Modules"
              image={tataModuleImg} // New way
              features={["High-Efficiency Mono PERC", "PID Resistant", "Durable Build"]}
              benefits={["Maximize energy generation", "Reliable for 25+ years", "Great ROI"]}
            />
            <SolarSolutionCard
              title="String Inverters"
              image={tataInverterImg} // New way
              features={["High Conversion Efficiency", "IP65 Rated", "Remote Monitoring"]}
              benefits={["Optimize power output", "Safe operation", "Track performance"]}
            />
            <SolarSolutionCard
              title="Mounting Structures"
              image={tataMountingImg} // New way
              features={["Corrosion-Resistant GI", "High Wind Speed Design", "Quick Installation"]}
              benefits={["Ensures panel safety", "Long lifespan", "Optimal orientation"]}
            />
          </div>
        </section>

        <section className="scroll-mt-16 bg-gray-50 py-16">
          <TataSolarPricingPage />
        </section>

        <section className="scroll-mt-16 py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4">
              <Zap className="w-12 h-12 text-yellow-300" />
              PM Surya Ghar <span className="text-yellow-300">मुफ्त बिजली योजना</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold text-green-600 mb-2">₹30,000</p>
                <p>per kWp up to 2 kWp</p>
              </div>
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold text-green-600 mb-2">₹18,000</p>
                <p>for additional capacity up to 3 kWp</p>
              </div>
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-bold text-green-600 mb-2">₹78,000</p>
                <p>Total subsidy for systems &gt; 3 kWp</p>
              </div>
            </div>
          </div>
        </section>

        <section className="scroll-mt-16 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full text-left p-4 font-medium flex justify-between items-center"
                  >
                    {item.q}
                    <span>{openIndex === idx ? "−" : "+"}</span>
                  </button>
                  {openIndex === idx && (
                    <p className="p-4 pt-0 text-gray-600">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
