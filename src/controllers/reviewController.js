import * as reviewService from "../services/reviewService.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const getReviewsByMovie = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByMovie(Number(req.params.movieId));
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId ? Number(req.params.userId) : req.user.id;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(Number(req.params.id));
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      Number(req.params.id),
      req.user.id,
      req.body
    );
    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(
      Number(req.params.id),
      req.user.id,
      req.user.role
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

