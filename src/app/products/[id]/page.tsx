"use client";

import { FlavorSelector } from "@/components/product/FlavorSelector";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { Button } from "@/components/ui";
import { fadeIn } from "@/lib/animations";
import { formatPrice } from "@/lib/utils";
import { useCart, useNotifications, useProduct } from "@/stores";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id;

  const { products, fetchProducts } = useProduct();
  const { addItem } = useCart();
  const { addNotification } = useNotifications();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        if (product.variants && product.variants.length > 0) {
          setSelectedVariant(product.variants[0]);
        }
        if (product.priceTiers && product.priceTiers.length > 0) {
          const sortedTiers = [...product.priceTiers].sort(
            (a, b) => a.quantity - b.quantity
          );
          setSelectedQuantity(sortedTiers[0].quantity);
        }
      }
    }
  }, [products, productId]);

  const getPriceForQuantity = (product: any, quantity: number) => {
    if (!product.priceTiers || product.priceTiers.length === 0) {
      return Number(product.basePrice) * quantity;
    }

    const priceTier = product.priceTiers.find(
      (tier) => tier.quantity === quantity
    );
    return priceTier
      ? Number(priceTier.price)
      : Number(product.basePrice) * quantity;
  };

  const handleQuantityChange = (newQuantity: number) => {
    setSelectedQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;

    addItem({
      productId: selectedProduct.id,
      variantId: selectedVariant.id,
      quantity: selectedQuantity,
      name: selectedProduct.name,
      price: getPriceForQuantity(selectedProduct, selectedQuantity),
      image: selectedProduct.image,
      flavor: selectedVariant.flavor,
      color: selectedVariant.color,
    });

    addNotification({
      type: "success",
      title: "Produit ajouté !",
      message: `${selectedQuantity} ${selectedProduct.name} ajouté au panier !`,
    });

    if (selectedProduct.priceTiers && selectedProduct.priceTiers.length > 0) {
      const sortedTiers = [...selectedProduct.priceTiers].sort(
        (a, b) => a.quantity - b.quantity
      );
      setSelectedQuantity(sortedTiers[0].quantity);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={fadeIn.initial}
          animate={fadeIn.animate}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 space-y-2">
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  🌿 CBD
                </div>
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  18+
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {selectedProduct.description}
              </p>
              {selectedProduct.dosage && (
                <div className="mt-4 inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  💊 {selectedProduct.dosage} par unité
                </div>
              )}
            </div>

            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <span className="text-4xl font-bold text-pink-600">
                  {formatPrice(
                    getPriceForQuantity(selectedProduct, selectedQuantity)
                  )}
                </span>
              </div>
            </div>

            {selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <FlavorSelector
                  variants={selectedProduct.variants.map((variant: any) => ({
                    ...variant,
                    product: selectedProduct,
                  }))}
                  selectedVariant={selectedVariant}
                  onVariantSelect={setSelectedVariant}
                />
              )}

            {selectedProduct.priceTiers &&
              selectedProduct.priceTiers.length > 0 && (
                <QuantitySelector
                  priceTiers={selectedProduct.priceTiers}
                  selectedQuantity={selectedQuantity}
                  onQuantityChange={handleQuantityChange}
                  className="mb-6"
                />
              )}

            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">En stock</span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              size="lg"
              className="w-full text-lg py-4"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ajouter au panier -{" "}
              {formatPrice(
                getPriceForQuantity(selectedProduct, selectedQuantity)
              )}
            </Button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Informations importantes
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Réservé aux adultes (18+)</li>
                <li>• Ne pas conduire après consommation</li>
                <li>• Interdit sous traitement médical</li>
                <li>• THC &lt; 0,3% (conforme UE)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
