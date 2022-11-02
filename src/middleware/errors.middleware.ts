import { ErrorRequestHandler } from "express";

import { AppError } from "../errors/AppError";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
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

export { errorMiddleware };
