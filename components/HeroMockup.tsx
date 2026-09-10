"use client";

import React from "react";
import { Terminal, Globe } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] mx-auto select-none mt-10 lg:mt-0 flex items-center justify-center">
      
      {/* Background shadow container (the main product weight) */}
      <div className="w-[90%] aspect-[16/11] bg-[#1d1d1f] rounded-lg p-[1px] shadow-product border border-white/5 flex flex-col overflow-hidden relative">
        
        {/* Glossy Window Header */}
        <div className="bg-[#1d1d1f] h-9 px-4 flex items-center justify-between shrink-0 border-b border-white/5">
          {/* OS Window Buttons */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          
          {/* Simulated Browser Address bar / Workspace title */}
          <div className="bg-[#272729] border border-white/5 text-[9px] text-[#cccccc] font-mono px-6 py-1 rounded-full w-[45%] text-center truncate">
            hungdev.studio/editor
          </div>
          
          {/* Right indicator */}
          <span className="text-[8px] font-mono text-[#7a7a7a]">V09_STABLE</span>
        </div>

        {/* Workspace Split Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANE: Premium Code Editor (45% Width) */}
          <div className="w-[43%] bg-[#1c1c1e] border-r border-white/5 flex flex-col font-mono text-[8px] sm:text-[9.5px] text-[#cccccc]">
            {/* Tab header */}
            <div className="bg-[#141416] h-7 px-3 flex items-center border-b border-white/5 gap-1.5 text-[8px]">
              <span className="w-2 h-2 rounded-xs bg-[#0066cc] flex items-center justify-center text-white font-extrabold text-[5px]">TS</span>
              <span className="text-white">Page.tsx</span>
              <span className="text-[#7a7a7a] ml-1 select-none">×</span>
            </div>
            
            {/* File view / Code area */}
            <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
              {/* File tree indicator */}
              <div className="text-[#7a7a7a] flex items-center gap-1.5 text-[7.5px] select-none uppercase tracking-wider border-b border-white/5 pb-1">
                <Terminal className="w-3 h-3 text-[#0066cc]" />
                <span>workspace / src</span>
              </div>
              
              {/* React Next.js Code Syntax Highlight */}
              <div className="space-y-1.5 leading-relaxed font-mono">
                <div>
                  <span className="text-[#2997ff]">import</span> <span className="text-white">React</span> <span className="text-[#2997ff]">from</span> <span className="text-emerald-400">&quot;react&quot;</span>;
                </div>
                <div>
                  <span className="text-[#2997ff]">import</span> <span className="text-white">Navbar</span> <span className="text-[#2997ff]">from</span> <span className="text-emerald-400">&quot;./nav&quot;</span>;
                </div>
                <div className="pt-1.5">
                  <span className="text-[#2997ff]">export default function</span> <span className="text-white">Home()</span> {"{"}
                </div>
                <div className="pl-3">
                  <span className="text-[#2997ff]">return</span> (
                </div>
                <div className="pl-6 text-[#7a7a7a]">
                  &lt;<span className="text-rose-400">main</span> <span className="text-amber-300">className</span>=<span className="text-emerald-400">&quot;site&quot;</span>&gt;
                </div>
                <div className="pl-9 text-[#7a7a7a]">
                  &lt;<span className="text-rose-400">Navbar</span> /&gt;
                </div>
                <div className="pl-9 text-[#7a7a7a]">
                  &lt;<span className="text-rose-400">HeroSection</span>
                </div>
                <div className="pl-12 text-[#7a7a7a]">
                  <span className="text-amber-300">seoReady</span>={"{"}<span className="text-[#2997ff]">true</span>{"}"}
                </div>
                <div className="pl-12 text-[#7a7a7a]">
                  <span className="text-amber-300">speed</span>=<span className="text-emerald-400">&quot;100ms&quot;</span>
                </div>
                <div className="pl-9 text-[#7a7a7a]">
                  /&gt;
                </div>
                <div className="pl-6 text-[#7a7a7a]">
                  &lt;/<span className="text-rose-400">main</span>&gt;
                </div>
                <div className="pl-3">
                  );
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Live Website Preview Browser (57% Width) */}
          <div className="w-[57%] bg-white flex flex-col text-[7.5px] sm:text-[9.5px] text-[#1d1d1f] relative overflow-hidden">
            
            {/* Browser Header Bar */}
            <div className="bg-[#f5f5f7] h-7 px-3.5 flex items-center justify-between shrink-0 border-b border-[#e0e0e0] select-none">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
              </div>
              <div className="w-[82%] bg-white border border-[#e0e0e0] rounded-sm py-0.5 text-[#7a7a7a] flex items-center justify-center gap-1 text-[7px]">
                <Globe className="w-2 h-2 text-[#0066cc]" />
                <span className="truncate select-all">https://client-preview.dev</span>
              </div>
            </div>

            {/* Live Web Content Preview */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin bg-white">
              
              {/* Web Header */}
              <div className="flex justify-between items-center border-b border-[#f5f5f7] pb-1.5">
                <span className="font-bold text-[#1d1d1f] tracking-tight text-[9px]">SOLO AUDIO</span>
                <div className="flex items-center gap-2 text-[#7a7a7a] text-[6px]">
                  <span className="text-[#0066cc] font-semibold">Home</span>
                  <span>Products</span>
                  <span>Specs</span>
                </div>
              </div>

              {/* Web Hero Banner */}
              <div className="bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg p-3 flex items-center justify-between relative overflow-hidden h-[95px] sm:h-[115px]">
                {/* Glossy light effect */}
                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                
                <div className="space-y-1 z-10 max-w-[62%] text-[#1d1d1f]">
                  <span className="text-[5.5px] uppercase tracking-wider text-[#0066cc] font-bold">New Release</span>
                  <h5 className="font-bold text-[#1d1d1f] text-[9.5px] sm:text-[12px] leading-tight">
                    Solo Headset Pro. <br />Âm thanh tinh khiết.
                  </h5>
                  <p className="text-[5px] sm:text-[6px] text-[#7a7a7a]">Chống ồn chủ động vượt trội.</p>
                  <button className="bg-[#0066cc] text-white text-[5px] sm:text-[6px] font-normal px-2.5 py-0.5 rounded-full mt-1.5 apple-active-scale">
                    Khám phá
                  </button>
                </div>

                {/* Vector Headphone SVG */}
                <div className="relative shrink-0 pr-1 z-10">
                  <svg className="w-12 h-12 sm:w-15 sm:h-15 text-[#1d1d1f]" viewBox="0 0 100 100">
                    <path d="M15 55 A 35 35 0 0 1 85 55" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <rect x="6" y="46" width="16" height="28" rx="4" fill="currentColor" />
                    <rect x="78" y="46" width="16" height="28" rx="4" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Product Spotlight cards */}
              <div className="space-y-1.5">
                <span className="font-semibold text-[#1d1d1f] text-[6.5px] sm:text-[8px] block">Dòng sản phẩm</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white border border-[#e0e0e0] rounded-md p-1.5 flex flex-col justify-between items-center text-center">
                    <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center p-1">
                      <svg className="w-4 h-4 text-[#1d1d1f]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="font-bold text-[#0066cc] text-[5px] sm:text-[6.5px] block mt-1">690.000đ</span>
                  </div>
                  <div className="bg-white border border-[#e0e0e0] rounded-md p-1.5 flex flex-col justify-between items-center text-center">
                    <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center p-1">
                      <svg className="w-4 h-4 text-[#1d1d1f]" viewBox="0 0 100 100">
                        <rect x="30" y="30" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="font-bold text-[#0066cc] text-[5px] sm:text-[6.5px] block mt-1">1.290.000đ</span>
                  </div>
                  <div className="bg-white border border-[#e0e0e0] rounded-md p-1.5 flex flex-col justify-between items-center text-center">
                    <div className="w-full aspect-square bg-[#f5f5f7] rounded flex items-center justify-center p-1">
                      <svg className="w-4 h-4 text-[#1d1d1f]" viewBox="0 0 100 100">
                        <polygon points="50,28 72,66 28,66" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="font-bold text-[#0066cc] text-[5px] sm:text-[6.5px] block mt-1">1.500.000đ</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 5. Floating Widget 1: PageSpeed score dial (Top-Right, offset elegantly) */}
      <div className="absolute top-[8%] -right-4 sm:-right-8 w-[100px] sm:w-[125px] bg-white border border-[#e0e0e0] rounded-lg p-2.5 z-35 rotate-[3deg] transition-all duration-300 hover:rotate-0 hover:scale-105 shadow-md">
        <span className="text-[7px] font-semibold text-[#7a7a7a] uppercase tracking-wider block">PageSpeed</span>
        <span className="text-[9px] font-semibold text-[#1d1d1f] block mt-0.5">Core Vital Score</span>
        <div className="my-2.5 flex justify-center">
          <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f5f5f7" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3.2"
                strokeDasharray="100 100" strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-emerald-600">100</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-[7.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">Speed Optimized</span>
        </div>
      </div>

      {/* 6. Floating Widget 2: Google SEO Rank (Bottom-Left, offset elegantly) */}
      <div className="absolute bottom-[8%] -left-4 sm:-left-8 w-[100px] sm:w-[125px] bg-white border border-[#e0e0e0] rounded-lg p-2.5 z-35 rotate-[-2.5deg] transition-all duration-300 hover:rotate-0 hover:scale-105 shadow-md text-[8px] sm:text-[9.5px]">
        <div className="flex justify-between items-center border-b border-[#f0f0f0] pb-1.5 mb-1.5">
          <span className="text-[7.5px] font-semibold text-[#7a7a7a] uppercase tracking-wider">Search Position</span>
          <span className="text-[8px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-xs">TOP 1</span>
        </div>
        <div className="space-y-1.5 font-normal text-[#1d1d1f]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[7.5px]">Google Rank #1</span>
          </div>
          {/* Tiny SEO curve */}
          <div className="h-4 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 30">
              <path d="M0,25 Q15,8 40,22 T80,5 T100,2" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
