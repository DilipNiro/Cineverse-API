import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

describe("Review API", () => {
  let userToken;
  let user;
  let movie;

  beforeAll(async () => {
    // Nettoyer les données
    await prisma.review.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "reviewuser@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    // Créer un film
    movie = await prisma.movie.create({
      data: {
        title: "Test Movie for Review",
        description: "A movie to review",
      },
    });

    userToken = generateAccessToken(user);
  });

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // POST /reviews
  describe("POST /reviews", () => {
    it("should create a review", async () => {
      const reviewData = {
        movieId: movie.id,
        rating: 5,
        comment: "Excellent film!",
      };

      const res = await request(app)
        .post("/reviews")
        .set("Authorization", `Bearer ${userToken}`)
        .send(reviewData);

      expect(res.statusCode).toBe(201);
      expect(res.body.rating).toBe(reviewData.rating);
      expect(res.body.comment).toBe(reviewData.comment);
      expect(res.body).toHaveProperty("id");
    });

    it("should not allow duplicate review for same movie", async () => {
      const reviewData = {
        movieId: movie.id,
        rating: 4,
        comment: "Another review",
      };

      const res = await request(app)
        .post("/reviews")
        .set("Authorization", `Bearer ${userToken}`)
        .send(reviewData);

      expect(res.statusCode).toBe(400);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/reviews").send({
        movieId: movie.id,
        rating: 5,
      });

      expect(res.statusCode).toBe(401);
    });

    it("should validate rating range", async () => {
      const res = await request(app)
        .post("/reviews")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          movieId: movie.id + 1,
          rating: 10, // Invalide : doit être entre 1 et 5
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // GET /reviews/movie/:movieId
  describe("GET /reviews/movie/:movieId", () => {
    it("should return reviews for a movie", async () => {
      const res = await request(app).get(`/reviews/movie/${movie.id}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // GET /reviews/me
  describe("GET /reviews/me", () => {
    it("should return user's reviews", async () => {
      const res = await request(app)
        .get("/reviews/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

