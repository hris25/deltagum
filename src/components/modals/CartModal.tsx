"use client";

import { Button, Modal, ModalBody, ModalFooter } from "@/components/ui";
import { cn, formatPrice } from "@/lib/utils";
import { useCart, useCheckoutModal } from "@/stores";
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

  const items = cart.items;
  const total = cart.totalAmount;
  const totalItems = cart.totalItems;
  const shippingThreshold = 50; // Livraison gratuite à partir de 50€
  const shippingCost = total >= shippingThreshold ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  const handleCheckout = () => {
    onClose();
    openModal();
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

                {total < shippingThreshold && (
                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    💡 Ajoutez {formatPrice(shippingThreshold - total)} pour
                    bénéficier de la livraison gratuite !
                  </div>
                )}

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
              className="flex-1"
            >
              Commander ({formatPrice(finalTotal)})
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
