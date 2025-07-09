"use client";

import { Badge } from "@/components/ui";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { translateFlavor } from "@/lib/flavors";
import type { ProductVariant } from "@/types";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FlavorSlider } from "./FlavorSlider";

interface FlavorSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
}

const flavorConfig = {
  STRAWBERRY: {
    name: "Fraise",
    emoji: "🍓",

    color: "from-pink-400 to-red-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    selectedBorder: "border-pink-500",
    textColor: "text-pink-700",
  },
  BLUEBERRY: {
    name: "Myrtille",
    emoji: "🫐",

    color: "from-blue-400 to-purple-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    selectedBorder: "border-blue-500",
    textColor: "text-blue-700",
  },
  APPLE: {
    name: "Pomme",
    emoji: "🍏",

    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    selectedBorder: "border-green-500",
    textColor: "text-green-700",
  },
};

const FlavorSelector: React.FC<FlavorSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantSelect,
}) => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  // Détecter la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const getFlavorConfig = (flavor: string) => {
    return (
      flavorConfig[flavor as keyof typeof flavorConfig] || {
        name: translateFlavor(flavor),
        emoji: "🍭",
        color: "from-gray-400 to-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-300",
        selectedBorder: "border-gray-500",
        textColor: "text-gray-700",
      }
    );
  };

  // Si on est sur mobile ou tablette, utiliser le slider
  if (screenSize === "mobile" || screenSize === "tablet") {
    return (
      <FlavorSlider
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantSelect={onVariantSelect}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur horizontal des saveurs */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {variants.map((variant) => {
          const config = getFlavorConfig(variant.flavor);
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock === 0;

          return (
            <motion.div
              key={variant.id}
              variants={staggerItem}
              whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
              whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
            >
              <div
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center
                  ${
                    isSelected
                      ? `${config.selectedBorder} ${config.bgColor} shadow-lg`
                      : `${config.borderColor} bg-white hover:${config.bgColor}`
                  }
                  ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={() => !isOutOfStock && onVariantSelect(variant)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}

                {/* Out of Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute -top-2 -left-2">
                    <Badge variant="danger" size="sm">
                      Épuisé
                    </Badge>
                  </div>
                )}

                {/* Contenu simplifié */}
                <div className="space-y-3">
                  {/* Nom de la saveur */}
                  <h5 className={`font-bold text-lg ${config.textColor}`}>
                    {config.name}
                  </h5>

                  {/* Indicateur de stock */}
                  <div className="flex items-center justify-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        variant.stock > 10
                          ? "bg-green-500"
                          : variant.stock > 0
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {variant.stock > 10
                        ? "En stock"
                        : variant.stock > 0
                        ? `${variant.stock} restant${
                            variant.stock > 1 ? "s" : ""
                          }`
                        : "Épuisé"}
                    </span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {!isOutOfStock && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${config.color} opacity-0 pointer-events-none`}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* No Variants Message */}
      {variants.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-2">🍭</div>
          <p className="text-gray-500">
            Aucune saveur disponible pour ce produit
          </p>
        </motion.div>
      )}
    </div>
  );
};

export { FlavorSelector };
