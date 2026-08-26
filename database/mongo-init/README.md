# Initialisation MongoDB

Le service `mongodb` de `docker-compose.yml` démarre avec `--replSet rs0` — Prisma
en a besoin pour exécuter des transactions (utilisées à la création d'une commande).
Le healthcheck du conteneur initie automatiquement ce replica set à un seul nœud au
premier démarrage (`rs.initiate(...)`) ; le service `backend` attend que ce
healthcheck passe avant de se connecter, donc aucune action manuelle n'est requise.

Le schéma (collections, index, validations) est géré par Prisma :

```bash
cd backend
npx prisma db push   # applique prisma/schema.prisma à la base
npm run seed          # données de démonstration (admin/seller/buyer + catalogue)
```
