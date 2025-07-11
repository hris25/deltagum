"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Package, Plus } from "lucide-react";
import Image from "next/image";

interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
  onBack: () => void;
  onAddVariant: () => void;
}

export default function ProductDetails({
  product,
  onEdit,
  onBack,
  onAddVariant,
}: ProductDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-600">Détails du produit</p>
          </div>
        </div>
        <Button
          onClick={onEdit}
          className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nom
                  </label>
                  <p className="text-gray-900 font-medium">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Prix de base
                  </label>
                  <p className="text-gray-900 font-medium">
                    {product.price ? `${product.price}€` : "Variable"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Statut
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      product.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Dosage
                  </label>
                  <p className="text-gray-900 font-medium">
                    {(product as any).dosage || "Non spécifié"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Description
                </label>
                <p className="text-gray-900 mt-1">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Variantes ({product.variants?.length || 0})
                </CardTitle>
                <Button
                  size="sm"
                  onClick={onAddVariant}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une variante
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!product.variants || product.variants.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Aucune variante créée</p>
                  <Button size="sm" onClick={onAddVariant} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la première variante
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: variant.color }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {variant.flavor}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {variant.stock} • SKU: {variant.sku}
                          </p>
                        </div>
                      </div>
                      {variant.images && variant.images.length > 0 && (
                        <div className="mt-3 flex space-x-2">
                          {variant.images.slice(0, 3).map((image, index) => (
                            <div
                              key={index}
                              className="relative w-12 h-12 rounded-md overflow-hidden"
                            >
                              <Image
                                src={image}
                                alt={`${variant.flavor} ${index + 1}`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/img/placeholder.svg";
                                }}
                              />
                            </div>
                          ))}
                          {variant.images.length > 3 && (
                            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                +{variant.images.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="pb-2">Paliers de prix</CardTitle>
            </CardHeader>
            <CardContent>
              {!product.priceTiers || product.priceTiers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600">
                    Aucun palier de prix configuré
                  </p>
                  <p className="text-sm text-black mt-1">
                    Les paliers permettent d'offrir des réductions pour les
                    achats en quantité
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-black">
                  {product.priceTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">
                        {tier.quantity}{" "}
                        {tier.quantity === 1 ? "unité" : "unités"}
                      </span>
                      <span className="text-lg font-bold text-pink-600">
                        {tier.price}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Image */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="pb-2">Image principale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.image || "/img/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/img/placeholder.svg";
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="pb-2">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Saveures</span>
                <span className="font-medium text-black">
                  {product.variants?.length || 0}
                </span>
              </div>
              {/*<div className="flex justify-between">
                <span className="text-gray-600">Stock total</span>
                <span className="font-medium text-black">
                  {product.variants?.reduce(
                    (total, variant) => total + variant.stock,
                    0
                  ) || 0}
                </span>
              </div>*/}
              <div className="flex justify-between">
                <span className="text-gray-600">Paliers de prix</span>
                <span className="font-medium text-black">
                  {product.priceTiers?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
