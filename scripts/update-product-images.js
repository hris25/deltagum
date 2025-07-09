const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateProductImages() {
  try {
    console.log("🔄 Mise à jour des images des produits...");

    // 1. Mettre à jour le produit Deltagum (bonbons) avec l'image packaging
    const deltagumProduct = await prisma.product.findFirst({
      where: {
        name: {
          contains: "Deltagum",
          mode: "insensitive",
        },
      },
      include: {
        variants: true,
      },
    });

    if (deltagumProduct) {
      // Mettre à jour l'image principale du produit (packaging)
      await prisma.product.update({
        where: { id: deltagumProduct.id },
        data: {
          image: "/img/product/packaging-group-deltagum.jpg",
        },
      });
      console.log("✅ Image packaging Deltagum mise à jour");

      // Mettre à jour les images des variantes
      for (const variant of deltagumProduct.variants) {
        let images = [];

        switch (variant.flavor.toLowerCase()) {
          case "fraise":
          case "strawberry":
            images = [
              "/img/product/deltagum-fraise-main1.png",
              "/img/product/deltagum-fraise-main2.png",
            ];
            break;
          case "myrtille":
          case "blueberry":
            images = [
              "/img/product/deltagum-myrtille-main1.png",
              "/img/product/deltagum-myrtille-main2.png",
            ];
            break;
          case "pomme":
          case "apple":
            images = [
              "/img/product/deltagum-apple-main1.png",
              "/img/product/deltagum-apple-main2.png",
            ];
            break;
        }

        if (images.length > 0) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { images: images },
          });
          console.log(
            `✅ Images variante ${variant.flavor} mises à jour (${images.length} images)`
          );
        }
      }
    }

    // 2. Chercher et mettre à jour le produit Cookie s'il existe
    const cookieProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { contains: "cookie", mode: "insensitive" } },
          { name: { contains: "biscuit", mode: "insensitive" } },
        ],
      },
    });

    if (cookieProduct) {
      await prisma.product.update({
        where: { id: cookieProduct.id },
        data: {
          image: "/img/product/packaging-group-cookie.png",
        },
      });
      console.log("✅ Image packaging Cookie mise à jour");
    }

    console.log("🎉 Toutes les images ont été mises à jour avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des images:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateProductImages();
