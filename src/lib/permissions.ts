import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import React from "react";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  return verifyToken(token);
}

export function hasPermission(
  user: AuthUser | null,
  requiredRole: string
): boolean {
  if (!user) return false;

  const roleHierarchy = {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };

  const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

export function requireAuth(requiredRole: string = "USER") {
  return function (handler: (...args: any[]) => any) {
    return async function (request: NextRequest, ...args: any[]) {
      const user = getAuthUser(request);

      if (!user) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!hasPermission(user, requiredRole)) {
        return new Response(
          JSON.stringify({ error: "Permissions insuffisantes" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      // Ajouter l'utilisateur à la requête
      (request as any).user = user;

      return handler(request, ...args);
    };
  };
}

// Permissions spécifiques pour différentes actions
export const PERMISSIONS = {
  // Produits
  PRODUCTS_VIEW: "USER",
  PRODUCTS_CREATE: "ADMIN",
  PRODUCTS_EDIT: "ADMIN",
  PRODUCTS_DELETE: "ADMIN",

  // Commandes
  ORDERS_VIEW: "ADMIN",
  ORDERS_EDIT: "ADMIN",
  ORDERS_DELETE: "SUPER_ADMIN",

  // Clients
  CUSTOMERS_VIEW: "ADMIN",
  CUSTOMERS_EDIT: "ADMIN",
  CUSTOMERS_DELETE: "SUPER_ADMIN",

  // Images
  IMAGES_UPLOAD: "ADMIN",
  IMAGES_DELETE: "ADMIN",

  // Paramètres
  SETTINGS_VIEW: "ADMIN",
  SETTINGS_EDIT: "SUPER_ADMIN",

  // Utilisateurs
  USERS_VIEW: "ADMIN",
  USERS_CREATE: "SUPER_ADMIN",
  USERS_EDIT: "SUPER_ADMIN",
  USERS_DELETE: "SUPER_ADMIN",
} as const;

// Hook pour vérifier les permissions côté client
export function usePermissions() {
  const checkPermission = (userRole: string, requiredRole: string): boolean => {
    return hasPermission(
      { userId: "", email: "", role: userRole, firstName: "", lastName: "" },
      requiredRole
    );
  };

  const isAdmin = (userRole: string): boolean => {
    return checkPermission(userRole, "ADMIN");
  };

  const isSuperAdmin = (userRole: string): boolean => {
    return checkPermission(userRole, "SUPER_ADMIN");
  };

  const canAccess = (
    userRole: string,
    permission: keyof typeof PERMISSIONS
  ): boolean => {
    return checkPermission(userRole, PERMISSIONS[permission]);
  };

  return {
    checkPermission,
    isAdmin,
    isSuperAdmin,
    canAccess,
  };
}

// Composant HOC pour protéger les composants
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole: string,
  fallback?: React.ComponentType
) {
  return function ProtectedComponent(props: T) {
    // Cette logique serait implémentée côté client avec le store d'auth
    // Pour l'instant, on retourne le composant directement
    return React.createElement(Component, props);
  };
}

// Utilitaire pour vérifier les permissions dans les API routes
export function checkApiPermission(
  request: NextRequest,
  requiredRole: string
): { success: boolean; user?: AuthUser; error?: string } {
  const user = getAuthUser(request);

  if (!user) {
    return { success: false, error: "Non authentifié" };
  }

  if (!hasPermission(user, requiredRole)) {
    return { success: false, error: "Permissions insuffisantes" };
  }

  return { success: true, user };
}
