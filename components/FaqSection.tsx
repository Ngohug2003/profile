"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Check, Headset, Mail, Phone } from "lucide-react";
import { appContent } from "@/constants/content";

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
    supportEmail, 
    supportPhone 
  } = appContent.faq;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const renderFaqIllustration = (type?: string) => {
    if (type === "calendar") {
      return (
        <div className="relative w-16 h-16 shrink-0 hidden sm:flex items-center justify-center bg-[#1d1d1f] border border-[#333333] rounded-lg">
          <div className="relative w-10 h-10 bg-[#272729] border border-[#333333] rounded-md flex flex-col p-1">
            <div className="bg-[#0066cc] w-full h-2 rounded-t -mt-1 -mx-1" />
            <div className="grid grid-cols-3 gap-0.5 mt-1">
              <span className="w-1 h-1 bg-[#333333] rounded-xs" />
              <span className="w-1 h-1 bg-[#333333] rounded-xs" />
              <span className="w-1 h-1 bg-[#2997ff] rounded-xs" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="faq" className="relative w-full py-section bg-surface-tile-1 text-white select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Heading & Support card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[#2997ff] bg-white/5 rounded-full border border-white/5">
              <HelpCircle className="w-4 h-4" />
              <span>{badge}</span>
            </div>

            {/* Heading */}
            <h2 className="typography-display-lg text-white">
              {title}
            </h2>

            {/* Description */}
            <p className="typography-body text-[#cccccc]">
              {description}
            </p>

            {/* Support Card */}
            <div className="bg-surface-tile-2 border border-white/5 rounded-lg p-6 space-y-5">
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#1d1d1f] text-[#2997ff] rounded-lg">
                  <Headset className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="typography-caption-strong text-white">
                    {supportTitle}
                  </h4>
                  <p className="typography-micro-legal text-[#cccccc] mt-0.5">{supportDesc}</p>
                </div>
              </div>

              <hr className="border-[#333333]" />

              {/* Benefits list */}
              <div className="space-y-3 text-xs sm:text-sm text-[#cccccc] font-normal">
                {supportBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="p-0.5 rounded-full bg-[#1d1d1f] text-[#2997ff] shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="typography-caption">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <a
                href="#lien-he"
                onClick={handleOpenConsultation}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] rounded-full transition-all duration-200 apple-active-scale cursor-pointer"
              >
                <span>{supportCta}</span>
              </a>

              {/* Direct contacts */}
              <div className="flex flex-col gap-2 pt-2 text-[#cccccc] font-normal">
                <span className="flex items-center gap-2 typography-caption">
                  <Mail className="w-4 h-4 text-[#2997ff] shrink-0" />
                  {supportEmail}
                </span>
                <span className="flex items-center gap-2 typography-caption">
                  <Phone className="w-4 h-4 text-[#2997ff] shrink-0" />
                  {supportPhone}
                </span>
              </div>

            </div>

          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-surface-tile-2 border rounded-lg p-5 transition-colors duration-350 ${
                    isOpen ? "border-[#2997ff]" : "border-white/5"
                  } hover:border-[#2997ff]/60 apple-active-scale`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between gap-4 text-left select-none focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-4">
                      {/* Step index bubble */}
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isOpen ? "bg-[#0066cc] text-white" : "bg-[#1d1d1f] text-[#2997ff]"
                      }`}>
                        {index + 1}
                      </span>
                      <span className="typography-body-strong text-white">
                        {item.title}
                      </span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#cccccc] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#cccccc] shrink-0" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[300px] mt-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="pl-12 flex items-start gap-5">
                      <div className="flex-1 text-[#cccccc] text-xs sm:text-sm leading-relaxed">
                        <div className="flex items-start gap-2.5 bg-[#1d1d1f] border border-white/5 p-4.5 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] mt-2 shrink-0" />
                          <span className="typography-caption">{item.content}</span>
                        </div>
                      </div>
                      {renderFaqIllustration(item.illustrationType)}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
