import { Router } from "express";
import { errorMiddleware } from "../middleware/errors.middleware";
import { groupsRouter } from "./groups.routes";
import { modulesRouter } from "./modules.routes";
import { usersRouter } from "./users.routes";
import { videosRouter } from "./videos.routes";
import { markers } from "./markers.routes";

const router = Router();

router.use("/users", usersRouter);
router.use("/groups", groupsRouter);
router.use("/modules", modulesRouter);
router.use("/videos", videosRouter);
router.use(errorMiddleware);

export { router };
