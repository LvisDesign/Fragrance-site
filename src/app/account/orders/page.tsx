"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import type { OrderRecord } from "@/context/AppContext";
import {
  User,
  ShoppingBag,
  Clock,
  RotateCcw,
  Printer,
  FileText,
  CheckCircle2,
  Truck,
  ArrowRight,
  Crown,
  Search,
  MessageSquare,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { orders, addToCart, setIsChatOpen } = useApp();

  // Active Tab: "active" (In transit / paid) vs "history" (Delivered)
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Toast Notification
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3500);
  };

  // Mock User Account Info
  const userAccount = {
    name: "Chief Alabi Adeleke",
    email: "adeleke.vip@luxury.ng",
    memberTier: "Maison VIP Circle",
    totalOrders: orders.length,
  };

  // Filter Active Deliveries vs Completed Order History
  const activeDeliveries = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.status === "Paid" || o.status === "Processing" || o.status === "Shipped") &&
        (o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [orders, searchQuery]);

  const completedHistory = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "Delivered" &&
        (o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [orders, searchQuery]);

  const displayOrders = activeTab === "active" ? activeDeliveries : completedHistory;

  // Buy Again Handler: re-adds all items from order to cart
  const handleBuyAgain = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        image: item.image,
      });
    });
    showToast(`Added ${order.items.length} ${order.items.length === 1 ? "item" : "items"} to your shopping cart!`);
  };

  const handlePrintInvoice = (order: OrderRecord) => {
    const cleanId = order.trackingCode.replace("#", "");
    router.push(`/orders/${cleanId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans antialiased pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl bg-white border border-accent/40 text-neutral-900 text-sm font-medium shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span>{toastText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="border-b border-black/8 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-300/80 flex items-center justify-center text-accent shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase tracking-[0.2em] font-black font-sans text-neutral-900 group-hover:text-accent transition-colors">
                  YOUR PERFUME BRAND
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  FOR SALE
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-mono font-medium">
                Store For Sale • Nigeria
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 hover:text-neutral-950 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span>Fragrance Assistant</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-accent hover:bg-[#B38F48] text-xs font-bold text-white shadow-md shadow-accent/20 transition-all"
            >
              Storefront
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. Account Overview Header */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center text-accent shrink-0">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif text-neutral-900 font-semibold">{userAccount.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-accent border border-amber-200">
                    <Crown className="w-3 h-3 text-accent" />
                    {userAccount.memberTier}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{userAccount.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center min-w-[110px]">
                <span className="text-xs text-neutral-500 block font-sans">Total Orders</span>
                <span className="text-2xl font-bold text-neutral-900 mt-0.5 block">{userAccount.totalOrders}</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center min-w-[110px]">
                <span className="text-xs text-neutral-500 block font-sans">Active Shipments</span>
                <span className="text-2xl font-bold text-accent mt-0.5 block">{activeDeliveries.length}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 2. Tabbed Navigation & Search Bar */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "active"
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Active Deliveries ({activeDeliveries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "history"
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Order History ({completedHistory.length})</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* 3. Orders List or Empty State */}
          <div className="space-y-4">
            {displayOrders.length === 0 ? (
              /* STYLED EMPTY STATE */
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-accent">
                  <ShoppingBag className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-neutral-900 font-semibold">You haven't placed any orders yet</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Explore our curated collection of luxury perfumes, pure oils, and bespoke creations.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-[#B38F48] text-xs font-semibold text-white shadow-md shadow-accent/20 transition-all cursor-pointer"
                >
                  <span>Explore Fragrances</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              /* ORDER CARDS */
              displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:border-neutral-300 transition-colors space-y-4"
                >
                  {/* Order Header Bar */}
                  <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-neutral-500 font-mono text-[11px] block">Order Reference</span>
                        <span className="font-mono font-bold text-accent text-sm">{order.trackingCode}</span>
                      </div>
                      <div className="hidden sm:block text-neutral-300">|</div>
                      <div className="hidden sm:block">
                        <span className="text-neutral-500 font-mono text-[11px] block">Date Placed</span>
                        <span className="text-neutral-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      {order.isGuestOrder && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-accent border border-amber-200 hidden md:inline">
                          Linked via Guest Email
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                          order.status === "Paid" || order.status === "Processing"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        ₦{order.totalNGN.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Item Rows */}
                  <div className="px-6 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-neutral-100 last:border-none">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 p-1 shrink-0 overflow-hidden">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-neutral-900">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500">
                              <span className="font-mono text-accent">{item.size}</span>
                              <span>•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="font-mono text-xs font-semibold text-neutral-800">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="bg-neutral-50/70 border-t border-neutral-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-neutral-600 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivery Address: {order.customerAddress}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Track Delivery Button */}
                      <button
                        onClick={() => router.push(`/orders/${order.trackingCode.replace("#", "")}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        <span>Track Delivery</span>
                      </button>

                      {/* Buy Again Button */}
                      <button
                        onClick={() => handleBuyAgain(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-accent border border-amber-200 text-xs font-semibold text-accent hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Buy Again</span>
                      </button>

                      {/* Download Invoice Button */}
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </section>

      </main>

    </div>
  );
}
