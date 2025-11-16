import * as logService from "../services/logService.js";

export const getAllLogs = async (req, res, next) => {
  try {
    const filters = {
      action: req.query.action,
      entity: req.query.entity,
      userId: req.query.userId ? parseInt(req.query.userId) : undefined,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: req.query.limit || 100,
      skip: req.query.skip || 0,
    };

    const result = await logService.getAllLogs(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getLogsByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit) || 50;
    const logs = await logService.getLogsByUser(userId, limit);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getLogsByEntity = async (req, res, next) => {
  try {
    const { entity, entityId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const logs = await logService.getLogsByEntity(entity, entityId, limit);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getErrorLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await logService.getErrorLogs(limit);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

