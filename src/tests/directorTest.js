import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

describe("Director API", () => {
  let adminToken;
  let userToken;
  let adminUser;
  let testDirector;

  beforeAll(async () => {
    // Nettoyer les données
    await prisma.movie.deleteMany();
    await prisma.director.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "directoradmin@test.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Créer un utilisateur normal
    const regularUser = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "directoruser@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    adminToken = generateAccessToken(adminUser);
    userToken = generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await prisma.movie.deleteMany();
    await prisma.director.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // GET /directors
  describe("GET /directors", () => {
    it("should return all directors", async () => {
      const res = await request(app).get("/directors");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // POST /directors
  describe("POST /directors", () => {
    it("should create a director as admin", async () => {
      const directorData = {
        fullName: "Christopher Nolan",
      };

      const res = await request(app)
        .post("/directors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(directorData);

      expect(res.statusCode).toBe(201);
      expect(res.body.fullName).toBe(directorData.fullName);
      expect(res.body).toHaveProperty("id");
      testDirector = res.body;
    });

    it("should not allow user to create director", async () => {
      const res = await request(app)
        .post("/directors")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ fullName: "Steven Spielberg" });

      expect(res.statusCode).toBe(403);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/directors").send({
        fullName: "Martin Scorsese",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  // GET /directors/:id
  describe("GET /directors/:id", () => {
    it("should return a director by id", async () => {
      const res = await request(app).get(`/directors/${testDirector.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(testDirector.id);
      expect(res.body.fullName).toBe(testDirector.fullName);
    });

    it("should return 404 for non-existent director", async () => {
      const res = await request(app).get("/directors/99999");

      expect(res.statusCode).toBe(404);
    });
  });

  // PUT /directors/:id
  describe("PUT /directors/:id", () => {
    it("should update a director as admin", async () => {
      const updateData = {
        fullName: "Christopher Edward Nolan",
      };

      const res = await request(app)
        .put(`/directors/${testDirector.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.fullName).toBe(updateData.fullName);
    });
  });

  // DELETE /directors/:id
  describe("DELETE /directors/:id", () => {
    it("should delete a director as admin", async () => {
      const res = await request(app)
        .delete(`/directors/${testDirector.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});

