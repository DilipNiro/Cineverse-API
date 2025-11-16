import bcrypt from "bcrypt";
import { prisma } from "../app.js";
import { createError } from "../utils/error.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from "../utils/jwt.js";
import { isTokenBlacklisted, addToBlacklist } from "./tokenBlacklistService.js";

export const signup = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw createError(400, "Cet email est déjà utilisé");
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError(400, "Identifiants invalides");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(400, "Identifiants invalides");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

export const refreshToken = async (token) => {
  // Vérifier si le refresh token est dans la liste noire
  const isBlacklisted = await isTokenBlacklisted(token);
  if (isBlacklisted) {
    throw createError(401, "Token de rafraîchissement révoqué");
  }

  const decoded = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) throw createError(404, "Utilisateur non trouvé");

  // Générer les nouveaux tokens
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Révoquer l'ancien refresh token (rotation sécurisée)
  // Cela empêche la réutilisation du même refresh token
  try {
    const refreshExpiresAt = new Date(decoded.exp * 1000);
    await addToBlacklist(token, user.id, refreshExpiresAt);
  } catch (err) {
    // Si la révocation échoue, on peut quand même retourner les nouveaux tokens
    // mais c'est préférable de logger l'erreur
    console.warn(`Erreur lors de la révocation de l'ancien refresh token: ${err.message}`);
  }

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (accessToken, refreshToken, userId, accessTokenExp) => {
    // 1. Blacklisting de l'Access Token
    const accessExpiresAt = new Date(accessTokenExp * 1000); 
    await addToBlacklist(accessToken, userId, accessExpiresAt);

    // 2. Blacklisting du Refresh Token (si fourni)
    if (refreshToken) {
      try {
        // On décode pour obtenir l'ID et l'expiration
        const refreshDecoded = verifyRefreshToken(refreshToken);
        
       
        if (refreshDecoded.id === userId) {
            const refreshExpiresAt = new Date(refreshDecoded.exp * 1000);
            await addToBlacklist(refreshToken, userId, refreshExpiresAt);
        } else {
            // Loguer si un utilisateur tente de révoquer un jeton qui ne lui appartient pas
            console.warn(`Tentative de révocation d'un refresh token pour un utilisateur incorrect: ${refreshDecoded.id} vs ${userId}`);
        }
      } catch (err) {
        // Le token était peut-être déjà expiré ou invalide. On log et on continue.
        console.warn(`Erreur lors de la révocation du refresh token (probablement expiré/invalide) : ${err.message}`);
      }
    }

    return { message: "Déconnexion réussie" };
};
