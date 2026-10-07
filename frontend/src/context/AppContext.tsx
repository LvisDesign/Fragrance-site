"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

export interface Message {
  sender: "user" | "concierge";
  text: string;
  timestamp: Date;
  isLockedOption?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  memberTier: string;
  isPendingPasswordSet: boolean;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  trackingCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: CartItem[];
  totalNGN: number;
  status: "Paid" | "Processing" | "Shipped" | "Delivered";
  isGuestOrder?: boolean;
  accountCreated?: boolean;
  magicLinkSent?: boolean;
  createdAt: string;
}

export interface ConciergeInquiry {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderCode?: string;
  accountTier?: string;
  userMessage: string;
  conciergeResponse: string;
  timestamp: string;
  status: "New Inquiry" | "Resolved" | "Followed Up";
}

export type OlfactoryFamily = "Fresh" | "Floral" | "Woody" | "Amber & Gourmand";
export type FormulationTier =
  | "Extrait de Parfum"
  | "Eau de Parfum"
  | "Eau de Toilette"
  | "Pure Perfume Oil"
  | "Concentrated Spray";
export type CategoryType =
  | "Designer Perfumes"
  | "Oil Perfumes"
  | "Body Sprays"
  | "Body Mists"
  | "Oud & Attar"
  | "Deodorant Sprays"
  | "Car Scents";

export interface CatalogItem {
  id: string;
  sku: string;
  title: string;
  category: CategoryType;
  olfactoryFamily: OlfactoryFamily;
  formulation: FormulationTier;
  priceNGN: number;
  stockCount: number;
  bottleSize?: string;
  spatialUtility?: "OnHumanBody" | "OnClothes" | "InTheCar" | "ForHome" | "KitchenFreshness" | "ToiletBathroom";
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  isBespokeOneOfOne: boolean;
  status: "Active" | "Draft" | "Archived";
  imageUrl: string;
  createdAt: string;
}

// Initial Mock Catalog Items
const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: "cat-001",
    sku: "TPS-EXT-001",
    title: "Creed Aventus Sovereign",
    category: "Designer Perfumes",
    olfactoryFamily: "Fresh",
    formulation: "Extrait de Parfum",
    priceNGN: 580000,
    stockCount: 14,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/creed_aventus_clean.png",
    createdAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "cat-002",
    sku: "TPS-BESP-002",
    title: "Imperial Oud Royale - Bespoke Edition",
    category: "Oud & Attar",
    olfactoryFamily: "Woody",
    formulation: "Extrait de Parfum",
    priceNGN: 1850000,
    stockCount: 1,
    isBespokeOneOfOne: true,
    status: "Active",
    imageUrl: "/products/tps_signature_oud_clean.png",
    createdAt: "2026-02-01T14:20:00Z",
  },
  {
    id: "cat-003",
    sku: "TPS-OIL-003",
    title: "Baccarat Rouge 540 Concentrated Oil",
    category: "Oil Perfumes",
    olfactoryFamily: "Amber & Gourmand",
    formulation: "Pure Perfume Oil",
    priceNGN: 320000,
    stockCount: 3,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/baccarat_rouge_clean.png",
    createdAt: "2026-02-10T09:15:00Z",
  },
  {
    id: "cat-004",
    sku: "TPS-DES-004",
    title: "Dior Sauvage Elixir Reserve",
    category: "Designer Perfumes",
    olfactoryFamily: "Fresh",
    formulation: "Eau de Parfum",
    priceNGN: 260000,
    stockCount: 22,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/dior_sauvage_clean.png",
    createdAt: "2026-02-18T11:00:00Z",
  },
  {
    id: "cat-005",
    sku: "TPS-BESP-005",
    title: "Velvet Vanilla Noir - Private Collection",
    category: "Oil Perfumes",
    olfactoryFamily: "Amber & Gourmand",
    formulation: "Pure Perfume Oil",
    priceNGN: 950000,
    stockCount: 1,
    isBespokeOneOfOne: true,
    status: "Active",
    imageUrl: "/products/tps_velvet_vanilla_oil_clean.png",
    createdAt: "2026-03-04T16:45:00Z",
  },
  {
    id: "cat-006",
    sku: "TPS-CAR-006",
    title: "Areon Gold Executive Car Scent",
    category: "Car Scents",
    olfactoryFamily: "Woody",
    formulation: "Concentrated Spray",
    priceNGN: 45000,
    stockCount: 2,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/areon_car_gold_clean.png",
    createdAt: "2026-03-12T08:30:00Z",
  },
  {
    id: "cat-007",
    sku: "TPS-MST-007",
    title: "Gingham Luxe Fine Fragrance Mist",
    category: "Body Mists",
    olfactoryFamily: "Floral",
    formulation: "Concentrated Spray",
    priceNGN: 65000,
    stockCount: 18,
    isBespokeOneOfOne: false,
    status: "Draft",
    imageUrl: "/products/bbw_gingham_clean.png",
    createdAt: "2026-03-20T13:10:00Z",
  },
  {
    id: "cat-008",
    sku: "TPS-OUD-008",
    title: "Bade'e Al Oud Honor & Glory",
    category: "Oud & Attar",
    olfactoryFamily: "Woody",
    formulation: "Eau de Parfum",
    priceNGN: 140000,
    stockCount: 4,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/badee_al_oud_clean.png",
    createdAt: "2026-04-02T15:00:00Z",
  },
  {
    id: "cat-009",
    sku: "TPS-SPY-009",
    title: "Dove Men Care Clean Comfort Spray",
    category: "Deodorant Sprays",
    olfactoryFamily: "Fresh",
    formulation: "Concentrated Spray",
    priceNGN: 28000,
    stockCount: 45,
    isBespokeOneOfOne: false,
    status: "Archived",
    imageUrl: "/products/dove_men_clean.png",
    createdAt: "2026-04-10T10:00:00Z",
  }
];

