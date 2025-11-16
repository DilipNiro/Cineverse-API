import { Router } from "express";
import * as movieController from "../controllers/movieController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createMovieSchema } from "../validators/movieValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";


const router = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Récupérer tous les films
 *     description: Retourne la liste de tous les films disponibles dans la base de données.
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: Liste des films récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *             example:
 *               - id: 1
 *                 title: "Inception"
 *                 description: "Un voleur expérimenté dans l'art de l'extraction..."
 *                 releaseDate: "2010-07-16T00:00:00.000Z"
 *                 duration: 148
 *                 posterUrl: "https://example.com/inception.jpg"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *               - id: 2
 *                 title: "The Matrix"
 *                 description: "Un programmeur informatique découvre la vérité..."
 *                 releaseDate: "1999-03-31T00:00:00.000Z"
 *                 duration: 136
 *                 posterUrl: "https://example.com/matrix.jpg"
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", movieController.getAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Récupérer un film par son identifiant
 *     description: Retourne les détails d'un film spécifique en utilisant son identifiant.
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du film
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails du film récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *             example:
 *               id: 1
 *               title: "Inception"
 *               description: "Un voleur expérimenté dans l'art de l'extraction..."
 *               releaseDate: "2010-07-16T00:00:00.000Z"
 *               duration: 148
 *               posterUrl: "https://example.com/inception.jpg"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       404:
 *         description: Film non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Film non trouvé"
 *               status: 404
 *       400:
 *         description: Identifiant invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "L'identifiant doit être un nombre"
 *               status: 400
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", movieController.getMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Créer un nouveau film
 *     description: Crée un nouveau film dans la base de données. Nécessite une authentification admin.
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieInput'
 *           example:
 *             title: "The Dark Knight"
 *             description: "Un superhéros protecteur de Gotham City..."
 *             releaseDate: "2008-07-18T00:00:00.000Z"
 *             duration: 152
 *             posterUrl: "https://example.com/dark_knight.jpg"
 *             directorId: 1
 *             genres: [1, 2]
 *             actors: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Film créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *             example:
 *               id: 3
 *               title: "The Dark Knight"
 *               description: "Un superhéros protecteur de Gotham City..."
 *               releaseDate: "2008-07-18T00:00:00.000Z"
 *               duration: 152
 *               posterUrl: "https://example.com/dark_knight.jpg"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Données de création invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Données de création invalides"
 *               status: 400
 *       401:
 *         description: Non authentifié - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Aucun token fourni"
 *               status: 401
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Accès réservé aux administrateurs"
 *               status: 403
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur lors de la création du film"
 *               status: 500
 */
router.post("/", authRequired, requireAdmin, validate(createMovieSchema), logAction("CREATE", "Movie"), movieController.createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Mettre à jour un film
 *     description: Met à jour les données d'un film spécifique en utilisant son identifiant. Nécessite une authentification admin.
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du film
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieInput'
 *           example:
 *             title: "The Dark Knight"
 *             description: "Un superhéros protecteur de Gotham City..."
 *             releaseDate: "2008-07-18T00:00:00.000Z"
 *             duration: 152
 *             posterUrl: "https://example.com/dark_knight.jpg"
 *             directorId: 1
 *             genres: [1, 2]
 *             actors: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *             example:
 *               id: 1
 *               title: "The Dark Knight"
 *               description: "Un superhéros protecteur de Gotham City..."
 *               releaseDate: "2008-07-18T00:00:00.000Z"
 *               duration: 152
 *               posterUrl: "https://example.com/dark_knight.jpg"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Données de mise à jour invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Données de mise à jour invalides"
 *               status: 400
 *       401:
 *         description: Non authentifié - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Aucun token fourni"
 *               status: 401
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Accès réservé aux administrateurs"
 *               status: 403
 *       404:
 *         description: Film non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Film non trouvé"
 *               status: 404
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur lors de la mise à jour du film"
 *               status: 500
 */
router.put("/:id", authRequired, requireAdmin, validate(createMovieSchema), logAction("UPDATE", "Movie"), movieController.updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Supprimer un film
 *     description: Supprime un film spécifique en utilisant son identifiant. Nécessite une authentification admin.
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du film
 *         example: 1
 *     responses:
 *       204:
 *         description: Film supprimé avec succès (pas de contenu retourné)
 *       400:
 *         description: Identifiant invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "L'identifiant doit être un nombre"
 *               status: 400
 *       401:
 *         description: Non authentifié - Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Aucun token fourni"
 *               status: 401
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Accès réservé aux administrateurs"
 *               status: 403
 *       404:
 *         description: Film non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Film non trouvé"
 *               status: 404
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Erreur lors de la suppression du film"
 *               status: 500
 */
router.delete("/:id", authRequired, requireAdmin, logAction("DELETE", "Movie"), movieController.deleteMovie);
export default router;

