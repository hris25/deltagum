const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔄 Création de l\'utilisateur admin...');

    const adminEmail = "admin@deltagum.com";
    const adminPassword = "admin123";

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.customer.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('ℹ️  L\'utilisateur admin existe déjà');
      console.log('📋 Informations de connexion :');
      console.log('Email:', adminEmail);
      console.log('Mot de passe:', adminPassword);
      console.log('Rôle:', existingAdmin.role);
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Créer l'admin
    const admin = await prisma.customer.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Deltagum",
        phone: "+33123456789",
        address: "123 Rue de l'Administration",
        postalCode: "75001",
        city: "Paris",
        role: "ADMIN",
      },
    });

    console.log('✅ Utilisateur admin créé avec succès !');
    console.log('📋 Informations de connexion :');
    console.log('Email:', admin.email);
    console.log('Mot de passe:', adminPassword);
    console.log('Rôle:', admin.role);
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter sur :');
    console.log('http://localhost:3000/auth');
    console.log('');
    console.log('📊 Dashboard admin accessible sur :');
    console.log('http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
