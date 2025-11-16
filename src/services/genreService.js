import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const getAllGenres = async () => {
  return prisma.genre.findMany({
    include: {
      movies: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getGenreById = async (id) => {
  const genre = await prisma.genre.findUnique({
    where: { id },
    include: {
      movies: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!genre) throw createError(404, "Genre non trouvé");
  return genre;
};

export const createGenre = async (data) => {
  const existingGenre = await prisma.genre.findUnique({
    where: { name: data.name },
  });

  if (existingGenre) {
    throw createError(400, "Ce genre existe déjà");
  }

  return prisma.genre.create({
    data,
    include: {
      movies: true,
    },
  });
};

export const updateGenre = async (id, data) => {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw createError(404, "Genre non trouvé");

  // Vérifier si le nouveau nom existe déjà
  if (data.name && data.name !== genre.name) {
    const existingGenre = await prisma.genre.findUnique({
      where: { name: data.name },
    });
    if (existingGenre) {
      throw createError(400, "Ce nom de genre existe déjà");
    }
  }

  return prisma.genre.update({
    where: { id },
    data,
    include: {
      movies: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
};

export const deleteGenre = async (id) => {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw createError(404, "Genre non trouvé");

  // Vérifier si le genre est utilisé par des films
  const moviesWithGenre = await prisma.movieGenre.findFirst({
    where: { genreId: id },
  });

  if (moviesWithGenre) {
    throw createError(400, "Impossible de supprimer ce genre car il est utilisé par des films");
  }

  return prisma.genre.delete({
    where: { id },
  });
};

