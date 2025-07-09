const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDeltagumProduct() {
  try {
    console.log('🍬 Mise à jour du produit Deltagum...');

    // Trouver le produit Deltagum
    const deltagumProduct = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'Deltagum',
          mode: 'insensitive'
        }
      },
      include: {
        variants: true,
        priceTiers: true
      }
    });

    if (!deltagumProduct) {
      console.log('❌ Produit Deltagum non trouvé');
      return;
    }

    // Mettre à jour l'image principale
    await prisma.product.update({
      where: { id: deltagumProduct.id },
      data: {
        image: '/img/product/packaging-group-deltagum.jpg',
        description: 'Découvrez Deltagum, nos produits premium aux saveurs naturelles. Un produit exceptionnel disponible en trois délicieuses variantes : fraise, myrtille et pomme.'
      }
    });

    console.log('✅ Image et description du produit mises à jour');

    // Définir les variantes avec les bonnes images
    const variantUpdates = [
      {
        flavor: 'Fraise',
        color: '#FF6B6B',
        image: '/img/product/deltagum-fraise-main1.png'
      },
      {
        flavor: 'Myrtille', 
        color: '#4ECDC4',
        image: '/img/product/deltagum-myrtille-main1.png'
      },
      {
        flavor: 'Pomme',
        color: '#95E1D3',
        image: '/img/product/deltagum-apple-main1.png'
      }
    ];

    // Mettre à jour ou créer les variantes
    for (const variantData of variantUpdates) {
      const existingVariant = deltagumProduct.variants.find(v => 
        v.flavor.toLowerCase().includes(variantData.flavor.toLowerCase()) ||
        variantData.flavor.toLowerCase().includes(v.flavor.toLowerCase())
      );

      if (existingVariant) {
        // Mettre à jour la variante existante
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: {
            flavor: variantData.flavor,
            color: variantData.color,
            image: variantData.image,
            stock: Math.max(existingVariant.stock, 50) // Assurer un stock minimum
          }
        });
        console.log(`✅ Variante ${variantData.flavor} mise à jour`);
      } else {
        // Créer une nouvelle variante
        await prisma.productVariant.create({
          data: {
            productId: deltagumProduct.id,
            flavor: variantData.flavor,
            color: variantData.color,
            image: variantData.image,
            stock: 50
          }
        });
        console.log(`✅ Variante ${variantData.flavor} créée`);
      }
    }

    // Vérifier et créer les prix tiers si nécessaire
    if (deltagumProduct.priceTiers.length === 0) {
      await prisma.priceTier.createMany({
        data: [
          {
            productId: deltagumProduct.id,
            quantity: 1,
            price: 8.00
          },
          {
            productId: deltagumProduct.id,
            quantity: 3,
            price: 15.00
          },
          {
            productId: deltagumProduct.id,
            quantity: 6,
            price: 25.00
          }
        ]
      });
      console.log('✅ Prix tiers créés');
    }

    console.log('🎉 Produit Deltagum mis à jour avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du produit Deltagum:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateDeltagumProduct();
