"use client";

import { Button } from "@/components/ui";
import { useCart } from "@/stores";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: string;
  items: Array<{
    productName: string;
    variantFlavor: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session de paiement non trouvée");
      setLoading(false);
      return;
    }

    // Récupérer les détails de la commande
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/session/${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setOrderDetails(data.data.order);

          // Vider le panier après un paiement réussi
          clearCart();

          // Nettoyer les données de commande en attente
          localStorage.removeItem("deltagum_pending_order");
        } else {
          setError(
            data.error || "Erreur lors de la récupération de la commande"
          );
        }
      } catch (err) {
        setError("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🍭
          </motion.div>
          <p className="text-lg text-gray-600">
            Vérification de votre commande...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button variant="primary">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animation de succès */}
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
            ✅
          </motion.div>

          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Paiement réussi !
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Merci pour votre commande ! Vos délicieux bonbons Deltagum seront
            bientôt en route.
          </motion.p>

          {/* Détails de la commande */}
          {orderDetails && (
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 mb-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Commande #{orderDetails.id.slice(-8)}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
                  <p className="text-gray-600">
                    {orderDetails.customer.firstName}{" "}
                    {orderDetails.customer.lastName}
                  </p>
                  <p className="text-gray-600">{orderDetails.customer.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Statut</h3>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {orderDetails.status === "PAID"
                      ? "Payé"
                      : orderDetails.status}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Articles commandés
                </h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span className="text-gray-600">
                        {item.productName} - {item.variantFlavor} x
                        {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 font-bold text-lg">
                    <span>Total</span>
                    <span>{Number(orderDetails.totalAmount).toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Prochaines étapes */}
          <motion.div
            className="bg-blue-50 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Que se passe-t-il maintenant ?
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📧</span>
                <span className="text-blue-700">
                  Vous recevrez un email de confirmation sous peu
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">📦</span>
                <span className="text-blue-700">
                  Votre commande sera préparée dans les 24h
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚚</span>
                <span className="text-blue-700">
                  Livraison sous 3-5 jours ouvrés
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
            <Link href="/">
              <Button variant="primary" size="lg">
                Continuer mes achats
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="lg">
                Voir mes commandes
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
