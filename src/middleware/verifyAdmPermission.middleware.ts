import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

const verifyAdmPermissionMiddleware: RequestHandler = (req, res, next) => {
  const { role } = req.user;

  if (role !== "ADM") {
    throw new AppError("Unauthorized", 401);
  }

  return next();
};

export { verifyAdmPermissionMiddleware };
