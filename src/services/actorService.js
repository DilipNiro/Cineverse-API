import { prisma } from "../app.js";
import { createError } from "../utils/error.js";

export const getAllActors = async () => {
  return prisma.actor.findMany({
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
      fullName: "asc",
    },
  });
};

export const getActorById = async (id) => {
  const actor = await prisma.actor.findUnique({
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

  if (!actor) throw createError(404, "Acteur non trouvé");
  return actor;
};

export const createActor = async (data) => {
  return prisma.actor.create({
    data,
    include: {
      movies: true,
    },
  });
};

export const updateActor = async (id, data) => {
  const actor = await prisma.actor.findUnique({ where: { id } });
  if (!actor) throw createError(404, "Acteur non trouvé");

  return prisma.actor.update({
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

export const deleteActor = async (id) => {
  const actor = await prisma.actor.findUnique({ where: { id } });
  if (!actor) throw createError(404, "Acteur non trouvé");

  // Vérifier si l'acteur est utilisé par des films
  const moviesWithActor = await prisma.movieActor.findFirst({
    where: { actorId: id },
  });

  if (moviesWithActor) {
    throw createError(400, "Impossible de supprimer cet acteur car il est utilisé par des films");
  }

  return prisma.actor.delete({
    where: { id },
  });
};

