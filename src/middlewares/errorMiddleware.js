import { logError } from "./logMiddleware.js";

export const errorHandler = (err, req, res, next) => {
  // Logger l'erreur dans MongoDB
  logError(err, req);

  res.status(err.status || 500).json({
    message: err.message || "Erreur interne du serveur",
  });
};