"use client";

import { Button } from "@/components/ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onConfirm,
  onDeny,
}) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleDeny = () => {
    setShowWarning(true);
    setTimeout(() => {
      onDeny();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔞
              </motion.div>
              <h2 className="text-2xl font-bold text-white font-candy">
                Vérification d'âge
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Accès réservé aux adultes
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ce site propose des produits à base de{" "}
                  <strong>Delta-9 THC</strong>.
                  <br />
                  L'accès est strictement réservé aux personnes majeures.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Avertissement :</strong> Ces produits contiennent
                  du Delta-9 THC et ne sont pas destinés aux mineurs, aux femmes
                  enceintes ou allaitantes.
                </p>
              </div>

              <div className="text-lg font-medium text-gray-800 mb-6">
                Avez-vous 18 ans ou plus ?
              </div>

              {!showWarning ? (
                <div className="flex gap-4">
                  <Button
                    onClick={onConfirm}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                  >
                    ✓ Oui, j'ai 18 ans ou plus
                  </Button>
                  <Button
                    onClick={handleDeny}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-semibold py-3"
                  >
                    ✗ Non, j'ai moins de 18 ans
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="text-red-600 font-semibold mb-4">
                    ❌ Accès refusé
                  </div>
                  <p className="text-gray-600">
                    Vous devez être majeur pour accéder à ce site.
                    <br />
                    Redirection en cours...
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-xs text-gray-500">
                En continuant, vous confirmez être majeur et acceptez nos
                conditions d'utilisation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export { AgeVerificationModal };
