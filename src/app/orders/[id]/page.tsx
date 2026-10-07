"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  MapPin,
  Calendar,
  Printer,
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
  Clock,
  ShieldCheck,
  FileText,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, setIsChatOpen, addChatMessage, addConciergeInquiry } = useApp();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const formatCode = rawId.startsWith("TPS-")
    ? rawId
    : rawId.startsWith("ZC-")
    ? rawId.replace("ZC-", "TPS-")
    : `TPS-${rawId}`;

  // Find order in context or use luxury fallback mock order
  const order = orders.find(
    (o) => o.trackingCode.toLowerCase() === formatCode.toLowerCase() || o.id === rawId
  ) || {
    id: "ord-101",
    trackingCode: formatCode || "TPS-849201-LX",
    customerName: "Chief Alabi Adeleke",
    customerEmail: "adeleke.vip@luxury.ng",
    customerAddress: "Plot 14, Banana Island Road, Ikoyi, Lagos State",
    items: [
      {
        id: "cat-001",
        name: "Creed Aventus Sovereign",
        price: 580000,
        size: "100mL / Eau de Parfum",
        image: "/products/creed_aventus_clean.png",
        quantity: 1,
      }
    ],
    totalNGN: 580000,
    status: "Paid" as const,
    createdAt: new Date().toISOString(),
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Paid":
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order.status);

  const trackerSteps = [
    { title: "Order Placed", desc: "Payment confirmed", icon: CheckCircle2 },
    { title: "Preparing Order", desc: "Compounding scent", icon: Package },
    { title: "On the Way", desc: "Handed to courier", icon: Truck },
    { title: "Delivered", desc: "Arrived at destination", icon: Sparkles },
  ];

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleTrackOrderInChat = () => {
    setIsChatOpen(true);
    const userMsg = `Can you give me a live tracking update for order #${order.trackingCode}?`;
    const botResp = `Hello ${order.customerName}! I have retrieved your order record (${order.trackingCode}). Your status is currently "${order.status}". Delivery is scheduled to arrive at ${order.customerAddress} within 1 to 2 business days.`;

    addChatMessage("user", userMsg);
    setTimeout(() => {
      addChatMessage("concierge", botResp);
      addConciergeInquiry(userMsg, botResp);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans antialiased pb-20 print:bg-white print:text-black">
      
      {/* Header */}
      <header className="border-b border-black/8 bg-white/90 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/account/orders" className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 text-accent" />
            <span>My Account & Orders</span>
          </Link>

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

          <button
            onClick={handlePrintReceipt}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">Printable Invoice</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 print:border-none print:p-0 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Order Confirmed
                </span>
              </div>
              <h1 className="text-3xl font-serif text-neutral-900 mt-2 font-semibold print:text-black">
                Order #{order.trackingCode}
              </h1>
              <p className="text-xs text-neutral-500 mt-1 print:text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-NG", { dateStyle: "full" })}
              </p>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-accent" />
                <span>Download Printable Invoice</span>
              </button>
            </div>
          </div>

          {/* Automated Account & Order Linking Notification Card */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1 print:hidden">
            {order.isGuestOrder || order.magicLinkSent ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-accent">
                  <Mail className="w-4 h-4" />
                  <span>Account Created for Real-Time Tracking</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-xs">
                  We created an account for <strong className="text-neutral-900">{order.customerEmail}</strong>. Check your inbox for a magic link to set a password and view your order history.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Linked to Order History</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-xs">
                  This order has been added to your order history.
                </p>
              </div>
            )}
          </div>

          {/* 4-Step Visual Progress Tracker */}
          <div className="pt-2 print:hidden">
            <h3 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-4">
              Fulfillment Status Tracker
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {trackerSteps.map((st, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const IconComponent = st.icon;

                return (
                  <div
                    key={st.title}
                    className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${
                      isCurrent
                        ? "bg-amber-50/70 border-accent text-neutral-900 shadow-md ring-1 ring-accent"
                        : isPassed
                        ? "bg-emerald-50/50 border-emerald-200 text-neutral-800"
                        : "bg-neutral-50 border-neutral-200 text-neutral-400"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg border ${
                        isCurrent
                          ? "bg-accent text-white border-accent"
                          : isPassed
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : "bg-neutral-100 border-neutral-200 text-neutral-400"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold mt-1 text-neutral-900">{st.title}</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Purchased Items List (2 Cols) */}
          <div className="md:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 print:border-none shadow-xs">
            <h2 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-4 print:text-black">
              Items Ordered
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200/80 rounded-xl print:bg-white print:border-gray-200"
                >
                  <div className="relative w-16 h-16 bg-white border border-neutral-200 rounded-lg p-1 shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-neutral-900 truncate print:text-black">{item.name}</h3>
                    <p className="text-xs text-accent font-mono mt-0.5">{item.size}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>

                  <div className="text-right font-mono text-sm font-bold text-neutral-900 print:text-black">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation */}
            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs text-neutral-600 print:text-black">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-neutral-900 font-semibold print:text-black">₦{order.totalNGN.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Delivery</span>
                <span className="font-mono text-emerald-700 font-semibold">FREE</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline text-base font-bold text-neutral-900 print:text-black">
                <span>Total Amount Paid</span>
                <span className="font-mono text-accent text-xl">₦{order.totalNGN.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 print:border-none shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-3">
                Delivery Destination
              </h3>
              
              <div className="space-y-2 text-xs text-neutral-700">
                <p className="font-bold text-neutral-900 text-sm">{order.customerName}</p>
                <p className="text-neutral-500">{order.customerEmail}</p>
                <div className="flex items-start gap-2 pt-2 border-t border-neutral-200">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{order.customerAddress}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 print:hidden shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-3">
                Need Help With Order?
              </h3>
              
              <p className="text-xs text-neutral-500 leading-relaxed">
                Have questions about custom bottle engraving or delivery timing? Chat with our Fragrance Assistant.
              </p>

              <button
                onClick={handleTrackOrderInChat}
                className="w-full py-3.5 rounded-xl bg-accent hover:bg-[#B38F48] text-white shadow-lg shadow-accent/20 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Track Order in Chat</span>
              </button>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
