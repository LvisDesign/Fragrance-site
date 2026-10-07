"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import type { CatalogItem } from "@/context/AppContext";

export const CATALOG_CACHE_TAG = "catalog";

// Mock Database Storage Array in server memory
let SERVER_CATALOG_ITEMS: CatalogItem[] = [
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

export async function getProductsAction(): Promise<{ success: boolean; data: CatalogItem[] }> {
  try {
    return { success: true, data: SERVER_CATALOG_ITEMS };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function createProductAction(item: CatalogItem): Promise<{
  success: boolean;
  message: string;
  data?: CatalogItem;
}> {
  try {
    SERVER_CATALOG_ITEMS = [item, ...SERVER_CATALOG_ITEMS];

    try {
      revalidatePath("/admin/catalog");
      revalidatePath("/shop");
      revalidatePath("/");
    } catch (e) {}

    return {
      success: true,
      message: "Catalog updated successfully. New product is now live on storefront.",
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while creating the product in catalog.",
    };
  }
}

export async function updateProductAction(item: CatalogItem): Promise<{
  success: boolean;
  message: string;
  data?: CatalogItem;
}> {
  try {
    SERVER_CATALOG_ITEMS = SERVER_CATALOG_ITEMS.map((i) => (i.id === item.id ? item : i));

    try {
      revalidatePath("/admin/catalog");
      revalidatePath("/shop");
      revalidatePath("/");
    } catch (e) {}

    return {
      success: true,
      message: "Product details and stock availability updated successfully.",
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while updating the product.",
    };
  }
}

export async function deleteProductAction(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    SERVER_CATALOG_ITEMS = SERVER_CATALOG_ITEMS.filter((i) => i.id !== id);

    try {
      revalidatePath("/admin/catalog");
      revalidatePath("/shop");
      revalidatePath("/");
    } catch (e) {}

    return {
      success: true,
      message: "Product removed from catalog successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the product.",
    };
  }
}
