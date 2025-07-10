// Export des stores
export { useAuth } from "./auth-store";
export { useCartStore } from "./cart-store";
export { useCheckoutModal } from "./checkout-modal-store";
export { useCustomer, useCustomerStore } from "./customer-store";
export { useNotificationStore, useNotifications } from "./notification-store";
export { useProductStore, useProducts } from "./product-store";
export { useUI, useUIStore } from "./ui-store";

// Alias pour compatibilité
export { useCartStore as useCart } from "./cart-store";
export { useProductStore as useProduct } from "./product-store";

// Export des types
export type { Notification } from "./notification-store";
