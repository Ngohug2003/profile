"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  X,
  Sparkles,
  CheckCircle2,
  Maximize2,
  FolderKanban,
  Zap,
  Smartphone,
  ShieldCheck,
  Clock,
  LayoutGrid,
  Columns,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ContactInfoModal from "./ContactInfoModal";

export interface ProjectItem {
  id: string;
  name: string;
  category: string | null;
  description: string;
  techStack: string[];
  features: string[];
  imageUrl: string;
  domain: string | null;
}

interface ProjectShowcaseProps {
  projects: ProjectItem[];
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"large" | "compact">("compact");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState<boolean>(false);

  // Lắng nghe sự kiện mở popup thông tin liên hệ từ Navbar hoặc các nơi khác
  useEffect(() => {
    const handleOpenContactInfo = () => setIsContactInfoModalOpen(true);
    window.addEventListener("open-contact-info-modal", handleOpenContactInfo);
    return () => window.removeEventListener("open-contact-info-modal", handleOpenContactInfo);
  }, []);

  // Danh mục cố định
  const categories = ["Tất cả", "Landing Page", "Website Bán Hàng", "Web Doanh Nghiệp"];

  // Đếm số lượng theo danh mục
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tất cả": projects.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = projects.filter((p) => {
        const c = p.category?.toLowerCase() || "";
        if (cat === "Landing Page") return c.includes("landing");
        if (cat === "Website Bán Hàng") return c.includes("hàng") || c.includes("commerce") || c.includes("shop");
        if (cat === "Web Doanh Nghiệp") return c.includes("doanh nghiệp") || c.includes("corporate") || c.includes("b2b");
        return false;
      }).length;
    });
    return counts;
  }, [projects]);

  // Lọc và tìm kiếm dự án
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Lọc theo Category
      if (selectedCategory !== "Tất cả") {
        const cat = project.category?.toLowerCase() || "";
        if (selectedCategory === "Landing Page" && !cat.includes("landing")) return false;
        if (selectedCategory === "Website Bán Hàng" && !(cat.includes("hàng") || cat.includes("commerce") || cat.includes("shop"))) return false;
        if (selectedCategory === "Web Doanh Nghiệp" && !(cat.includes("doanh nghiệp") || cat.includes("corporate") || cat.includes("b2b"))) return false;
      }

      // Lọc theo Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchName = project.name.toLowerCase().includes(q);
        const matchDesc = project.description.toLowerCase().includes(q);
        const matchCat = (project.category || "").toLowerCase().includes(q);
        const matchTech = project.techStack.some((t) => t.toLowerCase().includes(q));
        const matchFeature = project.features.some((f) => f.toLowerCase().includes(q));
        return matchName || matchDesc || matchCat || matchTech || matchFeature;
      }

      return true;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="w-full pb-20">
      {/* Header / Hero Showcase */}
      <section className="relative w-full pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-white via-[#fafafa] to-[#fafafa] border-b border-zinc-200/70">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-[720px] space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100 shadow-2xs">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>TECHNICAL PORTFOLIO &amp; SHOWCASE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 font-display tracking-tight leading-[1.15]">
                Dự Án &amp; Sản Phẩm Kỹ Thuật
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-[620px]">
                Trưng bày trực quan các dự án thực tế dành cho Nhà tuyển dụng &amp; Đối tác kỹ thuật. Toàn bộ sản phẩm được xây dựng với mã nguồn chuẩn TypeScript, tối ưu SEO Onpage, tốc độ tải trang dưới 1s và tương thích mượt mà trên mọi thiết bị.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-2xs">
              <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>&lt; 1.0s</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">Tốc độ tải</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">Responsive</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>98+</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">PageSpeed</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center gap-1.5 text-purple-600 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Clean Code</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">Chuẩn cấu trúc</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Filter, Search & Controls Bar */}
      <section className="z-30 w-full py-4 bg-[#fafafa]/95 backdrop-blur-md border-b border-zinc-200/60 transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Category Filter Pills với animation trượt mượt mà */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="relative whitespace-nowrap px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                  >
                    {/* Active Pill Background Slider */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-zinc-950 rounded-xl shadow-xs"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}

                    <span className={`relative z-10 ${isActive ? "text-white" : "text-zinc-700 hover:text-zinc-950"}`}>
                      {cat}
                    </span>
                    <span
                      className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${isActive ? "bg-zinc-800 text-zinc-200" : "bg-zinc-200/70 text-zinc-600"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Layout View Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-[280px]">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án, công nghệ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View layout toggle buttons với animation trượt */}
              <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-zinc-200/80 shadow-2xs shrink-0">
                <button
                  onClick={() => setViewMode("compact")}
                  className="relative p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Xem dạng lưới 3 cột"
                >
                  {viewMode === "compact" && (
                    <motion.div
                      layoutId="activeViewPill"
                      className="absolute inset-0 bg-zinc-100 rounded-lg"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <LayoutGrid
                    className={`relative z-10 w-4 h-4 ${viewMode === "compact" ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-700"
                      }`}
                  />
                </button>

                <button
                  onClick={() => setViewMode("large")}
                  className="relative p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Xem dạng thẻ lớn 2 cột"
                >
                  {viewMode === "large" && (
                    <motion.div
                      layoutId="activeViewPill"
                      className="absolute inset-0 bg-zinc-100 rounded-lg"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Columns
                    className={`relative z-10 w-4 h-4 ${viewMode === "large" ? "text-zinc-950 font-bold" : "text-zinc-400 hover:text-zinc-700"
                      }`}
                  />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Project Showcase Grid với Framer Motion layout animations */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8">

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500">
          <div>
            Hiển thị <span className="font-bold text-zinc-900">{filteredProjects.length}</span> dự án{" "}
            {selectedCategory !== "Tất cả" && (
              <span>
                trong danh mục &quot;<span className="font-semibold text-blue-600">{selectedCategory}</span>&quot;
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}với từ khóa &quot;<span className="font-semibold text-zinc-800">{searchQuery}</span>&quot;
              </span>
            )}
          </div>
          {(searchQuery || selectedCategory !== "Tất cả") && (
            <button
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center bg-white border border-dashed border-zinc-300 rounded-3xl p-8 space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 font-display">Không tìm thấy dự án phù hợp</h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-[400px] mx-auto">
                Không có dự án nào khớp với tiêu chí tìm kiếm hoặc phân loại hiện tại. Hãy thử từ khóa khác hoặc xóa bộ lọc.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("Tất cả");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Xem tất cả dự án
            </button>
          </motion.div>
        ) : (
          /* Projects Grid with Motion Layout Animations */
          <motion.div
            layout
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`grid gap-6 sm:gap-8 items-stretch ${viewMode === "large" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  layoutId={project.id}
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{
                    layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.28 },
                    scale: { duration: 0.28 },
                  }}
                  className="group bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-2xs hover:shadow-card hover:border-zinc-300 transition-shadow duration-300 flex flex-col justify-between h-full"
                >
                  <div className="flex flex-col flex-1">
                    {/* Browser Mockup Window Header */}
                    <div className="h-[36px] bg-zinc-100/90 border-b border-zinc-200/80 px-4 py-1.5 flex items-center justify-between select-none shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                      </div>

                      <div className="px-2.5 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-mono text-zinc-500 truncate max-w-[150px] sm:max-w-[200px]">
                        {project.domain ? project.domain.replace(/^https?:\/\//, "") : `preview.${project.name.toLowerCase().replace(/\s+/g, "")}.dev`}
                      </div>

                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors cursor-pointer"
                        title="Xem chi tiết kỹ thuật & ảnh to"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Project Image Mockup with Hover Overlay */}
                    <div
                      onClick={() => setActiveModalProject(project)}
                      className="relative aspect-[16/10] bg-zinc-100 overflow-hidden cursor-pointer group/img shrink-0"
                    >
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200/60 flex flex-col items-center justify-center p-6 text-center space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-xs text-blue-600">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-bold text-zinc-800 font-display">{project.name}</span>
                          <span className="text-xs text-zinc-500">Mã nguồn tối ưu hiệu năng cao</span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalProject(project);
                          }}
                          className="px-4 py-2 rounded-full bg-white text-zinc-950 text-xs font-semibold shadow-lg hover:bg-zinc-100 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Chi tiết &amp; ảnh to</span>
                        </button>
                      </div>
                    </div>

                    {/* Body Info with Fixed Uniform Heights for Perfect Alignment */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Category & Status Badges */}
                      <div className="h-[26px] flex items-center justify-between gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 truncate">
                          {project.category || "Web App"}
                        </span>

                        {project.domain ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Demo
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md shrink-0">
                            Hoàn thiện bàn giao
                          </span>
                        )}
                      </div>

                      {/* Title: Cố định 28px */}
                      <h3 className="h-[28px] mt-2.5 text-lg font-bold text-zinc-950 font-display line-clamp-1 flex items-center group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>

                      {/* Description: Cố định 40px (2 dòng) */}
                      <p className="h-[40px] mt-1 text-xs text-zinc-600 leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Features Checklist: Cố định 76px (3 items) */}
                      <div className="h-[76px] mt-3 pt-2.5 border-t border-zinc-100 flex flex-col justify-center space-y-1">
                        {project.features && project.features.length > 0 ? (
                          project.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="h-[20px] flex items-center gap-1.5 text-xs text-zinc-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-zinc-400 italic">Tính năng chuẩn tối ưu</div>
                        )}
                      </div>

                      {/* Tech Stack Pills: Cố định 28px (1 hàng gọn gàng, không bị tràn lệch dòng) */}
                      <div className="h-[28px] mt-2.5 flex items-center gap-1.5 overflow-hidden">
                        {project.techStack && project.techStack.length > 0 && (
                          <>
                            {project.techStack.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono font-medium text-zinc-600 bg-zinc-100/90 px-2 py-0.5 rounded border border-zinc-200/60 whitespace-nowrap shrink-0"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100 shrink-0">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons: Cố định ở đáy thẻ, cao 40px đồng đều chuẩn chỉ */}
                  <div className="p-5 pt-0 mt-auto border-t border-zinc-100/80">
                    <div className="pt-3.5 flex items-center gap-2">
                      {project.domain ? (
                        <>
                          <a
                            href={project.domain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-9 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer btn-press"
                          >
                            <span>Xem Website</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>

                          <button
                            onClick={() => setActiveModalProject(project)}
                            className="flex-1 h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/70 text-zinc-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer btn-press"
                          >
                            <span>Chi tiết</span>
                            <Maximize2 className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="w-full h-9 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/70 text-zinc-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer btn-press"
                        >
                          <span>Xem Chi Tiết Kỹ Thuật</span>
                          <Maximize2 className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </section>

      {/* Bottom Banner dành riêng cho Nhà Tuyển Dụng & Đối Tác Kỹ Thuật */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-blue-400 bg-blue-950/60 rounded-full border border-blue-900">
              <Sparkles className="w-3 h-3" />
              <span>HỒ SƠ NĂNG LỰC &amp; TUYỂN DỤNG</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Bạn Đang Tìm Kiếm Full-Stack Developer Đồng Hành?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-[580px] leading-relaxed">
              Tôi có thế mạnh chuyên sâu về Next.js, React, TypeScript, Tailwind CSS, PostgreSQL và Docker với tư duy tối ưu hiệu năng và trải nghiệm người dùng cao cấp. Kết nối trực tiếp với tôi qua Zalo hoặc Email để trao đổi công việc.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <button
              onClick={() => setIsContactInfoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-100 transition-all rounded-full shadow-xs cursor-pointer btn-press"
            >
              <span>Thông Tin Liên Hệ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox / Quick View Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto bg-white border border-zinc-200 rounded-3xl shadow-2xl z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors z-20 cursor-pointer shadow-sm border border-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Large Image Preview */}
              <div className="relative w-full aspect-[16/10] bg-zinc-100 border-b border-zinc-200 overflow-hidden">
                {activeModalProject.imageUrl ? (
                  <img
                    src={activeModalProject.imageUrl}
                    alt={activeModalProject.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-zinc-100 to-zinc-200/80">
                    <Sparkles className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-lg font-bold text-zinc-800">{activeModalProject.name}</span>
                  </div>
                )}
              </div>

              {/* Modal Details Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {activeModalProject.category || "Web App"}
                    </span>
                    {activeModalProject.domain && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Đang hoạt động online
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-display">
                    {activeModalProject.name}
                  </h2>

                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {activeModalProject.description}
                  </p>
                </div>

                {/* Features */}
                {activeModalProject.features && activeModalProject.features.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Điểm Nổi Bật Kỹ Thuật &amp; Tối Ưu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeModalProject.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs text-zinc-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {activeModalProject.techStack && activeModalProject.techStack.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Công Nghệ Sử Dụng (Tech Stack)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProject.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono font-medium text-zinc-700 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons in Modal */}
                <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center gap-3">
                  {activeModalProject.domain && (
                    <a
                      href={activeModalProject.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <span>Mở Website Demo Thực Tế</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setActiveModalProject(null);
                      setIsContactInfoModalOpen(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 text-xs sm:text-sm font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Xem Thông Tin Liên Hệ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Popup thông tin liên hệ nhà tuyển dụng */}
      <ContactInfoModal
        isOpen={isContactInfoModalOpen}
        onClose={() => setIsContactInfoModalOpen(false)}
      />
    </div>
  );
}
