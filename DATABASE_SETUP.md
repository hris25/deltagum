# Configuration de la Base de Données - Deltagum

## 🗄️ Configuration Prisma

Le projet utilise **Prisma ORM** avec **PostgreSQL** (Supabase) pour la gestion de la base de données.

### Structure de la Base de Données

- **Products** : Produits Deltagum
- **ProductVariants** : Variantes de saveurs (Fraise, Myrtille, Pomme)
- **Customers** : Clients et leurs informations
- **Orders** : Commandes avec statuts
- **OrderItems** : Articles dans les commandes
- **LoyaltyProgram** : Programme de fidélité

### Commandes Prisma Disponibles

```bash
# Générer le client Prisma
pnpm db:generate

# Pousser le schéma vers la base de données (développement)
pnpm db:push

# Créer une migration
pnpm db:migrate

# Peupler la base de données avec des données de test
pnpm db:seed

# Ouvrir Prisma Studio (interface graphique)
pnpm db:studio
```

### Configuration des Variables d'Environnement

1. Copiez `.env.example` vers `.env`
2. Configurez votre URL de base de données Supabase :

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Initialisation de la Base de Données

Une fois la connexion configurée :

```bash
# 1. Générer le client Prisma
pnpm db:generate

# 2. Pousser le schéma vers la base de données
pnpm db:push

# 3. Peupler avec des données de test
pnpm db:seed
```

### Données de Test

Le script de seed crée :
- 1 produit "Deltagum Premium" avec 3 variantes de saveurs
- 1 client de test avec programme de fidélité
- 1 commande de test avec 3 articles

### Troubleshooting

Si vous rencontrez des problèmes de connexion :
1. Vérifiez que votre base de données Supabase est active
2. Vérifiez les identifiants de connexion
3. Assurez-vous que l'IP est autorisée dans Supabase
4. Utilisez `pnpm db:push` au lieu de `migrate dev` pour le développement initial
