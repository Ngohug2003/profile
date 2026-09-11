import React from "react";
import { LucideIcon } from "lucide-react";

interface TrustCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export default function TrustCard({
  icon: Icon,
  title,
  subtitle,
}: TrustCardProps) {
  return (
    <div className="flex items-center gap-3 bg-white border border-zinc-200/80 rounded-xl p-3.5 transition-all duration-200 hover:border-zinc-300 hover:shadow-2xs w-full min-w-0">
      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 leading-tight">
          {title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 leading-tight truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
