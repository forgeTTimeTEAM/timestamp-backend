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
  let video: any;
  let group: any;
  let userLogin: any;
  let authorization: string;
  let authorizationStudent: string;

  beforeAll(async () => {
    group = await prisma.groups.create({
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
    await prisma.users.create({
      data: {
        email: "alvteste10@email.com",
        name: "alves123",
        password: await hash("alves123", 10),
        role: "STUDENT",
        groupId: group.id,
      },
    });

    video = await prisma.videos.findFirst({
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

    userLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste5@email.com", password: "alves123" });

    authorization = `Bearer ${userLogin.body.token}`;

    let studentUserLogin = await request(app)
      .post("/users/login")
      .send({ email: "alvteste10@email.com", password: "alves123" });

    authorization = `Bearer ${userLogin.body.token}`;

    authorizationStudent = `Bearer ${studentUserLogin.body.token}`;
  });

  it("should be able create a marker", async () => {
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
      .set("Authorization", authorization)
      .send(Marker);

    expect(res.status).toBe(201);
    expect(res.body.count).toBe(Marker.marks.length);
  });

  it("should not be able create a marker with h:m:s invalid", async () => {
    const Marker = {
      marks: [
        {
          title: "git hub",
          time: "00:20:70",
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
      .set("Authorization", authorization)
      .send(Marker);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should not be able create a marker with h:m:s equals", async () => {
    const Marker = {
      marks: [
        {
          title: "git hub",
          time: "00:20:30",
          videoId: video?.id,
        },
        {
          title: "user controller",
          time: "00:20:30",
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
      .set("Authorization", authorization)
      .send(Marker);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should not be able create a marker with access to count student", async () => {
    const Marker = {
      marks: [
        {
          title: "git hub",
          time: "00:25:30",
          videoId: video?.id,
        },
        {
          title: "user controller",
          time: "00:20:30",
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
      .set("Authorization", authorizationStudent)
      .send(Marker);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should not be able create a marker with invalid ID video", async () => {
    const Marker = {
      marks: [
        {
          title: "git hub",
          time: "00:25:30",
          videoId: video?.id,
        },
        {
          title: "user controller",
          time: "00:20:30",
          videoId: video?.id,
        },
        {
          title: "typeorm",
          time: "19:20:50",
          videoId: video?.id,
        },
      ],
      videoId: "POTATO",
      groupId: group.id,
    };

    const res = await request(app)
      .post("/markers")
      .set("Authorization", authorization)
      .send(Marker);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
