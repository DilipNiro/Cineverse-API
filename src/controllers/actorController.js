import * as actorService from "../services/actorService.js";

export const getAllActors = async (req, res, next) => {
  try {
    const actors = await actorService.getAllActors();
    res.json(actors);
  } catch (err) {
    next(err);
  }
};

export const getActorById = async (req, res, next) => {
  try {
    const actor = await actorService.getActorById(Number(req.params.id));
    res.json(actor);
  } catch (err) {
    next(err);
  }
};

export const createActor = async (req, res, next) => {
  try {
    const actor = await actorService.createActor(req.body);
    res.status(201).json(actor);
  } catch (err) {
    next(err);
  }
};

export const updateActor = async (req, res, next) => {
  try {
    const actor = await actorService.updateActor(Number(req.params.id), req.body);
    res.json(actor);
  } catch (err) {
    next(err);
  }
};

export const deleteActor = async (req, res, next) => {
  try {
    await actorService.deleteActor(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

