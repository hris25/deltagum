"use client";

import { ProductFloatingCandies } from "@/components/animations";
import { FlavorSelector } from "@/components/product/FlavorSelector";
import { ProductCard } from "@/components/product/ProductCard";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { formatPrice } from "@/lib/utils";
import { useCart, useNotifications, useProduct } from "@/stores";
import type { Product } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const ProductSection: React.FC = () => {
  const { products, fetchProducts } = useProduct();
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Charger les produits au montage
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sélectionner le premier produit par défaut
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct, setSelectedProduct]);

  // Sélectionner la première variante quand le produit change
  useEffect(() => {
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Veuillez sélectionner un produit et une saveur",
      });
      return;
    }

    addItem({
      productId: selectedProduct.id,
      variantId: selectedVariant.id,
      quantity,
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      image: selectedProduct.image,
      flavor: selectedVariant.flavor,
      color: selectedVariant.color,
    });

    addNotification({
      type: "success",
      title: "Succès",
      message: `${quantity} ${selectedProduct.name} (${
        selectedVariant.flavor
      }) ajouté${quantity > 1 ? "s" : ""} au panier !`,
    });

    // Reset quantity
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Create variants with product relation for FlavorSelector
  const variantsWithProduct =
    selectedProduct?.variants?.map((variant) => ({
      ...variant,
      product: selectedProduct,
    })) || [];

  return (
    <section id="products" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <ProductFloatingCandies />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Nos Créations
            </span>
            <br />
            <span className="text-gray-800">Artisanales</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={slideUp.initial}
            whileInView={slideUp.animate}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Découvrez nos bonbons aux saveurs uniques, créés avec passion et des
            ingrédients naturels de qualité.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <motion.div
            className={`mb-16 ${
              products.length === 1
                ? "flex justify-center"
                : "grid grid-cols-1 lg:grid-cols-3 gap-8"
            }`}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={staggerItem}
                className={products.length === 1 ? "max-w-md w-full" : ""}
              >
                <ProductCard
                  product={product}
                  isSelected={selectedProduct?.id === product.id}
                  onSelect={() => setSelectedProduct(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🍭</div>
            <p className="text-gray-500 text-lg">Chargement des produits...</p>
          </div>
        )}

        {/* Product Details & Flavor Selection */}
        <AnimatePresence mode="wait">
          {selectedProduct && (
            <motion.div
              key={selectedProduct.id}
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="text-center bg-gradient-to-r from-pink-50 to-orange-50">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {selectedProduct.description}
                  </p>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Flavor Selection */}
                    <div>
                      <h4 className="text-xl font-semibold mb-4 text-gray-800">
                        Choisissez votre saveur
                      </h4>
                      <FlavorSelector
                        variants={variantsWithProduct}
                        selectedVariant={selectedVariant}
                        onVariantSelect={setSelectedVariant}
                      />
                    </div>

                    {/* Purchase Section */}
                    <div className="space-y-8">
                      {selectedVariant && (
                        <>
                          {/* Price */}
                          <div className="text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start space-x-3">
                              <span className="text-3xl font-bold text-pink-600">
                                {formatPrice(Number(selectedProduct.price))}
                              </span>
                            </div>
                            {/* No promotions in current schema */}
                          </div>

                          {/* Quantity Selector */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantité
                            </label>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(quantity - 1)
                                }
                                disabled={quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-12 text-center font-semibold text-lg">
                                {quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityChange(quantity + 1)
                                }
                                disabled={quantity >= 10}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          {/* Stock Info */}
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                selectedVariant.stock > 10
                                  ? "bg-green-500"
                                  : selectedVariant.stock > 0
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-sm text-gray-600">
                              {selectedVariant.stock > 10
                                ? "En stock"
                                : selectedVariant.stock > 0
                                ? `Plus que ${selectedVariant.stock} en stock`
                                : "Rupture de stock"}
                            </span>
                          </div>

                          {/* Add to Cart Button */}
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={selectedVariant.stock === 0}
                            fullWidth
                            className="text-lg py-4"
                          >
                            <span className="mr-2">🛒</span>
                            {selectedVariant.stock === 0
                              ? "Rupture de stock"
                              : `Ajouter au panier - ${formatPrice(
                                  Number(selectedProduct.price) * quantity
                                )}`}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export { ProductSection };
