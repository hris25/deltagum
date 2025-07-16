import React from "react";
/**
 * Système de cache global pour optimiser les performances
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en millisecondes
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Obtenir une donnée du cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Vérifier si l'entrée a expiré
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Stocker une donnée dans le cache
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Supprimer une entrée du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Vider tout le cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Fetch avec cache et déduplication des requêtes
   */
  async fetchWithCache<T>(
    url: string,
    options: RequestInit = {},
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;

    // Vérifier le cache d'abord
    const cached = this.get<T>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit pour: ${url}`);
      return cached;
    }

    // Vérifier si une requête est déjà en cours
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`⏳ Requête en cours pour: ${url}`);
      return this.pendingRequests.get(cacheKey);
    }

    // Créer une nouvelle requête
    const request = this.performFetch<T>(url, options, cacheKey, ttl);
    this.pendingRequests.set(cacheKey, request);

    try {
      const result = await request;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async performFetch<T>(
    url: string,
    options: RequestInit,
    cacheKey: string,
    ttl: number
  ): Promise<T> {
    console.log(`🌐 Fetch API pour: ${url}`);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Stocker en cache seulement si c'est un succès
    if (data.success !== false) {
      this.set(cacheKey, data, ttl);
    }

    return data;
  }

  /**
   * Invalider le cache pour un pattern d'URL
   */
  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
    console.log(`🗑️ Cache invalidé pour le pattern: ${pattern}`);
  }

  /**
   * Obtenir les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Instance globale du cache
export const apiCache = new ApiCache();

// TTL constants
export const CACHE_TTL = {
  PRODUCTS: 10 * 60 * 1000, // 10 minutes pour les produits
  ORDERS: 2 * 60 * 1000, // 2 minutes pour les commandes
  CUSTOMERS: 5 * 60 * 1000, // 5 minutes pour les clients
  STATS: 1 * 60 * 1000, // 1 minute pour les statistiques
  SHORT: 30 * 1000, // 30 secondes pour les données fréquentes
  LONG: 30 * 60 * 1000, // 30 minutes pour les données statiques
};

// Helpers pour les appels API courants
export const cachedFetch = {
  products: () =>
    apiCache.fetchWithCache("/api/products", {}, CACHE_TTL.PRODUCTS),
  orders: (limit?: number) =>
    apiCache.fetchWithCache(
      `/api/admin/orders${limit ? `?limit=${limit}` : ""}`,
      {},
      CACHE_TTL.ORDERS
    ),
  customers: () =>
    apiCache.fetchWithCache("/api/admin/customers", {}, CACHE_TTL.CUSTOMERS),
  stats: () =>
    apiCache.fetchWithCache("/api/admin/stats-simple", {}, CACHE_TTL.STATS),
};

// Fonction pour invalider le cache après des mutations
export const invalidateCache = {
  products: () => apiCache.invalidatePattern("/api/products"),
  orders: () => apiCache.invalidatePattern("/api/orders"),
  customers: () => apiCache.invalidatePattern("/api/customers"),
  stats: () => apiCache.invalidatePattern("/api/admin/stats"),
  all: () => apiCache.clear(),
};

// Hook React pour utiliser le cache
export const useCachedApi = <T>(
  url: string,
  options: RequestInit = {},
  ttl: number = CACHE_TTL.SHORT
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCache.fetchWithCache<T>(url, options, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options), ttl]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Debug: afficher les stats du cache dans la console
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).cacheStats = () => {
    console.log("📊 Cache Stats:", apiCache.getStats());
  };
}