// Initial Mock Orders
const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-101",
    trackingCode: "TPS-849201-LX",
    customerName: "Chief Alabi Adeleke",
    customerEmail: "adeleke.vip@luxury.ng",
    customerAddress: "Plot 14, Banana Island Road, Ikoyi, Lagos",
    items: [
      {
        id: "creed-aventus",
        name: "Creed Aventus Sovereign",
        price: 580000,
        size: "100mL / Eau de Parfum",
        image: "/products/creed_aventus_clean.png",
        quantity: 1,
      },
    ],
    totalNGN: 580000,
    status: "Paid",
    createdAt: "2026-07-26T14:30:00Z",
  },
  {
    id: "ord-102",
    trackingCode: "TPS-591032-LX",
    customerName: "Dr. Amina Bello",
    customerEmail: "a.bello@abuja-med.org",
    customerAddress: "Maitama District, Crescent 4, Abuja",
    items: [
      {
        id: "cat-003",
        name: "Baccarat Rouge 540 Concentrated Oil",
        price: 320000,
        size: "50mL Oil",
        image: "/products/baccarat_rouge_clean.png",
        quantity: 2,
      },
    ],
    totalNGN: 640000,
    status: "Processing",
    createdAt: "2026-07-27T09:15:00Z",
  },
];

// Initial Mock Inquiries with Rich Customer Trail
const INITIAL_INQUIRIES: ConciergeInquiry[] = [
  {
    id: "inq-001",
    customerName: "Chief Alabi Adeleke",
    customerEmail: "adeleke.vip@luxury.ng",
    customerPhone: "+234 803 892 1100",
    orderCode: "TPS-849201-LX",
    accountTier: "Maison VIP Circle",
    userMessage: "I am looking for a warm, long-lasting woody oud scent for an evening gala.",
    conciergeResponse: "Recommended Creed Aventus Sovereign and Imperial Oud Royale Bespoke Edition.",
    timestamp: "2026-07-27T11:20:00Z",
    status: "New Inquiry",
  },
  {
    id: "inq-002",
    customerName: "David O. Adeleke",
    customerEmail: "design.mailler@gmail.com",
    customerPhone: "+234 902 445 8899",
    orderCode: "TPS-876788-LX",
    accountTier: "Registered Member",
    userMessage: "Do you offer custom engraved perfume bottles for wedding souvenirs in Victoria Island?",
    conciergeResponse: "Confirmed bespoke engraving service availability for private orders.",
    timestamp: "2026-07-27T15:45:00Z",
    status: "Followed Up",
  },
];

