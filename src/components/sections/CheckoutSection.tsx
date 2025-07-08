"use client";

import { CheckoutFloatingCandies } from "@/components/animations";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import {
  CheckoutProgress,
  type CheckoutStep,
} from "@/components/checkout/CheckoutProgress";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { fadeIn, slideUp } from "@/lib/animations";
import { useCart, useCustomer } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

const CheckoutSection: React.FC = () => {
  const { cart } = useCart();
  const { customer } = useCustomer();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  // Rediriger si le panier est vide
  if (cart.items.length === 0) {
    return (
      <section
        id="checkout"
        className="py-20 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛒
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
              Ajoutez des produits à votre panier pour procéder au paiement.
            </p>
            <button
              onClick={() => {
                const productsSection = document.getElementById("products");
                productsSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep("confirmation");
  };

  return (
    <section
      id="checkout"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <CheckoutFloatingCandies />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
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
              Finaliser
            </span>
            <br />
            <span className="text-gray-800">Votre Commande</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Plus qu'une étape pour savourer nos délicieux bonbons artisanaux !
          </motion.p>
        </motion.div>

        {/* Checkout Progress */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CheckoutProgress currentStep={currentStep} />
        </motion.div>

        {/* Checkout Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === "shipping" && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Informations de livraison
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <CheckoutForm
                          onNext={() => handleStepChange("payment")}
                          isProcessing={isProcessing}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Méthode de paiement
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <PaymentMethods
                          onBack={() => handleStepChange("shipping")}
                          onSuccess={handlePaymentSuccess}
                          isProcessing={isProcessing}
                          setIsProcessing={setIsProcessing}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === "confirmation" && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="text-center">
                      <CardContent className="py-16">
                        <motion.div
                          className="text-6xl mb-6"
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{ duration: 1, repeat: 2 }}
                        >
                          🎉
                        </motion.div>

                        <h3 className="text-3xl font-bold text-gray-800 mb-4">
                          Commande confirmée !
                        </h3>

                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          Merci pour votre commande ! Vous recevrez un email de
                          confirmation avec les détails de livraison.
                        </p>

                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              const heroSection =
                                document.getElementById("hero");
                              heroSection?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                            className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors mr-4"
                          >
                            Retour à l'accueil
                          </button>

                          <button
                            onClick={() => {
                              const productsSection =
                                document.getElementById("products");
                              productsSection?.scrollIntoView({
                                behavior: "smooth",
                              });
                            }}
                            className="border border-pink-500 text-pink-500 px-8 py-3 rounded-lg hover:bg-pink-50 transition-colors"
                          >
                            Continuer mes achats
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="sticky top-8"
              >
                <OrderSummary />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Security & Trust Indicators */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Paiement sécurisé
              </h4>
              <p className="text-sm text-gray-600">SSL 256-bit</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🚚</div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Livraison rapide
              </h4>
              <p className="text-sm text-gray-600">24-48h</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">↩️</div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Retour gratuit
              </h4>
              <p className="text-sm text-gray-600">30 jours</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🎧</div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Support client
              </h4>
              <p className="text-sm text-gray-600">7j/7</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { CheckoutSection };
