import { FlavorType, LoyaltyLevel, OrderStatus } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { loyaltyConfig, orderConfig, productConfig } from "./config";

// Utilitaire pour combiner les classes CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatage des prix
export function formatPrice(price: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(price);
}

// Formatage des dates
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("fr-FR", {
    ...defaultOptions,
    ...options,
  }).format(dateObj);
}

// Formatage des dates relatives
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600)
    return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400)
    return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 2592000)
    return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;

  return formatDate(dateObj);
}

// Utilitaires pour les saveurs
export function getFlavorInfo(flavor: FlavorType) {
  return productConfig.flavors[flavor];
}

export function getFlavorName(flavor: FlavorType): string {
  return getFlavorInfo(flavor).name;
}

export function getFlavorColor(flavor: FlavorType): string {
  return getFlavorInfo(flavor).color;
}

export function getFlavorEmoji(flavor: FlavorType): string {
  return getFlavorInfo(flavor).emoji;
}

// Utilitaires pour le programme de fidélité
export function getLoyaltyInfo(level: LoyaltyLevel) {
  return loyaltyConfig.levels[level];
}

export function calculateLoyaltyLevel(points: number): LoyaltyLevel {
  if (points >= loyaltyConfig.levels.PLATINUM.minPoints) return "PLATINUM";
  if (points >= loyaltyConfig.levels.GOLD.minPoints) return "GOLD";
  if (points >= loyaltyConfig.levels.SILVER.minPoints) return "SILVER";
  return "BRONZE";
}

export function calculatePointsFromAmount(amount: number): number {
  return Math.floor(amount * loyaltyConfig.pointsPerEuro);
}

export function getNextLoyaltyLevel(
  currentLevel: LoyaltyLevel
): LoyaltyLevel | null {
  const levels: LoyaltyLevel[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

export function getPointsToNextLevel(
  currentPoints: number,
  currentLevel: LoyaltyLevel
): number {
  const nextLevel = getNextLoyaltyLevel(currentLevel);
  if (!nextLevel) return 0;
  return loyaltyConfig.levels[nextLevel].minPoints - currentPoints;
}

// Utilitaires pour les commandes
export function getOrderStatusInfo(status: OrderStatus) {
  return orderConfig.statuses[status];
}

export function getOrderStatusColor(status: OrderStatus): string {
  return getOrderStatusInfo(status).color;
}

export function getOrderStatusName(status: OrderStatus): string {
  return getOrderStatusInfo(status).name;
}

// Utilitaires pour les calculs de panier
export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateCartItemsCount(
  items: Array<{ quantity: number }>
): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Utilitaires pour les URLs et slugs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9 -]/g, "") // Supprimer les caractères spéciaux
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-") // Supprimer les tirets multiples
    .trim();
}

export function generateSKU(productName: string, flavor: FlavorType): string {
  const productSlug = slugify(productName).toUpperCase().substring(0, 3);
  const flavorCode = flavor.substring(0, 3);
  const timestamp = Date.now().toString().slice(-3);
  return `${productSlug}-${flavorCode}-${timestamp}`;
}

// Utilitaires pour la validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
}

// Utilitaires pour les images
export function getImageUrl(path: string, size?: "sm" | "md" | "lg"): string {
  if (path.startsWith("http")) return path;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGES_URL || "/images";
  const sizePrefix = size ? `${size}/` : "";

  return `${baseUrl}/${sizePrefix}${path}`;
}

export function getPlaceholderImage(
  width: number = 400,
  height: number = 400
): string {
  return `https://via.placeholder.com/${width}x${height}/FF6B9D/FFFFFF?text=Deltagum`;
}

// Utilitaires pour le localStorage
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

// Utilitaires pour les animations
export function getRandomDelay(min: number = 0, max: number = 1): number {
  return Math.random() * (max - min) + min;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Utilitaires pour les erreurs
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inattendue s'est produite";
}

// Utilitaires pour les API
export function createApiUrl(
  endpoint: string,
  params?: Record<string, string | number>
): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  const url = new URL(`${baseUrl}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
  }

  return url.toString();
}

// Utilitaire pour débouncer les fonctions
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Utilitaire pour throttler les fonctions
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
