import { z } from "zod";

// Schémas pour les enums
export const flavorTypeSchema = z.enum([
  "STRAWBERRY",
  "BLUEBERRY",
  "APPLE",
  "CHOCOLATE",
  "VANILLA",
  "MYRTILLE",
]);
export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);
export const loyaltyLevelSchema = z.enum([
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
]);

// Schémas pour les entités de base
export const customerSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Numéro de téléphone invalide").optional(),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .optional(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)")
    .optional(),
  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .optional(),
});

export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional(),
  street: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  country: z.string().min(2, "Pays requis"),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "Le nom du produit doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  basePrice: z
    .union([z.number(), z.string().transform((val) => parseFloat(val))])
    .refine((val) => val > 0, "Le prix doit être positif"),
  image: z
    .string()
    .min(1, "Une image est requise")
    .refine((val) => {
      // Accepter les URLs complètes, les chemins absolus et les uploads
      return (
        val.startsWith("http") ||
        val.startsWith("/") ||
        val.startsWith("./") ||
        val.includes("/uploads/") ||
        val.includes("/img/")
      );
    }, "URL d'image invalide"),
  active: z.boolean().default(true),
  dosage: z.string().optional(),
  variants: z.array(z.any()).optional(),
  pricingTiers: z.array(z.any()).optional(),
});

export const productVariantSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  flavor: flavorTypeSchema,
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Couleur hexadécimale invalide"),
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  sku: z
    .string()
    .min(3, "Le SKU doit contenir au moins 3 caractères")
    .optional(),
  images: z
    .array(
      z.string().refine((val) => {
        // Accepter les URLs complètes, les chemins absolus et les uploads
        return (
          val.startsWith("http") ||
          val.startsWith("/") ||
          val.startsWith("./") ||
          val.includes("/uploads/") ||
          val.includes("/img/")
        );
      }, "URL ou chemin d'image invalide")
    )
    .default(["/img/placeholder.svg"]),
});

// Schémas pour le panier
export const cartItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  variantId: z.string(),
  name: z.string(),
  flavor: flavorTypeSchema,
  color: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive("La quantité doit être positive"),
  image: z.string().url(),
});

export const addToCartSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z
    .number()
    .int()
    .positive()
    .max(10, "Maximum 10 articles par produit"),
});

// Schémas pour les commandes
export const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  customerId: z.string().optional(), // Optionnel pour les commandes invités
  items: z.array(orderItemSchema).min(1, "Au moins un article requis"),
  shippingAddress: shippingAddressSchema,
  totalAmount: z.number().positive().optional(), // Optionnel, sera calculé si non fourni
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: orderStatusSchema,
});

// Schémas pour les paiements
export const paymentIntentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).default("EUR"),
});

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

// Schémas pour l'authentification
export const signInSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Vous devez accepter les conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Schémas pour les formulaires de contact
export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
});

// Schémas pour les avis clients
export const reviewSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  comment: z
    .string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères"),
});

// Schémas pour les paramètres utilisateur
export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(true),
  language: z.enum(["fr", "en"]).default("fr"),
  currency: z.enum(["EUR", "USD"]).default("EUR"),
});

// Schéma pour le checkout
export const checkoutSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["card", "paypal", "apple_pay", "google_pay"]),
  items: z.array(cartItemSchema).min(1, "Au moins un article requis"),
  promoCode: z.string().optional(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter les conditions"),
});

// Types inférés des schémas
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type CartItemFormData = z.infer<typeof cartItemSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
