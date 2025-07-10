"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Calendar,
  Package,
  Eye,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    quantity: number;
    price: number;
    product: {
      name: string;
    };
    variant?: {
      flavor: string;
    };
  }>;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders/user');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminée';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulée';
      case 'PROCESSING':
        return 'En cours';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">Mes Commandes</h2>
        </div>
        
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-black">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Mes Commandes</h2>
          <p className="text-black">{orders.length} commande(s) au total</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">
            Aucune commande pour le moment
          </h3>
          <p className="text-black mb-6">
            Découvrez nos produits Deltagum et passez votre première commande !
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        <Package className="w-6 h-6" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-black">
                            Commande #{order.id.slice(-8)}
                          </h3>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm">
                          <div className="flex items-center text-black">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-black">
                            <Package className="w-4 h-4 mr-1" />
                            <span>{order.items.length} article(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black mb-2">
                        {formatCurrency(order.total)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </div>
                  </div>
                  
                  {/* Aperçu des articles */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {order.items.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1">
                          <span className="text-sm font-medium text-black">{item.quantity}x</span>
                          <span className="text-sm text-black">{item.product.name}</span>
                          {item.variant && (
                            <span className="text-xs text-gray-600">({item.variant.flavor})</span>
                          )}
                          <span className="text-xs text-gray-600">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-gray-600">
                          +{order.items.length - 3} autre(s)
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
