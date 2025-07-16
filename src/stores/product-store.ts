import { Product, ProductStore, ProductVariant } from "@/types";
import { create } from "zustand";

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,
  selectedVariant: null,
  loading: true, // Commencer en état de chargement
  error: null,

  fetchProducts: async (retryCount = 0) => {
    set({ loading: true, error: null });

    try {
      console.log("🔄 Chargement des produits avec cache...");

      // Utiliser le cache pour éviter les appels multiples
      const { cachedFetch } = await import("@/lib/cache");
      const data = (await cachedFetch.products()) as {
        success: boolean;
        data?: { products: Product[] };
        error?: string;
      };

      if (data.success && data.data && Array.isArray(data.data.products)) {
        console.log("Produits chargés avec succès:", data.data.products.length);
        set({
          products: data.data.products,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(data.error || "Format de réponse invalide");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);

      // Retry automatique (max 2 tentatives)
      if (retryCount < 2) {
        console.log(`Tentative de rechargement ${retryCount + 1}/2...`);
        setTimeout(() => {
          const store = get();
          if (store.fetchProducts) {
            (store.fetchProducts as any)(retryCount + 1);
          }
        }, 1000 * (retryCount + 1)); // Délai progressif
        return;
      }

      set({
        error: error instanceof Error ? error.message : "Erreur de connexion",
        loading: false,
      });
    }
  },

  selectProduct: (product: Product) => {
    const firstVariant = product.variants?.[0];
    const variantWithProduct = firstVariant
      ? {
          ...firstVariant,
          product: product,
        }
      : null;

    set({
      selectedProduct: product,
      selectedVariant: variantWithProduct,
    });
  },

  selectVariant: (variant: ProductVariant) => {
    set({ selectedVariant: variant });
  },
}));

// Préchargement automatique des produits
if (typeof window !== "undefined") {
  // Précharger les produits dès que le store est initialisé côté client
  setTimeout(() => {
    useProductStore.getState().fetchProducts();
  }, 100);
}

// Hook personnalisé pour utiliser le store des produits
export const useProducts = () => {
  const {
    products,
    selectedProduct,
    selectedVariant,
    loading,
    error,
    fetchProducts,
    selectProduct,
    selectVariant,
  } = useProductStore();

  return {
    products,
    selectedProduct,
    selectedVariant,
    loading,
    error,
    fetchProducts,
    selectProduct,
    selectVariant,
  };
};