interface AppContextType {
  // Cart & Storefront
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orderStatus: "idle" | "checking_out" | "paid";
  setOrderStatus: (status: "idle" | "checking_out" | "paid") => void;
  orderTrackingCode: string | null;
  setOrderTrackingCode: (code: string | null) => void;
  chatMessages: Message[];
  addChatMessage: (sender: "user" | "concierge", text: string, isLockedOption?: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;

  // User Accounts & Guest Account Linking
  users: UserAccount[];
  getUserOrders: (email: string) => OrderRecord[];

  // Admin Captured State
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, "id" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: OrderRecord["status"]) => void;
  
  catalogItems: CatalogItem[];
  setCatalogItems: (items: CatalogItem[]) => void;
  addCatalogItem: (item: CatalogItem) => void;
  updateCatalogItem: (item: CatalogItem) => void;
  deleteCatalogItem: (id: string) => void;

  conciergeInquiries: ConciergeInquiry[];
  addConciergeInquiry: (
    userMsg: string,
    conciergeResp: string,
    customerDetails?: { name?: string; email?: string; phone?: string; orderCode?: string; tier?: string }
  ) => void;
  updateInquiryStatus: (id: string, status: ConciergeInquiry["status"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<"idle" | "checking_out" | "paid">("idle");
  const [orderTrackingCode, setOrderTrackingCode] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: "concierge",
      text: "Welcome to Maison de Parfum. I am your personal Fragrance Assistant. How can I help you find your perfect perfume today?",
      timestamp: new Date(),
    },
  ]);

  // Admin Captured Collections
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(INITIAL_CATALOG);
  const [conciergeInquiries, setConciergeInquiries] = useState<ConciergeInquiry[]>(INITIAL_INQUIRIES);

  // Sync to/from localStorage for full persistence across tabs
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("tps_admin_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCatalog = localStorage.getItem("tps_admin_catalog");
      if (savedCatalog) setCatalogItems(JSON.parse(savedCatalog));

      const savedInquiries = localStorage.getItem("tps_admin_inquiries");
      if (savedInquiries) setConciergeInquiries(JSON.parse(savedInquiries));
    } catch (err) {
      console.warn("LocalStorage sync error:", err);
    }
  }, []);

  const saveOrdersToStorage = (newOrders: OrderRecord[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem("tps_admin_orders", JSON.stringify(newOrders));
    } catch (err) {}
  };

  const saveCatalogToStorage = (newCatalog: CatalogItem[]) => {
    setCatalogItems(newCatalog);
    try {
      localStorage.setItem("tps_admin_catalog", JSON.stringify(newCatalog));
    } catch (err) {}
  };

  const saveInquiriesToStorage = (newInquiries: ConciergeInquiry[]) => {
    setConciergeInquiries(newInquiries);
    try {
      localStorage.setItem("tps_admin_inquiries", JSON.stringify(newInquiries));
    } catch (err) {}
  };

  // Cart Functions
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addChatMessage = (sender: "user" | "concierge", text: string, isLockedOption?: boolean) => {
    setChatMessages((prev) => [...prev, { sender, text, timestamp: new Date(), isLockedOption }]);
  };

  // User Accounts Collection
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "usr-101",
      email: "adeleke.vip@luxury.ng",
      fullName: "Chief Alabi Adeleke",
      memberTier: "Maison VIP Circle",
      isPendingPasswordSet: false,
      createdAt: "2026-01-01T00:00:00Z",
    },
  ]);

  const getUserOrders = (email: string) => {
    return orders.filter(
      (o) => o.customerEmail.toLowerCase() === email.toLowerCase()
    );
  };

  // Capture User Order function with Automated Account Linking
  const addOrder = (orderData: Omit<OrderRecord, "id" | "createdAt">) => {
    // Check if user account exists with this email
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === orderData.customerEmail.toLowerCase()
    );

    let assignedUserId = orderData.userId || existingUser?.id;
    let isNewAccountCreated = false;
    let magicLinkTriggered = false;

    if (!existingUser) {
      // Auto-create pending user account record with email mapping
      const newUserId = `usr-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser: UserAccount = {
        id: newUserId,
        email: orderData.customerEmail,
        fullName: orderData.customerName,
        memberTier: "Maison Member",
        isPendingPasswordSet: true,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      try {
        localStorage.setItem("tps_user_accounts", JSON.stringify(updatedUsers));
      } catch (e) {}

      assignedUserId = newUserId;
      isNewAccountCreated = true;
      magicLinkTriggered = true;
    }

    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      userId: assignedUserId,
      isGuestOrder: !existingUser,
      accountCreated: isNewAccountCreated || Boolean(existingUser),
      magicLinkSent: magicLinkTriggered,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrdersToStorage(updatedOrders);

    // Automatically decrement product stock in Catalog
    const updatedCatalog = catalogItems.map((catItem) => {
      const purchasedItem = orderData.items.find(
        (i) => i.name.toLowerCase().includes(catItem.title.toLowerCase()) || catItem.sku.includes(i.id)
      );
      if (purchasedItem) {
        return {
          ...catItem,
          stockCount: Math.max(0, catItem.stockCount - purchasedItem.quantity),
        };
      }
      return catItem;
    });

    saveCatalogToStorage(updatedCatalog);
  };

  const updateOrderStatus = (id: string, status: OrderRecord["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    saveOrdersToStorage(updated);
  };

  // Catalog Functions
  const addCatalogItem = (item: CatalogItem) => {
    const updated = [item, ...catalogItems];
    saveCatalogToStorage(updated);
  };

  const updateCatalogItem = (item: CatalogItem) => {
    const updated = catalogItems.map((i) => (i.id === item.id ? item : i));
    saveCatalogToStorage(updated);
  };

  const deleteCatalogItem = (id: string) => {
    const updated = catalogItems.filter((i) => i.id !== id);
    saveCatalogToStorage(updated);
  };

  // Concierge Inquiry Capture with Rich Customer Trail
  const addConciergeInquiry = (
    userMessage: string,
    conciergeResponse: string,
    customerDetails?: { name?: string; email?: string; phone?: string; orderCode?: string; tier?: string }
  ) => {
    const newInq: ConciergeInquiry = {
      id: `inq-${Date.now()}`,
      customerName: customerDetails?.name || "David Adeleke",
      customerEmail: customerDetails?.email || "design.mailler@gmail.com",
      customerPhone: customerDetails?.phone || "+234 802 334 5566",
      orderCode: customerDetails?.orderCode || orderTrackingCode || undefined,
      accountTier: customerDetails?.tier || "Maison Member",
      userMessage,
      conciergeResponse,
      timestamp: new Date().toISOString(),
      status: "New Inquiry",
    };
    const updated = [newInq, ...conciergeInquiries];
    saveInquiriesToStorage(updated);
  };

  const updateInquiryStatus = (id: string, status: ConciergeInquiry["status"]) => {
    const updated = conciergeInquiries.map((i) => (i.id === id ? { ...i, status } : i));
    saveInquiriesToStorage(updated);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orderStatus,
        setOrderStatus,
        orderTrackingCode,
        setOrderTrackingCode,
        chatMessages,
        addChatMessage,
        isChatOpen,
        setIsChatOpen,
        users,
        getUserOrders,
        orders,
        addOrder,
        updateOrderStatus,
        catalogItems,
        setCatalogItems: saveCatalogToStorage,
        addCatalogItem,
        updateCatalogItem,
        deleteCatalogItem,
        conciergeInquiries,
        addConciergeInquiry,
        updateInquiryStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
