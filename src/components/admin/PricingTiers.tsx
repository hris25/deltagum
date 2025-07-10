"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  DollarSign,
  Package
} from "lucide-react";
import { useState } from "react";

interface PricingTier {
  id?: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface PricingTiersProps {
  tiers: PricingTier[];
  onTiersChange: (tiers: PricingTier[]) => void;
  currency?: string;
}

export default function PricingTiers({ tiers, onTiersChange, currency = "EUR" }: PricingTiersProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTier, setNewTier] = useState<PricingTier>({
    quantity: 1,
    price: 0,
    discount: 0
  });

  const handleAddTier = () => {
    if (newTier.quantity > 0 && newTier.price > 0) {
      const sortedTiers = [...tiers, { ...newTier, id: Date.now().toString() }]
        .sort((a, b) => a.quantity - b.quantity);
      onTiersChange(sortedTiers);
      setNewTier({
        quantity: 1,
        price: 0,
        discount: 0
      });
    }
  };

  const handleEditTier = (index: number, updatedTier: PricingTier) => {
    const updatedTiers = tiers.map((tier, i) => 
      i === index ? updatedTier : tier
    ).sort((a, b) => a.quantity - b.quantity);
    onTiersChange(updatedTiers);
    setEditingIndex(null);
  };

  const handleDeleteTier = (index: number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    onTiersChange(updatedTiers);
  };

  const calculateDiscount = (basePrice: number, tierPrice: number) => {
    if (basePrice <= 0) return 0;
    return Math.round(((basePrice - tierPrice) / basePrice) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const basePrice = tiers.find(t => t.quantity === 1)?.price || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prix par palier</h3>
          <p className="text-sm text-gray-600">Définissez des prix dégressifs selon la quantité</p>
        </div>
        <span className="text-sm text-gray-600">{tiers.length} palier(s)</span>
      </div>

      {/* Aperçu des économies */}
      {tiers.length > 1 && basePrice > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-800">Économies maximales</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tiers.slice(1).map((tier, index) => {
                const discount = calculateDiscount(basePrice, tier.price);
                const savings = (basePrice - tier.price) * tier.quantity;
                return (
                  <div key={tier.id || index} className="text-center">
                    <p className="text-sm text-gray-600">{tier.quantity} unités</p>
                    <p className="font-semibold text-green-700">-{discount}%</p>
                    <p className="text-xs text-gray-500">
                      Économie: {formatCurrency(savings)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des paliers existants */}
      <div className="space-y-3">
        {tiers.map((tier, index) => (
          <Card key={tier.id || index} className={tier.quantity === 1 ? "border-blue-200 bg-blue-50" : ""}>
            <CardContent className="p-4">
              {editingIndex === index ? (
                <EditTierForm
                  tier={tier}
                  onSave={(updatedTier) => handleEditTier(index, updatedTier)}
                  onCancel={() => setEditingIndex(null)}
                  currency={currency}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {tier.quantity} {tier.quantity === 1 ? 'unité' : 'unités'}
                      </span>
                      {tier.quantity === 1 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Prix de base
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(tier.price)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(tier.price / tier.quantity)} / unité
                      </p>
                      {tier.quantity > 1 && basePrice > 0 && (
                        <p className="text-sm text-green-600">
                          -{calculateDiscount(basePrice, tier.price / tier.quantity)}% par unité
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {tier.quantity !== 1 && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteTier(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulaire d'ajout de nouveau palier */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un palier de prix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité
              </label>
              <Input
                type="number"
                min="1"
                value={newTier.quantity}
                onChange={(e) => setNewTier(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix total ({currency})
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newTier.price}
                onChange={(e) => setNewTier(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="Ex: 15.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {newTier.quantity > 0 && newTier.price > 0 
                  ? formatCurrency(newTier.price / newTier.quantity)
                  : formatCurrency(0)
                }
              </div>
            </div>
          </div>

          {/* Aperçu de l'économie */}
          {newTier.quantity > 1 && newTier.price > 0 && basePrice > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">
                  Économie par rapport au prix unitaire de base:
                </span>
                <span className="font-semibold text-green-800">
                  -{calculateDiscount(basePrice, newTier.price / newTier.quantity)}%
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Le client économise {formatCurrency((basePrice * newTier.quantity) - newTier.price)} 
                en achetant {newTier.quantity} unités
              </p>
            </div>
          )}

          <Button
            onClick={handleAddTier}
            disabled={newTier.quantity <= 0 || newTier.price <= 0 || tiers.some(t => t.quantity === newTier.quantity)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le palier
          </Button>

          {tiers.some(t => t.quantity === newTier.quantity) && (
            <p className="text-sm text-red-600 text-center">
              Un palier existe déjà pour cette quantité
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Composant pour éditer un palier existant
function EditTierForm({ 
  tier, 
  onSave, 
  onCancel, 
  currency 
}: {
  tier: PricingTier;
  onSave: (tier: PricingTier) => void;
  onCancel: () => void;
  currency: string;
}) {
  const [editedTier, setEditedTier] = useState(tier);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité
          </label>
          <Input
            type="number"
            min="1"
            value={editedTier.quantity}
            onChange={(e) => setEditedTier(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            disabled={tier.quantity === 1} // Ne pas permettre de modifier le palier de base
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix total
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={editedTier.price}
            onChange={(e) => setEditedTier(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Prix unitaire: {editedTier.quantity > 0 ? formatCurrency(editedTier.price / editedTier.quantity) : formatCurrency(0)}
      </div>

      <div className="flex space-x-2">
        <Button size="sm" onClick={() => onSave(editedTier)}>
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
