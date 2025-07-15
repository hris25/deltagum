"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
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

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("🔍 [ADMIN] Récupération des commandes avec pagination...");

      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateFilter !== "ALL" && { dateFilter }),
      });

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      console.log("📥 [ADMIN] Réponse API orders:", data);

      if (data.success) {
        const orders = data.data.orders || [];
        const total = data.data.totalOrders || 0;

        console.log("✅ [ADMIN] Commandes récupérées:", orders.length);
        console.log("📊 [ADMIN] Total des commandes:", total);

        setOrders(orders);
        setTotalOrders(total);
        setTotalPages(Math.ceil(total / ordersPerPage));
      } else {
        console.error(
          "❌ [ADMIN] Erreur lors du chargement des commandes:",
          data.error
        );
        setOrders([]);
      }
    } catch (err) {
      console.error("❌ [ADMIN] Erreur de connexion:", err);
      setOrders([]);
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

  // Fonction pour réinitialiser la pagination lors du changement de filtres
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1); // Retour à la première page

    switch (filterType) {
      case "status":
        setStatusFilter(value);
        break;
      case "search":
        setSearchTerm(value);
        break;
      case "date":
        setDateFilter(value);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par client, email, ID..."
            value={searchTerm}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="PAID">Payées</option>
          <option value="SHIPPED">Expédiées</option>
          <option value="DELIVERED">Livrées</option>
          <option value="CANCELLED">Annulées</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
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
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des commandes...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "ALL" || dateFilter !== "ALL"
                ? "Aucune commande trouvée"
                : "Aucune commande enregistrée"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "ALL" || dateFilter !== "ALL"
                ? "Essayez de modifier vos filtres de recherche"
                : "Les commandes apparaîtront ici après les premiers achats"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Commande #{order.id.slice(-8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.customer.firstName}{" "}
                                {order.customer.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.customer.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatCurrency(order.totalAmount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.items.length} article
                                {order.items.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button
                          onClick={() => onViewOrder?.(order)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir détails</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de {(currentPage - 1) * ordersPerPage + 1} à{" "}
                {Math.min(currentPage * ordersPerPage, totalOrders)} sur{" "}
                {totalOrders} commandes
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
