import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom ne peut pas dépasser 100 caractères.",
    "string.empty": "Le nom est requis.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Format d'email invalide.",
    "string.empty": "L'email est requis.",
  }),
  password: Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&.*:-])"))
  .required()
  .messages({
    "string.pattern.base": "Le mot de passe doit contenir 1 majuscule, 1 chiffre et 1 caractère spécial.",
    "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
    "string.empty": "Le mot de passe est requis.",
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

