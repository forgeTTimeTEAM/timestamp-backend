import request from "supertest";
import { prisma } from "../../prisma";
import { hash } from "bcryptjs";
import { app } from "../../app";

afterAll(async () => {
  await prisma.video_markers.deleteMany();
  await prisma.videos.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.users_modules.deleteMany();
  await prisma.modules.deleteMany();
  await prisma.users.deleteMany();
  await prisma.groups.deleteMany();
});

describe("marker test", () => {
  it("should be able create a marker", async () => {
    const group = await prisma.groups.create({
      data: {
        modules: {
          create: {
            name: "m4",
            sprints: {
              create: {
                name: "sprint 1",
                videos: {
                  create: {
                    title: "video_test",
                    releaseDate: new Date("04/11/2022"),
                  },
                },
              },
            },
          },
        },
      },
    });

    await prisma.users.create({
      data: {
        email: "alvteste5@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
        role: "ADM",
        groupId: group.id,
      },
    });

    const video = await prisma.videos.findFirst({
      where: {
        sprint: {
          module: {
            group: {
              id: group.id,
            },
          },
        },
      },
    });

    const userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste5@email.com", password: "alves123" });

    const userToken = `Bearer ${userLogin.body.token}`;

    const Marker = {
      marks: [
        {
          title: "git hub",
          time: "00:20:50",
          videoId: video?.id,
        },
        {
          title: "user controller",
          time: "00:25:50",
          videoId: video?.id,
        },
        {
          title: "typeorm",
          time: "19:20:50",
          videoId: video?.id,
        },
      ],
      videoId: video?.id,
      groupId: group.id,
    };

    const res = await request(app)
      .post("/markers")
      .set("Authorization", userToken)
      .send(Marker);

    expect(res.status).toBe(201);
    expect(res.body.count).toBe(Marker.marks.length);
  });
});
