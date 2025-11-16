import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineVerse API",
      version: "1.0.0",
      description: "API REST pour la gestion d'une plateforme cinématographique. Gestion des utilisateurs, authentification JWT, films, critiques et listes de souhaits.",
      
      license: {
        name: "ISC"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Serveur de développement"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez le token JWT obtenu lors de la connexion"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique de l'utilisateur",
              example: 1
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
              example: "Niro Dilip"
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email de l'utilisateur",
              example: "user@example.com"
            },
            role: {
              type: "string",
              description: "Rôle de l'utilisateur",
              enum: ["user", "admin"],
              example: "user"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du compte"
            }
          }
        },
        Movie: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique du film",
              example: 1
            },
            title: {
              type: "string",
              description: "Titre du film",
              example: "Inception"
            },
            description: {
              type: "string",
              description: "Description du film",
              example: "Un voleur expérimenté dans l'art de l'extraction...",
              nullable: true
            },
            releaseDate: {
              type: "string",
              format: "date-time",
              description: "Date de sortie du film",
              nullable: true
            },
            duration: {
              type: "integer",
              description: "Durée du film en minutes",
              example: 148,
              nullable: true
            },
            posterUrl: {
              type: "string",
              format: "uri",
              description: "URL de l'affiche du film",
              example: "https://example.com/poster.jpg",
              nullable: true
            },
            directorId: {
              type: "integer",
              description: "Identifiant du réalisateur",
              example: 1,
              nullable: true
            },
            genres: {
              type: "array",
              description: "Liste des identifiants des genres",
              items: {
                type: "integer"
              },
              example: [1, 2],
              nullable: true
            },
            actors: {
              type: "array",
              description: "Liste des identifiants des acteurs",
              items: {
                type: "integer"
              },
              example: [1, 2, 3],
              nullable: true
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date d'ajout du film"
            }
          }
        },
        CreateMovieInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              description: "Titre du film (requis)",
              example: "Inception"
            },
            description: {
              type: "string",
              description: "Description du film",
              example: "Un voleur expérimenté dans l'art de l'extraction..."
            },
            releaseDate: {
              type: "string",
              format: "date-time",
              description: "Date de sortie du film",
              example: "2010-07-16T00:00:00.000Z"
            },
            duration: {
              type: "integer",
              minimum: 1,
              description: "Durée du film en minutes",
              example: 148
            },
            posterUrl: {
              type: "string",
              format: "uri",
              description: "URL de l'affiche du film",
              example: "https://example.com/poster.jpg"
            },
            directorId: {
              type: "integer",
              description: "Identifiant du réalisateur",
              example: 1
            },
            genres: {
              type: "array",
              description: "Liste des identifiants des genres",
              items: {
                type: "integer"
              },
              example: [1, 2]
            },
            actors: {
              type: "array",
              description: "Liste des identifiants des acteurs",
              items: {
                type: "integer"
              },
              example: [1, 2, 3]
            }
          }
        },
        Review: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique de l'avis",
              example: 1
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              description: "Note attribuée au film (entre 1 et 5)",
              example: 5
            },
            comment: {
              type: "string",
              description: "Commentaire de l'utilisateur",
              example: "Excellent film, je le recommande vivement !",
              nullable: true
            },
            userId: {
              type: "integer",
              description: "Identifiant de l'utilisateur",
              example: 1
            },
            movieId: {
              type: "integer",
              description: "Identifiant du film",
              example: 1
            },
            user: {
              type: "object",
              description: "Informations de l'utilisateur",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "string", example: "Niro Dilip" },
                email: { type: "string", example: "user@example.com" }
              }
            },
            movie: {
              type: "object",
              description: "Informations du film",
              properties: {
                id: { type: "integer", example: 1 },
                title: { type: "string", example: "Inception" }
              }
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création de l'avis"
            }
          }
        },
        Watchlist: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique de l'élément de la liste",
              example: 1
            },
            userId: {
              type: "integer",
              description: "Identifiant de l'utilisateur",
              example: 1
            },
            movieId: {
              type: "integer",
              description: "Identifiant du film",
              example: 1
            },
            movie: {
              allOf: [
                { $ref: '#/components/schemas/Movie' }
              ],
              description: "Informations complètes du film"
            },
            addedAt: {
              type: "string",
              format: "date-time",
              description: "Date d'ajout à la liste de souhaits"
            }
          }
        },
        Tokens: {
          type: "object",
          description: "Paire de tokens JWT retournée lors de la connexion ou du rafraîchissement",
          properties: {
            accessToken: {
              type: "string",
              description: "Token d'accès JWT (durée de vie : 15 minutes). Utilisé pour authentifier les requêtes API via le header 'Authorization: Bearer <token>'",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            refreshToken: {
              type: "string",
              description: "Token de rafraîchissement JWT (durée de vie : 7 jours). Utilisé pour obtenir de nouveaux tokens. Note : lors du rafraîchissement, l'ancien refresh token est révoqué et un nouveau est généré (rotation sécurisée).",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
          },
          required: ["accessToken", "refreshToken"]
        },
        Genre: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique du genre",
              example: 1
            },
            name: {
              type: "string",
              description: "Nom du genre",
              example: "Science-Fiction"
            },
            movies: {
              type: "array",
              description: "Films associés à ce genre",
              items: {
                type: "object"
              }
            }
          }
        },
        Actor: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique de l'acteur",
              example: 1
            },
            fullName: {
              type: "string",
              description: "Nom complet de l'acteur",
              example: "Leonardo DiCaprio"
            },
            movies: {
              type: "array",
              description: "Films associés à cet acteur",
              items: {
                type: "object"
              }
            }
          }
        },
        Director: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique du réalisateur",
              example: 1
            },
            fullName: {
              type: "string",
              description: "Nom complet du réalisateur",
              example: "Christopher Nolan"
            },
            movies: {
              type: "array",
              description: "Films réalisés",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  title: { type: "string", example: "Inception" },
                  releaseDate: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        Log: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Identifiant MongoDB du log",
              example: "507f1f77bcf86cd799439011"
            },
            action: {
              type: "string",
              enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "SIGNUP", "ERROR", "ACCESS"],
              description: "Type d'action enregistrée",
              example: "CREATE"
            },
            entity: {
              type: "string",
              enum: ["User", "Movie", "Review", "Watchlist", "Genre", "Actor", "Director", "Auth", "System"],
              description: "Type d'entité concernée",
              example: "Movie"
            },
            entityId: {
              type: "string",
              description: "Identifiant de l'entité",
              example: "1",
              nullable: true
            },
            userId: {
              type: "integer",
              description: "Identifiant de l'utilisateur ayant effectué l'action",
              example: 1,
              nullable: true
            },
            userEmail: {
              type: "string",
              description: "Email de l'utilisateur",
              example: "user@example.com",
              nullable: true
            },
            method: {
              type: "string",
              enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
              description: "Méthode HTTP utilisée",
              example: "POST"
            },
            endpoint: {
              type: "string",
              description: "Endpoint appelé",
              example: "/movies"
            },
            ipAddress: {
              type: "string",
              description: "Adresse IP de la requête",
              example: "127.0.0.1"
            },
            statusCode: {
              type: "integer",
              description: "Code de statut HTTP de la réponse",
              example: 201
            },
            message: {
              type: "string",
              description: "Message du log",
              example: "CREATE Movie"
            },
            error: {
              type: "object",
              description: "Détails de l'erreur si applicable",
              nullable: true
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du log"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de mise à jour du log"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message d'erreur",
              example: "Une erreur s'est produite"
            },
            status: {
              type: "integer",
              description: "Code de statut HTTP",
              example: 400
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Authentification",
        description: "Endpoints pour l'authentification et la gestion des utilisateurs"
      },
      {
        name: "Genres",
        description: "Endpoints pour la gestion des genres de films"
      },
      {
        name: "Acteurs",
        description: "Endpoints pour la gestion des acteurs"
      },
      {
        name: "Réalisateurs",
        description: "Endpoints pour la gestion des réalisateurs"
      },
      {
        name: "Films",
        description: "Endpoints pour la gestion des films"
      },
      {
        name: "Avis",
        description: "Endpoints pour la gestion des avis et critiques des utilisateurs"
      },
      {
        name: "Liste de souhaits",
        description: "Endpoints pour la gestion des listes de souhaits des utilisateurs"
      },
      {
        name: "Logs",
        description: "Endpoints pour consulter les logs système (admin uniquement)"
      }
    ]
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "CineVerse API - Documentation"
  }));
  console.log("📘 Documentation Swagger disponible sur http://localhost:5000/api-docs");
};
