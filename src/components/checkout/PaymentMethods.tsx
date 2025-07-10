"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCart, useCustomer, useNotifications } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface PaymentMethodsProps {
  onBack: () => void;
  onSuccess: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

type PaymentMethod = "card" | "paypal" | "apple_pay" | "google_pay";

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onBack,
  onSuccess,
  isProcessing,
  setIsProcessing,
}) => {
  const { cart, clearCart } = useCart();
  const { customer } = useCustomer();
  const { addNotification } = useNotifications();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Carte bancaire",
      icon: "💳",
      description: "Visa, Mastercard, American Express",
      available: true,
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: "🅿️",
      description: "Paiement sécurisé avec PayPal",
      available: true,
    },
    {
      id: "apple_pay" as PaymentMethod,
      name: "Apple Pay",
      icon: "🍎",
      description: "Paiement rapide avec Touch ID",
      available: false,
    },
    {
      id: "google_pay" as PaymentMethod,
      name: "Google Pay",
      icon: "🔵",
      description: "Paiement rapide avec Google",
      available: false,
    },
  ];

  const handleCardInputChange = (
    field: keyof typeof cardDetails,
    value: string
  ) => {
    let formattedValue = value;

    if (field === "number") {
      // Format card number with spaces
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.slice(0, 19);
    } else if (field === "expiry") {
      // Format expiry as MM/YY
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5)
        formattedValue = formattedValue.slice(0, 5);
    } else if (field === "cvc") {
      // Only numbers, max 4 digits
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
  };

  const fillDemoCardData = () => {
    setCardDetails({
      number: "4242 4242 4242 4242",
      expiry: "12/25",
      cvc: "123",
      name:
        customer?.firstName && customer?.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : "Marie Dupont",
    });
  };

  const validateCardDetails = () => {
    const { number, expiry, cvc, name } = cardDetails;

    if (!number || number.replace(/\s/g, "").length < 16) {
      addNotification({
        type: "error",
        title: "Paiement",
        message: "Numéro de carte invalide",
      });
      return false;
    }

    if (!expiry || expiry.length < 5) {
      addNotification({
        type: "error",
        title: "Paiement",
        message: "Date d'expiration invalide",
      });
      return false;
    }

    if (!cvc || cvc.length < 3) {
      addNotification({
        type: "error",
        title: "Paiement",
        message: "Code CVC invalide",
      });
      return false;
    }

    if (!name.trim()) {
      addNotification({
        type: "error",
        title: "Paiement",
        message: "Nom du titulaire requis",
      });
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (selectedMethod === "card" && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Vérifier que le panier n'est pas vide
      if (cart.items.length === 0) {
        addNotification({
          type: "error",
          title: "Panier vide",
          message:
            "Votre panier est vide. Ajoutez des produits avant de procéder au paiement.",
        });
        return;
      }

      // Créer la commande avec les vrais articles du panier
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Ne pas envoyer customerId s'il n'existe pas
          ...(customer?.id && { customerId: customer.id }),
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            firstName: customer?.firstName || "Client",
            lastName: customer?.lastName || "Deltagum",
            email: customer?.email || "client@deltagum.com",
            phone: customer?.phone || "0123456789",
            street: customer?.address || "123 Rue de la Livraison",
            city: customer?.city || "Paris",
            postalCode: customer?.postalCode || "75001",
            country: "France",
          },
          totalAmount: cart.totalAmount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const { order } = await orderResponse.json();

      // Créer la session de checkout Stripe
      const checkoutResponse = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Erreur lors de la création de la session de paiement");
      }

      const { data } = await checkoutResponse.json();

      // Rediriger vers Stripe Checkout
      if (data.url) {
        // Sauvegarder les informations du panier pour les restaurer en cas d'annulation
        localStorage.setItem(
          "deltagum_pending_order",
          JSON.stringify({
            orderId: order.id,
            cartItems: cart.items,
            timestamp: Date.now(),
          })
        );

        // Rediriger vers Stripe
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);

      addNotification({
        type: "error",
        title: "Erreur de paiement",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du paiement",
      });

      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Payment Method Selection */}
      <div>
        <h4 className="font-medium text-gray-800 mb-4">
          Choisissez votre méthode de paiement
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              onClick={() => method.available && setSelectedMethod(method.id)}
              disabled={!method.available}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${
                  selectedMethod === method.id
                    ? "border-pink-500 bg-pink-50"
                    : method.available
                    ? "border-gray-200 hover:border-gray-300 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                }
              `}
              whileHover={method.available ? { scale: 1.02 } : {}}
              whileTap={method.available ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800">{method.name}</h5>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {!method.available && (
                    <p className="text-xs text-gray-400 mt-1">
                      Bientôt disponible
                    </p>
                  )}
                </div>
                {selectedMethod === method.id && (
                  <motion.div
                    className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <AnimatePresence mode="wait">
        {selectedMethod === "card" && (
          <motion.div
            key="card-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">
                    Informations de carte
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillDemoCardData}
                    className="text-xs"
                  >
                    Données de test
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) =>
                        handleCardInputChange("number", e.target.value)
                      }
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) =>
                          handleCardInputChange("expiry", e.target.value)
                        }
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvc}
                        onChange={(e) =>
                          handleCardInputChange("cvc", e.target.value)
                        }
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du titulaire
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) =>
                        handleCardInputChange("name", e.target.value)
                      }
                      placeholder="Marie Dupont"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedMethod === "paypal" && (
          <motion.div
            key="paypal-info"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🅿️</div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Paiement PayPal
                </h4>
                <p className="text-gray-600 text-sm">
                  Vous serez redirigé vers PayPal pour finaliser votre paiement
                  de manière sécurisée.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h4 className="font-medium text-green-800">
              Paiement 100% sécurisé
            </h4>
            <p className="text-sm text-green-600">
              Vos données sont protégées par un cryptage SSL 256-bit
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          ← Retour aux informations
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={processPayment}
          disabled={isProcessing}
          className="min-w-[200px]"
        >
          {isProcessing ? (
            <span className="flex items-center">
              <motion.span
                className="mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                💳
              </motion.span>
              Traitement en cours...
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-2">💰</span>
              Payer{" "}
              {formatPrice(
                cart.totalAmount +
                  cart.totalAmount * 0.2 +
                  (cart.totalAmount >= 50 ? 0 : 5.99)
              )}
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export { PaymentMethods };
