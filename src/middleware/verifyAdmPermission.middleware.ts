import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

const verifyAdmPermissionMiddleware: RequestHandler = (req, res, next) => {
  const { role } = req.user;

  if (role !== "ADM") {
    throw new AppError("Access denied", 403);
  }

  return next();
};

export { verifyAdmPermissionMiddleware };
