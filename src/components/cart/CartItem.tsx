"use client";

import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface CartItemProps {
  item: CartItemType;
  onQuantityUpdate: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityUpdate,
  onRemove,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0 || newQuantity > 10) return;

    setIsUpdating(true);
    try {
      await onQuantityUpdate(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  // Configuration des saveurs
  const flavorConfig = {
    strawberry: { emoji: "🍓", color: "text-pink-600", bg: "bg-pink-50" },
    blueberry: { emoji: "🫐", color: "text-blue-600", bg: "bg-blue-50" },
    apple: { emoji: "🍏", color: "text-green-600", bg: "bg-green-50" },
  };

  const flavor = flavorConfig[
    item.flavor.toLowerCase() as keyof typeof flavorConfig
  ] || {
    emoji: "🍭",
    color: "text-gray-600",
    bg: "bg-gray-50",
  };

  const subtotal = item.price * item.quantity;

  return (
    <motion.div
      className="p-6 hover:bg-gray-50 transition-colors duration-200"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image/Icon */}
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className={`w-16 h-16 rounded-lg ${flavor.bg} flex items-center justify-center text-2xl`}
          >
            {flavor.emoji}
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 truncate">
                {item.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  size="sm"
                  className={`${flavor.color} border-current`}
                >
                  {flavor.emoji} {item.flavor}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                Délicieux bonbons {item.flavor}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
            >
              <span className="sr-only">Supprimer</span>✕
            </Button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Quantité :</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>

                <motion.span
                  key={item.quantity}
                  className="w-8 text-center font-semibold"
                  initial={{ scale: 1.2, color: "#ec4899" }}
                  animate={{ scale: 1, color: "#374151" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.quantity}
                </motion.span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= 10}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Price Info */}
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {formatPrice(item.price)} × {item.quantity}
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <motion.div
          className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            🍭
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export { CartItem };
