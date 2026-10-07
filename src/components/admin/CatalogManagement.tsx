"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import type {
  CatalogItem,
  CategoryType,
  OlfactoryFamily,
  FormulationTier,
  OrderRecord,
  ConciergeInquiry,
} from "@/context/AppContext";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  AlertTriangle,
  Package,
  X,
  Upload,
  CheckCircle2,
  RefreshCw,
  Copy,
  TrendingUp,
  DollarSign,
  Box,
  Filter,
  Check,
  ArrowUpDown,
  Sun,
  Moon,
  ShoppingBag,
  MessageSquare,
  User,
  MapPin,
  Mail,
  ShieldCheck,
  Home,
  Phone,
  MessageCircle,
  Smartphone,
  Send,
  LogOut,
} from "lucide-react";
import SecurityBanner from "@/components/admin/SecurityBanner";

const CATEGORY_OPTIONS: CategoryType[] = [
  "Designer Perfumes",
  "Oil Perfumes",
  "Body Sprays",
  "Body Mists",
  "Oud & Attar",
  "Deodorant Sprays",
  "Car Scents",
];

const OLFACTORY_OPTIONS: OlfactoryFamily[] = [
  "Fresh",
  "Floral",
  "Woody",
  "Amber & Gourmand",
];

const SPATIAL_OPTIONS: { value: CatalogItem["spatialUtility"]; label: string }[] = [
  { value: "OnHumanBody", label: "On Human Body" },
  { value: "OnClothes", label: "On Clothes" },
  { value: "InTheCar", label: "In the Car" },
  { value: "ForHome", label: "For Home / Living Room" },
  { value: "KitchenFreshness", label: "Kitchen Freshness" },
  { value: "ToiletBathroom", label: "Toilet & Bathroom" },
];

const FORMULATION_OPTIONS: FormulationTier[] = [
  "Extrait de Parfum",
  "Eau de Parfum",
  "Eau de Toilette",
  "Pure Perfume Oil",
  "Concentrated Spray",
];

const STATUS_OPTIONS: ("Active" | "Draft" | "Archived")[] = ["Active", "Draft", "Archived"];

const PRESET_PRODUCT_IMAGES = [
  { name: "Creed Aventus", url: "/products/creed_aventus_clean.png" },
  { name: "Tom Ford Tobacco", url: "/products/tom_ford_tobacco.png" },
  { name: "Baccarat Rouge", url: "/products/baccarat_rouge.png" },
  { name: "Car Perfume", url: "/products/car_perfume_luxury.png" },
];

