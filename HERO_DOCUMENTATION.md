# Documentation de la Section Hero - Deltagum

## 🎯 Vue d'ensemble

La section Hero de Deltagum est la première impression que les visiteurs ont du site. Elle combine des animations sophistiquées, des effets visuels immersifs et un design moderne pour créer une expérience utilisateur mémorable qui reflète l'esprit ludique et gourmand de la marque.

## 🎨 Design et Esthétique

### Palette de couleurs
- **Dégradé principal** : Rose → Orange → Jaune (from-pink-50 via-orange-50 to-yellow-50)
- **Texte principal** : Dégradés multicolores pour chaque ligne du titre
- **Accents** : Rose (#ec4899), Orange (#f97316), Bleu (#3b82f6), Vert (#22c55e)

### Typographie
- **Titre principal** : 4xl à 7xl selon l'écran, font-bold
- **Sous-titre** : lg à 2xl, text-gray-600
- **Police** : Inter (définie dans layout.tsx)

### Responsive Design
- **Mobile** : < 768px - Titre 4xl, layout vertical
- **Tablet** : 768px - 1024px - Titre 5xl-6xl
- **Desktop** : > 1024px - Titre 7xl, layout optimisé

## 🎭 Animations et Effets

### 1. Animations du Titre
```typescript
heroTitle: {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
}
```

### 2. Bonbons Flottants
- **6 bonbons** positionnés stratégiquement
- **Animations cycliques** : rotation, translation, scale
- **Délais échelonnés** : 0.5s entre chaque bonbon
- **Emojis utilisés** : 🍭, 🍬, 🧁, 🍰, 🎂, 🍪

### 3. Effets Parallaxe
- **Scroll-based animations** avec useScroll et useTransform
- **Éléments décoratifs** qui bougent à différentes vitesses
- **Indicateur de scroll** animé

### 4. Interactions Souris
- **Gradient suiveur** : Effet radial qui suit le curseur
- **Hover effects** sur les boutons
- **Animations de tap** pour le feedback tactile

## 🧩 Structure des Composants

### HeroSection.tsx
Composant principal contenant :
- **Badge de nouveauté** avec animation scaleIn
- **Titre principal** en 3 lignes avec dégradés
- **Sous-titre descriptif** avec mentions des saveurs
- **Boutons CTA** : "Découvrir nos saveurs" et "Voir mon panier"
- **Statistiques** : 3 saveurs, 100% artisanal, plaisir infini
- **Indicateur de scroll** animé

### Composants d'Animation
1. **FloatingCandy** : Bonbons flottants réutilisables
2. **ConfettiAnimation** : Système de confettis pour célébrations
3. **ParallaxSection** : Effets de parallaxe configurables

## 🎮 Interactions Utilisateur

### Boutons d'Action
1. **"Découvrir nos saveurs"**
   - Scroll smooth vers #products
   - Animation hover avec scale et shadow
   - Icône bonbon 🍭

2. **"Voir mon panier"**
   - Ouvre la modal de panier
   - Style outline avec hover rose
   - Icône panier 🛒

### Navigation
- **Smooth scrolling** vers les sections
- **Indicateur visuel** de scroll en bas
- **Responsive** sur tous les devices

## 📊 Statistiques Affichées

### Métriques Clés
1. **3 Saveurs uniques** - Couleur rose
2. **100% Artisanal** - Couleur orange  
3. **∞ Plaisir garanti** - Couleur violette

### Animations des Stats
- **Apparition échelonnée** avec spring animation
- **Scale effect** pour attirer l'attention
- **Délais progressifs** : 1.4s, 1.6s, 1.8s

## 🎨 Éléments Visuels

### Background
- **Dégradé principal** : Rose → Orange → Jaune
- **Pattern SVG** : Points roses en overlay (30% opacity)
- **Gradient interactif** : Suit le mouvement de la souris

### Éléments Décoratifs
- **Bonbons rotatifs** dans les coins (opacity 20%)
- **Parallaxe différentiel** pour la profondeur
- **Animations infinies** pour le dynamisme

## 🔧 Configuration et Personnalisation

### Variables d'Animation
```typescript
// Durées
const TITLE_DURATION = 0.8
const SUBTITLE_DELAY = 0.3
const BUTTON_DELAY = 0.6
const STATS_DELAY = 1.2

// Amplitudes
const FLOATING_AMPLITUDE = 20
const PARALLAX_SPEED = 0.5
```

### Customisation des Couleurs
```css
:root {
  --hero-gradient-from: theme('colors.pink.50');
  --hero-gradient-via: theme('colors.orange.50');
  --hero-gradient-to: theme('colors.yellow.50');
  --hero-text-primary: theme('colors.gray.900');
  --hero-text-secondary: theme('colors.gray.600');
}
```

## 📱 Optimisations Mobile

### Adaptations Spécifiques
- **Taille de police réduite** pour la lisibilité
- **Espacement optimisé** pour les petits écrans
- **Boutons full-width** sur mobile
- **Animations allégées** pour les performances

### Performance
- **GPU acceleration** pour les animations
- **Lazy loading** des éléments non critiques
- **Debounced mouse tracking** pour éviter les calculs excessifs

## 🧪 Tests et Validation

### Tests Recommandés
1. **Animation fluidity** sur différents devices
2. **Scroll behavior** et navigation
3. **Responsive breakpoints**
4. **Performance** avec DevTools
5. **Accessibilité** avec screen readers

### Métriques de Performance
- **LCP** : < 2.5s (Large Contentful Paint)
- **FID** : < 100ms (First Input Delay)
- **CLS** : < 0.1 (Cumulative Layout Shift)

## ♿ Accessibilité

### Standards Respectés
- **WCAG 2.1 AA** compliance
- **Keyboard navigation** complète
- **Screen reader** friendly
- **Reduced motion** support

### Implémentations
```css
@media (prefers-reduced-motion: reduce) {
  .floating-candy {
    animation: none;
  }
}
```

## 🔄 Intégrations

### Stores Zustand
- **useUI** : Gestion des modals
- **useCart** : État du panier pour le badge
- **useNotifications** : Feedback utilisateur

### Hooks Personnalisés
- **useScroll** : Effets de parallaxe
- **useTransform** : Animations basées sur le scroll
- **useState** : Tracking de la souris

## 🚀 Optimisations Futures

### Améliorations Prévues
1. **Lottie animations** pour les bonbons
2. **WebGL effects** pour plus d'immersion
3. **Intersection Observer** pour les animations au scroll
4. **Service Worker** pour le cache des animations

### A/B Testing
- **Variations du titre** pour optimiser la conversion
- **Différents CTA** pour mesurer l'engagement
- **Couleurs alternatives** pour l'impact visuel

## 📈 Métriques de Succès

### KPIs à Surveiller
1. **Taux de scroll** vers les produits
2. **Clics sur les CTA** principaux
3. **Temps passé** sur la section
4. **Taux de rebond** depuis le Hero

### Analytics
- **Google Analytics 4** pour le tracking
- **Hotjar** pour les heatmaps
- **Lighthouse** pour la performance
