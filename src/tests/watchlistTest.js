import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

describe("Watchlist API", () => {
  let userToken;
  let user;
  let movie;

  beforeAll(async () => {
    // Nettoyer les données
    await prisma.watchlist.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "watchlistuser@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    // Créer un film
    movie = await prisma.movie.create({
      data: {
        title: "Test Movie for Watchlist",
        description: "A movie to add to watchlist",
      },
    });

    userToken = generateAccessToken(user);
  });

  afterAll(async () => {
    await prisma.watchlist.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // POST /watchlist
  describe("POST /watchlist", () => {
    it("should add a movie to watchlist", async () => {
      const res = await request(app)
        .post("/watchlist")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ movieId: movie.id });

      expect(res.statusCode).toBe(201);
      expect(res.body.movieId).toBe(movie.id);
      expect(res.body).toHaveProperty("id");
    });

    it("should not allow duplicate movie in watchlist", async () => {
      const res = await request(app)
        .post("/watchlist")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ movieId: movie.id });

      expect(res.statusCode).toBe(400);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/watchlist").send({
        movieId: movie.id,
      });

      expect(res.statusCode).toBe(401);
    });

    it("should return 404 for non-existent movie", async () => {
      const res = await request(app)
        .post("/watchlist")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ movieId: 99999 });

      expect(res.statusCode).toBe(404);
    });
  });

  // GET /watchlist/me
  describe("GET /watchlist/me", () => {
    it("should return user's watchlist", async () => {
      const res = await request(app)
        .get("/watchlist/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // GET /watchlist/check/:movieId
  describe("GET /watchlist/check/:movieId", () => {
    it("should check if movie is in watchlist", async () => {
      const res = await request(app)
        .get(`/watchlist/check/${movie.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("isInWatchlist");
      expect(res.body.isInWatchlist).toBe(true);
    });
  });

  // DELETE /watchlist/:id
  describe("DELETE /watchlist/:id", () => {
    it("should remove movie from watchlist", async () => {
      // Récupérer l'ID de la watchlist
      const watchlistRes = await request(app)
        .get("/watchlist/me")
        .set("Authorization", `Bearer ${userToken}`);

      const watchlistId = watchlistRes.body[0].id;

      const res = await request(app)
        .delete(`/watchlist/${watchlistId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});

