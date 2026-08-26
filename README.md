# Fast Deals Auto

**Fast Deals Auto** est une marketplace de vente et d'achat de véhicules d'occasion : annonces
vérifiées, recherche multicritère, paiement sécurisé (Stripe) et gestion multi-rôles (acheteur, vendeur, admin).

## Stack technique

| Couche      | Technologies |
|-------------|--------------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router, React Hook Form, Zod, Stripe.js |
| Backend     | NestJS 10, Prisma (connecteur MongoDB), JWT (access + refresh), Passport, Stripe, Nodemailer |
| Base de données | MongoDB 7 |
| Infra       | Docker, Docker Compose, Nginx (reverse proxy) |

## Structure du monorepo

```
fast-deals-auto/
├── frontend/       # Application React (SPA)
├── backend/        # API NestJS + Prisma
├── database/       # Init MongoDB, notes de schéma
├── docs/           # Documentation d'architecture
├── docker/         # (réservé — assets Docker additionnels)
├── nginx/          # Reverse proxy global (production)
├── docker-compose.yml
└── README.md
```

Détail du frontend et du backend : voir [docs/architecture.md](docs/architecture.md).

## Démarrage rapide (développement local)

### Prérequis
- Node.js 20+
- MongoDB 7 (local ou via Docker), démarré **en replica set** — Prisma en a
  besoin pour les transactions (utilisées à la commande) :
  ```bash
  mongod --replSet rs0 --dbpath <votre-dossier-de-données>
  # puis, une seule fois, dans un autre terminal :
  mongosh --eval "rs.initiate({_id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }]})"
  ```

### 1. Backend

```bash
cd backend
cp .env.example .env      # renseigner DATABASE_URL, secrets JWT, clés Stripe…
npm install
npx prisma generate
npx prisma db push        # applique le schéma à MongoDB
npm run seed               # crée admin/vendeur/acheteur + un catalogue de 16 annonces avec photos
npm run start:dev          # http://localhost:4000/api/v1
```

Comptes de démonstration créés par le seed (mot de passe `Passw0rd!`) :
`admin@carmarket.com` · `seller@carmarket.com` · `buyer@carmarket.com`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY
npm install
npm run dev                 # http://localhost:5173
```

## Démarrage avec Docker Compose (tout-en-un)

```bash
cp backend/.env.example backend/.env   # variables lues par docker-compose via ${...}
docker compose up --build
```

Services exposés :
- `http://localhost` → application complète (via Nginx)
- `http://localhost:4000/api/v1` → API backend (accès direct)
- `mongodb://localhost:27017` → base de données

## Fonctionnalités principales

- **Catalogue** : marques, modèles, catégories, filtres avancés (prix, année, kilométrage, carburant, transmission, état).
- **Annonces** : publication par les vendeurs, galerie d'images, modération admin (validation/rejet).
- **Compte** : inscription/connexion (JWT + refresh token), mot de passe oublié par email, profil, favoris.
- **Commerce** : panier, commande, paiement Stripe, historique de commandes, avis vérifiés.
- **Administration** : tableau de bord (KPIs), modération des annonces, gestion des utilisateurs et commandes.

## Licence

Projet privé — tous droits réservés.
