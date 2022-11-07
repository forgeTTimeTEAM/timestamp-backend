"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMarkers = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../prisma");
const createMarkers = async ({ marks, groupId, videoId, }) => {
    if (!marks[0].videoId) {
        throw new AppError_1.AppError("video should be send");
    }
    marks.map((marks) => {
        if (marks.title === undefined) {
            throw new AppError_1.AppError("title should be provided");
        }
    });
    marks.map((marks) => {
        if (marks.videoId !== videoId) {
            throw new AppError_1.AppError("this video needed to equal marks video");
        }
    });
    const videoExists = await prisma_1.prisma.videos.findFirst({
        where: {
            id: marks[0].videoId,
        },
        include: {
            sprint: {
                include: {
                    module: {
                        include: {
                            group: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            },
            video_markers: true,
        },
    });
    if (!videoExists) {
        throw new AppError_1.AppError("video not found", 404);
    }
    if (videoExists.sprint.module.group.id !== groupId) {
        throw new AppError_1.AppError("must be an instructor in this module to add marks", 401);
    }
    const timeValidate = /(^(0\d)|(1\d|2[0-3]):[0-5]\d:[0-5]\d$)/;
    marks.map((marker) => {
        if (timeValidate.test(marker.time)) {
            throw new AppError_1.AppError("time not validate");
        }
    });
    const timeExists = videoExists.video_markers.map((marker) => {
        marks.map((markReq) => {
            markReq.time.includes(marker.time);
        });
    });
    if (timeExists.length > 0) {
        throw new AppError_1.AppError("timer already exists");
    }
    try {
        const created = await prisma_1.prisma.video_markers.createMany({
            data: marks,
        });
        return created;
    }
    catch (err) {
        throw new AppError_1.AppError(err);
    }
};
exports.createMarkers = createMarkers;
