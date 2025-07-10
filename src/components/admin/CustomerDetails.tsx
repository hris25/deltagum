"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Crown,
  Star,
  TrendingUp,
  Package
} from "lucide-react";

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  role: string;
  createdAt: string;
  orders: any[];
  loyalty?: {
    points: number;
    level: string;
  };
}

interface CustomerDetailsProps {
  customer: Customer;
  onBack: () => void;
}

export default function CustomerDetails({ customer, onBack }: CustomerDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalSpent = customer.orders?.reduce((total, order) => total + (order.total || 0), 0) || 0;
  const averageOrderValue = customer.orders?.length > 0 ? totalSpent / customer.orders.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-gray-600">Détails du client</p>
          </div>
        </div>
        {customer.role === 'ADMIN' && (
          <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
            <Crown className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Administrateur</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prénom</label>
                  <p className="text-gray-900 font-medium">{customer.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-gray-900 font-medium">{customer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{customer.phone || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Adresse</label>
                <div className="flex items-start space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{customer.address || 'Non renseignée'}</p>
                    {customer.postalCode && customer.city && (
                      <p className="text-gray-600">{customer.postalCode} {customer.city}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Membre depuis</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des commandes */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes ({customer.orders?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!customer.orders || customer.orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucune commande passée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.orders.slice(0, 5).map((order, index) => (
                    <div
                      key={order.id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Commande #{order.id?.slice(-8) || `${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} article(s) • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(order.total || 0)}
                        </p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {customer.orders.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        Voir toutes les commandes ({customer.orders.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec statistiques */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-pink-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Total dépensé</span>
                </div>
                <p className="text-2xl font-bold text-pink-600">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{customer.orders?.length || 0}</p>
                  <p className="text-xs text-gray-600">Commandes</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(averageOrderValue)}
                  </p>
                  <p className="text-xs text-gray-600">Panier moyen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programme de fidélité */}
          {customer.loyalty ? (
            <Card>
              <CardHeader>
                <CardTitle>Programme de fidélité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Niveau {customer.loyalty.level}
                  </h3>
                  <p className="text-2xl font-bold text-pink-600 mb-2">
                    {customer.loyalty.points} points
                  </p>
                  <p className="text-sm text-gray-600">
                    Points de fidélité accumulés
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Programme de fidélité</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Non inscrit au programme</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
              <Button variant="outline" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Voir toutes les commandes
              </Button>
              {customer.role === 'USER' && (
                <Button variant="outline" className="w-full">
                  <Crown className="w-4 h-4 mr-2" />
                  Promouvoir admin
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
