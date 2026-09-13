"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Award,
  Layers,
  Server,
  Cloud,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants, editorialEasing } from "./ScrollReveal";

const categoryIconMap = {
  Layers,
  Server,
  Cloud,
  Wrench,
};

export default function AboutSection() {
  const { 
    badge, 
    title, 
    description, 
    bioText1, 
    bioText2, 
    skillCategories, 
    profileCard 
  } = appContent.about;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tự động chuyển card mỗi 2.2 giây (tạm dừng khi hover chuột)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % skillCategories.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isPaused, skillCategories.length]);

  const activeCategory = skillCategories[activeIdx];
  const ActiveIcon = categoryIconMap[activeCategory.iconName] || Layers;

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + skillCategories.length) % skillCategories.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % skillCategories.length);
  };

  return (
    <section id="gioi-thieu" className="relative w-full py-16 md:py-24 bg-zinc-950 text-white overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* CỘT TRÁI: Giới thiệu & BỘ CARD KỸ NĂNG CHẠY TỰ ĐỘNG (Spans 6 columns) - hiện lần lượt */}
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
            custom={{ stagger: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            
            {/* Pill Badge */}
            <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-400 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{badge}</span>
            </motion.div>

            {/* Title */}
            <motion.h2 variants={staggerItemVariants} className="typography-display-lg text-white font-display">
              {title}
            </motion.h2>

            {/* Description Paragraphs */}
            <motion.div variants={staggerItemVariants} className="space-y-3 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
              <p className="text-zinc-300">
                {description}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {bioText1}
              </p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {bioText2}
              </p>
            </motion.div>

            {/* KHU VỰC SKILL DECK: CHẠY TỪNG CARD (Frontend, Backend, Cloud, Tools) */}
            <motion.div 
              variants={staggerItemVariants}
              className="pt-5 border-t border-white/10 space-y-3.5"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              
              {/* Header điều khiển: 4 Tab chọn danh mục + Nút Next/Prev */}
              <div className="flex items-center justify-between gap-2">
                
                {/* 4 Tabs: Frontend, Backend, Cloud, Tools */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {skillCategories.map((cat, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                            : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-white/5"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Điều hướng Trước/Sau */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Kỹ năng trước"
                    title="Trước"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Kỹ năng tiếp theo"
                    title="Sau"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Khung Card Kỹ Năng Đang Chạy (Cố định khung ngoài vĩnh viễn, triệt tiêu 100% giật khung hình) */}
              <div className="rounded-2xl bg-zinc-900/90 border border-white/10 shadow-xl p-5 overflow-hidden min-h-[224px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeCategory.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    {/* Header Card: Cố định 42px */}
                    <div className="flex items-center justify-between gap-3 h-[42px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                          <ActiveIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                            Stack {activeCategory.tag} • {activeCategory.label}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white truncate">
                            {activeCategory.title}
                          </h4>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 shrink-0">
                        {activeIdx + 1} / {skillCategories.length}
                      </span>
                    </div>

                    {/* Mô tả ngắn: Cố định 34px (2 dòng) */}
                    <p className="text-xs text-zinc-400 leading-relaxed h-[34px] line-clamp-2">
                      {activeCategory.desc}
                    </p>

                    {/* Danh sách Tags Kỹ Năng: Cố định vùng 58px */}
                    <div className="flex flex-wrap gap-1.5 min-h-[58px] content-start">
                      {activeCategory.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors ${
                            skill.highlight
                              ? "bg-white/10 text-white border-white/20 font-medium"
                              : "bg-white/5 text-zinc-400 border-white/5"
                          }`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    {/* Điểm nhấn chuyên môn: Cố định 24px */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1 h-[24px]">
                      {activeCategory.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>

          </motion.div>

          {/* CỘT PHẢI: Card Profile Cá Nhân (Spans 6 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.7, ease: editorialEasing }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[480px] p-6 rounded-3xl bg-zinc-900/90 border border-white/10 shadow-2xl space-y-5">
              
              {/* Header profile info */}
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/30 shrink-0">
                  <Image
                    src={profileCard.avatarUrl}
                    alt={`${profileCard.name} - ${profileCard.role}`}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{profileCard.name}</h3>
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-blue-400 font-medium">{profileCard.role}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{profileCard.location}</span>
                  </div>
                </div>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                {profileCard.stats.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="text-[11px] text-zinc-400 font-medium">{st.label}</div>
                    <div className="text-lg font-bold text-emerald-400 font-display">{st.value}</div>
                    <div className="text-[10px] text-zinc-500">{st.subtext}</div>
                  </div>
                ))}
              </div>

              {/* Tech stack badges */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Công nghệ cốt lõi
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profileCard.coreTechBadges.map((tech) => (
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
                  <strong>Cam kết chất lượng:</strong> {profileCard.qualityPledge}
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
