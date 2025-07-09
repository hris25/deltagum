const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCookieProduct() {
  try {
    console.log('🍪 Création du produit Cookie...');

    // Vérifier si le produit Cookie existe déjà
    const existingCookie = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { contains: 'cookie', mode: 'insensitive' } },
          { name: { contains: 'biscuit', mode: 'insensitive' } }
        ]
      }
    });

    if (existingCookie) {
      console.log('✅ Le produit Cookie existe déjà');
      return;
    }

    // Créer le produit Cookie
    const cookieProduct = await prisma.product.create({
      data: {
        name: 'Deltagum Cookie',
        description: 'Délicieux cookies Deltagum premium aux saveurs naturelles. Une texture croustillante et fondante pour une expérience gustative unique.',
        basePrice: 12.00,
        image: '/img/product/packaging-group-cookie.png',
        dosage: '10mg par cookie',
        category: 'COOKIE',
        variants: {
          create: [
            {
              flavor: 'Chocolat',
              color: '#8B4513',
              stock: 50,
              image: '/img/product/cookie.png'
            },
            {
              flavor: 'Vanille',
              color: '#F5DEB3',
              stock: 50,
              image: '/img/product/cookie.png'
            },
            {
              flavor: 'Caramel',
              color: '#D2691E',
              stock: 50,
              image: '/img/product/cookie.png'
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
    console.log(`🍪 Nom: ${cookieProduct.name}`);
    console.log(`🎨 Variantes: ${cookieProduct.variants.length}`);
    console.log(`💰 Prix tiers: ${cookieProduct.priceTiers.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création du produit Cookie:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createCookieProduct();
