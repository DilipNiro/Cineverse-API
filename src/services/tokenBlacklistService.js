import { prisma } from "../app.js";
import crypto from "crypto";

/**
 * Hache un token pour un stockage sécurisé
 * On hache les tokens avant de les stocker en base pour plus de sécurité
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Ajoute un token à la liste noire
 * @param {string} token - Le token JWT à révoquer
 * @param {number} userId - L'ID de l'utilisateur associé au token
 * @param {Date} expiresAt - Date d'expiration du token
 */
export const addToBlacklist = async (token, userId, expiresAt) => {
  const hashedToken = hashToken(token);

  await prisma.revokedToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt,
    },
  });
};

/**
 * Vérifie si un token est dans la liste noire
 * @param {string} token - Le token JWT à vérifier
 * @returns {Promise<boolean>} - True si le token est révoqué
 */
export const isTokenBlacklisted = async (token) => {
  const hashedToken = hashToken(token);

  const revokedToken = await prisma.revokedToken.findUnique({
    where: { token: hashedToken },
  });

  return !!revokedToken;
};

/**
 * Nettoie les tokens expirés de la liste noire (optionnel, pour les performances)
 * Peut être appelé périodiquement via une tâche cron
 */
export const cleanExpiredTokens = async () => {
  const now = new Date();

  const result = await prisma.revokedToken.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  return result.count;
};
