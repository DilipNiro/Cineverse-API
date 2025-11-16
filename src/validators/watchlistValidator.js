import Joi from "joi";

export const createWatchlistSchema = Joi.object({
  movieId: Joi.number().integer().positive().required().messages({
    "number.base": "L'identifiant du film doit être un nombre.",
    "number.positive": "L'identifiant du film doit être positif.",
    "any.required": "L'identifiant du film est requis.",
  }),
});

