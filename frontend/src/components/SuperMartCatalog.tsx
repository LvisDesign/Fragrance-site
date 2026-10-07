"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { usePerfumeCatalog, PerfumeProduct, OlfactoryFamily, FormulationTier, ProductType } from "@/hooks/usePerfumeCatalog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Filter, 
  RotateCcw, 
  X, 
  Plus, 
  Pyramid, 
  SlidersHorizontal
} from "lucide-react";

interface SuperMartCatalogProps {
  catalog: ReturnType<typeof usePerfumeCatalog>;
}

export function getProductBrandAndName(productName: string) {
  const brands = [
    { key: "Creed Aventus Oil (Surrati)", brand: "Surrati", name: "Creed Aventus Oil" },
    { key: "Dior Sauvage Oil Impression", brand: "Surrati", name: "Dior Sauvage Oil" },
    { key: "Surrati Golden Sand Oil", brand: "Surrati", name: "Golden Sand Oil" },
    { key: "Al-Rehab Choco Musk Oil", brand: "Al-Rehab", name: "Choco Musk Oil" },
    { key: "Creed Aventus", brand: "Creed", name: "Aventus" },
    { key: "Dior Sauvage", brand: "Dior", name: "Sauvage" },
    { key: "Tom Ford Black Orchid", brand: "Tom Ford", name: "Black Orchid" },
    { key: "YSL Black Opium", brand: "YSL", name: "Black Opium" },
    { key: "Bleu de Chanel", brand: "Chanel", name: "Bleu de Chanel" },
    { key: "MFK Baccarat Rouge 540", brand: "MFK", name: "Baccarat Rouge 540" },
    { key: "Lattafa Yara Body Spray", brand: "Lattafa", name: "Yara Body Spray" },
    { key: "Lattafa Asad Body Spray", brand: "Lattafa", name: "Asad Body Spray" },
    { key: "Axe Gold Temptation Spray", brand: "Axe", name: "Gold Temptation" },
    { key: "Nivea Men Deep Impact Spray", brand: "Nivea", name: "Men Deep Impact" },
    { key: "VS Bare Vanilla Mist", brand: "Victoria's Secret", name: "Bare Vanilla Mist" },
    { key: "BBW Into The Night Mist", brand: "Bath & Body Works", name: "Into The Night Mist" },
    { key: "BBW Gingham Mist", brand: "Bath & Body Works", name: "Gingham Mist" },
    { key: "VS Velvet Petals Mist", brand: "Victoria's Secret", name: "Velvet Petals Mist" },
    { key: "Lattafa Khamrah", brand: "Lattafa", name: "Khamrah" },
    { key: "Lattafa Bade'e Al Oud", brand: "Lattafa", name: "Bade'e Al Oud" },
    { key: "Arabian Oud Kalemat", brand: "Arabian Oud", name: "Kalemat" },
    { key: "Rasasi Shuhrah Pour Homme", brand: "Rasasi", name: "Shuhrah Pour Homme" },
    { key: "Glade Air Freshener (Lavender)", brand: "Glade", name: "Air Freshener (Lavender)" },
    { key: "Air Wick Freshmatic Auto", brand: "Air Wick", name: "Freshmatic Auto" },
    { key: "Harpic Active Fresh Rim Block", brand: "Harpic", name: "Active Fresh Rim Block" },
    { key: "Febreze Air Effects (Linen & Sky)", brand: "Febreze", name: "Air Effects (Linen & Sky)" },
    { key: "Areon Gel Car Scent (Gold)", brand: "Areon", name: "Gel Car Scent (Gold)" },
    { key: "Little Trees (Black Ice)", brand: "Little Trees", name: "Black Ice" },
    { key: "California Scents (Coronado Cherry)", brand: "California Scents", name: "Coronado Cherry" },
    { key: "Areon Liquid Car Perfume", brand: "Areon", name: "Liquid Car Perfume" },
    { key: "Miniso Scented Reed Diffuser", brand: "Miniso", name: "Scented Reed Diffuser" },
    { key: "Glade Scented Candle (Vanilla)", brand: "Glade", name: "Scented Candle (Vanilla)" },
    { key: "Air Wick Reed Diffuser (Rose)", brand: "Air Wick", name: "Reed Diffuser (Rose)" },
    { key: "Glade Air Freshener (Lemon)", brand: "Glade", name: "Air Freshener (Lemon)" },
    { key: "Air Wick Spray (Orange)", brand: "Air Wick", name: "Spray (Orange)" },
    { key: "Febreze Kitchen Odor Clear", brand: "Febreze", name: "Kitchen Odor Clear" },
    { key: "TPS Signature Oud", brand: "TPS", name: "Signature Oud" },
    { key: "TPS Velvet Vanilla Oil", brand: "TPS", name: "Velvet Vanilla Oil" },
    { key: "TPS Blossom Breeze Diffuser", brand: "TPS", name: "Blossom Breeze Diffuser" }
  ];

  const match = brands.find(b => b.key === productName);
  if (match) {
    return { brand: match.brand, name: match.name };
  }
  return { brand: "Maison", name: productName };
}

