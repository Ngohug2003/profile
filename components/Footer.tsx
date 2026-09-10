"use client";

import React from "react";
import { Code2, Mail, Phone, Facebook, ArrowUp, ShieldCheck } from "lucide-react";
import { appContent } from "@/constants/content";

export default function Footer() {
  const { 
    brandDesc, 
    email, 
    phone, 
    facebook, 
    columns, 
    copyright, 
    privacyText, 
    backToTopText 
  } = appContent.footer;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full bg-canvas-parchment text-[#333333] select-none border-t border-[#e0e0e0] py-16">
      
      {/* Main Footer Container */}
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand Info (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group w-fit text-[#1d1d1f]">
              <Code2 className="w-5 h-5 text-[#0066cc]" />
              <span className="typography-tagline text-[#1d1d1f] tracking-tight hover:text-[#0066cc] transition-colors">
                {appContent.navbar.logoText}
              </span>
            </a>

            {/* Brand Description */}
            <p className="typography-caption text-[#7a7a7a] max-w-[380px] leading-relaxed">
              {brandDesc}
            </p>

            {/* Social / Contact Icons (Pearl buttons style) */}
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-md bg-surface-pearl border border-divider-soft flex items-center justify-center text-[#333333] hover:text-[#0066cc] hover:border-[#0066cc]/40 transition-all duration-200 apple-active-scale cursor-pointer"
                title="Gửi Email"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="w-10 h-10 rounded-md bg-surface-pearl border border-divider-soft flex items-center justify-center text-[#333333] hover:text-[#0066cc] hover:border-[#0066cc]/40 transition-all duration-200 apple-active-scale cursor-pointer"
                title="Gọi Điện thoại / Zalo"
              >
                <Phone className="w-4.5 h-4.5" />
              </a>
              <a
                href={`https://${facebook}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-md bg-surface-pearl border border-divider-soft flex items-center justify-center text-[#333333] hover:text-[#0066cc] hover:border-[#0066cc]/40 transition-all duration-200 apple-active-scale cursor-pointer"
                title="Ghé Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, index) => (
            <div key={index} className="lg:col-span-2 space-y-4">
              <h4 className="typography-caption-strong text-[#1d1d1f] uppercase tracking-wider">
                {col.title}
              </h4>
              <div className="flex flex-col text-[#333333] typography-dense-link">
                {col.links.map((link, idx) => (
                  <a key={idx} href={link.href} className="hover:text-[#0066cc] transition-colors duration-250 w-fit">
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Column 4: Contact Info (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="typography-caption-strong text-[#1d1d1f] uppercase tracking-wider">
              Liên hệ
            </h4>
            <div className="flex flex-col gap-3 text-sm pt-2">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7a7a7a] shrink-0" />
                <a href={`mailto:${email}`} className="typography-caption text-[#333333] hover:text-[#0066cc] transition-colors truncate">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7a7a7a] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="typography-caption text-[#333333] hover:text-[#0066cc] transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Facebook className="w-4 h-4 text-[#7a7a7a] shrink-0" />
                <a href={`https://${facebook}`} target="_blank" rel="noreferrer" className="typography-caption text-[#333333] hover:text-[#0066cc] transition-colors truncate">
                  {facebook}
                </a>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-[#e0e0e0] my-10" />

        {/* Bottom copyright & back-to-top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="typography-fine-print text-[#7a7a7a] text-center sm:text-left">
            <span>{copyright}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 typography-fine-print text-[#7a7a7a]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{privacyText}</span>
            </div>

            {/* Back to top button (Pearl Button capsule) */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-pearl hover:bg-[#f5f5f7] text-[#333333] border border-divider-soft transition-all duration-200 apple-active-scale typography-caption cursor-pointer"
              aria-label="Back to Top"
            >
              <span>{backToTopText}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
