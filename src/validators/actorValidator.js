import Joi from "joi";

export const createActorSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom complet doit contenir au moins 2 caractères.",
    "string.max": "Le nom complet ne peut pas dépasser 100 caractères.",
    "string.empty": "Le nom complet est requis.",
  }),
});

export const updateActorSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Le nom complet doit contenir au moins 2 caractères.",
    "string.max": "Le nom complet ne peut pas dépasser 100 caractères.",
  }),
});

