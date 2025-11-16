import * as genreService from "../services/genreService.js";

export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await genreService.getAllGenres();
    res.json(genres);
  } catch (err) {
    next(err);
  }
};

export const getGenreById = async (req, res, next) => {
  try {
    const genre = await genreService.getGenreById(Number(req.params.id));
    res.json(genre);
  } catch (err) {
    next(err);
  }
};

export const createGenre = async (req, res, next) => {
  try {
    const genre = await genreService.createGenre(req.body);
    res.status(201).json(genre);
  } catch (err) {
    next(err);
  }
};

export const updateGenre = async (req, res, next) => {
  try {
    const genre = await genreService.updateGenre(Number(req.params.id), req.body);
    res.json(genre);
  } catch (err) {
    next(err);
  }
};

export const deleteGenre = async (req, res, next) => {
  try {
    await genreService.deleteGenre(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

