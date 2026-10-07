"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight, Home, FileText, Loader2, Sparkles, MapPin, Clock, Mail } from "lucide-react";
import Link from "next/link";

interface PaymentStatusModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  orderCode: string | null;
  customerName: string;
  customerEmail?: string;
  customerAddress: string;
  totalNGN: number;
  isAccountCreated?: boolean;
  onViewOrderDetails: () => void;
  onClose: () => void;
}

export default function PaymentStatusModal({
  isOpen,
  isProcessing,
  orderCode,
  customerName,
  customerEmail,
  customerAddress,
  totalNGN,
  isAccountCreated = true,
  onViewOrderDetails,
  onClose,
}: PaymentStatusModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Glassmorphic Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isProcessing ? undefined : onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-neutral-900 overflow-hidden"
        >
          {isProcessing ? (
            /* PROCESSING STATE */
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <ShieldCheck className="w-8 h-8 text-accent absolute" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif tracking-wide text-neutral-900 font-semibold">Verifying Payment</h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  We are securely confirming your transaction with the payment gateway. Please keep this window open.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono text-neutral-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                <span>Waiting for Gateway Response</span>
              </div>
            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="p-3.5 rounded-full bg-accent/15 border border-accent/30 text-accent"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> Payment Received!
                </div>

                <h2 className="text-2xl font-serif text-neutral-900 font-semibold">Thank You for Your Order</h2>
                <p className="text-xs text-neutral-500">
                  Your payment of <strong className="text-neutral-900 font-mono">₦{totalNGN.toLocaleString()}</strong> has been confirmed.
                </p>
              </div>

              {/* Order Quick Summary Card */}
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-neutral-500 font-mono">Order Reference</span>
                  <span className="font-mono font-bold text-accent">{orderCode || "#TPS-1024"}</span>
                </div>

                <div className="space-y-2 text-neutral-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-neutral-900 block">{customerName}</span>
                      <span className="text-neutral-500 text-[11px] line-clamp-2">{customerAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/80">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-emerald-700">
                      Estimated Arrival: <strong>1 to 2 business days</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Account & Order Linking Feedback Card */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                {isAccountCreated ? (
                  <>
                    <div className="flex items-center gap-1.5 font-semibold text-accent">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Account Linked</span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      We created an account for <strong className="text-neutral-900">{customerEmail || "your email"}</strong>. Check your inbox for a magic link to set a password and view your order history.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Order Linked to History</span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      This order has been added to your order history.
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={onViewOrderDetails}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-[#B38F48] text-xs font-bold text-white shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Order Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
