import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash } from "bcryptjs";
import {
  admLoginMock,
  admUserMock,
  studentUserMock,
  validGroupMock,
  validModuleMock,
  modulewithInvalidGroupMock,
  modulewithoutGroupMock,
  modulewithoutNameMock,
  loginStudentMock,
} from "../mocks";

describe("routes - /modules", () => {
  let authorization: string;

  beforeAll(async () => {
    await prisma.users.create({
      data: admUserMock,
    });

    const loginAdm = await request(app).post("/users/login").send(admLoginMock);
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

  test("should be able to create a module", async () => {
    const group = await request(app)
      .post("/groups")
      .send(validGroupMock)
      .set("Authorization", authorization);
    validModuleMock.groupId = group.body.id;

    studentUserMock.groupId = group.body.id;
    studentUserMock.moduleId = group.body.modules[0].id;
    const studentUser = await request(app).post("/users").send(studentUserMock);

    const response = await request(app)
      .post("/modules")
      .send(validModuleMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", validModuleMock.name);
    expect(response.body).toHaveProperty("groupId", group.body.id);
    expect(response.body).toHaveProperty("createdAt");

    expect(response.body).toHaveProperty("sprints");
    const { sprints } = response.body;
    expect(sprints).toHaveLength(8);
    expect(sprints[0]).toHaveProperty("id");
    expect(sprints[0]).toHaveProperty(
      "name",
      `${validModuleMock.sprintPrefixName}1`
    );
    expect(sprints[0]).toHaveProperty("moduleId");

    expect(response.body).toHaveProperty("users");
    const { users } = response.body;
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("id");
    expect(users[0]).toHaveProperty("createdAt");
    expect(users[0]).toHaveProperty("updatedAt");

    const { user } = users[0];
    expect(user).toHaveProperty("id", studentUser.body.id);
    expect(user).toHaveProperty("groupId", studentUser.body.groupId);
    expect(user).toHaveProperty("name", studentUser.body.name);
    expect(user).toHaveProperty("email", studentUser.body.email);
    expect(user).not.toHaveProperty("password");
    expect(user).toHaveProperty("role", studentUser.body.role);
    expect(user).toHaveProperty("createdAt", studentUser.body.createdAt);
    expect(user).toHaveProperty("updatedAt", studentUser.body.updatedAt);
  });

  test("should not be able to create a module without token", async () => {
    const response = await request(app).post("/modules");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create a module invalid/expired token", async () => {
    const response = await request(app)
      .post("/modules")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNIiwiZ3JvdXBJZCI6bnVsbCwiaWF0IjoxNjY3NTkzOTUxLCJleHAiOjE2Njc2ODAzNTEsInN1YiI6ImRmNmZmODg3LTBkZGMtNDAyNi05ZTBkLTUyZDQzMDg0MjVlZiJ9.oLO7jp5RyWfQhteGkJ21lYCZ3z2gWhTsUD97nzdafY"
      );

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create a module without adm permission", async () => {
    await request(app).post("/users").send(studentUserMock);
    const loginStudent = await request(app)
      .post("/users/login")
      .send(loginStudentMock);
    const studentAuthorization = `Bearer ${loginStudent.body.token}`;

    const response = await request(app)
      .post("/modules")
      .set("Authorization", studentAuthorization);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create a module with invalid group", async () => {
    const response = await request(app)
      .post("/modules")
      .send(modulewithInvalidGroupMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create a module without groupId", async () => {
    const response = await request(app)
      .post("/modules")
      .send(modulewithoutGroupMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to create a module without name", async () => {
    const response = await request(app)
      .post("/modules")
      .send(modulewithoutNameMock)
      .set("Authorization", authorization);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("should not be able to return all users by module id without token", async () => {
    const response = await request(app).get("/modules/id");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("should not be able to return all users by module id with invalid token", async () => {
    const response = await request(app)
      .get("/modules/id")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNIiwiZ3JvdXBJZCI6bnVsbCwiaWF0IjoxNjY3NTkzOTUxLCJleHAiOjE2Njc2ODAzNTEsInN1YiI6ImRmNmZmODg3LTBkZGMtNDAyNi05ZTBkLTUyZDQzMDg0MjVlZiJ9.oLO7jp5RyWfQhteGkJ21lYCZ3z2gWhTsUD97nzdafY"
      );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("should not be able to return all users by module id with student token", async () => {
    const createUser = await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste12@email.com",
        password: await hash("alves123", 10),
      },
    });

    await request(app).post("/users").send(createUser);

    const login = await request(app)
      .post("/users/login")
      .send({ email: "alvteste12@email.com", password: "alves123" });

    const response = await request(app)
      .get("/modules/123")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("should not be able to return all users by module id with invalid module id", async () => {
    const createUser = await prisma.users.create({
      data: {
        name: "alv",
        email: "alvteste13@email.com",
        password: await hash("alves123", 10),
        role: "INSTRUCTOR",
      },
    });

    await request(app).post("/users").send(createUser);

    const login = await request(app)
      .post("/users/login")
      .send({ email: "alvteste13@email.com", password: "alves123" });

    const response = await request(app)
      .get("/modules/123")
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("should not be able to return all users by module id with instructor token and different module id", async () => {
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

    const response = await request(app)
      .get(`/modules/${createGroup2.body.modules[0].id}`)
      .set("Authorization", `Bearer ${loginInstructor.body.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  test("should be able to return all users by module id with instructor token", async () => {
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

    const response = await request(app)
      .get(`/modules/${moduleId}`)
      .set("Authorization", `Bearer ${loginInstructor.body.token}`);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("groupId");
    expect(response.body[0]).toHaveProperty("users");
    expect(response.body[0].users.length).toEqual(2);
    expect(response.body[0].users[0].user).not.toHaveProperty("password");
    expect(response.status).toBe(200);
  });

  test("should be able to return all users by module id with adm token", async () => {
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
    expect(res.body[0]).toHaveProperty("users");
    expect(res.body[0].users.length).toEqual(1);
    expect(res.body[0].users[0].user).not.toHaveProperty("password");
    expect(res.status).toBe(200);
  });

  test("should be able to return all users", async () => {
    await prisma.users.create({
      data: {
        name: "sara",
        email: "saraADM@email.com",
        password: await hash("1234", 10),
        role: "ADM",
      },
    });

    const dataLoginADM = { email: "saraADM@email.com", password: "1234" };

    const login = await request(app).post("/users/login").send(dataLoginADM);

    const token = login.body.token;

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`);

    const moduleId = createGroup.body.modules[0].id;

    const newStudent = {
      name: "sara",
      email: "saraSTUDENT@email.com",
      password: "1234",
      groupId: createGroup.body.id,
      moduleId,
    };

    await request(app).post("/users").send(newStudent);

    const res = await request(app)
      .get(`/modules`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("map");
  });

  test("should not be able to return all users without adm permission", async () => {
    await prisma.users.create({
      data: {
        name: "sara",
        email: "saraADM1@email.com",
        password: await hash("1234", 10),
        role: "ADM",
      },
    });

    const dataLoginADM = { email: "saraADM1@email.com", password: "1234" };

    const login = await request(app).post("/users/login").send(dataLoginADM);

    const token = login.body.token;

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`);

    const moduleId = createGroup.body.modules[0].id;

    const newStudent = {
      name: "sara",
      email: "saraSTUDENT@email.com",
      password: "1234",
      groupId: createGroup.body.id,
      moduleId,
    };

    await request(app).post("/users").send(newStudent);

    const dataLoginSTUDENT = {
      email: "saraSTUDENT@email.com",
      password: "1234",
    };

    const loginStudent = await request(app)
      .post("/users/login")
      .send(dataLoginSTUDENT);

    const res = await request(app)
      .get(`/modules`)
      .set("Authorization", `Bearer ${loginStudent.body.token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to return all users with invalid token", async () => {
    await prisma.users.create({
      data: {
        name: "sara",
        email: "saraADM2@email.com",
        password: await hash("1234", 10),
        role: "ADM",
      },
    });

    const dataLoginADM = { email: "saraADM2@email.com", password: "1234" };

    const login = await request(app).post("/users/login").send(dataLoginADM);

    const token = login.body.token;

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`);

    const moduleId = createGroup.body.modules[0].id;

    const newStudent = {
      name: "sara",
      email: "saraSTUDENT@email.com",
      password: "1234",
      groupId: createGroup.body.id,
      moduleId,
    };

    await request(app).post("/users").send(newStudent);

    const res = await request(app)
      .get(`/modules`)
      .set("Authorization", `Bearer banana`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("should not be able to return all users without token", async () => {
    await prisma.users.create({
      data: {
        name: "sara",
        email: "saraADM3@email.com",
        password: await hash("1234", 10),
        role: "ADM",
      },
    });

    const dataLoginADM = { email: "saraADM3@email.com", password: "1234" };

    const login = await request(app).post("/users/login").send(dataLoginADM);

    const token = login.body.token;

    const createGroup = await request(app)
      .post("/groups")
      .set("Authorization", `Bearer ${token}`);

    const moduleId = createGroup.body.modules[0].id;

    const newStudent = {
      name: "sara",
      email: "saraSTUDENT@email.com",
      password: "1234",
      groupId: createGroup.body.id,
      moduleId,
    };

    await request(app).post("/users").send(newStudent);

    const res = await request(app).get(`/modules`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
