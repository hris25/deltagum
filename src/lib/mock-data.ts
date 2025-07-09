// Données de démonstration pour le développement
export const mockProducts = [
  {
    id: "1",
    name: "Deltagum Original",
    description: "Nos délicieux produits Deltagum aux saveurs naturelles. Parfait pour une expérience relaxante et savoureuse.",
    image: "/img/product/packaging-group-deltagum.jpg",
    basePrice: 12.00,
    dosage: "10mg",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceTiers: [
      {
        id: "1",
        productId: "1",
        quantity: 1,
        price: 12.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        productId: "1",
        quantity: 3,
        price: 30.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        productId: "1",
        quantity: 5,
        price: 45.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    variants: [
      {
        id: "1",
        productId: "1",
        flavor: "fraise",
        color: "#ff6b6b",
        stock: 50,
        images: [
          "/img/product/deltagum-fraise-main1.png",
          "/img/product/deltagum-fraise-main2.png"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        productId: "1",
        flavor: "myrtille",
        color: "#4ecdc4",
        stock: 45,
        images: [
          "/img/product/deltagum-myrtille-main1.png",
          "/img/product/deltagum-myrtille-main2.png"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        productId: "1",
        flavor: "pomme",
        color: "#95e1d3",
        stock: 40,
        images: [
          "/img/product/deltagum-apple-main1.png",
          "/img/product/deltagum-apple-main2.png"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Deltagum Cookies",
    description: "Délicieux cookies Deltagum pour une expérience gourmande unique. Parfait pour accompagner votre pause détente.",
    image: "/img/product/packaging-group-cookie.png",
    basePrice: 15.00,
    dosage: "15mg",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceTiers: [
      {
        id: "4",
        productId: "2",
        quantity: 1,
        price: 15.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5",
        productId: "2",
        quantity: 3,
        price: 40.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    variants: [
      {
        id: "4",
        productId: "2",
        flavor: "chocolat",
        color: "#8b4513",
        stock: 30,
        images: ["/img/product/cookie.png"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

export const getMockProducts = () => {
  return {
    success: true,
    data: {
      products: mockProducts,
      total: mockProducts.length,
    },
  };
};
