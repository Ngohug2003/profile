"use client";

import React from "react";
import { Check, ArrowRight, ExternalLink } from "lucide-react";
import { appContent } from "@/constants/content";

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
  const { badge, title, description, bannerTitle, bannerDesc, bannerCta } = appContent.portfolio;

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  // Nếu DB có dữ liệu, dùng dữ liệu DB; nếu chưa có, fallback về dữ liệu mẫu trong constants
  const displayProjects = initialProjects.length > 0
    ? initialProjects.map((p) => ({
        title: p.name,
        category: p.category || "Dự án",
        desc: p.description,
        features: p.features && p.features.length > 0 ? p.features : ["Tối ưu hiệu năng", "Chuẩn SEO onpage", "Responsive 100%"],
        techStack: p.techStack,
        imageUrl: p.imageUrl,
        domain: p.domain,
        ctaText: p.domain ? "Xem dự án demo" : "Tư vấn dự án tương tự",
      }))
    : appContent.portfolio.projects.map((p) => ({
        ...p,
        imageUrl: null,
        domain: null,
      }));

  const renderProjectMockup = (title: string, imageUrl?: string | null) => {
    if (imageUrl) {
      return (
        <div className="relative w-full h-[150px] sm:h-[185px] bg-[#f5f5f7] rounded-lg border border-[#e0e0e0] overflow-hidden shrink-0 select-none group">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      );
    }

    if (title === "SHOPZONE") {
      return (
        <div className="relative w-full h-[150px] sm:h-[185px] bg-[#f5f5f7] rounded-lg border border-[#e0e0e0] flex flex-col p-2 overflow-hidden shrink-0 select-none">
          <div className="bg-white border-b border-[#e0e0e0] px-2 py-1 flex items-center justify-between rounded-t-xs shrink-0">
            <span className="text-[#0066cc] font-bold text-[7px]">SHOPZONE</span>
            <div className="w-[60%] bg-[#f5f5f7] border border-[#e0e0e0] rounded-xs text-center py-0.5 text-[5px] text-[#7a7a7a]">
              https://shopzone-demo.dev
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
            </div>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto bg-white scrollbar-none">
            <div className="bg-[#f5f5f7] p-1.5 rounded flex justify-between items-center">
              <div className="space-y-0.5 max-w-[65%]">
                <span className="font-bold text-[#1d1d1f] text-[6.5px] block leading-tight">Âm thanh đỉnh cao.</span>
                <span className="w-8 h-1.5 bg-[#0066cc] rounded-full block" />
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 border border-[#e0e0e0]">
                <svg className="w-3.5 h-3.5 text-[#1d1d1f]" viewBox="0 0 100 100">
                  <path d="M20 55 A 30 30 0 0 1 80 55" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-[#e0e0e0] rounded p-1 flex flex-col items-center">
                <div className="w-full aspect-square bg-[#f5f5f7] rounded" />
                <span className="w-6 h-1 bg-[#7a7a7a] rounded-xs mt-1 block" />
              </div>
              <div className="border border-[#e0e0e0] rounded p-1 flex flex-col items-center">
                <div className="w-full aspect-square bg-[#f5f5f7] rounded" />
                <span className="w-6 h-1 bg-[#7a7a7a] rounded-xs mt-1 block" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-[150px] sm:h-[185px] bg-[#f5f5f7] rounded-lg border border-[#e0e0e0] flex flex-col p-2 overflow-hidden shrink-0 select-none">
        <div className="bg-white border-b border-[#e0e0e0] px-2 py-1 flex items-center justify-between rounded-t-xs shrink-0">
          <span className="text-[#0066cc] font-bold text-[7px]">VELOCE</span>
          <div className="w-[60%] bg-[#f5f5f7] border border-[#e0e0e0] rounded-xs text-center py-0.5 text-[5px] text-[#7a7a7a]">
            https://veloce-demo.dev
          </div>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]" />
          </div>
        </div>
        <div className="flex-1 p-3 flex items-center justify-between bg-white overflow-hidden">
          <div className="space-y-1 max-w-[60%]">
            <span className="text-[5px] uppercase tracking-wider text-[#0066cc] font-bold">New Release</span>
            <span className="font-bold text-[#1d1d1f] text-[7.5px] block leading-tight">Veloce Titan Edition.</span>
            <span className="w-10 h-2 bg-[#0066cc] rounded-full block" />
          </div>
          <div className="w-10 h-10 bg-[#f5f5f7] rounded-full border border-[#e0e0e0] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[#1d1d1f]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="50" x2="50" y2="38" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="du-an" className="relative w-full py-section bg-canvas-parchment text-[#1d1d1f] select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10">
        
        {/* Section Header */}
        <div className="max-w-[720px] mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0066cc] bg-white rounded-full border border-[#e0e0e0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
            <span>{badge}</span>
          </div>

          <h2 className="typography-display-lg text-[#1d1d1f]">
            {title}
          </h2>

          <p className="typography-body text-[#7a7a7a]">
            {description}
          </p>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {displayProjects.map((project, index) => (
            <div 
              key={index}
              className="bg-white border border-[#e0e0e0] rounded-lg p-6 space-y-6 flex flex-col justify-between transition-colors duration-300 hover:border-[#0066cc] apple-active-scale"
            >
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-wider bg-[#f5f5f7] border border-[#e0e0e0] px-2.5 py-0.5 rounded-full">
                    {project.category}
                  </span>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="typography-micro-legal text-[#7a7a7a]">
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <h3 className="typography-caption-strong text-[#1d1d1f]">
                    {project.title}
                  </h3>
                  <p className="typography-caption text-[#7a7a7a] leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                {/* Wireframe mockup / Uploaded Cover image */}
                {renderProjectMockup(project.title, project.imageUrl)}

                <hr className="border-[#f0f0f0]" />

                {/* Benefits / features list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-[#7a7a7a]">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="p-0.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#0066cc] shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="typography-micro-legal text-[#1d1d1f]">{feature}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action */}
              <div className="pt-2">
                {project.domain ? (
                  <a
                    href={project.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs sm:text-sm font-normal text-[#1d1d1f] bg-transparent border border-[#e0e0e0] hover:bg-[#f5f5f7] rounded-full transition-all duration-200 apple-active-scale cursor-pointer"
                  >
                    <span>{project.ctaText}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href="#lien-he"
                    onClick={handleOpenConsultation}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs sm:text-sm font-normal text-[#1d1d1f] bg-transparent border border-[#e0e0e0] hover:bg-[#f5f5f7] rounded-full transition-all duration-200 apple-active-scale cursor-pointer"
                  >
                    <span>{project.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-6 sm:p-10 text-center space-y-6 mt-16">
          <div className="max-w-[620px] mx-auto space-y-3">
            <h3 className="typography-display-sm text-[#1d1d1f]">
              {bannerTitle}
            </h3>
            <p className="typography-caption text-[#7a7a7a]">
              {bannerDesc}
            </p>
          </div>
          <a
            href="#lien-he"
            onClick={handleOpenConsultation}
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] transition-all duration-200 rounded-full apple-active-scale cursor-pointer"
          >
            {bannerCta}
          </a>
        </div>

      </div>
    </section>
  );
}
