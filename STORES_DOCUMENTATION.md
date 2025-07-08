# Documentation des Stores Zustand - Deltagum

## 🏪 Architecture des Stores

Le projet utilise **Zustand** pour la gestion d'état globale avec persistance localStorage pour certains stores.

### Stores Disponibles

#### 1. 🛒 Cart Store (`cart-store.ts`)
Gestion du panier d'achat avec persistance localStorage.

**État :**
- `cart`: Objet contenant les articles, total d'articles et montant total
- `items`: Array des articles dans le panier

**Actions :**
- `addItem(item)`: Ajouter un article au panier
- `removeItem(itemId)`: Supprimer un article du panier
- `updateQuantity(itemId, quantity)`: Modifier la quantité d'un article
- `clearCart()`: Vider le panier
- `getTotalItems()`: Obtenir le nombre total d'articles
- `getTotalAmount()`: Obtenir le montant total

**Utilisation :**
```typescript
import { useCart } from '@/hooks'

const { cart, addItem, removeItem } = useCart()
```

#### 2. 📦 Product Store (`product-store.ts`)
Gestion des produits et variantes.

**État :**
- `products`: Liste des produits
- `selectedProduct`: Produit actuellement sélectionné
- `selectedVariant`: Variante actuellement sélectionnée
- `loading`: État de chargement
- `error`: Message d'erreur

**Actions :**
- `fetchProducts()`: Charger les produits depuis l'API
- `selectProduct(product)`: Sélectionner un produit
- `selectVariant(variant)`: Sélectionner une variante

**Utilisation :**
```typescript
import { useProducts } from '@/hooks'

const { products, fetchProducts, selectProduct } = useProducts()
```

#### 3. 👤 Customer Store (`customer-store.ts`)
Gestion des informations client avec persistance localStorage.

**État :**
- `customer`: Informations du client connecté
- `loading`: État de chargement
- `error`: Message d'erreur

**Actions :**
- `setCustomer(customer)`: Définir le client connecté
- `updateCustomer(data)`: Mettre à jour les informations client
- `clearCustomer()`: Déconnecter le client

**Utilisation :**
```typescript
import { useCustomer } from '@/hooks'

const { customer, setCustomer, updateCustomer } = useCustomer()
```

#### 4. 🔔 Notification Store (`notification-store.ts`)
Gestion des notifications/toasts.

**État :**
- `notifications`: Liste des notifications actives

**Actions :**
- `addNotification(notification)`: Ajouter une notification
- `removeNotification(id)`: Supprimer une notification
- `clearNotifications()`: Supprimer toutes les notifications
- `showSuccess(title, message)`: Afficher une notification de succès
- `showError(title, message)`: Afficher une notification d'erreur
- `showWarning(title, message)`: Afficher une notification d'avertissement
- `showInfo(title, message)`: Afficher une notification d'information

**Utilisation :**
```typescript
import { useNotifications } from '@/stores'

const { showSuccess, showError } = useNotifications()

// Afficher une notification de succès
showSuccess('Produit ajouté', 'Le produit a été ajouté au panier')
```

#### 5. 🎨 UI Store (`ui-store.ts`)
Gestion de l'état global de l'interface utilisateur.

**État :**
- `isCartOpen`: État d'ouverture du panier
- `isMenuOpen`: État d'ouverture du menu mobile
- `isCheckoutOpen`: État d'ouverture du checkout
- `isAuthModalOpen`: État d'ouverture de la modale d'authentification
- `isLoading`: État de chargement global
- `loadingMessage`: Message de chargement
- `isMobile`: Détection mobile
- `scrollY`: Position de scroll

**Actions :**
- `openCart()`, `closeCart()`, `toggleCart()`: Gestion du panier
- `openMenu()`, `closeMenu()`, `toggleMenu()`: Gestion du menu
- `openCheckout()`, `closeCheckout()`: Gestion du checkout
- `openAuthModal()`, `closeAuthModal()`: Gestion de l'authentification
- `setLoading(loading, message)`: Définir l'état de chargement
- `setIsMobile(isMobile)`: Définir l'état mobile
- `setScrollY(scrollY)`: Définir la position de scroll
- `closeAllModals()`: Fermer toutes les modales

**Utilisation :**
```typescript
import { useUI } from '@/stores'

const { isCartOpen, openCart, closeCart } = useUI()
```

## 🔄 Persistance

### Stores avec persistance localStorage :
- **Cart Store** : Persiste le panier entre les sessions
- **Customer Store** : Persiste les informations client

### Configuration de la persistance :
```typescript
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'store-name',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ /* what to persist */ }),
  }
)
```

## 🎯 Bonnes Pratiques

### 1. Utilisation des Hooks
Toujours utiliser les hooks personnalisés plutôt que les stores directement :
```typescript
// ✅ Correct
import { useCart } from '@/hooks'

// ❌ Éviter
import { useCartStore } from '@/stores/cart-store'
```

### 2. Actions Asynchrones
Les actions asynchrones gèrent automatiquement les états de chargement et d'erreur :
```typescript
const { fetchProducts, loading, error } = useProducts()

useEffect(() => {
  fetchProducts()
}, [])
```

### 3. Notifications
Utiliser les helpers pour les notifications :
```typescript
const { showSuccess, showError } = useNotifications()

try {
  await someAsyncAction()
  showSuccess('Succès', 'Action réalisée avec succès')
} catch (error) {
  showError('Erreur', 'Une erreur est survenue')
}
```

### 4. Gestion des Modales
Utiliser le UI store pour gérer l'état des modales :
```typescript
const { isCartOpen, openCart, closeAllModals } = useUI()

// Ouvrir le panier
const handleOpenCart = () => openCart()

// Fermer toutes les modales (utile pour les overlays)
const handleOverlayClick = () => closeAllModals()
```

## 🔧 Développement

### Ajout d'un nouveau store :
1. Créer le fichier store dans `/src/stores/`
2. Définir l'interface TypeScript
3. Implémenter le store avec Zustand
4. Créer un hook personnalisé
5. Exporter depuis `/src/stores/index.ts`
6. Ajouter à la documentation

### Debug des stores :
Zustand inclut des outils de développement. Installer l'extension Redux DevTools pour visualiser les changements d'état.
