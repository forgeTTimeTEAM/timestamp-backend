import { Router } from "express";
import {
  createVideoController,
  deleteVideoController,
} from "../controllers/videos";

import {
  verifyAdmPermissionMiddleware,
  verifyTokenMiddleware,
} from "../middleware";

const videosRouter = Router();

videosRouter.post("/", verifyTokenMiddleware, createVideoController);
videosRouter.delete("/:id", verifyTokenMiddleware, deleteVideoController);

export { videosRouter };