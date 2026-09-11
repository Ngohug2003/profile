"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";
import { appContent } from "@/constants/content";

export default function ProjectNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { logoText } = appContent.navbar;

  useEffect(() => {
    const handleScrollState = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScrollState);
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-3 pb-3 transition-all duration-300">
      <div
        className={`max-w-[1240px] mx-auto h-[56px] px-4 sm:px-6 flex items-center justify-between rounded-full border transition-all duration-200 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-zinc-200/90 shadow-sm"
            : "bg-white/80 backdrop-blur-md border-zinc-200/60 shadow-xs"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-200">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-display font-bold text-sm sm:text-base tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
            {logoText}
          </span>
          <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-md border border-blue-100">
            Portfolio
          </span>
        </Link>

        {/* Actions bên phải */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact-info-modal"))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 rounded-full transition-all duration-200 shadow-xs btn-press cursor-pointer"
          >
            <span>Thông tin liên hệ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
