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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactInfoModal({ isOpen, onClose }: ContactInfoModalProps) {
  const [copiedField, setCopiedField] = useState<"phone" | "email" | null>(null);

  const profile = {
    fullName: "Ngọ Viết Hưng",
    role: "Full-Stack Developer (Next.js / TypeScript)",
    location: "Hà Nội, Việt Nam",
    phone: "0333 246 944",
    phoneRaw: "0333246944",
    email: "ngoviethung0911@gmail.com",
    githubUrl: "https://github.com/Ngohug2003",
    githubDisplay: "github.com/Ngohug2003",
    zaloUrl: "https://zalo.me/0333246944",
    avatarUrl: "/hung_developer_avatar.png",
    cvUrl: "/uploads/Full%20Stack%20Dev%20-%20Ng%E1%BB%8D%20Vi%E1%BA%BFt%20H%C6%B0ng..pdf",
    cvName: "Full Stack Dev - Ngọ Viết Hưng.pdf",
  };

  const handleCopy = (text: string, field: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

          {/* Modal Container: Thoáng đãng, tinh tế, chuẩn phong cách website */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[540px] bg-white border border-zinc-200 rounded-3xl shadow-2xl z-10 p-6 sm:p-8 space-y-6 my-auto"
          >
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header: Đơn giản, tự nhiên, chân thực */}
            <div className="flex items-center gap-4 pr-6">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover object-top border border-zinc-200/90 shadow-2xs shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 font-display tracking-tight truncate">
                    {profile.fullName}
                  </h3>
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Sẵn sàng nhận việc" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                  {profile.role}
                </p>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Danh sách thông tin liên hệ: Gọn gàng, thoáng, không đóng hộp rườm rà */}
            <div className="divide-y divide-zinc-100 border-y border-zinc-100 py-1">
              
              {/* Điện thoại & Zalo */}
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-zinc-400 block">
                      Số điện thoại / Zalo
                    </span>
                    <a
                      href={`tel:${profile.phoneRaw}`}
                      className="text-sm sm:text-base font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(profile.phoneRaw, "phone")}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                    title="Sao chép số"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={profile.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <span>Zalo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-zinc-400 block">
                      Email
                    </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono truncate block"
                      title={profile.email}
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(profile.email, "email")}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                    title="Sao chép email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    <span>Gửi thư</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-zinc-400 block">
                      GitHub
                    </span>
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-zinc-900 hover:text-blue-600 transition-colors font-mono truncate block"
                    >
                      {profile.githubDisplay}
                    </a>
                  </div>
                </div>

                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 transition-colors shrink-0"
                >
                  <span>Mở profile</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </div>

              {/* CV / Hồ sơ năng lực */}
              <div className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-zinc-400 block">
                      Hồ sơ năng lực (CV)
                    </span>
                    <span
                      className="text-xs sm:text-sm font-semibold text-zinc-900 truncate block"
                      title={profile.cvName}
                    >
                      {profile.cvName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <span>Xem CV</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={profile.cvUrl}
                    download="Full Stack Dev - Ngọ Viết Hưng.pdf"
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                    title="Tải CV về máy"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons: Capsule button phong cách của website */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={profile.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs btn-press text-center"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span>Nhắn tin qua Zalo</span>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="w-full sm:flex-1 py-3 px-5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs btn-press text-center"
              >
                <Mail className="w-4 h-4 text-zinc-500" />
                <span>Gửi email liên hệ</span>
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
