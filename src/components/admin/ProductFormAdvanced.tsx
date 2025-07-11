"use client";

import { Button, Card, CardContent, Input } from "@/components/ui";
import { Product } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Save,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PricingTiers from "./PricingTiers";
import VariantManager from "./VariantManager";

interface ProductVariant {
  id?: string;
  flavor: string;
  color: string;
  stock: number;
  sku: string;
  images: string[];
}

interface PricingTier {
  id?: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface ProductFormAdvancedProps {
  product?: Product | null;
  onSave: (product: any) => void;
  onCancel: () => void;
}

export default function ProductFormAdvanced({
  product,
  onSave,
  onCancel,
}: ProductFormAdvancedProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dosage: "",
    image: "",
    active: true,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { quantity: 1, price: 8.0 }, // Prix de base par défaut
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        dosage: (product as any).dosage || "",
        image: product.image || "",
        active: product.active ?? true,
      });

      // Charger les variants existants
      if (product.variants) {
        setVariants(
          product.variants.map((v) => ({
            id: v.id,
            flavor: v.flavor || "",
            color: v.color || "#ff6b9d",
            stock: v.stock || 0,
            sku: v.sku || "",
            images: v.images || [],
          }))
        );
      }

      // Charger les prix par palier existants
      if (product.priceTiers) {
        setPricingTiers(product.priceTiers);
      }
    }
  }, [product]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert("Erreur lors de l'upload");
      }
    } catch (error) {
      alert("Erreur lors de l'upload");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        variants,
        pricingTiers,
        basePrice: pricingTiers.find((t) => t.quantity === 1)?.price || 0,
        // Utiliser une image par défaut si aucune image n'est fournie
        image:
          formData.image ||
          (typeof window !== "undefined"
            ? `${window.location.origin}/img/placeholder.svg`
            : "/img/placeholder.svg"),
      };

      await onSave(productData);
    } catch (error) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "Informations générales", icon: Package },
    { id: "variants", label: "Variants", icon: Package },
    { id: "pricing", label: "Prix par palier", icon: Package },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <p className="text-gray-600">
              {product
                ? "Modifiez les informations du produit"
                : "Créez un nouveau produit avec variants et prix par palier"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation par onglets */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-pink-500 text-pink-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Onglet Informations générales */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du produit *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Ex: Cookie Delta-9"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage
                      </label>
                      <Input
                        value={formData.dosage}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dosage: e.target.value,
                          }))
                        }
                        placeholder="Ex: 5mg THC"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none text-gray-900 placeholder:text-gray-700"
                      placeholder="Description détaillée du produit..."
                      minLength={10}
                    />
                  </div>

                  {/* Image principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.image ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image
                            src={formData.image}
                            alt="Produit"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/img/placeholder.svg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Si c'est une image uploadée, supprimer le fichier
                              if (
                                formData.image &&
                                formData.image.includes("/uploads/")
                              ) {
                                const filename = formData.image
                                  .split("/")
                                  .pop();
                                if (filename) {
                                  fetch(`/api/upload/${filename}`, {
                                    method: "DELETE",
                                  }).catch((err) =>
                                    console.error(
                                      "Erreur lors de la suppression:",
                                      err
                                    )
                                  );
                                }
                              }
                              setFormData((prev) => ({ ...prev, image: "" }));
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4 text-gray-700" />
                          <span className="text-gray-900">
                            Choisir une image
                          </span>
                        </label>
                        <p className="text-xs text-gray-700 mt-1">
                          JPG, PNG jusqu'à 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          active: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="active"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Produit actif (visible sur le site)
                    </label>
                  </div>
                </div>
              )}

              {/* Onglet Variants */}
              {activeTab === "variants" && (
                <VariantManager
                  variants={variants}
                  onVariantsChange={setVariants}
                  productId={product?.id}
                />
              )}

              {/* Onglet Prix par palier */}
              {activeTab === "pricing" && (
                <PricingTiers
                  tiers={pricingTiers}
                  onTiersChange={setPricingTiers}
                  currency="EUR"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.name}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
