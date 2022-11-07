"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../prisma");
const removeObjectProperty_1 = require("../../utils/removeObjectProperty");
const createUserService = async ({ name, email, password, groupId, moduleId, }) => {
    if (!name) {
        throw new AppError_1.AppError("You must provide a name");
    }
    if (!email) {
        throw new AppError_1.AppError("You must provide a email");
    }
    if (!password) {
        throw new AppError_1.AppError("You must provide a password");
    }
    if (!groupId) {
        throw new AppError_1.AppError("You must provide a group id");
    }
    if (!moduleId) {
        throw new AppError_1.AppError("You must provide a module id");
    }
    const groupExists = await prisma_1.prisma.groups.findFirst({
        where: {
            id: groupId,
        },
    });
    if (!groupExists) {
        throw new AppError_1.AppError("Group not found", 404);
    }
    const moduleExists = await prisma_1.prisma.modules.findFirst({
        where: {
            id: moduleId,
        },
    });
    if (!moduleExists) {
        throw new AppError_1.AppError("Module not found", 404);
    }
    const userExists = await prisma_1.prisma.users.findFirst({
        where: {
            email,
        },
    });
    if (userExists) {
        throw new AppError_1.AppError("Email is already in use", 409);
    }
    const createdUser = await prisma_1.prisma.users.create({
        include: {
            modules: true,
        },
        data: {
            email,
            name,
            password: await (0, bcryptjs_1.hash)(password, 10),
            groupId,
            modules: {
                create: {
                    moduleId,
                },
            },
        },
    });
    (0, removeObjectProperty_1.removeObjectProperty)(createdUser, "password");
    return createdUser;
};
exports.createUserService = createUserService;
