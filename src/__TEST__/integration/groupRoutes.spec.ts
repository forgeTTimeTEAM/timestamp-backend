import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash } from "bcryptjs";
import {
  loginAdmMock,
  loginStudentMock,
  admUserMock,
  studentUserMock,
  validGroupMock,
} from "../mocks";

describe("routes - /groups", () => {
  let authorization: string;

  beforeAll(async () => {
    await prisma.users.create({
      data: admUserMock,
    });

    const loginAdm = await request(app).post("/users/login").send(loginAdmMock);
    authorization = `Bearer ${loginAdm.body.token}`;
  });

  afterAll(async () => {
    await prisma.video_markers.deleteMany();
    await prisma.videos.deleteMany();
    await prisma.sprints.deleteMany();
    await prisma.users_modules.deleteMany();
    await prisma.modules.deleteMany();
    await prisma.users.deleteMany();
    await prisma.groups.deleteMany();
  });

  test("should be able to create group", async () => {
    const response = await request(app)
      .post("/groups")
      .send(validGroupMock)
      .set("Authorization", authorization);

    const group = response.body;
    expect(response.status).toBe(201);
    expect(group).toHaveProperty("id");
    expect(group).toHaveProperty("number");
    expect(group).toHaveProperty("modules");

    const { modules } = group;
    expect(modules).toHaveLength(1);
    expect(modules[0]).toHaveProperty("id");
    expect(modules[0]).toHaveProperty("name");
    expect(modules[0]).toHaveProperty("createdAt");
    expect(modules[0]).toHaveProperty("groupId");
    expect(modules[0]).toHaveProperty("sprints");

    const { sprints } = modules[0];
    expect(sprints).toHaveLength(8);
    expect(sprints[0]).toHaveProperty("id");
    expect(sprints[0]).toHaveProperty("name");
    expect(sprints[0]).toHaveProperty("moduleId");
  });

  test("should not be able to create group without token", async () => {
    const response = await request(app).post("/groups").send(validGroupMock);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create group with invalid token", async () => {
    const response = await request(app)
      .post("/groups")
      .send(validGroupMock)
      .set("Authorization", "Bearer batata");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create group without adm permission", async () => {
    const group = await prisma.groups.findFirst({
      include: {
        modules: true,
      },
    });
    studentUserMock.groupId = group!.id;
    studentUserMock.moduleId = group!.modules[0].id;

    await request(app).post("/users").send(studentUserMock);
    const loginStudent = await request(app)
      .post("/users/login")
      .send(loginStudentMock);

    const authorization = `Bearer ${loginStudent.body.token}`;
    const response = await request(app)
      .post("/groups")
      .send(validGroupMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to list all groups", async () => {
    const response = await request(app)
      .get("/groups")
      .set("Authorization", authorization);

    expect(response.status).toBe(200);

    const [group] = response.body;
    expect(group).toHaveProperty("id");
    expect(group).toHaveProperty("number");

    expect(group).toHaveProperty("modules");
    expect(group.modules).toHaveLength(1);
    const [module] = group.modules;
    expect(module).toHaveProperty("id");
    expect(module).toHaveProperty("groupId");
    expect(module).toHaveProperty("name");
    expect(module).toHaveProperty("createdAt");

    expect(group).toHaveProperty("users");
    expect(group.users).toHaveLength(1);
    const [user] = group.users;
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("groupId");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).not.toHaveProperty("password");
    expect(user).toHaveProperty("role");
    expect(user).toHaveProperty("createdAt");
    expect(user).toHaveProperty("updatedAt");
  });

  test("should not be able to list all groups without token", async () => {
    const response = await request(app).get("/groups");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to list all groups with invalid token", async () => {
    const response = await request(app)
      .get("/groups")
      .set("Authorization", "Bearer batata");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to list all groups without adm permission", async () => {
    const loginStudent = await request(app)
      .post("/users/login")
      .send(loginStudentMock);

    const authorization = `Bearer ${loginStudent.body.token}`;
    const response = await request(app)
      .get("/groups")
      .set("Authorization", authorization);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group without token", async () => {
    const response = await request(app).get("/groups");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group with invalid token", async () => {
    const response = await request(app)
      .get("/groups")
      .set("Authorization", "Bearer batata");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group with student permission", async () => {
    await prisma.users.create({
      data: {
        name: "Giuseppe Cadura",
        email: "giuseppecadura2@email.com",
        password: await hash("alves123", 10),
      },
    });

    const loginStudent = await request(app)
      .post("/users/login")
      .send({ email: "giuseppecadura2@email.com", password: "alves123" });

    const response = await request(app)
      .get("/groups")
      .set("Authorization", `Bearer ${loginStudent.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group with invalid group id", async () => {
    await prisma.users.create({
      data: {
        name: "Giuseppe Cadura",
        email: "giuseppecadurinha@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const loginAdm = await request(app)
      .post("/users/login")
      .send({ email: "giuseppecadurinha@email.com", password: "alves123" });

    const response = await request(app)
      .get("/groups/group")
      .set("Authorization", `Bearer ${loginAdm.body.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group you don't have access", async () => {
    await prisma.users.create({
      data: {
        name: "Giuseppe Cadura",
        email: "giuseppecadura@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const loginAdm = await request(app)
      .post("/users/login")
      .send({ email: "giuseppecadura@email.com", password: "alves123" });

    const group = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${loginAdm.body.token}`);

    await request(app)
      .post("/users")
      .send({
        name: "Giuseppe Cadurassa",
        email: "giuseppecadurassa@email.com",
        password: await hash("alves123", 10),
        groupId: group.body.id,
        moduleId: group.body.modules[0].id,
      });

    await prisma.users.create({
      data: {
        name: "Giuseppe Cadura",
        email: "giuseppecadurona@email.com",
        password: await hash("alves123", 10),
        role: "INSTRUCTOR",
      },
    });

    const loginInstructor = await request(app)
      .post("/users/login")
      .send({ email: "giuseppecadurona@email.com", password: "alves123" });

    const response = await request(app)
      .get(`/groups/${group.body.id}`)
      .set("Authorization", `Bearer ${loginInstructor.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to find a group by id", async () => {
    await prisma.users.create({
      data: {
        name: "yurandamdamdam",
        email: "yuranrocketseat@email.com",
        password: await hash("alves123", 10),
        role: "ADM",
      },
    });

    const loginAdm = await request(app)
      .post("/users/login")
      .send({ email: "yuranrocketseat@email.com", password: "alves123" });

    const authorization = `Bearer ${loginAdm.body.token}`;

    const group = await request(app)
      .post("/groups")
      .set("Authorization", authorization);

    await request(app)
      .post("/users")
      .send({
        name: "yurandamdamdam",
        email: "yuranrocketseat2@email.com",
        password: await hash("alves123", 10),
        groupId: group.body.id,
        moduleId: group.body.modules[0].id,
      });

    const response = await request(app)
      .get(`/groups/${group.body.id}`)
      .set("Authorization", authorization);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("number");
    expect(response.body).toHaveProperty("modules");
    expect(response.body).toHaveProperty("users");

    expect(response.body.modules[0]).toHaveProperty("id");
    expect(response.body.modules[0]).toHaveProperty("name");
    expect(response.body.modules[0]).toHaveProperty("createdAt");
    expect(response.body.modules[0]).toHaveProperty("groupId");
    expect(response.body.modules[0].groupId).toEqual(group.body.id);

    expect(response.body.users[0]).toHaveProperty("id");
    expect(response.body.users[0]).toHaveProperty("name");
    expect(response.body.users[0]).toHaveProperty("email");
    expect(response.body.users[0]).not.toHaveProperty("password");
    expect(response.body.users[0]).toHaveProperty("role");
    expect(response.body.users[0]).toHaveProperty("createdAt");
    expect(response.body.users[0]).toHaveProperty("updatedAt");
    expect(response.body.users[0]).toHaveProperty("groupId");
    expect(response.body.users[0].groupId).toEqual(group.body.id);
    expect(response.body.users[0].email).toEqual("yuranrocketseat2@email.com");
  });
});
