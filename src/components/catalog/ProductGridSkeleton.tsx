"use client";

import React from "react";

interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-4 animate-pulse relative overflow-hidden"
        >
          {/* Image Placeholder */}
          <div className="w-full h-64 bg-[#1A1A1A] rounded-xl relative overflow-hidden flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#222222]" />
            {/* Gold badge placeholder */}
            <div className="absolute top-3 left-3 w-24 h-5 rounded-md bg-[#D4AF37]/20 border border-[#D4AF37]/30" />
          </div>

          {/* Category & Title Placeholders */}
          <div className="space-y-2">
            <div className="w-20 h-3 bg-[#1A1A1A] rounded" />
            <div className="w-3/4 h-5 bg-[#222222] rounded" />
            <div className="w-1/2 h-3 bg-[#1A1A1A] rounded" />
          </div>

          {/* Price & Button Placeholders */}
          <div className="pt-3 border-t border-[#262626] flex items-center justify-between">
            <div className="w-28 h-6 bg-[#222222] rounded" />
            <div className="w-24 h-9 bg-[#D4AF37]/30 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
