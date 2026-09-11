"use client";

import React, { useState } from "react";
import { Mail, Phone, Facebook, Send, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { appContent } from "@/constants/content";
import CustomSelect from "./CustomSelect";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const { badge, title, description, servicesList, channels, formTitle, formSubtitle, formSubmitText } = appContent.contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
      }

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        service: "Tư vấn landing page",
        message: "",
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="lien-he" className="relative w-full py-16 md:py-24 bg-white text-zinc-900 overflow-hidden">
      
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info & Direct Channels (Spans 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
              
              <h2 className="typography-display-lg text-zinc-950">
                {title}
              </h2>
              
              <p className="typography-body text-zinc-600">
                {description}
              </p>
            </div>

            {/* Service Highlights */}
            <div className="space-y-3 pt-2">
              {servicesList.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3.5"
                >
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fast Communication Channels */}
            <div className="pt-6 border-t border-zinc-200/80 space-y-3">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                Kênh liên lạc trực tiếp
              </span>
              
              <div className="flex flex-wrap gap-2.5">
                {channels.map((channel, index) => {
                  const IconComponent = iconMap[channel.type];
                  return (
                    <a
                      key={index}
                      href={channel.href}
                      target={channel.type === "facebook" ? "_blank" : undefined}
                      rel={channel.type === "facebook" ? "noreferrer" : undefined}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-2xs btn-press cursor-pointer"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-blue-600" />
                      <span>{channel.label}</span>
                    </a>
                  );
                })}

                <button
                  onClick={() => handleCopyPhone("0333246944")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
                  title="Sao chép số điện thoại"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Copy SĐT</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Contact & Brief Form (Spans 7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-card space-y-6">
              
              <div>
                <h3 className="text-xl font-bold text-zinc-950 font-display">
                  {formTitle}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {formSubtitle}
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">
                    Gửi yêu cầu thành công!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-[400px] mx-auto">
                    Cảm ơn bạn đã quan tâm. Hưng sẽ liên hệ lại qua Zalo/Số điện thoại của bạn trong vòng 15 - 30 phút.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                  >
                    Gửi thêm yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 animate-in fade-in duration-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Họ & Tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0987 654 321"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Địa chỉ Email <span className="text-zinc-400 font-normal">(tuỳ chọn)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800">
                        Dịch vụ mong muốn
                      </label>
                      <CustomSelect
                        value={formData.service}
                        onChange={(val) => setFormData({ ...formData, service: val })}
                        options={[
                          { value: "Tư vấn landing page", label: "Landing Page Chuyển Đổi Cao" },
                          { value: "Thiết kế website doanh nghiệp", label: "Website Doanh Nghiệp / Bán Hàng" },
                          { value: "Tối ưu SEO & Tốc độ", label: "Tối Ưu SEO & Tốc Độ PageSpeed" },
                          { value: "Dự án khác", label: "Tư Vấn Thiết Kế Theo Yêu Cầu" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">
                      Mô tả sơ lược yêu cầu
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Chia sẻ về lĩnh vực kinh doanh, phong cách yêu thích hoặc tính năng cần có..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-zinc-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-white bg-zinc-950 hover:bg-zinc-800 transition-all text-sm font-semibold shadow-xs cursor-pointer btn-press disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span>Đang gửi thông tin...</span>
                    ) : (
                      <>
                        <span>{formSubmitText}</span>
                        <Send className="w-4 h-4" />
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