// Plain English NGN Formatter
const formatNGN = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CatalogManagement() {
  const {
    catalogItems,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
    orders,
    updateOrderStatus,
    conciergeInquiries,
    updateInquiryStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"catalog" | "orders" | "inquiries">("catalog");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | "ALL">("ALL");
  const [familyFilter, setFamilyFilter] = useState<OlfactoryFamily | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"Active" | "Draft" | "Archived" | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "priceNGN" | "stockCount" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | "Paid" | "Processing" | "Shipped" | "Delivered">("ALL");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<OrderRecord | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<ConciergeInquiry | null>(null);

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "info" | "danger"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "info" | "danger" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {}
    window.location.href = "/admin/login";
  };

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    sku: string;
    category: CategoryType;
    olfactoryFamily: OlfactoryFamily;
    formulation: FormulationTier;
    spatialUtility?: CatalogItem["spatialUtility"];
    bottleSize?: string;
    priceNGN: number | "";
    stockCount: number | "";
    isBespokeOneOfOne: boolean;
    status: "Active" | "Draft" | "Archived";
    imageUrl: string;
  }>({
    title: "",
    sku: "",
    category: "Designer Perfumes",
    olfactoryFamily: "Fresh",
    formulation: "Eau de Parfum",
    spatialUtility: "OnClothes",
    bottleSize: "100mL",
    priceNGN: "",
    stockCount: "",
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/creed_aventus_clean.png",
  });

  const isDark = themeMode === "dark";

  // Dashboard Metrics in Plain English
  const metrics = useMemo(() => {
    const activeSkus = catalogItems.filter((i) => i.status === "Active").length;
    const lowStock = catalogItems.filter((i) => i.stockCount <= 5).length;
    const totalOrdersCount = orders.length;
    const totalSalesNGN = orders.reduce((acc, curr) => acc + curr.totalNGN, 0);
    const newInquiriesCount = conciergeInquiries.filter((i) => i.status === "New Inquiry").length;

    return {
      activeSkus,
      lowStock,
      totalOrdersCount,
      totalSalesNGN,
      newInquiriesCount,
    };
  }, [catalogItems, orders, conciergeInquiries]);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return catalogItems
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
        const matchesFamily = familyFilter === "ALL" || item.olfactoryFamily === familyFilter;
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesFamily && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return 0;
      });
  }, [catalogItems, searchTerm, categoryFilter, familyFilter, statusFilter, sortBy, sortOrder]);

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesQuery =
        ord.trackingCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === "ALL" || ord.status === orderStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Form Handlers
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        showToast("Uploaded product image successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      title: "",
      sku: `TPS-LUX-${randomNum}`,
      category: "Designer Perfumes",
      olfactoryFamily: "Fresh",
      formulation: "Eau de Parfum",
      spatialUtility: "OnClothes",
      bottleSize: "100mL",
      priceNGN: 150000,
      stockCount: 10,
      isBespokeOneOfOne: false,
      status: "Active",
      imageUrl: "/products/creed_aventus_clean.png",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      sku: item.sku,
      category: item.category,
      olfactoryFamily: item.olfactoryFamily,
      formulation: item.formulation,
      spatialUtility: item.spatialUtility || "OnClothes",
      bottleSize: item.bottleSize || "100mL",
      priceNGN: item.priceNGN,
      stockCount: item.stockCount,
      isBespokeOneOfOne: item.isBespokeOneOfOne,
      status: item.status,
      imageUrl: item.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.sku.trim()) {
      showToast("Please enter a product title and item code to save", "danger");
      return;
    }

    const price = Number(formData.priceNGN) || 0;
    const stock = Number(formData.stockCount) || 0;

    if (editingItem) {
      updateCatalogItem({
        ...editingItem,
        title: formData.title,
        sku: formData.sku,
        category: formData.category,
        olfactoryFamily: formData.olfactoryFamily,
        formulation: formData.formulation,
        spatialUtility: formData.spatialUtility,
        bottleSize: formData.bottleSize,
        priceNGN: price,
        stockCount: stock,
        isBespokeOneOfOne: formData.isBespokeOneOfOne,
        status: formData.status,
        imageUrl: formData.imageUrl,
      });
      showToast(`Saved changes to "${formData.title}"`);
    } else {
      const newItem: CatalogItem = {
        id: `cat-${Date.now()}`,
        sku: formData.sku,
        title: formData.title,
        category: formData.category,
        olfactoryFamily: formData.olfactoryFamily,
        formulation: formData.formulation,
        spatialUtility: formData.spatialUtility,
        bottleSize: formData.bottleSize,
        priceNGN: price,
        stockCount: stock,
        isBespokeOneOfOne: formData.isBespokeOneOfOne,
        status: formData.status,
        imageUrl: formData.imageUrl || "/products/creed_aventus_clean.png",
        createdAt: new Date().toISOString(),
      };
      addCatalogItem(newItem);
      showToast(`Added "${formData.title}" to your store`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = catalogItems.find((i) => i.id === id);
    deleteCatalogItem(id);
    setDeletingItemId(null);
    if (itemToDelete) {
      showToast(`Deleted "${itemToDelete.title}"`, "info");
    }
  };

  const handleDuplicateItem = (item: CatalogItem) => {
    const duplicate: CatalogItem = {
      ...item,
      id: `cat-${Date.now()}`,
      sku: `${item.sku}-COPY`,
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    addCatalogItem(duplicate);
    showToast(`Created a copy of "${item.title}"`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("ALL");
    setFamilyFilter("ALL");
    setStatusFilter("ALL");
  };

  const isFiltered = searchTerm !== "" || categoryFilter !== "ALL" || familyFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div
      className={`min-h-screen font-sans p-4 sm:p-6 lg:p-8 antialiased transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0A] text-gray-100" : "bg-[#F8F9FA] text-slate-900"
      }`}
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl border shadow-2xl flex items-center gap-3 text-sm font-medium ${
              toastMessage.type === "danger"
                ? isDark
                  ? "bg-rose-950/90 border-rose-600/50 text-rose-200"
                  : "bg-rose-50 border-rose-200 text-rose-800"
                : toastMessage.type === "info"
                ? isDark
                  ? "bg-amber-950/90 border-amber-600/50 text-amber-200"
                  : "bg-amber-50 border-amber-200 text-amber-900"
                : isDark
                ? "bg-[#161618] border-[#D4AF37]/50 text-white"
                : "bg-white border-[#D4AF37]/40 text-slate-900 shadow-lg"
            }`}
          >
            {toastMessage.type === "danger" ? (
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Warning Banner for Default Credentials */}
      <SecurityBanner isDefaultPassword={true} />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ========================================== */}
        {/* HEADER & TOP SUMMARY                       */}
        {/* ========================================== */}
        <header className="space-y-6">
          <div
            className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
              isDark ? "border-[#262626]" : "border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-widest">
                  Admin Dashboard
                </span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl font-serif tracking-tight mt-2 font-light ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Products & Inventory
              </h1>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Track your stock, customer orders, and customer messages in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
              {/* Storefront Home Link */}
              <Link
                href="/"
                className={`flex-1 sm:flex-none justify-center min-h-[44px] px-3.5 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                  isDark
                    ? "bg-[#1A1A1A] border-[#262626] text-gray-300 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
                }`}
                title="Go to Storefront Home"
              >
                <Home className="w-4 h-4 text-[#D4AF37]" />
                <span>Storefront</span>
              </Link>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setThemeMode(isDark ? "light" : "dark")}
                className={`flex-1 sm:flex-none justify-center min-h-[44px] px-3.5 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer ${
                  isDark
                    ? "bg-[#1A1A1A] border-[#262626] text-gray-300 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
                }`}
                title={`Switch to ${isDark ? "Light Mode" : "Dark Mode"}`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Sign Out Button */}
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none justify-center min-h-[44px] px-3.5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sign out of Admin Session"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* Desktop / Tablet Primary Action Button */}
              <button
                onClick={handleOpenAddModal}
                className="hidden sm:inline-flex group relative items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs text-white bg-[#D4AF37] hover:bg-[#C59B27] transition-all duration-200 shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 active:scale-95 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Metric Cards in Plain English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full overflow-hidden">
            {/* Active SKUs */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Active Products
                </span>
                <div className={`p-2 rounded-lg border ${isDark ? "bg-[#1A1A1A] border-[#262626]" : "bg-emerald-50 border-emerald-200"}`}>
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className={`text-3xl font-bold font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
                  {metrics.activeSkus}
                </span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live on Store
                </span>
              </div>
            </div>

            {/* Low-Stock Alert */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Low Stock Warning
                </span>
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl font-bold font-mono text-[#D4AF37]">{metrics.lowStock}</span>
                <span className="text-xs font-medium text-[#D4AF37]">5 or fewer left</span>
              </div>
            </div>

            {/* Customer Orders */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                activeTab === "orders"
                  ? isDark
                    ? "bg-[#1A1A1A] border-[#D4AF37]"
                    : "bg-blue-50/80 border-blue-400 shadow-md"
                  : isDark
                  ? "bg-[#121212] border-[#262626]"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Customer Orders
                </span>
                <div className={`p-2 rounded-lg border ${isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-200"}`}>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className={`text-3xl font-bold font-mono ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                  {metrics.totalOrdersCount}
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {formatNGN(metrics.totalSalesNGN)} Total
                </span>
              </div>
            </div>

            {/* Customer Messages */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                activeTab === "inquiries"
                  ? isDark
                    ? "bg-[#1A1A1A] border-[#D4AF37]"
                    : "bg-amber-50/80 border-amber-400 shadow-md"
                  : isDark
                  ? "bg-[#121212] border-[#262626]"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md"
              }`}
              onClick={() => setActiveTab("inquiries")}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  Customer Messages
                </span>
                <div className={`p-2 rounded-lg border ${isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-200"}`}>
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className={`text-3xl font-bold font-mono ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  {conciergeInquiries.length}
                </span>
                {metrics.newInquiriesCount > 0 && (
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30 animate-pulse">
                    {metrics.newInquiriesCount} New
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ADMIN NAVIGATION TABS with smooth horizontal scroll & hidden scrollbars */}
          <div className={`flex border-b text-sm font-medium overflow-x-auto no-scrollbar whitespace-nowrap max-w-full pb-0.5 ${isDark ? "border-[#262626]" : "border-slate-200"}`}>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`pb-3 px-4 sm:px-5 border-b-2 font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "catalog"
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : isDark
                  ? "border-transparent text-gray-400 hover:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              Products ({catalogItems.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-4 sm:px-5 border-b-2 font-semibold transition-colors flex items-center gap-2 shrink-0 relative ${
                activeTab === "orders"
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : isDark
                  ? "border-transparent text-gray-400 hover:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Customer Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`pb-3 px-4 sm:px-5 border-b-2 font-semibold transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === "inquiries"
                  ? "border-[#D4AF37] text-[#D4AF37]"
                  : isDark
                  ? "border-transparent text-gray-400 hover:text-white"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Customer Messages ({conciergeInquiries.length})
            </button>
          </div>
        </header>

        {/* ========================================== */}
        {/* TAB 1: PRODUCTS & STOCK TABLE              */}
        {/* ========================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Search & Filter Controls */}
            <section
              className={`rounded-xl p-4 sm:p-5 space-y-4 border ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-slate-400"}`} />
                  <input
                    type="text"
                    placeholder="Search by product name or item code (SKU)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-9 py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                      isDark
                        ? "bg-[#0A0A0A] border border-[#262626] text-white placeholder-gray-500 focus:border-[#D4AF37]"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#D4AF37] focus:bg-white"
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500 hover:text-white" : "text-slate-400 hover:text-slate-800"}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdowns with Plain English Labels */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <div className="w-full sm:w-auto min-w-[170px]">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as CategoryType | "ALL")}
                      className={`w-full rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors focus:outline-none ${
                        isDark
                          ? "bg-[#0A0A0A] border border-[#262626] text-gray-200 focus:border-[#D4AF37]"
                          : "bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#D4AF37]"
                      }`}
                    >
                      <option value="ALL">All Categories</option>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-auto min-w-[170px]">
                    <select
                      value={familyFilter}
                      onChange={(e) => setFamilyFilter(e.target.value as OlfactoryFamily | "ALL")}
                      className={`w-full rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors focus:outline-none ${
                        isDark
                          ? "bg-[#0A0A0A] border border-[#262626] text-gray-200 focus:border-[#D4AF37]"
                          : "bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#D4AF37]"
                      }`}
                    >
                      <option value="ALL">All Scents</option>
                      {OLFACTORY_OPTIONS.map((fam) => (
                        <option key={fam} value={fam}>
                          {fam}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-auto min-w-[130px]">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className={`w-full rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors focus:outline-none ${
                        isDark
                          ? "bg-[#0A0A0A] border border-[#262626] text-gray-200 focus:border-[#D4AF37]"
                          : "bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#D4AF37]"
                      }`}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {isFiltered && (
                    <button
                      onClick={handleResetFilters}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                        isDark
                          ? "border-gray-700 bg-[#1A1A1A] hover:bg-[#222] text-gray-300 hover:text-white"
                          : "border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Table with 1 to 2 Simple Word Column Headers */}
            <div
              className={`rounded-xl overflow-hidden shadow-xl border ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                        isDark
                          ? "bg-[#0D0D0D] border-[#262626] text-gray-400"
                          : "bg-slate-100/80 border-slate-200 text-slate-600"
                      }`}
                    >
                      <th className="py-4 px-5">Item</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Perfume Type</th>
                      <th className="py-4 px-4 text-center">Special</th>
                      <th className="py-4 px-4 text-right">Price (₦)</th>
                      <th className="py-4 px-4 text-center">In Stock</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1F1F1F]" : "divide-slate-100"}`}>
                    {filteredCatalog.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Box className={`w-10 h-10 ${isDark ? "text-gray-600" : "text-slate-400"}`} />
                            <p className={`text-base font-medium ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                              No products found
                            </p>
                            <p className={`text-xs max-w-md ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                              Try changing your search or adding a new product.
                            </p>
                            <button
                              onClick={handleResetFilters}
                              className={`mt-2 px-4 py-2 text-xs rounded-lg border font-medium ${
                                isDark
                                  ? "bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border-[#333]"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                              }`}
                            >
                              Clear Filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCatalog.map((item) => {
                        const isLowStock = item.stockCount <= 5;

                        return (
                          <tr
                            key={item.id}
                            className={`group transition-colors duration-150 text-sm ${
                              isDark ? "hover:bg-[#18181A]" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3.5">
                                <div
                                  className={`relative w-12 h-12 rounded-lg p-1 shrink-0 overflow-hidden border transition-colors ${
                                    isDark
                                      ? "bg-[#0A0A0A] border-[#262626] group-hover:border-[#D4AF37]/50"
                                      : "bg-slate-50 border-slate-200 group-hover:border-[#D4AF37]"
                                  }`}
                                >
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = "none";
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3
                                    className={`font-medium truncate transition-colors ${
                                      isDark
                                        ? "text-white group-hover:text-[#D4AF37]"
                                        : "text-slate-900 group-hover:text-[#D4AF37]"
                                    }`}
                                  >
                                    {item.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span
                                      className={`font-mono text-xs px-2 py-0.5 rounded border ${
                                        isDark
                                          ? "text-gray-400 bg-[#0A0A0A] border-[#262626]"
                                          : "text-slate-600 bg-slate-100 border-slate-200"
                                      }`}
                                    >
                                      {item.sku}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1 items-start">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                                    isDark
                                      ? "bg-gray-800/80 text-gray-200 border-gray-700"
                                      : "bg-slate-100 text-slate-800 border-slate-200"
                                  }`}
                                >
                                  {item.category}
                                </span>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                                    isDark
                                      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                  }`}
                                >
                                  {item.olfactoryFamily}
                                </span>
                              </div>
                            </td>

                            <td className={`py-3.5 px-4 text-xs font-mono ${isDark ? "text-gray-300" : "text-slate-700"}`}>
                              {item.formulation}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {item.isBespokeOneOfOne ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                                    isDark
                                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                      : "bg-amber-50 text-amber-800 border-amber-300"
                                  }`}
                                >
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  1-of-1 Bottle
                                </span>
                              ) : (
                                <span className={`text-xs font-mono ${isDark ? "text-gray-600" : "text-slate-400"}`}>
                                  &mdash;
                                </span>
                              )}
                            </td>

                            <td className={`py-3.5 px-4 text-right font-mono font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                              {formatNGN(item.priceNGN)}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-col items-center justify-center gap-1.5">
                                <span
                                  className={`font-mono text-xs font-bold ${
                                    isLowStock ? "text-[#D4AF37]" : isDark ? "text-emerald-400" : "text-emerald-600"
                                  }`}
                                >
                                  {item.stockCount} {item.stockCount === 1 ? "left" : "left"}
                                </span>
                                <div
                                  className={`w-20 h-1.5 rounded-full overflow-hidden border ${
                                    isLowStock
                                      ? "border-[#D4AF37]/50 animate-pulse"
                                      : isDark
                                      ? "border-emerald-500/30 bg-gray-900"
                                      : "border-emerald-200 bg-slate-100"
                                  }`}
                                >
                                  <div
                                    className={`h-full ${
                                      isLowStock ? "bg-[#D4AF37]" : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${Math.min(100, (item.stockCount / 30) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                  item.status === "Active"
                                    ? isDark
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : item.status === "Draft"
                                    ? isDark
                                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                      : "bg-amber-50 text-amber-800 border-amber-200"
                                    : isDark
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    : "bg-rose-50 text-rose-800 border-rose-200"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleDuplicateItem(item)}
                                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400"
                                  title="Make a Copy"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditModal(item)}
                                  className="p-1.5 rounded hover:bg-[#D4AF37]/10 text-[#D4AF37]"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingItemId(item.id)}
                                  className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-500"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: CUSTOMER ORDERS                     */}
        {/* ========================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div
              className={`rounded-xl p-4 sm:p-5 space-y-4 border ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-slate-400"}`} />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, or order reference..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className={`w-full pl-10 pr-9 py-2.5 rounded-lg text-sm ${
                      isDark
                        ? "bg-[#0A0A0A] border border-[#262626] text-white"
                        : "bg-slate-50 border border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                  className={`rounded-lg px-3 py-2.5 text-xs font-medium ${
                    isDark ? "bg-[#0A0A0A] border border-[#262626] text-gray-200" : "bg-slate-50 border border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="ALL">All Orders</option>
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Feed Table */}
            <div
              className={`rounded-xl overflow-hidden shadow-xl border ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                        isDark ? "bg-[#0D0D0D] border-[#262626] text-gray-400" : "bg-slate-100/80 border-slate-200 text-slate-600"
                      }`}
                    >
                      <th className="py-4 px-5">Order Code</th>
                      <th className="py-4 px-4">Customer</th>
                      <th className="py-4 px-4">Items</th>
                      <th className="py-4 px-4 text-right">Total (₦)</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1F1F1F]" : "divide-slate-100"}`}>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No orders found. When customers place orders on your store, they will show up here.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className={isDark ? "hover:bg-[#18181A]" : "hover:bg-slate-50"}>
                          <td className="py-4 px-5 font-mono text-sm">
                            <span className="font-bold text-[#D4AF37] block">{ord.trackingCode}</span>
                            <span className={`text-[11px] ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                                {ord.customerName}
                              </span>
                              <span className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                                {ord.customerEmail}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-xs font-mono">
                            {ord.items.map((it) => (
                              <div key={it.id} className="truncate">
                                • {it.name} <span className="text-[#D4AF37] font-bold">x{it.quantity}</span>
                              </div>
                            ))}
                          </td>

                          <td className={`py-4 px-4 text-right font-mono font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                            {formatNGN(ord.totalNGN)}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                                ord.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : ord.status === "Processing"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : ord.status === "Shipped"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : "bg-purple-50 text-purple-800 border-purple-300"
                              }`}
                            >
                              <option value="Paid">Paid</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>

                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => setViewingOrder(ord)}
                              className="px-3 py-1.5 rounded bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-white text-xs font-semibold transition-all"
                            >
                              View Order
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: CUSTOMER MESSAGES                  */}
        {/* ========================================== */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div
              className={`rounded-xl overflow-hidden shadow-xl border ${
                isDark ? "bg-[#121212] border-[#262626]" : "bg-white border-slate-200"
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                        isDark ? "bg-[#0D0D0D] border-[#262626] text-gray-400" : "bg-slate-100/80 border-slate-200 text-slate-600"
                      }`}
                    >
                      <th className="py-4 px-5">Received</th>
                      <th className="py-4 px-5">Customer Profile</th>
                      <th className="py-4 px-5">Customer Message</th>
                      <th className="py-4 px-5">Assistant Response</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Trail</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1F1F1F]" : "divide-slate-100"}`}>
                    {conciergeInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No customer messages yet. Questions sent to your AI assistant will appear here.
                        </td>
                      </tr>
                    ) : (
                      conciergeInquiries.map((inq) => {
                        const name = inq.customerName || "David Adeleke";
                        const email = inq.customerEmail || "design.mailler@gmail.com";
                        const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");

                        return (
                          <tr key={inq.id} className={isDark ? "hover:bg-[#18181A]" : "hover:bg-slate-50"}>
                            <td className={`py-4 px-5 font-mono text-xs whitespace-nowrap ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                              <div>{new Date(inq.timestamp).toLocaleTimeString()}</div>
                              <div className="text-[10px] text-gray-500">{new Date(inq.timestamp).toLocaleDateString()}</div>
                            </td>

                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3 min-w-[220px]">
                                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span>{name}</span>
                                    {inq.orderCode && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                                        #{inq.orderCode}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-400 font-mono">{email}</div>
                                  
                                  {/* Phone Number & Omnichannel Action Links */}
                                  <div className="flex items-center gap-2 pt-0.5">
                                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                                      <Phone className="w-3 h-3" />
                                      <span>{inq.customerPhone || "+234 802 334 5566"}</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 pt-1">
                                    <a
                                      href={`https://wa.me/${(inq.customerPhone || "2348023345566").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${name}, regarding your The Perfume Slut fragrance inquiry ("${inq.userMessage.slice(0, 40)}..."):`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] flex items-center gap-1 font-medium"
                                      title="Chat on WhatsApp"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span>WhatsApp</span>
                                    </a>

                                    <a
                                      href={`tel:${inq.customerPhone || "+2348023345566"}`}
                                      className="p-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] flex items-center gap-1 font-medium"
                                      title="Call Customer Phone"
                                    >
                                      <Phone className="w-3 h-3" />
                                      <span>Call</span>
                                    </a>

                                    <a
                                      href={`sms:${inq.customerPhone || "+2348023345566"}`}
                                      className="p-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] flex items-center gap-1 font-medium"
                                      title="Send SMS"
                                    >
                                      <Smartphone className="w-3 h-3" />
                                      <span>SMS</span>
                                    </a>
                                  </div>

                                  <div className="text-[10px] text-[#D4AF37] font-medium pt-0.5">{inq.accountTier || "The Perfume Slut Member"}</div>
                                </div>
                              </div>
                            </td>

                            <td className={`py-4 px-5 text-xs font-medium max-w-xs ${isDark ? "text-white" : "text-slate-900"}`}>
                              "{inq.userMessage}"
                            </td>

                            <td className={`py-4 px-5 text-xs italic max-w-xs ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                              {inq.conciergeResponse}
                            </td>

                            <td className="py-4 px-4 text-center">
                              <select
                                value={inq.status}
                                onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                                  inq.status === "New Inquiry"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    : inq.status === "Followed Up"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                <option value="New Inquiry">New Message</option>
                                <option value="Followed Up">Replied</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </td>

                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => setViewingInquiry(inq)}
                                className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#262626] text-xs font-medium text-gray-300 hover:text-white transition-colors"
                              >
                                Audit Trail
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ADD / EDIT PRODUCT MODAL DIALOG            */}
        {/* ========================================== */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className={`fixed inset-0 transition-opacity ${
                  isDark ? "bg-black/80 backdrop-blur-md" : "bg-slate-900/40 backdrop-blur-sm"
                }`}
              />

              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  className={`w-screen max-w-2xl shadow-2xl flex flex-col justify-between border-l ${
                    isDark ? "bg-[#0D0D0D] border-[#262626] text-gray-100" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <div
                    className={`p-6 border-b flex items-center justify-between ${
                      isDark ? "bg-[#121212] border-[#262626]" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                        {editingItem ? "Edit Product" : "Add Product"}
                      </span>
                      <h2 className="text-2xl font-serif font-light mt-1">
                        {editingItem ? `Edit: ${editingItem.title}` : "Add New Product"}
                      </h2>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-lg border bg-white border-slate-200 text-slate-500 hover:text-slate-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form id="productForm" onSubmit={handleSaveProduct} className="p-6 space-y-6 overflow-y-auto flex-1">
                    
                    {/* ========================================== */}
                    {/* 1. PRODUCT IMAGE UPLOAD & PREVIEW SECTION */}
                    {/* ========================================== */}
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-wider block">Product Image *</label>
                          <p className="text-[11px] text-slate-500">Upload a photo from your computer or choose from luxury presets.</p>
                        </div>
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-300">
                          Image Active
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Live Image Preview Thumbnail */}
                        <div className="relative w-28 h-28 rounded-xl bg-slate-900 border-2 border-slate-300 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group">
                          {formData.imageUrl ? (
                            <img
                              src={formData.imageUrl}
                              alt="Product Preview"
                              className="w-full h-full object-contain transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="text-center text-slate-400 p-2">
                              <Upload className="w-6 h-6 mx-auto" />
                              <span className="text-[10px] block mt-1">No image</span>
                            </div>
                          )}
                        </div>

                        {/* Image Upload Actions */}
                        <div className="flex-1 space-y-3 w-full">
                          {/* Local File Upload Button */}
                          <div>
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-white text-xs font-semibold shadow-md cursor-pointer transition-colors">
                              <Upload className="w-4 h-4" />
                              <span>Upload Local Image File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[11px] text-slate-500 block mt-1">Supports JPG, PNG, WEBP files up to 5MB.</span>
                          </div>

                          {/* Image Presets Selector */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-700 block">Or Choose Preset Bottle Image:</span>
                            <div className="flex flex-wrap gap-2">
                              {PRESET_PRODUCT_IMAGES.map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                                    formData.imageUrl === preset.url
                                      ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] font-bold"
                                      : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {preset.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Direct Image URL Text Input */}
                          <div className="space-y-1 pt-1">
                            <input
                              type="text"
                              placeholder="Or paste external image URL (https://...)"
                              value={formData.imageUrl}
                              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border bg-white border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ========================================== */}
                    {/* 2. PRODUCT NAME & SKU                     */}
                    {/* ========================================== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider">Product Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Creed Aventus Sovereign"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#D4AF37]"
                        />
                        <p className="text-[11px] text-slate-500">Type the product name as you want customers to see it on your site.</p>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase tracking-wider">SKU (Item Code) *</label>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                sku: `TPS-${formData.category.substring(0, 3).toUpperCase()}-${Math.floor(
                                  100 + Math.random() * 900
                                )}`,
                              })
                            }
                            className="text-[11px] text-[#D4AF37] hover:underline font-mono"
                          >
                            Generate Code
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 rounded-lg border font-mono bg-slate-50 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#D4AF37]"
                        />
                        <p className="text-[11px] text-slate-500">A unique code to track this item in your inventory.</p>
                      </div>
                    </div>

                    {/* ========================================== */}
                    {/* 3. CATEGORY, WHERE TO USE, SCENT PROFILE & FORMULATION */}
                    {/* ========================================== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Where to Use</label>
                        <select
                          value={formData.spatialUtility}
                          onChange={(e) => setFormData({ ...formData, spatialUtility: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium text-emerald-700"
                        >
                          {SPATIAL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Scent Profile</label>
                        <select
                          value={formData.olfactoryFamily}
                          onChange={(e) => setFormData({ ...formData, olfactoryFamily: e.target.value as OlfactoryFamily })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm"
                        >
                          {OLFACTORY_OPTIONS.map((fam) => (
                            <option key={fam} value={fam}>
                              {fam}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Perfume Type</label>
                        <select
                          value={formData.formulation}
                          onChange={(e) => setFormData({ ...formData, formulation: e.target.value as FormulationTier })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm font-medium text-amber-700"
                        >
                          <option value="Extrait de Parfum">Extra Long-Lasting Perfume</option>
                          <option value="Eau de Parfum">Long-Lasting Perfume Spray</option>
                          <option value="Eau de Toilette">Light Perfume Spray</option>
                          <option value="Pure Perfume Oil">Pure Perfume Oil</option>
                          <option value="Concentrated Spray">Concentrated Body Spray</option>
                        </select>
                      </div>
                    </div>

                    {/* ========================================== */}
                    {/* 4. PRICE, STOCK, & STATUS                  */}
                    {/* ========================================== */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Price (₦)</label>
                        <input
                          type="number"
                          required
                          placeholder="150000"
                          value={formData.priceNGN}
                          onChange={(e) =>
                            setFormData({ ...formData, priceNGN: e.target.value === "" ? "" : Number(e.target.value) })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border font-mono bg-slate-50 border-slate-200 text-slate-900 text-sm"
                        />
                        <p className="text-[11px] text-slate-500">Price in Naira (₦).</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">In Stock</label>
                        <input
                          type="number"
                          required
                          placeholder="10"
                          value={formData.stockCount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stockCount: e.target.value === "" ? "" : Number(e.target.value),
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg border font-mono bg-slate-50 border-slate-200 text-slate-900 text-sm"
                        />
                        <p className="text-[11px] text-slate-500">Number of bottles available.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider">Product Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Draft" | "Archived" })}
                          className="w-full px-3.5 py-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-900 text-sm font-semibold"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* ========================================== */}
                    {/* 5. CUSTOM 1-OF-1 BESPOKE TOGGLE            */}
                    {/* ========================================== */}
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium block">Custom 1-of-1 Bottle</span>
                        <span className="text-xs text-slate-500">Turn this on for rare, single-batch custom bottles.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isBespokeOneOfOne: !formData.isBespokeOneOfOne })}
                        className={`relative inline-flex h-6 w-11 rounded-full ${
                          formData.isBespokeOneOfOne ? "bg-[#D4AF37]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            formData.isBespokeOneOfOne ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </form>

                  <div className="p-6 border-t bg-slate-50 border-slate-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-lg border bg-white border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="productForm"
                      className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-xs font-semibold text-white shadow-lg shadow-[#D4AF37]/20"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRMATION DIALOG */}
        <AnimatePresence>
          {deletingItemId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div onClick={() => setDeletingItemId(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <div className="relative bg-white border border-rose-200 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
                    <p className="text-xs text-slate-500">This will remove the item from your catalog.</p>
                  </div>
                </div>

                <p className="text-sm text-slate-700">
                  Are you sure you want to delete{" "}
                  <strong>"{catalogItems.find((i) => i.id === deletingItemId)?.title}"</strong>?
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setDeletingItemId(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteItem(deletingItemId)}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-md shadow-rose-600/20"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* ORDER DETAILS MODAL */}
        <AnimatePresence>
          {viewingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div onClick={() => setViewingOrder(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <div className="relative bg-white rounded-xl p-6 max-w-lg w-full z-10 space-y-4 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Order Details</h3>
                    <p className="text-xs font-mono text-[#D4AF37]">Order Reference: {viewingOrder.trackingCode}</p>
                  </div>
                  <button onClick={() => setViewingOrder(null)} className="p-1 text-slate-400 hover:text-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <p><strong>Customer:</strong> {viewingOrder.customerName}</p>
                  <p><strong>Email:</strong> {viewingOrder.customerEmail}</p>
                  <p><strong>Shipping Address:</strong> {viewingOrder.customerAddress}</p>
                  <p><strong>Date:</strong> {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Items Ordered</h4>
                  {viewingOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-xs font-mono">
                      <span>{it.name} x{it.quantity}</span>
                      <span className="font-bold">{formatNGN(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between text-sm font-bold font-mono text-slate-900">
                    <span>Total Paid</span>
                    <span className="text-[#D4AF37]">{formatNGN(viewingOrder.totalNGN)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* CUSTOMER INQUIRY AUDIT TRAIL MODAL */}
        <AnimatePresence>
          {viewingInquiry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div onClick={() => setViewingInquiry(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <div className="relative bg-white dark:bg-[#121212] rounded-xl p-6 max-w-xl w-full z-10 space-y-5 shadow-2xl border border-slate-200 dark:border-[#262626] max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b dark:border-[#262626] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-sm flex items-center justify-center">
                      {(viewingInquiry.customerName || "David Adeleke").split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                        <span>{viewingInquiry.customerName || "David Adeleke"}</span>
                        <span className="text-xs font-normal text-[#D4AF37] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                          {viewingInquiry.accountTier || "The Perfume Slut Member"}
                        </span>
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-gray-400">
                        <span>{viewingInquiry.customerEmail || "design.mailler@gmail.com"}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{viewingInquiry.customerPhone || "+234 802 334 5566"}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setViewingInquiry(null)} className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Omnichannel Conversion Bar */}
                <div className="p-3 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] rounded-xl space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">1-Click Omnichannel Direct Outreach</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <a
                      href={`https://wa.me/${(viewingInquiry.customerPhone || "2348023345566").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${viewingInquiry.customerName || "David"}, regarding your The Perfume Slut inquiry:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${viewingInquiry.customerPhone || "+2348023345566"}`}
                      className="py-2 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Call</span>
                    </a>

                    <a
                      href={`sms:${viewingInquiry.customerPhone || "+2348023345566"}`}
                      className="py-2 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Send SMS</span>
                    </a>

                    <a
                      href={`mailto:${viewingInquiry.customerEmail || "design.mailler@gmail.com"}?subject=Re: Your The Perfume Slut Fragrance Inquiry`}
                      className="py-2 px-3 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>

                {/* Audit Metadata Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Customer Phone</span>
                    <span className="font-mono font-bold text-emerald-400">{viewingInquiry.customerPhone || "+234 802 334 5566"}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Linked Order Ref</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {viewingInquiry.orderCode ? `#${viewingInquiry.orderCode}` : "N/A (Storefront Inquiry)"}
                    </span>
                  </div>
                </div>

                {/* Full Message Trail */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Message & AI Assistant Audit</h4>
                  
                  <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#262626] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
                      <span>CUSTOMER QUERY</span>
                      <span>{new Date(viewingInquiry.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                      "{viewingInquiry.userMessage}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-1">
                    <div className="text-[10px] font-mono text-[#D4AF37] font-semibold">
                      AI ASSISTANT RESPONSE
                    </div>
                    <p className="text-xs text-slate-700 dark:text-gray-200 leading-relaxed italic whitespace-pre-line">
                      {viewingInquiry.conciergeResponse}
                    </p>
                  </div>
                </div>

                {/* Status Update & Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t dark:border-[#262626]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Inquiry Status:</span>
                    <select
                      value={viewingInquiry.status}
                      onChange={(e) => {
                        updateInquiryStatus(viewingInquiry.id, e.target.value as any);
                        setViewingInquiry({ ...viewingInquiry, status: e.target.value as any });
                        showToast(`Inquiry status updated to ${e.target.value}`, "success");
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-50 dark:bg-[#1A1A1A] text-slate-800 dark:text-white border-slate-200 dark:border-[#262626]"
                    >
                      <option value="New Inquiry">New Message</option>
                      <option value="Followed Up">Replied</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setViewingInquiry(null)}
                    className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#262626] text-xs font-medium text-white"
                  >
                    Close Audit
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* WhatsApp-Style Mobile Floating Action Button (FAB) for "+ Add Product" */}
        <button
          onClick={handleOpenAddModal}
          className="sm:hidden fixed bottom-6 left-6 z-40 p-3.5 px-5 rounded-full bg-[#D4AF37] text-white shadow-2xl hover:scale-105 active:scale-95 border border-[#D4AF37]/40 flex items-center justify-center gap-2 font-bold text-xs shadow-[#D4AF37]/40 cursor-pointer"
          title="Add New Product"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold uppercase tracking-wider">Add Product</span>
        </button>

      </div>
    </div>
  );
}
