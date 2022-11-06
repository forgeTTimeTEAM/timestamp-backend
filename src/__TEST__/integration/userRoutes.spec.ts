import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash, hashSync } from "bcryptjs";

describe("routes - /users", () => {
  afterAll(async () => {
    await prisma.video_markers.deleteMany();
    await prisma.videos.deleteMany();
    await prisma.sprints.deleteMany();
    await prisma.users_modules.deleteMany();
    await prisma.modules.deleteMany();
    await prisma.users.deleteMany();
    await prisma.groups.deleteMany();
  });

  test("should not be able to create a user without name", async () => {
    const createUser = {
      email: "alvesteste@email.com",
      password: "alves123",
    };
    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user without password", async () => {
    const createUser = {
      email: "alv7teste@email.com",
      name: "alves",
    };

    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user without email", async () => {
    const createUser = {
      name: "alves",
      password: "alves123",
    };

    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user without group id", async () => {
    const createUser = {
      name: "alves",
      email: "alv7teste@email.com",
      password: "alves123",
      moduleId: "batata",
    };

    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user with invalid group id", async () => {
    const createUser = {
      email: "alvteste1@email.com",
      password: "alves123",
      name: "alves",
      groupId: "batata",
      moduleId: "batata",
    };

    const res = await request(app).post("/users").send(createUser);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user without module id", async () => {
    const createUser = await prisma.users.create({
      data: {
        email: "alvteste2@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
      },
    });

    await request(app).post("/users").send(createUser);

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste2@email.com", password: "alves123" });
    const userToken = `Bearer ${userLogin.body.token}`;

    const userGroup = await request(app)
      .post("/groups")
      .set("Authorization", userToken)
      .send({ modulePrefixName: "Módulo", sprintPrefixName: "sprint" });

    const createUserRequest = {
      name: "alves",
      email: "alv7teste@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
    };

    const res = await request(app).post("/users").send(createUserRequest);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user with invalid module id", async () => {
    await prisma.users.create({
      data: {
        email: "alvteste3@email.com",
        name: "alves123",
        password: hashSync("alves123", 10),
        role: "ADM",
      },
    });

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste3@email.com", password: "alves123" });
    const userToken = `Bearer ${userLogin.body.token}`;

    const userGroup = await request(app)
      .post("/groups")
      .send({ modulePrefixName: "Módulo", sprintPrefixName: "sprint" })
      .set("Authorization", userToken);

    const createUserRequest = {
      name: "alves",
      email: "alv7teste@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
      moduleId: "batata",
    };

    const res = await request(app).post("/users").send(createUserRequest);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to create a user with same email", async () => {
    await prisma.users.create({
      data: {
        email: "alvteste4@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste4@email.com", password: "alves123" });
    const userToken = `Bearer ${userLogin.body.token}`;

    const userGroup = await request(app)
      .post("/groups")
      .set("Authorization", userToken)
      .send({ modulePrefixName: "Módulo", sprintPrefixName: "sprint" });

    const createUserRequest = {
      name: "alves",
      email: "alv4teste@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
      moduleId: userGroup.body.modules[0].id,
    };

    await request(app).post("/users").send(createUserRequest);

    const res = await request(app).post("/users").send(createUserRequest);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message");
  });

  test("should be able to create a user", async () => {
    await prisma.users.create({
      data: {
        email: "alvteste5@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste5@email.com", password: "alves123" });
    const userToken = `Bearer ${userLogin.body.token}`;

    const userGroup = await request(app)
      .post("/groups")
      .set("Authorization", userToken)
      .send({ modulePrefixName: "Módulo", sprintPrefixName: "sprint" });

    const createUserRequest = {
      name: "alves",
      email: "alvteste6@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
      moduleId: userGroup.body.modules[0].id,
    };

    const res = await request(app).post("/users").send(createUserRequest);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).toHaveProperty("role");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body).toHaveProperty("groupId");
    expect(res.body).toHaveProperty("modules");
    expect(res.body.modules[0].userId).toEqual(res.body.id);
  });

  test("should be able to login", async () => {
    const createUser = await prisma.users.create({
      data: {
        email: "alvteste7@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
      },
    });

    const res = await request(app)
      .post("/users/login")
      .send({ email: "alvteste7@email.com", password: "alves123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should not be able to login with wrong password", async () => {
    await prisma.users.create({
      data: {
        email: "alvteste9@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
      },
    });

    const res = await request(app)
      .post("/users/login")
      .send({ email: "alvteste9@email.com", password: "errado" });

    expect(res.status).toBe(403);
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
    const token = "Bearer e7d4hu5sps45ud0uw428is2ujsa";

    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", token);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to return all user data", async () => {
    const createUser = await prisma.users.create({
      data: {
        email: "alvteste11@email.com",
        name: "alv",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste11@email.com", password: "alves123" });
    const userToken = `Bearer ${userLogin.body.token}`;

    const createGroupRequest = {
      modulePrefixName: "Módulo",
      sprintPrefixName: "sprint",
    };

    const userGroup = await request(app)
      .post("/groups")
      .set("Authorization", userToken)
      .send(createGroupRequest);

    const createUserRequest = {
      name: "alves",
      email: "alvesteste12@email.com",
      password: "alves123",
      groupId: userGroup.body.id,
      moduleId: userGroup.body.modules[0].id,
    };

    await request(app).post("/users").send(createUserRequest);

    const loginRequest = {
      email: "alvesteste12@email.com",
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
