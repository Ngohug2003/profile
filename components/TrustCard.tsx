import React from "react";
import { LucideIcon } from "lucide-react";

interface TrustCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconColorClass: string;
  iconBgClass: string;
}

export default function TrustCard({
  icon: Icon,
  title,
  subtitle,
}: TrustCardProps) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#e0e0e0] rounded-sm p-3.5 transition-colors duration-250 hover:border-[#0066cc] w-full min-w-0">
      <div className="p-2 rounded-sm bg-[#f5f5f7] text-[#0066cc] border border-[#e0e0e0] flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="min-w-0">
        <h4 className="typography-caption-strong text-[#1d1d1f] leading-tight">
          {title}
        </h4>
        <p className="typography-micro-legal text-[#7a7a7a] mt-0.5 leading-tight break-words">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
