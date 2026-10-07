"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Droplet,
  Wind,
  Cloud,
  Crown,
  ShieldCheck,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { cart, setIsCartOpen, setIsChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"product" | null>(null);

  // Mobile Menu Accordion States
  const [mobileProductExpanded, setMobileProductExpanded] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const productSubTypes = [
    { id: "DesignerPerfume", label: "Designer Perfume", desc: "Long-lasting perfume sprays", icon: Sparkles },
    { id: "OilPerfume", label: "Oil Perfume", desc: "Pure alcohol-free perfume oils", icon: Droplet },
    { id: "BodySpray", label: "Body Spray", desc: "Refreshing everyday body sprays", icon: Wind },
    { id: "BodyFragranceMist", label: "Body & Fragrance Mist", desc: "Sweet and light body mists", icon: Cloud },
    { id: "OudAttar", label: "Oud & Attar", desc: "Rich Middle-Eastern oud oils", icon: Crown },
    { id: "DeodorantSpray", label: "Deodorant Spray", desc: "Underarm deodorant sprays", icon: ShieldCheck }
  ];

  return (
    <>
      {/* Light Mode Luxury Glassmorphic Header */}
      <header className="relative z-40 w-full glass-panel border-b border-black/8 transition-all duration-300 shadow-xs">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between">
          
          {/* Top-Left: Store For Sale Brand Link */}
          <Link href="/" className="flex items-center gap-3.5 relative group py-1" title="Your Perfume Brand - Store For Sale">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base uppercase tracking-[0.2em] font-black font-sans text-neutral-900 group-hover:text-accent transition-colors duration-300 leading-tight">
                  YOUR PERFUME BRAND
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  FOR SALE
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.22em] text-accent font-mono font-semibold">
                Ready-Made Store • Built for Nigeria
              </span>
            </div>
          </Link>

          {/* Center: Interactive Nav Menu */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase font-sans h-full relative">
            
            {/* Dropdown 1: Shop by Product Type */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-950 transition-colors relative py-2 focus:outline-none cursor-pointer">
                <span>Collections</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === "product" ? "rotate-180 text-accent" : ""}`} />
                <span className={`absolute bottom-5 left-0 h-[1.5px] bg-accent transition-all duration-300 ${activeDropdown === "product" ? "w-full" : "w-0"}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "product" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[540px] bg-white/95 border border-black/10 p-6 shadow-2xl grid grid-cols-2 gap-4 rounded-sm text-left font-sans font-normal normal-case backdrop-blur-2xl"
                  >
                    {productSubTypes.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.id} 
                          href={`/shop/product-type/${item.id}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-sm border border-transparent hover:border-black/5 hover:bg-neutral-50 transition-all group"
                        >
                          <div className="p-2 rounded-sm border border-neutral-200 bg-neutral-100 text-neutral-600 group-hover:border-accent/60 group-hover:text-accent group-hover:bg-amber-50 transition-colors shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 group-hover:text-accent transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-light mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shop All Perfumes Link */}
            <Link 
              href="/#collections" 
              className="text-neutral-700 hover:text-neutral-950 transition-colors relative group py-2"
            >
              <span>All Perfumes</span>
              <span className="absolute bottom-5 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Our Story Link */}
            <Link 
              href="/#maison" 
              className="text-neutral-700 hover:text-neutral-950 transition-colors relative group py-2"
            >
              <span>Our Story</span>
              <span className="absolute bottom-5 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>

          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Trigger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-neutral-900 hover:text-accent transition-colors focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>


            {/* My Orders / Account Hub Button */}
            <Link
              href="/account/orders"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full transition-all duration-300"
              title="My Account & Order History"
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>My Orders</span>
            </Link>

            {/* AI Concierge Trigger */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-accent transition-all duration-300 relative cursor-pointer"
              title="Fragrance Assistant"
            >
              <MessageSquare className="h-4.5 w-4.5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-accent transition-all duration-300 relative cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-white/98 z-50 shadow-2xl flex flex-col justify-between p-6 border-r border-black/10 pointer-events-auto overflow-y-auto backdrop-blur-2xl"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-[0.18em] font-black font-sans text-neutral-900 leading-tight">
                        YOUR PERFUME BRAND
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        FOR SALE
                      </span>
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-accent font-mono font-medium">
                      Store For Sale • Nigeria
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-700 hover:text-accent transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="flex flex-col space-y-4 text-xs uppercase tracking-widest font-semibold font-sans text-left">
                
                {/* Accordion 1: Product Types */}
                <div className="border-b border-neutral-200 pb-2">
                  <button 
                    onClick={() => setMobileProductExpanded(!mobileProductExpanded)}
                    className="flex items-center justify-between w-full text-neutral-900 hover:text-accent transition-colors py-3"
                  >
                    <span>Collections</span>
                    {mobileProductExpanded ? <ChevronUp className="h-4 w-4 text-accent" /> : <ChevronDown className="h-4 w-4 text-neutral-500" />}
                  </button>

                  <AnimatePresence>
                    {mobileProductExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 pt-1 pb-3 flex flex-col space-y-3 normal-case font-normal text-neutral-600"
                      >
                        {productSubTypes.map((item) => (
                          <Link 
                            key={item.id} 
                            href={`/shop/product-type/${item.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="hover:text-accent transition-colors text-[11px] font-medium tracking-wide uppercase py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Static Link: All Perfumes */}
                <Link
                  href="/#collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-900 hover:text-accent transition-colors block py-3 border-b border-neutral-200"
                >
                  All Perfumes
                </Link>

                {/* Static Link: Our Story */}
                <Link
                  href="/#maison"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-900 hover:text-accent transition-colors block py-3 border-b border-neutral-200"
                >
                  Our Story
                </Link>



              </nav>
            </div>

            <div className="text-neutral-500 text-xs border-t border-neutral-200 pt-6 text-left mt-8 shrink-0 space-y-2">
              <p className="font-serif text-accent text-base normal-case font-semibold">Turnkey Perfume Platform</p>
              <p className="text-[11px] text-neutral-500">Built for Nigerian perfume brands &amp; vendors. Instant handover.</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsChatOpen(true);
                }}
                className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Inquire to Buy This Website
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
