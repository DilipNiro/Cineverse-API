import { Router } from "express";
import * as reviewController from "../controllers/reviewController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { createReviewSchema, updateReviewSchema } from "../validators/reviewValidator.js";
import { authRequired } from "../middlewares/authMiddleware.js";
import { logAction } from "../middlewares/logMiddleware.js";

const router = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Créer un nouvel avis
 *     description: Permet à un utilisateur authentifié de créer un avis pour un film. Un utilisateur ne peut laisser qu'un seul avis par film.
 *     tags: [Avis]
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
 *               - rating
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: Identifiant du film
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note attribuée au film (entre 1 et 5)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Commentaire optionnel
 *                 example: "Excellent film, je le recommande vivement !"
 *     responses:
 *       201:
 *         description: Avis créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Données invalides ou avis déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Vous avez déjà laissé un avis pour ce film"
 *               status: 400
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Film non trouvé
 */
router.post("/", authRequired, validate(createReviewSchema), logAction("CREATE", "Review"), reviewController.createReview);

/**
 * @swagger
 * /reviews/movie/{movieId}:
 *   get:
 *     summary: Récupérer tous les avis d'un film
 *     description: Retourne la liste de tous les avis laissés pour un film spécifique.
 *     tags: [Avis]
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
 *         description: Liste des avis récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Film non trouvé
 */
router.get("/movie/:movieId", reviewController.getReviewsByMovie);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Récupérer tous les avis d'un utilisateur
 *     description: Retourne la liste de tous les avis laissés par un utilisateur spécifique.
 *     tags: [Avis]
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
 *         description: Liste des avis récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/user/:userId", reviewController.getReviewsByUser);

/**
 * @swagger
 * /reviews/me:
 *   get:
 *     summary: Récupérer mes avis
 *     description: Retourne la liste de tous les avis de l'utilisateur authentifié.
 *     tags: [Avis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des avis récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Non authentifié
 */
router.get("/me", authRequired, reviewController.getReviewsByUser);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Récupérer un avis par son identifiant
 *     description: Retourne les détails d'un avis spécifique.
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'avis
 *         example: 1
 *     responses:
 *       200:
 *         description: Avis récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Avis non trouvé
 */
router.get("/:id", reviewController.getReviewById);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Mettre à jour un avis
 *     description: Permet à l'utilisateur propriétaire de l'avis de le modifier.
 *     tags: [Avis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'avis
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Nouvelle note (entre 1 et 5)
 *                 example: 4
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Nouveau commentaire
 *                 example: "Très bon film avec quelques défauts"
 *     responses:
 *       200:
 *         description: Avis mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Vous n'êtes pas autorisé à modifier cet avis
 *       404:
 *         description: Avis non trouvé
 */
router.put("/:id", authRequired, validate(updateReviewSchema), logAction("UPDATE", "Review"), reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis
 *     description: Permet à l'utilisateur propriétaire ou à un admin de supprimer un avis.
 *     tags: [Avis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de l'avis
 *         example: 1
 *     responses:
 *       204:
 *         description: Avis supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Vous n'êtes pas autorisé à supprimer cet avis
 *       404:
 *         description: Avis non trouvé
 */
router.delete("/:id", authRequired, logAction("DELETE", "Review"), reviewController.deleteReview);

export default router;

