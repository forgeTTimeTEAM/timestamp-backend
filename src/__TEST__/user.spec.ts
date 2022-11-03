import request from "supertest";
import { prisma } from "../prisma/index";
import { app } from "../server";

const user = {
  email: "yuran@example.com",
  password: "password"
}

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users.deleteMany();
  await prisma.modules.deleteMany();
  await prisma.groups.deleteMany();
});

describe("routes - users/", () => {
  test("should create a user", async () => {
    const user = {
      name: "yuran",
      email: "yuran@example.com",
      password: "password",
      groupId: null,
    };
    const res = await request(app).post("/users").send(userCreate);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
  });

  test("should be able to login", async () => {
    const res = await request(app).post("/users/login").send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should be able to return password error", async () => {
    const userInvalidPassword = {
      ...user,
      password: "password12"
    }
    const res = await request(app).post("/users/login").send(userInvalidPassword);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  })

  test("should be able to return error when logging in with wrong email", async () => {
    const userInvalidEmail = {
      ...user,
      email: "yursan@example.com",
    }
    const res = await request(app).post("/users/login").send(userInvalidEmail);
    
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  })

  test("should be able to return error when logging in without email and password", async () => {
    const usernameWithoutPasswordAndEmail = {
      email: "",
      password: ""
    }

    const res = await request(app).post("/users/login").send(usernameWithoutPasswordAndEmail);
    
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  })
});
