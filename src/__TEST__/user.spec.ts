import request from "supertest";
import { prisma } from "../prisma/index";
import { app } from "../server";

afterAll(async () => {
  await prisma.video_marker.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.users.deleteMany();
  await prisma.modules.deleteMany();
});

describe("describe user context ", () => {
  test("should create a user", async () => {
    const moduleCreated = await prisma.modules.create({
      data: {
        name: "M4",
      },
    });

    const user = {
      name: "yuran",
      email: "yuran@example.com",
      password: "password",
      modulesId: moduleCreated.id,
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
