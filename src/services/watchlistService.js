import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const addToWatchlist = async (userId, movieId) => {
  // Vérifier que le film existe
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) throw createError(404, "Film non trouvé");

  // Vérifier si le film est déjà dans la watchlist
  const existingWatchlist = await prisma.watchlist.findFirst({
    where: {
      userId,
      movieId,
    },
  });

  if (existingWatchlist) {
    throw createError(400, "Ce film est déjà dans votre liste de souhaits");
  }

  const watchlist = await prisma.watchlist.create({
    data: {
      userId,
      movieId,
    },
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          actors: { include: { actor: true } },
          director: true,
        },
      },
    },
  });

  return watchlist;
};

export const getUserWatchlist = async (userId) => {
  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          actors: { include: { actor: true } },
          director: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    orderBy: {
      addedAt: "desc",
    },
  });

  return watchlist;
};

export const removeFromWatchlist = async (watchlistId, userId) => {
  const watchlist = await prisma.watchlist.findUnique({
    where: { id: watchlistId },
  });

  if (!watchlist) throw createError(404, "Élément de la liste de souhaits non trouvé");

  // Vérifier que l'utilisateur est le propriétaire
  if (watchlist.userId !== userId) {
    throw createError(403, "Vous n'êtes pas autorisé à supprimer cet élément");
  }

  await prisma.watchlist.delete({
    where: { id: watchlistId },
  });

  return { message: "Film retiré de votre liste de souhaits avec succès" };
};

export const checkMovieInWatchlist = async (userId, movieId) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: {
      userId,
      movieId,
    },
  });

  return { isInWatchlist: !!watchlist, watchlistId: watchlist?.id || null };
};

