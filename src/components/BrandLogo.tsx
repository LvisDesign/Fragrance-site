"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface BrandLogoProps {
  variant?: "full" | "mark" | "transparent" | "light";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
}

export default function BrandLogo({
  variant = "light",
  className = "",
  size = "md",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
    xl: "w-20 h-20 sm:w-24 sm:h-24",
  };

  const textSizes = {
    sm: "text-xs tracking-[0.2em]",
    md: "text-sm sm:text-base tracking-[0.22em]",
    lg: "text-lg sm:text-xl tracking-[0.25em]",
    xl: "text-2xl sm:text-3xl tracking-[0.28em]",
  };

  if (variant === "mark") {
    return (
      <div
        className={`rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs shrink-0 ${iconSizes[size]} ${className}`}
        title="Your Perfume Brand - Store For Sale"
      >
        <Sparkles className="w-1/2 h-1/2 text-accent" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <div
        className={`rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs shrink-0 ${iconSizes[size]}`}
      >
        <Sparkles className="w-1/2 h-1/2 text-accent" />
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span
            className={`uppercase font-black font-sans text-neutral-900 leading-tight ${textSizes[size]}`}
          >
            YOUR PERFUME BRAND
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            FOR SALE
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-[0.22em] text-accent font-mono font-semibold">
          Ready-Made Store • Built for Nigeria
        </span>
      </div>
    </div>
  );
}
