"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Check, ArrowRight, ExternalLink, Sparkles, FolderKanban } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { appContent } from "@/constants/content";
import { staggerContainerVariants, staggerItemVariants, editorialEasing } from "./ScrollReveal";

export interface DbProject {
  id: string;
  name: string;
  category: string | null;
  description: string;
  techStack: string[];
  features: string[];
  imageUrl: string;
  domain: string | null;
}

interface PortfolioSectionProps {
  initialProjects?: DbProject[];
}

export default function PortfolioSection({ initialProjects = [] }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { badge, title, description, categories, bannerTitle, bannerDesc, bannerCta } = appContent.portfolio;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  // Chuẩn hóa danh sách dự án (từ DB nếu có, fallback về content constants nếu DB trống)
  const displayProjects = initialProjects.length > 0
    ? initialProjects.map((p) => ({
      id: p.id,
      title: p.name,
      category: p.category || "Landing Page",
      desc: p.description,
      features: p.features && p.features.length > 0 ? p.features : ["Tối ưu hiệu năng", "Chuẩn SEO onpage", "Responsive 100%"],
      techStack: p.techStack,
      imageUrl: p.imageUrl,
      domain: p.domain,
      ctaText: p.domain ? "Xem dự án demo" : "Tư vấn dự án tương tự",
    }))
    : appContent.portfolio.projects.map((p, idx) => ({
      id: `mock-${idx}`,
      ...p,
      imageUrl: null,
      domain: null,
    }));

  // Lọc theo danh mục
  const filteredProjects = selectedCategory === "Tất cả"
    ? displayProjects
    : displayProjects.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      if (selectedCategory === "Landing Page") return cat.includes("landing");
      if (selectedCategory === "Website Bán Hàng") return cat.includes("hàng") || cat.includes("commerce") || cat.includes("shop");
      if (selectedCategory === "Web Doanh Nghiệp") return cat.includes("doanh nghiệp") || cat.includes("corporate") || cat.includes("b2b");
      return true;
    });

  const isCarousel = filteredProjects.length >= 4;

  // Để Embla Carousel loop vô hạn liên tục khi lướt (không bao giờ bị cụt đầu/cuối),
  // cần số lượng slide tối thiểu 8 slides (gấp đôi viewport hiển thị 3-4 slides).
  const carouselSlides = useMemo(() => {
    if (!isCarousel || filteredProjects.length === 0) return filteredProjects;
    let slides = [...filteredProjects];
    while (slides.length < 8) {
      slides = [...slides, ...filteredProjects];
    }
    return slides;
  }, [isCarousel, filteredProjects]);

  // Cấu hình Embla Carousel siêu nhạy, lướt nhẹ tay, quán tính mượt mà (không bị ghìm cứng)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: true, // Lướt tự nhiên theo quán tính tay/chuột, không bị ghìm cứng từng nấc
      dragThreshold: 4, // Phản hồi tức thì khi vừa rê tay (giảm độ trễ từ 10px xuống 4px)
      duration: 35, // Quán tính lướt trôi êm ái, tiếp đất mượt mà
    },
    [
      Autoplay({
        delay: 4500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Re-init carousel khi danh mục hoặc số slide thay đổi
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, carouselSlides]);

  // Chuyển tới slide tương ứng với chấm tròn (chọn snap gần nhất để lướt mượt và đúng vòng lặp)
  const scrollTo = useCallback((idx: number) => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    const n = filteredProjects.length;
    if (n === 0) return;

    const candidates = [idx, idx + n, idx + 2 * n, idx - n];
    let best = idx;
    let minDist = Infinity;
    for (const c of candidates) {
      if (c >= 0 && c < carouselSlides.length) {
        const dist = Math.abs(c - current);
        if (dist < minDist) {
          minDist = dist;
          best = c;
        }
      }
    }
    emblaApi.scrollTo(best);
  }, [emblaApi, filteredProjects.length, carouselSlides.length]);

  const renderProjectMockup = (title: string, imageUrl?: string | null) => {
    if (imageUrl) {
      return (
        <div className="relative w-full aspect-[16/10] bg-zinc-100 rounded-2xl border border-zinc-200/80 overflow-hidden shrink-0 group select-none pointer-events-none">
          <img
            src={imageUrl}
            alt={title}
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
          />
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200/60 rounded-2xl border border-zinc-200/80 flex flex-col p-3 overflow-hidden shrink-0 group select-none pointer-events-none">
        <div className="bg-white border border-zinc-200 px-3 py-1.5 flex items-center justify-between rounded-lg shrink-0 shadow-2xs">
          <span className="text-blue-600 font-bold text-[10px] font-mono">{title}</span>
          <div className="bg-zinc-100 px-2 py-0.5 rounded text-[9px] text-zinc-500 font-mono">
            https://demo.hungdev.studio
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-2xs text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-700">{title} — Minimal Aesthetic</span>
          <span className="text-[10px] text-zinc-500">Tối ưu tải trang 0.8s • Next.js 16</span>
        </div>
      </div>
    );
  };

  const renderProjectCard = (project: (typeof displayProjects)[0], index: number, key?: string) => (
    <div
      key={key ?? (project.id || index)}
      data-project-card
      className="w-full h-full flex flex-col justify-between bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 select-none shadow-2xs hover:border-zinc-300 hover:shadow-card card-hover-lift"
    >
      <div className="space-y-4 flex flex-col">

        {/* Image / Mockup Preview */}
        {renderProjectMockup(project.title, project.imageUrl)}

        {/* Meta details: Badge + Tech Tags - ĐỒNG ĐỀU 1 DÒNG CHUẨN XÁC */}
        <div className="flex items-center justify-between gap-2 pt-1 h-[26px]">
          <span className="whitespace-nowrap shrink-0 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
            {project.category}
          </span>

          {/* Tech tags: Hiển thị tối đa 2 tags gọn gàng, không bị xuống dòng */}
          <div className="flex items-center gap-1 overflow-hidden justify-end">
            {project.techStack.slice(0, 2).map((tech, idx) => (
              <span key={idx} className="whitespace-nowrap text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded shrink-0">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Title & Description: CỐ ĐỊNH CHIỀU CAO ĐỒNG ĐỀU */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-zinc-950 font-display line-clamp-1 h-[28px] flex items-center">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-2 h-[40px]">
            {project.desc}
          </p>
        </div>

        {/* Features list: CỐ ĐỊNH KHUNG HIỂN THỊ */}
        <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 h-[84px] flex flex-col justify-center">
          {project.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="text-xs text-zinc-700 line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Action Button: CỐ ĐỊNH Ở ĐÁY THẺ */}
      <div className="pt-5 mt-auto">
        {project.domain ? (
          <a
            href={project.domain}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 rounded-xl transition-colors cursor-pointer btn-press select-none"
          >
            <span>Xem dự án thực tế</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={handleOpenConsultation}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 rounded-xl transition-colors cursor-pointer btn-press select-none"
          >
            <span>Tư vấn dự án tương tự</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );

  return (
    <section id="du-an" className="relative w-full py-16 md:py-24 bg-[#fafafa] border-t border-zinc-200/60 overflow-hidden">

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10">

        {/* Section Header - hiện lần lượt */}
        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
          custom={{ stagger: 0.1 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div className="max-w-[640px] space-y-3.5">
            <motion.div variants={staggerItemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </motion.div>

            <motion.h2 variants={staggerItemVariants} className="typography-display-lg text-zinc-950">
              {title}
            </motion.h2>

            <motion.p variants={staggerItemVariants} className="typography-body text-zinc-600">
              {description}
            </motion.p>
          </div>

          {/* Right Controls: CHỈ CÒN Category Filter Tabs */}
          <motion.div variants={staggerItemVariants} className="flex flex-wrap gap-1.5 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/60 w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                  if (emblaApi) emblaApi.scrollTo(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${selectedCategory === cat
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-white/50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Projects Display: Embla Carousel (khi có >= 4 dự án) hoặc Grid (khi < 4) */}
        {isCarousel ? (
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.7, ease: editorialEasing }}
            className="space-y-6"
          >
            {/* Embla Viewport with Inertial Physics & Seamless Infinite Loop */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y" ref={emblaRef}>
              <div className="flex -ml-6 items-stretch">
                {carouselSlides.map((project, index) => (
                  <div
                    key={`${project.id}-track-${index}`}
                    className="pl-6 min-w-0 shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 flex select-none"
                  >
                    {renderProjectCard(project, index, `${project.id}-card-${index}`)}
                  </div>
                ))}
              </div>
            </div>

            {/* CHẤM TRÒN ĐIỀU HƯỚNG DỰ ÁN */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {filteredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    selectedIndex === idx 
                      ? "w-8 h-2 bg-blue-600 shadow-2xs" 
                      : "w-2 h-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Chuyển tới dự án ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
            custom={{ stagger: 0.12 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {filteredProjects.map((project, index) => (
              <motion.div key={project.id || index} variants={staggerItemVariants}>
                {renderProjectCard(project, index, `${project.id}-grid-${index}`)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom Banner Callout */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.7, ease: editorialEasing }}
          className="mt-14 rounded-3xl bg-zinc-950 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden"
        >
          <div className="space-y-2 text-center md:text-left z-10">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              {bannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-[600px]">
              {bannerDesc}
            </p>
          </div>
          <button
            onClick={handleOpenConsultation}
            className="z-10 inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 transition-all rounded-full shadow-xs shrink-0 cursor-pointer btn-press"
          >
            {bannerCta}
          </button>
        </motion.div>

      </div>
    </section>
  );
}
