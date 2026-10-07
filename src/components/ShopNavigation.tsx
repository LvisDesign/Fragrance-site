"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductSubType } from "@/hooks/usePerfumeCatalog";
import { motion } from "framer-motion";
import {
  Sparkles,
  Droplet,
  Wind,
  Cloud,
  Crown,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

interface ShopNavigationProps {
  selectedSubType?: ProductSubType | null;
  selectSubType?: (type: ProductSubType | null) => void;
}

export default function ShopNavigation({
  selectedSubType = null,
  selectSubType = () => {}
}: ShopNavigationProps) {
  const router = useRouter();

  const productCards: {
    id: ProductSubType;
    title: string;
    subtext: string;
    icon: React.ComponentType<any>;
  }[] = [
    {
      id: "DesignerPerfume",
      title: "Designer Perfume",
      subtext: "Alcohol-based sprays for clothes & long-lasting trails.",
      icon: Sparkles
    },
    {
      id: "OilPerfume",
      title: "Oil Perfume",
      subtext: "100% pure, alcohol-free oils that stick to the skin all day.",
      icon: Droplet
    },
    {
      id: "BodySpray",
      title: "Body Spray",
      subtext: "Light aerosol sprays for instant freshness after a shower.",
      icon: Wind
    },
    {
      id: "BodyFragranceMist",
      title: "Body & Fragrance Mist",
      subtext: "Sweet, gentle, light liquid sprays for casual everyday wear.",
      icon: Cloud
    },
    {
      id: "OudAttar",
      title: "Oud & Attar",
      subtext: "Rich, heavy, premium Middle Eastern concentrated oils.",
      icon: Crown
    },
    {
      id: "DeodorantSpray",
      title: "Deodorant Spray",
      subtext: "Anti-odor sprays formulated specifically for underarms.",
      icon: ShieldCheck
    }
  ];

  const handleCardClick = (id: any) => {
    router.push(`/shop/product-type/${id}`);
  };

  return (
    <div className="py-16 px-6 lg:px-8 max-w-7xl mx-auto space-y-12 relative z-10 text-left">
      
      {/* Explicit Section Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <div className="space-y-1.5">
          <span className="bg-accent/10 border border-accent/20 text-accent text-[9px] uppercase tracking-widest px-3 py-1 font-semibold font-sans rounded-xs">
            Maison Discovery Index
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest text-neutral-900 font-sans">
            Browse Formulations
          </h2>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="min-h-[300px]">
        <motion.div
          key="product-matrix"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {productCards.map((card) => {
            const isSelected = selectedSubType === card.id;
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`group text-left p-6 bg-white hover:bg-neutral-50/80 border rounded-sm transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-44 shadow-xs ${
                  isSelected
                    ? "border-accent shadow-[0_0_20px_rgba(197,160,89,0.15)] ring-1 ring-accent"
                    : "border-neutral-200/80 hover:border-accent/40"
                }`}
              >
                <div className="flex gap-4 items-start w-full">
                  <div className={`p-2.5 rounded-sm border flex items-center justify-center ${
                    isSelected
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-neutral-200 bg-neutral-100/70 text-neutral-700 group-hover:border-accent/40 group-hover:text-accent transition-colors duration-300"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div className="space-y-1 flex-1 text-left">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-sans">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                      {card.subtext}
                    </p>
                  </div>
                </div>

                <div className="w-full flex justify-end pt-4 border-t border-neutral-100 mt-auto">
                  <motion.div
                    className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-neutral-400 group-hover:text-accent transition-colors duration-300 font-medium"
                  >
                    <span>Explore Formulation</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                  </motion.div>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
}
