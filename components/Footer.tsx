"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Mail, Phone, Facebook, ArrowUp, Lock } from "lucide-react";
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
    <footer className="relative w-full bg-[#f8f9fa] text-zinc-600 border-t border-zinc-200/80 py-16">
      
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand Info (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group w-fit text-zinc-900 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
                {appContent.navbar.logoText}
              </span>
            </a>

            {/* Brand Description */}
            <p className="text-xs sm:text-sm text-zinc-500 max-w-[380px] leading-relaxed">
              {brandDesc}
            </p>

            {/* Social / Contact Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`mailto:${email}`}
                className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-2xs btn-press cursor-pointer"
                title="Gửi Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-2xs btn-press cursor-pointer"
                title="Gọi Điện thoại / Zalo"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://${facebook}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-2xs btn-press cursor-pointer"
                title="Ghé Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, index) => (
            <div key={index} className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                {col.title}
              </h4>
              <div className="flex flex-col space-y-2 text-xs text-zinc-500">
                {col.links.map((link, idx) => (
                  <a key={idx} href={link.href} className="hover:text-zinc-900 transition-colors w-fit cursor-pointer">
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Column 4: Quick Contact Info (Spans 3 columns) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
              Hỗ trợ 24/7
            </h4>
            <div className="flex flex-col gap-2.5 text-xs pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-zinc-600 hover:text-blue-600 transition-colors truncate">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-zinc-600 hover:text-blue-600 transition-colors">
                  {phone}
                </a>
              </div>
            </div>
            
            <div className="pt-2">
              <Link 
                href="/admin/login" 
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Bảng điều khiển quản trị</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>{copyright}</div>
          
          <div className="flex items-center gap-6">
            <span>{privacyText}</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-zinc-900 transition-colors cursor-pointer"
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
