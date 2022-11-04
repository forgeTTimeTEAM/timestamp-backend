import { Router } from "express";
import { errorMiddleware } from "../middleware/errors.middleware";
import { groupsRouter } from "./groups.routes";
import { usersRouter } from "./users.routes";
import { videosRouter } from "./videos.routes";

const router = Router();

router.use("/users", usersRouter);
router.use("/groups", groupsRouter);
router.use("/videos", videosRouter);
router.use(errorMiddleware);

export { router };
