"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Menu, X, ArrowUpRight } from "lucide-react";
import { appContent } from "@/constants/content";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Trang chủ");
  const [scrolled, setScrolled] = useState(false);

  const { logoText, menuItems, ctaText } = appContent.navbar;

  useEffect(() => {
    const handleScrollState = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScrollState);
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string, name: string) => {
    e.preventDefault();
    setActiveItem(name);
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 76;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

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
        <a
          href="#trang-chu"
          onClick={(e) => handleScroll(e, "trang-chu", "Trang chủ")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-200">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-display font-bold text-sm sm:text-base tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">
            {logoText}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/60 p-1 rounded-full border border-zinc-200/40">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <a
                key={item.name}
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id, item.name)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-white/60"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleOpenConsultation}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 rounded-full shadow-xs btn-press cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          aria-label="Mở danh mục điều hướng"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 max-w-[1240px] mx-auto bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id, item.name)}
              className={`block px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                activeItem === item.name
                  ? "bg-zinc-100 text-blue-600 font-semibold"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2 border-t border-zinc-100">
            <button
              onClick={handleOpenConsultation}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-all rounded-xl shadow-xs cursor-pointer btn-press"
            >
              <span>{ctaText} miễn phí</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

