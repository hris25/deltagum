"use client";

import { Button } from "@/components/ui";
import { useState } from "react";

export function StripeDebugPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const testOrderCreation = async () => {
    setIsLoading(true);
    addLog("🧪 Test de création de commande...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId: "test-product",
              variantId: "test-variant",
              quantity: 2,
            },
          ],
          shippingAddress: {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "0123456789",
            street: "123 Rue de Test",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
          totalAmount: 25.99,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addLog(`✅ Commande créée: ${data.data.id}`);
        return data.data.id;
      } else {
        addLog(`❌ Erreur commande: ${data.error}`);
        return null;
      }
    } catch (error) {
      addLog(`❌ Erreur réseau: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const testStripeSession = async (orderId?: string) => {
    if (!orderId) {
      orderId = await testOrderCreation();
      if (!orderId) return;
    }

    setIsLoading(true);
    addLog("💳 Test de session Stripe...");

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addLog(`✅ Session créée: ${data.data.sessionId}`);
        addLog(`🔗 URL: ${data.data.url}`);
        
        // Optionnel: ouvrir dans un nouvel onglet
        if (confirm("Ouvrir la page de paiement Stripe ?")) {
          window.open(data.data.url, '_blank');
        }
      } else {
        addLog(`❌ Erreur session: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullFlow = async () => {
    addLog("🚀 Test du flux complet...");
    const orderId = await testOrderCreation();
    if (orderId) {
      await testStripeSession(orderId);
    }
  };

  const testStripeConfig = () => {
    addLog("🔧 Test de configuration Stripe...");
    
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      addLog(`✅ Clé publique: ${publishableKey.substring(0, 20)}...`);
    } else {
      addLog("❌ Clé publique manquante");
    }
    
    // Test de chargement de Stripe
    if (typeof window !== 'undefined') {
      import('@stripe/stripe-js').then(({ loadStripe }) => {
        loadStripe(publishableKey!)
          .then(stripe => {
            if (stripe) {
              addLog("✅ Stripe chargé avec succès");
            } else {
              addLog("❌ Échec du chargement de Stripe");
            }
          })
          .catch(error => {
            addLog(`❌ Erreur Stripe: ${error.message}`);
          });
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">🧪 Debug Stripe</h3>
        <Button onClick={clearLogs} variant="ghost" size="sm">
          Effacer
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <Button
          onClick={testStripeConfig}
          disabled={isLoading}
          variant="outline"
          size="sm"
          fullWidth
        >
          Test Config
        </Button>
        
        <Button
          onClick={testOrderCreation}
          disabled={isLoading}
          variant="outline"
          size="sm"
          fullWidth
        >
          Test Commande
        </Button>
        
        <Button
          onClick={() => testStripeSession()}
          disabled={isLoading}
          variant="outline"
          size="sm"
          fullWidth
        >
          Test Session
        </Button>
        
        <Button
          onClick={testFullFlow}
          disabled={isLoading}
          variant="primary"
          size="sm"
          fullWidth
        >
          {isLoading ? "Test en cours..." : "Test Complet"}
        </Button>
      </div>

      <div className="bg-gray-50 rounded p-3 max-h-48 overflow-y-auto">
        <div className="text-xs font-mono space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-500">Aucun log...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-gray-700">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
