import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding de la base de données...");

  // Créer un utilisateur admin par défaut AVANT le nettoyage
  const adminEmail = "admin@deltagum.com";
  const adminPassword = "admin123";

  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.customer.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.customer.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Deltagum",
        phone: "+33123456789",
        role: "ADMIN",
      },
    });

    console.log("✅ Utilisateur admin créé:", {
      email: admin.email,
      role: admin.role,
    });
    console.log("📋 Informations de connexion admin :");
    console.log("Email: admin@deltagum.com");
    console.log("Mot de passe: admin123");
  } else {
    console.log("ℹ️ Utilisateur admin existe déjà");
  }

  // Nettoyer les autres données existantes (sauf l'admin)
  console.log("🧹 Nettoyage des données existantes...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.loyaltyProgram.deleteMany();
  await prisma.customer.deleteMany({
    where: {
      role: "USER", // Ne supprimer que les utilisateurs normaux
    },
  });
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // Créer le produit unique
  console.log("🍭 Création du produit Deltagum...");

  const deltagum = await prisma.product.create({
    data: {
      name: "Deltagum",
      description:
        "Nos délices Deltagum artisanaux aux saveurs naturelles de fruits. Fabriqués avec des ingrédients de qualité premium et des arômes naturels. Disponible en trois délicieuses saveurs : fraise, myrtille et pomme. Parfait pour la relaxation et le bien-être au quotidien. Réservé aux adultes.",
      basePrice: 15.99,
      image: "/img/2.jpg",
      active: true,
    },
  });

  // Créer les variantes pour chaque produit
  console.log("🎨 Création des variantes de saveurs...");

  const flavors = [
    {
      name: "Fraise",
      enumValue: "STRAWBERRY",
      color: "#FF6B9D",
      images: [
        "/img/product/deltagum-strawberry-main1.jpg",
        "/img/product/deltagum-strawberry-main2.jpg",
      ],
      description: "Saveur fraise intense et sucrée",
    },
    {
      name: "Myrtille",
      enumValue: "BLUEBERRY",
      color: "#4A90E2",
      images: [
        "/img/product/deltagum-blueberry-main1.jpg",
        "/img/product/deltagum-blueberry-main2.jpg",
      ],
      description: "Saveur myrtille acidulée et rafraîchissante",
    },
    {
      name: "Pomme",
      enumValue: "APPLE",
      color: "#7ED321",
      images: [
        "/img/product/deltagum-apple-main1.jpg",
        "/img/product/deltagum-apple-main2.jpg",
      ],
      description: "Saveur pomme verte croquante et pétillante",
    },
  ];

  const products = [deltagum];

  for (const product of products) {
    for (const flavor of flavors) {
      let price = product.price;
      let originalPrice = null;

      // Ajouter des promotions sur certaines variantes
      if (product.name === "Deltagum Classic" && flavor.name === "Fraise") {
        originalPrice = price;
        price = price; // Pas de promotion pour l'instant
      }
      if (product.name === "Deltagum Premium" && flavor.name === "Myrtille") {
        originalPrice = price;
        price = price; // Pas de promotion pour l'instant
      }

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          flavor: flavor.enumValue as any,
          stock: Math.floor(Math.random() * 100) + 50,
          color: flavor.color,
          images: flavor.images,
          sku: `${product.name
            .replace(/\s+/g, "")
            .toUpperCase()}-${flavor.name.toUpperCase()}`,
        },
      });
    }
  }

  // Créer des clients de test
  console.log("👥 Création des clients de test...");

  const customers = [
    {
      email: "marie.dupont@example.com",
      firstName: "Marie",
      lastName: "Dupont",
      phone: "+33123456789",
    },
    {
      email: "pierre.martin@example.com",
      firstName: "Pierre",
      lastName: "Martin",
      phone: "+33987654321",
    },
    {
      email: "sophie.leroy@example.com",
      firstName: "Sophie",
      lastName: "Leroy",
      phone: "+33456789123",
    },
  ];

  const createdCustomers = [];
  for (const customerData of customers) {
    const customer = await prisma.customer.create({
      data: {
        ...customerData,
      },
    });
    createdCustomers.push(customer);
  }

  // Créer des programmes de fidélité pour les clients
  console.log("🎯 Création des programmes de fidélité...");
  for (const customer of createdCustomers) {
    await prisma.loyaltyProgram.create({
      data: {
        customerId: customer.id,
        points: Math.floor(Math.random() * 300) + 50, // Entre 50 et 350 points
        level: "BRONZE", // Niveau par défaut
      },
    });
  }

  console.log("✅ Seeding terminé avec succès !");
  console.log(`📊 Données créées :`);
  console.log(`   - 1 produit Deltagum`);
  console.log(`   - ${flavors.length} variantes de saveurs`);
  console.log(`   - ${customers.length} clients`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
