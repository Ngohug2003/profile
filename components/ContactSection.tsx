"use client";

import React, { useState } from "react";
import { Mail, Phone, Facebook, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";
import { appContent } from "@/constants/content";

const iconMap = {
  phone: Phone,
  email: Mail,
  facebook: Facebook,
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "Tư vấn landing page",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { badge, title, description, servicesList, channels, formTitle, formSubtitle, formSubmitText } = appContent.contact;

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
    }, 1500);
  };

  return (
    <section id="lien-he" className="relative w-full py-section bg-white text-[#1d1d1f] select-none rounded-none border-0 overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Info & Trust */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[#0066cc] bg-[#f5f5f7] rounded-full border border-[#e0e0e0]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
              <h2 className="typography-display-lg text-[#1d1d1f]">
                {title}
              </h2>
              <p className="typography-body text-[#7a7a7a]">
                {description}
              </p>
            </div>

            {/* Service Cards */}
            <div className="space-y-4 pt-2">
              {servicesList.map((item, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-lg bg-[#f5f5f7] border border-[#e0e0e0] flex items-start gap-4 hover:border-[#0066cc] transition-colors duration-300"
                >
                  <div className="p-2 rounded bg-white text-[#0066cc] border border-[#e0e0e0] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="typography-caption-strong text-[#1d1d1f]">
                      {item.title}
                    </h4>
                    <p className="typography-caption text-[#7a7a7a] mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Methods */}
            <div className="pt-6 border-t border-[#e0e0e0] space-y-4">
              <p className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider">Kênh liên lạc nhanh</p>
              <div className="flex flex-wrap gap-3">
                {channels.map((channel, index) => {
                  const IconComponent = iconMap[channel.type];
                  return (
                    <a
                      key={index}
                      href={channel.href}
                      target={channel.type === "facebook" ? "_blank" : undefined}
                      rel={channel.type === "facebook" ? "noreferrer" : undefined}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-xs text-[#1d1d1f] hover:border-[#0066cc] hover:text-[#0066cc] transition-all duration-200 apple-active-scale cursor-pointer"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-[#0066cc]" />
                      <span>{channel.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Form inside clean container */}
          <div className="lg:col-span-7">
            <div className="relative rounded-lg bg-[#f5f5f7] border border-[#e0e0e0] p-6 sm:p-8">
              
              {isSubmitted ? (
                <div className="py-12 px-4 text-center space-y-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white border border-[#e0e0e0] text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="typography-body-strong text-[#1d1d1f]">Gửi yêu cầu thành công!</h3>
                    <p className="typography-caption text-[#7a7a7a] max-w-[400px] mx-auto leading-relaxed">
                      Cảm ơn bạn đã quan tâm. Tôi sẽ xem xét thông tin chi tiết và liên hệ lại tư vấn cho bạn trong thời gian sớm nhất.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2 text-xs font-normal rounded-full bg-white border border-[#e0e0e0] hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors cursor-pointer"
                  >
                    Gửi yêu cầu mới
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 pb-3 border-b border-[#e0e0e0]">
                    <h3 className="typography-body-strong text-[#1d1d1f] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#0066cc]" />
                      <span>{formTitle}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-5 py-3 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/50 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0987 654 321"
                        className="w-full px-5 py-3 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/50 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="hello@company.com"
                      className="w-full px-5 py-3 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/50 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption"
                    />
                  </div>

                  {/* Service Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="service" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                      Dịch vụ quan tâm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-5 py-3 rounded-full bg-white border border-[#e0e0e0] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption appearance-none cursor-pointer"
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
                  <div className="space-y-2">
                    <label htmlFor="message" className="typography-caption-strong text-[#7a7a7a] uppercase tracking-wider block">
                      Nội dung cần tư vấn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={formSubtitle}
                      className="w-full px-5 py-3 rounded-lg bg-white border border-[#e0e0e0] text-[#1d1d1f] placeholder-[#7a7a7a]/50 focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all typography-caption resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 text-sm font-normal text-white bg-[#0066cc] hover:bg-[#0071e3] disabled:opacity-50 rounded-full transition-all duration-200 apple-active-scale flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{formSubmitText}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
