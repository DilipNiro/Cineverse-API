import * as movieService from "../services/movieService.js";

export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieById(Number(req.params.id));
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = await movieService.createMovie(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await movieService.updateMovie(Number(req.params.id), req.body);
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    await movieService.deleteMovie(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};