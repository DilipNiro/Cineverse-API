import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const getAllDirectors = async () => {
  return prisma.director.findMany({
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });
};

export const getDirectorById = async (id) => {
  const director = await prisma.director.findUnique({
    where: { id },
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
          posterUrl: true,
        },
      },
    },
  });

  if (!director) throw createError(404, "Réalisateur non trouvé");
  return director;
};

export const createDirector = async (data) => {
  return prisma.director.create({
    data,
    include: {
      movies: true,
    },
  });
};

export const updateDirector = async (id, data) => {
  const director = await prisma.director.findUnique({ where: { id } });
  if (!director) throw createError(404, "Réalisateur non trouvé");

  return prisma.director.update({
    where: { id },
    data,
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
        },
      },
    },
  });
};

export const deleteDirector = async (id) => {
  const director = await prisma.director.findUnique({ where: { id } });
  if (!director) throw createError(404, "Réalisateur non trouvé");

  // Vérifier si le réalisateur est utilisé par des films
  const moviesWithDirector = await prisma.movie.findFirst({
    where: { directorId: id },
  });

  if (moviesWithDirector) {
    throw createError(400, "Impossible de supprimer ce réalisateur car il est utilisé par des films");
  }

  return prisma.director.delete({
    where: { id },
  });
};

