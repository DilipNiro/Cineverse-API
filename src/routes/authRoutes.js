import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";
import { logAction } from "../middlewares/logMiddleware.js";
import { authRequired } from "../middlewares/authMiddleware.js";


const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     description: Permet de créer un nouveau compte utilisateur avec un email et un mot de passe. Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nom complet de l'utilisateur
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Mot de passe (min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)
 *                 example: "MotDePasse123!"
 *     responses:
 *       201:
 *         description: Compte utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: "Jean Dupont"
 *               email: "user@example.com"
 *               role: "user"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "L'email est déjà utilisé ou le format du mot de passe est invalide"
 *               status: 400
 *       500:
 *         description: Erreur serveur
 */
router.post("/signup", validate(signupSchema), logAction("SIGNUP", "Auth"), authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: |
 *       Authentifie un utilisateur avec son email et son mot de passe. 
 *       Retourne un token d'accès (durée de vie : 15 minutes) et un token de rafraîchissement (durée de vie : 7 jours).
 *       Utilisez le refresh token pour obtenir de nouveaux tokens lorsque l'access token expire.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe de l'utilisateur
 *                 example: "MotDePasse123!"
 *     responses:
 *       200:
 *         description: Connexion réussie, tokens retournés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Données de connexion invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Email ou mot de passe incorrect"
 *               status: 400
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Email ou mot de passe incorrect"
 *               status: 401
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", validate(loginSchema), logAction("LOGIN", "Auth"), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     description: |
 *       Permet d'obtenir un nouveau token d'accès et un nouveau token de rafraîchissement en utilisant un token de rafraîchissement valide.
 *       
 *       **Important** : L'ancien refresh token est automatiquement révoqué (rotation sécurisée). 
 *       Vous devez utiliser le nouveau refresh token retourné pour les prochaines requêtes de rafraîchissement.
 *       Un refresh token ne peut être utilisé qu'une seule fois.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement JWT valide (sera révoqué après utilisation)
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Tokens rafraîchis avec succès. L'ancien refresh token a été révoqué.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Token de rafraîchissement invalide, expiré ou déjà révoqué
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid:
 *                 summary: Token invalide ou expiré
 *                 value:
 *                   message: "Token de rafraîchissement invalide ou expiré"
 *                   status: 401
 *               revoked:
 *                 summary: Token déjà révoqué
 *                 value:
 *                   message: "Token de rafraîchissement révoqué"
 *                   status: 401
 *       404:
 *         description: Utilisateur associé au token non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Utilisateur non trouvé"
 *               status: 404
 *       500:
 *         description: Erreur serveur
 */
router.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     description: Révoque le token d'accès de l'utilisateur en l'ajoutant à la liste noire. Si un refresh token est fourni, il sera également révoqué. Les tokens révoqués ne seront plus valides pour accéder aux routes protégées.
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de rafraîchissement à révoquer (optionnel)
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie"
 *       401:
 *         description: Token manquant, invalide, expiré ou déjà révoqué
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Token invalide ou expiré"
 *               status: 401
 *       500:
 *         description: Erreur serveur
 */
router.post("/logout", authRequired, logAction("LOGOUT", "Auth"), authController.logout);

export default router;
