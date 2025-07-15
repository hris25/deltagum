"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
  };
  variant: {
    id: string;
    flavor: string;
  };
}

interface Order {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  items: OrderItem[];
}

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
}

export default function OrderDetails({
  order,
  onBack,
  onUpdateStatus,
}: OrderDetailsProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!onUpdateStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
      setSelectedStatus(newStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "PAID":
        return "Payée";
      case "SHIPPED":
        return "Expédiée";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "En attente" },
    { value: "PAID", label: "Payée" },
    { value: "SHIPPED", label: "Expédiée" },
    { value: "DELIVERED", label: "Livrée" },
    { value: "CANCELLED", label: "Annulée" },
  ];

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
            <h2 className="text-2xl font-bold text-gray-900">
              Commande #{order.id.slice(-8)}
            </h2>
            <p className="text-gray-600">Détails de la commande</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isEditingStatus ? (
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
                disabled={isUpdating}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button
                size="sm"
                onClick={() => handleStatusChange(selectedStatus)}
                disabled={isUpdating || selectedStatus === order.status}
                className="flex items-center space-x-1"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Sauvegarder</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditingStatus(false);
                  setSelectedStatus(order.status);
                }}
                disabled={isUpdating}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingStatus(true)}
                className="flex items-center space-x-1"
              >
                <span>✏️</span>
                <span>Modifier statut</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={item.product.image || "/img/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/img/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <p className="text-sm text-gray-600 capitalize">
                          Saveur: {item.variant.flavor}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {Number(item.price).toFixed(2)}€ × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {(Number(item.price) * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle>Informations client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nom complet
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{order.customer.email}</p>
                  </div>
                </div>

                {order.shippingAddress.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Téléphone
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Adresse de livraison
                </label>
                <div className="flex items-start space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">
                      {order.shippingAddress.street}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.postalCode}{" "}
                      {order.shippingAddress.city}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Résumé de la commande */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium text-black">
                  {Number(order.totalAmount).toFixed(2)}€
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium text-black">Gratuite</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-black ">
                    Total
                  </span>
                  <span className="text-lg font-bold text-pink-600">
                    {Number(order.totalAmount).toFixed(2)}€
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de commande */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date de commande
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Numéro de commande
                </label>
                <p className="text-gray-900 font-mono">#{order.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Articles
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <Package className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {order.items.length} article(s)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="pb-2">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.status === "PENDING" && (
                <>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange("PAID")}
                    disabled={isUpdating}
                  >
                    <span className="mr-2">💳</span>
                    Marquer comme payée
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusChange("CANCELLED")}
                    disabled={isUpdating}
                  >
                    <span className="mr-2">❌</span>
                    Annuler la commande
                  </Button>
                </>
              )}

              {order.status === "PAID" && (
                <>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusChange("SHIPPED")}
                    disabled={isUpdating}
                  >
                    <span className="mr-2">🚚</span>
                    Marquer comme expédiée
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatusChange("CANCELLED")}
                    disabled={isUpdating}
                  >
                    <span className="mr-2">❌</span>
                    Annuler la commande
                  </Button>
                </>
              )}

              {order.status === "SHIPPED" && (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleStatusChange("DELIVERED")}
                  disabled={isUpdating}
                >
                  <span className="mr-2">📦</span>
                  Marquer comme livrée
                </Button>
              )}

              {(order.status === "DELIVERED" ||
                order.status === "CANCELLED") && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    {order.status === "DELIVERED"
                      ? "✅ Commande terminée"
                      : "❌ Commande annulée"}
                  </p>
                </div>
              )}

              {/* Bouton pour forcer l'édition du statut */}
              <div className="pt-3 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditingStatus(true)}
                  disabled={isUpdating}
                >
                  <span className="mr-2">✏️</span>
                  Modifier le statut manuellement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
