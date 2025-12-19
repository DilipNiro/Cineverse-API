import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import actorRoutes from "./routes/actorRoutes.js";
import directorRoutes from "./routes/directorRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import { swaggerDocs } from "./swagger/swaggerConfig.js";

dotenv.config();

// Client Prisma
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
export const prisma = new PrismaClient();

const app = express();

// ----------------------
// Middlewares
// ----------------------

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ----------------------
// Documentation Swagger
// ----------------------
swaggerDocs(app);

// Configuration Helmet pour les headers de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    strictTransportSecurity:
      process.env.NODE_ENV === "production"
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
    frameguard: {
      action: "deny", // ou 'sameorigin'
    },
    xContentTypeOptions: true,
    referrerPolicy: {
      policy: "no-referrer",
    },
  })
);
app.use(morgan("dev"));

// Limiteur de débit : limite les requêtes abusives
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // maximum 100 requêtes par 15 minutes
    message: "Trop de requêtes, veuillez réessayer plus tard.",
  })
);

// ----------------------
// Connexion MongoDB
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));

// ----------------------
// Routes
// ----------------------

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API CineVerse 🚀" });
});

app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/reviews", reviewRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/genres", genreRoutes);
app.use("/actors", actorRoutes);
app.use("/directors", directorRoutes);
app.use("/logs", logRoutes);

// ----------------------
// Middleware d’erreurs global
// ----------------------
app.use(errorHandler);

export default app;
