# Documentation du Layout - Deltagum

## 🏗️ Vue d'ensemble

Le système de layout de Deltagum est conçu pour être modulaire, responsive et accessible. Il comprend des composants de navigation, des modals et des layouts spécialisés pour différents types de pages.

## 📋 Structure du Layout

### 1. 🎯 Layout Principal (`Layout.tsx`)
Le composant Layout principal orchestre l'ensemble de l'interface utilisateur.

**Fonctionnalités :**
- Header fixe avec navigation
- Footer avec liens et newsletter
- Gestion des modals
- Système de notifications (Toast)
- Overlay de chargement global
- Détection mobile automatique
- Gestion du scroll

**Props :**
```typescript
interface LayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
}
```

**Utilisation :**
```tsx
import { Layout } from '@/components/layout'

<Layout>
  <main>Contenu de la page</main>
</Layout>
```

### 2. 🧭 Header (`Header.tsx`)
Header responsive avec navigation et panier.

**Fonctionnalités :**
- Logo animé Deltagum
- Navigation smooth scroll vers les sections
- Indicateur de panier avec badge
- Menu mobile hamburger
- Effet de transparence au scroll
- Animations Framer Motion

**Navigation :**
- Accueil (#hero)
- Produits (#products)
- À propos (#about)
- Témoignages (#testimonials)
- FAQ (#faq)
- Contact (#contact)

### 3. 🦶 Footer (`Footer.tsx`)
Footer complet avec informations et liens.

**Sections :**
- **Logo et description** : Présentation de la marque
- **Newsletter** : Inscription avec validation email
- **Navigation** : Liens vers les sections principales
- **Informations légales** : Mentions, CGV, confidentialité
- **Contact** : Email, téléphone
- **Réseaux sociaux** : Facebook, Instagram, Twitter, TikTok

**Fonctionnalités :**
- Formulaire de newsletter fonctionnel
- Liens de navigation smooth scroll
- Animations d'apparition
- Design responsive

## 🪟 Système de Modals

### 1. 🛒 CartModal (`CartModal.tsx`)
Modal de gestion du panier d'achat.

**Fonctionnalités :**
- Affichage des articles avec images
- Contrôles de quantité (+/-)
- Suppression d'articles
- Calcul automatique des totaux
- Gestion de la livraison gratuite
- Bouton de checkout
- Animation des modifications

**États :**
- Panier vide avec call-to-action
- Liste des articles avec détails
- Résumé de commande avec frais

### 2. 📦 ProductModal (`ProductModal.tsx`)
Modal de détail produit (à développer).

**Fonctionnalités prévues :**
- Images produit avec galerie
- Sélection de variantes (saveurs)
- Description détaillée
- Avis clients
- Ajout au panier

### 3. 💳 CheckoutModal (`CheckoutModal.tsx`)
Modal de finalisation de commande (à développer).

**Fonctionnalités prévues :**
- Formulaire d'adresse
- Intégration Stripe
- Récapitulatif de commande
- Validation des données

## 🎨 Layouts Spécialisés

### 1. ErrorLayout
Layout pour les pages d'erreur (404, 500, etc.).
```tsx
<ErrorLayout>
  <ErrorPage />
</ErrorLayout>
```

### 2. AuthLayout
Layout pour l'authentification avec fond dégradé.
```tsx
<AuthLayout>
  <LoginForm />
</AuthLayout>
```

### 3. AdminLayout
Layout pour les pages d'administration.
```tsx
<AdminLayout>
  <AdminDashboard />
</AdminLayout>
```

## 🎭 Animations et Transitions

### Animations Header
- Logo qui tourne périodiquement
- Navigation avec effet de soulignement
- Badge panier avec scale animation
- Menu mobile avec rotation d'icône

### Animations Footer
- Apparition progressive des sections
- Hover effects sur les réseaux sociaux
- Animations de soumission newsletter

### Animations Modals
- Overlay avec backdrop blur
- Contenu avec scale et slide
- Animations de liste pour le panier
- Transitions fluides entre états

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations Mobile
- Menu hamburger
- Navigation en overlay
- Tailles de police adaptées
- Espacement optimisé
- Touch-friendly buttons

### Adaptations Tablet
- Navigation condensée
- Grilles adaptatives
- Modals redimensionnées

## ♿ Accessibilité

### Standards respectés
- **WCAG 2.1 AA** compliance
- Navigation clavier complète
- ARIA labels appropriés
- Contrastes de couleur conformes
- Focus visible et logique

### Fonctionnalités
- Skip links pour la navigation
- Screen reader friendly
- Keyboard shortcuts
- Reduced motion support

## 🔧 Configuration et Personnalisation

### Variables CSS
```css
:root {
  --header-height: 4rem;
  --header-height-lg: 5rem;
  --footer-bg: theme('colors.gray.900');
  --modal-backdrop: rgba(0, 0, 0, 0.5);
}
```

### Classes Tailwind personnalisées
```css
.header-blur {
  @apply bg-white/95 backdrop-blur-md;
}

.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
}
```

## 🧪 Tests et Validation

### Tests recommandés
- Navigation entre sections
- Ouverture/fermeture des modals
- Responsive sur différents devices
- Accessibilité avec screen readers
- Performance des animations

### Validation
- HTML sémantique
- ARIA attributes
- Color contrast
- Keyboard navigation
- Mobile usability

## 🚀 Performance

### Optimisations
- Lazy loading des modals
- Animations GPU-accelerated
- Images optimisées
- Code splitting par modal
- Memoization des composants

### Métriques cibles
- **LCP** : < 2.5s
- **FID** : < 100ms
- **CLS** : < 0.1
- **Lighthouse Score** : > 90

## 🔄 État Global

### Stores utilisés
- **useUI** : Gestion des modals et état UI
- **useCart** : Données du panier
- **useProduct** : Produit sélectionné
- **useNotifications** : Toast notifications

### Synchronisation
- Persistance du panier
- État des modals
- Préférences utilisateur
- Données de session

## 📦 Structure des Fichiers

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── index.ts
├── modals/
│   ├── CartModal.tsx
│   ├── ProductModal.tsx
│   ├── CheckoutModal.tsx
│   └── index.ts
└── ui/
    ├── Modal.tsx
    ├── Toast.tsx
    └── ...
```

## 🎯 Bonnes Pratiques

1. **Utiliser les layouts appropriés** selon le type de page
2. **Respecter la hiérarchie des modals** (une seule à la fois)
3. **Optimiser les animations** pour les performances
4. **Tester l'accessibilité** régulièrement
5. **Maintenir la cohérence** du design system
6. **Gérer les états de chargement** appropriés
