"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../errors/AppError");
const verifyTokenMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError_1.AppError("Missing authorization", 401);
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        throw new AppError_1.AppError("Missing token", 401);
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, undefined, (err, decoded) => {
        if (err) {
            throw new AppError_1.AppError("Invalid or expired token", 401);
        }
        req.user = {
            groupId: decoded === null || decoded === void 0 ? void 0 : decoded.groupId,
            id: decoded === null || decoded === void 0 ? void 0 : decoded.sub,
            role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
        };
    });
    return next();
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
