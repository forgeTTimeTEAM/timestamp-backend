"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmPermissionMiddleware = void 0;
const AppError_1 = require("../errors/AppError");
const verifyAdmPermissionMiddleware = (req, res, next) => {
    const { role } = req.user;
    if (role !== "ADM") {
        throw new AppError_1.AppError("Unauthorized", 403);
    }
    return next();
};
exports.verifyAdmPermissionMiddleware = verifyAdmPermissionMiddleware;
