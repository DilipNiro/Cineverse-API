import * as watchlistService from "../services/watchlistService.js";

export const addToWatchlist = async (req, res, next) => {
  try {
    const watchlist = await watchlistService.addToWatchlist(
      req.user.id,
      req.body.movieId
    );
    res.status(201).json(watchlist);
  } catch (err) {
    next(err);
  }
};

export const getUserWatchlist = async (req, res, next) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : req.user.id;
    const watchlist = await watchlistService.getUserWatchlist(userId);
    res.json(watchlist);
  } catch (err) {
    next(err);
  }
};

export const removeFromWatchlist = async (req, res, next) => {
  try {
    await watchlistService.removeFromWatchlist(
      Number(req.params.id),
      req.user.id
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const checkMovieInWatchlist = async (req, res, next) => {
  try {
    const result = await watchlistService.checkMovieInWatchlist(
      req.user.id,
      Number(req.params.movieId)
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

