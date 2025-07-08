// Types de base simplifiés (sans Prisma pour éviter les erreurs de build)
export type Product = any;

export type ProductVariant = any;

export type Customer = any;

export type Order = any;

export type OrderItem = any;

export type LoyaltyProgram = any;

// Enums
export type FlavorType = "STRAWBERRY" | "BLUEBERRY" | "APPLE";
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type LoyaltyLevel = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

// Types pour le panier
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  flavor: FlavorType;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Types pour les formulaires
export interface CustomerForm {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CheckoutForm {
  customer: CustomerForm;
  shipping: ShippingAddress;
  paymentMethod: "card" | "paypal";
}

// Types pour les API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface OrderCreateRequest {
  customerId: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
}

export interface PaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
}

// Types pour les animations
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}

export interface FlavorSelectorProps {
  selectedFlavor: FlavorType | null;
  onFlavorSelect: (flavor: FlavorType) => void;
  variants: ProductVariant[];
}

// Types pour les composants UI
export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// Types pour les stores Zustand
export interface CartStore {
  cart: Cart;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  selectedVariant: ProductVariant | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  selectProduct: (product: Product) => void;
  selectVariant: (variant: ProductVariant) => void;
}

export interface CustomerStore {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  setCustomer: (customer: Customer) => void;
  updateCustomer: (data: Partial<Customer>) => Promise<void>;
  clearCustomer: () => void;
}

// Types pour les hooks
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Types pour les métadonnées
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}
