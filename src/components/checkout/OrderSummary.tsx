"use client";

import { Badge, Card, CardContent, CardHeader } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/stores";
import { motion } from "framer-motion";
import React from "react";

const OrderSummary: React.FC = () => {
  const { cart } = useCart();

  // Configuration des saveurs
  const flavorConfig = {
    strawberry: { emoji: "🍓", color: "text-pink-600", bg: "bg-pink-50" },
    blueberry: { emoji: "🫐", color: "text-blue-600", bg: "bg-blue-50" },
    apple: { emoji: "🍏", color: "text-green-600", bg: "bg-green-50" },
  };

  // Calculer les valeurs dérivées
  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.2; // TVA 20%
  const shipping = subtotal >= 50 ? 0 : 5.99; // Livraison gratuite à partir de 50€
  const total = subtotal + tax + shipping;
  const totalSavings = 0; // Simplifié car pas de prix originaux

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-800">
          Récapitulatif de commande
        </h3>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Items */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">
            Articles commandés ({cart.totalItems})
          </h4>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.items.map((item) => {
              const flavor = flavorConfig[
                item.flavor.toLowerCase() as keyof typeof flavorConfig
              ] || {
                emoji: "🍭",
                color: "text-gray-600",
                bg: "bg-gray-50",
              };

              return (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Product Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg ${flavor.bg} flex items-center justify-center text-lg`}
                  >
                    {flavor.emoji}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-800 text-sm truncate">
                      {item.name}
                    </h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="secondary"
                        size="sm"
                        className={`${flavor.color} border-current text-xs`}
                      >
                        {item.flavor}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Qté: {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-medium text-gray-800 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {totalSavings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Économies</span>
              <span className="font-medium">-{formatPrice(totalSavings)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Livraison</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Gratuite</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA (20%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total à payer</span>
            <motion.span
              key={total}
              className="text-pink-600"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatPrice(total)}
            </motion.span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-lg">🚚</span>
            <div>
              <h4 className="font-medium text-blue-800 text-sm">
                Livraison estimée
              </h4>
              <p className="text-blue-600 text-sm">
                {shipping === 0 ? "3-5 jours ouvrés" : "24-48h"}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Suivi de commande par email
              </p>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-500">
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🔒</span>
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">↩️</span>
            <span>Retour gratuit</span>
          </div>
        </div>

        {/* Loyalty Points Preview */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Points de fidélité
              </p>
              <p className="text-xs text-gray-600">
                Vous gagnerez {Math.floor(total / 100)} points
              </p>
            </div>
            <Badge variant="info" size="sm">
              +{Math.floor(total / 100)} 🎁
            </Badge>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Une question sur votre commande ?
          </p>
          <button className="text-xs text-pink-600 hover:text-pink-700 font-medium">
            Contacter le support 💬
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export { OrderSummary };
