import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../server";

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users_modules.deleteMany();
  await prisma.users.deleteMany();
  await prisma.modules.deleteMany();
});

const user = {
  email: "yuran@example.com",
  password: "password",
};

describe("routes - users/", () => {
  test("should be able to create a user", async () => {
    const createUser = {
      ...user,
      name: "yuran",
    };
    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("role");
  });

  test("should be able to login", async () => {
    const res = await request(app).post("/users/login").send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should be able to return password error", async () => {
    const userInvalidPassword = {
      ...user,
      password: "password12",
    };
    const res = await request(app)
      .post("/users/login")
      .send(userInvalidPassword);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  test("should be able to return error when logging in with wrong email", async () => {
    const userInvalidEmail = {
      ...user,
      email: "yursan@example.com",
    };
    const res = await request(app).post("/users/login").send(userInvalidEmail);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("should be able to return error when logging in without email and password", async () => {
    const usernameWithoutPasswordAndEmail = {
      email: "",
      password: "",
    };

    const res = await request(app)
      .post("/users/login")
      .send(usernameWithoutPasswordAndEmail);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to return all user data without token", async () => {
    const response = await request(app).get("/users/profile");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to return all user data with invalid token", async () => {
    const token = "Bearer 774husuduw428is2ujsa";

    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", token);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to return all user data", async () => {
    const createUser = {
      ...user,
      name: "alves",
    };
    await request(app).post("/users").send(createUser);

    const userLogin = await request(app)
      .post("/users/login")
      .send({ ...user });
    const userToken = `Bearer ${userLogin.body.token}`;

    const createGroupRequest = { moduleName: "Módulo 1", sprintName: "sprint" };

    const userGroup = await request(app)
      .post("/groups")
      .set("Authorization", userToken)
      .send(createGroupRequest);

    const createUserRequest = {
      name: "alves",
      email: "alvesteste@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
    };

    await request(app).post("/users").send(createUserRequest);

    const loginRequest = {
      email: "alvesteste@email.com",
      password: "alves123",
    };

    const login = await request(app).post("/users/login").send(loginRequest);
    const token = `Bearer ${login.body.token}`;

    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("groupId");
    expect(response.body.groupId).toEqual(userGroup.body.id);
  });
});
