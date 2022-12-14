import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import { hash, hashSync } from "bcryptjs";
import {
  admUserMock,
  admLoginMock,
  loginStudentMock,
  studentUserMock,
  validGroupMock,
} from "../mocks";

describe("routes - users/", () => {
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

  describe("POST / Create User", () => {
    test("Should not be able to create a user without name", async () => {
      const createUser = {
        email: "alvesteste@email.com",
        password: "alves123",
      };
      const response = await request(app).post("/users").send(createUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("Should not be able to create a user without password", async () => {
      const createUser = {
        email: "alv7teste@email.com",
        name: "alves",
      };

      const response = await request(app).post("/users").send(createUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("Should not be able to create a user without email", async () => {
      const createUser = {
        name: "alves",
        password: "alves123",
      };

      const response = await request(app).post("/users").send(createUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("Should not be able to create a user without group id", async () => {
      const createUser = {
        name: "alves",
        email: "alv7teste@email.com",
        password: "alves123",
        moduleId: "batata",
      };

      const response = await request(app).post("/users").send(createUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a user with invalid group id", async () => {
      const createUser = {
        email: "alvteste1@email.com",
        password: "alves123",
        name: "alves",
        groupId: "batata",
        moduleId: "batata",
      };

      const response = await request(app).post("/users").send(createUser);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a user without module id", async () => {
      const createUser = await prisma.users.create({
        data: {
          email: "alvteste2@email.com",
          name: "alves123",
          password: await hash("alves123", 10),
        },
      });

      await request(app).post("/users").send(createUser);

      const userLogin = await request(app)
        .post("/users/login")
        .send({ email: "alvteste2@email.com", password: "alves123" });

      const userToken = `Bearer ${userLogin.body.token}`;

      const userGroup = await request(app)
        .post("/groups")
        .set("Authorization", userToken)
        .send({ modulePrefixName: "M??dulo", sprintPrefixName: "sprint" });

      const createUserRequest = {
        name: "alves",
        email: "alv7teste@email.com",
        password: "alves123",
        groupId: userGroup.body.id,
      };

      const response = await request(app)
        .post("/users")
        .send(createUserRequest);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a user with invalid module id", async () => {
      await prisma.users.create({
        data: {
          email: "alvteste3@email.com",
          name: "alves123",
          password: hashSync("alves123", 10),
          role: "ADM",
        },
      });

      const userLogin = await request(app)
        .post("/users/login")
        .send({ email: "alvteste3@email.com", password: "alves123" });

      const userToken = `Bearer ${userLogin.body.token}`;

      const userGroup = await request(app)
        .post("/groups")
        .send({ modulePrefixName: "M??dulo", sprintPrefixName: "sprint" })
        .set("Authorization", userToken);

      const createUserRequest = {
        name: "alves",
        email: "alv7teste@email.com",
        password: "alves123",
        groupId: userGroup.body.id,
        moduleId: "batata",
      };

      const response = await request(app)
        .post("/users")
        .send(createUserRequest);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a user with same email", async () => {
      await prisma.users.create({
        data: {
          email: "alvteste4@email.com",
          name: "alves123",
          password: await hash("alves123", 10),
          role: "ADM",
        },
      });

      const userLogin = await request(app)
        .post("/users/login")
        .send({ email: "alvteste4@email.com", password: "alves123" });

      const userToken = `Bearer ${userLogin.body.token}`;

      const userGroup = await request(app)
        .post("/groups")
        .set("Authorization", userToken)
        .send({ modulePrefixName: "M??dulo", sprintPrefixName: "sprint" });

      const createUserRequest = {
        name: "alves",
        email: "alv4teste@email.com",
        password: "alves123",
        groupId: userGroup.body.id,
        moduleId: userGroup.body.modules[0].id,
      };

      await request(app).post("/users").send(createUserRequest);

      const response = await request(app)
        .post("/users")
        .send(createUserRequest);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message");
    });

    test("should be able to create a user", async () => {
      await prisma.users.create({
        data: {
          email: "alvteste5@email.com",
          name: "alves123",
          password: await hash("alves123", 10),
          role: "ADM",
        },
      });

      const userLogin = await request(app)
        .post("/users/login")
        .send({ email: "alvteste5@email.com", password: "alves123" });

      const userToken = `Bearer ${userLogin.body.token}`;

      const userGroup = await request(app)
        .post("/groups")
        .set("Authorization", userToken)
        .send({ modulePrefixName: "M??dulo", sprintPrefixName: "sprint" });

      const createUserRequest = {
        name: "alves",
        email: "alvteste6@email.com",
        password: "alves123",
        groupId: userGroup.body.id,
        moduleId: userGroup.body.modules[0].id,
      };

      const response = await request(app)
        .post("/users")
        .send(createUserRequest);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body).not.toHaveProperty("password");
      expect(response.body).toHaveProperty("role");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
      expect(response.body).toHaveProperty("groupId");
      expect(response.body).toHaveProperty("modules");
      expect(response.body.modules[0].userId).toEqual(response.body.id);
    });
  });

  describe("POST / Login User", () => {
    test("should be able to login", async () => {
      await prisma.users.create({
        data: {
          email: "alvteste7@email.com",
          name: "alves123",
          password: await hash("alves123", 10),
        },
      });

      const response = await request(app)
        .post("/users/login")
        .send({ email: "alvteste7@email.com", password: "alves123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("should not be able to login with wrong password", async () => {
      await prisma.users.create({
        data: {
          email: "alvteste9@email.com",
          name: "alves123",
          password: await hash("alves123", 10),
        },
      });

      const response = await request(app)
        .post("/users/login")
        .send({ email: "alvteste9@email.com", password: "errado" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });

    test("should be able to return error when logging in without email and password", async () => {
      const usernameWithoutPasswordAndEmail = {
        email: "",
        password: "",
      };

      const response = await request(app)
        .post("/users/login")
        .send(usernameWithoutPasswordAndEmail);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET / Profile User", () => {
    test("should not be able to return all user data without token", async () => {
      const response = await request(app).get("/users/profile");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to return all user data with invalid token", async () => {
      const token = "Bearer e7d4hu5sps45ud0uw428is2ujsa";

      const response = await request(app)
        .get("/users/profile")
        .set("Authorization", token);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should be able to return all user data", async () => {
      const createGroupRequest = {
        modulePrefixName: "M??dulo",
        sprintPrefixName: "sprint",
      };

      const userGroup = await request(app)
        .post("/groups")
        .set("Authorization", authorization)
        .send(createGroupRequest);

      const video = await prisma.videos.create({
        data: {
          title: "Bem vindo ao M4",
          releaseDate: new Date(),
          url: "youtube.com",
          sprintId: userGroup.body.modules[0].sprints[0].id,
        },
      });

      await prisma.video_markers.createMany({
        data: {
          time: "00:30",
          title: "Introdu????o ao node",
          videoId: video.id,
        },
      });

      await prisma.sprints.findUnique({
        where: {
          id: userGroup.body.modules[0].sprints[0].id,
        },
        include: {
          videos: {
            include: {
              video_markers: true,
            },
          },
        },
      });

      const createUserRequest = {
        name: "alves",
        email: "alvesteste12@email.com",
        password: "alves123",
        groupId: userGroup.body.id,
        moduleId: userGroup.body.modules[0].id,
      };

      await request(app).post("/users").send(createUserRequest);

      const loginRequest = {
        email: "alvesteste12@email.com",
        password: "alves123",
      };

      const login = await request(app).post("/users/login").send(loginRequest);
      const token = `Bearer ${login.body.token}`;

      const response = await request(app)
        .get("/users/profile")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body).not.toHaveProperty("password");
      expect(response.body).toHaveProperty("role");
      expect(response.body).toHaveProperty("groupId");
      expect(response.body).toHaveProperty("modules");

      expect(response.body.modules[0]).toHaveProperty("createdAt");
      expect(response.body.modules[0]).toHaveProperty("updatedAt");
      expect(response.body.modules[0]).toHaveProperty("userId");
      expect(response.body.modules[0].userId).toEqual(response.body.id);
      expect(response.body.modules[0]).toHaveProperty("moduleId");
      expect(response.body.modules[0]).toHaveProperty("module");

      expect(response.body.modules[0].module).toHaveProperty("id");
      expect(response.body.modules[0].module).toHaveProperty("name");
      expect(response.body.modules[0].module).toHaveProperty("createdAt");
      expect(response.body.modules[0].module).toHaveProperty("groupId");
      expect(response.body.modules[0].module.groupId).toEqual(
        response.body.groupId
      );
      expect(response.body.modules[0].module).toHaveProperty("sprints");

      expect(response.body.modules[0].module.sprints[0]).toHaveProperty("id");
      expect(response.body.modules[0].module.sprints[0]).toHaveProperty("name");
      expect(response.body.modules[0].module.sprints[0]).toHaveProperty(
        "moduleId"
      );
      expect(response.body.modules[0].module.sprints[0]).toHaveProperty(
        "videos"
      );

      expect(response.body.modules[0].module.sprints[0].videos.length).toEqual(
        1
      );
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("id");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("title");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("url");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("releaseDate");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("createdAt");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("updatedAt");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("sprintId");
      expect(
        response.body.modules[0].module.sprints[0].videos[0]
      ).toHaveProperty("video_markers");

      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers
          .length
      ).toEqual(1);

      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers
          .length
      ).toEqual(1);
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("id");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("time");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("title");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("createdAt");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("updatedAt");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
      ).toHaveProperty("videoId");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
          .time
      ).toEqual("00:30");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
          .title
      ).toEqual("Introdu????o ao node");
      expect(
        response.body.modules[0].module.sprints[0].videos[0].video_markers[0]
          .videoId
      ).toEqual(response.body.modules[0].module.sprints[0].videos[0].id);
    });
  });

  describe("GET / List users", () => {
    test("should not be able to list all users without token", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to list all users with invalid token", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", "Bearer batata");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to list all users without adm token", async () => {
      const login = await request(app)
        .post("/users/login")
        .send(studentUserMock);

      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${login.body.token}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should be able to list all users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", authorization);

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("email");
      expect(response.body[0]).not.toHaveProperty("password");
      expect(response.body[0]).toHaveProperty("role");
      expect(response.body[0]).toHaveProperty("createdAt");
      expect(response.body[0]).toHaveProperty("updatedAt");
      expect(response.body[0]).toHaveProperty("groupId");
    });
  });

  describe("GET / List user by id", () => {
    test("should be able to find user", async () => {
      const group = await request(app)
        .post("/groups")
        .send(validGroupMock)
        .set("Authorization", authorization);

      studentUserMock.groupId = group.body.id;
      studentUserMock.moduleId = group.body.modules[0].id;

      const studentUser = await request(app)
        .post("/users")
        .send(studentUserMock);

      const { id, groupId, email, name, role, createdAt, updatedAt } =
        studentUser.body;

      const response = await request(app)
        .get(`/users/${id}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", id);
      expect(response.body).toHaveProperty("groupId", groupId);
      expect(response.body).toHaveProperty("email", email);
      expect(response.body).toHaveProperty("name", name);
      expect(response.body).not.toHaveProperty("password");
      expect(response.body).toHaveProperty("role", role);
      expect(response.body).toHaveProperty("createdAt", createdAt);
      expect(response.body).toHaveProperty("updatedAt", updatedAt);
    });

    test("should not be able to find a user without token", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app).get(`/users/${id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to find a user with invalid token", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app)
        .get(`/users/${id}`)
        .set("Authorization", "Bearer batata");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to find a user without adm permission", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app)
        .get(`/users/${id}`)
        .set("Authorization", studentAuth);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to find a user with invalid id", async () => {
      const response = await request(app)
        .get("/users/batata")
        .set("Authorization", authorization);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE / Delete User", () => {
    test("should not be able to delete a user without token", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app).delete(`/users/${id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to delete a user with invalid token", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app)
        .delete(`/users/${id}`)
        .set("Authorization", "Bearer batata");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to delete a user without adm permission", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app)
        .delete(`/users/${id}`)
        .set("Authorization", studentAuth);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
    });

    test("should not be able to delete a user with invalid id", async () => {
      const response = await request(app)
        .delete("/users/batata")
        .set("Authorization", authorization);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
    });

    test("should be able to delete a user", async () => {
      const loginStudent = await request(app)
        .post("/users/login")
        .send(loginStudentMock);

      const studentAuth = `Bearer ${loginStudent.body.token}`;

      const studentProfile = await request(app)
        .get("/users/profile")
        .set("Authorization", studentAuth);

      const { id } = studentProfile.body;

      const response = await request(app)
        .delete(`/users/${id}`)
        .set("Authorization", authorization);

      expect(response.status).toBe(204);
      expect(response.body).toMatchObject({});
    });
  });

  describe("PATCH / Update User by id", () => {
    test("should be able to update a user by id", async () => {
      const loginStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = loginStudent.body.id;

      const createGroup2 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const groupId2 = createGroup2.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", authorization)
        .send({
          groupId: groupId2,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("email");
      expect(res.body).not.toHaveProperty("password");
      expect(res.body).toHaveProperty("role");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
      expect(res.body).toHaveProperty("groupId");
    });

    test("should not be able to update a user by id without token", async () => {
      const loginStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = loginStudent.body.id;

      const createGroup2 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const moduleId2 = createGroup2.body.modules[0].id;

      const res = await request(app).patch(`/users/${idStudent}`).send({
        groupId: moduleId2,
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update a user by id with the current groupId", async () => {
      const createGroup1 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const groupId1 = createGroup1.body.id;

      const loginStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = loginStudent.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", authorization)
        .send({
          groupId: groupId1,
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update a user by id with invalid groupId", async () => {
      const loginStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = loginStudent.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", authorization)
        .send({
          groupId: "babsladgadgagd??ahd??ao",
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update a user by id with invalid id", async () => {
      const createGroup2 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const groupId2 = createGroup2.body.id;

      const res = await request(app)
        .patch(`/users/??aljda??jdapjdajd`)
        .set("Authorization", authorization)
        .send({
          groupId: groupId2,
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update a user by id without data in the request body", async () => {
      const createStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = createStudent.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", authorization)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update a user by id without providing the correct key(groupId) in the request", async () => {
      const createStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = createStudent.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", authorization)
        .send({
          banana: "banana",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update user by id with invalid token", async () => {
      const createStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = createStudent.body.id;

      const createGroup2 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const groupId2 = createGroup2.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", `Bearer batata`)
        .send({
          groupId: groupId2,
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    test("should not be able to update user by id without adm permission", async () => {
      const createStudent = await request(app)
        .post("/users")
        .send(studentUserMock);

      const idStudent = createStudent.body.id;

      const loginStudent = await request(app)
        .post("/users/login")
        .send(studentUserMock);

      const createGroup2 = await request(app)
        .post("/groups")
        .set("Authorization", authorization);

      const groupId2 = createGroup2.body.id;

      const res = await request(app)
        .patch(`/users/${idStudent}`)
        .set("Authorization", `Bearer ${loginStudent.body.token}`)
        .send({
          groupId: groupId2,
        });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
