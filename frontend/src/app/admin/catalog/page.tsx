import React from "react";
import CatalogManagement from "@/components/admin/CatalogManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog & Multi-Tier Inventory Management | The Perfume Slut Admin",
  description: "The Perfume Slut Admin Platform - Inventory, SKUs, Formulations & Bespoke Fragrances Management",
};

export default function AdminCatalogPage() {
  return <CatalogManagement />;
}
