import { RequestHandler } from "express";
import { AnySchema, ValidationError } from "yup";
import { AppError } from "../errors/AppError";

const validateSchemaMiddleware =
  (schema: AnySchema): RequestHandler =>
  async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.body = validatedBody;

      return next();
    } catch (error) {
      if (error instanceof ValidationError) {
        const { errors, name } = error;
        throw new AppError(errors, 400);
      }

      throw error;
    }
  };

export { validateSchemaMiddleware };
