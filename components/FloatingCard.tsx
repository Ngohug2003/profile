import React from "react";

interface FloatingCardProps {
  className?: string;
  children: React.ReactNode;
}

export default function FloatingCard({ className = "", children }: FloatingCardProps) {
  return (
    <div
      className={`absolute bg-white border border-[#e0e0e0] rounded-lg p-4 transition-all duration-300 hover:border-[#0066cc] cursor-default ${className}`}
    >
      {children}
    </div>
  );
}
