import Joi from "joi";

export const createReviewSchema = Joi.object({
  movieId: Joi.number().integer().positive().required().messages({
    "number.base": "L'identifiant du film doit être un nombre.",
    "number.positive": "L'identifiant du film doit être positif.",
    "any.required": "L'identifiant du film est requis.",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La note doit être un nombre.",
    "number.min": "La note doit être entre 1 et 5.",
    "number.max": "La note doit être entre 1 et 5.",
    "any.required": "La note est requise.",
  }),
  comment: Joi.string().max(1000).allow("", null).optional().messages({
    "string.max": "Le commentaire ne peut pas dépasser 1000 caractères.",
  }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.base": "La note doit être un nombre.",
    "number.min": "La note doit être entre 1 et 5.",
    "number.max": "La note doit être entre 1 et 5.",
  }),
  comment: Joi.string().max(1000).allow("", null).optional().messages({
    "string.max": "Le commentaire ne peut pas dépasser 1000 caractères.",
  }),
});

