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
  Calendar,
  Crown,
  Eye,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

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

interface CustomerListProps {
  onViewCustomer: (customer: Customer) => void;
}

export default function CustomerList({ onViewCustomer }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "USER" | "ADMIN">("ALL");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/customers");
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data.customers || []);
      } else {
        console.error("Erreur lors du chargement des clients");
      }
    } catch (err) {
      console.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "ALL" || customer.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestion des Clients
            </h2>
            <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
            Gestion des Clients
          </h2>
          <p className="text-black">
            {filteredCustomers.length} client(s) au total
          </p>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as "ALL" | "USER" | "ADMIN")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="ALL">Tous les rôles</option>
            <option value="USER">Clients</option>
            <option value="ADMIN">Administrateurs</option>
          </select>
          <Button onClick={fetchCustomers} variant="outline" size="sm">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Liste des Clients */}
      {filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Aucun client trouvé" : "Aucun client enregistré"}
            </h3>
            <p className="text-black">
              {searchTerm
                ? "Essayez avec un autre terme de recherche"
                : "Les clients apparaîtront ici après leur inscription"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onViewCustomer(customer)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.firstName.charAt(0)}
                        {customer.lastName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {customer.firstName} {customer.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    {customer.role === "ADMIN" && (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Informations de contact */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{customer.phone || "Non renseigné"}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">
                        {customer.address
                          ? `${customer.address}, ${customer.postalCode} ${customer.city}`
                          : "Adresse non renseignée"}
                      </span>
                    </div>

                    {/* Statistiques */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        <span>{customer.orders?.length || 0} commande(s)</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Depuis {formatDate(customer.createdAt)}</span>
                      </div>
                    </div>

                    {/* Programme de fidélité */}
                    {customer.loyalty && (
                      <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Niveau {customer.loyalty.level}
                          </span>
                          <span className="text-sm font-bold text-pink-600">
                            {customer.loyalty.points} pts
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCustomer(customer);
                      }}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les détails
                    </Button>
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
