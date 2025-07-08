"use client";

import { Button } from "@/components/ui";
// Animations removed - using inline animations
import { useUI } from "@/stores";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";

const HeroSection: React.FC = () => {
  const { openCart } = useUI();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

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

  // Floating candies data
  const floatingCandies = [
    { emoji: "🍭", delay: 0, x: 10, y: 20 },
    { emoji: "🍬", delay: 0.5, x: 80, y: 15 },
    { emoji: "🧁", delay: 1, x: 15, y: 70 },
    { emoji: "🍰", delay: 1.5, x: 85, y: 75 },
    { emoji: "🎂", delay: 2, x: 50, y: 10 },
    { emoji: "🍪", delay: 2.5, x: 70, y: 60 },
  ];

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

      {/* Floating Candies */}
      {floatingCandies.map((candy, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl md:text-6xl pointer-events-none select-none"
          style={{
            left: `${candy.x}%`,
            top: `${candy.y}%`,
            transform: `translate(-50%, -50%)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 2,
            delay: candy.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {candy.emoji}
        </motion.div>
      ))}

      {/* Interactive Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Colonne de texte */}
            <div className="text-center lg:text-left">
              {/* Badge Nouveau */}
              <motion.div
                className="inline-flex items-center justify-center px-6 py-3 mb-8 mx-auto lg:mx-0"
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
                  <div className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg border-2 border-white/20">
                    <div className="flex items-center space-x-2">
                      <motion.span
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🌿
                      </motion.span>
                      <span className="font-bold text-sm sm:text-base">
                        Nouveau : Deltagum CBD en 3 saveurs !
                      </span>
                      <motion.span
                        className="text-lg"
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
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight font-serif"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                  Nos produits
                </span>
                <span className="block bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Deltagum
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  premium
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                Découvrez Deltagum, nos produits premium aux saveurs naturelles.
                Un produit exceptionnel disponible en trois délicieuses
                variantes :
                <span className="text-pink-500 font-semibold"> fraise</span>,
                <span className="text-blue-500 font-semibold"> myrtille</span>{" "}
                et
                <span className="text-green-500 font-semibold"> pomme</span>.
                Relaxation et bien-être dans chaque délice !
                <br />
                <span className="text-sm text-gray-700 mt-2 block font-semibold">
                  🔞 Produit réservé aux adultes - Contient du CBD
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={scrollToProducts}
                  className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">🍭</span>
                  Découvrir nos saveurs
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={openCartModal}
                  className="text-lg px-8 py-4 border-2 hover:bg-pink-50"
                >
                  <span className="mr-2">🛒</span>
                  Voir mon panier
                </Button>
              </motion.div>
            </div>

            {/* Colonne d'image */}
            <div className="relative">
              <motion.div
                className="relative w-full max-w-2xl mx-auto"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              >
                {/* Image décorative */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/img/3.jpg"
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

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-pink-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              >
                3
              </motion.div>
              <p className="text-gray-600">Variantes de saveurs</p>
            </div>

            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-orange-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: "spring", stiffness: 200 }}
              >
                100%
              </motion.div>
              <p className="text-gray-600">Artisanal</p>
            </div>

            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-purple-500 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
              >
                ∞
              </motion.div>
              <p className="text-gray-600">Bien-être garanti</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ y: y1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-pink-300 rounded-full flex justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-pink-400 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <p className="text-sm text-gray-500 mt-2">Scroll</p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 text-6xl opacity-20"
        style={{ y: y2 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        🍭
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-6xl opacity-20"
        style={{ y: y1 }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        🍬
      </motion.div>
    </section>
  );
};

export { HeroSection };
