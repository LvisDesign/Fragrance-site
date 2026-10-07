"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Hero() {
  const { setIsChatOpen } = useApp();

  return (
    <section className="relative w-full min-h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-12 border-b border-black/8 overflow-hidden bg-[#FAF9F5]">
      
      {/* Left Column: Cinematic Visual Showcase */}
      <div className="relative lg:col-span-7 h-[450px] lg:h-auto border-b lg:border-b-0 lg:border-r border-black/8 overflow-hidden group">
        <Image
          src="/signature_perfume.png"
          alt="Signature Luxury Parfum"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center transition-transform duration-[8s] ease-out group-hover:scale-105"
        />

        {/* Video Overlay with subtle luxury atmosphere */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-smoke-filling-a-black-background-4882-large.mp4" type="video/mp4" />
        </video>

        {/* Museum glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85" />
        
        {/* Hexagonal grid outline accent in corners */}
        <div className="absolute top-8 left-8 w-20 h-20 border-l border-t border-accent/40 rounded-tl-sm pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-20 h-20 border-r border-b border-accent/40 rounded-br-sm pointer-events-none" />

        {/* Brand Caption */}
        <div className="absolute bottom-10 left-10 z-10 space-y-1 text-left">
          <p className="text-[10px] tracking-[0.4em] uppercase text-accent font-semibold">L'Absolu Line</p>
          <h2 className="font-editorial text-3xl font-light italic tracking-wide text-white">Compound No. 12</h2>
        </div>
      </div>

      {/* Right Column: Editorial Typographic Panel */}
      <div className="relative lg:col-span-5 flex flex-col justify-center px-8 py-16 lg:p-16 bg-[#FAF9F5] z-10">
        
        {/* Soft decorative dot grid accent behind text */}
        <div className="absolute inset-0 dot-grid-pattern opacity-15 pointer-events-none" />

        <div className="max-w-md mx-auto lg:mx-0 space-y-8 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Elegant Signature Typography */}
            <span className="font-signature text-accent text-5xl sm:text-6xl block normal-case font-light">
              Custom Made
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest leading-none text-neutral-900">
              Premium <br />
              <span className="text-neutral-500 font-light">Collection</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-neutral-600 leading-relaxed font-light"
          >
            Find your perfect signature scent. We customize and mix high-quality perfumes tailored to your taste, bottled in beautifully designed crystal containers.
          </motion.p>

          {/* Interactive CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center justify-center gap-2 group shadow-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Create Your Scent</span>
            </button>
            
            <a
              href="#collections"
              className="px-8 py-4 border border-neutral-300 hover:border-accent hover:text-accent font-semibold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center text-neutral-800 bg-white/70 shadow-xs"
            >
              Browse Perfumes
            </a>
          </motion.div>

          {/* Scrolling indicator anchor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="hidden lg:flex items-center gap-3 pt-12 text-neutral-400 text-[10px] uppercase tracking-widest hover:text-accent hover:opacity-100 transition-all duration-300 cursor-pointer"
            onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span>Scroll to collection</span>
            <ArrowDown className="h-3 w-3 animate-bounce" />
          </motion.div>

        </div>
      </div>

    </section>
  );
}
