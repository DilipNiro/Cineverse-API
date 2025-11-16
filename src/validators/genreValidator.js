import Joi from "joi";

export const createGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Le nom du genre doit contenir au moins 2 caractères.",
    "string.max": "Le nom du genre ne peut pas dépasser 50 caractères.",
    "string.empty": "Le nom du genre est requis.",
  }),
});

export const updateGenreSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Le nom du genre doit contenir au moins 2 caractères.",
    "string.max": "Le nom du genre ne peut pas dépasser 50 caractères.",
  }),
});

