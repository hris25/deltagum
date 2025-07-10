"use client";

import { Button } from "@/components/ui";
// Animations removed - using inline animations
import { useUI } from "@/stores";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const HeroSection: React.FC = () => {
  const { openCart } = useUI();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // useScroll supprimé avec les effets parallax

  // Parallax effects supprimés avec les emojis

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToProducts = () => {
    const element = document.querySelector("#products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openCartModal = () => {
    openCart();
  };

  // Suppression des emojis flottants pour un design plus épuré

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--gradient-hero)",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-repeat opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f472b6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Section des emojis flottants supprimée pour un design plus épuré */}

      {/* Interactive Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Main Content */}
      <motion.div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
            {/* Colonne de texte */}
            <div className="text-center lg:text-left px-2 sm:px-0">
              {/* Badge Nouveau */}
              <motion.div
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 mx-auto lg:mx-0"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-orange-400 rounded-full blur-sm opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full shadow-lg border-2 border-white/20">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <motion.span
                        className="text-sm sm:text-base lg:text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🌿
                      </motion.span>
                      <span className="font-bold text-xs sm:text-sm lg:text-base">
                        Découvrez notre gamme Deltagum !
                      </span>
                      <motion.span
                        className="text-sm sm:text-base lg:text-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ✨
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight font-serif"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  Gamme
                </span>
                <span className="block bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Deltagum
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Premium
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium px-2 sm:px-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                Découvrez notre gamme complète Deltagum : des produits premium
                aux saveurs naturelles. Nos délicieux produits sont disponibles
                en plusieurs variétés pour satisfaire tous les goûts. Relaxation
                et bien-être dans chaque produit !
                <br />
                <span className="text-xs sm:text-sm text-gray-700 mt-2 block font-semibold">
                  🔞 Produit réservé aux adultes - Contient du Delta-9 THC
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center mb-8 sm:mb-12 px-2 sm:px-0"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={scrollToProducts}
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Découvrir nos produits
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={openCartModal}
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 hover:bg-pink-50 hover:text-pink-600 text-pink-600"
                >
                  <span className="mr-2">🛒</span>
                  Voir mon panier
                </Button>
              </motion.div>
            </div>

            {/* Colonne d'image */}
            <div className="relative mt-8 lg:mt-0">
              <motion.div
                className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                {/* Image décorative */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden ">
                  <img
                    src="/img/herobn.png"
                    alt="Délicieux délices colorés - Image décorative"
                    className="w-full h-auto object-cover"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = "/img/placeholder.svg";
                    }}
                  />
                </div>

                {/* Éléments décoratifs flottants */}
                <motion.div
                  className="absolute -top-6 -left-6 w-12 h-12 bg-pink-400 rounded-full opacity-70"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-8 h-8 bg-orange-400 rounded-full opacity-70"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Stats - Masqué sur mobile */}
          <motion.div
            className="hidden sm:grid grid-cols-3 gap-12 max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center px-4 py-2">
              <motion.div
                className="text-3xl font-bold text-pink-500 mb-3 min-h-[3rem] flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              >
                3
              </motion.div>
              <p className="text-gray-600 text-sm">Variantes de saveurs</p>
            </div>

            <div className="text-center px-4 py-2">
              <motion.div
                className="text-3xl font-bold text-orange-500 mb-3 min-h-[3rem] flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
              >
                100%
              </motion.div>
              <p className="text-gray-600 text-sm">Artisanal</p>
            </div>

            <div className="text-center px-4 py-2">
              <motion.div
                className="text-3xl font-bold text-purple-500 mb-3 min-h-[3rem] flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
              >
                ∞
              </motion.div>
              <p className="text-gray-600 text-sm">Bien-être garanti</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicateur de scroll supprimé pour un design plus épuré */}

      {/* Decorative Elements */}
      {/* Emojis d'arrière-plan supprimés pour un design plus épuré */}
    </section>
  );
};

export { HeroSection };
