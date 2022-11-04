import request from "supertest";

import { prisma } from "../../prisma";
import { app } from "../../app";
import {
  loginAdmMock,
  loginStudentMock,
  userAdmMock,
  userStudentMock,
  validGroupMock,
} from "../mocks";

describe("POST /groups", () => {
  let authorization: string;

  beforeAll(async () => {
    await prisma.users.create({
      data: userAdmMock,
    });

    const loginAdm = await request(app).post("/users/login").send(loginAdmMock);
    authorization = `Bearer ${loginAdm.body.token}`;
  });

  afterAll(async () => {
    await prisma.video_markers.deleteMany();
    await prisma.videos.deleteMany();
    await prisma.sprints.deleteMany();
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
  describe("should not be able to create group", () => {
    test("without token", async () => {
      const response = await request(app).post("/groups").send(validGroupMock);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("without adm permission", async () => {
      const group = await prisma.groups.findFirst();
      userStudentMock.groupId = group?.id!;

      const userStudent = await request(app)
        .post("/users")
        .send(userStudentMock);
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
  });
});
