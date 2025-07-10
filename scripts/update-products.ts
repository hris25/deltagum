import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateProducts() {
  try {
    console.log("🔄 Mise à jour des produits Delta-9...");

    // Supprimer les anciens produits
    await prisma.priceTier.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();

    // 1. Créer le produit Bonbons Delta-9
    const bonbonsProduct = await prisma.product.create({
      data: {
        id: globalThis.crypto.randomUUID(),
        name: "Bonbons Delta-9",
        description:
          "Bonbons délicieux à base de Delta-9 (THC < 0,3%). Goûts variés pour une expérience gustative unique. Dosage précis de 30mg par bonbon.",
        basePrice: 8.0, // Prix pour 1 bonbon
        dosage: "30mg",
        image: "/img/2.jpg", // Image originale
        active: true,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Produit Bonbons créé:", bonbonsProduct.name);

    // Créer les prix par quantité pour les bonbons (selon modif.md)
    const bonbonsPrices = [
      { quantity: 1, price: 8.0 },
      { quantity: 3, price: 15.0 },
      { quantity: 6, price: 25.0 },
      { quantity: 10, price: 35.0 },
    ];

    for (const priceData of bonbonsPrices) {
      await prisma.priceTier.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          productId: bonbonsProduct.id,
          quantity: priceData.quantity,
          price: priceData.price,
          updatedAt: new Date(),
        },
      });
      console.log(
        `✅ Prix créé: ${priceData.quantity} bonbons = ${priceData.price}€`
      );
    }

    // 2. Créer le produit Cookies Delta-9
    const cookiesProduct = await prisma.product.create({
      data: {
        id: globalThis.crypto.randomUUID(),
        name: "Cookies Delta-9",
        description:
          "Cookies au chocolat noir à base de Delta-9 (THC < 0,3%). Dosage précis de 75mg par cookie pour une expérience intense et savoureuse.",
        basePrice: 10.0, // Prix pour 1 cookie
        dosage: "75mg",
        image: "/img/7.jpg", // Image différente pour les cookies
        active: true,
        updatedAt: new Date(),
      },
    });

    console.log("✅ Produit Cookies créé:", cookiesProduct.name);

    // Créer les prix par quantité pour les cookies (selon modif.md)
    const cookiesPrices = [
      { quantity: 1, price: 10.0 },
      { quantity: 3, price: 20.0 },
      { quantity: 5, price: 30.0 },
      { quantity: 10, price: 50.0 },
    ];

    for (const priceData of cookiesPrices) {
      await prisma.priceTier.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          productId: cookiesProduct.id,
          quantity: priceData.quantity,
          price: priceData.price,
          updatedAt: new Date(),
        },
      });
      console.log(
        `✅ Prix créé: ${priceData.quantity} cookies = ${priceData.price}€`
      );
    }

    // Créer les variantes de saveurs pour les bonbons (images originales)
    const bonbonsVariants = [
      {
        flavor: "STRAWBERRY" as const,
        color: "#ff6b6b",
        image: "/img/4.jpg", // Image originale fraise
        stock: 100,
        sku: "BONBONS-FRAISE",
      },
      {
        flavor: "BLUEBERRY" as const,
        color: "#4c6ef5",
        image: "/img/5.jpg", // Image originale myrtille
        stock: 100,
        sku: "BONBONS-MYRTILLE",
      },
      {
        flavor: "APPLE" as const,
        color: "#51cf66",
        image: "/img/6.jpg", // Image originale pomme
        stock: 100,
        sku: "BONBONS-POMME",
      },
    ];

    for (const variant of bonbonsVariants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          id: globalThis.crypto.randomUUID(),
          ...variant,
          productId: bonbonsProduct.id,
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Variante bonbons créée: ${createdVariant.flavor}`);
    }

    // Créer une variante unique pour les cookies (chocolat noir uniquement)
    await prisma.productVariant.create({
      data: {
        id: globalThis.crypto.randomUUID(),
        flavor: "STRAWBERRY", // On utilise STRAWBERRY comme placeholder pour "Chocolat noir"
        color: "#8B4513",
        images: ["/img/8.jpg"], // Images pour cookies chocolat (tableau)
        stock: 100,
        sku: "COOKIES-CHOCOLAT-NOIR",
        productId: cookiesProduct.id,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Variante cookies créée: Chocolat noir`);

    console.log("🎉 Mise à jour terminée avec succès !");
    console.log(`📦 2 produits créés:`);
    console.log(`   - Bonbons Delta-9 avec ${bonbonsVariants.length} saveurs`);
    console.log(`   - Cookies Delta-9 (chocolat noir uniquement)`);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateProducts();
