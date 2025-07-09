const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCookieProduct() {
  try {
    console.log('🍪 Ajout du produit Cookie...');

    // Vérifier si le produit Cookie existe déjà
    const existingCookie = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'Cookie',
          mode: 'insensitive'
        }
      }
    });

    if (existingCookie) {
      console.log('✅ Le produit Cookie existe déjà');
      console.log(`📦 ID: ${existingCookie.id}`);
      console.log(`📸 Image: ${existingCookie.image}`);
      return;
    }

    // Créer le produit Cookie avec l'image packaging
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
    console.log(`📸 Image principale: ${cookieProduct.image}`);
    console.log(`🎨 Images variantes:`);
    cookieProduct.variants.forEach(variant => {
      console.log(`   - ${variant.flavor}: ${variant.images.join(', ')}`);
    });

    // Afficher un résumé de tous les produits
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true,
        priceTiers: true
      }
    });

    console.log('\n📊 Résumé de tous les produits :');
    allProducts.forEach(product => {
      console.log(`\n🏷️  ${product.name}`);
      console.log(`   📸 Image principale: ${product.image}`);
      console.log(`   🎨 Variantes: ${product.variants.length}`);
      product.variants.forEach(variant => {
        console.log(`      - ${variant.flavor}: ${variant.images.length} image(s)`);
      });
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout du produit Cookie:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
addCookieProduct();
