"use client";

import React from "react";
import Image from "next/image";
import { Code, Cpu, ShieldAlert, Laptop, Coffee, Sparkles } from "lucide-react";
import { appContent } from "@/constants/content";

const iconMap = {
  Code,
  Cpu,
  ShieldAlert,
};

export default function AboutSection() {
  const { badge, title, description, bioText1, bioText2, focusCards } = appContent.about;

  return (
    <section id="gioi-thieu" className="relative w-full py-section bg-surface-tile-1 text-white select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Paragraphs (Spans 6 columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#2997ff] bg-white/5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h2 className="typography-display-lg text-white">
              {title}
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-[#cccccc] font-normal leading-relaxed">
              <p className="typography-body">
                {description}
              </p>
              <p className="typography-caption">
                {bioText1}
              </p>
              <p className="typography-caption">
                {bioText2}
              </p>
            </div>

            {/* Focus Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
              {focusCards.map((item, index) => {
                const IconComponent = iconMap[item.iconName];
                return (
                  <div 
                    key={index}
                    className="p-4 bg-surface-tile-2 border border-white/5 rounded-lg space-y-2.5 hover:border-[#2997ff]/60 transition-colors"
                  >
                    <div className="p-2 bg-[#1d1d1f] text-[#2997ff] border border-white/5 rounded-md w-fit">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="typography-caption-strong text-white">
                      {item.title}
                    </h4>
                    <p className="typography-micro-legal text-[#cccccc]">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Premium Realistic Code & Developer Desk Mockup (Spans 6 columns) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[460px] h-[360px] sm:h-[420px] rounded-lg bg-surface-tile-2 border border-white/5 overflow-hidden shadow-2xl">
              
              {/* Grid lines background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Central avatar portrait card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[240px] aspect-[4/5] bg-[#1d1d1f] border border-white/10 rounded-lg overflow-hidden shadow-product z-20">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                  alt="Hưng Full-stack Developer portrait"
                  fill
                  priority
                  sizes="(max-w-[768px]) 200px, 240px"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xs p-2 text-center border-t border-white/5">
                  <span className="typography-micro-legal text-white font-semibold">Hưng Dev Studio</span>
                </div>
              </div>

              {/* Floating Code Editor Snippet (Top-Left) */}
              <div className="absolute left-[5%] top-[8%] w-[110px] sm:w-[130px] bg-[#1c1c1e] border border-white/5 rounded-md p-2 z-35 rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="flex gap-1 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="font-mono text-[5.5px] sm:text-[6.5px] text-[#7a7a7a] space-y-0.5 leading-tight">
                  <div><span className="text-[#2997ff]">const</span> <span className="text-white">dev</span> = {"{"}</div>
                  <div className="pl-1.5">name: <span className="text-emerald-400">"Hưng"</span>,</div>
                  <div className="pl-1.5">role: <span className="text-emerald-400">"Fullstack"</span>,</div>
                  <div className="pl-1.5">speed: <span className="text-emerald-400">"100ms"</span></div>
                  <div>{"};"}</div>
                </div>
              </div>

              {/* Floating Shopzone Headphones Card (Top-Right) */}
              <div className="absolute right-[5%] top-[10%] w-[100px] sm:w-[120px] bg-white text-[#1d1d1f] border border-[#e0e0e0] rounded-md p-2 z-25 rotate-[2.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="w-full aspect-video bg-[#f5f5f7] rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1d1d1f]" viewBox="0 0 100 100">
                    <path d="M20 55 A 30 30 0 0 1 80 55" fill="none" stroke="currentColor" strokeWidth="6" />
                  </svg>
                </div>
                <span className="text-[5.5px] sm:text-[7px] font-bold text-[#1d1d1f] block mt-1">Shopzone Audio</span>
                <span className="text-[5px] sm:text-[6px] text-[#0066cc] font-semibold block">Tốc độ load: 0.9s</span>
              </div>

              {/* Floating Laptop Card (Bottom-Left) */}
              <div className="absolute left-[6%] bottom-[8%] w-[100px] sm:w-[125px] bg-[#1c1c1e] border border-white/5 rounded-md p-2 z-25 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1 text-[5px] sm:text-[6.5px]">
                  <span className="text-[#cccccc] font-semibold">Active Server</span>
                  <span className="text-[#2997ff] font-bold">ONLINE</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <Laptop className="w-3.5 h-3.5 text-[#2997ff]" />
                  <span className="font-mono text-[5.5px] sm:text-[7px] text-[#cccccc]">Next.js SSR</span>
                </div>
              </div>

              {/* Floating Coffee Cup Card (Bottom-Right) */}
              <div className="absolute right-[6%] bottom-[8%] w-[90px] sm:w-[110px] bg-white text-[#1d1d1f] border border-[#e0e0e0] rounded-md p-2 z-25 rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#f5f5f7] text-[#0066cc]">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[5.5px] sm:text-[7px] font-bold text-[#1d1d1f] block">Coffee Code</span>
                    <span className="text-[4.5px] sm:text-[5.5px] text-[#7a7a7a] block">Status: Active</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
