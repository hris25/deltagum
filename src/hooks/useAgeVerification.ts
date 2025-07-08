"use client";

import { useState, useEffect } from "react";

const AGE_VERIFICATION_KEY = "deltagum_age_verified";
const VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà été vérifié
    const checkVerification = () => {
      try {
        const stored = localStorage.getItem(AGE_VERIFICATION_KEY);
        if (stored) {
          const { timestamp, verified } = JSON.parse(stored);
          const now = Date.now();
          
          // Vérifier si la vérification n'a pas expiré
          if (verified && (now - timestamp) < VERIFICATION_EXPIRY) {
            setIsVerified(true);
            setShowModal(false);
            return;
          } else {
            // Supprimer la vérification expirée
            localStorage.removeItem(AGE_VERIFICATION_KEY);
          }
        }
        
        // Pas de vérification valide, afficher le modal
        setIsVerified(false);
        setShowModal(true);
      } catch (error) {
        console.error("Erreur lors de la vérification d'âge:", error);
        setIsVerified(false);
        setShowModal(true);
      }
    };

    checkVerification();
  }, []);

  const confirmAge = () => {
    try {
      const verificationData = {
        verified: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(AGE_VERIFICATION_KEY, JSON.stringify(verificationData));
      setIsVerified(true);
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la vérification:", error);
    }
  };

  const denyAge = () => {
    setIsVerified(false);
    setShowModal(false);
    // Rediriger vers une page d'information ou fermer l'onglet
    window.location.href = "https://www.service-public.fr/particuliers/vosdroits/F32094";
  };

  const resetVerification = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsVerified(false);
    setShowModal(true);
  };

  return {
    isVerified,
    showModal,
    confirmAge,
    denyAge,
    resetVerification,
  };
};
