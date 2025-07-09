const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanAndSeed() {
  try {
    console.log('🧹 Nettoyage de la base de données...');

    // Supprimer tous les produits existants (cascade supprimera les variantes et prix)
    await prisma.product.deleteMany({});
    console.log('✅ Tous les produits supprimés');

    console.log('🌱 Création des nouveaux produits avec les bonnes images...');

    // 1. Créer le produit Deltagum (bonbons) avec l'image packaging
    const deltagumProduct = await prisma.product.create({
      data: {
        name: 'Deltagum Premium',
        description: 'Découvrez Deltagum, nos produits premium aux saveurs naturelles. Un produit exceptionnel disponible en trois délicieuses variantes : fraise, myrtille et pomme.',
        basePrice: 8.00,
        image: '/img/product/packaging-group-deltagum.jpg', // Image packaging globale
        dosage: '5mg par unité',
        variants: {
          create: [
            {
              flavor: 'STRAWBERRY',
              color: '#FF6B6B',
              images: [
                '/img/product/deltagum-fraise-main1.png',
                '/img/product/deltagum-fraise-main2.png'
              ],
              stock: 100,
              sku: 'DELTAGUM-FRAISE-001'
            },
            {
              flavor: 'BLUEBERRY',
              color: '#4ECDC4',
              images: [
                '/img/product/deltagum-myrtille-main1.png',
                '/img/product/deltagum-myrtille-main2.png'
              ],
              stock: 100,
              sku: 'DELTAGUM-MYRTILLE-001'
            },
            {
              flavor: 'APPLE',
              color: '#95E1D3',
              images: [
                '/img/product/deltagum-apple-main1.png',
                '/img/product/deltagum-apple-main2.png'
              ],
              stock: 100,
              sku: 'DELTAGUM-POMME-001'
            }
          ]
        },
        priceTiers: {
          create: [
            {
              quantity: 1,
              price: 8.00
            },
            {
              quantity: 3,
              price: 15.00
            },
            {
              quantity: 6,
              price: 25.00
            }
          ]
        }
      },
      include: {
        variants: true,
        priceTiers: true
      }
    });

    console.log('✅ Produit Deltagum créé avec succès !');
    console.log(`📦 ID: ${deltagumProduct.id}`);
    console.log(`🍬 Variantes: ${deltagumProduct.variants.length}`);

    // 2. Créer le produit Cookie avec l'image packaging
    const cookieProduct = await prisma.product.create({
      data: {
        name: 'Cookies Delta-9',
        description: 'Cookies au chocolat noir à base de Delta-9 (THC < 0,3%). Dosage précis de 75mg par cookie pour une expérience contrôlée et savoureuse.',
        basePrice: 12.00,
        image: '/img/product/packaging-group-cookie.png', // Image packaging cookie
        dosage: '75mg par cookie',
        variants: {
          create: [
            {
              flavor: 'CHOCOLATE',
              color: '#8B4513',
              images: ['/img/product/cookie.png'], // Une seule image pour les cookies
              stock: 50,
              sku: 'COOKIE-CHOCOLAT-001'
            }
          ]
        },
        priceTiers: {
          create: [
            {
              quantity: 1,
              price: 12.00
            },
            {
              quantity: 3,
              price: 30.00
            },
            {
              quantity: 6,
              price: 55.00
            }
          ]
        }
      },
      include: {
        variants: true,
        priceTiers: true
      }
    });

    console.log('✅ Produit Cookie créé avec succès !');
    console.log(`📦 ID: ${cookieProduct.id}`);
    console.log(`🍪 Variantes: ${cookieProduct.variants.length}`);

    console.log('🎉 Tous les produits ont été créés avec les bonnes images !');

    // Afficher un résumé
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true,
        priceTiers: true
      }
    });

    console.log('\n📊 Résumé des produits créés :');
    allProducts.forEach(product => {
      console.log(`\n🏷️  ${product.name}`);
      console.log(`   📸 Image principale: ${product.image}`);
      console.log(`   🎨 Variantes: ${product.variants.length}`);
      product.variants.forEach(variant => {
        console.log(`      - ${variant.flavor}: ${variant.images.length} image(s)`);
        variant.images.forEach((img, index) => {
          console.log(`        ${index + 1}. ${img}`);
        });
      });
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
cleanAndSeed();
