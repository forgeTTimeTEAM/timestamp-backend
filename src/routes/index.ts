import { Router } from "express";
import { errorMiddleware } from "../middleware/errors.middleware";
import { usersRouter } from "./users.routes";

const router = Router();

router.use("/users", usersRouter);
router.use(errorMiddleware);

export { router };
