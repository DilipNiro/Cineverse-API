import { Router } from "express";
import * as directorController from "../controllers/directorController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createDirectorSchema, updateDirectorSchema } from "../validators/directorValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";

const router = Router();

/**
 * @swagger
 * /directors:
 *   get:
 *     summary: Récupérer tous les réalisateurs
 *     description: Retourne la liste de tous les réalisateurs disponibles.
 *     tags: [Réalisateurs]
 *     responses:
 *       200:
 *         description: Liste des réalisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */
router.get("/", directorController.getAllDirectors);

/**
 * @swagger
 * /directors/{id}:
 *   get:
 *     summary: Récupérer un réalisateur par son identifiant
 *     description: Retourne les détails d'un réalisateur avec la liste des films associés.
 *     tags: [Réalisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réalisateur récupéré avec succès
 *       404:
 *         description: Réalisateur non trouvé
 */
router.get("/:id", directorController.getDirectorById);

/**
 * @swagger
 * /directors:
 *   post:
 *     summary: Créer un nouveau réalisateur
 *     description: Crée un nouveau réalisateur. Nécessite une authentification admin.
 *     tags: [Réalisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Christopher Nolan"
 *     responses:
 *       201:
 *         description: Réalisateur créé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.post("/", authRequired, requireAdmin, validate(createDirectorSchema), logAction("CREATE", "Director"), directorController.createDirector);

/**
 * @swagger
 * /directors/{id}:
 *   put:
 *     summary: Mettre à jour un réalisateur
 *     description: Met à jour les données d'un réalisateur. Nécessite une authentification admin.
 *     tags: [Réalisateurs]
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
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Réalisateur mis à jour avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Réalisateur non trouvé
 */
router.put("/:id", authRequired, requireAdmin, validate(updateDirectorSchema), logAction("UPDATE", "Director"), directorController.updateDirector);

/**
 * @swagger
 * /directors/{id}:
 *   delete:
 *     summary: Supprimer un réalisateur
 *     description: Supprime un réalisateur. Nécessite une authentification admin. Impossible si le réalisateur est utilisé par des films.
 *     tags: [Réalisateurs]
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
 *         description: Réalisateur supprimé avec succès
 *       400:
 *         description: Réalisateur utilisé par des films
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Réalisateur non trouvé
 */
router.delete("/:id", authRequired, requireAdmin, logAction("DELETE", "Director"), directorController.deleteDirector);

export default router;

