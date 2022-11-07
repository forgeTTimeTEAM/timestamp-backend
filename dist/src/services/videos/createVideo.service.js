"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoService = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../prisma");
const createVideoService = async (groupId, { title, url = null, releaseDate, sprintId }) => {
    if (!sprintId) {
        throw new AppError_1.AppError("Sprint id needed", 400);
    }
    const sprintExists = await prisma_1.prisma.sprints.findFirst({
        where: {
            id: sprintId,
        },
    });
    if (!sprintExists) {
        throw new AppError_1.AppError("Sprint not found", 404);
    }
    const findInstructor = prisma_1.prisma.groups.findUnique({
        where: {
            id: groupId,
        },
        include: {
            modules: {
                include: {
                    sprints: {
                        where: {
                            id: sprintId,
                        },
                    },
                },
            },
        },
    });
    if (!findInstructor) {
        throw new AppError_1.AppError("Instructor not allowed", 401);
    }
    if (url) {
        const videoExists = await prisma_1.prisma.videos.findFirst({
            where: {
                url,
            },
        });
        if (videoExists) {
            throw new AppError_1.AppError("This video already exists");
        }
    }
    const createdVideo = await prisma_1.prisma.videos.create({
        select: {
            title: true,
            url: true,
            releaseDate: true,
            sprintId: true,
            createdAt: true,
            updatedAt: true,
        },
        data: {
            title,
            releaseDate,
            url: url || null,
            sprintId,
        },
    });
    return createdVideo;
};
exports.createVideoService = createVideoService;
