"use client";

import { Badge, Button } from "@/components/ui";
import { slideDown } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useCart, useUI } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { openCart } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Détecter le scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = getTotalItems();

  const navItems = [
    { label: "Accueil", href: "#hero" },
    { label: "Produits", href: "#products" },
    { label: "À propos", href: "#about" },
    { label: "Témoignages", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const openCartModal = () => {
    openCart();
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-transparent"
      )}
      initial={slideDown.initial}
      animate={slideDown.animate}
      transition={slideDown.transition}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🍭
              </motion.div>
              <span
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent",
                  "hidden sm:block"
                )}
              >
                Deltagum
              </span>
            </Link>
          </motion.div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-gray-700 hover:text-pink-500 font-medium transition-colors",
                  "relative py-2"
                )}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Panier */}
            <motion.div className="relative">
              <motion.button
                onClick={openCartModal}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>

                {/* Badge du nombre d'articles */}
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge
                        variant="primary"
                        size="sm"
                        rounded
                        className="min-w-[20px] h-5 text-xs"
                      >
                        {totalItems}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Menu Mobile */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                <motion.div
                  animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export { Header };
