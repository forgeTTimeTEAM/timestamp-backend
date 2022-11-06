import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { Role } from "../interfaces/users";

const verifyPermissionMiddleware =
  (rolePermission: Role): RequestHandler =>
  (req, res, next) => {
    const { role } = req.user;

    if (role !== rolePermission) {
      throw new AppError("Unauthorizedd", 401);
    }

    return next();
  };

export { verifyPermissionMiddleware };
