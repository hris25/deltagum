"use client";

import { Button } from "@/components/ui";
import { useCart } from "@/stores";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function CancelPage() {
  const { addItem } = useCart();

  useEffect(() => {
    // Restaurer le panier si l'utilisateur annule le paiement
    const pendingOrder = localStorage.getItem("deltagum_pending_order");
    if (pendingOrder) {
      try {
        const { cartItems } = JSON.parse(pendingOrder);
        if (cartItems && Array.isArray(cartItems)) {
          // Restaurer chaque article dans le panier
          cartItems.forEach((item: any) => {
            addItem({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              image: item.image,
              flavor: item.flavor,
              color: item.color,
            });
          });
        }
        // Nettoyer les données après restauration
        localStorage.removeItem("deltagum_pending_order");
      } catch (error) {
        console.error("Erreur lors de la restauration du panier:", error);
      }
    }
  }, [addItem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animation d'annulation */}
          <motion.div
            className="text-8xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            ❌
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Paiement annulé
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Votre paiement a été annulé. Aucun montant n'a été débité de votre
            compte.
          </motion.p>

          {/* Message d'information */}
          <motion.div
            className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Vos articles sont toujours dans votre panier
            </h3>
            <p className="text-orange-700">
              Vous pouvez reprendre votre commande à tout moment. Vos délicieux
              bonbons Deltagum vous attendent !
            </p>
          </motion.div>

          {/* Raisons possibles */}
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 mb-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Pourquoi reprendre votre commande ?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🍓</span>
                <span className="text-gray-700">
                  Saveurs naturelles de fraise, myrtille et pomme
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚚</span>
                <span className="text-gray-700">
                  Livraison gratuite dès 25€ d'achat
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                <span className="text-gray-700">
                  Paiement 100% sécurisé par Stripe
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">⭐</span>
                <span className="text-gray-700">
                  Satisfaction garantie ou remboursé
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/cart">
              <Button variant="primary" size="lg">
                <span className="flex items-center">
                  <span className="mr-2">🛒</span>
                  Reprendre ma commande
                </span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Continuer mes achats
              </Button>
            </Link>
          </motion.div>

          {/* Support */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p className="text-gray-600 mb-4">
              Besoin d'aide ? Notre équipe est là pour vous accompagner.
            </p>
            <Link href="/#contact">
              <Button variant="ghost" size="sm">
                <span className="flex items-center">
                  <span className="mr-2">💬</span>
                  Nous contacter
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
