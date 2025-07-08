"use client";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import {
  CheckoutProgress,
  type CheckoutStep,
} from "@/components/checkout/CheckoutProgress";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { Card, CardContent, CardHeader, Modal } from "@/components/ui";
import { useCart, useCustomer } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const cart = useCart();
  const customer = useCustomer();

  // Reset modal state when opening
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep("shipping");
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Si le panier est vide, ne pas afficher le modal
  if (!cart?.cart?.items || cart.cart.items.length === 0) {
    return null;
  }

  const handleStepChange = (step: CheckoutStep) => {
    setCurrentStep(step);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep("confirmation");
  };

  const handleClose = () => {
    setCurrentStep("shipping");
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Finaliser votre commande"
      size="full"
      className="max-w-7xl"
    >
      <div className="min-h-[600px]">
        {/* Progress Bar */}
        <div className="mb-8">
          <CheckoutProgress currentStep={currentStep} />
        </div>

        {/* Content Grid */}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-6xl mb-6"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Commande confirmée !
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Merci pour votre commande ! Vous recevrez un email de
                        confirmation sous peu.
                      </p>

                      <div className="space-y-4">
                        <button
                          onClick={handleClose}
                          className="bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors mr-4"
                        >
                          Fermer
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
            <div className="sticky top-4">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CheckoutModal };
