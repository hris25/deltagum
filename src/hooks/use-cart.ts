import { useCartStore } from "@/stores/cart-store";

export function useCart() {
  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
  } = useCartStore();

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
  };
}
