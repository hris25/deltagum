"use client";

import { Button } from "@/components/ui";
import { useCart, useCustomer, useNotifications } from "@/stores";
import { useState } from "react";

export function StripeTestButton() {
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleTestCheckout = async () => {
    if (cart.items.length === 0) {
      addNotification({
        type: "error",
        title: "Panier vide",
        message:
          "Ajoutez des produits à votre panier avant de tester le paiement",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Créer une commande de test
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer?.id || "test-customer",
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price, // Inclure le prix du panier
          })),
          shippingAddress: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "0123456789",
            address: "123 Rue de Test",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
          totalAmount: cart.totalAmount,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const { data: orderData } = await orderResponse.json();

      // 2. Créer la session de checkout
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.id,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Erreur lors de la création de la session de paiement");
      }

      const { data: checkoutData } = await checkoutResponse.json();

      // 3. Rediriger vers Stripe Checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error) {
      console.error("Erreur de test:", error);
      addNotification({
        type: "error",
        title: "Erreur de test",
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors du test de paiement",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTestCheckout}
      disabled={isLoading || cart.items.length === 0}
      variant="outline"
      size="sm"
      className="border-blue-300 text-blue-600 hover:bg-blue-50"
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2">🔄</span>
          Test en cours...
        </span>
      ) : (
        <span className="flex items-center">
          <span className="mr-2">🧪</span>
          Tester Stripe
        </span>
      )}
    </Button>
  );
}
