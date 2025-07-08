# Documentation des Composants UI - Deltagum

## 🎨 Vue d'ensemble

Les composants UI de Deltagum sont construits avec React, TypeScript, Tailwind CSS et Framer Motion pour des animations fluides. Ils suivent un design system cohérent avec des variantes, tailles et états configurables.

## 🧩 Composants Disponibles

### 1. 🔘 Button
Bouton polyvalent avec animations et états de chargement.

**Props principales :**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean
- `rounded`: boolean

**Utilisation :**
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="lg" loading={isLoading}>
  Ajouter au panier
</Button>

<Button 
  variant="outline" 
  icon={<ShoppingCartIcon />}
  iconPosition="left"
>
  Voir le panier
</Button>
```

### 2. 🃏 Card
Conteneur flexible avec variantes et animations.

**Props principales :**
- `variant`: 'default' | 'elevated' | 'outlined' | 'glass'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `rounded`: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `hover`: boolean
- `clickable`: boolean
- `gradient`: boolean

**Composants auxiliaires :**
- `CardHeader`, `CardTitle`, `CardDescription`
- `CardContent`, `CardFooter`

**Utilisation :**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

<Card variant="elevated" hover>
  <CardHeader>
    <CardTitle>Bonbons Deltagum</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Découvrez nos saveurs uniques...</p>
  </CardContent>
</Card>
```

### 3. 🪟 Modal
Modal responsive avec animations et gestion des événements.

**Props principales :**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `description`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closeOnOverlayClick`: boolean
- `closeOnEscape`: boolean
- `showCloseButton`: boolean

**Composants auxiliaires :**
- `ModalHeader`, `ModalBody`, `ModalFooter`

**Utilisation :**
```tsx
import { Modal, ModalHeader, ModalBody } from '@/components/ui'

<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  title="Confirmation"
  size="md"
>
  <ModalBody>
    <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
  </ModalBody>
</Modal>
```

### 4. 📝 Input & Textarea
Champs de saisie avec validation et animations.

**Props principales :**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `variant`: 'default' | 'filled' | 'outlined'
- `inputSize`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

**Utilisation :**
```tsx
import { Input, Textarea } from '@/components/ui'

<Input
  label="Email"
  type="email"
  placeholder="votre@email.com"
  error={errors.email}
  leftIcon={<EmailIcon />}
  fullWidth
/>

<Textarea
  label="Message"
  placeholder="Votre message..."
  rows={4}
  resize="vertical"
/>
```

### 5. 🏷️ Badge
Étiquettes colorées avec variantes spécialisées.

**Props principales :**
- `variant`: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean
- `outline`: boolean
- `icon`: React.ReactNode
- `removable`: boolean
- `onRemove`: () => void

**Badges spécialisés :**
- `OrderStatusBadge`: Pour les statuts de commande
- `LoyaltyBadge`: Pour les niveaux de fidélité

**Utilisation :**
```tsx
import { Badge, OrderStatusBadge, LoyaltyBadge } from '@/components/ui'

<Badge variant="success" icon={<CheckIcon />}>
  Disponible
</Badge>

<OrderStatusBadge status="SHIPPED" />
<LoyaltyBadge level="GOLD" />
```

### 6. ⏳ Loading
Indicateurs de chargement avec plusieurs variantes.

**Props principales :**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'spinner' | 'dots' | 'pulse' | 'candy'
- `color`: 'primary' | 'secondary' | 'white' | 'gray'
- `text`: string
- `fullScreen`: boolean

**Composants spécialisés :**
- `PageLoading`: Pour les pages entières
- `ButtonLoading`: Pour les boutons

**Utilisation :**
```tsx
import { Loading, PageLoading, ButtonLoading } from '@/components/ui'

<Loading variant="candy" size="lg" text="Chargement..." />
<PageLoading text="Chargement de la page..." />
<ButtonLoading size="md" />
```

### 7. 🔔 Toast
Notifications temporaires avec animations.

**Props principales :**
- `notification`: Notification object
- `onRemove`: (id: string) => void

**Composant conteneur :**
- `ToastContainer`: À placer dans le layout principal

**Utilisation :**
```tsx
import { ToastContainer } from '@/components/ui'
import { useNotifications } from '@/stores'

// Dans le layout
<ToastContainer />

// Dans un composant
const { showSuccess, showError } = useNotifications()

const handleSuccess = () => {
  showSuccess('Succès !', 'Produit ajouté au panier')
}

const handleError = () => {
  showError('Erreur', 'Impossible d\'ajouter le produit')
}
```

## 🎨 Design System

### Couleurs principales
- **Primary**: Dégradé rose-orange (`from-pink-500 to-orange-400`)
- **Secondary**: Dégradé violet-bleu (`from-purple-500 to-blue-500`)
- **Success**: Vert (`green-500`)
- **Warning**: Jaune (`yellow-500`)
- **Danger**: Rouge (`red-500`)
- **Info**: Bleu (`blue-500`)

### Tailles standardisées
- **sm**: Petite taille
- **md**: Taille moyenne (défaut)
- **lg**: Grande taille
- **xl**: Très grande taille

### Animations
Tous les composants utilisent Framer Motion pour :
- Animations d'entrée/sortie
- Effets de hover
- Transitions fluides
- Animations de chargement

## 🔧 Personnalisation

### Thème personnalisé
Les composants utilisent Tailwind CSS et peuvent être personnalisés via :
- Classes CSS personnalisées
- Variables CSS
- Configuration Tailwind

### Exemple de personnalisation
```tsx
<Button 
  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
  variant="primary"
>
  Bouton personnalisé
</Button>
```

## 📱 Responsive Design

Tous les composants sont responsive et s'adaptent automatiquement :
- Mobile first
- Breakpoints Tailwind CSS
- Tailles adaptatives
- Touch-friendly sur mobile

## ♿ Accessibilité

Les composants respectent les standards d'accessibilité :
- Support clavier complet
- ARIA labels appropriés
- Contrastes de couleur conformes
- Focus visible
- Screen reader friendly

## 🧪 Tests

Chaque composant peut être testé avec :
- Jest + React Testing Library
- Tests d'accessibilité
- Tests d'interaction
- Tests de responsive

## 📦 Import/Export

```tsx
// Import individuel
import { Button } from '@/components/ui/Button'

// Import groupé
import { Button, Card, Modal } from '@/components/ui'

// Import avec types
import { Button, type ButtonProps } from '@/components/ui'
```

## 🚀 Bonnes Pratiques

1. **Utiliser les variantes** plutôt que des styles personnalisés
2. **Respecter les tailles standardisées** pour la cohérence
3. **Ajouter des labels** pour l'accessibilité
4. **Gérer les états de chargement** avec les composants appropriés
5. **Utiliser les animations** avec modération
6. **Tester sur mobile** pour la responsivité
