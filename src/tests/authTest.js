import request from "supertest";
import app from "../app.js";
import { prisma } from "../app.js";

describe("Auth API", () => {
  const user = {
    name: "Test User",
    email: "testuser@example.com",
    password: "Password123!",
  };

  beforeAll(async () => {
    // Nettoyer les utilisateurs et tokens révoqués avant les tests
    await prisma.user.deleteMany();
    await prisma.revokedToken.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.revokedToken.deleteMany();
    await prisma.$disconnect();
  });

  // SIGNUP
  it("should create a new user", async () => {
    const res = await request(app).post("/auth/signup").send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.body.name).toBe(user.name);
    expect(res.body).toHaveProperty("id");
  });

  // SIGNUP DUPLICATE
  it("should not allow duplicate email", async () => {
    const res = await request(app).post("/auth/signup").send(user);

    expect(res.statusCode).toBe(400);
  });

  // LOGIN
  it("should login a user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  // LOGIN WRONG PASSWORD
  it("should return error on wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: user.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(400);
  });

  // REFRESH TOKEN
  it("should refresh token", async () => {
    // D'abord se connecter pour obtenir un refreshToken
    const loginRes = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("refreshToken");

    // Ensuite rafraîchir le token
    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: loginRes.body.refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  // LOGOUT
  it("should logout a user", async () => {
    // D'abord se connecter pour obtenir un accessToken
    const loginRes = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(loginRes.statusCode).toBe(200);
    const { accessToken } = loginRes.body;

    // Se déconnecter
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Déconnexion réussie");
  });

  // LOGOUT - TOKEN REVOKED
  it("should reject access with revoked token", async () => {
    // Se connecter pour obtenir un accessToken
    const loginRes = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(loginRes.statusCode).toBe(200);
    const { accessToken } = loginRes.body;

    // Se déconnecter (révoque le token)
    await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    // Tenter d'accéder à une route protégée avec le token révoqué
    const res = await request(app)
      .get("/watchlist/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token révoqué");
  });

  // LOGOUT - NO TOKEN
  it("should require authentication for logout", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.statusCode).toBe(401);
  });
});
