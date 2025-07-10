export const siteConfig = {
  name: "Deltagum",
  description: "Chewing-gum premium aux saveurs naturelles de fruits",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  links: {
    twitter: "https://twitter.com/deltagum",
    instagram: "https://instagram.com/deltagum",
    facebook: "https://facebook.com/deltagum",
  },
};

// Alias pour compatibilité
export const SITE_CONFIG = siteConfig;

export const productConfig = {
  flavors: {
    STRAWBERRY: {
      name: "Fraise",
      color: "#FF6B9D",
      emoji: "🍓",
      description: "Délice Deltagum saveur fraise naturelle et relaxante",
    },
    BLUEBERRY: {
      name: "Myrtille",
      color: "#4A90E2",
      emoji: "🫐",
      description: "Délice Deltagum saveur myrtille fraîche et apaisante",
    },
    APPLE: {
      name: "Pomme",
      color: "#7ED321",
      emoji: "🍏",
      description: "Délice Deltagum saveur pomme verte rafraîchissante",
    },
  },
  defaultPrice: 12.99,
  currency: "EUR",
  currencySymbol: "€",
  thcInfo: {
    concentration: "Delta-9 THC < 0,3%",
    warning: "Produit contenant du Delta-9 THC - Réservé aux adultes",
    legalNotice: "Ne pas conduire après consommation",
  },
};

export const loyaltyConfig = {
  levels: {
    BRONZE: {
      name: "Bronze",
      color: "#CD7F32",
      minPoints: 0,
      benefits: ["Livraison gratuite dès 25€"],
    },
    SILVER: {
      name: "Argent",
      color: "#C0C0C0",
      minPoints: 100,
      benefits: ["Livraison gratuite dès 20€", "5% de réduction"],
    },
    GOLD: {
      name: "Or",
      color: "#FFD700",
      minPoints: 500,
      benefits: [
        "Livraison gratuite",
        "10% de réduction",
        "Accès prioritaire aux nouveautés",
      ],
    },
    PLATINUM: {
      name: "Platine",
      color: "#E5E4E2",
      minPoints: 1000,
      benefits: [
        "Livraison gratuite",
        "15% de réduction",
        "Accès prioritaire",
        "Cadeaux exclusifs",
      ],
    },
  },
  pointsPerEuro: 10, // 10 points par euro dépensé
};

export const shippingConfig = {
  freeShippingThreshold: 25, // Livraison gratuite dès 25€
  standardShipping: 4.9,
  expressShipping: 9.9,
  estimatedDelivery: {
    standard: "3-5 jours ouvrés",
    express: "24-48h",
  },
};

export const orderConfig = {
  statuses: {
    PENDING: {
      name: "En attente",
      color: "#FFA500",
      description: "Commande en attente de paiement",
    },
    PAID: {
      name: "Payée",
      color: "#32CD32",
      description: "Paiement confirmé, préparation en cours",
    },
    SHIPPED: {
      name: "Expédiée",
      color: "#4169E1",
      description: "Commande expédiée",
    },
    DELIVERED: {
      name: "Livrée",
      color: "#228B22",
      description: "Commande livrée",
    },
    CANCELLED: {
      name: "Annulée",
      color: "#DC143C",
      description: "Commande annulée",
    },
  },
};
