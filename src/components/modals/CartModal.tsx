"use client";

import { Button, Modal, ModalBody, ModalFooter } from "@/components/ui";
import { cn, formatPrice } from "@/lib/utils";
import { useAuth, useCart, useCheckoutModal, useNotifications } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeItem, clearCart } = useCart();
  const { openModal } = useCheckoutModal();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const items = cart.items;
  const total = cart.totalAmount;
  const totalItems = cart.totalItems;
  const shippingThreshold = 25; // Livraison gratuite à partir de 25€
  const shippingCost = total >= shippingThreshold ? 0 : 4.9;
  const finalTotal = total + shippingCost;

  const handleCheckout = async () => {
    if (isProcessing) return; // Éviter les clics multiples

    // Vérifier l'authentification
    if (!isAuthenticated) {
      addNotification({
        type: "warning",
        title: "🔒 Connexion requise",
        message:
          "Vous devez vous connecter pour passer commande. Redirection en cours...",
      });

      onClose(); // Fermer le modal du panier

      // Rediriger vers la page d'authentification après un court délai
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
      return;
    }

    try {
      if (items.length === 0) {
        addNotification({
          type: "error",
          title: "Panier vide",
          message: "Ajoutez des produits à votre panier avant de commander",
        });
        return;
      }

      setIsProcessing(true);
      console.log("🛒 Début du processus de commande...");
      console.log("📦 Articles du panier:", items);
      console.log("💰 Total:", finalTotal);

      // Préparer les données de commande
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price, // Inclure le prix du panier
        })),
        shippingAddress: {
          firstName: user?.firstName || "Client",
          lastName: user?.lastName || "Deltagum",
          email: user?.email || `client-${Date.now()}@deltagum.com`,
          phone: user?.phone || "0123456789",
          street: user?.address || "123 Rue de la Livraison",
          city: user?.city || "Paris",
          postalCode: user?.postalCode || "75001",
          country: "France",
        },
        ...(user?.id && { customerId: user.id }),
        totalAmount: finalTotal,
      };

      console.log("📤 Données de commande:", orderData);

      // Créer la commande
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("❌ Erreur commande:", errorData);
        addNotification({
          type: "error",
          title: "Erreur de commande",
          message: "Impossible de créer la commande. Veuillez réessayer.",
        });
        setIsProcessing(false);
        return;
      }

      const { data: orderResult } = await orderResponse.json();
      console.log("✅ Commande créée:", orderResult.id);

      // Créer la session Stripe
      const sessionResponse = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderResult.id }),
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json();
        console.error("❌ Erreur session:", errorData);
        addNotification({
          type: "error",
          title: "Erreur de paiement",
          message:
            "Impossible de créer la session de paiement. Veuillez réessayer.",
        });
        setIsProcessing(false);
        return;
      }

      const sessionData = await sessionResponse.json();

      if (sessionData.success && sessionData.data.url) {
        console.log("✅ Session Stripe créée, redirection...");

        // Sauvegarder les informations du panier pour les restaurer en cas d'annulation
        localStorage.setItem(
          "deltagum_pending_order",
          JSON.stringify({
            orderId: orderResult.id,
            cartItems: items,
            timestamp: Date.now(),
          })
        );

        // Fermer le modal et rediriger vers Stripe
        onClose();
        window.location.href = sessionData.data.url;
      } else {
        console.error("❌ Erreur session:", sessionData);
        addNotification({
          type: "error",
          title: "Erreur de session",
          message: "Problème lors de la création de la session de paiement",
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      addNotification({
        type: "error",
        title: "Erreur inattendue",
        message: "Une erreur s'est produite. Veuillez réessayer.",
      });
      setIsProcessing(false);
    }
  };

  // Fonction handleQuantityChange supprimée car les quantités ne sont plus modifiables

  const EmptyCart = () => (
    <div className="text-center py-8 sm:py-12 px-4">
      <motion.div
        className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🛒
      </motion.div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
        Votre panier est vide
      </h3>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
        Découvrez nos délicieux bonbons et ajoutez-les à votre panier !
      </p>
      <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">
        Continuer mes achats
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mon Panier"
      size="lg"
      className="max-h-[95vh] sm:max-h-[90vh]"
    >
      <ModalBody className="p-0">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Articles du panier */}
            <div className="max-h-80 sm:max-h-96 overflow-y-auto px-3 sm:px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center space-x-2 sm:space-x-4 py-3 sm:py-4 border-b border-gray-200 last:border-b-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    {/* Image du produit */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl">
                          🍭
                        </div>
                      )}
                    </div>

                    {/* Informations du produit */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Saveur: {item.flavor}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-semibold text-pink-600 text-sm sm:text-base">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Affichage de la quantité (non modifiable) */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Qté: {item.quantity}
                      </span>
                    </div>

                    {/* Prix total de l'article */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Bouton supprimer */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Résumé de la commande */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Livraison</span>
                  <span
                    className={cn(
                      "text-gray-900 font-medium",
                      shippingCost === 0 && "text-green-600 font-semibold"
                    )}
                  >
                    {shippingCost === 0
                      ? "Gratuite"
                      : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-pink-600 font-bold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      {items.length > 0 && (
        <ModalFooter className="flex-col space-y-3">
          {/* Bouton de test Stripe (développement) - Désactivé car intégré dans "Commander" */}
          {false && process.env.NODE_ENV === "development" && (
            <div className="mb-3 text-center">
              <button
                onClick={async () => {
                  // Test direct de l'API checkout
                  try {
                    if (items.length === 0) {
                      alert("❌ Panier vide ! Ajoutez des produits d'abord.");
                      return;
                    }

                    console.log("🧪 Test Stripe avec panier réel...");
                    console.log("📦 Articles du panier:", items);
                    console.log("💰 Total:", finalTotal);

                    // Préparer les données de commande avec email unique
                    const orderData = {
                      items: items.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price, // Inclure le prix du panier
                      })),
                      shippingAddress: {
                        firstName: "Test",
                        lastName: "User",
                        email: `test-${Date.now()}@example.com`, // Email unique pour chaque test
                        phone: "0123456789",
                        street: "123 Rue de Test",
                        city: "Paris",
                        postalCode: "75001",
                        country: "France",
                      },
                      totalAmount: finalTotal || 0,
                    };

                    console.log("📤 Données envoyées:", orderData);

                    // D'abord créer une commande de test
                    const orderResponse = await fetch("/api/orders", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(orderData),
                    });

                    if (orderResponse.ok) {
                      const { data: orderData } = await orderResponse.json();

                      // Puis créer la session Stripe
                      const sessionResponse = await fetch(
                        "/api/checkout/session",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId: orderData.id }),
                        }
                      );

                      const sessionData = await sessionResponse.json();
                      console.log("Test Stripe:", sessionData);

                      if (sessionData.success && sessionData.data.url) {
                        console.log("✅ Redirection vers Stripe...");
                        window.location.href = sessionData.data.url;
                      } else {
                        console.error("❌ Erreur session:", sessionData);
                        alert("❌ Erreur session: " + sessionData.error);
                      }
                    } else {
                      const errorData = await orderResponse.json();
                      console.error("❌ Erreur commande:", errorData);
                      alert("❌ Erreur commande: " + errorData.error);
                    }
                  } catch (error) {
                    console.error("❌ Erreur test:", error);
                    alert("❌ Erreur: " + error);
                  }
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
              >
                🧪 Test Stripe API
              </button>
            </div>
          )}

          <div className="flex space-x-3 w-full">
            <Button
              variant="outline"
              onClick={() => clearCart()}
              className="flex-1"
            >
              Vider le panier
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </>
              ) : (
                `Commander (${formatPrice(finalTotal)})`
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Paiement sécurisé avec Stripe
          </p>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { CartModal };
