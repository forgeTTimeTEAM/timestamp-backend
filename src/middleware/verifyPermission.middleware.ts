import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

const verifyPermissionMiddleware = ( rolePermission: string ): RequestHandler => (req, res, next) => {
  const { role } = req.user;

  if (role !== rolePermission) {
    throw new AppError("Unauthorizedd", 401);
  }

  return next();
};

export { verifyPermissionMiddleware };
