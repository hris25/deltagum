"use client";

import { Button, Card, CardContent, Input } from "@/components/ui";
import { useAuth } from "@/stores";
import {
  Calendar,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  role: string;
  createdAt?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
  variant: {
    flavor: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        postalCode: user.postalCode || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const fetchOrders = async () => {
    if (!user?.id) {
      console.log("❌ Pas d'ID utilisateur pour récupérer les commandes");
      return;
    }

    console.log("🔍 Récupération des commandes pour l'utilisateur:", user.id);
    setLoadingOrders(true);

    try {
      const url = `/api/orders?customerId=${user.id}`;
      console.log("📡 URL de la requête:", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("📥 Réponse API orders:", data);
      console.log("📊 Statut de la réponse:", response.status);

      if (data.success) {
        const orders = data.data.orders || [];
        console.log("✅ Commandes récupérées:", orders.length);
        console.log("📋 Détails des commandes:", orders);
        setOrders(orders);
      } else {
        console.error("❌ Erreur dans la réponse API:", data.error);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des commandes:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Récupérer les commandes quand l'utilisateur est chargé
  useEffect(() => {
    if (user?.id && activeTab === "orders") {
      fetchOrders();
    }
  }, [user?.id, activeTab]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert("Profil mis à jour avec succès !");
        setIsEditing(false);
        // Recharger les données utilisateur
        await checkAuth();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header utilisateur */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-black flex items-center mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
                {user.role === "ADMIN" && (
                  <div className="mt-2 inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Administrateur
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="bg-white rounded-2xl shadow-xl mb-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "profile"
                    ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                <User className="w-5 h-5 inline-block mr-2" />
                Mon Profil
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "orders"
                    ? "text-pink-600 border-b-2 border-pink-600 bg-pink-50"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                <Package className="w-5 h-5 inline-block mr-2" />
                Mes Commandes
              </button>
            </div>
          </div>

          {/* Contenu des onglets */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                  Mes informations
                </h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Prénom *
                      </label>
                      <Input
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Votre prénom"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Nom *
                      </label>
                      <Input
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Votre nom"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Téléphone
                      </label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="06 12 34 56 78"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Adresse
                      </label>
                      <Input
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="123 Rue de la Paix"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Code postal
                      </label>
                      <Input
                        value={editForm.postalCode}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                        placeholder="75000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Ville
                      </label>
                      <Input
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="Paris"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    >
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-black">
                          Prénom
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-black">
                        {user.firstName || "Non renseigné"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-black">
                          Nom
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-black">
                        {user.lastName || "Non renseigné"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-black">
                          Email
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-black">
                        {user.email}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Phone className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-black">
                          Téléphone
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-black">
                        {user.phone || "Non renseigné"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <MapPin className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-black">
                          Adresse
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-black">
                        {user.address ? (
                          <>
                            {user.address}, {user.postalCode} {user.city}
                          </>
                        ) : (
                          "Non renseignée"
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  {user.createdAt && (
                    <Card className="md:col-span-2">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-medium text-black">
                            Membre depuis
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-black">
                          {formatDate(user.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Onglet Commandes */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Mes Commandes
              </h2>

              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-black">Chargement des commandes...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune commande
                  </h3>
                  <p className="text-gray-600">
                    Vous n'avez pas encore passé de commande.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-black">
                              Commande #{order.id.slice(-8)}
                            </h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-gray-600 mb-2">
                              <CreditCard className="w-4 h-4 mr-2" />
                              {(Number(order.totalAmount) || 0).toFixed(2)}€
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status === "PAID"
                                ? "Payée"
                                : order.status === "PENDING"
                                ? "En attente"
                                : order.status}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="font-medium text-black mb-3">
                            Articles commandés :
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-black">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Saveur: {item.variant.flavor} • Quantité:{" "}
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-medium text-black">
                                  {(Number(item.price) * item.quantity).toFixed(
                                    2
                                  )}
                                  €
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
