import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const createReview = async (userId, reviewData) => {
  const { movieId, rating, comment } = reviewData;

  // Vérifier que le film existe
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) throw createError(404, "Film non trouvé");

  // Vérifier si l'utilisateur a déjà laissé un avis pour ce film
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      movieId,
    },
  });

  if (existingReview) {
    throw createError(400, "Vous avez déjà laissé un avis pour ce film");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      movieId,
      rating,
      comment: comment || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return review;
};

export const getReviewsByMovie = async (movieId) => {
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) throw createError(404, "Film non trouvé");

  const reviews = await prisma.review.findMany({
    where: { movieId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const getReviewsByUser = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const getReviewById = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!review) throw createError(404, "Avis non trouvé");
  return review;
};

export const updateReview = async (reviewId, userId, updateData) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw createError(404, "Avis non trouvé");

  // Vérifier que l'utilisateur est le propriétaire de l'avis
  if (review.userId !== userId) {
    throw createError(403, "Vous n'êtes pas autorisé à modifier cet avis");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      movie: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return updatedReview;
};

export const deleteReview = async (reviewId, userId, userRole) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw createError(404, "Avis non trouvé");

  // Seul le propriétaire ou un admin peut supprimer
  if (review.userId !== userId && userRole !== "admin") {
    throw createError(403, "Vous n'êtes pas autorisé à supprimer cet avis");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Avis supprimé avec succès" };
};

