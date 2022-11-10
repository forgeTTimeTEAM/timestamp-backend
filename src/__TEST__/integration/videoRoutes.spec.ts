import request from "supertest";
import { prisma } from "../../prisma";
import { app } from "../../app";
import {
    validVideoMock,
    videoWithoutTitleMock,
    videoWithoutReleaseDateMock,
    videoWithInvalidSprintMock,
    videoWithoutSprintMock,
    validVideoMock2,
    updateVideoMock,
} from "../mocks/videos.mock";
import {
    admUserMock,
    instructorUserMock,
    admLoginMock,
    loginInstructorMock,
    loginStudentMock,
    studentUserMock,
    validGroupMock,
} from "../mocks";

describe("routes - /videos", () => {
    let authorization: string;
    let instructorAuthorization: string;
    let studentAuthorization: string;
    let createdVideoId: string;

    beforeAll(async () => {
        await prisma.users.create({
            data: admUserMock,
        });

        const loginAdm = await request(app)
            .post("/users/login")
            .send(admLoginMock);
        authorization = `Bearer ${loginAdm.body.token}`;

        await prisma.users.create({
            data: instructorUserMock,
        });

        const loginInstructor = await request(app)
            .post("/users/login")
            .send(loginInstructorMock);
        instructorAuthorization = `Bearer ${loginInstructor.body.token}`;
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

    test("should be able to create a video", async () => {
        const group = await request(app)
            .post("/groups")
            .send(validGroupMock)
            .set("Authorization", authorization);

        validVideoMock.sprintId = group.body.modules[0].sprints[0].id;
        updateVideoMock.sprintId = group.body.modules[0].sprints[0].id;

        const response = await request(app)
            .post("/videos")
            .send(validVideoMock)
            .set("Authorization", authorization);

        createdVideoId = response.body.id;

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("title", validVideoMock.title);
        expect(response.body).toHaveProperty("url");
        expect(response.body).toHaveProperty("releaseDate");
        expect(response.body).toHaveProperty(
            "sprintId",
            validVideoMock.sprintId
        );
    });

    test("should not be able to create a video without token", async () => {
        const response = await request(app).post("/videos");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should no be able to create a video with invalid/expired token", async () => {
        const response = await request(app)
            .post("/videos")
            .set("Authorization", "Bearer batata");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video without adm/instructor permission", async () => {
        const group = await request(app)
            .post("/groups")
            .send(validGroupMock)
            .set("Authorization", authorization);

        studentUserMock.groupId = group.body.id;
        studentUserMock.moduleId = group.body.modules[0].id;
        await request(app).post("/users").send(studentUserMock);

        const loginStudent = await request(app)
            .post("/users/login")
            .send(loginStudentMock);
        studentAuthorization = `Bearer ${loginStudent.body.token}`;

        const response = await request(app)
            .post("/videos")
            .set("Authorization", studentAuthorization);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video when instructor don't have this module", async () => {
        const group2 = await request(app)
            .post("/groups")
            .send(validGroupMock)
            .set("Authorization", authorization);

        validVideoMock2.sprintId = group2.body.modules[0].sprints[0].id;

        const response = await request(app)
            .post("/videos")
            .send(validVideoMock2)
            .set("Authorization", instructorAuthorization);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video without title", async () => {
        const response = await request(app)
            .post("/videos")
            .send(videoWithoutTitleMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video without release date", async () => {
        const response = await request(app)
            .post("/videos")
            .send(videoWithoutReleaseDateMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video without sprintId", async () => {
        validVideoMock.sprintId = "";
        const response = await request(app)
            .post("/videos")
            .send(videoWithoutSprintMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video with invalid sprintId", async () => {
        const response = await request(app)
            .post("/videos")
            .send(videoWithInvalidSprintMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to create a video without token", async () => {
        const response = await request(app).delete(`/videos/${createdVideoId}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should no be able to create a video with invalid/expired token", async () => {
        const response = await request(app)
            .delete(`/videos/${createdVideoId}`)
            .set("Authorization", "Bearer batata");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should be able to update a video", async () => {
        const response = await request(app)
            .patch(`/videos/${createdVideoId}`)
            .send(updateVideoMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("title", updateVideoMock.title);
        expect(response.body).toHaveProperty("url");
    });

    test("should not be able to update a video without adm/instructor permission", async () => {
        const response = await request(app)
            .patch(`/videos/${createdVideoId}`)
            .set("Authorization", studentAuthorization);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to update a video when instructor don't have this module", async () => {
        const response = await request(app)
            .patch(`/videos/${createdVideoId}`)
            .send(validVideoMock2)
            .set("Authorization", instructorAuthorization);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to update a video url with and invalid video id", async () => {
        const response = await request(app)
            .patch("/videos/batata")
            .set("Authorization", studentAuthorization);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    });

    test("should be able to delete a video url", async () => {
        const response = await request(app)
            .delete(`/videos/${createdVideoId}`)
            .send(validVideoMock)
            .set("Authorization", authorization);

        expect(response.status).toBe(204);
    });

    test("should not be able to delete a video url without adm/instructor permission", async () => {
        const response = await request(app)
            .delete(`/videos/${createdVideoId}`)
            .set("Authorization", studentAuthorization);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to delete a video when instructor don't have this module", async () => {
        const response = await request(app)
            .delete(`/videos/${createdVideoId}`)
            .set("Authorization", instructorAuthorization);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message");
    });

    test("should not be able to delete a video url with and invalid video id", async () => {
        const response = await request(app)
            .delete("/videos/batata")
            .set("Authorization", studentAuthorization);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message");
    });
});
