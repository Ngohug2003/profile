"use client";

import React from "react";
import { Smartphone, Search, Zap } from "lucide-react";
import TrustCard from "./TrustCard";
import HeroMockup from "./HeroMockup";
import { appContent } from "@/constants/content";

const iconMap = {
  Smartphone,
  Search,
  Zap,
};

export default function HeroSection() {
  const { badge, title, description, ctaPrimary, ctaSecondary, trustCards } = appContent.hero;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const handleScrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("dich-vu");
    if (element) {
      const offset = 52;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="trang-chu" className="relative w-full min-h-[calc(100vh-52px)] flex items-center py-12 md:py-20 bg-white text-[#1d1d1f] overflow-hidden select-none rounded-none border-0">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Content (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0066cc] bg-[#f5f5f7] rounded-full border border-[#e0e0e0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
              <span>{badge}</span>
            </div>

            {/* Main Header Headline */}
            <h1 className="typography-hero-display text-[#1d1d1f] tracking-tight">
              {title.split("giúp").map((text, idx) => (
                <React.Fragment key={idx}>
                  {idx === 1 ? (
                    <span className="block text-[#0066cc] mt-1">giúp{text}</span>
                  ) : (
                    <span>{text}</span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            {/* Quiet Subtitle Body */}
            <p className="typography-body text-[#7a7a7a]">
              {description}
            </p>

            {/* Signature Capsule Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#lien-he"
                onClick={handleOpenConsultation}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] transition-all duration-200 rounded-full apple-active-scale cursor-pointer"
              >
                {ctaPrimary}
              </a>
              
              <a
                href="#dich-vu"
                onClick={handleScrollToServices}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-normal text-[#1d1d1f] bg-transparent border border-[#e0e0e0] hover:bg-[#f5f5f7] transition-all duration-200 rounded-full apple-active-scale cursor-pointer"
              >
                {ctaSecondary}
              </a>
            </div>

            {/* Trust Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#f0f0f0]">
              {trustCards.map((card, index) => {
                const IconComponent = iconMap[card.iconName];
                return (
                  <TrustCard
                    key={index}
                    icon={IconComponent}
                    title={card.title}
                    subtitle={card.subtitle}
                    iconColorClass=""
                    iconBgClass=""
                  />
                );
              })}
            </div>

          </div>

          {/* Right Column: Impossibly Crisp Product Mockup render (Spans 7 columns) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <HeroMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
