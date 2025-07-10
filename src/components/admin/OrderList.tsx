"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Eye,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  items: OrderItem[];
}

interface OrderListProps {
  onViewOrder?: (order: Order) => void;
}

export default function OrderList({ onViewOrder }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("🔍 [ADMIN] Récupération de toutes les commandes...");

      const response = await fetch("/api/orders");
      const data = await response.json();

      console.log("📥 [ADMIN] Réponse API orders:", data);
      console.log("📊 [ADMIN] Statut de la réponse:", response.status);

      if (data.success) {
        const allOrders = data.data.orders || [];
        console.log("✅ [ADMIN] Commandes récupérées:", allOrders.length);
        console.log("📋 [ADMIN] Détails des commandes:", allOrders);
        setOrders(allOrders);
      } else {
        console.error(
          "❌ [ADMIN] Erreur lors du chargement des commandes:",
          data.error
        );
      }
    } catch (err) {
      console.error("❌ [ADMIN] Erreur de connexion:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case "TODAY":
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case "WEEK":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case "MONTH":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestion des Commandes
            </h2>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Commandes
          </h2>
          <p className="text-black">
            {filteredOrders.length} commande(s) au total
          </p>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black bg-white"
        >
          <option value="ALL">Tous les statuts ({orders.length})</option>
          <option value="PENDING">
            En attente ({orders.filter((o) => o.status === "PENDING").length})
          </option>
          <option value="PAID">
            Payées ({orders.filter((o) => o.status === "PAID").length})
          </option>
          <option value="SHIPPED">
            Expédiées ({orders.filter((o) => o.status === "SHIPPED").length})
          </option>
          <option value="DELIVERED">
            Livrées ({orders.filter((o) => o.status === "DELIVERED").length})
          </option>
          <option value="CANCELLED">
            Annulées ({orders.filter((o) => o.status === "CANCELLED").length})
          </option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-black bg-white"
        >
          <option value="ALL">Toutes les dates</option>
          <option value="TODAY">Aujourd'hui</option>
          <option value="WEEK">Cette semaine</option>
          <option value="MONTH">Ce mois</option>
        </select>

        <Button onClick={fetchOrders} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {/* Liste des Commandes */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "ALL" || dateFilter !== "ALL"
                ? "Aucune commande trouvée"
                : "Aucune commande enregistrée"}
            </h3>
            <p className="text-black">
              {searchTerm || statusFilter !== "ALL" || dateFilter !== "ALL"
                ? "Essayez de modifier vos filtres de recherche"
                : "Les commandes apparaîtront ici après les premiers achats"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onViewOrder?.(order)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        <ShoppingCart className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande #{order.id.slice(-8)}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>
                              {order.customer.firstName}{" "}
                              {order.customer.lastName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            <span>{order.items.length} article(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-2xl font-bold text-gray-900">
                        <DollarSign className="w-6 h-6 mr-1" />
                        {Number(order.totalAmount).toFixed(2)}€
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewOrder?.(order);
                        }}
                        className="mt-2"
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
                        <div
                          key={itemIndex}
                          className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1"
                        >
                          <span className="text-sm font-medium">
                            {item.quantity}x
                          </span>
                          <span className="text-sm text-gray-700">
                            {item.product.name}
                          </span>
                          {item.variant && (
                            <span className="text-xs text-gray-500">
                              ({item.variant.flavor})
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-sm text-gray-500">
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
