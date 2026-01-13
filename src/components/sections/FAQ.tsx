"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import { faqs } from "@/data/faqs";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 text-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-black">Frequently Asked</span> <span className="text-amber-500">Questions</span>
        </h2>
        <p className="text-center text-gray-700 mb-10">
          Answers to common questions about solar energy, government support, savings, and more.
        </p>

        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ${isOpen ? "bg-white border-primary/30" : "bg-white/70"
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <span className="font-semibold text-lg text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-gray-500"
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px] mt-3 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-600 text-base">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
