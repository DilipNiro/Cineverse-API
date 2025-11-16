import Joi from "joi";

export const createMovieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  releaseDate: Joi.date().optional(),
  duration: Joi.number().integer().min(1).optional(),
  posterUrl: Joi.string().uri().optional(),
  directorId: Joi.number().integer().optional(),
  genres: Joi.array().items(Joi.number().integer()).optional(),
  actors: Joi.array().items(Joi.number().integer()).optional(),
});

