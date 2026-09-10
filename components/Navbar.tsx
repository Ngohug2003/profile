"use client";

import React, { useState } from "react";
import { Code2, Menu, X } from "lucide-react";
import { appContent } from "@/constants/content";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Trang chủ");

  const { logoText, menuItems, ctaText } = appContent.navbar;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string, name: string) => {
    e.preventDefault();
    setActiveItem(name);
    const element = document.getElementById(id);
    if (element) {
      const offset = 52;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleOpenConsultation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f0f0f0] bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-[52px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="#trang-chu"
          onClick={(e) => handleScroll(e, "trang-chu", "Trang chủ")}
          className="flex items-center gap-2 group text-[#1d1d1f]"
        >
          <Code2 className="w-5 h-5 text-[#0066cc]" />
          <span className="typography-tagline text-[#1d1d1f] tracking-tight hover:text-[#0066cc] transition-colors">
            {logoText}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id, item.name)}
              className={`typography-button-utility transition-colors duration-200 relative py-1.5 ${
                activeItem === item.name
                  ? "text-[#0066cc] font-semibold"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Button: Opens Consultation Popup Modal */}
        <div className="hidden md:block">
          <a
            href="#lien-he"
            onClick={handleOpenConsultation}
            className="inline-flex items-center justify-center px-4 py-1.5 text-xs sm:text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] transition-all duration-200 rounded-full tracking-normal apple-active-scale cursor-pointer"
          >
            {ctaText}
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden w-full bg-white/95 backdrop-blur-md border-b border-[#f0f0f0] py-4 px-6 space-y-3.5 animate-in fade-in slide-in-from-top-4 duration-200">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => {
                handleScroll(e, item.id, item.name);
                setIsOpen(false);
              }}
              className={`block typography-body py-1.5 transition-colors ${
                activeItem === item.name
                  ? "text-[#0066cc] font-semibold"
                  : "text-[#7a7a7a] hover:text-[#1d1d1f]"
              }`}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-3 border-t border-[#f0f0f0]">
            <a
              href="#lien-he"
              onClick={(e) => {
                handleOpenConsultation(e);
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-full py-2 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] transition-colors duration-200 rounded-full apple-active-scale cursor-pointer"
            >
              {ctaText} miễn phí
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
