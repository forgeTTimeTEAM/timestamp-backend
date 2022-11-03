import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

interface IDecoded extends JwtPayload {
  role?: "STUDENT" | "ADM" | "INSTRUCTOR";
  groupId?: string;
}

const verifyTokenMiddleware: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Missing authorization", 401);
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new AppError("Missing token", 401);
  }

  jwt.verify(
    token,
    process.env.SECRET_KEY!,
    undefined!,
    (err, decoded?: IDecoded) => {
      if (err) {
        throw new AppError("Invalid or expired token", 401);
      }

      req.user = {
        groupId: decoded?.groupId,
        id: decoded?.sub!,
        role: decoded?.role!,
      };
    }
  );

  return next();
};

export { verifyTokenMiddleware };
