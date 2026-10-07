import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CatalogItem } from "@/context/AppContext";

interface CartValidationNotice {
  id: string;
  type: "warning" | "info";
  message: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  notices: CartValidationNotice[];

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  dismissNotice: (id: string) => void;

  // Real-Time Stock Validation Check
  validateCartStock: (availableProducts: CatalogItem[]) => void;

  // Calculated Getters
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: "cat-001",
          name: "Creed Aventus Sovereign",
          price: 580000,
          size: "100mL / Extrait de Parfum",
          image: "/products/creed_aventus_clean.png",
          quantity: 1,
        },
      ],
      isCartOpen: false,
      notices: [],

      addItem: (newItem) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.id === newItem.id);

        if (existing) {
          set({
            items: currentItems.map((i) =>
              i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isCartOpen: true,
          });
        } else {
          set({
            items: [...currentItems, { ...newItem, quantity: 1 }],
            isCartOpen: true,
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),

      dismissNotice: (id) =>
        set({ notices: get().notices.filter((n) => n.id !== id) }),

      /**
       * Real-Time Stock & Availability Validation Check
       * Compares cart items against live catalog availability
       */
      validateCartStock: (availableProducts) => {
        const currentItems = get().items;
        const newNotices: CartValidationNotice[] = [];
        const updatedItems: CartItem[] = [];

        for (const item of currentItems) {
          const liveProduct = availableProducts.find((p) => p.id === item.id);

          // 1. If item no longer exists in catalog or status is non-active or stock is 0
          if (!liveProduct || liveProduct.status !== "Active" || liveProduct.stockCount === 0) {
            newNotices.push({
              id: `notice-${Date.now()}-${item.id}`,
              type: "warning",
              message: `Item "${item.name}" is currently out of stock and was automatically removed from your cart.`,
            });
            continue;
          }

          // 2. If cart quantity exceeds available stock count
          if (item.quantity > liveProduct.stockCount) {
            newNotices.push({
              id: `notice-${Date.now()}-${item.id}`,
              type: "info",
              message: `Quantity for "${item.name}" was adjusted to ${liveProduct.stockCount} to match live stock availability.`,
            });
            updatedItems.push({
              ...item,
              quantity: liveProduct.stockCount,
            });
          } else {
            updatedItems.push(item);
          }
        }

        set({
          items: updatedItems,
          notices: [...get().notices, ...newNotices],
        });
      },

      // Calculated Getters
      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getTax: () => {
        // 7.5% VAT standard
        return Math.round(get().getSubtotal() * 0.075);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 200000) return 0; // Free delivery above ₦200,000
        return 3500; // Flat delivery fee
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal + get().getTax() + get().getDeliveryFee();
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "perfume_brand_cart_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
