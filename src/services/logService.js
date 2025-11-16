import { Log } from "../models/log.model.js";

export const createLog = async (logData) => {
  try {
    const log = new Log(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error("Erreur lors de la création du log:", error);
    // Ne pas faire échouer la requête si le log échoue
    return null;
  }
};

export const getAllLogs = async (filters = {}) => {
  const {
    action,
    entity,
    userId,
    startDate,
    endDate,
    limit = 100,
    skip = 0,
  } = filters;

  const query = {};

  // Filtrer par action si fourni
  if (action && typeof action === "string" && action.trim() !== "") {
    query.action = action;
  }

  // Filtrer par entité si fourni
  if (entity && typeof entity === "string" && entity.trim() !== "") {
    query.entity = entity;
  }

  // Filtrer par userId si fourni (vérifier que c'est un nombre valide)
  if (userId !== undefined && userId !== null && !isNaN(userId)) {
    query.userId = parseInt(userId);
  }

  // Filtrer par dates si fournies
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const logs = await Log.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Log.countDocuments(query);

  return {
    logs,
    total,
    limit: parseInt(limit),
    skip: parseInt(skip),
  };
};

export const getLogsByUser = async (userId, limit = 50) => {
  const logs = await Log.find({ userId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return logs;
};

export const getLogsByEntity = async (entity, entityId, limit = 50) => {
  const logs = await Log.find({ entity, entityId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return logs;
};

export const getErrorLogs = async (limit = 100) => {
  const logs = await Log.find({ action: "ERROR" })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return logs;
};

export const deleteOldLogs = async (daysOld = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await Log.deleteMany({
    createdAt: { $lt: cutoffDate },
    action: { $ne: "ERROR" }, // Conserver les erreurs plus longtemps
  });

  return result;
};

