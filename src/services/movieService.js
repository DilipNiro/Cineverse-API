import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const getAllMovies = async () => {
  return prisma.movie.findMany({
    include: {
      genres: { include: { genre: true } },
      actors: { include: { actor: true } },
      director: true,
      reviews: true,
    },
  });
};

export const getMovieById = async (id) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      actors: { include: { actor: true } },
      director: true,
      reviews: true,
    },
  });

  if (!movie) throw createError(404, "Film non trouvé");
  return movie;
};

export const createMovie = async (movieData) => {
  const {
    title,
    description,
    releaseDate,
    duration,
    posterUrl,
    directorId,
    genres,
    actors,
  } = movieData;

  return prisma.movie.create({
    data: {
      title,
      description,
      releaseDate,
      duration,
      posterUrl,
      director: directorId ? { connect: { id: directorId } } : undefined,
      genres: genres
        ? {
            create: genres.map((id) => ({ genre: { connect: { id } } })),
          }
        : undefined,
      actors: actors
        ? {
            create: actors.map((id) => ({ actor: { connect: { id } } })),
          }
        : undefined,
    },
    include: {
      director: true,
      genres: { include: { genre: true } },
      actors: { include: { actor: true } },
      reviews: true,
    },
  });
};

export const updateMovie = async (id, data) => {
    const movie = await prisma.movie.findUnique({ where: { id } });
    if (!movie) throw createError(404, "Film non trouvé");
  
    const {
      title,
      description,
      releaseDate,
      duration,
      posterUrl,
      directorId,
      genres,
      actors,
    } = data;
  
    return prisma.movie.update({
      where: { id },
      data: {
        title,
        description,
        releaseDate,
        duration,
        posterUrl,
        director: directorId ? { connect: { id: directorId } } : undefined,
  
        // Remplacer les relations si des tableaux sont fournis
        genres: genres
          ? {
              deleteMany: {},
              create: genres.map((id) => ({ genre: { connect: { id } } })),
            }
          : undefined,
  
        actors: actors
          ? {
              deleteMany: {},
              create: actors.map((id) => ({ actor: { connect: { id } } })),
            }
          : undefined,
      },
      include: {
        director: true,
        genres: { include: { genre: true } },
        actors: { include: { actor: true } },
        reviews: true,
      },
    });
  };


export const deleteMovie = async (id) => {
    const movie = await prisma.movie.findUnique({ where: { id } });
    if (!movie) throw createError(404, "Film non trouvé");
  
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });
    await prisma.movieActor.deleteMany({ where: { movieId: id } });
    await prisma.review.deleteMany({ where: { movieId: id } });
    await prisma.watchlist.deleteMany({ where: { movieId: id } });
  
    return prisma.movie.delete({
      where: { id },
    });
  };
  