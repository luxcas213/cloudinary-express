import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/lib/prisma.js";

describe("Auth Routes", () => {
  const testUser = {
    username: "jestuser",
    email: "jest@test.com",
    password: "password123",
  };

  let token;

  // Cleanup before and after
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  test("POST /auth/register should create a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created successfully");
  });

  test("POST /auth/register should fail if user exists", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "User already exists");
  });

  test("POST /auth/login should return a token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // Save for next test
  });

  test("POST /auth/login should fail with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });

  test("GET /index/secure should allow access with token", async () => {
    const res = await request(app)
      .get("/index/secure")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("secure");
  });

  test("GET /index/secure should deny access without token", async () => {
    const res = await request(app).get("/index/secure");
    expect(res.statusCode).toBe(401);
  });
});
