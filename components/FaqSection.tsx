"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Check, Headset, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants } from "./ScrollReveal";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const { 
    badge, 
    title, 
    description, 
    faqItems, 
    supportTitle, 
    supportDesc, 
    supportCta, 
    supportBenefits, 
  } = appContent.faq;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full py-16 md:py-24 bg-[#f8f9fa] border-t border-zinc-200/60 overflow-hidden">
      
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Heading & Support card (Spans 5 columns) - hiện lần lượt */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
            custom={{ stagger: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Pill Badge */}
            <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </motion.div>

            {/* Heading */}
            <motion.h2 variants={staggerItemVariants} className="typography-display-lg text-zinc-950">
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p variants={staggerItemVariants} className="typography-body text-zinc-600">
              {description}
            </motion.p>

            {/* Support Card */}
            <motion.div variants={staggerItemVariants} className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-5 shadow-2xs">
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-950 font-display">
                    {supportTitle}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">{supportDesc}</p>
                </div>
              </div>

              <hr className="border-zinc-100" />

              {/* Benefits list */}
              <div className="space-y-2.5">
                {supportBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-zinc-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOpenConsultation}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 transition-all rounded-full shadow-xs cursor-pointer btn-press"
              >
                <span>{supportCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </motion.div>

          </motion.div>

          {/* Right Column: Accordions List (Spans 7 columns) - hiện lần lượt từng câu hỏi */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
            custom={{ stagger: 0.08 }}
            className="lg:col-span-7 space-y-3"
          >
            {faqItems.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div 
                  key={index}
                  variants={staggerItemVariants}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "bg-white border-blue-500/30 shadow-sm ring-1 ring-blue-500/10" 
                      : "bg-white/90 border-zinc-200/80 hover:border-zinc-300 hover:bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 shrink-0 ${
                        isOpen ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-400"
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className={`text-sm sm:text-base font-semibold transition-colors duration-200 ${
                        isOpen ? "text-zinc-950" : "text-zinc-800"
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    
                    <div className={`p-1.5 rounded-full transition-all duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100/80">
                        <p className="pt-2">{item.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
