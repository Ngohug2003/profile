"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "Tư vấn landing page",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    };
    
    window.addEventListener("open-contact-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-contact-modal", handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    document.body.style.overflow = "unset"; // Restore background scrolling
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        service: "Tư vấn landing page",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      {/* Background overlay with blur */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-sm cursor-default"
        onClick={handleClose}
      />
      
      {/* Modal Container with scale, slide, and fade transitions */}
      <div className={`relative w-full max-w-[500px] bg-[#f5f5f7] border border-[#e0e0e0] rounded-lg shadow-xl overflow-hidden z-10 transition-all duration-350 ease-out transform ${
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
      }`}>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 border border-[#e0e0e0] hover:bg-white text-[#1d1d1f] hover:text-[#0066cc] transition-colors z-20 apple-active-scale"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
              <div className="mx-auto w-12 h-12 rounded-full bg-white border border-[#e0e0e0] text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="typography-body-strong text-[#1d1d1f]">Gửi yêu cầu thành công!</h3>
                <p className="typography-caption text-[#7a7a7a] max-w-[320px] mx-auto leading-relaxed">
                  Cảm ơn bạn đã quan tâm. Tôi sẽ xem xét thông tin chi tiết và liên hệ lại tư vấn cho bạn trong thời gian sớm nhất.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2 text-xs font-normal rounded-full bg-[#0066cc] text-white hover:bg-[#0071e3] transition-colors apple-active-scale"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 pb-2 border-b border-[#e0e0e0]">
                <h3 className="typography-body-strong text-[#1d1d1f] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#0066cc]" />
                  <span>Đăng ký tư vấn website</span>
                </h3>
                <p className="typography-micro-legal text-[#7a7a7a]">Vui lòng nhập thông tin để tôi hỗ trợ bạn tốt nhất.</p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="modalFullName" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="modalFullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-5 py-2.5 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/40 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="modalPhone" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="modalPhone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0987 654 321"
                  className="w-full px-5 py-2.5 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/40 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="modalEmail" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  id="modalEmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hello@company.com"
                  className="w-full px-5 py-2.5 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/40 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                />
              </div>

              {/* Service */}
              <div className="space-y-1.5">
                <label htmlFor="modalService" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                  Dịch vụ quan tâm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="modalService"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-5 py-2.5 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption appearance-none cursor-pointer"
                  >
                    <option value="Tư vấn landing page">Thiết kế Landing Page</option>
                    <option value="Website bán hàng">Website Bán Hàng</option>
                    <option value="SEO cơ bản">Tối ưu cấu trúc SEO</option>
                    <option value="Khác">Yêu cầu khác...</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7a7a7a]">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="modalMessage" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                  Nội dung yêu cầu <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="modalMessage"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mô tả tóm tắt về yêu cầu, mục tiêu dự án của bạn..."
                  className="w-full px-5 py-2.5 rounded-lg bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/40 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-50 rounded-full transition-all duration-200 apple-active-scale flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi yêu cầu tư vấn</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
