import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

const verifyInstructorOrAdmPermissionMiddleware: RequestHandler = (
  req,
  res,
  next
) => {
  const { role } = req.user;

  if (role === "STUDENT") {
    throw new AppError("Unauthorized", 403);
  }

  return next();
};

export { verifyInstructorOrAdmPermissionMiddleware };
