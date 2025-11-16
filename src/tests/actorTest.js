import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

describe("Actor API", () => {
  let adminToken;
  let userToken;
  let adminUser;
  let testActor;

  beforeAll(async () => {
    // Nettoyer les données
    await prisma.movieActor.deleteMany();
    await prisma.actor.deleteMany();
    await prisma.user.deleteMany();

    // Créer un utilisateur admin
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "actoradmin@test.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Créer un utilisateur normal
    const regularUser = await prisma.user.create({
      data: {
        name: "Regular User",
        email: "actoruser@test.com",
        password: hashedPassword,
        role: "user",
      },
    });

    adminToken = generateAccessToken(adminUser);
    userToken = generateAccessToken(regularUser);
  });

  afterAll(async () => {
    await prisma.movieActor.deleteMany();
    await prisma.actor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // GET /actors
  describe("GET /actors", () => {
    it("should return all actors", async () => {
      const res = await request(app).get("/actors");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // POST /actors
  describe("POST /actors", () => {
    it("should create an actor as admin", async () => {
      const actorData = {
        fullName: "Leonardo DiCaprio",
      };

      const res = await request(app)
        .post("/actors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(actorData);

      expect(res.statusCode).toBe(201);
      expect(res.body.fullName).toBe(actorData.fullName);
      expect(res.body).toHaveProperty("id");
      testActor = res.body;
    });

    it("should not allow user to create actor", async () => {
      const res = await request(app)
        .post("/actors")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ fullName: "Tom Hanks" });

      expect(res.statusCode).toBe(403);
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/actors").send({
        fullName: "Brad Pitt",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  // GET /actors/:id
  describe("GET /actors/:id", () => {
    it("should return an actor by id", async () => {
      const res = await request(app).get(`/actors/${testActor.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(testActor.id);
      expect(res.body.fullName).toBe(testActor.fullName);
    });

    it("should return 404 for non-existent actor", async () => {
      const res = await request(app).get("/actors/99999");

      expect(res.statusCode).toBe(404);
    });
  });

  // PUT /actors/:id
  describe("PUT /actors/:id", () => {
    it("should update an actor as admin", async () => {
      const updateData = {
        fullName: "Leonardo Wilhelm DiCaprio",
      };

      const res = await request(app)
        .put(`/actors/${testActor.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.fullName).toBe(updateData.fullName);
    });
  });

  // DELETE /actors/:id
  describe("DELETE /actors/:id", () => {
    it("should delete an actor as admin", async () => {
      const res = await request(app)
        .delete(`/actors/${testActor.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});

