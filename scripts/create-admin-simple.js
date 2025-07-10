// Script simple pour créer un admin
console.log('🔄 Création de l\'utilisateur admin...');

// Simuler la création (vous devrez exécuter cela manuellement dans votre base)
const adminData = {
  email: "admin@deltagum.com",
  password: "admin123", // Sera hashé
  firstName: "Admin",
  lastName: "Deltagum",
  phone: "+33123456789",
  address: "123 Rue de l'Administration",
  postalCode: "75001",
  city: "Paris",
  role: "ADMIN"
};

console.log('📋 Données admin à créer :');
console.log(JSON.stringify(adminData, null, 2));
console.log('');
console.log('✅ Utilisez ces identifiants pour vous connecter :');
console.log('Email: admin@deltagum.com');
console.log('Mot de passe: admin123');
console.log('');
console.log('🌐 URLs importantes :');
console.log('Connexion: http://localhost:3000/auth');
console.log('Dashboard: http://localhost:3000/admin/dashboard');
