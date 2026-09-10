"use client";

import React from "react";
import { Check } from "lucide-react";
import { appContent } from "@/constants/content";

export default function ServicesSection() {
  const { badge, title, description, services } = appContent.services;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const renderIllustration = (type: "landing" | "ecommerce" | "seo") => {
    switch (type) {
      case "landing":
        return (
          <div className="relative w-full h-[120px] bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg flex flex-col p-2 select-none overflow-hidden shrink-0">
            {/* Header bar */}
            <div className="bg-white border-b border-[#e0e0e0] p-1 flex items-center justify-between rounded-t-xs">
              <span className="w-8 h-1 bg-[#0066cc] rounded-xs" />
              <div className="flex gap-1">
                <span className="w-3 h-1 bg-[#7a7a7a] rounded-xs" />
                <span className="w-3 h-1 bg-[#7a7a7a] rounded-xs" />
              </div>
            </div>
            {/* Main content sketch */}
            <div className="flex-1 p-2 flex flex-col justify-center items-center gap-1.5">
              <span className="w-16 h-2 bg-[#1d1d1f] rounded-xs" />
              <span className="w-12 h-1.5 bg-[#7a7a7a] rounded-xs" />
              <span className="w-8 h-2.5 bg-[#0066cc] rounded-full mt-0.5" />
            </div>
          </div>
        );
      case "ecommerce":
        return (
          <div className="relative w-full h-[120px] bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg flex flex-col p-2 select-none overflow-hidden shrink-0">
            {/* Header bar */}
            <div className="bg-white border-b border-[#e0e0e0] p-1 flex items-center justify-between rounded-t-xs">
              <span className="w-10 h-1 bg-[#0066cc] rounded-xs" />
              <span className="w-4 h-1.5 bg-[#0066cc] rounded-xs" />
            </div>
            {/* Products grid sketch */}
            <div className="flex-1 p-1.5 grid grid-cols-3 gap-1 mt-1">
              <div className="bg-white border border-[#e0e0e0] rounded p-1 flex flex-col justify-between items-center">
                <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1d1d1f]" />
                </div>
                <span className="w-4 h-1 bg-[#0066cc] rounded-xs mt-1" />
              </div>
              <div className="bg-white border border-[#e0e0e0] rounded p-1 flex flex-col justify-between items-center">
                <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded bg-[#1d1d1f]" />
                </div>
                <span className="w-4 h-1 bg-[#0066cc] rounded-xs mt-1" />
              </div>
              <div className="bg-white border border-[#e0e0e0] rounded p-1 flex flex-col justify-between items-center">
                <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded bg-[#1d1d1f]" />
                </div>
                <span className="w-4 h-1 bg-[#0066cc] rounded-xs mt-1" />
              </div>
            </div>
          </div>
        );
      case "seo":
        return (
          <div className="relative w-full h-[120px] bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg flex flex-col p-2.5 justify-between select-none overflow-hidden shrink-0">
            <div className="flex justify-between items-center">
              <span className="text-[7.5px] font-mono text-[#7a7a7a]">PageSpeed Score</span>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-xs">100/100</span>
            </div>
            {/* SVG Speed chart */}
            <div className="h-10 w-full mt-1.5">
              <svg className="w-full h-full" viewBox="0 0 100 30">
                <path d="M0,25 Q15,8 40,22 T80,5 T100,2" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="2" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="dich-vu" className="relative w-full py-section bg-white text-[#1d1d1f] select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0066cc] bg-[#f5f5f7] rounded-full border border-[#e0e0e0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
            <span>{badge}</span>
          </div>

          {/* Heading */}
          <h2 className="typography-display-lg text-[#1d1d1f]">
            {title}
          </h2>

          {/* Description */}
          <p className="typography-body text-[#7a7a7a]">
            {description}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {services.map((item, index) => (
            <div 
              key={index}
              className={`bg-white border rounded-lg p-6 space-y-6 flex flex-col justify-between h-full relative transition-all duration-300 hover:border-[#0066cc] ${
                item.popular ? "border-[#0066cc] shadow-sm" : "border-[#e0e0e0]"
              } apple-active-scale`}
            >
              {/* Popular Tag Badge */}
              {item.popular && (
                <div className="absolute -top-3.5 left-6 px-3 py-1 text-[10px] font-bold text-white bg-[#0066cc] rounded-full tracking-wide">
                  {item.popularBadge}
                </div>
              )}

              <div className="space-y-4">
                {/* Package Name & Price */}
                <div>
                  <h3 className="typography-caption-strong text-[#1d1d1f]">{item.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="typography-display-md text-[#1d1d1f] font-semibold">{item.price.split(" ")[1]}</span>
                    <span className="typography-caption text-[#7a7a7a] font-normal">{item.price.split(" ")[0]}</span>
                  </div>
                  <p className="typography-caption text-[#7a7a7a] mt-2 leading-relaxed h-[44px] overflow-hidden">
                    {item.desc}
                  </p>
                </div>

                <hr className="border-[#f0f0f0]" />

                {/* Illustration Sketch inside package */}
                {renderIllustration(item.illustrationType)}

                {/* Features List */}
                <div className="space-y-2.5">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#0066cc] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="typography-caption text-[#1d1d1f] leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package CTA Button */}
              <div className="pt-2">
                <a
                  href="#lien-he"
                  onClick={handleOpenConsultation}
                  className={`flex items-center justify-center w-full py-2.5 text-xs sm:text-sm font-normal rounded-full transition-all duration-200 apple-active-scale cursor-pointer ${
                    item.popular
                      ? "text-white bg-[#0066cc] hover:bg-[#0071e3]"
                      : "text-[#1d1d1f] bg-transparent border border-[#e0e0e0] hover:bg-[#f5f5f7]"
                  }`}
                >
                  <span>{item.ctaText}</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
