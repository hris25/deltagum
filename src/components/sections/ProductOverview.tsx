"use client";

import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animations";
import { formatPrice } from "@/lib/utils";
import { useProduct } from "@/stores";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const ProductOverview = () => {
  const { products, fetchProducts } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debug: afficher les produits dans la console
  useEffect(() => {
    console.log("ProductOverview - products:", products);
  }, [products]);

  const getBasePrice = (product) => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const sortedTiers = [...product.priceTiers].sort(
        (a, b) => a.quantity - b.quantity
      );
      return Number(sortedTiers[0].price);
    }
    return Number(product.basePrice);
  };

  const getBaseQuantity = (product) => {
    if (product.priceTiers && product.priceTiers.length > 0) {
      const sortedTiers = [...product.priceTiers].sort(
        (a, b) => a.quantity - b.quantity
      );
      return sortedTiers[0].quantity;
    }
    return 1;
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={staggerItem}
          >
            Nos Produits{" "}
            <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              Delta-9
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={staggerItem}
          >
            Découvrez notre gamme de produits Delta-9 premium
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden">
                    <img
                      src={product.image || "/img/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      🌿
                    </div>
                    <div className="absolute bottom-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      18+
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {product.dosage && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mb-3">
                      💊 {product.dosage}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4">
                    {product.description}
                  </p>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-pink-600">
                      À partir de {formatPrice(getBasePrice(product))}
                    </div>
                    <div className="text-sm text-gray-500">
                      pour {getBaseQuantity(product)} unité
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Saveurs disponibles : {product.variants?.length || 0}
                    </div>
                    <div className="flex justify-center space-x-1">
                      {product.variants?.slice(0, 3).map((variant, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: variant.color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">En stock</span>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <Button variant="primary" size="lg" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir le produit
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {products.length === 0 && (
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
              Nous préparons une sélection exceptionnelle de produits Delta-9
              pour vous.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductOverview;
