"use client";

import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import React from "react";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
}) => {
  // Le prix est sur le produit, pas sur les variants
  const currentPrice = Number(product.price);

  // Pas de promotions pour l'instant (pas dans le schéma)
  const hasPromotion = false;

  // Vérifier la disponibilité
  const totalStock =
    product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;

  // Compter les saveurs disponibles
  const availableFlavors =
    product.variants?.filter((v) => v.stock > 0).length || 0;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className={`
          cursor-pointer transition-all duration-300 h-full
          ${
            isSelected
              ? "ring-2 ring-pink-500 shadow-xl bg-gradient-to-br from-pink-50 to-orange-50"
              : "hover:shadow-lg border-gray-200"
          }
          ${isOutOfStock ? "opacity-60" : ""}
        `}
        onClick={onSelect}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="text-white text-sm font-bold">✓</span>
          </motion.div>
        )}

        <CardHeader className="text-center pb-4">
          {/* Product Image */}
          <motion.div
            className="relative w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden"
            animate={
              isSelected
                ? {
                    rotate: [0, -2, 2, -1, 1, 0],
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.image || "/img/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/img/placeholder.svg";
              }}
            />
            {/* Badge CBD */}
            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              🌿
            </div>
            {/* Badge 18+ */}
            <div className="absolute bottom-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              18+
            </div>
          </motion.div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {/* Badge CBD obligatoire */}
            <Badge variant="success" size="sm">
              🌿 CBD
            </Badge>
            {hasPromotion && (
              <Badge variant="success" size="sm">
                Promotion !
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="danger" size="sm">
                Épuisé
              </Badge>
            )}
            {/* Badge âge */}
            <Badge variant="warning" size="sm">
              🔞 18+
            </Badge>
          </div>

          {/* Product Name */}
          <h3
            className={`text-xl font-bold mb-2 ${
              isSelected ? "text-pink-700" : "text-gray-800"
            }`}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="text-center">
            <span className="text-2xl font-bold text-pink-600">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Product Description */}
          <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
            {product.description}
          </p>

          {/* Avertissement CBD */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
            <p className="text-xs text-yellow-800 text-center">
              ⚠️ <strong>Produit CBD</strong> - Réservé aux adultes
              <br />
              <span className="text-yellow-600">
                Ne pas conduire après consommation
              </span>
            </p>
          </div>

          {/* Product Stats */}
          <div className="space-y-3">
            {/* Available Flavors */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Saveurs disponibles :</span>
              <span
                className={`font-semibold ${
                  availableFlavors > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {availableFlavors} / {product.variants?.length || 0}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Stock total :</span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    totalStock > 20
                      ? "bg-green-500"
                      : totalStock > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    totalStock > 0 ? "text-gray-700" : "text-red-600"
                  }`}
                >
                  {totalStock > 0 ? `${totalStock} unités` : "Épuisé"}
                </span>
              </div>
            </div>

            {/* Flavor Preview */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2">
                <span className="text-xs text-gray-500 block mb-2">
                  Saveurs :
                </span>
                <div className="flex justify-center space-x-1">
                  {product.variants.slice(0, 3).map((variant, index) => {
                    const flavorEmoji =
                      {
                        strawberry: "🍓",
                        blueberry: "🫐",
                        apple: "🍏",
                      }[variant.flavor.toLowerCase()] || "🍭";

                    return (
                      <motion.span
                        key={variant.id}
                        className={`text-lg ${
                          variant.stock === 0 ? "opacity-30" : ""
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {flavorEmoji}
                      </motion.span>
                    );
                  })}
                  {product.variants.length > 3 && (
                    <span className="text-xs text-gray-400 self-center">
                      +{product.variants.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selection Prompt */}
          <motion.div
            className={`mt-4 text-center text-sm font-medium transition-all duration-300 ${
              isSelected ? "text-pink-600" : "text-gray-400"
            }`}
            animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isSelected ? "✨ Sélectionné" : "Cliquez pour sélectionner"}
          </motion.div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-pink-500/5 to-orange-500/5 opacity-0 pointer-events-none"
          whileHover={{ opacity: isOutOfStock ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </Card>
    </motion.div>
  );
};

export { ProductCard };
