"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Key } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/catalog";

  const [email, setEmail] = useState("theperfumeslut@gmail.com");
  const [password, setPassword] = useState("0000");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickFill = () => {
    setEmail("theperfumeslut@gmail.com");
    setPassword("0000");
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || "Incorrect email or password. Please try again.");
      } else {
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("A connection error occurred. Please verify your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-accent selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-accent/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[160px] pointer-events-none rounded-full" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl space-y-6 z-10 backdrop-blur-xl relative"
      >
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="relative h-16 w-24 mx-auto">
            <Image
              src="/theperfumeslut-logo-light.svg"
              alt="The Perfume Slut Logo"
              fill
              sizes="96px"
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-semibold text-neutral-900 tracking-tight">
              The Perfume Slut Admin
            </h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-mono">
              Administrative Console Authentication
            </p>
          </div>
        </div>

        {/* Quick Fill Seed Credentials Button */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" />
            <span className="text-xs text-neutral-600 font-medium">Seed Credentials</span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-accent text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Quick Fill (0000)
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="theperfumeslut@gmail.com"
                className="w-full bg-neutral-50 border border-neutral-200 pl-10 pr-4 py-3 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-accent focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full bg-neutral-50 border border-neutral-200 pl-10 pr-10 py-3 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-accent focus:bg-white transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 bg-accent hover:bg-[#B38F48] text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-neutral-200 text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to The Perfume Slut Main Storefront</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
