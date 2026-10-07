"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";

export type ProductType = "PremiumPerfumes" | "SpecialOils" | "CarScentBrand";
export type OlfactoryFamily = "Fresh" | "Floral" | "Woody" | "AmberGourmand" | "Aromatic";
export type FormulationTier = "ExtraitDeParfum" | "EauDeParfum" | "EauDeToilette";

export type ProductSubType =
  | "DesignerPerfume"
  | "OilPerfume"
  | "BodySpray"
  | "BodyFragranceMist"
  | "OudAttar"
  | "DeodorantSpray";

export type SpatialUtility =
  | "OnHumanBody"
  | "OnClothes"
  | "InTheCar"
  | "ForHome"
  | "KitchenFreshness"
  | "ToiletBathroom";

export interface ScentPyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface PerfumeProduct {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  description: string;
  type: ProductType;
  olfactoryFamily: OlfactoryFamily;
  formulationTier: FormulationTier;
  subType: ProductSubType;
  utility: SpatialUtility;
  pyramid: ScentPyramid;
}

export const staticProducts: PerfumeProduct[] = [
  // 1. DESIGNER PERFUME
  {
    id: "creed-aventus",
    name: "Creed Aventus",
    price: 520000,
    size: "100mL / Eau de Parfum",
    image: "/products/creed_aventus_clean.png",
    description: "The absolute benchmark of masculine luxury in Nigeria. A bold blend of blackcurrant, Italian bergamot, royal pineapple, and smoky birch wood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
      heart: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
      base: ["Musk", "Oakmoss", "Ambergris", "Vanilla"]
    }
  },
  {
    id: "dior-sauvage",
    name: "Dior Sauvage",
    price: 240000,
    size: "100mL / Eau de Parfum",
    image: "/products/dior_sauvage_clean.png",
    description: "Extremely popular daily perfume. A fresh, woody scent with citrus, spicy pepper, and warm amber notes.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Calabrian Bergamot", "Pepper"],
      heart: ["Sichuan Pepper", "Lavender", "Patchouli", "Vetiver"],
      base: ["Ambrosia", "Cedar", "Labdanum"]
    }
  },
  {
    id: "tom-ford-black-orchid",
    name: "Tom Ford Black Orchid",
    price: 270000,
    size: "100mL / Eau de Parfum",
    image: "/products/tom_ford_orchid_clean.png",
    description: "A rich, deep, and sweet fragrance. Mixes warm spices, dark chocolate, orchid flowers, and amber notes.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Truffle", "Gardenia", "Blackcurrant", "Ylang-Ylang"],
      heart: ["Orchid", "Spices", "Fruity Notes", "Lotus"],
      base: ["Mexican Chocolate", "Patchouli", "Vanille", "Incense", "Amber"]
    }
  },
  {
    id: "ysl-black-opium",
    name: "YSL Black Opium",
    price: 210000,
    size: "90mL / Eau de Parfum",
    image: "/products/ysl_opium_clean.png",
    description: "A very popular sweet perfume for women. Smells of warm coffee, sweet vanilla, and white flowers.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Pear", "Pink Pepper", "Orange Blossom"],
      heart: ["Coffee", "Jasmine", "Bitter Almond", "Licorice"],
      base: ["Vanilla", "Patchouli", "Cashmere Wood", "Cedar"]
    }
  },
  {
    id: "bleu-de-chanel",
    name: "Bleu de Chanel",
    price: 260000,
    size: "100mL / Eau de Parfum",
    image: "/products/bleu_chanel_clean.png",
    description: "A clean, classic fresh-woody perfume. Blends fresh grapefruit with warm cedar wood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
      heart: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
      base: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli"]
    }
  },
  {
    id: "baccarat-rouge",
    name: "MFK Baccarat Rouge 540",
    price: 490000,
    size: "70mL / Eau de Parfum",
    image: "/products/baccarat_rouge_clean.png",
    description: "A very popular and luxurious sweet perfume in Lagos. Smells of warm saffron, amber, jasmine, and fresh cedarwood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnClothes",
    pyramid: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedar"]
    }
  },

  // 2. OIL PERFUME
  {
    id: "creed-aventus-oil",
    name: "Creed Aventus Oil (Surrati)",
    price: 8500,
    size: "10mL / Pure Concentrated Oil",
    image: "/products/creed_aventus_oil_clean.png",
    description: "Concentrated perfume oil roll-on. Long-lasting oil version of Creed Aventus. 100% alcohol-free.",
    type: "SpecialOils",
    olfactoryFamily: "Fresh",
    formulationTier: "ExtraitDeParfum",
    subType: "OilPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Pineapple", "Bergamot"],
      heart: ["Birch Wood", "Jasmine"],
      base: ["Oakmoss", "Ambergris"]
    }
  },
  {
    id: "surrati-golden-sand",
    name: "Surrati Golden Sand Oil",
    price: 7500,
    size: "6mL / Pure Concentrated Oil",
    image: "/products/surrati-golden-sand.jpg",
    description: "A very sweet, popular perfume oil widely used in Nigeria. Smells of warm caramel, vanilla, and soft wood.",
    type: "SpecialOils",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "ExtraitDeParfum",
    subType: "OilPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Sweet Oud", "Bergamot"],
      heart: ["Caramel", "Vanilla Bean"],
      base: ["Ambergris", "White Musk"]
    }
  },
  {
    id: "al-rehab-choco-musk",
    name: "Al-Rehab Choco Musk Oil",
    price: 4500,
    size: "6mL / Pure Concentrated Oil",
    image: "/products/al-rehab-choco-musk.png",
    description: "A viral sweet chocolate roll-on oil. Smells delicious, combining milk chocolate, vanilla, and soft musk.",
    type: "SpecialOils",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "ExtraitDeParfum",
    subType: "OilPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Milk Chocolate", "Cinnamon"],
      heart: ["Vanilla", "Milk", "White Musk"],
      base: ["Sandalwood", "Myrrh"]
    }
  },
  {
    id: "sauvage-oil-impress",
    name: "Dior Sauvage Oil Impression",
    price: 8000,
    size: "10mL / Pure Concentrated Oil",
    image: "/products/dior_sauvage_oil_clean.png",
    description: "Alcohol-free perfume oil version of Dior Sauvage. Offers a long-lasting scent blending fresh bergamot and cedarwood.",
    type: "SpecialOils",
    olfactoryFamily: "Fresh",
    formulationTier: "ExtraitDeParfum",
    subType: "OilPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Calabrian Bergamot", "Sichuan Pepper"],
      heart: ["Lavender", "Vetiver"],
      base: ["Cedarwood", "Patchouli"]
    }
  },

  // 3. BODY SPRAY
  {
    id: "lattafa-yara-spray",
    name: "Lattafa Yara Body Spray",
    price: 9500,
    size: "200mL / Perfumed Body Spray",
    image: "/products/lattafa_yara_clean.png",
    description: "A sweet, long-lasting perfumed body spray. A lovely mix of tropical fruits, vanilla, rose, and musk.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "BodySpray",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Heliotrope", "Orchid", "Tangerine"],
      heart: ["Gourmand Accord", "Tropical Fruits"],
      base: ["Vanilla", "Sandalwood", "Musk"]
    }
  },
  {
    id: "lattafa-asad-spray",
    name: "Lattafa Asad Body Spray",
    price: 9500,
    size: "200mL / Perfumed Body Spray",
    image: "/products/lattafa-asad-spray.jpg",
    description: "Perfumed body spray for men. A warm, spicy scent with pepper, lavender, and cedar wood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeToilette",
    subType: "BodySpray",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Black Pepper", "Pineapple"],
      heart: ["Coffee", "Patchouli", "Iris"],
      base: ["Amber", "Vanilla", "Dry Woods"]
    }
  },
  {
    id: "axe-gold-temptation",
    name: "Axe Gold Temptation Spray",
    price: 4500,
    size: "150mL / Deodorant Body Spray",
    image: "/products/axe-gold-temptation.jpg",
    description: "A popular everyday fresh body spray for men. Blends fresh green apple with sweet chocolate and warm wood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeToilette",
    subType: "BodySpray",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Green Apple", "Basil"],
      heart: ["Chocolate Accord", "Ginger"],
      base: ["Cedarwood", "Amber"]
    }
  },
  {
    id: "nivea-deep-impact",
    name: "Nivea Men Deep Impact Spray",
    price: 5200,
    size: "150mL / Deodorant Body Spray",
    image: "/products/nivea-deep-impact.jpg",
    description: "A refreshing body spray for men. Offers good odor protection with a fresh, masculine woody scent.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "BodySpray",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Frozen Mint", "Bergamot"],
      heart: ["Oceanic Accord", "Sage"],
      base: ["Black Carbon", "Cedarwood"]
    }
  },

  // 4. BODY & FRAGRANCE MIST
  {
    id: "vs-bare-vanilla",
    name: "VS Bare Vanilla Mist",
    price: 18500,
    size: "250mL / Fine Fragrance Mist",
    image: "/products/vs_vanilla_clean.png",
    description: "A very popular light body mist for women in Nigeria. Smells of sweet whipped vanilla and apple blossom.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeToilette",
    subType: "BodyFragranceMist",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Whipped Vanilla"],
      heart: ["Apple Blossom"],
      base: ["Soft Cashmere"]
    }
  },
  {
    id: "bbw-into-the-night",
    name: "BBW Into The Night Mist",
    price: 17500,
    size: "236mL / Fine Fragrance Mist",
    image: "/products/bbw-into-the-night.jpg",
    description: "A long-lasting sweet mist. A beautiful blend of dark berries, sweet jasmine, and warm amber. Great for evenings out.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeToilette",
    subType: "BodyFragranceMist",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Black Raspberry"],
      heart: ["Jasmine Petals"],
      base: ["Patchouli", "Amber Crystals"]
    }
  },
  {
    id: "bbw-gingham-mist",
    name: "BBW Gingham Mist",
    price: 17500,
    size: "236mL / Fine Fragrance Mist",
    image: "/products/bbw_gingham_clean.png",
    description: "A fresh, clean body mist. Features fresh blue flowers, sweet citrus, and soft violet petals.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "BodyFragranceMist",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Blue Freesia", "Sweet Clementine"],
      heart: ["Violet Petals"],
      base: ["Clean Musks"]
    }
  },
  {
    id: "vs-velvet-petals",
    name: "VS Velvet Petals Mist",
    price: 18500,
    size: "250mL / Fine Fragrance Mist",
    image: "/products/vs_vanilla_clean.png",
    description: "A sweet floral body mist. Blends fresh flowers with a warm almond glaze for a soft daily scent.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "BodyFragranceMist",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Lush Blooms"],
      heart: ["Almond Glaze Accord"],
      base: ["Sandalwood"]
    }
  },

  // 5. OUD & ATTAR
  {
    id: "lattafa-khamrah",
    name: "Lattafa Khamrah",
    price: 52000,
    size: "100mL / Eau de Parfum",
    image: "/products/lattafa_khamrah_clean.png",
    description: "A highly popular sweet perfume in Nigeria. A rich blend of sweet dates, cinnamon, vanilla, and warm wood.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeParfum",
    subType: "OudAttar",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      heart: ["Dates Accord", "Praline", "Tuberose", "Lily-of-the-Valley"],
      base: ["Vanilla", "Tonka Bean", "Myrrh", "Amberwood", "Benzoin"]
    }
  },
  {
    id: "badee-al-oud",
    name: "Lattafa Bade'e Al Oud",
    price: 48000,
    size: "100mL / Eau de Parfum",
    image: "/products/badee_al_oud_clean.png",
    description: "Oud for Glory. A powerful, rich woody oud scent with saffron, lavender, and incense.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeParfum",
    subType: "OudAttar",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Saffron", "Nutmeg", "Lavender"],
      heart: ["Agarwood Oud", "Patchouli"],
      base: ["Oud", "Musk", "Marjoram"]
    }
  },
  {
    id: "arabian-oud-kalemat",
    name: "Arabian Oud Kalemat",
    price: 145000,
    size: "100mL / Eau de Parfum",
    image: "/products/kalemat_clean.png",
    description: "A famous luxury Middle Eastern perfume. A rich, sweet amber-wood scent containing honey, rosemary, and warm amber.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeParfum",
    subType: "OudAttar",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Blueberry", "Anise"],
      heart: ["Rosemary", "Cashmere Wood", "Floral Notes"],
      base: ["Sweet Honey", "Ambergris", "Musk"]
    }
  },
  {
    id: "rasasi-shuhrah",
    name: "Rasasi Shuhrah Pour Homme",
    price: 55000,
    size: "90mL / Eau de Parfum",
    image: "/products/rasasi-shuhrah.jpg",
    description: "Famous for lasting a very long time in the hot weather. A strong blend of rose, leather, wood, and tobacco notes.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeParfum",
    subType: "OudAttar",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Tomato Leaf", "Freesia", "Rose"],
      heart: ["Rose", "Sandalwood", "Cedar", "Jasmine"],
      base: ["Leather", "Oud", "Musk", "Oakmoss", "Ambergris"]
    }
  },

  // 6. TOILET & BATHROOM SCENTS
  {
    id: "glade-lavender",
    name: "Glade Air Freshener (Lavender)",
    price: 3500,
    size: "300mL / Aerosol Room Spray",
    image: "/products/glade_lavender_clean.png",
    description: "Eliminates odors and freshens the air with a soothing lavender field scent. Perfect for toilets and bathrooms.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "DeodorantSpray",
    utility: "ToiletBathroom",
    pyramid: {
      top: ["Fresh Lavender"],
      heart: ["Soft Jasmine"],
      base: ["Clean Powdery Notes"]
    }
  },
  {
    id: "airwick-automatic",
    name: "Air Wick Freshmatic Auto",
    price: 12500,
    size: "250mL / Automatic Device & Refill",
    image: "/products/airwick_auto_clean.png",
    description: "Automatic aerosol spray device that releases continuous fresh fragrance in the bathroom at timed intervals.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DeodorantSpray",
    utility: "ToiletBathroom",
    pyramid: {
      top: ["Fresh Lavender"],
      heart: ["Chamomile Blossom"],
      base: ["White Wood Accord"]
    }
  },
  {
    id: "harpic-rim-block",
    name: "Harpic Active Fresh Rim Block",
    price: 2200,
    size: "35g / Toilet Bowl Rim Hanger",
    image: "/products/harpic_block_clean.png",
    description: "Hangs on the toilet rim to clean and release a pleasant lavender fragrance with every flush.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DeodorantSpray",
    utility: "ToiletBathroom",
    pyramid: {
      top: ["Clean Eucalyptus"],
      heart: ["Soothing Lavender"],
      base: ["Sanitary Fresh Accord"]
    }
  },
  {
    id: "febreze-linen-sky",
    name: "Febreze Air Effects (Linen & Sky)",
    price: 5500,
    size: "250mL / Odor Eliminator Spray",
    image: "/products/febreze_linen_clean.png",
    description: "Instantly washes away bad odors in the bathroom, leaving behind a light, fresh scent of clean laundry.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DeodorantSpray",
    utility: "ToiletBathroom",
    pyramid: {
      top: ["Fresh Air Accord"],
      heart: ["Clean Linen"],
      base: ["Soft Amber"]
    }
  },

  // 7. CAR FRESHENERS
  {
    id: "areon-car-gold",
    name: "Areon Gel Car Scent (Gold)",
    price: 5500,
    size: "80g / Premium Gel Diffuser",
    image: "/products/areon_car_gold_clean.png",
    description: "Extremely popular gel car air freshener in Nigeria. Releases a sweet, premium gold perfume scent into your vehicle.",
    type: "CarScentBrand",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "InTheCar",
    pyramid: {
      top: ["Bergamot", "Citrus"],
      heart: ["Amber", "Vanilla"],
      base: ["Oakmoss", "Patchouli"]
    }
  },
  {
    id: "little-trees-black-ice",
    name: "Little Trees (Black Ice)",
    price: 2000,
    size: "1 Hanging Card / Tree Freshener",
    image: "/products/little_trees_black_ice_clean.png",
    description: "The classic hanging tree air freshener. Black Ice scent offers a fresh, masculine cologne fragrance.",
    type: "CarScentBrand",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "InTheCar",
    pyramid: {
      top: ["Bergamot", "Lemon"],
      heart: ["Lavender", "Marine Accord"],
      base: ["Sandalwood", "Amber"]
    }
  },
  {
    id: "california-scents-cherry",
    name: "California Scents (Coronado Cherry)",
    price: 4800,
    size: "42g / Spillproof Can",
    image: "/products/california_scents_cherry_clean.png",
    description: "A very sweet cherry scented organic car air freshener can. Features an adjustable lid for scent strength control.",
    type: "CarScentBrand",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "InTheCar",
    pyramid: {
      top: ["Wild Cherry", "Almond"],
      heart: ["Red Berries"],
      base: ["Sweet Syrup"]
    }
  },
  {
    id: "areon-black-crystal",
    name: "Areon Liquid Car Perfume",
    price: 6500,
    size: "50mL / Liquid Spray & Card",
    image: "/products/areon_black_crystal_clean.png",
    description: "Premium liquid car air freshener spray with hanging absorbent card. Black Crystal scent offers a mysterious, woody cologne feel.",
    type: "CarScentBrand",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "InTheCar",
    pyramid: {
      top: ["Citrus", "Pineapple"],
      heart: ["Lavender", "Jasmine"],
      base: ["Cedarwood", "Musk"]
    }
  },

  // 8. HOME FRAGRANCES
  {
    id: "miniso-diffuser",
    name: "Miniso Scented Reed Diffuser",
    price: 6500,
    size: "100mL / Reed Diffuser Set",
    image: "/products/miniso_diffuser_clean.png",
    description: "An elegant glass bottle reed diffuser that continuous releases a soothing lavender scent. Perfect for living rooms.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "ForHome",
    pyramid: {
      top: ["Fresh Lavender"],
      heart: ["Soft Jasmine"],
      base: ["Warm Musk"]
    }
  },
  {
    id: "glade-candle-vanilla",
    name: "Glade Scented Candle (Vanilla)",
    price: 4800,
    size: "120g / Glass Jar Candle",
    image: "/products/glade_candle_clean.png",
    description: "Scented candle in a glass jar. Fills the room with a warm, sweet vanilla blossom aroma for up to 30 hours.",
    type: "PremiumPerfumes",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "ForHome",
    pyramid: {
      top: ["Sweet Vanilla Orchid"],
      heart: ["Creamy Caramel"],
      base: ["Soft Sandalwood"]
    }
  },
  {
    id: "airwick-diffuser-rose",
    name: "Air Wick Reed Diffuser (Rose)",
    price: 7500,
    size: "50mL / Natural Rattan Reeds",
    image: "/products/airwick_diffuser_clean.png",
    description: "Uses natural rattan reeds to gently diffuse the romantic scent of fresh cut red roses throughout your home.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "ForHome",
    pyramid: {
      top: ["Green Leafy Notes"],
      heart: ["Fresh Red Rose"],
      base: ["Dewy Grass Accord"]
    }
  },

  // 9. KITCHEN FRESHENERS
  {
    id: "glade-lemon",
    name: "Glade Air Freshener (Lemon)",
    price: 3500,
    size: "300mL / Aerosol Room Spray",
    image: "/products/glade_lemon_clean.png",
    description: "Quickly neutralizes strong cooking odors in the kitchen with a fresh, clean lemon citrus scent.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "KitchenFreshness",
    pyramid: {
      top: ["Fresh Lemon", "Lime"],
      heart: ["Lemongrass"],
      base: ["Clean Musks"]
    }
  },
  {
    id: "airwick-orange",
    name: "Air Wick Spray (Orange)",
    price: 3800,
    size: "300mL / Aerosol Room Spray",
    image: "/products/airwick_orange_clean.png",
    description: "Fills your kitchen with the refreshing, uplifting scent of freshly squeezed oranges and sweet grapefruit.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "KitchenFreshness",
    pyramid: {
      top: ["Fresh Orange", "Mandarin"],
      heart: ["Grapefruit Bloom"],
      base: ["Green Leafy Accord"]
    }
  },
  {
    id: "febreze-kitchen",
    name: "Febreze Kitchen Odor Clear",
    price: 5500,
    size: "250mL / Odor Eliminator Spray",
    image: "/products/febreze_kitchen_clean.png",
    description: "Specially formulated to clean away heavy cooking odors like fish, onion, and garlic from your kitchen air.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Fresh",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "KitchenFreshness",
    pyramid: {
      top: ["Zesty Citrus", "Green Apple"],
      heart: ["Fresh Ginger", "Herbal Accord"],
      base: ["Odor Clean Molecule"]
    }
  },

  // 10. TPS SIGNATURE SCENTS
  {
    id: "tps-signature-oud",
    name: "Maison Signature Oud",
    price: 95000,
    size: "100mL / Eau de Parfum",
    image: "/products/tps_signature_oud_clean.png",
    description: "Our signature masterpiece. A royal blend of Cambodian oud, sweet Turkish rose petals, patchouli, and warm amber.",
    type: "PremiumPerfumes",
    olfactoryFamily: "Woody",
    formulationTier: "EauDeParfum",
    subType: "DesignerPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["Turkish Rose", "Saffron"],
      heart: ["Cambodian Oud", "Patchouli"],
      base: ["Warm Amber", "Sandalwood"]
    }
  },
  {
    id: "tps-velvet-vanilla-oil",
    name: "Velvet Vanilla Oil",
    price: 12000,
    size: "12mL / Pure Concentrated Oil",
    image: "/products/tps_velvet_vanilla_oil_clean.png",
    description: "A concentrated roll-on perfume oil. A luxurious formulation of sweet white vanilla, caramel glaze, and cashmere musk.",
    type: "SpecialOils",
    olfactoryFamily: "AmberGourmand",
    formulationTier: "ExtraitDeParfum",
    subType: "OilPerfume",
    utility: "OnHumanBody",
    pyramid: {
      top: ["White Vanilla", "Whipped Cream"],
      heart: ["Caramel Glaze"],
      base: ["Cashmere Musk"]
    }
  },
  {
    id: "tps-blossom-breeze",
    name: "Blossom Breeze Diffuser",
    price: 15000,
    size: "150mL / Luxury Reed Set",
    image: "/products/tps_blossom_breeze_clean.png",
    description: "Luxury glass reed diffuser. Continuous diffusion of fresh citrus blossoms, soft peony, and white tea leaves.",
    type: "SpecialOils",
    olfactoryFamily: "Floral",
    formulationTier: "EauDeToilette",
    subType: "DesignerPerfume",
    utility: "ForHome",
    pyramid: {
      top: ["Citrus Blossom", "White Tea"],
      heart: ["Peony Petals", "Jasmine"],
      base: ["Soft Cedarwood"]
    }
  }
];

