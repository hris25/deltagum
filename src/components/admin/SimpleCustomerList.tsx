"use client";

import { Button, Card, CardContent } from "@/components/ui";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar,
  ShoppingBag,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  orders?: any[];
}

interface SimpleCustomerListProps {
  onViewCustomer: (customer: Customer) => void;
}

export default function SimpleCustomerList({ onViewCustomer }: SimpleCustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers');
      const data = await response.json();
      
      if (data.success && data.data?.customers) {
        setCustomers(data.data.customers);
      } else {
        console.log('Aucun client trouvé ou erreur API');
        setCustomers([]);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des clients:', err);
      setCustomers([]);
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Gestion des Clients
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="text-black mt-4">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Gestion des Clients
          </h2>
          <p className="text-black">
            {customers.length} client(s) au total
          </p>
        </div>
        <Button onClick={fetchCustomers} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">
            Aucun client enregistré
          </h3>
          <p className="text-black mb-6">
            Les clients apparaîtront ici après leur première inscription sur le site.
          </p>
          <Button onClick={fetchCustomers}>
            Actualiser
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewCustomer(customer)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-black">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm">
                          <div className="flex items-center text-gray-700">
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Depuis {formatDate(customer.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-gray-700">Commandes</p>
                          <p className="text-xl font-bold text-black">{customer.orders?.length || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-700">Total dépensé</p>
                          <p className="text-xl font-bold text-green-600">0€</p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCustomer(customer);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
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
