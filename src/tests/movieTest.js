import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";

describe("Movie API", () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;
  let testMovie;

  beforeAll(async () => {
    // Nettoyer les données de test
    await prisma.watchlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.movieGenre.deleteMany();
    await prisma.movieActor.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur admin
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@test.com",
        password: "$2b$10$rQ8K8K8K8K8K8K8K8K8K8e", // Mot de passe hashé
        role: "admin",
      },
    });

    // Créer un utilisateur normal
    regularUser = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "user@test.com",
        password: "$2b$10$rQ8K8K8K8K8K8K8K8K8e",
        role: "user",
      },
    });

    // Générer les tokens
    adminToken = generateAccessToken(adminUser);
    userToken = generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await prisma.watchlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.movieGenre.deleteMany();
    await prisma.movieActor.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // GET /movies
  describe("GET /movies", () => {
    it("should return all movies", async () => {
      const res = await request(app).get("/movies");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // POST /movies
  describe("POST /movies", () => {
    it("should create a movie as admin", async () => {
      const movieData = {
        title: "Test Movie",
        description: "A test movie",
        duration: 120,
      };

      const res = await request(app)
        .post("/movies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(movieData);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(movieData.title);
      expect(res.body).toHaveProperty("id");
      testMovie = res.body;
    });

    it("should not allow user to create movie", async () => {
      const movieData = {
        title: "Unauthorized Movie",
        description: "Should not work",
      };

      const res = await request(app)
        .post("/movies")
        .set("Authorization", `Bearer ${userToken}`)
        .send(movieData);

      expect(res.statusCode).toBe(403);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/movies").send({
        title: "No Auth Movie",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  // GET /movies/:id
  describe("GET /movies/:id", () => {
    it("should return a movie by id", async () => {
      const res = await request(app).get(`/movies/${testMovie.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(testMovie.id);
      expect(res.body.title).toBe(testMovie.title);
    });

    it("should return 404 for non-existent movie", async () => {
      const res = await request(app).get("/movies/99999");

      expect(res.statusCode).toBe(404);
    });
  });

  // PUT /movies/:id
  describe("PUT /movies/:id", () => {
    it("should update a movie as admin", async () => {
      const updateData = {
        title: "Updated Movie Title",
        description: "Updated description",
      };

      const res = await request(app)
        .put(`/movies/${testMovie.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updateData.title);
    });

    it("should not allow user to update movie", async () => {
      const res = await request(app)
        .put(`/movies/${testMovie.id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Unauthorized Update" });

      expect(res.statusCode).toBe(403);
    });
  });

  // DELETE /movies/:id
  describe("DELETE /movies/:id", () => {
    it("should delete a movie as admin", async () => {
      const res = await request(app)
        .delete(`/movies/${testMovie.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });

    it("should return 404 when deleting non-existent movie", async () => {
      const res = await request(app)
        .delete("/movies/99999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});

