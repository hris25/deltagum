"use client";

import { Button } from "@/components/ui";
import { useCart, useCustomer, useNotifications } from "@/stores";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { useState } from "react";

interface StripePaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  shippingData: any;
}

export function StripePaymentForm({
  onSuccess,
  onError,
  shippingData,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const { customer } = useCustomer();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe n'est pas encore chargé");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError("Élément de carte non trouvé");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Créer la commande côté serveur
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer?.id,
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddress: shippingData,
          totalAmount: cart.totalAmount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const { order } = await orderResponse.json();

      // 2. Créer la session de checkout Stripe
      const checkoutResponse = await fetch("/api/checkout", {
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

      // 3. Rediriger vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      onError(error instanceof Error ? error.message : "Erreur de paiement");
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "Inter, system-ui, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Résumé de la commande */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">
          Résumé de la commande
        </h4>
        <div className="space-y-2">
          {cart.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.name} - {item.flavor} x{item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>{cart.totalAmount.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Informations de carte */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Informations de paiement</h4>

        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>

        <div className="text-sm text-gray-600">
          <p>💳 Cartes acceptées : Visa, Mastercard, American Express</p>
          <p>🔒 Paiement sécurisé par Stripe</p>
        </div>
      </div>

      {/* Informations de livraison */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Livraison</h4>
        <div className="text-sm text-blue-700">
          <p>
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.postalCode} {shippingData.city}
          </p>
          <p>{shippingData.country}</p>
        </div>
      </div>

      {/* Bouton de paiement */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!stripe || isProcessing}
        fullWidth
        className="mt-6"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <motion.span
              className="mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              🍭
            </motion.span>
            Traitement du paiement...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">💳</span>
            Payer {cart.totalAmount.toFixed(2)}€
          </span>
        )}
      </Button>

      {/* Informations légales */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>En procédant au paiement, vous acceptez nos conditions de vente.</p>
        <p>
          Vos données de paiement sont sécurisées et ne sont pas stockées sur
          nos serveurs.
        </p>
      </div>
    </motion.form>
  );
}
