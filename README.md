# CineVerseApi - API REST de Gestion de Films

API REST complète pour une plateforme de gestion de films développée en JavaScript avec Express.js, PostgreSQL et MongoDB.

## Technologies Utilisées

### Backend
- **Node.js** (ESM) - Runtime JavaScript
- **Express.js** (v5.1.0) - Framework web
- **JavaScript** (pur, sans TypeScript)

### Bases de données
- **PostgreSQL** - Base de données relationnelle (via Prisma ORM v6.19.0)
- **MongoDB** - Base de données NoSQL (via Mongoose v8.0.0) pour les logs

### Sécurité
- **JWT** (jsonwebtoken v9.0.2) - Authentification avec Access Token (15min) et Refresh Token (7j)
- **bcrypt** (v6.0.0) - Hash des mots de passe
- **Helmet** (v8.1.0) - Sécurisation des headers HTTP
- **CORS** (v2.8.5) - Configuration Cross-Origin Resource Sharing
- **Express Rate Limit** (v8.2.1) - Limitation des requêtes (100 req/15min)

### Validation & Logging
- **Joi** (v18.0.1) - Validation des données d'entrée
- **Morgan** (v1.10.0) - Logging HTTP

### Documentation
- **Swagger JSDoc** (v6.2.8) - Génération de documentation API
- **Swagger UI Express** (v5.0.1) - Interface interactive pour tester l'API

### Tests
- **Jest** (v30.2.0) - Framework de tests
- **Supertest** (v7.1.4) - Tests d'intégration HTTP

### Développement
- **Nodemon** (v3.1.11) - Hot reload en développement
- **Prisma** (v6.19.0) - ORM et migrations

## Pré-requis

Avant de lancer le projet, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur)
- **npm** ou **yarn**
- **PostgreSQL** (v14 ou supérieur)
- **MongoDB** (v6 ou supérieur)
- **Git**

## Installation et Lancement

### 1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT>
cd CineVerseApi
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Port du serveur
PORT=5000

# PostgreSQL
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/cineversedb"

# MongoDB
MONGO_URI="mongodb://localhost:27017/cineversedb"

# JWT Secrets
ACCESS_TOKEN_SECRET="votre_secret_access_token_tres_securise"
REFRESH_TOKEN_SECRET="votre_secret_refresh_token_tres_securise"
```

### 4. Préparer la base PostgreSQL

Exécutez les migrations Prisma pour créer les tables :

```bash
npx prisma migrate dev
```

Optionnel : Peupler la base avec des données de test :

```bash
npx prisma db seed
```

### 5. Lancer MongoDB

Si MongoDB n'est pas déjà lancé, démarrez-le :

```bash
# macOS (avec Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 6. Lancer le serveur

#### Mode développement (avec hot reload)

```bash
npm run dev
```

#### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Documentation de l'API (Swagger)

Une fois le serveur lancé, accédez à la documentation interactive Swagger :

**URL** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Cette interface vous permet de :
- Consulter tous les endpoints disponibles
- Tester les requêtes directement depuis le navigateur
- Voir les schémas de données requis
- Comprendre les codes de réponse HTTP

## Exemples d'Utilisation des Endpoints Clés

### Endpoint Public : Inscription d'un utilisateur

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "password": "MotDePasse123!"
  }'
```

**Réponse** (201 Created) :
```json
{
  "id": 1,
  "name": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "role": "user",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### Endpoint Public : Connexion

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "MotDePasse123!"
  }'
```

**Réponse** (200 OK) :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Endpoint Public : Récupérer tous les films

```bash
curl -X GET http://localhost:5000/movies
```

**Réponse** (200 OK) :
```json
[
  {
    "id": 1,
    "title": "Inception",
    "description": "Un voleur expérimenté dans l'art de l'extraction...",
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "duration": 148,
    "posterUrl": "https://example.com/inception.jpg",
    "genres": [...],
    "actors": [...],
    "director": {...}
  }
]
```

### Endpoint Protégé : Créer un film (Admin uniquement)

```bash
curl -X POST http://localhost:5000/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{
    "title": "The Dark Knight",
    "description": "Un superhéros protecteur de Gotham City...",
    "releaseDate": "2008-07-18",
    "duration": 152,
    "posterUrl": "https://example.com/dark_knight.jpg",
    "directorId": 1,
    "genres": [1, 2],
    "actors": [1, 2, 3]
  }'
