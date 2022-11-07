"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../errors/AppError");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`,
    });
};
exports.errorMiddleware = errorMiddleware;
