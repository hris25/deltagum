const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductNames() {
  try {
    console.log('🔄 Mise à jour des noms de produits...');

    // Récupérer tous les produits existants
    const products = await prisma.product.findMany();
    console.log(`📦 ${products.length} produits trouvés`);

    for (const product of products) {
      let newName = null;
      
      // Identifier le type de produit et mettre à jour le nom
      if (product.name.toLowerCase().includes('deltagum') && 
          (product.name.toLowerCase().includes('original') || 
           product.name.toLowerCase().includes('premium') ||
           product.name.toLowerCase().includes('bonbon'))) {
        newName = 'Bonbons Delta-9';
      } else if (product.name.toLowerCase().includes('cookie')) {
        newName = 'Cookies Delta-9';
      }

      if (newName && newName !== product.name) {
        await prisma.product.update({
          where: { id: product.id },
          data: { name: newName }
        });
        console.log(`✅ Produit mis à jour: "${product.name}" → "${newName}"`);
      } else {
        console.log(`ℹ️  Produit inchangé: "${product.name}"`);
      }
    }

    console.log('✨ Mise à jour terminée !');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductNames();
