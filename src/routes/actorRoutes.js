import { Router } from "express";
import * as actorController from "../controllers/actorController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createActorSchema, updateActorSchema } from "../validators/actorValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";

const router = Router();

/**
 * @swagger
 * /actors:
 *   get:
 *     summary: Récupérer tous les acteurs
 *     description: Retourne la liste de tous les acteurs disponibles.
 *     tags: [Acteurs]
 *     responses:
 *       200:
 *         description: Liste des acteurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 */
router.get("/", actorController.getAllActors);

/**
 * @swagger
 * /actors/{id}:
 *   get:
 *     summary: Récupérer un acteur par son identifiant
 *     description: Retourne les détails d'un acteur avec la liste des films associés.
 *     tags: [Acteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Acteur récupéré avec succès
 *       404:
 *         description: Acteur non trouvé
 */
router.get("/:id", actorController.getActorById);

/**
 * @swagger
 * /actors:
 *   post:
 *     summary: Créer un nouvel acteur
 *     description: Crée un nouvel acteur. Nécessite une authentification admin.
 *     tags: [Acteurs]
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
 *                 example: "Leonardo DiCaprio"
 *     responses:
 *       201:
 *         description: Acteur créé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 */
router.post("/", authRequired, requireAdmin, validate(createActorSchema), logAction("CREATE", "Actor"), actorController.createActor);

/**
 * @swagger
 * /actors/{id}:
 *   put:
 *     summary: Mettre à jour un acteur
 *     description: Met à jour les données d'un acteur. Nécessite une authentification admin.
 *     tags: [Acteurs]
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
 *         description: Acteur mis à jour avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Acteur non trouvé
 */
router.put("/:id", authRequired, requireAdmin, validate(updateActorSchema), logAction("UPDATE", "Actor"), actorController.updateActor);

/**
 * @swagger
 * /actors/{id}:
 *   delete:
 *     summary: Supprimer un acteur
 *     description: Supprime un acteur. Nécessite une authentification admin. Impossible si l'acteur est utilisé par des films.
 *     tags: [Acteurs]
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
 *         description: Acteur supprimé avec succès
 *       400:
 *         description: Acteur utilisé par des films
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Acteur non trouvé
 */
router.delete("/:id", authRequired, requireAdmin, logAction("DELETE", "Actor"), actorController.deleteActor);

export default router;

