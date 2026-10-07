"use client";

import React, { useEffect, use } from "react";
import Navbar from "@/components/Navbar";
import SpotlightGrid from "@/components/SpotlightGrid";
import SuperMartCatalog from "@/components/SuperMartCatalog";
import MiniCart from "@/components/MiniCart";
import AiConcierge from "@/components/AiConcierge";
import { usePerfumeCatalog, ProductSubType } from "@/hooks/usePerfumeCatalog";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const typeInfo: Record<
  ProductSubType,
  { title: string; subtitle: string; desc: string }
> = {
  DesignerPerfume: {
    title: "Designer Perfumes",
    subtitle: "Long-Lasting Perfume Spray",
    desc: "High-quality alcohol-based perfume sprays made with French ingredients, designed to stay on fabrics and last all day."
  },
  OilPerfume: {
    title: "Pure Oil Perfumes",
    subtitle: "Pure Oil Roll-Ons",
    desc: "100% pure, alcohol-free perfume oils. Formulated to stick to your skin and keep you smelling great for 24 hours."
  },
  BodySpray: {
    title: "Aerosol Body Sprays",
    subtitle: "Everyday Body Sprays",
    desc: "Light, refreshing sprays for daily use. Perfect for a quick spray of freshness after a shower."
  },
  BodyFragranceMist: {
    title: "Body & Fragrance Mists",
    subtitle: "Light Scent Mists",
    desc: "Sweet, light, and gentle liquid sprays. Designed for casual everyday wear, leaving a soft and clean scent."
  },
  OudAttar: {
    title: "Heavy Oud & Attars",
    subtitle: "Rich Oud & Attar Oils",
    desc: "Rich, concentrated oud and attar perfume oils sourced from the Middle East, offering a powerful and luxurious scent."
  },
  DeodorantSpray: {
    title: "Active Deodorant Compounds",
    subtitle: "Deodorant Sprays",
    desc: "Anti-odor protective sprays formulated with active minerals to keep you fresh and protect your underarms."
  }
};

export default function ProductTypePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const id = rawId as ProductSubType;

  const catalog = usePerfumeCatalog();
  const info = typeInfo[id] || {
    title: "Collections",
    subtitle: "Curated Perfumes",
    desc: "Explore our collection of fine perfumes."
  };

  // Programmatically hook the route state to the filtering hook
  useEffect(() => {
    catalog.selectSubType(id);
  }, [id]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#FAF9F5] text-[#18181B] selection:bg-accent selection:text-black">
      {/* 120FPS Spotlight & Grid */}
      <SpotlightGrid />

      {/* Primary Sticky Header */}
      <Navbar />

      {/* Dynamic Subpage Hero Banner */}
      <div className="relative pt-16 pb-12 border-b border-black/8 z-10 bg-white/60 backdrop-blur-md text-left">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <span className="font-signature text-accent text-4xl block normal-case font-light">
              {info.subtitle}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest leading-none text-neutral-900 font-sans">
              {info.title}
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed font-light font-sans max-w-2xl">
              {info.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Filtered catalog list */}
      <SuperMartCatalog catalog={catalog} />

      {/* Premium Luxury Footer */}
      <footer className="mt-auto py-16 border-t border-black/8 bg-white/80 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm uppercase tracking-[0.2em] font-bold text-neutral-900 leading-tight">
                    YOUR PERFUME BRAND
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    FOR SALE
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.22em] text-accent font-mono font-medium">
                  Ready-Made Store • Built for Nigeria
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-sm font-light">
              Turnkey luxury perfume e-commerce platform built for Nigerian fragrance businesses. Integrated with Paystack payment gateway, Naira pricing, delivery tracking, and mobile responsiveness. Ready for your domain and logo.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-amber-800 font-bold">Bespoke Inquiries</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Parisian Atelier</Link></li>
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Lab Telemetry Logs</Link></li>
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Private Scent Collection</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-amber-800 font-bold">Legal & Maison</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Terms of Artistry</Link></li>
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Security Credentials</Link></li>
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Maison Policies</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 font-light">
          <p>© {new Date().getFullYear()} Turnkey Perfume Store Template. Built for Nigerian Fragrance Businesses. Available for Purchase.</p>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1.5 text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] tracking-wider uppercase font-semibold">100% Organic Extracts</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Floating cart helper */}
      <MiniCart />
    </div>
  );
}
