"use client";

import { ToastContainer } from "@/components/ui";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { cn } from "@/lib/utils";
import { useCheckoutModal, useUI } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Modals
import { AgeVerificationModal } from "@/components/modals/AgeVerificationModal";
import { CartModal } from "@/components/modals/CartModal";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { ProductModal } from "@/components/modals/ProductModal";

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
}) => {
  const {
    isCartOpen,
    isAuthModalOpen,
    isMobile,
    setIsMobile,
    isLoading,
    closeAllModals,
  } = useUI();

  const { isOpen: isCheckoutModalOpen, closeModal: closeCheckoutModal } =
    useCheckoutModal();

  const { isVerified, showModal, confirmAge, denyAge } = useAgeVerification();

  // État pour éviter les problèmes d'hydratation
  const [isClient, setIsClient] = React.useState(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  // Empêcher le scroll quand une modal est ouverte
  useEffect(() => {
    const hasOpenModal = isCartOpen || isCheckoutModalOpen || isAuthModalOpen;
    if (hasOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isCheckoutModalOpen, isAuthModalOpen]);

  // Ne pas afficher le contenu tant que la vérification n'est pas faite
  if (isVerified === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Vérification d'âge */}
      <AgeVerificationModal
        isOpen={showModal}
        onConfirm={confirmAge}
        onDeny={denyAge}
      />

      {/* Contenu principal (affiché seulement si vérifié) */}
      {isVerified && (
        <>
          {/* Header */}
          {showHeader && <Header />}

          {/* Contenu principal */}
          <main
            className={cn(
              "flex-1",
              showHeader && "pt-16 lg:pt-20", // Compenser la hauteur du header fixe
              className
            )}
          >
            {children}
          </main>

          {/* Footer */}
          {showFooter && <Footer />}

          {/* Modals */}
          {isClient && (
            <AnimatePresence mode="wait">
              <CartModal
                key="cart-modal"
                isOpen={isCartOpen}
                onClose={closeAllModals}
              />
              <ProductModal
                key="product-modal"
                isOpen={false}
                onClose={closeAllModals}
              />
              <CheckoutModal
                key="checkout-modal"
                isOpen={isCheckoutModalOpen}
                onClose={closeCheckoutModal}
              />
            </AnimatePresence>
          )}
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Loading Overlay Global */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🍭
              </motion.div>
              <motion.p
                className="text-lg font-medium text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Chargement en cours...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Layout spécialisé pour les pages d'erreur
export const ErrorLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Layout
    showHeader={false}
    showFooter={false}
    className="flex items-center justify-center"
  >
    {children}
  </Layout>
);

// Layout spécialisé pour les pages d'authentification
export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Layout
    showHeader={false}
    showFooter={false}
    className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-orange-50"
  >
    {children}
  </Layout>
);

// Layout spécialisé pour les pages admin
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Layout className="bg-gray-50">
    <div className="container mx-auto px-4 py-8">{children}</div>
  </Layout>
);

export { Layout };
