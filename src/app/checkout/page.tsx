"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import PaymentStatusModal from "@/components/checkout/PaymentStatusModal";
import {
  CreditCard,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, addOrder, clearCart } = useApp();

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 200000 ? 0 : 3500) : 0;
  const taxAmount = 0;
  const totalAmount = subtotal + deliveryFee + taxAmount;

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Chief Alabi Adeleke",
    email: "adeleke.vip@luxury.ng",
    phone: "+234 803 123 4567",
    address: "Plot 14, Banana Island Road, Ikoyi",
    landmark: "Near Airport Junction / GTBank",
    city: "Lagos",
    state: "Lagos State",
    createAccount: true,
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ussd">("card");

  // Mobile Accordion State
  const [isSummaryMobileOpen, setIsSummaryMobileOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState<string | null>(null);

  // Submit Handler
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address) return;

    // Generate reference code
    const orderCode = `#TPS-${Math.floor(100000 + Math.random() * 900000)}-LX`;
    setGeneratedOrderCode(orderCode);

    // Open Modal in Processing state
    setIsModalOpen(true);
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);

      // Record order in shared context
      addOrder({
        trackingCode: orderCode,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerAddress: `${formData.address}${formData.landmark ? ` (Landmark: ${formData.landmark})` : ""}, ${formData.city}, ${formData.state}`,
        items: cart.length > 0 ? [...cart] : [
          {
            id: "cat-001",
            name: "Creed Aventus Sovereign",
            price: 580000,
            size: "100mL / Eau de Parfum",
            image: "/products/creed_aventus_clean.png",
            quantity: 1,
          }
        ],
        totalNGN: totalAmount > 0 ? totalAmount : 580000,
        status: "Paid",
      });

      clearCart();
    }, 2200);
  };

  const handleViewOrderDetails = () => {
    setIsModalOpen(false);
    const cleanId = generatedOrderCode ? generatedOrderCode.replace("#", "") : "TPS-849201-LX";
    router.push(`/orders/${cleanId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans antialiased pb-20">
      
      {/* Header Bar */}
      <header className="border-b border-black/8 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-accent transition-colors" />
            <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors font-medium">
              Return to Shop
            </span>
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

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-Bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold">
            Step 2 of 2 • Checkout & Payment
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-neutral-900 mt-1">
            Complete Your Purchase
          </h1>
        </div>

        {/* Mobile Accordion Summary Banner */}
        <div className="lg:hidden mb-6 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <button
            onClick={() => setIsSummaryMobileOpen(!isSummaryMobileOpen)}
            className="w-full p-4 flex items-center justify-between text-xs font-medium text-neutral-700 hover:text-neutral-950"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Order Summary ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-neutral-900">
              <span>₦{totalAmount.toLocaleString()}</span>
              {isSummaryMobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isSummaryMobileOpen && (
            <div className="p-4 border-t border-neutral-200 space-y-3 bg-neutral-50/50">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white p-1 border border-neutral-200 relative">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 truncate max-w-[180px]">{item.name}</p>
                      <p className="text-[10px] text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono text-neutral-800">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-neutral-200 pt-3 text-xs space-y-1">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span className="text-emerald-700 font-semibold">{deliveryFee === 0 ? "FREE" : `₦${deliveryFee.toLocaleString()}`}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePaymentSubmit} className="space-y-8">
              
              {/* 1. Contact & Shipping Form */}
              <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                  <div className="p-2 rounded-lg bg-amber-50 text-accent border border-amber-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Shipping & Contact Details</h2>
                    <p className="text-xs text-neutral-500">Enter where you would like your order delivered.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                        placeholder="e.g. Chief Alabi Adeleke"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                        placeholder="adeleke@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors font-mono"
                        placeholder="+234 803 123 4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      House / Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      placeholder="e.g. 13 Ajomata Street"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Nearest Landmark / Bus Stop
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      placeholder="e.g. Off Effurun Sapele Road, near GTBank"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      placeholder="e.g. Effurun / Warri"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-accent focus:bg-white transition-colors"
                      placeholder="e.g. Delta State"
                    />
                  </div>
                </div>

                {/* Account Opt-In Checkbox */}
                <div
                  onClick={() => setFormData({ ...formData, createAccount: !formData.createAccount })}
                  className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 cursor-pointer hover:border-accent/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium text-neutral-900 block">
                      Create an account with this email for real-time tracking and easy re-ordering.
                    </span>
                    <span className="text-xs text-neutral-500 block">
                      (We'll email you a secure link to view your order and set your password)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      formData.createAccount
                        ? "bg-accent border-accent text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {formData.createAccount && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              </section>

              {/* 2. Payment Method Selector */}
              <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                  <div className="p-2 rounded-lg bg-amber-50 text-accent border border-amber-200">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">Payment Method</h2>
                    <p className="text-xs text-neutral-500">All transactions are encrypted and 100% secure.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card / Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 space-y-3 ${
                      paymentMethod === "card"
                        ? "bg-amber-50/60 border-accent text-neutral-900 shadow-md ring-1 ring-accent"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-accent" : "text-neutral-400"}`} />
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                        Paystack / Flutterwave
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Pay with Card / Bank Transfer</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Visa, Mastercard, Verve, or direct bank payment.</p>
                    </div>
                  </div>

                  {/* USSD / Quick Transfer */}
                  <div
                    onClick={() => setPaymentMethod("ussd")}
                    className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 space-y-3 ${
                      paymentMethod === "ussd"
                        ? "bg-amber-50/60 border-accent text-neutral-900 shadow-md ring-1 ring-accent"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Smartphone className={`w-6 h-6 ${paymentMethod === "ussd" ? "text-accent" : "text-neutral-400"}`} />
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                        Instant USSD
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">USSD / Quick Transfer</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Dial bank code on phone for instant completion.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Your financial details are processed via 256-bit SSL encryption. We never store your full card credentials.
                  </p>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-accent hover:bg-[#B38F48] text-sm font-bold text-white shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Pay ₦{totalAmount.toLocaleString()} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </section>

            </form>
          </div>

          {/* Right Column: Sticky Order Summary (5 Cols) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-28 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-mono text-neutral-500">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Item List */}
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-sm text-neutral-500">Your cart is currently empty.</p>
                    <Link
                      href="/"
                      className="inline-block px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-semibold text-accent transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl">
                      <div className="relative w-14 h-14 bg-white border border-neutral-200 rounded-lg p-1 shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-neutral-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="text-accent font-mono">{item.size}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs font-bold text-neutral-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-neutral-200 pt-4 space-y-2.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900 font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    {deliveryFee === 0 ? "FREE (Orders over ₦200k)" : `₦${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono text-neutral-500">₦0</span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-neutral-900">Total Amount</span>
                  <span className="font-mono font-bold text-xl text-accent">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Maison Authenticity Guarantee</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Every perfume bottle is hand-bottled and sealed with our authenticity guarantee stamp.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Payment Processing & Success Modal */}
      <PaymentStatusModal
        isOpen={isModalOpen}
        isProcessing={isProcessingPayment}
        orderCode={generatedOrderCode}
        customerName={formData.fullName}
        customerEmail={formData.email}
        customerAddress={`${formData.address}, ${formData.city}`}
        totalNGN={totalAmount > 0 ? totalAmount : 580000}
        isAccountCreated={formData.createAccount}
        onViewOrderDetails={handleViewOrderDetails}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
