"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { usePerfumeCatalog, PerfumeProduct, OlfactoryFamily, FormulationTier, ProductType } from "@/hooks/usePerfumeCatalog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Sparkles, Filter, RotateCcw, Pyramid } from "lucide-react";

interface ProductCatalogProps {
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

export default function ProductCatalog({ catalog }: ProductCatalogProps) {
  const { addToCart } = useApp();
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
        staggerChildren: 0.05,
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

  return (
    <section id="collections" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto space-y-12 relative z-10">
      
      {/* Sticky Scent Journey Filter Matrix - Sticky under the Navbar */}
      <div className="sticky top-24 z-30 bg-white/92 border border-black/8 p-6 rounded-md shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col gap-6 text-left">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-4">
            <div className="flex items-center gap-2.5">
              <Filter className="h-4.5 w-4.5 text-accent" />
              <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-900 font-sans">
                Filter Perfumes
              </h3>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Reset trigger */}
              {(selectedFamilies.length > 0 || selectedTiers.length > 0 || selectedTypes.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent hover:text-neutral-900 transition-colors font-sans cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}

              {/* Olfactory Pyramid Toggle */}
              <button
                onClick={() => setShowPyramid(!showPyramid)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-sm text-[10px] uppercase tracking-widest transition-all duration-300 font-sans cursor-pointer ${
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

          {/* Filters Matrix Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Dimension 1: Collections */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Collections</h4>
              <div className="flex flex-wrap gap-2">
                {typeLabels.map((t) => {
                  const isSelected = selectedTypes.includes(t.value);
                  return (
                    <button
                      key={t.value}
                      onClick={() => toggleType(t.value)}
                      className={`px-3 py-1.5 border text-[9px] uppercase tracking-wider transition-all rounded-sm font-medium cursor-pointer ${
                        isSelected
                          ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                          : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 2: Olfactory Family */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Scent Profile</h4>
              <div className="flex flex-wrap gap-2">
                {familyLabels.map((fam) => {
                  const isSelected = selectedFamilies.includes(fam.value);
                  return (
                    <button
                      key={fam.value}
                      onClick={() => toggleFamily(fam.value)}
                      className={`px-3 py-1.5 border text-[9px] uppercase tracking-wider transition-all rounded-sm font-medium cursor-pointer ${
                        isSelected
                          ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                          : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                      }`}
                    >
                      {fam.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 3: Formulation Tiers */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">Perfume Concentration</h4>
              <div className="flex flex-wrap gap-2">
                {tierLabels.map((tier) => {
                  const isSelected = selectedTiers.includes(tier.value);
                  return (
                    <button
                      key={tier.value}
                      onClick={() => toggleTier(tier.value)}
                      className={`px-3 py-1.5 border text-[9px] uppercase tracking-wider transition-all rounded-sm font-medium cursor-pointer ${
                        isSelected
                          ? "border-accent text-amber-950 bg-amber-100/70 font-semibold shadow-xs"
                          : "border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 bg-white"
                      }`}
                    >
                      {tier.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Layout-Morphing Cards Grid */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        transition={springTransition}
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => {
            const isEditorial = idx % 3 === 1;

            return (
              <motion.div
                key={product.id}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springTransition}
                className={`flex flex-col justify-between group border border-black/8 rounded-sm p-5 bg-white shadow-xs hover:shadow-xl transition-all duration-300 ${
                  isEditorial ? "col-span-1 md:col-span-2" : "col-span-1"
                }`}
              >
                
                {isEditorial ? (
                  /* Editorial Callout Split Card Layout */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                    {/* Visual left column */}
                    <div className="hex-border-wrap hex-clip-corner overflow-hidden bg-[#FAF9F5] border border-black/5 relative aspect-[4/5] sm:aspect-auto h-full min-h-[300px]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30" />
                      
                      {/* Left Badge: Concentration Tier */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                        <span className="bg-accent text-white text-[9px] uppercase tracking-widest px-3 py-1 font-bold font-sans shadow-xs">
                          {formulationLabels[product.formulationTier]}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Content right column */}
                    <div className="flex flex-col justify-between py-4 text-left">
                      <div className="space-y-6">
                        {(() => {
                          const { brand, name } = getProductBrandAndName(product.name);
                          return (
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-extrabold block">
                                {brand}
                              </span>
                              <h3 className="text-xl font-bold uppercase tracking-widest text-neutral-900 font-sans">
                                {name}
                              </h3>
                            </div>
                          );
                        })()}

                        {/* Scent Pyramid Toggle State */}
                        {showPyramid ? (
                          <div className="space-y-3.5 border-l border-neutral-200 pl-4 py-2 font-sans">
                            <div className="space-y-0.5">
                              <p className="text-[9px] uppercase tracking-wider text-accent font-semibold">Top Vapors</p>
                              <p className="text-xs text-neutral-700 font-light">{product.pyramid.top.join(" • ")}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] uppercase tracking-wider text-accent font-semibold">Heart Resonance</p>
                              <p className="text-xs text-neutral-700 font-light">{product.pyramid.heart.join(" • ")}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] uppercase tracking-wider text-accent font-semibold">Base Sediment</p>
                              <p className="text-xs text-neutral-700 font-light">{product.pyramid.base.join(" • ")}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-xs text-neutral-600 leading-relaxed font-light font-sans">
                              {product.description}
                            </p>
                            {/* Cursive script ingredients signature */}
                            <div className="space-y-1">
                              <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans">Scent Notes</p>
                              <p className="font-signature text-accent text-3xl normal-case">
                                {product.pyramid.heart[0]} & {product.pyramid.base[0]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transaction triggers */}
                      <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-6 font-sans">
                        <span className="text-lg font-bold tracking-wider text-neutral-900">
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
                          className="px-6 py-3 border border-neutral-300 hover:border-accent hover:text-white hover:bg-accent text-[10px] uppercase tracking-widest text-neutral-900 font-semibold transition-all duration-300 flex items-center gap-2 rounded-sm cursor-pointer shadow-xs"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Product Card Layout */
                  <div className="flex flex-col h-full justify-between text-left">
                    <div>
                      {/* Image container */}
                      <div className="hex-border-wrap hex-clip-corner overflow-hidden bg-[#FAF9F5] border border-black/5 relative aspect-[4/5]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 30vw"
                          className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-20" />
                        
                        {/* Tags: Olfactory Family and Concentration Badge */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-sans">
                          <span className="bg-white/95 border border-black/10 text-neutral-800 text-[8px] uppercase tracking-widest px-2.5 py-1 font-medium shadow-xs">
                            {product.olfactoryFamily}
                          </span>
                          <span className="bg-accent text-white text-[7px] uppercase tracking-widest px-2.5 py-1 font-bold shadow-xs">
                            {formulationLabels[product.formulationTier]}
                          </span>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="pt-6 space-y-3">
                        {(() => {
                          const { brand, name } = getProductBrandAndName(product.name);
                          return (
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase tracking-[0.2em] text-accent font-extrabold block">
                                {brand}
                              </span>
                              <h3 className="text-base font-bold uppercase tracking-widest text-neutral-900 group-hover:text-accent transition-colors duration-300 font-sans">
                                {name}
                              </h3>
                            </div>
                          );
                        })()}

                        {/* Pyramid representation */}
                        {showPyramid ? (
                          <div className="space-y-2 text-[10px] leading-relaxed border-l border-neutral-200 pl-3 font-sans">
                            <p className="text-neutral-600"><span className="text-accent text-[9px] uppercase tracking-wider font-semibold">Top:</span> {product.pyramid.top.join(", ")}</p>
                            <p className="text-neutral-600"><span className="text-accent text-[9px] uppercase tracking-wider font-semibold">Heart:</span> {product.pyramid.heart.join(", ")}</p>
                            <p className="text-neutral-600"><span className="text-accent text-[9px] uppercase tracking-wider font-semibold">Base:</span> {product.pyramid.base.join(", ")}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-600 leading-relaxed font-light h-16 overflow-hidden font-sans">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Cart CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-4 font-sans">
                      <span className="text-sm font-semibold tracking-wider text-neutral-900">
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
                        className="px-4 py-2 border border-neutral-300 hover:border-accent hover:text-white hover:bg-accent text-[10px] uppercase tracking-widest text-neutral-900 font-semibold transition-all duration-300 flex items-center gap-1.5 rounded-sm cursor-pointer shadow-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 space-y-4 font-sans"
        >
          <p className="text-neutral-500 text-sm font-light">No formulations match your scent selections.</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 border border-accent text-accent hover:bg-accent hover:text-white text-xs uppercase tracking-widest transition-all duration-300 rounded-sm font-semibold cursor-pointer"
          >
            Clear Search Matrix
          </button>
        </motion.div>
      )}

    </section>
  );
}
