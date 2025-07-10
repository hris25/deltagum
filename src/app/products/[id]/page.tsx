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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // Réinitialiser l'index d'image quand on change de variante
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedVariant]);

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
            {/* Carrousel d'images de la variante sélectionnée */}
            {selectedVariant &&
            selectedVariant.images &&
            selectedVariant.images.length > 0 ? (
              <div className="space-y-4">
                {/* Image principale */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
                  <img
                    src={selectedVariant.images[selectedImageIndex]}
                    alt={`${selectedVariant.name} - Image ${
                      selectedImageIndex + 1
                    }`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/img/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      🌿 THC
                    </div>
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      18+
                    </div>
                  </div>
                </div>

                {/* Miniatures */}
                {selectedVariant.images.length > 1 && (
                  <div className="flex justify-center space-x-3">
                    {selectedVariant.images.map(
                      (image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-pink-500 ring-2 ring-pink-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedVariant.name} - Miniature ${
                              index + 1
                            }`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/img/placeholder.svg";
                            }}
                          />
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Informations produit pour combler l'espace */}
                <div className="space-y-4 mt-6">
                  {/* Caractéristiques principales */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Caractéristiques
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">THC</span>
                        <span className="font-medium text-green-600">
                          &lt; 0,3%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delta-9 THC</span>
                        <span className="font-medium text-blue-600">
                          &lt; 0,3%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origine</span>
                        <span className="font-medium">UE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certification</span>
                        <span className="font-medium text-green-600">Bio</span>
                      </div>
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Avantages Deltagum
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Goût naturel et authentique
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Dosage précis et constant
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Texture fondante unique
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Emballage discret et pratique
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Fallback si pas d'images de variante
              <div className="space-y-6">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
                  <img
                    src={selectedProduct.image || "/img/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/img/placeholder.svg";
                    }}
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

                {/* Informations produit pour le fallback aussi */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Caractéristiques
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">THC</span>
                        <span className="font-medium text-green-600">
                          &lt; 0,3%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CBD</span>
                        <span className="font-medium text-blue-600">
                          Premium
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origine</span>
                        <span className="font-medium">UE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