export default function SuperMartCatalog({ catalog }: SuperMartCatalogProps) {
  const { addToCart } = useApp();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    filteredProducts,
    selectedFamilies,
    selectedTiers,
    selectedTypes,
    toggleFamily,
    toggleTier,
    toggleType,
    clearFilters,
    showPyramid,
    setShowPyramid,
  } = catalog;

  const familyLabels: { value: OlfactoryFamily; label: string }[] = [
    { value: "Fresh", label: "Fresh" },
    { value: "Floral", label: "Floral" },
    { value: "Woody", label: "Woody" },
    { value: "AmberGourmand", label: "Amber & Sweet" },
    { value: "Aromatic", label: "Aromatic" },
  ];

  const tierLabels: { value: FormulationTier; label: string }[] = [
    { value: "ExtraitDeParfum", label: "Extra Long-Lasting Perfume" },
    { value: "EauDeParfum", label: "Long-Lasting Perfume Spray" },
    { value: "EauDeToilette", label: "Light Perfume Spray" },
  ];

  const typeLabels: { value: ProductType; label: string }[] = [
    { value: "PremiumPerfumes", label: "Flagship Perfumes" },
    { value: "SpecialOils", label: "Curated Oils" },
    { value: "CarScentBrand", label: "Car Scents" },
  ];

  const formulationLabels: Record<FormulationTier, string> = {
    ExtraitDeParfum: "Extra Long-Lasting Perfume",
    EauDeParfum: "Long-Lasting Perfume Spray",
    EauDeToilette: "Light Perfume Spray"
  };

  const springTransition = { type: "spring" as const, damping: 30, stiffness: 220 };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200
      }
    }
  };

  const activeFiltersCount = selectedFamilies.length + selectedTiers.length + selectedTypes.length;

  return (
    <div className="py-12 px-6 lg:px-8 max-w-7xl mx-auto relative z-10 font-sans">
      
      {/* Super Mart Control Panel (Sub-Header) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/8 pb-6 mb-8 text-left">
        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-800">
            Perfume Shop
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Browse and filter our perfume collection.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-300 rounded-sm text-[10px] uppercase tracking-widest text-neutral-800 hover:text-neutral-950 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Olfactory Pyramid Toggle */}
          <button
            onClick={() => setShowPyramid(!showPyramid)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              showPyramid
                ? "border-accent bg-amber-50 text-amber-900 font-semibold shadow-xs"
                : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
            }`}
          >
            <Pyramid className="h-3.5 w-3.5" />
            <span>Scent Notes</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar + Right Catalog Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* SIDEBAR: Desktop (always visible) & Mobile (collapsible) */}
        <aside className={`w-full lg:w-64 shrink-0 space-y-6 text-left ${
          mobileFiltersOpen ? "block" : "hidden lg:block"
        }`}>
          
          {/* Header & Reset */}
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-accent" />
              <span>Filter Scent</span>
            </span>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-accent hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filter Option Group 1: Fragrance Class */}
          <div className="space-y-3.5 border-b border-black/5 pb-5">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Perfume Category
            </h3>
            <div className="flex flex-col gap-2">
              {typeLabels.map((t) => {
                const isSelected = selectedTypes.includes(t.value);
                return (
                  <button
                    key={t.value}
                    onClick={() => toggleType(t.value)}
                    className={`flex items-center justify-between px-3 py-2 border text-[10px] uppercase tracking-wider transition-all rounded-sm font-medium w-full text-left cursor-pointer ${
                      isSelected
                        ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                        : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                    }`}
                  >
                    <span>{t.label}</span>
                    {isSelected && <X className="h-3 w-3 text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Option Group 2: Olfactory Family */}
          <div className="space-y-3.5 border-b border-black/5 pb-5">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Scent Profile
            </h3>
            <div className="flex flex-col gap-2">
              {familyLabels.map((fam) => {
                const isSelected = selectedFamilies.includes(fam.value);
                return (
                  <button
                    key={fam.value}
                    onClick={() => toggleFamily(fam.value)}
                    className={`flex items-center justify-between px-3 py-2 border text-[10px] uppercase tracking-wider transition-all rounded-sm font-medium w-full text-left cursor-pointer ${
                      isSelected
                        ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                        : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                    }`}
                  >
                    <span>{fam.label}</span>
                    {isSelected && <X className="h-3 w-3 text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Option Group 3: Formulation Tiers */}
          <div className="space-y-3.5 pb-2">
            <h3 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Perfume Concentration
            </h3>
            <div className="flex flex-col gap-2">
              {tierLabels.map((tier) => {
                const isSelected = selectedTiers.includes(tier.value);
                return (
                  <button
                    key={tier.value}
                    onClick={() => toggleTier(tier.value)}
                    className={`flex items-center justify-between px-3 py-2 border text-[10px] uppercase tracking-wider transition-all rounded-sm font-medium w-full text-left cursor-pointer ${
                      isSelected
                        ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                        : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                    }`}
                  >
                    <span>{tier.label}</span>
                    {isSelected && <X className="h-3 w-3 text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: Active Filter Badges + Dynamic Products Matrix */}
        <div className="w-full flex-1 space-y-6">
          
          {/* Active Filter Badges Summary */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {/* Selected Categories */}
              {selectedTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-amber-100/80 border border-amber-300 text-amber-950 text-[9px] uppercase tracking-wider"
                >
                  <span>{typeLabels.find((t) => t.value === type)?.label}</span>
                  <button onClick={() => toggleType(type)} className="hover:text-black cursor-pointer">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              {/* Selected Families */}
              {selectedFamilies.map((fam) => (
                <span
                  key={fam}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-amber-100/80 border border-amber-300 text-amber-950 text-[9px] uppercase tracking-wider"
                >
                  <span>{familyLabels.find((f) => f.value === fam)?.label}</span>
                  <button onClick={() => toggleFamily(fam)} className="hover:text-black cursor-pointer">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              {/* Selected Tiers */}
              {selectedTiers.map((tier) => (
                <span
                  key={tier}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-amber-100/80 border border-amber-300 text-amber-950 text-[9px] uppercase tracking-wider"
                >
                  <span>{tierLabels.find((t) => t.value === tier)?.label}</span>
                  <button onClick={() => toggleTier(tier)} className="hover:text-black cursor-pointer">
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}

              <button
                onClick={clearFilters}
                className="text-[9px] uppercase tracking-widest text-neutral-500 hover:text-accent ml-auto pl-2 py-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Scent Grid */}
          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            transition={springTransition}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  className="flex flex-col justify-between group border border-black/8 hover:border-black/15 rounded-sm p-4 bg-white shadow-xs hover:shadow-lg transition-all duration-300 h-full text-left font-sans"
                >
                  <div>
                    {/* Bottle Image Container */}
                    <div className="hex-border-wrap hex-clip-corner overflow-hidden bg-[#FAF9F5] border border-black/5 relative aspect-[4/5] w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-20" />
                      
                      {/* Sub-Badges overlay */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 font-sans">
                        <span className="bg-white/95 border border-black/10 text-neutral-800 text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-medium shadow-xs">
                          {product.olfactoryFamily}
                        </span>
                        <span className="bg-accent text-white text-[7px] uppercase tracking-widest px-2 py-0.5 font-bold rounded-sm font-sans shadow-xs">
                          {formulationLabels[product.formulationTier]}
                        </span>
                      </div>
                    </div>

                    {/* Scent Info Panel */}
                    <div className="pt-4 space-y-2">
                      {(() => {
                        const { brand, name } = getProductBrandAndName(product.name);
                        return (
                          <div className="space-y-0.5">
                            <span className="text-[8px] uppercase tracking-[0.2em] text-accent font-extrabold block">
                              {brand}
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 group-hover:text-accent transition-colors duration-300 line-clamp-1 font-sans">
                              {name}
                            </h3>
                          </div>
                        );
                      })()}

                      {/* Olfactory Pyramid detail view toggle */}
                      {showPyramid ? (
                        <div className="space-y-1.5 text-[9px] leading-relaxed border-l border-neutral-200 pl-2.5 font-sans mt-2">
                          <p className="text-neutral-600">
                            <span className="text-accent text-[8px] uppercase tracking-wider font-semibold mr-1">Top:</span> 
                            {product.pyramid.top.join(", ")}
                          </p>
                          <p className="text-neutral-600">
                            <span className="text-accent text-[8px] uppercase tracking-wider font-semibold mr-1">Heart:</span> 
                            {product.pyramid.heart.join(", ")}
                          </p>
                          <p className="text-neutral-600">
                            <span className="text-accent text-[8px] uppercase tracking-wider font-semibold mr-1">Base:</span> 
                            {product.pyramid.base.join(", ")}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-600 leading-relaxed font-light h-16 overflow-hidden line-clamp-3 font-sans">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Cart add trigger */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-black/5 mt-4 font-sans">
                    <span className="text-xs font-bold tracking-wider text-neutral-900">
                      ₦{product.price.toLocaleString()}
                    </span>
                    
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          size: product.size,
                          image: product.image,
                        })
                      }
                      className="px-3.5 py-1.5 border border-neutral-300 hover:border-accent hover:text-white hover:bg-accent text-[9px] uppercase tracking-widest text-neutral-900 font-semibold transition-all duration-300 flex items-center gap-1 rounded-sm cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty Search Matrix State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-4 font-sans border border-black/5 bg-white rounded-sm shadow-xs"
            >
              <p className="text-neutral-500 text-xs font-light">
                No perfumes match your search.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 border border-accent text-accent hover:bg-accent hover:text-white text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
