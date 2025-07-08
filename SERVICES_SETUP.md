# Configuration des Services Externes - Deltagum

## 🔧 Services Configurés

### 1. 💳 Stripe (Paiements)

**Configuration requise :**
- Créer un compte Stripe
- Récupérer les clés API (test et production)
- Configurer les webhooks

**Variables d'environnement :**
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Webhooks à configurer :**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- URL : `https://votre-domaine.com/api/stripe/webhook`

### 2. 🔐 NextAuth.js (Authentification)

**Configuration :**
- Authentification par email/mot de passe
- Intégration avec Prisma
- Sessions JWT

**Variables d'environnement :**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-aleatoire
```

### 3. 📧 Resend (Emails)

**Configuration requise :**
- Créer un compte Resend
- Vérifier votre domaine
- Récupérer la clé API

**Variables d'environnement :**
```env
RESEND_API_KEY=re_...
```

**Emails configurés :**
- Confirmation de commande
- Email de bienvenue
- Notifications de livraison

### 4. 📁 UploadThing (Gestion de fichiers)

**Configuration requise :**
- Créer un compte UploadThing
- Configurer les routes de fichiers
- Récupérer les clés API

**Variables d'environnement :**
```env
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

**Routes configurées :**
- `productImage` : Images de produits (4MB max)
- `customerAvatar` : Avatars clients (2MB max)

### 5. 🗄️ Supabase (Base de données)

**Configuration :**
- Base de données PostgreSQL
- Authentification (optionnelle)
- Storage (optionnel)

**Variables d'environnement :**
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🚀 Configuration Rapide

1. **Copiez le fichier d'exemple :**
   ```bash
   cp .env.example .env
   ```

2. **Configurez chaque service :**
   - Stripe : Créez un compte et récupérez les clés
   - Resend : Créez un compte et vérifiez votre domaine
   - UploadThing : Créez un projet et récupérez les clés
   - Supabase : Créez un projet et configurez la base de données

3. **Testez la configuration :**
   ```bash
   pnpm dev
   ```

## 🔍 Vérification

Pour vérifier que tous les services sont correctement configurés :

1. **Base de données :** `pnpm db:push`
2. **Stripe :** Testez un paiement en mode test
3. **Emails :** Vérifiez l'envoi d'emails de test
4. **Upload :** Testez l'upload d'images
5. **Auth :** Testez la connexion/inscription

## 🛠️ Développement vs Production

**Développement :**
- Utilisez les clés de test Stripe
- Configurez Resend avec un domaine de test
- Base de données de développement

**Production :**
- Clés de production Stripe
- Domaine vérifié pour Resend
- Base de données de production
- HTTPS obligatoire pour tous les services
