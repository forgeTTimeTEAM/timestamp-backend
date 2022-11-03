import request from "supertest";
import { prisma } from "../prisma/index";
import { app } from "../server";

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users.deleteMany();
  await prisma.modules.deleteMany();
  await prisma.groups.deleteMany();
});

describe("describe user context ", () => {
  test("should create a user", async () => {
    const user = {
      name: "yuran",
      email: "yuran@example.com",
      password: "password",
      groupId: null,
    };

    const res = await request(app).post("/users").send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
  });
});
