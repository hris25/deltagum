"use client";

// import { CheckoutFloatingCandies } from "@/components/animations";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { formatPrice } from "@/lib/utils";
import { useAuth, useCart, useCheckoutModal, useNotifications } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const CartSection: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const items = cart.items;
  const total = cart.totalAmount;
  const itemCount = cart.totalItems;
  const { addNotification } = useNotifications();
  const { openModal } = useCheckoutModal();

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      addNotification({
        type: "info",
        title: "Panier",
        message: "Produit retiré du panier",
      });
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      addNotification({
        type: "warning",
        title: "🔒 Connexion requise",
        message:
          "Vous devez vous connecter pour passer commande. Redirection en cours...",
      });

      // Rediriger vers la page d'authentification après un court délai
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
      return;
    }

    // Si l'utilisateur est connecté, ouvrir le modal de checkout
    openModal();
    addNotification({
      type: "info",
      title: "Checkout",
      message: "Ouverture du formulaire de commande...",
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    addNotification({
      type: "info",
      title: "Panier",
      message: "Produit retiré du panier",
    });
  };

  const handleClearCart = () => {
    clearCart();
    addNotification({
      type: "info",
      title: "Panier",
      message: "Panier vidé",
    });
  };

  return (
    <section id="cart" className="py-8 bg-gray-50 relative overflow-hidden">
      {/* Background Elements - Removed for cleaner design */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Votre Panier
            </span>
            <br />
            <span className="text-gray-800">Gourmand</span>
          </motion.h2>

          {itemCount > 0 && (
            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={slideUp.initial}
              whileInView={slideUp.animate}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="info" size="lg">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </Badge>
              <Badge variant="success" size="lg">
                Total: {formatPrice(total)}
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Cart Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <EmptyCart key="empty" />
            ) : (
              <motion.div
                key="cart-content"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Articles dans votre panier
                      </h3>
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearCart}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          Vider le panier
                        </Button>
                      )}
                    </CardHeader>

                    <CardContent className="p-0">
                      <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="divide-y divide-gray-200"
                      >
                        <AnimatePresence>
                          {items.map((item) => (
                            <motion.div
                              key={item.id}
                              variants={staggerItem}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{
                                opacity: 0,
                                x: 20,
                                height: 0,
                                marginTop: 0,
                                marginBottom: 0,
                                paddingTop: 0,
                                paddingBottom: 0,
                              }}
                              transition={{ duration: 0.3 }}
                              layout
                            >
                              <CartItem
                                item={item}
                                onQuantityUpdate={handleQuantityUpdate}
                                onRemove={handleRemoveItem}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CartSummary />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        {items.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  productsSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="min-w-[200px]"
              >
                <span className="mr-2">🍭</span>
                Continuer mes achats
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                className="min-w-[200px]"
              >
                <span className="mr-2">💳</span>
                Procéder au paiement
              </Button>
            </div>
          </motion.div>
        )}

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Paiement sécurisé
            </h4>
            <p className="text-sm text-gray-600">Vos données sont protégées</p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Livraison rapide
            </h4>
            <p className="text-sm text-gray-600">Expédition sous 24h</p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-2">💝</div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Emballage soigné
            </h4>
            <p className="text-sm text-gray-600">Parfait pour offrir</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { CartSection };
