import { Router } from "express";
import * as genreController from "../controllers/genreController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createGenreSchema, updateGenreSchema } from "../validators/genreValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";

const router = Router();

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Récupérer tous les genres
 *     description: Retourne la liste de tous les genres disponibles.
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Liste des genres récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 */
router.get("/", genreController.getAllGenres);

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Récupérer un genre par son identifiant
 *     description: Retourne les détails d'un genre spécifique avec la liste des films associés.
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du genre
 *     responses:
 *       200:
 *         description: Genre récupéré avec succès
 *       404:
 *         description: Genre non trouvé
 */
router.get("/:id", genreController.getGenreById);

/**
 * @swagger
 * /genres:
 *   post:
 *     summary: Créer un nouveau genre
 *     description: Crée un nouveau genre. Nécessite une authentification admin.
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Science-Fiction"
 *     responses:
 *       201:
 *         description: Genre créé avec succès
 *       400:
 *         description: Genre déjà existant
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.post("/", authRequired, requireAdmin, validate(createGenreSchema), logAction("CREATE", "Genre"), genreController.createGenre);

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Mettre à jour un genre
 *     description: Met à jour les données d'un genre. Nécessite une authentification admin.
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Genre mis à jour avec succès
 *       400:
 *         description: Nom de genre déjà utilisé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Genre non trouvé
 */
router.put("/:id", authRequired, requireAdmin, validate(updateGenreSchema), logAction("UPDATE", "Genre"), genreController.updateGenre);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Supprimer un genre
 *     description: Supprime un genre. Nécessite une authentification admin. Impossible si le genre est utilisé par des films.
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Genre supprimé avec succès
 *       400:
 *         description: Genre utilisé par des films
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Genre non trouvé
 */
router.delete("/:id", authRequired, requireAdmin, logAction("DELETE", "Genre"), genreController.deleteGenre);

export default router;

