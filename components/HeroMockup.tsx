"use client";

import React from "react";
import { Terminal, Globe, Zap, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="relative w-full max-w-[620px] aspect-[4/3] mx-auto select-none mt-6 lg:mt-0 flex items-center justify-center">
      
      {/* Subtle Glow behind the mockup */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent rounded-2xl blur-xl -z-10" />

      {/* Main Container */}
      <div className="w-full aspect-[16/11] bg-zinc-950 rounded-2xl p-[1px] shadow-2xl ring-1 ring-zinc-800/80 flex flex-col overflow-hidden relative">
        
        {/* Top Window Header */}
        <div className="bg-zinc-900/90 h-10 px-4 flex items-center justify-between shrink-0 border-b border-zinc-800">
          {/* OS Window Control dots */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90" />
            <span className="w-3 h-3 rounded-full bg-amber-400/90" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/90" />
          </div>
          
          {/* Simulated Browser Address bar */}
          <div className="bg-zinc-950/80 border border-zinc-800 text-[10px] text-zinc-400 font-mono px-4 py-1 rounded-full w-[45%] text-center truncate flex items-center justify-center gap-1.5">
            <Globe className="w-3 h-3 text-blue-400" />
            <span>hungdev.studio/showcase</span>
          </div>
          
          {/* Right indicator */}
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Workspace Split Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT PANE: Code Editor (44% Width) */}
          <div className="w-[44%] bg-zinc-950 border-r border-zinc-800 flex flex-col font-mono text-[9px] sm:text-[10px] text-zinc-300">
            {/* Tab header */}
            <div className="bg-zinc-900/50 h-8 px-3 flex items-center border-b border-zinc-800 gap-2 text-[9px]">
              <span className="px-1 py-0.2 rounded bg-blue-600 text-white font-bold text-[7px]">TSX</span>
              <span className="text-zinc-200">page.tsx</span>
            </div>
            
            {/* Code area */}
            <div className="flex-1 p-3.5 space-y-2 overflow-hidden leading-relaxed">
              <div className="text-zinc-500 flex items-center gap-1 text-[8px] uppercase tracking-wider pb-1 border-b border-zinc-800/60">
                <Terminal className="w-3 h-3 text-blue-400" />
                <span>Next.js 16 App Router</span>
              </div>
              
              <div className="space-y-1 font-mono text-[8.5px] sm:text-[9.5px]">
                <div>
                  <span className="text-blue-400">export default</span>{" "}
                  <span className="text-purple-400">function</span>{" "}
                  <span className="text-amber-300">App</span>() {"{"}
                </div>
                <div className="pl-2.5">
                  <span className="text-blue-400">return</span> (
                </div>
                <div className="pl-5 text-zinc-400">
                  &lt;<span className="text-rose-400">Portfolio</span>
                </div>
                <div className="pl-7 text-zinc-400">
                  <span className="text-teal-300">speed</span>=<span className="text-emerald-300">&quot;100/100&quot;</span>
                </div>
                <div className="pl-7 text-zinc-400">
                  <span className="text-teal-300">seo</span>=<span className="text-blue-300">&#123;true&#125;</span>
                </div>
                <div className="pl-7 text-zinc-400">
                  <span className="text-teal-300">ux</span>=<span className="text-emerald-300">&quot;apple-minimal&quot;</span>
                </div>
                <div className="pl-5 text-zinc-400">/&gt;</div>
                <div className="pl-2.5">);</div>
                <div>{"}"}</div>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[8px] text-zinc-500">
                <span>UTF-8</span>
                <span className="text-blue-400">TypeScript 5.x</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Live Website Preview Browser (56% Width) */}
          <div className="w-[56%] bg-white flex flex-col text-zinc-900 relative overflow-hidden">
            
            {/* Browser Header Bar */}
            <div className="bg-zinc-100/90 h-8 px-3 flex items-center justify-between shrink-0 border-b border-zinc-200">
              <span className="text-[9px] font-bold tracking-tight text-zinc-800">PREVIEW</span>
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 text-[8px] font-semibold">
                <Zap className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                <span>99/100 Speed</span>
              </div>
            </div>

            {/* Simulated Live Web Content */}
            <div className="flex-1 p-3.5 space-y-2.5 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-white to-zinc-50">
              
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[8px] font-medium border border-blue-100">
                  <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                  <span>Landing Page Chuyên Nghiệp</span>
                </div>
                
                <h4 className="text-[12px] sm:text-[14px] font-bold text-zinc-900 leading-tight">
                  Tăng 48% Tỷ Lệ Đăng Ký Khách Hàng.
                </h4>
                
                <p className="text-[8px] sm:text-[9.5px] text-zinc-500 leading-snug">
                  Giao diện chuẩn phong cách tối giản, tải trang trong 0.8s, tạo thiện cảm ngay cái nhìn đầu tiên.
                </p>
              </div>

              {/* Sample Product Cards Preview */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                  <div className="w-full h-10 bg-zinc-100 rounded-md flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-[8px] font-semibold text-zinc-800">Chuẩn SEO</div>
                  <div className="text-[7px] text-zinc-500">Top 1 Google</div>
                </div>

                <div className="p-2 rounded-lg bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                  <div className="w-full h-10 bg-blue-50 rounded-md flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-[8px] font-semibold text-zinc-800">Siêu Tốc</div>
                  <div className="text-[7px] text-zinc-500">Next.js 16 SSR</div>
                </div>
              </div>

              {/* Action Button Mock */}
              <div className="w-full py-1.5 rounded-lg bg-zinc-900 text-white text-[8px] font-medium text-center shadow-2xs">
                Xem Demo Trực Tiếp →
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Floating Pill Badge 1: PageSpeed Metric (Top-Right) */}
      <div className="absolute -top-3 -right-2 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce duration-1000">
        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Zap className="w-3 h-3 fill-emerald-600" />
        </div>
        <div className="text-left">
          <div className="text-[9px] text-zinc-500 font-medium">PageSpeed</div>
          <div className="text-[11px] font-bold text-zinc-900 leading-none">100/100</div>
        </div>
      </div>

      {/* Floating Pill Badge 2: Conversion Boost (Bottom-Left) */}
      <div className="absolute -bottom-3 -left-2 bg-white/95 backdrop-blur-md border border-zinc-200 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-[11px] font-semibold text-zinc-800">
          Cam kết bảo hành trọn đời
        </span>
      </div>

    </div>
  );
}