export function usePerfumeCatalog() {
  const { catalogItems } = useApp();

  const [selectedFamilies, setSelectedFamilies] = useState<OlfactoryFamily[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<FormulationTier[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [showPyramid, setShowPyramid] = useState<boolean>(false);

  // Navigational matrix filters
  const [selectedSubType, setSelectedSubType] = useState<ProductSubType | null>(null);
  const [selectedUtility, setSelectedUtility] = useState<SpatialUtility | null>(null);

  // Combine static products with live active products from Admin state
  const allProducts = useMemo(() => {
    const liveAdminProducts: PerfumeProduct[] = (catalogItems || [])
      .filter((item) => item.status === "Active")
      .map((item) => {
        let type: ProductType = "PremiumPerfumes";
        let subType: ProductSubType = "DesignerPerfume";
        let utility: SpatialUtility = item.spatialUtility || "OnHumanBody";

        if (item.category === "Oil Perfumes" || item.category === "Oud & Attar") {
          type = "SpecialOils";
          subType = item.category === "Oud & Attar" ? "OudAttar" : "OilPerfume";
        } else if (item.category === "Car Scents") {
          type = "CarScentBrand";
          utility = "InTheCar";
        } else if (item.category === "Body Sprays" || item.category === "Deodorant Sprays" || item.category === "Body Mists") {
          type = "PremiumPerfumes";
          subType = item.category === "Body Mists" ? "BodyFragranceMist" : "BodySpray";
        }

        let family: OlfactoryFamily = "Fresh";
        if (item.olfactoryFamily === "Floral") family = "Floral";
        if (item.olfactoryFamily === "Woody") family = "Woody";
        if (item.olfactoryFamily === "Amber & Gourmand" || (item.olfactoryFamily as string) === "AmberGourmand") family = "AmberGourmand";

        let tier: FormulationTier = "EauDeParfum";
        if (item.formulation === "Extrait de Parfum" || item.formulation === "Pure Perfume Oil") tier = "ExtraitDeParfum";
        if (item.formulation === "Eau de Toilette" || item.formulation === "Concentrated Spray") tier = "EauDeToilette";

        return {
          id: item.id,
          name: item.title,
          price: item.priceNGN,
          size: `${item.formulation}`,
          image: item.imageUrl || "/products/creed_aventus_clean.png",
          description: item.isBespokeOneOfOne
            ? "Bespoke 1-of-1 single batch custom creation."
            : "Luxury curated fragrance with long-lasting scent longevity.",
          type,
          olfactoryFamily: family,
          formulationTier: tier,
          subType,
          utility,
          pyramid: {
            top: ["Bergamot", "Pink Pepper"],
            heart: ["Rose", "Jasmine"],
            base: ["Amber", "Musk", "Oud"]
          }
        };
      });

    const liveIds = new Set(liveAdminProducts.map((p) => p.id));
    const uniqueStatic = staticProducts.filter((p) => !liveIds.has(p.id));

    return [...liveAdminProducts, ...uniqueStatic];
  }, [catalogItems]);

  const toggleFamily = (family: OlfactoryFamily) => {
    setSelectedFamilies((prev) =>
      prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]
    );
  };

  const toggleTier = (tier: FormulationTier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const toggleType = (type: ProductType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectSubType = (subType: ProductSubType | null) => {
    setSelectedSubType(subType);
    setSelectedUtility(null); // Mutually exclusive view curation
  };

  const selectUtility = (utility: SpatialUtility | null) => {
    setSelectedUtility(utility);
    setSelectedSubType(null); // Mutually exclusive view curation
  };

  const clearFilters = () => {
    setSelectedFamilies([]);
    setSelectedTiers([]);
    setSelectedTypes([]);
    setSelectedSubType(null);
    setSelectedUtility(null);
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Dimension filters
      const matchFamily = selectedFamilies.length === 0 || selectedFamilies.includes(product.olfactoryFamily);
      const matchTier = selectedTiers.length === 0 || selectedTiers.includes(product.formulationTier);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(product.type);

      // Navigational Subtype filter
      const matchSubType = selectedSubType === null || product.subType === selectedSubType;

      // Navigational Spatial filter matching instructions
      let matchUtility = true;
      if (selectedUtility !== null) {
        if (selectedUtility === "OnHumanBody") {
          // On Human Body curates: Body sprays, mists, deodorants, and pure oil perfumes
          matchUtility = ["BodySpray", "BodyFragranceMist", "DeodorantSpray", "OilPerfume"].includes(product.subType);
        } else if (selectedUtility === "OnClothes") {
          // On Clothes curates: Standard designer perfumes, Eau de Toilettes, and fabric fresheners
          matchUtility = product.subType === "DesignerPerfume" || product.formulationTier === "EauDeToilette";
        } else {
          // Home, Car, Kitchen, Toilet match directly by spatial tag
          matchUtility = product.utility === selectedUtility;
        }
      }

      return matchFamily && matchTier && matchType && matchSubType && matchUtility;
    });
  }, [allProducts, selectedFamilies, selectedTiers, selectedTypes, selectedSubType, selectedUtility]);

  return {
    filteredProducts,
    selectedFamilies,
    selectedTiers,
    selectedTypes,
    selectedSubType,
    selectedUtility,
    toggleFamily,
    toggleTier,
    toggleType,
    selectSubType,
    selectUtility,
    clearFilters,
    showPyramid,
    setShowPyramid,
  };
}
