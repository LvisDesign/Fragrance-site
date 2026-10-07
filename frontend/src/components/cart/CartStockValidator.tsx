"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { useCartStore } from "@/store/useCartStore";

export default function CartStockValidator() {
  const products = useCatalogStore((state) => state.products);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const validateCartStock = useCartStore((state) => state.validateCartStock);

  // Validate cart stock on initial mount and whenever cart is opened or products update
  useEffect(() => {
    if (products.length > 0) {
      validateCartStock(products);
    }
  }, [isCartOpen, products, validateCartStock]);

  return null;
}
