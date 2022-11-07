"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoService = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../prisma");
const deleteVideoService = async (id) => {
    const videoExists = await prisma_1.prisma.videos.findFirst({
        where: {
            id,
        },
    });
    if (!videoExists) {
        throw new AppError_1.AppError("Video not found", 404);
    }
    await prisma_1.prisma.videos.update({
        where: {
            id,
        },
        data: {
            url: null,
        },
    });
};
exports.deleteVideoService = deleteVideoService;
