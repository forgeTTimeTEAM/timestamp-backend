"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsersByGroupService = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../prisma");
const findUsersByGroupService = async (groupId) => {
    const groupExists = await prisma_1.prisma.groups.findFirst({
        where: {
            id: groupId,
        },
    });
    if (!groupExists) {
        throw new AppError_1.AppError("Group not found", 404);
    }
    const data = await prisma_1.prisma.groups.findMany({
        where: {
            id: groupId,
        },
        include: {
            users: true,
        },
    });
    return data;
};
exports.findUsersByGroupService = findUsersByGroupService;
