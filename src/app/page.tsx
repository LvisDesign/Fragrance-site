"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import SpotlightGrid from "@/components/SpotlightGrid";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import MiniCart from "@/components/MiniCart";
import AiConcierge from "@/components/AiConcierge";
import { useApp } from "@/context/AppContext";
import { usePerfumeCatalog } from "@/hooks/usePerfumeCatalog";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { setIsChatOpen } = useApp();
  const catalog = usePerfumeCatalog();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#FAF9F5] text-[#18181B] selection:bg-accent selection:text-black">
      {/* 120FPS Interactive Spotlight Cursor & Dot Grid Background */}
      <SpotlightGrid />

      {/* Main Glassmorphic Header */}
      <Navbar />

      {/* Hero Section: cinematic split-screen, asset overlays */}
      <Hero />

      {/* Editorial Maison Story Section */}
      <section id="maison" className="py-32 px-6 lg:px-8 max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="font-signature text-accent text-4xl block normal-case">
              Turnkey E-Commerce Demo
            </span>
            <h2 className="text-3xl font-extrabold uppercase tracking-widest leading-tight text-neutral-900">
              Built for Nigerian <br />
              <span className="text-neutral-500 font-light">Perfume Brands</span>
            </h2>
            <div className="w-16 h-[2px] bg-accent" />
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              This complete, high-converting e-commerce website is available for outright purchase and instant brand deployment. It comes pre-equipped with Paystack Naira (₦) payments, bank transfers, USSD, Lagos/nationwide delivery logistics, customer accounts, and order tracking.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              Designed to give your perfume business an ultra-luxury presence that builds immediate trust and closes sales effortlessly.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative aspect-[4/5] bg-white hex-clip-corner overflow-hidden border border-black/8 shadow-md group">
              <Image
                src="/signature_perfume.png"
                alt="Maturation chambers"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-[10px] tracking-widest text-accent uppercase font-semibold">Phase 01</p>
                <p className="text-sm font-editorial text-white/95 italic font-semibold mt-1">Mixing Pure Oils</p>
              </div>
            </div>
            
            <div className="relative aspect-[4/5] bg-white hex-clip-corner overflow-hidden border border-black/8 shadow-md group">
              <Image
                src="/rose_perfume.png"
                alt="Engraving details"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-[10px] tracking-widest text-accent uppercase font-semibold">Phase 02</p>
                <p className="text-sm font-editorial text-white/95 italic font-semibold mt-1">Bottle Engraving</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Catalog Grid Section: curated elixirs */}
      <ProductCatalog catalog={catalog} />

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
              <li><a href="#maison" className="hover:text-neutral-950 transition-colors">Parisian Atelier</a></li>
              <li><a href="#maison" className="hover:text-neutral-950 transition-colors">Lab Telemetry Logs</a></li>
              <li><a href="#maison" className="hover:text-neutral-950 transition-colors">Private Scent Collection</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-amber-800 font-bold">Legal & Maison</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              <li><a href="#" className="hover:text-neutral-950 transition-colors">Terms of Artistry</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">Security Credentials</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">Maison Policies</a></li>
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

      {/* Slide-out Cart Panel */}
      <MiniCart />
    </div>
  );
}
