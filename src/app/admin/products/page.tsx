"use client";

import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  variants: Array<{
    id: string;
    flavor: string;
    price: number;
    stock: number;
  }>;
  images: string[];
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fonctions utilitaires locales
  const safeArray = <T,>(array: T[] | undefined | null): T[] => array || [];
  const formatPriceWithCurrency = (price: any): string => {
    const numPrice = Number(price || 0);
    return isNaN(numPrice) ? "0.00€" : `${numPrice.toFixed(2)}€`;
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement des produits admin avec cache...");
      
      // Utiliser le cache pour éviter les appels multiples
      const { cachedFetch } = await import("@/lib/cache");
      const data = await cachedFetch.products() as any;

      if (data.success) {
        let productsArray = [];
        if (Array.isArray(data.data)) {
          productsArray = data.data;
        } else if (data.data && Array.isArray(data.data.products)) {
          productsArray = data.data.products;
        }
        setProducts(productsArray);
        console.log("✅ Produits admin chargés:", productsArray.length);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const filteredProducts = safeArray(products).filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion des produits
          </h1>
          <p className="text-gray-600 mt-1">
            {safeArray(products).length} produit{safeArray(products).length > 1 ? 's' : ''} au total
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={loadProducts}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Actualiser</span>
          </Button>
          
          <Button
            onClick={handleAddProduct}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau produit</span>
          </Button>
        </div>
      </motion.div>

      {/* Recherche */}
      <motion.div
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-black focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Liste des produits */}
      <motion.div
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-2 text-black">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-black">Aucun produit trouvé</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            if (!product || !product.id || !product.name) return null;
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image du produit */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
                  {safeArray(product.images).length > 0 ? (
                    <img
                      src={safeArray(product.images)[0].startsWith('/') ? safeArray(product.images)[0] : `/${safeArray(product.images)[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Erreur de chargement image:', safeArray(product.images)[0]);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Package className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Prix de base:</span>
                      <span className="font-medium text-black">
                        {formatPriceWithCurrency(product.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Variantes:</span>
                      <span className="font-medium text-black">
                        {safeArray(product.variants).length}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditProduct(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Modal de formulaire produit */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  size="sm"
                >
                  Fermer
                </Button>
              </div>
              
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Formulaire de {editingProduct ? 'modification' : 'création'} de produit
                </p>
                <p className="text-sm text-gray-500">
                  Cette fonctionnalité sera implémentée prochainement
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
