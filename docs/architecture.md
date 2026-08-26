# Architecture — Fast Deals Auto

## Vue d'ensemble

```
Client (navigateur)
      │
      ▼
   Nginx (reverse proxy, :80)
   ├── /            → frontend (React SPA, servi par Nginx interne au conteneur)
   ├── /api/v1/*     → backend (NestJS, :4000)
   └── /uploads/*    → backend (fichiers statiques)
      │
      ▼
   MongoDB (:27017) — accédé par le backend via Prisma
```

## Backend — NestJS + Prisma + MongoDB

- **Modules métier** : `auth`, `users`, `vehicles`, `brands`, `models`, `categories`, `images`,
  `favorites`, `reviews`, `orders`, `payments`, `notifications`, `upload`, `search`, `dashboard`, `admin`, `mail`.
- **Sécurité** : JWT (access + refresh), guard global (`JwtAuthGuard` + décorateur `@Public()`),
  guard de rôles (`RolesGuard` + décorateur `@Roles()`), Helmet, rate limiting (`@nestjs/throttler`).
- **Persistance** : Prisma avec le connecteur MongoDB (`backend/prisma/schema.prisma`), un modèle par collection listée
  dans le cahier des charges (users, roles, vehicles, vehicle_images, brands, models, categories, favorites,
  reviews, orders, order_items, payments, addresses, notifications, logs).
- **Paiement** : Stripe (Payment Intents + webhook signé).

## Frontend — React + TypeScript + Vite + Tailwind

- **État global** : Redux Toolkit (`auth`, `cart`, `favorites`) + `AuthContext` pour l'authentification.
- **Données serveur** : services Axios dédiés par domaine (`services/*.service.ts`) avec intercepteur de
  rafraîchissement automatique du token.
- **Routing** : `react-router-dom`, layouts séparés (`MainLayout` public, `AdminLayout` protégé par rôle).
- **UI** : composants réutilisables dans `components/`, design system Tailwind (couleurs `primary`/`accent`).

## Rôles

| Rôle          | Portée                                                              |
|---------------|----------------------------------------------------------------------|
| `BUYER`       | Parcourir, favoris, panier, commandes, avis                         |
| `SELLER`      | + publier/gérer des annonces, tableau de bord vendeur               |
| `ADMIN`       | + modération des annonces, gestion utilisateurs/commandes           |
| `SUPER_ADMIN` | Accès complet, gestion des rôles                                    |

## Déploiement

Voir `docker-compose.yml` à la racine : 4 services (`mongodb`, `backend`, `frontend`, `nginx`).
Le reverse proxy Nginx racine (`nginx/nginx.conf`) route `/api` et `/uploads` vers le backend, le reste vers le frontend.
