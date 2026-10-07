"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Lock,
  Unlock,
  Compass,
  MessageCircleCode,
  Ship,
  Mail,
  Headphones,
} from "lucide-react";

export const CONTACT_LINKS = {
  email: "mailto:inquiries@turnkeyperfume.ng?subject=Inquiry%20to%20Purchase%20Nigerian%20Perfume%20Store%20Website",
  emailDisplay: "inquiries@turnkeyperfume.ng",
};

export default function AiConcierge() {
  const {
    chatMessages,
    addChatMessage,
    isChatOpen,
    setIsChatOpen,
    orderStatus,
    orderTrackingCode,
    addConciergeInquiry,
  } = useApp();

  const [inputText, setInputText] = useState("");
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [showDirectContactMenu, setShowDirectContactMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen, showDirectContactMenu]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    addChatMessage("user", userText);
    setInputText("");

    const lower = userText.toLowerCase();

    // Check if human support / payment / custom order escalation is requested
    const isEscalation =
      lower.includes("human") ||
      lower.includes("agent") ||
      lower.includes("admin") ||
      lower.includes("support") ||
      lower.includes("person") ||
      lower.includes("contact") ||
      lower.includes("email") ||
      lower.includes("custom") ||
      lower.includes("payment") ||
      lower.includes("refund") ||
      lower.includes("issue") ||
      lower.includes("complaint");

    setTimeout(() => {
      let conciergeText = "";

      if (isEscalation) {
        conciergeText =
          "I would be delighted to connect you with our website acquisition team. You can reach us directly at:\n\n" +
          `• Inquiries Email: ${CONTACT_LINKS.emailDisplay}\n` +
          "• In-App Concierge: Always available here for questions regarding this turnkey store.";
        setShowDirectContactMenu(true);
      } else if (lower.includes("hello") || lower.includes("hi")) {
        conciergeText =
          "Welcome! This luxury perfume e-commerce store is currently available for purchase and ready to be customized for your Nigerian fragrance brand. How can I assist you today?";
      } else if (lower.includes("wood") || lower.includes("oud") || lower.includes("sandalwood")) {
        conciergeText =
          "A sophisticated choice. Our distinguished woody & oud creations include Creed Aventus Sovereign, Imperial Oud Royale, and Surrati Golden Sand. You can explore them in our Collections.";
      } else if (lower.includes("buy this website") || lower.includes("purchase") || lower.includes("acquire") || lower.includes("price of the website") || lower.includes("how much is the website") || lower.includes("for sale")) {
        conciergeText =
          "🎉 This ready-made luxury perfume e-commerce platform is available for immediate acquisition!\n\n" +
          "Built specifically for Nigerian fragrance entrepreneurs:\n" +
          "• Pre-integrated Paystack (Debit cards, USSD, Bank Transfer in ₦ Naira)\n" +
          "• Automated order tracking, invoices & customer accounts\n" +
          "• Mobile-first luxury Light Mode UI designed for high conversions\n" +
          "• Fast 48-hour turnaround with your brand logo, domain, and colors.\n\n" +
          `To discuss acquisition terms or schedule a walkthrough, email: ${CONTACT_LINKS.emailDisplay}`;
        setShowDirectContactMenu(true);
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("buy")) {
        conciergeText =
          "Our bespoke luxury fragrances range from ₦18,500 for concentrated body mists to ₦580,000 for rare Extrait de Parfum creations. Explore our live catalog to select your signature scent.";
      } else if (lower.includes("track") || lower.includes("shipping") || lower.includes("where is my")) {
        if (orderStatus !== "paid") {
          conciergeText =
            "Order tracking is active for paid transactions. Please complete your checkout or enter a valid order code to view live dispatch progress.";
          setShowLockWarning(true);
        } else {
          conciergeText = `Your perfume order (${orderTrackingCode}) is currently being aged and bottled in our atelier. It will be dispatched for luxury delivery shortly.`;
        }
      } else {
        conciergeText =
          "Thank you for reaching out. This store is built for Nigerian perfume brands and is available for purchase. Feel free to ask any questions or select an option below.";
      }

      addChatMessage("concierge", conciergeText);
      addConciergeInquiry(userText, conciergeText);
    }, 1000);
  };

  const handleOptionClick = (option: string, isLocked: boolean) => {
    if (isLocked) {
      setShowLockWarning(true);
      return;
    }

    addChatMessage("user", option);

    let reply = "";
    setTimeout(() => {
      if (option === "I Want to Purchase This Website") {
        reply =
          "🎉 This ready-made luxury perfume e-commerce website is available for outright purchase and immediate deployment!\n\n" +
          "Built specifically for Nigerian perfume retailers & brands:\n" +
          "✅ Paystack Integrated (Cards, USSD, Bank Transfer in ₦)\n" +
          "✅ Automated order tracking & customer receipts\n" +
          "✅ Mobile-first luxury Light Mode UI\n" +
          "✅ Fast 48-hour handover with your custom domain & brand logo.\n\n" +
          `To discuss acquisition terms or schedule a walkthrough, email our team at ${CONTACT_LINKS.emailDisplay}`;
        setShowDirectContactMenu(true);
      } else if (option === "Explore Perfumes") {
        reply =
          "We offer curated scent profiles across all spatial placement utilities:\n\n" +
          "1. Floral (Sweet, fresh blooms like VS Velvet Petals)\n" +
          "2. Woody & Oud (Warm, rich woods like Imperial Oud Royale)\n" +
          "3. Fresh (Clean citrus & marine accords like Creed Aventus)\n\n" +
          "Which fragrance profile speaks to your aesthetic?";
      } else if (option === "Talk to Human Concierge") {
        reply =
          "Connecting you to our acquisition team. You can reach us directly:\n\n" +
          `• Email: ${CONTACT_LINKS.emailDisplay}\n` +
          "• Response Time: Within 2–4 hours (WAT)";
        setShowDirectContactMenu(true);
      } else if (option === "Track My Order") {
        reply = `Order Status for ${orderTrackingCode}:\n\n• Step 1: Compound Aging - Completed\n• Step 2: Bottle Engraving - In Progress\n• Step 3: Courier Dispatch - Scheduled`;
      }
      addChatMessage("concierge", reply);
      addConciergeInquiry(option, reply);
    }, 900);
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] h-[620px] bg-white border border-neutral-300 flex flex-col shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-[#FAF9F5] border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-accent">
                  <Headphones className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Store Demo &amp; Inquiries
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-neutral-500 font-medium">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lock Warning Overlay */}
            <AnimatePresence>
              {showLockWarning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                      Tracking Gate Locked
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                      Order tracking requires an active paid order. Complete your checkout to get your live tracking code.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLockWarning(false)}
                    className="px-6 py-2.5 border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-neutral-900 transition-all rounded-lg cursor-pointer"
                  >
                    Go Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F5]">
              {/* Quick Actions Shortcuts */}
              <div className="grid grid-cols-1 gap-2 mb-3">
                <button
                  onClick={() => handleOptionClick("I Want to Purchase This Website", false)}
                  className="flex items-center gap-2.5 p-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 rounded-xl text-left text-xs font-bold text-emerald-950 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                  <span>💼 Inquire to Purchase This Website</span>
                </button>

                <button
                  onClick={() => handleOptionClick("Explore Perfumes", false)}
                  className="flex items-center gap-2.5 p-2.5 bg-white hover:bg-amber-50/50 border border-neutral-200 rounded-xl text-left text-xs font-medium text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  <Compass className="h-4 w-4 text-accent" />
                  <span>Explore Perfumes & Scents</span>
                </button>

                <button
                  onClick={() => handleOptionClick("Talk to Human Concierge", false)}
                  className="flex items-center gap-2.5 p-2.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-300 rounded-xl text-left text-xs font-semibold text-amber-950 transition-all cursor-pointer shadow-2xs"
                >
                  <Headphones className="h-4 w-4 text-amber-800" />
                  <span>Talk to Human Concierge</span>
                </button>

                <button
                  onClick={() => handleOptionClick("Track My Order", orderStatus !== "paid")}
                  className="flex items-center justify-between p-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl text-left text-xs font-medium text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Ship className="h-4 w-4 text-emerald-600" />
                    <span>Track My Order</span>
                  </div>
                  {orderStatus !== "paid" ? (
                    <Lock className="h-3.5 w-3.5 text-neutral-400" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                </button>
              </div>

              {/* Direct Support Quick Action Panel */}
              {showDirectContactMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-white border border-amber-300 rounded-xl space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-amber-800" />
                      Maison Support Channel
                    </span>
                    <span className="text-[9px] bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full font-medium">
                      Direct Email
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Email */}
                    <a
                      href={CONTACT_LINKS.email}
                      className="p-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 rounded-lg text-amber-950 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-amber-800" />
                      <span>Email {CONTACT_LINKS.emailDisplay}</span>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Render Conversation History */}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-accent text-white font-semibold shadow-xs"
                        : "bg-white border border-neutral-200 text-neutral-800 whitespace-pre-line shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-neutral-200 bg-white flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#FAF9F5] border border-neutral-300 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none focus:border-accent text-neutral-900 placeholder-neutral-400"
                placeholder="Ask about perfumes, custom orders, or support..."
              />
              <button
                type="submit"
                className="p-2.5 bg-accent hover:bg-accent/90 text-white transition-all rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                title="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button when Closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-accent text-white hover:bg-accent/90 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-amber-400"
            title="Chat with Fragrance Concierge"
          >
            <MessageCircleCode className="w-5 h-5 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-white">
              Fragrance Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
