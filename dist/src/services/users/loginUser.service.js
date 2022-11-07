"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../../prisma");
const AppError_1 = require("../../errors/AppError");
const loginUserService = async ({ email, password }) => {
    if (email.length === 0 || password.length === 0)
        throw new AppError_1.AppError("Wrong email/password.", 403);
    const user = await prisma_1.prisma.users.findUnique({
        where: { email },
    });
    if (!user) {
        throw new AppError_1.AppError("User not registered.", 404);
    }
    const matchPassword = await (0, bcryptjs_1.compare)(password, user.password);
    if (!matchPassword) {
        throw new AppError_1.AppError("Wrong email/password.", 403);
    }
    return jsonwebtoken_1.default.sign({ role: user.role, groupId: user.groupId }, process.env.SECRET_KEY, { expiresIn: "24h", subject: user.id });
};
exports.loginUserService = loginUserService;
