"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileService = void 0;
const prisma_1 = require("../../prisma");
const removeObjectProperty_1 = require("../../utils/removeObjectProperty");
const getUserProfileService = async (id) => {
    const videos = {
        include: {
            video_markers: true,
        },
    };
    const sprints = {
        include: {
            videos,
        },
    };
    const module = {
        include: {
            sprints,
        },
    };
    const user = await prisma_1.prisma.users.findUnique({
        where: { id },
        include: {
            modules: {
                include: {
                    module,
                },
            },
            group: true,
        },
    });
    return (0, removeObjectProperty_1.removeObjectProperty)(user, "password");
};
exports.getUserProfileService = getUserProfileService;
