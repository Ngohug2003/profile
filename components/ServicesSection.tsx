"use client";

import React from "react";
import { Check, ArrowRight, Sparkles, Layers, ShoppingBag, Gauge } from "lucide-react";
import { appContent } from "@/constants/content";

export default function ServicesSection() {
  const { badge, title, description, services } = appContent.services;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const getServiceIcon = (type: "landing" | "ecommerce" | "seo") => {
    switch (type) {
      case "landing":
        return <Layers className="w-5 h-5 text-blue-600" />;
      case "ecommerce":
        return <ShoppingBag className="w-5 h-5 text-indigo-600" />;
      case "seo":
        return <Gauge className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section id="dich-vu" className="relative w-full py-16 md:py-24 bg-white text-zinc-900 overflow-hidden">
      
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10">
        
        {/* Section Header */}
        <div className="max-w-[680px] mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>

          <h2 className="typography-display-lg text-zinc-950">
            {title}
          </h2>

          <p className="typography-body text-zinc-600">
            {description}
          </p>
        </div>

        {/* Pricing & Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {services.map((item, index) => {
            const isPopular = !!item.popular;
            return (
              <div 
                key={index}
                className={`rounded-3xl p-7 flex flex-col justify-between relative transition-all duration-200 card-hover-lift ${
                  isPopular 
                    ? "bg-gradient-to-b from-blue-50/50 via-white to-white border-2 border-blue-600 shadow-card" 
                    : "bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 hover:shadow-card"
                }`}
              >
                {/* Popular Tag Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-8 px-3.5 py-1 text-[11px] font-bold text-white bg-blue-600 rounded-full tracking-wide shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{item.popularBadge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Service Icon & Title */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200/60 w-fit">
                      {getServiceIcon(item.illustrationType)}
                    </div>
                    {isPopular && (
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                        Được chọn nhiều nhất
                      </span>
                    )}
                  </div>

                  {/* Package Name & Price */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 font-display">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed min-h-[44px]">
                      {item.desc}
                    </p>
                    <div className="flex items-baseline gap-1.5 pt-2">
                      <span className="text-2xl sm:text-3xl font-bold text-zinc-950 font-display">
                        {item.price.split(" ")[1] || item.price}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">
                        {item.price.split(" ")[0] || "Khởi điểm từ"}
                      </span>
                    </div>
                  </div>

                  <hr className="border-zinc-100" />

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                      Đặc quyền bao gồm:
                    </div>
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="p-0.5 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm text-zinc-700 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package CTA Button */}
                <div className="pt-8 mt-auto">
                  <button
                    onClick={handleOpenConsultation}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 btn-press cursor-pointer ${
                      isPopular
                        ? "text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                        : "text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60"
                    }`}
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
