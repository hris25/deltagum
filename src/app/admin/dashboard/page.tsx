"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuth } from "@/stores/auth-store";
import { motion } from "framer-motion";
import { DollarSign, Package, Plus, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Admin components
import OrderDetails from "@/components/admin/OrderDetails";
import OrderList from "@/components/admin/OrderList";
import ProductDetails from "@/components/admin/ProductDetails";
import ProductFormAdvanced from "@/components/admin/ProductFormAdvanced";
import ProductList from "@/components/admin/ProductList";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout, isAdmin, checkAuth } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Product management states
  const [productView, setProductView] = useState<"list" | "form" | "details">(
    "list"
  );
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Customer management states
  const [customerView, setCustomerView] = useState<"list" | "details">("list");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Order management states
  const [orderView, setOrderView] = useState<"list" | "details">("list");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Stats state
  const [statsData, setStatsData] = useState({
    overview: {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      ordersGrowth: 0,
    },
    recentOrders: [],
    topProducts: [],
    monthlyStats: [],
  });

  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      console.log("🔄 Chargement des statistiques...");
      const response = await fetch("/api/admin/stats-simple");
      const data = await response.json();

      console.log("📊 Réponse API stats:", data);

      if (data.success) {
        setStatsData(data.data);
        console.log("✅ Statistiques mises à jour:", data.data.overview);
      } else {
        console.error("❌ Erreur API stats:", data.error);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des statistiques:", error);
    }
  };

  // Vérification simple des permissions
  useEffect(() => {
    checkAuth();
    loadStats(); // Charger les statistiques au montage
  }, []);

  // Pas de redirection automatique, on laisse l'utilisateur voir le debug

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Product management functions
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductView("form");
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setProductView("form");
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setProductView("details");
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      const url = selectedProduct
        ? `/api/products/${selectedProduct.id}`
        : "/api/products";

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setProductView("list");
        setSelectedProduct(null);
        // Refresh the product list
      } else {
        alert("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  const handleBackToProducts = () => {
    setProductView("list");
    setSelectedProduct(null);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "products":
        setActiveTab("products");
        break;
      case "orders":
        setActiveTab("orders");
        break;
      case "customers":
        setActiveTab("customers");
        break;
      default:
        break;
    }
  };

  // Customer management functions
  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setCustomerView("details");
  };

  const handleBackToCustomers = () => {
    setCustomerView("list");
    setSelectedCustomer(null);
  };

  // Order management functions
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderView("details");
  };

  const handleBackToOrders = () => {
    setOrderView("list");
    setSelectedOrder(null);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Mettre à jour l'ordre local
        setSelectedOrder((prev: any) => (prev ? { ...prev, status } : null));
        alert("Statut de la commande mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  // Debug info
  console.log("Dashboard - isAuthenticated:", isAuthenticated);
  console.log("Dashboard - user:", user);
  console.log("Dashboard - isAdmin():", isAdmin());

  // Affichage conditionnel : si pas admin, on montre le debug
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🔐 Accès Dashboard Admin
            </h2>

            <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">État actuel :</h3>
              <div className="space-y-2 text-sm">
                <p>✅ Authentifié: {isAuthenticated ? "Oui" : "Non"}</p>
                <p>
                  👤 Utilisateur:{" "}
                  {user ? `${user.firstName} ${user.lastName}` : "Aucun"}
                </p>
                <p>🎭 Rôle: {user?.role || "Aucun"}</p>
                <p>🔑 Admin: {isAdmin() ? "Oui" : "Non"}</p>
              </div>
            </div>

            <div className="space-y-3">
              {!isAuthenticated ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Vous devez vous connecter en tant qu'admin
                  </p>
                  <a
                    href="/auth"
                    className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                  >
                    Se connecter
                  </a>
                </div>
              ) : !isAdmin() ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Votre compte n'a pas les permissions admin
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              ) : null}

              <div className="pt-4 border-t">
                <a
                  href="/test-auth"
                  className="text-sm text-blue-600 hover:underline"
                >
                  🧪 Page de test d'authentification
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const stats = [
    {
      title: "Produits",
      value: statsData.overview.products.toString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Commandes",
      value: statsData.overview.orders.toString(),
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Clients",
      value: statsData.overview.customers.toString(),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Revenus",
      value: `€${statsData.overview.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  const menuItems = [
    { id: "overview", label: "Vue d'ensemble", icon: Package },
    { id: "products", label: "Produits", icon: Package },
    { id: "orders", label: "Commandes", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-[99]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
              >
                Deltagum Admin
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-700 hidden sm:block"
              >
                Bonjour, {user?.firstName} {user?.lastName}
              </motion.span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={slideIn.initial}
            animate={slideIn.animate}
            className="w-full lg:w-64 bg-white rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                      : "text-gray-900 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <motion.div
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                className="space-y-8"
              >
                {/* Statistiques du dashboard */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-black">
                    Statistiques
                  </h2>
                  <Button
                    onClick={loadStats}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Actualiser</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Produits
                    </h3>
                    <p className="text-3xl font-bold text-pink-600">
                      {statsData.overview.products}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Commandes
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {statsData.overview.orders}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Clients
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {statsData.overview.customers}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Revenus
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      €{statsData.overview.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="mb-3">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleAddProduct}
                        className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                      >
                        <Plus className="w-6 h-6" />
                        <span>Ajouter un produit</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("orders")}
                        className="h-20 flex flex-col items-center justify-center space-y-2"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        <span>Voir les commandes</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "products" && (
              <motion.div
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                className="space-y-6"
              >
                {productView === "list" && (
                  <ProductList
                    onAddProduct={handleAddProduct}
                    onEditProduct={handleEditProduct}
                    onViewProduct={handleViewProduct}
                  />
                )}

                {productView === "form" && (
                  <ProductFormAdvanced
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleBackToProducts}
                  />
                )}

                {productView === "details" && selectedProduct && (
                  <ProductDetails
                    product={selectedProduct}
                    onEdit={() => handleEditProduct(selectedProduct)}
                    onBack={handleBackToProducts}
                    onAddVariant={() => {
                      // TODO: Implement variant management
                      alert("Gestion des variantes à implémenter");
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                className="space-y-6"
              >
                {orderView === "list" && (
                  <OrderList
                    onViewOrder={(order) => {
                      setSelectedOrder(order);
                      setOrderView("details");
                    }}
                  />
                )}

                {orderView === "details" && selectedOrder && (
                  <OrderDetails
                    order={selectedOrder}
                    onBack={handleBackToOrders}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                )}
              </motion.div>
            )}

            {/* Autres onglets à implémenter */}
            {activeTab !== "overview" &&
              activeTab !== "products" &&
              activeTab !== "orders" && (
                <motion.div
                  initial={fadeIn.initial}
                  animate={fadeIn.animate}
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-12 text-center">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Section en développement
                      </h3>
                      <p className="text-gray-600">
                        Cette section sera bientôt disponible.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
