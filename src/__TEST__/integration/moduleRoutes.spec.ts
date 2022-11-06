import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash } from "bcryptjs";

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users_modules.deleteMany();
  await prisma.modules.deleteMany();
  await prisma.users.deleteMany();
  await prisma.groups.deleteMany();
});

describe("routes - /modules", () => {
  test("should not be able to return all users without token", async () => {
    const res = await request(app).get("/modules/id");

    expect(res.body).toHaveProperty("message");
    expect(res.status).toBe(401);
  });

  test("should not be able to return all users with invalid token", async () => {
    const res = await request(app)
      .get("/modules/id")
      .set("Authorization", "Bearer eyJhbGciOuh2uh42uhuh8sa824");

    expect(res.body).toHaveProperty("message");
    expect(res.status).toBe(401);
  });

  test("should not be able to return all users with student token", async () => {
    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste12@email.com",
        password: await hash("alves123", 10),
      },
    });

    const login = await request(app)
      .post("/users/login")
      .send({ email: "alvteste12@email.com", password: "alves123" });

    const res = await request(app)
      .get("/modules/123")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.status).toBe(401);
  });

  test("should not be able to return all users with invalid module id", async () => {
    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste13@email.com",
        password: await hash("alves123", 10),
        role: "INSTRUCTOR",
      },
    });

    const login = await request(app)
      .post("/users/login")
      .send({ email: "alvteste13@email.com", password: "alves123" });

    const res = await request(app)
      .get("/modules/123")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.body).toHaveProperty("message");
    expect(res.status).toBe(404);
  });

  test("should not be able to return all users with instructor token and different module id", async () => {
    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste14@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const loginAdm = await request(app)
      .post("/users/login")
      .send({ email: "alvteste14@email.com", password: "alves123" });

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${loginAdm.body.token}`);

    const createGroup2 = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${loginAdm.body.token}`);

    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste15@email.com",
        password: await hash("alves123", 10),
        groupId: createGroup.body.id,
        modules: {
          create: {
            moduleId: createGroup.body.modules[0].id,
          },
        },
        role: "INSTRUCTOR",
      },
    });

    await request(app).post("/users").send({
      name: "alves",
      email: "alvtest16@email.com",
      password: "alves123",
      groupId: createGroup2.body.id,
      moduleId: createGroup2.body.modules[0].id,
    });

    const loginInstructor = await request(app)
      .post("/users/login")
      .send({ email: "alvteste15@email.com", password: "alves123" });

    const res = await request(app)
      .get(`/modules/${createGroup2.body.modules[0].id}`)
      .set("Authorization", `Bearer ${loginInstructor.body.token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  test("should be able to return all users with instructor token", async () => {
    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste17@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const loginAdm = await request(app)
      .post("/users/login")
      .send({ email: "alvteste17@email.com", password: "alves123" });

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${loginAdm.body.token}`);

    const moduleId = createGroup.body.modules[0].id;

    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste18@email.com",
        password: await hash("alves123", 10),
        groupId: createGroup.body.id,
        modules: {
          create: {
            moduleId,
          },
        },
        role: "INSTRUCTOR",
      },
    });

    await request(app).post("/users").send({
      name: "alves",
      email: "alvtest19@email.com",
      password: "alves123",
      groupId: createGroup.body.id,
      moduleId,
    });

    const loginInstructor = await request(app)
      .post("/users/login")
      .send({ email: "alvteste18@email.com", password: "alves123" });

    const res = await request(app)
      .get(`/modules/${moduleId}`)
      .set("Authorization", `Bearer ${loginInstructor.body.token}`);

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("createdAt");
    expect(res.body[0]).toHaveProperty("groupId");
    expect(res.body[0]).toHaveProperty("users_modules");
    expect(res.body[0].users_modules.length).toEqual(2);
    expect(res.body[0].users_modules[0].user).not.toHaveProperty("password");
    expect(res.status).toBe(200);
  });

  test("should be able to return all users with adm token", async () => {
    await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste19@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const login = await request(app)
      .post("/users/login")
      .send({ email: "alvteste19@email.com", password: "alves123" });

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${login.body.token}`);

    const moduleId = createGroup.body.modules[0].id;

    await request(app).post("/users").send({
      name: "alves",
      email: "alvteste20@email.com",
      password: "alves123",
      groupId: createGroup.body.id,
      moduleId,
    });

    const res = await request(app)
      .get(`/modules/${moduleId}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("createdAt");
    expect(res.body[0]).toHaveProperty("groupId");
    expect(res.body[0]).toHaveProperty("users_modules");
    expect(res.body[0].users_modules.length).toEqual(1);
    expect(res.body[0].users_modules[0].user).not.toHaveProperty("password");
    expect(res.status).toBe(200);
  });
});
