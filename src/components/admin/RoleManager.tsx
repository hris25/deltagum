"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { motion } from "framer-motion";
import { 
  Shield, 
  User, 
  Crown, 
  Star,
  Edit,
  Trash2,
  Plus,
  Check,
  X
} from "lucide-react";
import { useState } from "react";

interface UserRole {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
  lastLogin?: string;
}

interface RoleManagerProps {
  users: UserRole[];
  onUpdateRole: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
  currentUserRole: string;
}

export default function RoleManager({ users, onUpdateRole, onDeleteUser, currentUserRole }: RoleManagerProps) {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return Crown;
      case 'ADMIN':
        return Shield;
      default:
        return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  const canEditRole = (targetRole: string) => {
    if (currentUserRole === 'SUPER_ADMIN') return true;
    if (currentUserRole === 'ADMIN' && targetRole === 'USER') return true;
    return false;
  };

  const handleStartEdit = (user: UserRole) => {
    setEditingUser(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveEdit = () => {
    if (editingUser && selectedRole) {
      onUpdateRole(editingUser, selectedRole);
      setEditingUser(null);
      setSelectedRole('');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Rôles</h2>
          <p className="text-gray-600">{users.length} utilisateur(s) au total</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Statistiques des rôles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['USER', 'ADMIN', 'SUPER_ADMIN'].map((role) => {
          const count = users.filter(u => u.role === role).length;
          const Icon = getRoleIcon(role);
          
          return (
            <Card key={role}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {getRoleLabel(role)}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    role === 'SUPER_ADMIN' ? 'bg-purple-500' :
                    role === 'ADMIN' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs et Rôles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => {
              const Icon = getRoleIcon(user.role);
              const isEditing = editingUser === user.id;
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Membre depuis {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                          <option value="USER">Utilisateur</option>
                          <option value="ADMIN">Administrateur</option>
                          {currentUserRole === 'SUPER_ADMIN' && (
                            <option value="SUPER_ADMIN">Super Admin</option>
                          )}
                        </select>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {canEditRole(user.role) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {currentUserRole === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN' && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => onDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permissions par rôle */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions par Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Utilisateur
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Voir les produits</li>
                <li>• Passer des commandes</li>
                <li>• Gérer son profil</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Administrateur
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Toutes les permissions utilisateur</li>
                <li>• Gérer les produits</li>
                <li>• Gérer les commandes</li>
                <li>• Voir les clients</li>
                <li>• Uploader des images</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Super Admin
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Toutes les permissions admin</li>
                <li>• Gérer les utilisateurs</li>
                <li>• Modifier les paramètres</li>
                <li>• Supprimer des données</li>
                <li>• Accès complet au système</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
