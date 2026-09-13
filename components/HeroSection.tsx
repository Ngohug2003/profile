"use client";

import React from "react";
import { Smartphone, Search, Zap, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import TrustCard from "./TrustCard";
import HeroMockup from "./HeroMockup";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants, editorialEasing } from "./ScrollReveal";

const iconMap = {
  Smartphone,
  Search,
  Zap,
};

export default function HeroSection() {
  const { badge, title, description, ctaPrimary, ctaSecondary, trustCards } = appContent.hero;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 76;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="trang-chu" 
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center py-12 md:py-20 bg-[#fafafa] bg-subtle-grid text-zinc-900 overflow-hidden"
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Content (Spans 6 columns) */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            custom={{ stagger: 0.1, delay: 0.1 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            
            {/* Status Pill Badge */}
            <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-800 bg-white rounded-full border border-zinc-200/80 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{badge}</span>
              <span className="text-zinc-300">|</span>
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Freelancer UI/UX
              </span>
            </motion.div>

            {/* Main Header Headline */}
            <motion.h1 variants={staggerItemVariants} className="typography-hero-display text-zinc-950 tracking-tight">
              {title.split("giúp").map((text, idx) => (
                <React.Fragment key={idx}>
                  {idx === 1 ? (
                    <span className="block text-blue-600 mt-1">giúp{text}</span>
                  ) : (
                    <span>{text}</span>
                  )}
                </React.Fragment>
              ))}
            </motion.h1>

            {/* Subtitle Body */}
            <motion.p variants={staggerItemVariants} className="typography-body text-zinc-600 max-w-[540px]">
              {description}
            </motion.p>

            {/* Signature Capsule Buttons */}
            <motion.div variants={staggerItemVariants} className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenConsultation}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 transition-all duration-200 rounded-full shadow-sm btn-press cursor-pointer"
              >
                <span>{ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </button>
              
              <a
                href="#du-an"
                onClick={(e) => handleScrollToSection(e, "du-an")}
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 rounded-full shadow-2xs btn-press cursor-pointer"
              >
                {ctaSecondary}
              </a>
            </motion.div>

            {/* Trust Cards row - hiện lần lượt 3 thẻ */}
            <motion.div 
              variants={staggerContainerVariants}
              custom={{ stagger: 0.1, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-zinc-200/80"
            >
              {trustCards.map((card, index) => {
                const IconComponent = iconMap[card.iconName];
                return (
                  <motion.div key={index} variants={staggerItemVariants}>
                    <TrustCard
                      icon={IconComponent}
                      title={card.title}
                      subtitle={card.subtitle}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>

          {/* Right Column: High-craft Product Mockup (Spans 6 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: editorialEasing }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <HeroMockup />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
