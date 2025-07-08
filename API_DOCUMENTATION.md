# Documentation API - Deltagum

## 🚀 Vue d'ensemble

L'API Deltagum est construite avec Next.js App Router et fournit des endpoints RESTful pour gérer les produits, commandes, clients et paiements.

## 📋 Structure des Réponses

Toutes les réponses API suivent le format standardisé `ApiResponse` :

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

## 🛍️ Endpoints Produits

### GET /api/products
Récupère la liste des produits avec leurs variantes.

**Paramètres de requête :**
- `active` (boolean) : Filtrer par produits actifs
- `limit` (number) : Nombre de produits à retourner
- `offset` (number) : Décalage pour la pagination

**Réponse :**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 10
  }
}
```

### GET /api/products/[id]
Récupère un produit spécifique par son ID.

### POST /api/products
Crée un nouveau produit (admin uniquement).

### PUT /api/products/[id]
Met à jour un produit existant (admin uniquement).

### DELETE /api/products/[id]
Supprime un produit (admin uniquement).

## 📦 Endpoints Commandes

### GET /api/orders
Récupère la liste des commandes.

**Paramètres de requête :**
- `customerId` (string) : Filtrer par client
- `status` (string) : Filtrer par statut
- `limit` (number) : Nombre de commandes à retourner
- `offset` (number) : Décalage pour la pagination

### POST /api/orders
Crée une nouvelle commande.

**Corps de la requête :**
```json
{
  "customerId": "customer-id",
  "items": [
    {
      "productId": "product-id",
      "variantId": "variant-id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Rue Example",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  }
}
```

### GET /api/orders/[id]
Récupère une commande spécifique.

### PATCH /api/orders/[id]
Met à jour le statut d'une commande.

**Corps de la requête :**
```json
{
  "status": "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
}
```

## 👤 Endpoints Clients

### GET /api/customers
Récupère la liste des clients.

**Paramètres de requête :**
- `email` (string) : Rechercher par email
- `limit` (number) : Nombre de clients à retourner
- `offset` (number) : Décalage pour la pagination

### POST /api/customers
Crée un nouveau client.

**Corps de la requête :**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+33123456789",
  "dateOfBirth": "1990-01-01"
}
```

### GET /api/customers/[id]
Récupère un client spécifique avec ses commandes.

### PATCH /api/customers/[id]
Met à jour les informations d'un client.

### DELETE /api/customers/[id]
Supprime un client.

## 💳 Endpoints Paiement

### POST /api/checkout
Crée une session de paiement Stripe.

**Corps de la requête :**
```json
{
  "orderId": "order-id"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_session_id",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### GET /api/checkout/session/[sessionId]
Vérifie le statut d'une session de paiement.

## 🔔 Webhooks

### POST /api/webhooks/stripe
Endpoint pour les webhooks Stripe.

**Événements gérés :**
- `checkout.session.completed` : Session de paiement terminée
- `payment_intent.succeeded` : Paiement réussi
- `payment_intent.payment_failed` : Paiement échoué
- `invoice.payment_succeeded` : Paiement de facture réussi

## 📧 Endpoint Contact

### POST /api/contact
Envoie un message de contact.

**Corps de la requête :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question sur les produits",
  "message": "Bonjour, j'aimerais savoir..."
}
```

## 🔐 Authentification

L'API utilise NextAuth.js pour l'authentification. Les endpoints protégés nécessitent une session valide.

**Headers requis pour les endpoints protégés :**
```
Authorization: Bearer <session-token>
```

## 📊 Codes de Statut HTTP

- `200` : Succès
- `201` : Créé avec succès
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `500` : Erreur serveur

## 🛡️ Validation

Toutes les données d'entrée sont validées avec Zod. Les erreurs de validation retournent un statut 400 avec les détails de l'erreur.

## 📝 Exemples d'utilisation

### Récupérer les produits
```javascript
const response = await fetch('/api/products?active=true&limit=10')
const data = await response.json()

if (data.success) {
  console.log('Produits:', data.data.products)
}
```

### Créer une commande
```javascript
const orderData = {
  customerId: 'customer-123',
  items: [
    {
      productId: 'product-456',
      variantId: 'variant-789',
      quantity: 2
    }
  ],
  shippingAddress: {
    street: '123 Rue Example',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  }
}

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
})

const result = await response.json()
```

### Créer une session de paiement
```javascript
const checkoutData = {
  orderId: 'order-123'
}

const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(checkoutData)
})

const result = await response.json()

if (result.success) {
  // Rediriger vers Stripe Checkout
  window.location.href = result.data.url
}
```

## 🔧 Configuration

### Variables d'environnement requises :
- `DATABASE_URL` : URL de la base de données PostgreSQL
- `STRIPE_SECRET_KEY` : Clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET` : Secret des webhooks Stripe
- `RESEND_API_KEY` : Clé API Resend pour les emails
- `NEXTAUTH_URL` : URL de base de l'application
- `NEXTAUTH_SECRET` : Secret pour NextAuth.js

### Middleware de sécurité :
- Validation CORS
- Limitation du taux de requêtes
- Validation des signatures Stripe
- Sanitisation des données d'entrée
