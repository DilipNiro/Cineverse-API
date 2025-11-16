import { verifyAccessToken } from "../utils/jwt.js";
import { createError } from "../utils/error.js";
import { isTokenBlacklisted } from "../services/tokenBlacklistService.js";

export const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw createError(401, "Aucun token fourni");

    const token = authHeader.split(" ")[1];

    // Vérifier si le token est valide (JWT)
    const decoded = verifyAccessToken(token);

    // Vérifier si le token est dans la liste noire
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw createError(401, "Token révoqué");
    }

    req.user = decoded;
    req.token = token; // Sauvegarder le token pour un usage ultérieur (ex: logout)
    next();
  } catch (err) {
    // Si l'erreur a déjà un statusCode (erreur personnalisée), la transmettre
    if (err.statusCode) {
      next(err);
    } else {
      // Sinon, c'est une erreur JWT (invalide ou expiré)
      next(createError(401, "Token invalide ou expiré"));
    }
  }
};

