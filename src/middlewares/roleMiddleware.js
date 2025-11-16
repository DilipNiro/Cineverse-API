import { createError } from "../utils/error.js";

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw createError(403, "Accès réservé aux administrateurs");
  }
  next();
};

export const requireUser = (req, res, next) => {
  if (req.user.role !== "user") {
    throw createError(403, "Accès réservé aux utilisateurs");
  }
  next();
};