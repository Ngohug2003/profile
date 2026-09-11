"use client";

import React from "react";
import Image from "next/image";
import { Code, Cpu, ShieldCheck, Sparkles, MapPin, CheckCircle2, Award } from "lucide-react";
import { appContent } from "@/constants/content";

const iconMap = {
  Code,
  Cpu,
  ShieldAlert: ShieldCheck,
};

export default function AboutSection() {
  const { badge, title, description, bioText1, bioText2, focusCards } = appContent.about;

  return (
    <section id="gioi-thieu" className="relative w-full py-16 md:py-24 bg-zinc-950 text-white overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Paragraphs (Spans 6 columns) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-400 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h2 className="typography-display-lg text-white font-display">
              {title}
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
              <p className="text-zinc-300">
                {description}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {bioText1}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {bioText2}
              </p>
            </div>

            {/* Focus Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
              {focusCards.map((item, index) => {
                const IconComponent = iconMap[item.iconName as keyof typeof iconMap] || ShieldCheck;
                return (
                  <div 
                    key={index}
                    className="p-4 bg-zinc-900/80 border border-white/10 rounded-xl space-y-2 hover:border-blue-500/50 transition-all duration-200"
                  >
                    <div className="p-2 bg-white/5 text-blue-400 border border-white/10 rounded-lg w-fit">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-100">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Modern Bento Visual Showcase (Spans 6 columns) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[480px] p-6 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl space-y-5">
              
              {/* Header profile info */}
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30 shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                    alt="Ngọ Viết Hưng - Fullstack Web Developer"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Ngọ Viết Hưng</h3>
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-blue-400 font-medium">Freelance UI/UX & Web Developer</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>Hà Nội, Việt Nam</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[11px] text-zinc-400 font-medium">Tốc độ chuẩn</div>
                  <div className="text-lg font-bold text-emerald-400 font-display">&lt; 0.8s</div>
                  <div className="text-[10px] text-zinc-500">PageSpeed xanh 98+</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[11px] text-zinc-400 font-medium">Tỷ lệ hài lòng</div>
                  <div className="text-lg font-bold text-blue-400 font-display">100%</div>
                  <div className="text-[10px] text-zinc-500">Hỗ trợ trọn vòng đời</div>
                </div>
              </div>

              {/* Tech stack badges */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Công nghệ cốt lõi
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "PostgreSQL", "Prisma", "Docker", "Figma"].map((tech) => (
                    <span 
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-white/5 border border-white/10 text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quality pledge */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  <strong>Cam kết chất lượng:</strong> Bàn giao mã nguồn sạch sẽ, không mã hoá, dễ dàng mở rộng và tối ưu chuyển đổi khách hàng.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
