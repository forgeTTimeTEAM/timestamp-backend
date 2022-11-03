import request from "supertest";
import { prisma } from "../prisma/index";
import { app } from "../server";

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users.deleteMany();
  await prisma.modules.deleteMany();
});

describe("describe user context ", () => {
  test("should create a user", async () => {
    const user = {
      name: "yuran",
      email: "yuran@example.com",
      password: "password",
      groupId: "75b6ad75-561d-47dc-94bb-405f48fd6018",
    };

    const res = await request(app).post("/users").send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("email");
  });

  test("should not be able create user if without module", async () => {
    const user = {
      name: "rick",
      email: "rick@parece.falso",
      password: "password",
      modulesId: "ID NOT VALID",
    };

    const res = await request(app).post("/users").send(user);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});
