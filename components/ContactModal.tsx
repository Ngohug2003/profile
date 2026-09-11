"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CustomSelect from "./CustomSelect";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setIsSubmitted(false);
    setErrorMessage(null);
    document.body.classList.remove("modal-open");
  }, []);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setErrorMessage(null);
      document.body.classList.add("modal-open");
    };
    
    window.addEventListener("open-contact-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-contact-modal", handleOpenModal);
      document.body.classList.remove("modal-open");
    };
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { submitContactLead } = await import("@/lib/supabase");
      const result = await submitContactLead(formData);

      if (!result.success) {
        throw new Error(result.error || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
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
      setErrorMessage(err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs cursor-pointer"
            onClick={handleClose}
          />
          
          {/* Modal Container with GPU-accelerated motion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-white border border-zinc-200/90 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors z-20 cursor-pointer"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-zinc-950 font-display">Gửi yêu cầu thành công!</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-[320px] mx-auto leading-relaxed">
                      Cảm ơn bạn đã tin tưởng. Hưng sẽ chủ động kết nối qua Zalo/SĐT để trao đổi cụ thể nhé.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 text-xs font-semibold rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-colors cursor-pointer btn-press"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1 pb-3 border-b border-zinc-100">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Tư vấn 1:1 trực tiếp</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-950 font-display">
                      Đăng Ký Tư Vấn Dự Án
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Phản hồi trong vòng 15 - 30 phút • Hoàn toàn miễn phí
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 animate-in fade-in duration-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800">
                        Họ & Tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800">
                        Số điện thoại / Zalo <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0987 654 321"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800">
                        Email <span className="text-zinc-400 font-normal">(tuỳ chọn)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800">
                        Dịch vụ quan tâm
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

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-800">
                        Ghi chú thêm (tuỳ chọn)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Yêu cầu cụ thể của bạn..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white bg-zinc-950 hover:bg-zinc-800 text-xs sm:text-sm font-semibold shadow-xs cursor-pointer btn-press disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>Đang gửi...</span>
                      ) : (
                        <>
                          <span>Gửi yêu cầu tư vấn ngay</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
