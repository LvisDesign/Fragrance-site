import { create } from "zustand";
import type { CatalogItem, CategoryType, OlfactoryFamily, FormulationTier } from "@/context/AppContext";
import {
  getProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/actions/catalog";

interface CatalogState {
  products: CatalogItem[];
  selectedCategory: CategoryType | "ALL";
  olfactoryFilter: OlfactoryFamily | "ALL";
  formulationFilter: FormulationTier | "ALL";
  spatialUtilityFilter: CatalogItem["spatialUtility"] | "ALL";
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryType | "ALL") => void;
  setOlfactoryFilter: (family: OlfactoryFamily | "ALL") => void;
  setFormulationFilter: (tier: FormulationTier | "ALL") => void;
  setSpatialUtilityFilter: (utility: CatalogItem["spatialUtility"] | "ALL") => void;
  resetFilters: () => void;

  // Optimistic Mutations
  optimisticAddProduct: (item: CatalogItem) => Promise<{ success: boolean; message: string }>;
  optimisticUpdateProduct: (item: CatalogItem) => Promise<{ success: boolean; message: string }>;
  optimisticDeleteProduct: (id: string) => Promise<{ success: boolean; message: string }>;

  // Computed Getter
  getFilteredProducts: () => CatalogItem[];
}

const INITIAL_PRODUCTS: CatalogItem[] = [
  {
    id: "cat-001",
    title: "Creed Aventus Sovereign",
    sku: "TPS-AV-001",
    category: "Designer Perfumes",
    olfactoryFamily: "Woody",
    formulation: "Extrait de Parfum",
    spatialUtility: "OnClothes",
    priceNGN: 580000,
    stockCount: 14,
    isBespokeOneOfOne: true,
    status: "Active",
    imageUrl: "/products/creed_aventus_clean.png",
    createdAt: "2026-07-28T10:00:00Z",
  },
  {
    id: "cat-002",
    title: "Imperial Oud Royale",
    sku: "TPS-OUD-002",
    category: "Oud & Attar",
    olfactoryFamily: "Woody",
    formulation: "Extrait de Parfum",
    spatialUtility: "OnClothes",
    priceNGN: 420000,
    stockCount: 8,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/surrati_golden_sand_clean.png",
    createdAt: "2026-07-28T10:30:00Z",
  },
  {
    id: "cat-003",
    title: "Midnight Silk Roll-On Oil",
    sku: "TPS-OIL-003",
    category: "Oil Perfumes",
    olfactoryFamily: "Amber & Gourmand",
    formulation: "Pure Perfume Oil",
    spatialUtility: "OnHumanBody",
    priceNGN: 45000,
    stockCount: 25,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/tom_ford_black_orchid_clean.png",
    createdAt: "2026-07-28T11:00:00Z",
  },
  {
    id: "cat-004",
    title: "Velvet Petals Mist Spray",
    sku: "TPS-MST-004",
    category: "Body Mists",
    olfactoryFamily: "Floral",
    formulation: "Concentrated Spray",
    spatialUtility: "OnHumanBody",
    priceNGN: 18500,
    stockCount: 40,
    isBespokeOneOfOne: false,
    status: "Active",
    imageUrl: "/products/vs_velvet_petals_clean.png",
    createdAt: "2026-07-28T11:30:00Z",
  },
];

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: INITIAL_PRODUCTS,
  selectedCategory: "ALL",
  olfactoryFilter: "ALL",
  formulationFilter: "ALL",
  spatialUtilityFilter: "ALL",
  searchQuery: "",
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getProductsAction();
      if (res.success && res.data.length > 0) {
        set({ products: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: "Failed to load catalog products.", isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setOlfactoryFilter: (olfactoryFilter) => set({ olfactoryFilter }),
  setFormulationFilter: (formulationFilter) => set({ formulationFilter }),
  setSpatialUtilityFilter: (spatialUtilityFilter) => set({ spatialUtilityFilter }),

  resetFilters: () =>
    set({
      selectedCategory: "ALL",
      olfactoryFilter: "ALL",
      formulationFilter: "ALL",
      spatialUtilityFilter: "ALL",
      searchQuery: "",
    }),

  optimisticAddProduct: async (item: CatalogItem) => {
    const previousProducts = get().products;
    set({ products: [item, ...previousProducts] });

    try {
      const res = await createProductAction(item);
      if (!res.success) {
        set({ products: previousProducts });
        return { success: false, message: res.message };
      }
      return { success: true, message: "Catalog updated successfully" };
    } catch (e) {
      set({ products: previousProducts });
      return { success: false, message: "Network sync error" };
    }
  },

  optimisticUpdateProduct: async (item: CatalogItem) => {
    const previousProducts = get().products;
    set({
      products: previousProducts.map((p) => (p.id === item.id ? item : p)),
    });

    try {
      const res = await updateProductAction(item);
      if (!res.success) {
        set({ products: previousProducts });
        return { success: false, message: res.message };
      }
      return { success: true, message: "Product updated successfully" };
    } catch (e) {
      set({ products: previousProducts });
      return { success: false, message: "Network sync error" };
    }
  },

  optimisticDeleteProduct: async (id: string) => {
    const previousProducts = get().products;
    set({
      products: previousProducts.filter((p) => p.id !== id),
    });

    try {
      const res = await deleteProductAction(id);
      if (!res.success) {
        set({ products: previousProducts });
        return { success: false, message: res.message };
      }
      return { success: true, message: "Product deleted successfully" };
    } catch (e) {
      set({ products: previousProducts });
      return { success: false, message: "Network sync error" };
    }
  },

  getFilteredProducts: () => {
    const {
      products,
      selectedCategory,
      olfactoryFilter,
      formulationFilter,
      spatialUtilityFilter,
      searchQuery,
    } = get();

    return products.filter((item) => {
      if (item.status === "Archived") return false;

      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }

      if (olfactoryFilter !== "ALL" && item.olfactoryFamily !== olfactoryFilter) {
        return false;
      }

      if (formulationFilter !== "ALL" && item.formulation !== formulationFilter) {
        return false;
      }

      if (spatialUtilityFilter !== "ALL" && item.spatialUtility !== spatialUtilityFilter) {
        return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q);
        const skuMatch = item.sku.toLowerCase().includes(q);
        const categoryMatch = item.category.toLowerCase().includes(q);
        const familyMatch = item.olfactoryFamily.toLowerCase().includes(q);
        if (!titleMatch && !skuMatch && !categoryMatch && !familyMatch) {
          return false;
        }
      }

      return true;
    });
  },
}));