```

**Réponse** (201 Created) :
```json
{
  "id": 2,
  "title": "The Dark Knight",
  "description": "Un superhéros protecteur de Gotham City...",
  "releaseDate": "2008-07-18T00:00:00.000Z",
  "duration": 152,
  "posterUrl": "https://example.com/dark_knight.jpg",
  "createdAt": "2025-01-15T11:00:00.000Z"
}
```

### Endpoint Protégé : Consulter ma watchlist

```bash
curl -X GET http://localhost:5000/watchlist/me \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN"
```

**Réponse** (200 OK) :
```json
[
  {
    "id": 1,
    "userId": 1,
    "movieId": 1,
    "movie": {
      "id": 1,
      "title": "Inception",
      "description": "...",
      "releaseDate": "2010-07-16T00:00:00.000Z",
      "duration": 148
    },
    "addedAt": "2025-01-15T12:00:00.000Z"
  }
]
```

## Tester l'API

Exécutez la suite de tests Jest :

```bash
npm test
```

Les tests couvrent :
- Authentification (signup, login, refresh, logout)
- CRUD sur les films
- Gestion des reviews
- Gestion de la watchlist
- Gestion des genres, acteurs et réalisateurs

## Architecture du Projet

```
CineVerseApi/
├── src/
│   ├── routes/          # Définition des endpoints
│   ├── controllers/     # Réception des requêtes et appel aux services
│   ├── services/        # Logique métier
│   ├── middlewares/     # Auth, validation, logging, erreurs
│   ├── models/          # Schémas MongoDB (Mongoose)
│   ├── validators/      # Validation Joi
│   ├── utils/           # Helpers (JWT, errors)
│   ├── tests/           # Tests Jest + Supertest
│   ├── swagger/         # Configuration Swagger
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── prisma/
│   └── schema.prisma    # Schéma PostgreSQL
├── .env                 # Variables d'environnement
├── package.json
└── README.md
```

## Fonctionnalités Principales

### Gestion des utilisateurs
- Inscription (signup) avec hash bcrypt
- Connexion (login) avec JWT
- Refresh des tokens
- Déconnexion (logout) avec révocation de token
- Rôles : `user` / `admin`

### Gestion des films
- CRUD complet (Create, Read, Update, Delete)
- Relations avec genres, acteurs, réalisateurs
- Routes publiques (GET) et protégées (POST/PUT/DELETE - Admin)

### Gestion des avis (Reviews)
- Les utilisateurs connectés peuvent créer/modifier/supprimer leurs avis
- Note (rating) et commentaire
- Associés à un film et un utilisateur

### Gestion de la watchlist
- Ajouter/supprimer des films à regarder
- Consultation de la watchlist personnelle

### Gestion des genres, acteurs, réalisateurs
- CRUD protégé (Admin uniquement)
- Relations many-to-many avec les films

### Logging complet
- Tous les événements sont enregistrés dans MongoDB
- Actions : CREATE, UPDATE, DELETE, LOGIN, LOGOUT, ERROR
- Métadonnées : IP, User-Agent, endpoint, statusCode

## Sécurité Implémentée

- **JWT Authentication** : Access token (15min) + Refresh token (7j)
- **Password Hashing** : bcrypt avec salt rounds = 10
- **Rate Limiting** : 100 requêtes max par 15 minutes
- **CORS** : Configuration pour autoriser les origins spécifiques
- **Helmet** : Protection des headers HTTP
- **Validation** : Joi pour valider toutes les entrées utilisateur
- **Error Handling** : Middleware global de gestion d'erreurs
- **Token Revocation** : Liste noire des tokens lors du logout


