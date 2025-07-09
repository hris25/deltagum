"use client";

import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { PriceTier } from "@/types";
import { motion } from "framer-motion";

interface QuantitySelectorProps {
  priceTiers: PriceTier[];
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
  className?: string;
}

export function QuantitySelector({
  priceTiers,
  selectedQuantity,
  onQuantityChange,
  className = "",
}: QuantitySelectorProps) {
  // Trier les prix par quantité
  const sortedTiers = [...priceTiers].sort((a, b) => a.quantity - b.quantity);

  // Calculer les économies par rapport au prix unitaire
  const basePrice = sortedTiers[0]?.price || 0;

  const calculateSavings = (tier: PriceTier) => {
    const unitPrice = basePrice;
    const totalAtUnitPrice = unitPrice * tier.quantity;
    const savings = totalAtUnitPrice - tier.price;
    const savingsPercent = Math.round((savings / totalAtUnitPrice) * 100);
    return { savings, savingsPercent };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choisissez votre quantité
        </h3>
        <p className="text-sm text-gray-600">
          Plus vous achetez, plus vous économisez !
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-md">
          {sortedTiers.map((tier) => {
            const { savings, savingsPercent } = calculateSavings(tier);
            const isSelected = selectedQuantity === tier.quantity;
            const isPopular = tier.quantity === 6 || tier.quantity === 5; // 6 pour bonbons, 5 pour cookies

            return (
              <motion.div
                key={tier.id}
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPopular && (
                  <Badge
                    variant="primary"
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 text-xs"
                  >
                    Populaire
                  </Badge>
                )}

                <Button
                  variant={isSelected ? "primary" : "outline"}
                  size="lg"
                  onClick={() => onQuantityChange(tier.quantity)}
                  className={`w-full h-32 p-4 flex flex-col items-center justify-center space-y-2 ${
                    isSelected
                      ? "ring-2 ring-pink-500 ring-offset-2"
                      : "hover:border-pink-300"
                  }`}
                >
                  <div className="text-2xl font-bold">{tier.quantity}</div>

                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${
                        isSelected ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {formatPrice(tier.price)}
                    </div>

                    {tier.quantity > 1 && (
                      <div
                        className={`text-xs ${
                          isSelected ? "text-pink-100" : "text-gray-500"
                        }`}
                      >
                        {formatPrice(tier.price / tier.quantity)} / unité
                      </div>
                    )}
                  </div>

                  {savings > 0 && (
                    <div
                      className={`text-xs font-medium ${
                        isSelected ? "text-pink-100" : "text-green-600"
                      }`}
                    >
                      Économisez {savingsPercent}%
                    </div>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Affichage du prix sélectionné */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Prix total</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatPrice(
            sortedTiers.find((t) => t.quantity === selectedQuantity)?.price || 0
          )}
        </div>
        {selectedQuantity > 1 && (
          <div className="text-sm text-gray-500">
            Soit{" "}
            {formatPrice(
              (sortedTiers.find((t) => t.quantity === selectedQuantity)
                ?.price || 0) / selectedQuantity
            )}{" "}
            par unité
          </div>
        )}
      </div>
    </div>
  );
}
