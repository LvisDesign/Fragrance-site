"use client";

import React, { useState } from "react";
import { ShieldAlert, Key, X, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SecurityBannerProps {
  isDefaultPassword?: boolean;
}

export default function SecurityBanner({ isDefaultPassword = true }: SecurityBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isDefaultPassword || !isVisible) {
    return null;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match. Please re-type your new password.");
      return;
    }

    if (newPassword === "0000") {
      setErrorMsg("Please choose a password other than the default '0000'.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to update password. Please try again.");
      } else {
        setSuccessMsg("Admin password updated successfully!");
        setTimeout(() => {
          setIsModalOpen(false);
          setIsVisible(false);
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg("A network error occurred while updating your password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Top Banner Alert with High-Contrast Colors for both Light & Dark Mode */}
      <div className="bg-amber-100 border-b border-amber-300 dark:bg-amber-500/15 dark:border-amber-500/30 px-4 py-3 text-amber-950 dark:text-amber-200 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <p className="leading-normal text-amber-950 dark:text-amber-200 text-xs font-medium">
              <strong className="font-bold text-amber-900 dark:text-amber-300">Security Warning:</strong> You are using default admin credentials (<span className="font-mono font-bold text-amber-900 dark:text-amber-200">theperfumeslut@gmail.com</span> / <span className="font-mono font-bold text-amber-900 dark:text-amber-200">0000</span>).
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer w-full sm:w-auto"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Update Credentials</span>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 transition-colors shrink-0"
              title="Dismiss warning"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-[#121212] border border-[#262626] rounded-2xl p-6 max-w-md w-full shadow-2xl z-10 space-y-5 text-white"
            >
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Update Admin Password</h3>
                    <p className="text-xs text-gray-400">Replace default password '0000' with a secure key</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-gray-400 text-[10px] font-semibold mb-1.5">
                    Current Password (Default: 0000)
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter 0000"
                    className="w-full bg-[#0A0A0A] border border-[#262626] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 text-[10px] font-semibold mb-1.5">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#0A0A0A] border border-[#262626] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-400 text-[10px] font-semibold mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#0A0A0A] border border-[#262626] px-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] text-gray-300 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F5D061] text-black font-bold shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Updating...</span>
                    ) : (
                      <>
                        <span>Save Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
