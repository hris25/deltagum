"use client";

import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { formatPrice } from "@/lib/utils";
import { useProducts } from "@/stores";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const ProductOverview = () => {
  const { products, fetchProducts, loading, error } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debug: afficher les produits dans la console
  useEffect(() => {
    console.log("ProductOverview - products:", products);
  }, [products]);

  const getBasePrice = (product: any) => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const sortedTiers = [...product.priceTiers].sort(
        (a, b) => a.quantity - b.quantity
      );
      return Number(sortedTiers[0].price);
    }
    return Number(product.basePrice);
  };

  const getBaseQuantity = (product: any) => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const sortedTiers = [...product.priceTiers].sort(
        (a, b) => a.quantity - b.quantity
      );
      return sortedTiers[0].quantity;
    }
    return 1;
  };

  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
            variants={staggerItem}
          >
            Nos Produits{" "}
            <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              Deltagum
            </span>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0"
            variants={staggerItem}
          >
            Découvrez notre gamme de produits Deltagum premium
          </motion.p>
        </motion.div>

        {/* État de chargement avec skeleton */}
        {loading && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image skeleton */}
                <div className="relative h-64 bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-xl"></div>
                </div>

                {/* Content skeleton */}
                <div className="p-6">
                  {/* Badge skeleton */}
                  <div className="text-center mb-4">
                    <div className="inline-block h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
                  </div>

                  {/* Title skeleton */}
                  <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mx-auto mb-3"></div>

                  {/* Description skeleton */}
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  {/* Price skeleton */}
                  <div className="text-center mb-6">
                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  </div>

                  {/* Button skeleton */}
                  <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <motion.div
            className="text-center py-16"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => fetchProducts()}
              variant="primary"
              className="mt-4"
            >
              Réessayer
            </Button>
          </motion.div>
        )}

        {/* Produits chargés avec succès */}
        {!loading && !error && products.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  {/* Image en pleine largeur en haut de la carte */}
                  <div className="relative w-full h-40 sm:h-44 lg:h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || "/img/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/img/placeholder.svg";
                      }}
                    />
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                      18+
                    </div>
                  </div>

                  <CardHeader className="text-center pb-3 sm:pb-4 px-3 sm:px-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-0 px-3 sm:px-6">
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                      {product.description}
                    </p>

                    <div className="text-center mb-3 sm:mb-4">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">
                        À partir de {formatPrice(getBasePrice(product))}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        pour {getBaseQuantity(product)} unité
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Saveurs disponibles : {product.variants?.length || 0}
                      </div>
                      <div className="flex justify-center space-x-1">
                        {product.variants
                          ?.slice(0, 3)
                          .map((variant: any, idx: number) => (
                            <div
                              key={idx}
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: variant.color }}
                            />
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        En stock
                      </span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full text-sm sm:text-base"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Voir le produit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Aucun produit trouvé (après chargement réussi) */}
        {!loading && !error && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
          >
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nos produits arrivent bientôt !
            </h3>
            <p className="text-gray-600">
              Nous préparons une sélection exceptionnelle de produits Deltagum
              pour vous.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductOverview;
