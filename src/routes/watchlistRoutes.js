import { Router } from "express";
import * as watchlistController from "../controllers/watchlistController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createWatchlistSchema } from "../validators/watchlistValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";

const router = Router();

/**
 * @swagger
 * /watchlist:
 *   post:
 *     summary: Ajouter un film à la liste de souhaits
 *     description: Permet à un utilisateur authentifié d'ajouter un film à sa liste de souhaits.
 *     tags: [Liste de souhaits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: Identifiant du film à ajouter
 *                 example: 1
 *     responses:
 *       201:
 *         description: Film ajouté à la liste de souhaits avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Watchlist'
 *       400:
 *         description: Film déjà dans la liste de souhaits ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Ce film est déjà dans votre liste de souhaits"
 *               status: 400
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Film non trouvé
 */
router.post("/", authRequired, validate(createWatchlistSchema), logAction("CREATE", "Watchlist"), watchlistController.addToWatchlist);

/**
 * @swagger
 * /watchlist/me:
 *   get:
 *     summary: Récupérer ma liste de souhaits
 *     description: Retourne la liste de souhaits de l'utilisateur authentifié.
 *     tags: [Liste de souhaits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de souhaits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Watchlist'
 *       401:
 *         description: Non authentifié
 */
router.get("/me", authRequired, watchlistController.getUserWatchlist);

/**
 * @swagger
 * /watchlist/user/{userId}:
 *   get:
 *     summary: Récupérer la liste de souhaits d'un utilisateur
 *     description: Retourne la liste de souhaits d'un utilisateur spécifique.
 *     tags: [Liste de souhaits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'utilisateur
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste de souhaits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Watchlist'
 */
router.get("/user/:userId", watchlistController.getUserWatchlist);

/**
 * @swagger
 * /watchlist/check/{movieId}:
 *   get:
 *     summary: Vérifier si un film est dans ma liste de souhaits
 *     description: Vérifie si un film spécifique est présent dans la liste de souhaits de l'utilisateur authentifié.
 *     tags: [Liste de souhaits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du film
 *         example: 1
 *     responses:
 *       200:
 *         description: Statut de vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isInWatchlist:
 *                   type: boolean
 *                   description: Indique si le film est dans la liste
 *                   example: true
 *                 watchlistId:
 *                   type: integer
 *                   nullable: true
 *                   description: Identifiant de l'élément de la liste si présent
 *                   example: 1
 *       401:
 *         description: Non authentifié
 */
router.get("/check/:movieId", authRequired, watchlistController.checkMovieInWatchlist);

/**
 * @swagger
 * /watchlist/{id}:
 *   delete:
 *     summary: Retirer un film de la liste de souhaits
 *     description: Permet à l'utilisateur de retirer un film de sa liste de souhaits.
 *     tags: [Liste de souhaits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'élément de la liste de souhaits
 *         example: 1
 *     responses:
 *       204:
 *         description: Film retiré de la liste de souhaits avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Vous n'êtes pas autorisé à supprimer cet élément
 *       404:
 *         description: Élément de la liste de souhaits non trouvé
 */
router.delete("/:id", authRequired, logAction("DELETE", "Watchlist"), watchlistController.removeFromWatchlist);

export default router;

