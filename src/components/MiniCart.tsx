"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, CreditCard, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function MiniCart() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    orderStatus,
    setOrderStatus,
    orderTrackingCode,
    setOrderTrackingCode,
    clearCart,
    addChatMessage,
    setIsChatOpen,
    addOrder
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "success">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    cardNumber: "4111 2222 3333 4444",
    cardExpiry: "12/29",
    cardCvc: "889"
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleQtyChange = (id: string, currentQty: number, change: number) => {
    updateQuantity(id, currentQty + change);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) return;

    setIsProcessing(true);

    // Simulate luxury processing lag
    setTimeout(() => {
      setIsProcessing(false);
      const trackingCode = `TPS-${Math.floor(100000 + Math.random() * 900000)}-LX`;
      
      const formattedAddress = [
        shippingInfo.address,
        shippingInfo.landmark ? `(Landmark: ${shippingInfo.landmark})` : "",
        shippingInfo.city,
        shippingInfo.state
      ].filter(Boolean).join(", ");

      // Capture order in Admin state
      addOrder({
        trackingCode,
        customerName: shippingInfo.name,
        customerEmail: shippingInfo.email,
        customerAddress: formattedAddress || shippingInfo.address,
        items: [...cart],
        totalNGN: subtotal,
        status: "Paid",
      });

      setOrderTrackingCode(trackingCode);
      setOrderStatus("paid");
      setCheckoutStep("success");
      clearCart();

      // Add dynamic concierge messages updating status
      addChatMessage("concierge", `Payment confirmed! Thank you, ${shippingInfo.name}. Your order has been registered under tracking reference ${trackingCode}.`);
      addChatMessage("concierge", "Our master artisans are currently hand-bottling and compounding your bespoke fragrance. The fulfillment tracking gate is now fully unlocked. Feel free to ask about your package status.");
    }, 2500);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset checkout step on close unless paid
    if (orderStatus !== "paid") {
      setCheckoutStep("cart");
    }
  };

  const springTransition = { type: "spring" as const, damping: 32, stiffness: 220 };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Slide out Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springTransition}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-neutral-200 z-50 shadow-2xl flex flex-col pointer-events-auto overflow-hidden text-neutral-900"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-[#FAF9F5]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900">
                  {checkoutStep === "cart" && "Shopping Cart"}
                  {checkoutStep === "shipping" && "Checkout"}
                  {checkoutStep === "success" && "Order Confirmed"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-all cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content pane */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              
              {/* Step 1: Cart list */}
              {checkoutStep === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                      <p className="text-neutral-600 text-sm font-medium">Your shopping cart is empty.</p>
                      <p className="font-serif text-accent text-2xl font-light italic">Maison de Parfum</p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2.5 border border-accent text-accent hover:bg-accent hover:text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm cursor-pointer shadow-xs"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-[#FAF9F5] border border-neutral-200 rounded-sm relative group shadow-2xs">
                          {/* Image */}
                          <div className="relative w-20 h-20 bg-white rounded-sm border border-neutral-200 overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1 text-left">
                            <h4 className="text-sm font-bold text-neutral-900 truncate">{item.name}</h4>
                            <p className="text-xs text-amber-900 font-semibold font-mono">₦{item.price.toLocaleString()}</p>
                            <p className="text-[10px] text-neutral-500">{item.size}</p>

                            <div className="flex items-center gap-3 pt-2">
                              <div className="flex items-center border border-neutral-300 bg-white rounded-sm">
                                <button
                                  onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                  className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                  className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-400 hover:text-rose-600 p-1 text-xs cursor-pointer transition-colors"
                                title="Remove Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Shipping Form */}
              {checkoutStep === "shipping" && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6 text-left">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-amber-900 font-bold">Delivery Address</h3>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                        placeholder="e.g. Elvis Adeleke"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                          placeholder="design.mailler@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 font-mono transition-colors"
                          placeholder="+234 803 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">House / Street Address *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                        placeholder="e.g. 13 Ajomata Street"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Nearest Landmark / Bus Stop</label>
                      <input
                        type="text"
                        value={shippingInfo.landmark}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, landmark: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                        placeholder="e.g. Off Effurun Sapele Road, near GTBank"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">City / Town *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                          placeholder="e.g. Effurun / Warri"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">State / Region *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors"
                          placeholder="e.g. Delta State"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-200">
                    <h3 className="text-xs uppercase tracking-widest text-amber-900 font-bold flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" /> Payment Details
                    </h3>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Card Number</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.cardNumber}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, cardNumber: e.target.value })}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 tracking-widest transition-colors font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Expiry Date</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.cardExpiry}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, cardExpiry: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">CVC Code</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={shippingInfo.cardCvc}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, cardCvc: e.target.value })}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-accent text-neutral-900 transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 p-4 border border-amber-200 rounded-sm flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-900 font-bold">100% Secure Checkout</p>
                      <p className="text-[10px] text-neutral-600 leading-relaxed mt-1">Your payment details are encrypted and processed safely.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-6 py-4 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        PROCESSING CHECKOUT...
                      </>
                    ) : (
                      <>
                        PAY ₦{subtotal.toLocaleString()} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 3: Success Screen */}
              {checkoutStep === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6 py-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-amber-700" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="font-editorial text-2xl tracking-wide italic text-neutral-900 font-bold">Order Confirmed!</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed max-w-sm">
                      We have received your order. Check your email inbox for order tracking updates and account login information.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] border border-neutral-200 rounded-xl w-full space-y-2 shadow-2xs">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Order Reference</p>
                    <p className="text-base font-mono tracking-widest text-amber-900 font-bold">
                      {orderTrackingCode}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 text-left text-xs leading-relaxed text-neutral-800 shadow-2xs">
                    <p className="font-bold text-amber-950 mb-1 uppercase tracking-wider text-[10px]">Real-Time Order Tracking</p>
                    Track your 4-step delivery progress, courier status, and download your printable invoice.
                  </div>

                  <button
                    onClick={() => {
                      handleClose();
                      if (orderTrackingCode) {
                        router.push(`/orders/${orderTrackingCode}`);
                      } else {
                        router.push("/account/orders");
                      }
                    }}
                    className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View & Track Order Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>

            {/* Summary Footer for Cart stage */}
            {checkoutStep === "cart" && cart.length > 0 && (
              <div className="p-6 border-t border-neutral-200 bg-[#FAF9F5] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-600 tracking-wide uppercase">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600 tracking-wide uppercase">
                    <span>Shipping</span>
                    <span className="text-emerald-700 tracking-wider font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold tracking-wide uppercase pt-2 border-t border-neutral-200 text-neutral-900">
                    <span>Total</span>
                    <span className="text-amber-900 font-extrabold font-mono">₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep("shipping")}
                  className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  PROCEED TO CHECKOUT <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
