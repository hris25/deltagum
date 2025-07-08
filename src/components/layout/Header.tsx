"use client";

import { Badge, Button } from "@/components/ui";
import { slideDown } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useCart, useProduct, useUI } from "@/stores";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const { openCart } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const { products, fetchProducts } = useProduct();

  // Détecter le scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Récupérer les produits pour le menu déroulant
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalItems = getTotalItems();

  const navItems = [
    { label: "Accueil", href: "/", type: "link" },
    { label: "À propos & Légal", href: "/about", type: "link" },
    {
      label: "Professionnels & Revendeurs",
      href: "/professionals",
      type: "link",
    },
  ];

  const handleNavigation = (item: { href: string; type: string }) => {
    if (item.type === "scroll") {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = item.href;
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
            {/* Accueil */}
            <motion.button
              onClick={() => handleNavigation(navItems[0])}
              className={cn(
                "text-gray-700 hover:text-pink-500 font-medium transition-colors",
                "relative py-2"
              )}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 * 0.1 }}
            >
              {navItems[0].label}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-400"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>

            {/* Menu déroulant Produits */}
            <div className="relative">
              <motion.button
                onClick={() =>
                  setIsProductsDropdownOpen(!isProductsDropdownOpen)
                }
                className={cn(
                  "text-gray-700 hover:text-pink-500 font-medium transition-colors",
                  "relative py-2 flex items-center space-x-1"
                )}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
              >
                <span>Produits</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isProductsDropdownOpen && "rotate-180"
                  )}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-orange-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProductsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="block px-4 py-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                        onClick={() => setIsProductsDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.dosage}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Autres éléments de navigation (À propos & Légal, Professionnels & Revendeurs) */}
            {navItems.slice(1).map((item, index) => (
              <motion.button
                key={item.href}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "text-gray-700 hover:text-pink-500 font-medium transition-colors",
                  "relative py-2"
                )}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 2) * 0.1 }}
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
                <ShoppingCart className="w-6 h-6" />

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
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
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
                    onClick={() => handleNavigation(item)}
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
