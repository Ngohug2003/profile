"use client";

import React from "react";
import { Zap, Smartphone, Search, LineChart, TrendingDown, Smile } from "lucide-react";
import { appContent } from "@/constants/content";

const iconMap = {
  Zap,
  Smartphone,
  Search,
  LineChart,
  TrendingDown,
  Smile,
};

export default function ProblemsSection() {
  const { badge, title, description, problems } = appContent.problems;

  return (
    <section id="gioi-thieu" className="relative w-full py-section bg-canvas-parchment text-[#1d1d1f] select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 space-y-4">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0066cc] bg-white rounded-full border border-[#e0e0e0]">
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

        {/* Problems Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((item, index) => {
            const IconComponent = iconMap[item.iconName];
            return (
              <div 
                key={index}
                className="bg-white border border-[#e0e0e0] rounded-lg p-6 space-y-4 hover:border-[#0066cc] transition-colors duration-300 apple-active-scale"
              >
                {/* Icon box (flat parchment with blue tint) */}
                <div className="p-3 bg-[#f5f5f7] border border-[#e0e0e0] text-[#0066cc] rounded-lg w-fit">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="typography-caption-strong text-[#1d1d1f]">
                    {item.title}
                  </h3>
                  <p className="typography-caption text-[#7a7a7a] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
