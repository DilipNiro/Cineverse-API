import * as directorService from "../services/directorService.js";

export const getAllDirectors = async (req, res, next) => {
  try {
    const directors = await directorService.getAllDirectors();
    res.json(directors);
  } catch (err) {
    next(err);
  }
};

export const getDirectorById = async (req, res, next) => {
  try {
    const director = await directorService.getDirectorById(Number(req.params.id));
    res.json(director);
  } catch (err) {
    next(err);
  }
};

export const createDirector = async (req, res, next) => {
  try {
    const director = await directorService.createDirector(req.body);
    res.status(201).json(director);
  } catch (err) {
    next(err);
  }
};

export const updateDirector = async (req, res, next) => {
  try {
    const director = await directorService.updateDirector(Number(req.params.id), req.body);
    res.json(director);
  } catch (err) {
    next(err);
  }
};

export const deleteDirector = async (req, res, next) => {
  try {
    await directorService.deleteDirector(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

