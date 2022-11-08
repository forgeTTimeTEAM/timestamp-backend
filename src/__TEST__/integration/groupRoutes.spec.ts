import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash } from "bcryptjs";
import {
  admLoginMock,
  loginStudentMock,
  admUserMock,
  studentUserMock,
  validGroupMock,
} from "../mocks";

describe("routes - /groups", () => {
  let admAuth: string;
  let studentAuth: string;
  let groupTest: any;

  beforeAll(async () => {
    await prisma.users.create({
      data: admUserMock,
    });

    const admLogin = await request(app).post("/users/login").send(admLoginMock);
    admAuth = `Bearer ${admLogin.body.token}`;
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
      .set("Authorization", admAuth);
    groupTest = response.body;

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
    studentUserMock.groupId = groupTest!.id;
    studentUserMock.moduleId = groupTest!.modules[0].id;
    await request(app).post("/users").send(studentUserMock);

    const loginStudent = await request(app)
      .post("/users/login")
      .send(loginStudentMock);
    studentAuth = `Bearer ${loginStudent.body.token}`;

    const response = await request(app)
      .post("/groups")
      .send(validGroupMock)
      .set("Authorization", studentAuth);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to list all groups", async () => {
    const response = await request(app)
      .get("/groups")
      .set("Authorization", admAuth);

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
    const response = await request(app)
      .get("/groups")
      .set("Authorization", studentAuth);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to find a group by id", async () => {
    const response = await request(app)
      .get(`/groups/${groupTest.id}`)
      .set("Authorization", admAuth);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("number");
    expect(response.body).toHaveProperty("modules");
    expect(response.body).toHaveProperty("users");

    expect(response.body.modules[0]).toHaveProperty("id");
    expect(response.body.modules[0]).toHaveProperty("name");
    expect(response.body.modules[0]).toHaveProperty("createdAt");
    expect(response.body.modules[0]).toHaveProperty("groupId");

    expect(response.body.users[0]).toHaveProperty("id");
    expect(response.body.users[0]).toHaveProperty("name");
    expect(response.body.users[0]).toHaveProperty("email");
    expect(response.body.users[0]).not.toHaveProperty("password");
    expect(response.body.users[0]).toHaveProperty("role");
    expect(response.body.users[0]).toHaveProperty("createdAt");
    expect(response.body.users[0]).toHaveProperty("updatedAt");
    expect(response.body.users[0]).toHaveProperty("groupId");
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

  test("should not be able to find a group without adm permission", async () => {
    const response = await request(app)
      .get("/groups")
      .set("Authorization", studentAuth);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to find a group with invalid group id", async () => {
    const response = await request(app)
      .get("/groups/batata")
      .set("Authorization", admAuth);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
