"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { Download, Edit, Plus, Save, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductVariant {
  id?: string;
  flavor: string;
  color: string;
  stock: number;
  sku: string;
  images: string[];
}

interface VariantManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  productId?: string;
}

export default function VariantManager({
  variants,
  onVariantsChange,
  productId,
}: VariantManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    flavor: "",
    color: "#ff6b9d",
    stock: 0,
    sku: "", // Sera généré automatiquement
    images: [],
  });

  const flavors = [
    { name: "Fraise", color: "#ff6b9d" },
    { name: "Myrtille", color: "#4dabf7" },
    { name: "Pomme", color: "#51cf66" },
    { name: "Orange", color: "#ff922b" },
    { name: "Citron", color: "#ffd43b" },
    { name: "Raisin", color: "#9775fa" },
  ];

  // Fonction pour générer un SKU automatiquement
  const generateSKU = (flavor: string) => {
    if (!flavor) return "";

    // Convertir en majuscules et remplacer les espaces par des tirets
    const flavorCode = flavor.toUpperCase().replace(/\s+/g, "-");

    // Ajouter un identifiant unique basé sur la date
    const uniqueId = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    return `DELTA-${flavorCode}-${uniqueId}`;
  };

  const handleAddVariant = async () => {
    if (newVariant.flavor) {
      const generatedSKU = generateSKU(newVariant.flavor);
      const variantToAdd = {
        ...newVariant,
        sku: generatedSKU,
      };

      if (productId) {
        // Créer via API si on a un productId
        try {
          const response = await fetch(`/api/products/${productId}/variants`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(variantToAdd),
          });

          if (!response.ok) {
            const data = await response.json();
            alert(data.error || "Erreur lors de la création");
            return;
          }

          const data = await response.json();
          const updatedVariants = [...variants, data.data];
          onVariantsChange(updatedVariants);
        } catch (error) {
          alert("Erreur de connexion");
          return;
        }
      } else {
        // Ajouter localement pour les nouveaux produits
        const updatedVariants = [
          ...variants,
          {
            ...variantToAdd,
            id: Date.now().toString(),
          },
        ];
        onVariantsChange(updatedVariants);
      }

      setNewVariant({
        flavor: "",
        color: "#ff6b9d",
        stock: 0,
        sku: "",
        images: [],
      });
    }
  };

  const handleEditVariant = async (
    index: number,
    updatedVariant: ProductVariant
  ) => {
    if (updatedVariant.id && productId) {
      // Mettre à jour via API si la variante existe en base
      try {
        const response = await fetch(
          `/api/products/${productId}/variants/${updatedVariant.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedVariant),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.error || "Erreur lors de la mise à jour");
          return;
        }

        const data = await response.json();
        const updatedVariants = variants.map((variant, i) =>
          i === index ? data.data : variant
        );
        onVariantsChange(updatedVariants);
      } catch (error) {
        alert("Erreur de connexion");
        return;
      }
    } else {
      // Mettre à jour localement
      const updatedVariants = variants.map((variant, i) =>
        i === index ? updatedVariant : variant
      );
      onVariantsChange(updatedVariants);
    }

    setEditingIndex(null);
  };

  const handleDeleteVariant = async (index: number) => {
    const variant = variants[index];

    if (variant.id && productId) {
      // Supprimer via API si la variante existe en base
      try {
        const response = await fetch(
          `/api/products/${productId}/variants/${variant.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.error || "Erreur lors de la suppression");
          return;
        }
      } catch (error) {
        alert("Erreur de connexion");
        return;
      }
    }

    // Supprimer localement
    const updatedVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(updatedVariants);
  };

  const handleBulkDelete = async () => {
    if (selectedVariants.length === 0) return;

    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedVariants.length} variante(s) ?`
      )
    ) {
      return;
    }

    if (productId) {
      try {
        const response = await fetch(
          `/api/products/${productId}/variants/bulk`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ variantIds: selectedVariants }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          alert(data.error || "Erreur lors de la suppression");
          return;
        }
      } catch (error) {
        alert("Erreur de connexion");
        return;
      }
    }

    // Supprimer localement
    const updatedVariants = variants.filter(
      (v) => !selectedVariants.includes(v.id || "")
    );
    onVariantsChange(updatedVariants);
    setSelectedVariants([]);
  };

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const handleSelectAll = () => {
    const allIds = variants.map((v) => v.id).filter(Boolean) as string[];
    setSelectedVariants(
      selectedVariants.length === allIds.length ? [] : allIds
    );
  };

  const handleExportVariants = () => {
    const dataStr = JSON.stringify(variants, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `variants-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImageUpload = async (file: File, variantIndex?: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        if (variantIndex !== undefined) {
          // Ajouter l'image à un variant existant
          const updatedVariants = variants.map((variant, i) =>
            i === variantIndex
              ? { ...variant, images: [...variant.images, data.url] }
              : variant
          );
          onVariantsChange(updatedVariants);
        } else {
          // Ajouter l'image au nouveau variant
          setNewVariant((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        }
      }
    } catch (error) {
      alert("Erreur lors de l'upload de l'image");
    }
  };

  const removeImage = (variantIndex: number | null, imageIndex: number) => {
    if (variantIndex === null) {
      // Supprimer de newVariant
      setNewVariant((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== imageIndex),
      }));
    } else {
      // Supprimer d'un variant existant
      const updatedVariants = variants.map((variant, i) =>
        i === variantIndex
          ? {
              ...variant,
              images: variant.images.filter((_, imgI) => imgI !== imageIndex),
            }
          : variant
      );
      onVariantsChange(updatedVariants);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Variants du produit
        </h3>
        <div className="flex items-center space-x-4">
          {selectedVariants.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedVariants.length} sélectionné(s)
              </span>
              <Button
                onClick={handleBulkDelete}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </Button>
            </div>
          )}
          <span className="text-sm text-gray-600">
            {variants.length} variant(s)
          </span>
        </div>
      </div>

      {/* Actions en lot */}
      {variants.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Button onClick={handleSelectAll} variant="outline" size="sm">
              {selectedVariants.length === variants.filter((v) => v.id).length
                ? "Désélectionner tout"
                : "Sélectionner tout"}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleExportVariants} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      )}

      {/* Liste des variants existants */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <Card key={variant.id || index}>
            <CardContent className="p-4">
              {editingIndex === index ? (
                <EditVariantForm
                  variant={variant}
                  onSave={(updatedVariant) =>
                    handleEditVariant(index, updatedVariant)
                  }
                  onCancel={() => setEditingIndex(null)}
                  onImageUpload={(file) => handleImageUpload(file, index)}
                  onRemoveImage={(imageIndex) => removeImage(index, imageIndex)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {variant.id && (
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(variant.id)}
                        onChange={() => handleSelectVariant(variant.id!)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                    )}
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: variant.color }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {variant.flavor}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Stock: {variant.stock} • SKU: {variant.sku}
                      </p>
                    </div>
                    {variant.images.length > 0 && (
                      <div className="flex space-x-1">
                        {variant.images.slice(0, 3).map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="relative w-8 h-8 rounded overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`${variant.flavor} ${imgIndex + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/img/placeholder.svg";
                              }}
                            />
                          </div>
                        ))}
                        {variant.images.length > 3 && (
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              +{variant.images.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteVariant(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulaire d'ajout de nouveau variant */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un variant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saveur
              </label>
              <select
                value={newVariant.flavor}
                onChange={(e) => {
                  const selectedFlavor = flavors.find(
                    (f) => f.name === e.target.value
                  );
                  setNewVariant((prev) => ({
                    ...prev,
                    flavor: e.target.value,
                    color: selectedFlavor?.color || prev.color,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900"
              >
                <option value="" className="text-gray-700">
                  Sélectionner une saveur
                </option>
                {flavors.map((flavor) => (
                  <option key={flavor.name} value={flavor.name}>
                    {flavor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <Input
                type="number"
                min="0"
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={newVariant.color}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={newVariant.color}
                  onChange={(e) =>
                    setNewVariant((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  placeholder="#ff6b9d"
                />
              </div>
            </div>
          </div>

          {/* Images du variant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du variant
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
                id="variant-image-upload"
              />
              <label
                htmlFor="variant-image-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 text-gray-700" />
                <span className="text-gray-900">Ajouter une image</span>
              </label>
            </div>

            {newVariant.images.length > 0 && (
              <div className="flex space-x-2 mt-3">
                {newVariant.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Variant ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(null, index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddVariant}
            disabled={!newVariant.flavor}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le variant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour éditer un variant existant
function EditVariantForm({
  variant,
  onSave,
  onCancel,
  onImageUpload,
  onRemoveImage,
}: {
  variant: ProductVariant;
  onSave: (variant: ProductVariant) => void;
  onCancel: () => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: (imageIndex: number) => void;
}) {
  const [editedVariant, setEditedVariant] = useState(variant);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          value={editedVariant.flavor}
          onChange={(e) =>
            setEditedVariant((prev) => ({ ...prev, flavor: e.target.value }))
          }
          placeholder="Saveur"
        />
        <Input
          value={editedVariant.sku}
          onChange={(e) =>
            setEditedVariant((prev) => ({ ...prev, sku: e.target.value }))
          }
          placeholder="SKU"
        />
        <Input
          type="number"
          value={editedVariant.stock}
          onChange={(e) =>
            setEditedVariant((prev) => ({
              ...prev,
              stock: parseInt(e.target.value) || 0,
            }))
          }
          placeholder="Stock"
        />
      </div>

      {/* Images */}
      {editedVariant.images.length > 0 && (
        <div className="flex space-x-2">
          {editedVariant.images.map((image, index) => (
            <div
              key={index}
              className="relative w-12 h-12 rounded overflow-hidden"
            >
              <Image
                src={image}
                alt={`${editedVariant.flavor} ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
            className="hidden"
            id={`edit-variant-image-${variant.id}`}
          />
          <label
            htmlFor={`edit-variant-image-${variant.id}`}
            className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </label>
        </div>
      )}

      <div className="flex space-x-2">
        <Button size="sm" onClick={() => onSave(editedVariant)}>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  );
}
