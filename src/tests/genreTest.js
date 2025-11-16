import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

describe("Genre API", () => {
  let adminToken;
  let userToken;
  let adminUser;
  let testGenre;

  beforeAll(async () => {
    // Nettoyer les données
    await prisma.movieGenre.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "genreadmin@test.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Créer un utilisateur normal
    const regularUser = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "genreuser@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    adminToken = generateAccessToken(adminUser);
    userToken = generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await prisma.movieGenre.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // GET /genres
  describe("GET /genres", () => {
    it("should return all genres", async () => {
      const res = await request(app).get("/genres");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // POST /genres
  describe("POST /genres", () => {
    it("should create a genre as admin", async () => {
      const genreData = {
        name: "Science-Fiction",
      };

      const res = await request(app)
        .post("/genres")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(genreData);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe(genreData.name);
      expect(res.body).toHaveProperty("id");
      testGenre = res.body;
    });

    it("should not allow user to create genre", async () => {
      const res = await request(app)
        .post("/genres")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Action" });

      expect(res.statusCode).toBe(403);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/genres").send({
        name: "Drama",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should not allow duplicate genre name", async () => {
      const res = await request(app)
        .post("/genres")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Science-Fiction" });

      expect(res.statusCode).toBe(400);
    });
  });

  // GET /genres/:id
  describe("GET /genres/:id", () => {
    it("should return a genre by id", async () => {
      const res = await request(app).get(`/genres/${testGenre.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(testGenre.id);
      expect(res.body.name).toBe(testGenre.name);
    });

    it("should return 404 for non-existent genre", async () => {
      const res = await request(app).get("/genres/99999");

      expect(res.statusCode).toBe(404);
    });
  });

  // PUT /genres/:id
  describe("PUT /genres/:id", () => {
    it("should update a genre as admin", async () => {
      const updateData = {
        name: "Sci-Fi",
      };

      const res = await request(app)
        .put(`/genres/${testGenre.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(updateData.name);
    });
  });

  // DELETE /genres/:id
  describe("DELETE /genres/:id", () => {
    it("should delete a genre as admin", async () => {
      const res = await request(app)
        .delete(`/genres/${testGenre.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});

