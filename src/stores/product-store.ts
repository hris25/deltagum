import { Product, ProductStore, ProductVariant } from "@/types";
import { create } from "zustand";

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,
  selectedVariant: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        set({
          products: data.data.products,
          loading: false,
        });
      } else {
        throw new Error(data.error || "Erreur lors du chargement des produits");
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
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
