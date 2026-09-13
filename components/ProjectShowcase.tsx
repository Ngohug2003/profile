"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
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
  Download,
  Github,
  Layers,
  Server,
  Cloud,
  Wrench,
  Cpu,
  GitBranch,
  MapPin,
  Filter,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ContactInfoModal from "./ContactInfoModal";
import { appContent } from "@/constants/content";

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

const metricIconMap: Record<string, React.ElementType> = {
  Zap,
  Smartphone,
  ShieldCheck,
  Clock,
};


const skillGroupIconMap: Record<string, React.ElementType> = {
  frontend: Layers,
  backend: Server,
  devops: Cloud,
  "ai-tools": Wrench,
};

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "profile">("projects");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"large" | "compact">("compact");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState<boolean>(false);

  const { developer, projectShowcase } = appContent;
  const categories = appContent.portfolio.categories;

  // Lắng nghe sự kiện mở popup thông tin liên hệ từ Navbar hoặc các nơi khác
  useEffect(() => {
    const handleOpenContactInfo = () => setIsContactInfoModalOpen(true);
    window.addEventListener("open-contact-info-modal", handleOpenContactInfo);
    return () => window.removeEventListener("open-contact-info-modal", handleOpenContactInfo);
  }, []);

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
  }, [projects, categories]);

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

      // Lọc theo Search query hoặc Tech tag được chọn
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

  // Chuyển sang tab Projects và lọc theo công nghệ tương ứng
  const handleSelectTech = (tech: string) => {
    setActiveTab("projects");
    if (tech === "Tất cả") {
      setSearchQuery("");
      setSelectedCategory("Tất cả");
    } else {
      setSearchQuery(tech);
    }
  };

  return (
    <div className="w-full pb-20">

      {/* 1. Top Hero Section & 2-Tab Switcher */}
      <section className="relative w-full pt-8 pb-8 sm:pt-12 sm:pb-10 bg-gradient-to-b from-white via-[#fafafa] to-[#f4f5f7] border-b border-zinc-200/70">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-6">

          {/* Top Headline */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-[760px] space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100 shadow-2xs">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>{projectShowcase.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 font-display tracking-tight leading-[1.15]">
                {projectShowcase.title}
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {projectShowcase.subtitle}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-2xs shrink-0">
              {projectShowcase.metrics.map((metric, idx) => {
                const IconComponent = metricIconMap[metric.iconName] || Zap;
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-100 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                      <IconComponent className="w-3.5 h-3.5" />
                      <span>{metric.value}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-zinc-800">{metric.label}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{metric.subtext}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2 Tabs Segmented Control: [Dự Án Thực Chiến] vs [Hồ Sơ Năng Lực & Kỹ Năng] */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-200/70">
            <div className="inline-flex items-center p-1.5 bg-zinc-200/70 rounded-2xl border border-zinc-300/60 w-full sm:w-auto shadow-inner">
              {projectShowcase.tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.id === "projects" ? FolderKanban : UserCheck;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${isActive ? "text-zinc-950" : "text-zinc-600 hover:text-zinc-900"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mainShowcaseTab"
                        className="absolute inset-0 bg-white rounded-xl shadow-xs border border-zinc-200/90"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <TabIcon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? "text-blue-600" : "text-zinc-500"}`} />
                    <span className="relative z-10 font-bold tracking-tight">
                      {tab.label}
                    </span>
                    {tab.id === "projects" && (
                      <span
                        className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold transition-colors ${isActive ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-zinc-300/80 text-zinc-700"
                          }`}
                      >
                        {projects.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 2. NỘI DUNG CHÍNH THEO TAB ĐƯỢC CHỌN */}
      <AnimatePresence mode="wait">

        {/* ==================== TAB 1: DỰ ÁN THỰC CHIẾN ==================== */}
        {activeTab === "projects" && (
          <motion.div
            key="tab-projects"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full space-y-6"
          >
            {/* Filter, Search & Controls Bar */}
            <section className="z-30 w-full py-4 bg-[#fafafa]/95 backdrop-blur-md border-b border-zinc-200/60 transition-all">
              <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-3">

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

                    {/* View layout toggle buttons */}
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

                {/* Quick Popular Tech Filters Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                  <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
                    <Filter className="w-3 h-3 text-zinc-400" />
                    <span>Lọc nhanh theo Tech:</span>
                  </span>
                  {projectShowcase.popularTechFilters.map((tech) => {
                    const isActive = (tech === "Tất cả" && searchQuery === "") || searchQuery.toLowerCase() === tech.toLowerCase();
                    return (
                      <button
                        key={tech}
                        onClick={() => handleSelectTech(tech)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${isActive
                          ? "bg-blue-600 text-white font-bold shadow-2xs"
                          : "bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80"
                          }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* Main Projects Grid */}
            <section className="max-w-[1240px] mx-auto px-4 sm:px-6">

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
                      {" "}với từ khóa/công nghệ &quot;<span className="font-semibold text-zinc-800">{searchQuery}</span>&quot;
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
                      Không có dự án nào khớp với tiêu chí tìm kiếm hoặc công nghệ đã chọn. Hãy thử từ khóa khác hoặc xóa bộ lọc.
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

                            <div className="text-[10px] font-mono text-zinc-400 truncate max-w-[180px] bg-white px-2 py-0.5 rounded border border-zinc-200/60 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="truncate">{project.domain || `${project.name.toLowerCase().replace(/\s+/g, "")}.studio`}</span>
                            </div>

                            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                              {project.category?.split(" ")[0] || "WEB"}
                            </div>
                          </div>

                          {/* Project Preview Image Container with Hover zoom */}
                          <div
                            className="relative w-full aspect-[16/10] bg-zinc-100 overflow-hidden cursor-pointer group/img"
                            onClick={() => setActiveModalProject(project)}
                          >
                            {project.imageUrl ? (
                              <img
                                src={project.imageUrl}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-100 via-zinc-100 to-zinc-200/60">
                                <Sparkles className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-bold text-zinc-800 font-display">{project.name}</span>
                                <span className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{project.description}</span>
                              </div>
                            )}

                            {/* Overlay On Hover */}
                            <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                              <span className="p-2.5 rounded-full bg-white/95 text-zinc-950 shadow-md hover:scale-110 transition-transform">
                                <Maximize2 className="w-4 h-4" />
                              </span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                                  {project.category || "Landing Page"}
                                </span>
                                {project.domain && (
                                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Live Demo
                                  </span>
                                )}
                              </div>

                              <h3 className="text-lg font-bold text-zinc-950 font-display group-hover:text-blue-600 transition-colors">
                                {project.name}
                              </h3>

                              <p className="text-xs sm:text-sm text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                                {project.description}
                              </p>
                            </div>

                            {/* Features List */}
                            {project.features && project.features.length > 0 && (
                              <div className="space-y-1.5 py-2 border-y border-zinc-100">
                                {project.features.slice(0, 3).map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-2 text-xs text-zinc-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Tech Stack Badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.techStack.map((tech, tIdx) => (
                                <button
                                  key={tIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectTech(tech);
                                  }}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
                                >
                                  {tech}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Card Action Buttons Footer */}
                        <div className="p-4 px-5 sm:px-6 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between gap-3">
                          <button
                            onClick={() => setActiveModalProject(project)}
                            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Xem chi tiết</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {project.domain ? (
                            <a
                              href={project.domain}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-3 h-3 text-zinc-400" />
                            </a>
                          ) : (
                            <button
                              onClick={() => setIsContactInfoModalOpen(true)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-blue-600 hover:border-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>Tư vấn</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

            </section>
          </motion.div>
        )}

        {/* ==================== TAB 2: HỒ SƠ NĂNG LỰC & KỸ NĂNG ==================== */}
        {activeTab === "profile" && (
          <motion.div
            key="tab-profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full space-y-10 pt-4"
          >
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">

              {/* Nhóm Kỹ Năng */}
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-display tracking-tight">
                      Kỹ năng
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                      Bấm vào bất kỳ công nghệ nào để chuyển sang tab Dự án và lọc sản phẩm thực tế tương ứng.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {projectShowcase.skillGroups.map((group) => {
                    const GroupIcon = skillGroupIconMap[group.id] || Layers;
                    return (
                      <div
                        key={group.id}
                        className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between space-y-6 shadow-2xs"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                              <GroupIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                              {group.tag}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg sm:text-xl font-bold text-zinc-950 font-display">
                              {group.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed mt-1.5">
                              {group.summary}
                            </p>
                          </div>
                        </div>

                        {/* Skills Tags */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
                          {group.skills.map((skill, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSelectTech(skill.split(" ")[0])}
                              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium bg-zinc-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-zinc-800 border border-zinc-200/80 transition-all cursor-pointer shadow-2xs"
                              title={`Xem dự án làm bằng ${skill}`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* 3. Modal Chi Tiết Dự Án */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs cursor-pointer"
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
                    <span className="text-lg font-bold text-zinc-800 font-display">{activeModalProject.name}</span>
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
