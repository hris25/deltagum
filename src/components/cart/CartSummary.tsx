"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCart, useCustomer, useNotifications } from "@/stores";
import { motion } from "framer-motion";
import React, { useState } from "react";

const CartSummary: React.FC = () => {
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { addNotification } = useNotifications();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculer les économies totales (simplifié car pas de prix originaux dans CartItem)
  const totalSavings = 0;

  // Calculer les points de fidélité
  const loyaltyPoints = Math.floor(cart.totalAmount / 100); // 1 point par euro

  // Calculer les valeurs dérivées
  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.2; // TVA 20%
  const shipping = subtotal >= 50 ? 0 : 5.99; // Livraison gratuite à partir de 50€
  const total = subtotal + tax + shipping;

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      addNotification({
        type: "error",
        title: "Code promo",
        message: "Veuillez saisir un code promo",
      });
      return;
    }

    setIsApplyingPromo(true);
    try {
      // Simulation d'application de code promo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Codes promo de démonstration
      const validCodes = {
        WELCOME10: { discount: 0.1, message: "10% de réduction appliquée !" },
        SWEET20: { discount: 0.2, message: "20% de réduction appliquée !" },
        FIRST5: { discount: 0.05, message: "5% de réduction appliquée !" },
      };

      const code =
        validCodes[promoCode.toUpperCase() as keyof typeof validCodes];

      if (code) {
        addNotification({
          type: "success",
          title: "Code promo",
          message: code.message,
        });
        // Ici on appliquerait la réduction dans le store
      } else {
        addNotification({
          type: "error",
          title: "Code promo",
          message: "Code promo invalide ou expiré",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Code promo",
        message: "Erreur lors de l'application du code promo",
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      addNotification({
        type: "error",
        title: "Panier",
        message: "Votre panier est vide",
      });
      return;
    }

    // Rediriger vers le checkout
    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      addNotification({
        type: "info",
        title: "Commande",
        message: "Redirection vers le paiement...",
      });
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-800">
          Récapitulatif de commande
        </h3>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Sous-total ({cart.totalItems} article
              {cart.totalItems > 1 ? "s" : ""})
            </span>
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
              <span className="text-gray-600">TVA</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
          )}

          <hr className="border-gray-200" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
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

        {/* Promo Code */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Code promo
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Entrez votre code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleApplyPromoCode()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyPromoCode}
              disabled={isApplyingPromo || !promoCode.trim()}
            >
              {isApplyingPromo ? "..." : "Appliquer"}
            </Button>
          </div>

          {/* Promo Code Suggestions */}
          <div className="text-xs text-gray-500">
            <p>Codes de démonstration :</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {["WELCOME10", "SWEET20", "FIRST5"].map((code) => (
                <button
                  key={code}
                  onClick={() => setPromoCode(code)}
                  className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loyalty Points */}
        {customer && (
          <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Points de fidélité
                </p>
                <p className="text-xs text-gray-600">
                  Vous gagnerez {loyaltyPoints} points
                </p>
              </div>
              <Badge variant="info" size="sm">
                +{loyaltyPoints} 🎁
              </Badge>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleCheckout}
          disabled={cart.items.length === 0}
          fullWidth
          className="text-lg py-4"
        >
          <span className="mr-2">💳</span>
          Procéder au paiement
        </Button>

        {/* Security Badges */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-500">
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🔒</span>
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg mb-1">🚚</span>
            <span>Livraison 24h</span>
          </div>
        </div>

        {/* Free Shipping Threshold */}
        {shipping > 0 && (
          <motion.div
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-blue-700">
              <p className="font-medium">🚚 Livraison gratuite</p>
              <p>
                Ajoutez {formatPrice(5000 - subtotal)} pour la livraison
                gratuite !
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export { CartSummary };
