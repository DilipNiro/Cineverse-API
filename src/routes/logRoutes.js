import { Router } from "express";
import * as logController from "../controllers/logController.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const router = Router();

// Toutes les routes nécessitent une authentification admin
router.use(authRequired, requireAdmin);

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Récupérer tous les logs
 *     description: Retourne la liste des logs avec filtres optionnels. Réservé aux administrateurs.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, SIGNUP, ERROR, ACCESS]
 *         description: Filtrer par type d'action
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *           enum: [User, Movie, Review, Watchlist, Genre, Actor, Director, Auth, System]
 *         description: Filtrer par entité
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrer par identifiant utilisateur
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début pour filtrer les logs
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin pour filtrer les logs
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Nombre maximum de logs à retourner
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Nombre de logs à ignorer (pagination)
 *     responses:
 *       200:
 *         description: Liste des logs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *                 total:
 *                   type: integer
 *                   description: Nombre total de logs correspondant aux filtres
 *                 limit:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.get("/", logController.getAllLogs);

/**
 * @swagger
 * /logs/user/{userId}:
 *   get:
 *     summary: Récupérer les logs d'un utilisateur
 *     description: Retourne les logs associés à un utilisateur spécifique. Réservé aux administrateurs.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'utilisateur
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre maximum de logs à retourner
 *     responses:
 *       200:
 *         description: Logs de l'utilisateur récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.get("/user/:userId", logController.getLogsByUser);

/**
 * @swagger
 * /logs/entity/{entity}/{entityId}:
 *   get:
 *     summary: Récupérer les logs d'une entité spécifique
 *     description: Retourne les logs associés à une entité spécifique. Réservé aux administrateurs.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [User, Movie, Review, Watchlist, Genre, Actor, Director]
 *         description: Type d'entité
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'entité
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Nombre maximum de logs à retourner
 *     responses:
 *       200:
 *         description: Logs de l'entité récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.get("/entity/:entity/:entityId", logController.getLogsByEntity);

/**
 * @swagger
 * /logs/errors:
 *   get:
 *     summary: Récupérer les logs d'erreur
 *     description: Retourne uniquement les logs d'erreur. Réservé aux administrateurs.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Nombre maximum de logs à retourner
 *     responses:
 *       200:
 *         description: Logs d'erreur récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.get("/errors", logController.getErrorLogs);

export default router;

