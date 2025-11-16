import { createLog } from "../services/logService.js";
import { prisma } from "../app.js";

export const logAction = (action, entity) => {
  return async (req, res, next) => {
    // Intercepter res.json, res.send et res.end pour capturer toutes les réponses
    const originalJson = res.json;
    const originalSend = res.send;
    const originalEnd = res.end;

    // Fonction pour créer le log
    const createLogEntry = async (data = null) => {
      // Pour les créations, récupérer l'ID depuis la réponse
      // Pour les mises à jour/suppressions, utiliser req.params.id
      let entityId = req.params?.id || req.body?.id || null;
      if (action === "CREATE" && data?.id) {
        entityId = data.id.toString();
      } else if (entityId) {
        entityId = entityId.toString();
      }

      // Récupérer l'email de l'utilisateur si nécessaire
      let userEmail = req.user?.email || null;
      if (req.user?.id && !userEmail) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { email: true },
          });
          userEmail = user?.email || null;
        } catch (err) {
          console.warn(`Impossible de récupérer l'email pour l'utilisateur ${req.user.id}:`, err.message);
        }
      }

      const logData = {
        action,
        entity,
        entityId,
        userId: req.user?.id || null,
        userEmail,
        method: req.method,
        endpoint: req.originalUrl || req.url,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        statusCode: res.statusCode,
        message: `${action} ${entity}`,
        metadata: {
          body: req.body,
          params: req.params,
          query: req.query,
        },
      };

      createLog(logData).catch((err) => {
        console.error("Erreur lors de l'enregistrement du log:", err);
      });
    };

    // Intercepter res.json
    res.json = function (data) {
      createLogEntry(data);
      return originalJson.call(this, data);
    };

    // Intercepter res.send (utilisé pour les 204 No Content)
    res.send = function (data) {
      // Ne logger que si ce n'est pas déjà loggé par res.json
      // Pour les 204, data est généralement undefined ou vide
      if (res.statusCode === 204 || !res.headersSent) {
        createLogEntry(data);
      }
      return originalSend.call(this, data);
    };

    // Intercepter res.end (fallback)
    res.end = function (data, encoding) {
      if (res.statusCode === 204 && !res.headersSent) {
        createLogEntry();
      }
      return originalEnd.call(this, data, encoding);
    };

    next();
  };
};

export const logError = async (error, req) => {
  // Récupérer l'email de l'utilisateur si nécessaire
  let userEmail = req.user?.email || null;
  if (req.user?.id && !userEmail) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { email: true },
      });
      userEmail = user?.email || null;
    } catch (err) {
      // Si la récupération échoue, on continue sans l'email
      console.warn(`Impossible de récupérer l'email pour l'utilisateur ${req.user.id}:`, err.message);
    }
  }

  const logData = {
    action: "ERROR",
    entity: "System",
    entityId: null,
    userId: req.user?.id || null,
    userEmail,
    method: req.method,
    endpoint: req.originalUrl || req.url,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    statusCode: error.status || 500,
    message: error.message || "Erreur inconnue",
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    },
    metadata: {
      body: req.body,
      params: req.params,
      query: req.query,
    },
  };

  createLog(logData).catch((err) => {
    console.error("Erreur lors de l'enregistrement du log d'erreur:", err);
  });
};

