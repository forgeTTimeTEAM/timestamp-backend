import request from "supertest";
import { prisma } from "../../prisma";
import { hash } from "bcryptjs";
import { app } from "../../app";
import { markerPatch } from "../mocks/markers.mock";

describe("routes - markers/", () => {
  let video: any;
  let group: any;
  let markers: any;
  let userLogin: any;
  let authorization: string;
  let authorizationStudent: string;
  let authorizationLogin: string;

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

    await prisma.users.create({
      data: {
        email: "joaoaraujo@email.com",
        name: "1234",
        password: await hash("1234", 10),
        role: "INSTRUCTOR",
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

    const instructorLogin = await request(app)
    .post("/users/login")
    .send({ email: "joaoaraujo@email.com", password: "1234" });

    authorization = `Bearer ${userLogin.body.token}`;

    authorizationStudent = `Bearer ${studentUserLogin.body.token}`;

    authorizationLogin = `Bearer ${instructorLogin.body.token}`
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

  it("should not be able create a marker without adm access", async () => {
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

    expect(res.status).toBe(403);
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

  it("should be able possible to update a marked", async () => {
    markers = await prisma.video_markers.findMany();

    const { body, statusCode } = await request(app)
      .patch(`/markers/${markers[0].id}`)
      .set("Authorization", authorization)
      .send(markerPatch);

    console.log(body)

    expect(statusCode).toBe(200)
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("time");
    expect(body).toHaveProperty("videoId");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("updatedAt");
  });

  it("should be able is not ADM or INSTRUCTOR", async () => {
    const { body, statusCode } = await request(app)
      .patch(`/markers/${markers[0].id}`)
      .set("Authorization", authorizationStudent)
      .send(markerPatch);
    
    expect(statusCode).toBe(403);
    expect(body).toHaveProperty("message");
  })

  it("should not be possible to update one marked with invalid id", async () => {
    const { body, statusCode } = await request(app)
      .patch(`/markers/idInavlido`)
      .set("Authorization", authorization)
      .send(markerPatch);
    
    expect(statusCode).toBe(404);
    expect(body).toHaveProperty("message");
  });

  it("should not be possible to create a marker with time that already exists", async () => {
    const { body, statusCode } = await request(app)
      .patch(`/markers/${markers[1].id}`)
      .set("Authorization", authorization)
      .send(markerPatch);

    expect(statusCode).toBe(403);
    expect(body).toHaveProperty("message");
  })

  it("should be possible to delete a marker", async () => {
    const { statusCode } = await request(app)
      .delete(`/markers/${markers[0].id}`)
      .set("Authorization", authorization)
    
    expect(statusCode).toBe(204)
  });

  it("should not be possible to delete a marker with invalid id", async () => {
    const { statusCode, body } = await request(app)
      .delete(`/markers/invalidId`)
      .set("Authorization", authorization)
    
    expect(statusCode).toBe(404)
    expect(body).toHaveProperty("message"); 
  });

  it("should not be possible to delete a marker with a different instructor", async () => {
    const { statusCode, body } = await request(app)
      .delete(`/markers/${markers[1].id}`)
      .set("Authorization", authorizationLogin)
    
    expect(statusCode).toBe(401)
    expect(body).toHaveProperty("message"); 
  })
});
