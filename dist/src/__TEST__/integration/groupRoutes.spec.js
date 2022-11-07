"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = require("../../prisma");
const app_1 = require("../../app");
const mocks_1 = require("../mocks");
describe("POST /groups", () => {
    let authorization;
    beforeAll(async () => {
        await prisma_1.prisma.users.create({
            data: mocks_1.userAdmMock,
        });
        const loginAdm = await (0, supertest_1.default)(app_1.app).post("/users/login").send(mocks_1.loginAdmMock);
        authorization = `Bearer ${loginAdm.body.token}`;
    });
    afterAll(async () => {
        await prisma_1.prisma.video_markers.deleteMany();
        await prisma_1.prisma.videos.deleteMany();
        await prisma_1.prisma.sprints.deleteMany();
        await prisma_1.prisma.users_modules.deleteMany();
        await prisma_1.prisma.modules.deleteMany();
        await prisma_1.prisma.users.deleteMany();
        await prisma_1.prisma.groups.deleteMany();
    });
    test("should be able to create group", async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post("/groups")
            .send(mocks_1.validGroupMock)
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
            const response = await (0, supertest_1.default)(app_1.app).post("/groups").send(mocks_1.validGroupMock);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message");
        });
        test("without adm permission", async () => {
            const group = await prisma_1.prisma.groups.findFirst({
                include: {
                    modules: true,
                },
            });
            mocks_1.userStudentMock.groupId = group.id;
            mocks_1.userStudentMock.moduleId = group.modules[0].id;
            await (0, supertest_1.default)(app_1.app).post("/users").send(mocks_1.userStudentMock);
            const loginStudent = await (0, supertest_1.default)(app_1.app)
                .post("/users/login")
                .send(mocks_1.loginStudentMock);
            const authorization = `Bearer ${loginStudent.body.token}`;
            const response = await (0, supertest_1.default)(app_1.app)
                .post("/groups")
                .send(mocks_1.validGroupMock)
                .set("Authorization", authorization);
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message");
        });
    });
});
