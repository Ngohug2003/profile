"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Github,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  MapPin,
  ArrowUpRight,
  FileText,
  Download,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { appContent } from "@/constants/content";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactInfoModal({ isOpen, onClose }: ContactInfoModalProps) {
  const [copiedField, setCopiedField] = useState<"phone" | "email" | "github" | null>(null);

  const profile = appContent.developer;

  const handleCopy = (text: string, field: "phone" | "email" | "github") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenConsultation = () => {
    onClose();
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop mờ tối giản */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container: Chuẩn tỷ lệ Studio Design, căn chỉnh lưới pixel-perfect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[600px] bg-white border border-zinc-200/90 rounded-3xl shadow-2xl z-10 p-6 sm:p-7 space-y-5 my-auto"
          >
            {/* Nút đóng tinh tế góc trên */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header: Đĩnh đạc, chuẩn profile card */}
            <div className="flex items-center gap-4 pr-8">
              <div className="relative shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-15 h-15 rounded-2xl object-cover object-top border border-zinc-200/90 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-zinc-950 font-display tracking-tight truncate">
                    {profile.fullName}
                  </h3>
                  <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                    Sẵn sàng nhận dự án
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-medium truncate">
                  {profile.role}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Danh sách 4 hàng thông tin: Thiết kế dạng Tile đồng bộ kích thước & căn lề tuyệt đối */}
            <div className="space-y-2.5">

              {/* 1. Số điện thoại / Zalo */}
              <div className="p-3 rounded-2xl bg-zinc-50/80 hover:bg-zinc-50 border border-zinc-200/70 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-700 shrink-0 shadow-2xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                      Số điện thoại / Zalo
                    </span>
                    <a
                      href={`tel:${profile.phoneRaw}`}
                      className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono block truncate"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                {/* Cột Actions: Chuẩn hóa 2 nút (32px icon + 84px action) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(profile.phoneRaw, "phone")}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={profile.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[84px] h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Zalo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 2. Email */}
              <div className="p-3 rounded-2xl bg-zinc-50/80 hover:bg-zinc-50 border border-zinc-200/70 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-700 shrink-0 shadow-2xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                      Email liên hệ
                    </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono block truncate"
                      title={profile.email}
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                {/* Cột Actions: Chuẩn hóa 2 nút (32px icon + 84px action) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(profile.email, "email")}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
                    title="Sao chép email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`mailto:${profile.email}`}
                    className="w-[84px] h-8 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Gửi thư</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 3. GitHub */}
              <div className="p-3 rounded-2xl bg-zinc-50/80 hover:bg-zinc-50 border border-zinc-200/70 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-700 shrink-0 shadow-2xs">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                      GitHub Profile
                    </span>
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono block truncate"
                    >
                      {profile.githubDisplay}
                    </a>
                  </div>
                </div>

                {/* Cột Actions: Chuẩn hóa 2 nút (32px icon + 84px action) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(profile.githubUrl, "github")}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
                    title="Sao chép link GitHub"
                  >
                    {copiedField === "github" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[84px] h-8 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/80 text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>

              {/* 4. Hồ sơ năng lực (CV) */}
              <div className="p-3 rounded-2xl bg-zinc-50/80 hover:bg-zinc-50 border border-zinc-200/70 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/70 flex items-center justify-center text-zinc-700 shrink-0 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
                      Hồ sơ năng lực (CV)
                    </span>
                    <span
                      className="text-xs sm:text-sm font-semibold text-zinc-900 truncate block font-mono"
                      title={profile.cvName}
                    >
                      Ngọ Viết Hưng - Full Stack Dev
                    </span>
                  </div>
                </div>

                {/* Cột Actions: Chuẩn hóa 2 nút (32px download + 84px xem trực tiếp) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={profile.cvDownloadUrl}
                    download="Full Stack Developer CV - Ngo Viet Hung.pdf"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
                    title="Tải CV về máy"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[84px] h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Xem CV</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Actions: 2 nút cân đối hoàn hảo, kết nối trực tiếp phễu tư vấn */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href={profile.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 h-11 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs btn-press"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span>Nhắn tin qua Zalo</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
